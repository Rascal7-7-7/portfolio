"use client";

import Link from "next/link";
import type { Estimate } from "@/types";
import { ISSUER } from "@/data/seed";
import { useEstimates } from "@/lib/store";
import { calcTotals, lineAmount, TAX_RATE_PERCENT } from "@/lib/calc";
import { daysBetween, estimateNumber, formatDate, formatYen, todayISO } from "@/lib/utils";
import EstimateDocument from "@/components/EstimateDocument";
import Icon from "@/components/Icon";
import LoadingState from "@/components/LoadingState";
import NotFoundState from "@/components/NotFoundState";
import Money from "@/components/Money";
import { BrandMark } from "@/components/Sidebar";

/** 明細の要約で全部見せる上限。超えたときだけ先頭 SUMMARY_ROWS 行＋「ほか N 件」にまとめる */
const SUMMARY_MAX = 4;
const SUMMARY_ROWS = 3;

/** お客様画面の主役のカード。接地影＋広くぼかした影で、紙を1枚置いたように見せる */
const CARD =
  "overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(6,27,49,0.05),0_24px_48px_-24px_rgba(6,27,49,0.25)]";

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
  const shown = items.length <= SUMMARY_MAX ? items : items.slice(0, SUMMARY_ROWS);
  const rest = items.slice(shown.length);

  return (
    // 管理画面のサイドバー・下部ナビを隠して、お客様が見る画面だけを全面に出す。
    // 印刷（Cmd+P）では要約・操作を外し、正式な見積書だけを紙に出す
    <div className="fixed inset-0 z-50 overflow-y-auto bg-canvas print:static print:overflow-visible print:bg-white">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-line bg-white px-4 py-2 text-xs text-body print:hidden">
        <p className="text-balance">デモ：お客様が送付メールのリンクから開く画面です（実際の送信はしていません）</p>
        <Link href={`/estimates/${estimate.id}`} className={`inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-2 hover:text-primary-hover ${FOCUS}`}>
          <Icon name="back" className="h-3.5 w-3.5" />
          管理画面に戻る
        </Link>
      </div>

      <div className="mx-auto max-w-lg px-4 pt-8 sm:pt-12 print:hidden">
        <div className="flex items-center gap-3">
          <BrandMark className="h-10 w-10 shrink-0" />
          <p className="min-w-0">
            <span className="block text-base font-semibold text-navy">{ISSUER.name}</span>
            <span className="block text-xs text-muted">からお見積りが届いています</span>
          </p>
        </div>

        <section aria-label="お見積り" className={`mt-5 ${CARD}`}>
          <div className="p-6 sm:p-8">
            <h1 className="text-sm font-normal text-body">お見積り金額（税込）</h1>
            <p className="tnum mt-1.5 text-[40px] font-semibold leading-none tracking-tight text-navy sm:text-[44px]">
              <Money amount={total} />
            </p>
            <p className="tnum mt-2 text-xs text-muted">うち消費税（{TAX_RATE_PERCENT}%）{formatYen(tax)}</p>
            <ExpiryNote validUntil={estimate.validUntil} />

            <dl className="mt-6 grid grid-cols-[5.5em_minmax(0,1fr)] gap-y-2.5 border-t border-line pt-5 text-sm">
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

          <div className="border-t border-line bg-canvas/60 p-6 sm:px-8">
            <h2 className="text-sm font-semibold text-navy">
              明細の要約<span className="tnum ml-2 font-normal text-muted">{items.length} 件</span>
            </h2>
            <ul className="mt-3 space-y-3 text-sm">
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
              <div className="flex justify-between text-body">
                <dt>小計</dt>
                <dd>{formatYen(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-body">
                <dt>消費税（{TAX_RATE_PERCENT}%）</dt>
                <dd>{formatYen(tax)}</dd>
              </div>
              <div className="flex justify-between pt-1 font-semibold text-navy">
                <dt>合計（税込）</dt>
                <dd>{formatYen(total)}</dd>
              </div>
            </dl>
          </div>
        </section>
      </div>

      {/*
        管理側と同じ紙面（角印つき）。承認の前に正式な見積書を確かめられるよう、折りたたみで添える。
        閉じた状態は上のカードと同じ幅、開くと帳票が読める幅（max-w-3xl）まで広げる
      */}
      <details className="group mx-auto mt-4 max-w-3xl px-4 print:hidden">
        <summary
          className={`mx-auto flex max-w-[calc(32rem-2rem)] cursor-pointer list-none items-center justify-between gap-2 rounded-xl border border-line bg-white px-6 py-4 text-sm font-semibold text-navy shadow-[0_1px_2px_rgba(6,27,49,0.04)] hover:bg-canvas [&::-webkit-details-marker]:hidden ${FOCUS}`}
        >
          <span className="inline-flex items-center gap-2">
            <Icon name="file" className="h-4 w-4 text-muted" />
            見積書を表示
          </span>
          <Icon name="chevron" className="h-4 w-4 text-muted group-open:rotate-180" />
        </summary>
        <div className="mt-3">
          <EstimateDocument estimate={estimate} id={estimate.id} />
        </div>
      </details>

      <div className="mx-auto max-w-lg px-4 pb-12 print:hidden">
        {/* 発行元の素性（所在地・電話・登録番号）を最後に揃えて置き、受け取った側が相手を確かめられるようにする */}
        <address className="mt-8 border-t border-line pt-6 text-center text-xs not-italic leading-relaxed text-muted">
          <span className="block font-semibold text-body">{ISSUER.name}</span>
          <span className="block text-balance">{ISSUER.address}</span>
          <span className="tnum block">
            TEL {ISSUER.tel}
            <span aria-hidden="true" className="mx-2 text-line">|</span>
            登録番号 {ISSUER.registration}
          </span>
        </address>
        <p className="mt-4 text-balance text-center text-xs text-muted">
          ご不明な点は {ISSUER.name}<span className="whitespace-nowrap">（TEL {ISSUER.tel}）</span>までお問い合わせください。
        </p>
      </div>

      {/* 折りたたみの中身は閉じていると印刷されないため、印刷用に見積書をもう1つ置く */}
      <div className="hidden print:block">
        <EstimateDocument estimate={estimate} id={estimate.id} />
      </div>
    </div>
  );
}

function ExpiryNote({ validUntil }: { validUntil: string }) {
  const left = daysBetween(todayISO(), validUntil);
  return (
    <p className="tnum mt-4 inline-flex flex-wrap items-center gap-1.5 rounded-full bg-canvas px-3 py-1 text-xs text-body ring-1 ring-inset ring-line">
      <Icon name="calendar" className="h-3.5 w-3.5 text-muted" />
      有効期限 {formatDate(validUntil)}
      <span className={left < 0 ? "font-semibold text-amber-800" : "font-semibold text-navy"}>
        {left < 0 ? "（期限切れ）" : `あと${left}日`}
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
      <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm">
        <p className="flex items-center gap-2 font-semibold text-emerald-900">
          <Icon name="check" className="h-4 w-4 text-emerald-600" />
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
    return <p className="rounded-xl border border-line bg-canvas p-4 text-sm text-body">{reason}</p>;
  }
  if (daysBetween(todayISO(), estimate.validUntil) < 0) {
    return (
      <p className="rounded-xl border border-line bg-canvas p-4 text-sm text-body">
        有効期限が過ぎているため、承認できません。再見積りを{ISSUER.name}にご依頼ください。
      </p>
    );
  }
  return (
    <>
      <button
        type="button"
        onClick={onApprove}
        className={`inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-base font-semibold text-white shadow-[0_1px_2px_rgba(6,27,49,0.2),0_8px_20px_-8px_rgba(36,70,122,0.5)] hover:bg-primary-hover ${FOCUS}`}
      >
        <Icon name="check" className="h-5 w-5" />
        この内容で承認する
      </button>
      <p className="mt-2 text-center text-xs text-muted">承認すると{ISSUER.name}に通知されます</p>
    </>
  );
}
