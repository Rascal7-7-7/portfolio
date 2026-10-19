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

function resetDemo(): void {
  if (window.confirm("操作内容を消して、ダミーデータの状態に戻しますか？")) actions.reset();
}

function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-ink text-xs font-bold text-white">
        F
      </span>
      <span className="text-[15px] font-bold tracking-tight text-ink">FreelanceHub</span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line bg-warm-100 md:flex">
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
        <div className="m-3 rounded-lg border border-line bg-canvas p-3">
          <p className="text-xs font-semibold text-ink">デモ用モックアップ</p>
          <p className="mt-1 text-[11px] leading-relaxed text-warm-500">
            データはダミーです。操作はこのブラウザにだけ保存されます。
          </p>
          <button
            type="button"
            onClick={resetDemo}
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue hover:underline"
          >
            <RotateCcw size={12} aria-hidden />
            初期状態に戻す
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-canvas/90 px-4 py-3 backdrop-blur md:hidden">
        <Logo />
        <button
          type="button"
          onClick={resetDemo}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-warm-500 hover:bg-black/5"
        >
          <RotateCcw size={12} aria-hidden />
          リセット
        </button>
      </header>

      <nav
        aria-label="メイン"
        className="fixed inset-x-0 bottom-0 z-50 flex justify-around border-t border-line bg-canvas/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        {NAV_ITEMS.map(({ href, short, icon: Icon }) => {
          const active = isActive(href, pathname);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-w-16 flex-col items-center gap-0.5 py-2 text-[11px] font-medium",
                active ? "text-blue" : "text-warm-500",
              )}
            >
              <Icon size={20} aria-hidden />
              {short}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
