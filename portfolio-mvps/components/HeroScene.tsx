"use client";

import { useEffect, useRef, useState } from "react";
import type { HeroScene as Scene } from "@/lib/heroScene";
import { cn } from "@/lib/cn";

/**
 * トップの 3D を載せる canvas。three.js は表示後に読み込み、最初の表示を遅らせない。
 * - WebGL が使えない環境では何も描かず、背後の光（CSS）だけが残る
 * - 動きを減らす設定の利用者には静止画を 1 枚だけ描く
 * - 画面外やタブが裏にあるあいだは描画を止める
 */
export function HeroScene({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    let scene: Scene | null = null;
    let cancelled = false;
    const cleanups: (() => void)[] = [];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    (async () => {
      const [T, { createHeroScene }] = await Promise.all([
        import("three"),
        import("@/lib/heroScene"),
      ]);
      if (cancelled) return;
      try {
        scene = createHeroScene(T, canvas);
      } catch {
        // WebGL を作れない環境。3D は諦め、CSS の光だけを見せる
        return;
      }
      const s = scene;

      const fit = () => s.resize(wrap.clientWidth, wrap.clientHeight);
      fit();
      const ro = new ResizeObserver(() => {
        fit();
        if (reduced) s.renderStatic();
      });
      ro.observe(wrap);
      cleanups.push(() => ro.disconnect());

      if (reduced) {
        s.renderStatic();
        setReady(true);
        return;
      }

      let visible = true;
      const sync = () => (visible && !document.hidden ? s.start() : s.stop());
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        sync();
      });
      io.observe(wrap);
      document.addEventListener("visibilitychange", sync);

      const onPointer = (e: PointerEvent) => {
        s.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
      };
      window.addEventListener("pointermove", onPointer, { passive: true });

      cleanups.push(
        () => io.disconnect(),
        () => document.removeEventListener("visibilitychange", sync),
        () => window.removeEventListener("pointermove", onPointer),
      );
      sync();
      setReady(true);
    })().catch(() => {
      // three.js の読み込みに失敗した場合も、3D なしで表示を続ける
    });

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
      scene?.dispose();
    };
  }, []);

  return (
    // 下端を地の色へ溶かし、見出しの上を粒が横切らないようにする
    <div ref={wrapRef} aria-hidden="true" className={cn("hero-fade pointer-events-none", className)}>
      <canvas
        ref={canvasRef}
        className={cn(
          "block h-full w-full transition-opacity duration-1000",
          ready ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
