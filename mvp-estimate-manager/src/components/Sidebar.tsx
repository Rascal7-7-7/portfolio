"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon, { type IconName } from "@/components/Icon";
import { useEstimates } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV_ITEMS: { href: string; icon: IconName; label: string }[] = [
  { href: "/estimates", icon: "file", label: "見積一覧" },
  { href: "/estimates/new", icon: "plus", label: "新規見積" },
];

function useIsActive() {
  const pathname = usePathname();
  return (href: string) =>
    href === "/estimates"
      ? pathname === "/estimates" || /^\/estimates\/\d+/.test(pathname)
      : pathname.startsWith(href);
}

export default function Sidebar() {
  const isActive = useIsActive();
  const { reset } = useEstimates();

  const handleReset = () => {
    if (window.confirm("デモデータを初期状態に戻しますか？作成・変更した見積は消えます。")) reset();
  };

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-white px-4 py-6 md:flex print:hidden">
      <Link href="/estimates" className="mb-8 px-2">
        <p className="text-lg font-bold tracking-tight text-navy">見積マネージャー</p>
        <p className="text-xs text-muted">明細から自動計算・ステータス管理</p>
      </Link>
      <nav aria-label="メイン" className="space-y-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive(item.href) ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive(item.href)
                ? "bg-primary-soft text-primary"
                : "text-body hover:bg-canvas hover:text-navy",
            )}
          >
            <Icon name={item.icon} />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto space-y-3 border-t border-line px-2 pt-4">
        <p className="text-xs leading-relaxed text-muted">
          デモ版：データはこのブラウザ内にだけ保存されます（送信・外部通信なし）。
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-navy"
        >
          <Icon name="reset" className="h-3.5 w-3.5" />
          デモデータに戻す
        </button>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const isActive = useIsActive();
  return (
    <nav
      aria-label="メイン"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden print:hidden"
    >
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive(item.href) ? "page" : undefined}
          className={cn(
            "flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-semibold",
            isActive(item.href) ? "text-primary" : "text-muted",
          )}
        >
          <Icon name={item.icon} className="h-5 w-5" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
