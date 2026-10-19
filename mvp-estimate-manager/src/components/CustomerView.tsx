"use client";

import Link from "next/link";
import type { Estimate } from "@/types";
import { ISSUER } from "@/data/seed";
import { useEstimates } from "@/lib/store";
import { calcTotals, lineAmount, TAX_RATE_PERCENT } from "@/lib/calc";
import { daysBetween, estimateNumber, formatDate, formatYen, todayISO } from "@/lib/utils";
import Icon from "@/components/Icon";
import LoadingState from "@/components/LoadingState";
import NotFoundState from "@/components/NotFoundState";

/** 明細の要約で見せる行数。超えた分は「ほか N 件」にまとめる */
const SUMMARY_ROWS = 3;

const FOCUS = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

/**
 * お客様が送付メールのリンクから開く見積の画面（モック）。Stripe Invoicing のお客様向け画面にならい、
 * 金額と期限を大きく見せて「承認する」の1操作で受注に進める。外部への送信はしない。
 */
export default function CustomerView({ id }: { id: number }) {
  const { estimates, approve } = useEstimates();

  if (!estimates) return <LoadingState />;
  const estimate = estimates.find((e) => e.id === id);
  if (!estimate) return <NotFoundState />;

  const items = estimate.items.filter((item) => item.name.trim() !== "");
  const { subtotal, tax, total } = calcTotals(items);
  const shown = items.slice(0, SUMMARY_ROWS);
  const rest = items.slice(SUMMARY_ROWS);

  return (
    // 管理画面のサイドバー・下部ナビを隠して、お客様が見る画面だけを全面に出す
    <div className="fixed inset-0 z-50 overflow-y-auto bg-canvas">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 bg-navy px-4 py-2 text-xs text-white">
        <p className="text-balance">デモ：お客様が送付メールのリンクから開く画面です（実際の送信はしていません）</p>
        <Link href={`/estimates/${estimate.id}`} className={`inline-flex items-center gap-1 font-semibold underline underline-offset-2 ${FOCUS}`}>
          <Icon name="back" className="h-3.5 w-3.5" />
          管理画面に戻る
        </Link>
      </div>

      <div className="mx-auto max-w-lg px-4 pb-12 pt-8 sm:pt-12">
        <p className="text-sm font-semibold text-navy">{ISSUER.name}</p>

        <section aria-label="お見積り" className="mt-4 rounded-lg border border-line bg-white shadow-sm">
          <div className="p-6">
            <p className="text-sm text-body">お見積り金額（税込）</p>
            <p className="tnum mt-1 text-4xl font-semibold tracking-tight text-navy">{formatYen(total)}</p>
            <ExpiryNote validUntil={estimate.validUntil} />

            <dl className="mt-6 grid grid-cols-[5.5em_minmax(0,1fr)] gap-y-2 text-sm">
              <dt className="text-muted">宛先</dt>
              <dd className="text-navy">
                {estimate.clientName} 御中
                {estimate.contactName && <span className="block text-body">{estimate.contactName} 様</span>}
              </dd>
              <dt className="text-muted">件名</dt>
              <dd className="text-balance text-navy">{estimate.subject}</dd>
              <dt className="text-muted">発行元</dt>
              <dd className="text-navy">{ISSUER.name}</dd>
              <dt className="text-muted">見積番号</dt>
              <dd className="tnum text-navy">{estimateNumber(estimate.id)}</dd>
            </dl>

            <div className="mt-6">
              <ApprovalArea estimate={estimate} onApprove={() => approve(estimate.id)} />
            </div>
          </div>

          <div className="border-t border-line p-6">
            <h2 className="text-sm font-semibold text-navy">明細の要約</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {shown.map((item) => (
                <li key={item.id} className="flex justify-between gap-4">
                  <span className="min-w-0">
                    <span className="block text-balance text-navy">{item.name}</span>
                    <span className="tnum block text-xs text-muted">
                      {item.quantity.toLocaleString("ja-JP")} {item.unit} × {formatYen(item.unitPrice)}
                    </span>
                  </span>
                  <span className="tnum shrink-0 text-navy">{formatYen(lineAmount(item))}</span>
                </li>
              ))}
              {rest.length > 0 && (
                <li className="flex justify-between gap-4 text-body">
                  <span>ほか {rest.length} 件</span>
                  <span className="tnum">{formatYen(rest.reduce((sum, item) => sum + lineAmount(item), 0))}</span>
                </li>
              )}
            </ul>
            <dl className="tnum mt-4 space-y-1 border-t border-line pt-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-body">小計</dt>
                <dd className="text-navy">{formatYen(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-body">消費税（{TAX_RATE_PERCENT}%）</dt>
                <dd className="text-navy">{formatYen(tax)}</dd>
              </div>
              <div className="flex justify-between pt-1 font-semibold text-navy">
                <dt>合計（税込）</dt>
                <dd>{formatYen(total)}</dd>
              </div>
            </dl>
          </div>
        </section>

        <p className="mt-6 text-balance text-center text-xs text-muted">
          ご不明な点は {ISSUER.name}<span className="whitespace-nowrap">（TEL {ISSUER.tel}）</span>までお問い合わせください。
        </p>
      </div>
    </div>
  );
}

function ExpiryNote({ validUntil }: { validUntil: string }) {
  const left = daysBetween(todayISO(), validUntil);
  return (
    <p className="tnum mt-2 text-sm text-body">
      有効期限 {formatDate(validUntil)}
      <span className={left < 0 ? "font-medium text-amber-800" : "text-muted"}>
        {left < 0 ? "（期限切れ）" : `（あと${left}日）`}
      </span>
    </p>
  );
}

interface ApprovalProps {
  estimate: Estimate;
  onApprove: () => void;
}

/** 送付済みなら「承認する」、承認後は完了表示。それ以外の状態はボタンを出さずに理由を書く */
function ApprovalArea({ estimate, onApprove }: ApprovalProps) {
  if (estimate.status === "won") {
    return (
      <div role="status" className="rounded border border-line bg-canvas p-4 text-sm">
        <p className="flex items-center gap-2 font-semibold text-navy">
          <Icon name="check" className="h-4 w-4 text-primary" />
          ご承認ありがとうございました
        </p>
        <p className="mt-1 text-balance text-body">{ISSUER.name}に承認をお知らせしました（デモ）。</p>
        <Link
          href={`/estimates/${estimate.id}`}
          className={`mt-3 inline-flex items-center gap-1 rounded font-semibold text-primary underline underline-offset-2 hover:text-primary-hover ${FOCUS}`}
        >
          管理画面で受注を確認する
        </Link>
      </div>
    );
  }
  if (estimate.status !== "sent") {
    const reason = estimate.status === "draft" ? "この見積はまだ送付されていません。" : "この見積は辞退済みです。";
    return <p className="rounded border border-line bg-canvas p-4 text-sm text-body">{reason}</p>;
  }
  if (daysBetween(todayISO(), estimate.validUntil) < 0) {
    return (
      <p className="rounded border border-line bg-canvas p-4 text-sm text-body">
        有効期限が過ぎているため、承認できません。再見積りを{ISSUER.name}にご依頼ください。
      </p>
    );
  }
  return (
    <>
      <button
        type="button"
        onClick={onApprove}
        className={`w-full rounded bg-primary px-4 py-3 text-base font-semibold text-white hover:bg-primary-hover ${FOCUS}`}
      >
        この内容で承認する
      </button>
      <p className="mt-2 text-center text-xs text-muted">承認すると{ISSUER.name}に通知されます</p>
    </>
  );
}
