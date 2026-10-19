import type { EstimateInput } from "@/types";
import { ISSUER } from "@/data/seed";
import { calcTotals, lineAmount, TAX_RATE_PERCENT } from "@/lib/calc";
import { estimateNumber, formatDate, formatYen } from "@/lib/utils";

interface Props {
  estimate: EstimateInput;
  id?: number;
}

/** 見積書の帳票。作成フォームのプレビューと詳細画面・印刷で共用する */
export default function EstimateDocument({ estimate, id }: Props) {
  const items = estimate.items.filter((item) => item.name.trim() !== "");
  const { subtotal, tax, total } = calcTotals(items);

  return (
    <article
      aria-label="見積書プレビュー"
      className="rounded-md bg-white p-5 text-[13px] text-navy shadow-card sm:p-8 print:p-0 print:shadow-none"
    >
      <header className="flex flex-col-reverse gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-[0.3em]">御見積書</h2>
          <p className="mt-4 border-b border-navy pb-1 text-base font-semibold">
            {estimate.clientName || "（取引先未入力）"} 御中
          </p>
          {estimate.contactName && (
            <p className="mt-1 text-body">{estimate.contactName} 様</p>
          )}
        </div>
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-xs text-body sm:text-right">
          <dt>見積番号</dt>
          <dd className="tnum">{id ? estimateNumber(id) : "保存時に採番"}</dd>
          <dt>発行日</dt>
          <dd>{estimate.issuedAt ? formatDate(estimate.issuedAt) : "—"}</dd>
          <dt>有効期限</dt>
          <dd>{estimate.validUntil ? formatDate(estimate.validUntil) : "—"}</dd>
        </dl>
      </header>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs text-muted">件名</p>
          <p className="font-semibold">{estimate.subject || "（件名未入力）"}</p>
          <p className="mt-3 text-xs text-muted">下記のとおりお見積り申し上げます。</p>
          <p className="mt-1 inline-flex items-baseline gap-3 border-b-2 border-navy pb-1">
            <span className="whitespace-nowrap text-sm font-semibold">御見積金額</span>
            <span className="tnum text-2xl font-bold">{formatYen(total)}</span>
            <span className="whitespace-nowrap text-xs text-muted">（税込）</span>
          </p>
        </div>
        <div className="text-xs leading-relaxed text-body">
          <p className="text-sm font-semibold text-navy">{ISSUER.name}</p>
          <p>{ISSUER.address}</p>
          <p>TEL {ISSUER.tel}</p>
          <p>登録番号 {ISSUER.registration}</p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse">
          <caption className="sr-only">見積明細</caption>
          <thead>
            <tr className="border-y border-navy bg-canvas text-xs">
              <th scope="col" className="px-2 py-2 text-left font-semibold">品名</th>
              <th scope="col" className="w-16 px-2 py-2 text-right font-semibold">数量</th>
              <th scope="col" className="hidden w-24 px-2 py-2 text-right font-semibold sm:table-cell">単価</th>
              <th scope="col" className="w-24 px-2 py-2 text-right font-semibold">金額</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-2 py-6 text-center text-muted">
                  明細を追加すると、ここに反映されます
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b border-line">
                  <td className="px-2 py-2">{item.name}</td>
                  <td className="tnum whitespace-nowrap px-2 py-2 text-right">
                    {item.quantity.toLocaleString("ja-JP")} {item.unit}
                  </td>
                  <td className="tnum hidden whitespace-nowrap px-2 py-2 text-right sm:table-cell">{formatYen(item.unitPrice)}</td>
                  <td className="tnum whitespace-nowrap px-2 py-2 text-right">{formatYen(lineAmount(item))}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <dl className="tnum ml-auto mt-4 w-full max-w-[260px] space-y-1 text-sm">
        <div className="flex justify-between">
          <dt className="text-body">小計</dt>
          <dd>{formatYen(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-body">消費税（{TAX_RATE_PERCENT}%）</dt>
          <dd>{formatYen(tax)}</dd>
        </div>
        <div className="flex justify-between border-t border-navy pt-1 text-base font-bold">
          <dt>合計</dt>
          <dd>{formatYen(total)}</dd>
        </div>
      </dl>

      {estimate.note && (
        <p className="mt-6 rounded bg-canvas px-3 py-2 text-xs text-body">備考：{estimate.note}</p>
      )}
    </article>
  );
}
