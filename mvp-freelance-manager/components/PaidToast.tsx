"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { CircleCheck, X } from "lucide-react";
import { actions, usePaidToast } from "@/lib/store";
import { formatYen } from "@/lib/utils";

const SHOW_MS = 6000;

/**
 * 「入金済にする」「この内容で作成」を押した直後の知らせ。見積管理の受注トーストと同じ文法（右下・数秒で消える・閉じるボタン）。
 * 読み上げのため role="status" の枠は常に置いておく
 */
export function PaidToast() {
  const toast = usePaidToast();
  const pathname = usePathname();
  const key = toast?.key;

  useEffect(() => {
    if (key === undefined) return;
    const timer = window.setTimeout(actions.clearPaidToast, SHOW_MS);
    return () => window.clearTimeout(timer);
  }, [key]);

  // 別の画面へ移ったら消す（請求書画面まで付いてきて、スマホで明細を隠さないように）
  useEffect(() => {
    actions.clearPaidToast();
  }, [pathname]);

  const invoiceHref = toast ? `/invoices/${toast.invoiceId}` : "";
  // 請求書画面で記録したときは、今月のグラフが伸びるところを見せに行けるようダッシュボードへ誘う
  const link = pathname === invoiceHref
    ? { href: "/", label: "ダッシュボードで見る" }
    : { href: invoiceHref, label: "請求書を見る" };

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-20 z-50 flex justify-center md:inset-x-auto md:right-6 md:bottom-6 print:hidden"
    >
      {toast && (
        <div
          key={toast.key}
          className="toast-in pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg bg-warm-900 px-4 py-3 text-sm text-white shadow-lg"
        >
          <CircleCheck size={16} aria-hidden className="mt-0.5 shrink-0" />
          <div className="min-w-0 flex-1">
            {toast.kind === "created" ? (
              <p className="font-semibold">
                <span className="num">{toast.number}</span> を作成しました
                <span className="num ml-1 font-normal">{formatYen(toast.amount)}</span>
              </p>
            ) : (
              <p className="font-semibold">
                入金を記録しました <span className="num ml-1 font-normal">+{formatYen(toast.amount)}</span>
              </p>
            )}
            <p className="mt-0.5 text-xs text-white/80">
              {toast.kind === "paid" && <span className="num">{toast.number}</span>}
              {toast.client && <span className="ml-1.5 inline-block">{toast.client}</span>}
            </p>
            <Link
              href={link.href}
              className="mt-1 inline-block rounded text-xs font-semibold underline underline-offset-2 focus-visible:outline-white"
            >
              {link.label}
            </Link>
          </div>
          <button
            type="button"
            onClick={actions.clearPaidToast}
            aria-label="通知を閉じる"
            className="-mr-1 rounded p-1 text-white/80 hover:text-white focus-visible:outline-white"
          >
            <X size={16} aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}
