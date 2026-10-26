import { Fragment } from "react";
import type { EstimateInput } from "@/types";
import { ISSUER } from "@/data/seed";
import { calcTotals, lineAmount, TAX_RATE_PERCENT } from "@/lib/calc";
import { estimateNumber, formatDate, formatYen } from "@/lib/utils";

interface Props {
  estimate: EstimateInput;
  id?: number;
  /** 作成画面のプレビューで「自動採番」「自動計算」の注釈を添える */
  annotate?: boolean;
}

const CELL = "px-2 py-2";

/**
 * 見積書の帳票。作成フォームのプレビューと詳細画面・印刷で共用する。
 * 組版は日本の一般的な見積書にならう：右上に番号・日付、中央に表題、左に宛名と御見積金額、右に発行者。
 */
export default function EstimateDocument({ estimate, id, annotate = false }: Props) {
  const items = estimate.items.filter((item) => item.name.trim() !== "");
  const { subtotal, tax, total } = calcTotals(items);

  return (
    <article
      aria-label="見積書プレビュー"
      className="rounded-[3px] border border-line/80 bg-white px-5 py-6 text-[13px] leading-relaxed text-navy shadow-[0_1px_2px_rgba(6,27,49,0.05),0_16px_40px_-16px_rgba(6,27,49,0.22)] sm:px-8 sm:py-10 print:rounded-none print:border-0 print:p-0 print:shadow-none"
    >
      <dl className="tnum ml-auto grid w-fit grid-cols-[auto_auto] gap-x-3 text-xs text-body">
        <dt className="relative">
          見積番号
          {annotate && <Annotation label="自動採番" className="right-full top-1/2 mr-2 -translate-y-1/2" />}
        </dt>
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

          <p className={`relative flex items-stretch border border-navy ${annotate ? "mt-9" : "mt-5"}`}>
            {annotate && <Annotation label="自動計算" vertical className="bottom-full right-4" />}
            <span className="flex items-center whitespace-nowrap border-r border-navy bg-canvas px-3 text-xs font-semibold sm:text-sm">
              御見積金額
            </span>
            {/* 320px 幅では（税込）を金額の下へ折り返し、ページを横にはみ出させない */}
            <span className="flex min-w-0 flex-1 flex-wrap items-baseline justify-end gap-x-2 px-3 py-2">
              {/* プレビューでは再計算のたびに金額を小さく持ち上げ、入力が書類に届いたことを見せる */}
              <span key={annotate ? total : undefined} className={`tnum text-xl font-bold sm:text-2xl ${annotate ? "num-tick" : ""}`}>{formatYen(total)}</span>
              <span className="whitespace-nowrap text-xs text-body">（税込）</span>
            </span>
          </p>
        </div>

        {/*
          角印は社名の末尾に半分かかるように押すのが和文帳票の慣習。
          印影の下端を社名の行の下端にそろえ、上の余白へはみ出させて住所・電話・登録番号の文字には掛けない。
          朱肉は社名の上に重なる（z-10）。乗算だと黒字が勝って印が下敷きに見えるため、通常合成で少し透かして下の文字を読ませる
        */}
        <address className="pt-8 text-xs not-italic leading-relaxed text-body">
          <p className="relative w-fit text-sm font-semibold text-navy">
            {ISSUER.name}
            <CompanySeal className="absolute bottom-0 left-full -ml-3 h-10 w-10 sm:h-12 sm:w-12" />
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
                // プレビューでは追加された行だけが下からふわっと入る（key が新しい行だけマウントされる）
                <tr key={item.id} className={`border-b border-line align-top ${annotate ? "row-in" : ""}`}>
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
          <dd key={annotate ? total : undefined} className={annotate ? "num-tick" : undefined}>{formatYen(total)}</dd>
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

/**
 * 帳票の外から指す小さな注釈（Misoca のプレビューの説明書きにならう）。細い線＋短いラベルをアクセント1色で。
 * 紙面の内容ではないので読み上げ・印刷からは外す（同じことは入力欄の合計表示とフォーム文言で伝わる）
 */
function Annotation({ label, vertical = false, className }: { label: string; vertical?: boolean; className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute flex items-center whitespace-nowrap text-[10px] font-semibold leading-none text-primary print:hidden ${vertical ? "flex-col" : ""} ${className}`}
    >
      {label}
      <span className={vertical ? "mt-1 h-2.5 w-px bg-primary" : "ml-1.5 h-px w-5 bg-primary"} />
    </span>
  );
}

/** 架空の屋号「デモワークス之印」の角印（デモ用・朱色1色）。右の列から縦に読む（2列×4字） */
const SEAL_COLUMNS = ["デモワー", "クス之印"];

function CompanySeal({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={`pointer-events-none z-10 opacity-[0.82] [print-color-adjust:exact] ${className ?? ""}`}
      style={{ color: "#c8322b" }}
    >
      <rect x="2" y="2" width="60" height="60" rx="2" fill="none" stroke="currentColor" strokeWidth="3" />
      <g
        fill="currentColor"
        fontSize="13"
        fontWeight="700"
        textAnchor="middle"
        fontFamily='"Hiragino Mincho ProN", "Yu Mincho", "Noto Serif JP", serif'
      >
        {SEAL_COLUMNS.map((column, c) =>
          Array.from(column).map((char, r) => (
            <text
              key={`${c}-${r}`}
              x={43 - c * 22}
              y={12 + r * 13.3}
              dominantBaseline="central"
              // 縦組みなので長音符は90度回して縦棒にする
              transform={char === "ー" ? `rotate(90 ${43 - c * 22} ${12 + r * 13.3})` : undefined}
            >
              {char}
            </text>
          )),
        )}
      </g>
    </svg>
  );
}
