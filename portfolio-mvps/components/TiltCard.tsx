"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** 傾きの最大角度（度）。大きくすると画面写真の文字が読みにくくなる */
const MAX_TILT = 7;

/**
 * 画面写真を、マウスの位置に合わせて立体的に傾ける枠。
 * 再描画を避けるため style を直接書き換える。動きを減らす設定やタッチ操作では傾けない。
 */
export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * MAX_TILT}deg) rotateY(${x * MAX_TILT}deg) translateZ(0)`;
    el.style.setProperty("--glare-x", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--glare-y", `${(y + 0.5) * 100}%`);
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn("tilt-card relative transition-transform duration-300 ease-out", className)}
    >
      {children}
    </div>
  );
}
