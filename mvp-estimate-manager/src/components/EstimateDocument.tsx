import { Fragment } from "react";
import type { EstimateInput } from "@/types";
import { ISSUER } from "@/data/seed";
import { calcTotals, lineAmount, TAX_RATE_PERCENT } from "@/lib/calc";
import { estimateNumber, formatDate, formatYen } from "@/lib/utils";

interface Props {
  estimate: EstimateInput;
  id?: number;
}

const CELL = "px-2 py-2";

/**
 * 見積書の帳票。作成フォームのプレビューと詳細画面・印刷で共用する。
 * 組版は日本の一般的な見積書にならう：右上に番号・日付、中央に表題、左に宛名と御見積金額、右に発行者。
 */
export default function EstimateDocument({ estimate, id }: Props) {
  const items = estimate.items.filter((item) => item.name.trim() !== "");
  const { subtotal, tax, total } = calcTotals(items);

  return (
    <article
      aria-label="見積書プレビュー"
      className="border border-line bg-white px-5 py-6 text-[13px] leading-relaxed text-navy sm:px-8 sm:py-10 print:border-0 print:p-0"
    >
      <dl className="tnum ml-auto grid w-fit grid-cols-[auto_auto] gap-x-3 text-xs text-body">
        <dt>見積番号</dt>
        <dd className="text-right">{id ? estimateNumber(id) : "保存時に採番"}</dd>
        <dt>発行日</dt>
        <dd className="text-right">{estimate.issuedAt ? formatDate(estimate.issuedAt) : "—"}</dd>
      </dl>

      {/* 和文帳票の表題は字間を空けて中央に置くのが通例 */}
      <h2 className="mt-4 pl-[0.5em] text-center text-xl font-semibold tracking-[0.5em] sm:text-2xl">御見積書</h2>

      {/* 幅が足りないとき（入力フォーム横のプレビュー等）は発行者欄が宛名の下に回り込む */}
      <div className="mt-8 flex flex-wrap gap-x-10 gap-y-6">
        <div className="min-w-0 flex-[1_1_18rem]">
          <p className="border-b border-navy pb-1 text-base font-semibold">
            {estimate.clientName || "（取引先未入力）"}
            <span className="ml-2 font-normal">御中</span>
          </p>
          {estimate.contactName && <p className="mt-1 text-body">{estimate.contactName} 様</p>}

          <p className="mt-5 text-body">下記のとおりお見積り申し上げます。</p>
          <dl className="mt-2 grid grid-cols-[4.5em_minmax(0,1fr)] gap-y-1">
            <dt className="text-body">件名</dt>
            <dd className="text-balance font-semibold">{estimate.subject || "（件名未入力）"}</dd>
            <dt className="text-body">有効期限</dt>
            <dd className="tnum">{estimate.validUntil ? formatDate(estimate.validUntil) : "—"}</dd>
          </dl>

          <p className="mt-5 flex items-stretch border border-navy">
            <span className="flex items-center whitespace-nowrap border-r border-navy bg-canvas px-3 text-xs font-semibold sm:text-sm">
              御見積金額
            </span>
            <span className="flex flex-1 items-baseline justify-end gap-2 px-3 py-2">
              <span className="tnum text-xl font-bold sm:text-2xl">{formatYen(total)}</span>
              <span className="whitespace-nowrap text-xs text-body">（税込）</span>
            </span>
          </p>
        </div>

        {/*
          角印は社名の末尾に半分かかるように押すのが和文帳票の慣習。
          印影の下端を社名の行の下端にそろえ、上の余白へはみ出させて住所・電話・登録番号の文字には掛けない
        */}
        <address className="pt-8 text-xs not-italic leading-relaxed text-body">
          <p className="relative w-fit text-sm font-semibold text-navy">
            {ISSUER.name}
            <CompanySeal className="absolute bottom-0 left-full -ml-6 h-12 w-12" />
          </p>
          {/* 住所は語の途中で折らず、空白の位置でだけ改行する */}
          <p>
            {ISSUER.address.split(" ").map((part, i) => (
              <Fragment key={i}>
                {i > 0 && " "}
                <span className="inline-block">{part}</span>
              </Fragment>
            ))}
          </p>
          <p className="tnum">TEL {ISSUER.tel}</p>
          <p className="tnum">登録番号 {ISSUER.registration}</p>
        </address>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse">
          <caption className="sr-only">見積明細</caption>
          <thead>
            <tr className="border-y border-navy text-xs">
              <th scope="col" className={`${CELL} hidden whitespace-nowrap text-center font-semibold sm:table-cell`}>No.</th>
              <th scope="col" className={`${CELL} w-full text-left font-semibold`}>品名</th>
              <th scope="col" className={`${CELL} whitespace-nowrap text-right font-semibold`}>数量</th>
              <th scope="col" className={`${CELL} hidden whitespace-nowrap text-right font-semibold sm:table-cell`}>単価</th>
              <th scope="col" className={`${CELL} whitespace-nowrap text-right font-semibold`}>金額</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr className="border-b border-line">
                <td colSpan={5} className="px-2 py-6 text-center text-muted">
                  明細を追加すると、ここに反映されます
                </td>
              </tr>
            ) : (
              items.map((item, i) => (
                <tr key={item.id} className="border-b border-line align-top">
                  <td className={`${CELL} tnum hidden text-center text-body sm:table-cell`}>{i + 1}</td>
                  <td className={`${CELL} text-balance`}>{item.name}</td>
                  <td className={`${CELL} tnum whitespace-nowrap text-right`}>
                    {item.quantity.toLocaleString("ja-JP")} {item.unit}
                  </td>
                  <td className={`${CELL} tnum hidden whitespace-nowrap text-right sm:table-cell`}>{formatYen(item.unitPrice)}</td>
                  <td className={`${CELL} tnum whitespace-nowrap text-right`}>{formatYen(lineAmount(item))}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <dl className="tnum ml-auto mt-3 w-full max-w-[280px] text-sm">
        <div className="flex justify-between px-2 py-1">
          <dt className="text-body">小計</dt>
          <dd>{formatYen(subtotal)}</dd>
        </div>
        <div className="flex justify-between px-2 py-1">
          <dt className="text-body">消費税（{TAX_RATE_PERCENT}%）</dt>
          <dd>{formatYen(tax)}</dd>
        </div>
        <div className="mt-1 flex justify-between border-y border-navy px-2 py-1.5 text-base font-bold">
          <dt>合計</dt>
          <dd>{formatYen(total)}</dd>
        </div>
      </dl>

      {estimate.note && (
        <div className="mt-8 border border-line">
          <p className="border-b border-line bg-canvas px-3 py-1 text-xs font-semibold">備考</p>
          <p className="whitespace-pre-wrap px-3 py-2 text-xs text-body">{estimate.note}</p>
        </div>
      )}
    </article>
  );
}

/** 架空社名「株式会社デモワークス之印」の角印（デモ用・朱色1色）。右の列から縦に読む */
const SEAL_COLUMNS = ["株式会社", "デモワー", "クス之印"];

function CompanySeal({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={`pointer-events-none mix-blend-multiply [print-color-adjust:exact] ${className ?? ""}`}
      style={{ color: "#c8322b" }}
    >
      <rect x="2" y="2" width="60" height="60" rx="2" fill="none" stroke="currentColor" strokeWidth="3" />
      <g
        fill="currentColor"
        fontSize="12"
        fontWeight="700"
        textAnchor="middle"
        fontFamily='"Hiragino Mincho ProN", "Yu Mincho", "Noto Serif JP", serif'
      >
        {SEAL_COLUMNS.map((column, c) =>
          Array.from(column).map((char, r) => (
            <text
              key={`${c}-${r}`}
              x={49 - c * 17}
              y={12.5 + r * 13}
              dominantBaseline="central"
              // 縦組みなので長音符は90度回して縦棒にする
              transform={char === "ー" ? `rotate(90 ${49 - c * 17} ${12.5 + r * 13})` : undefined}
            >
              {char}
            </text>
          )),
        )}
      </g>
    </svg>
  );
}
