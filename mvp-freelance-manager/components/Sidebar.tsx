"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderKanban, LayoutDashboard, ListChecks, Receipt, RotateCcw } from "lucide-react";
import { actions } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "ダッシュボード", short: "ホーム", icon: LayoutDashboard },
  { href: "/projects", label: "案件", short: "案件", icon: FolderKanban },
  { href: "/tasks", label: "タスク", short: "タスク", icon: ListChecks },
  { href: "/invoices", label: "請求・入金", short: "請求", icon: Receipt },
] as const;

function isActive(href: string, pathname: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

const DEMO_NOTE = "デモ版：データはこのブラウザ内にだけ保存されます";

function resetDemo(): void {
  if (window.confirm("操作内容を消して、ダミーデータの状態に戻しますか？")) actions.reset();
}

function Logo() {
  return (
    // 名前の由来「控え」を、帳票の控え印のような小さな枠付きの「控」で添える。画像は使わず文字組みだけで作る
    <Link
      href="/dashboard"
      className="hit inline-flex items-center gap-1.5 rounded text-ink"
      aria-label="Hikae ダッシュボード"
    >
      <span className="text-[18px] leading-none font-bold tracking-[-0.035em]">Hikae</span>
      <span
        aria-hidden
        className="rounded-[3px] border border-current px-[3px] py-[2px] text-[10px] leading-none font-medium text-warm-500"
      >
        控
      </span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* 背景と罫線は外側（ページ全高に伸びる）、中身だけ sticky にして長いページでも背景が途切れない */}
      <aside className="hidden w-60 shrink-0 border-r border-line bg-warm-100 md:block print:hidden">
        <div className="sticky top-0 flex h-screen flex-col">
        <div className="px-5 py-5">
          <Logo />
          <p className="mt-1.5 text-xs text-warm-500">個人事業のバックオフィス</p>
        </div>
        <nav aria-label="メイン" className="flex-1 space-y-0.5 px-3">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href, pathname);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-black/[0.06] font-semibold text-ink"
                    : "text-warm-500 hover:bg-black/[0.04] hover:text-ink",
                )}
              >
                <Icon size={17} aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-line px-5 py-4">
          <p className="text-xs leading-relaxed text-warm-500">{DEMO_NOTE}</p>
          <button
            type="button"
            onClick={resetDemo}
            className="hit mt-1.5 -ml-1 inline-flex items-center gap-1 rounded px-1 py-0.5 text-xs font-medium text-ink hover:bg-black/[0.05]"
          >
            <RotateCcw size={12} aria-hidden />
            デモデータに戻す
          </button>
        </div>
        </div>
      </aside>

      <header className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-y-1 border-b border-line bg-canvas px-4 py-2.5 md:hidden print:hidden">
        <Logo />
        <button
          type="button"
          onClick={resetDemo}
          className="hit inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-warm-500 hover:bg-black/5"
        >
          <RotateCcw size={12} aria-hidden />
          デモデータに戻す
        </button>
        <p className="w-full text-[11px] text-warm-500">{DEMO_NOTE}</p>
      </header>

      <nav
        aria-label="メイン"
        className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-line bg-canvas px-2 pt-1.5 pb-[max(6px,env(safe-area-inset-bottom))] md:hidden print:hidden"
      >
        {NAV_ITEMS.map(({ href, short, icon: Icon }) => {
          const active = isActive(href, pathname);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-md py-1 text-[11px]",
                active ? "font-semibold text-ink" : "text-warm-500",
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.25 : 1.75} className="my-0.5" aria-hidden />
              {short}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
