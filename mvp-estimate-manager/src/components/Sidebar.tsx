"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon, { type IconName } from "@/components/Icon";
import { useEstimates } from "@/lib/store";
import { cn } from "@/lib/utils";

const FOCUS_CLASS = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

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

/** デスクトップはサイドバー下部、スマホはヘッダー右に置く */
export function ResetDemoButton({ className }: { className?: string }) {
  const { reset } = useEstimates();
  const handleReset = () => {
    if (window.confirm("デモデータを初期状態に戻しますか？作成・変更した見積は消えます。")) reset();
  };
  return (
    <button
      type="button"
      onClick={handleReset}
      className={cn("inline-flex items-center gap-1.5 rounded text-xs font-medium text-muted hover:text-navy", FOCUS_CLASS, className)}
    >
      <Icon name="reset" className="h-3.5 w-3.5" />
      デモデータに戻す
    </button>
  );
}

/** favicon（app/icon.svg）と同じ角丸の正方形のマーク。画面と書類の作り手が同じだと分かるようにする */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <rect width="32" height="32" rx="7" fill="#24467a" />
      <path d="M10 8h9l4 4v12H10z" fill="#fff" />
      <path d="M13 15h7M13 18h7M13 21h4" stroke="#24467a" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Sidebar() {
  const isActive = useIsActive();

  return (
    <aside className="sticky top-0 hidden h-screen w-[200px] shrink-0 flex-col border-r border-line bg-white px-4 py-6 md:flex print:hidden">
      <Link href="/estimates" className={cn("mb-8 flex items-center gap-2.5 rounded px-1", FOCUS_CLASS)}>
        <BrandMark className="h-8 w-8 shrink-0" />
        <span className="min-w-0">
          <span className="block text-[15px] font-bold leading-tight tracking-tight text-navy">見積マネージャー</span>
          <span className="block text-[11px] text-muted">見積から受注まで</span>
        </span>
      </Link>
      <nav aria-label="メイン" className="space-y-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive(item.href) ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              FOCUS_CLASS,
              isActive(item.href)
                ? "bg-canvas text-navy ring-1 ring-inset ring-line"
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
          デモ版：データはこのブラウザ内にだけ保存されます
          <span className="inline-block">（送信・外部通信なし）。</span>
        </p>
        <ResetDemoButton />
      </div>
    </aside>
  );
}

export function MobileNav() {
  const isActive = useIsActive();
  return (
    <nav
      aria-label="メイン"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-white pb-[env(safe-area-inset-bottom)] md:hidden print:hidden"
    >
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive(item.href) ? "page" : undefined}
          className={cn(
            "flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
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
