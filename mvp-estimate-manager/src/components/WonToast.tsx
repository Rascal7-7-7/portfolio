"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useEstimates } from "@/lib/store";
import { estimateNumber, formatYen, hikaeInvoiceUrl } from "@/lib/utils";
import Icon from "@/components/Icon";

const SHOW_MS = 6000;
const TOAST_LINK =
  "mt-1 inline-block text-xs font-semibold underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/**
 * お客様が承認したあと、管理画面に戻った時点で「受注しました」を知らせる。
 * お客様画面（/customer）にいる間は出さない。読み上げのため role="status" の枠は常に置いておく
 */
export default function WonToast() {
  const { wonToast, clearWonToast } = useEstimates();
  const pathname = usePathname();
  const visible = wonToast !== null && !pathname.endsWith("/customer");
  const invoiceUrl = wonToast ? hikaeInvoiceUrl(wonToast.id) : null;

  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(clearWonToast, SHOW_MS);
    return () => window.clearTimeout(timer);
  }, [visible, clearWonToast]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-20 z-40 flex justify-center md:inset-x-auto md:bottom-6 md:right-6 print:hidden"
    >
      {visible && wonToast && (
        <div className="toast-in pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg bg-navy px-4 py-3 text-sm text-white shadow-lg">
          <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">
              受注しました{" "}<span className="tnum ml-1 font-normal">+{formatYen(wonToast.amount)}</span>
            </p>
            <p className="mt-0.5 text-xs text-white/80">
              <span className="tnum">{estimateNumber(wonToast.id)}</span>
              <span className="inline-block">「{wonToast.subject}」</span>
              <span className="inline-block">をお客様が承認しました</span>
            </p>
            {/* 次の一手は1つだけ。Hikae と連携済みの見積なら請求書へ、それ以外は一覧の受注金額へ */}
            {invoiceUrl ? (
              <a href={invoiceUrl} target="_blank" rel="noopener noreferrer" className={TOAST_LINK}>
                Hikae で請求書を見る（デモ）
                <span className="sr-only">（新しいタブで開きます）</span>
              </a>
            ) : pathname !== "/estimates" && (
              <Link href="/estimates" className={TOAST_LINK}>
                一覧で受注金額を見る
              </Link>
            )}
          </div>
          <button
            type="button"
            onClick={clearWonToast}
            aria-label="通知を閉じる"
            className="-mr-1 rounded p-1 text-white/80 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <Icon name="x" className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
