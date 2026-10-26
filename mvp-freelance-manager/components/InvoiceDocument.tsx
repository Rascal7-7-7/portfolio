import { Fragment } from "react";
import { formatFullDate } from "@/lib/dates";
import { formatYen, TAX_RATE, taxIncluded } from "@/lib/utils";
import type { Invoice, Project } from "@/types";

/**
 * 発行者・振込先はデモ用の架空の値。実在の口座と取り違えないよう名前でデモと分かるようにする。
 * 発行者は見積管理の見積書（EST-0014）と同じ値にそろえる
 */
const ISSUER = {
  name: "デモワークス",
  address: "東京都千代田区架空町 1-2-3 デモワークスビル 5F",
  tel: "03-0000-0000",
  registration: "T1234567890123（デモ）",
} as const;

const BANK = [
  ["銀行", "デモ銀行 サンプル支店（000）"],
  ["口座", "普通 0000000"],
  ["名義", "デモワークス"],
] as const;

const CELL = "px-2 py-2";

/**
 * 和文の請求書。組版は見積管理の見積書にそろえる：
 * 右上に番号・日付、中央に表題、左に宛名とご請求金額、右に発行者、下に明細と振込先。
 */
export function InvoiceDocument({ invoice, project }: { invoice: Invoice; project: Project | undefined }) {
  const tax = taxIncluded(invoice.amount);
  const subtotal = invoice.amount - tax;
  const subject = project?.name ?? "（削除された案件）";
  const items = invoice.items ?? [{ name: subject, qty: "1 式", unitPrice: subtotal, amount: subtotal }];

  return (
    <article
      aria-label={`請求書 ${invoice.number}`}
      className="relative border border-line bg-white px-5 py-6 text-[13px] leading-relaxed text-ink sm:px-10 sm:py-10 print:border-0 print:p-0"
    >
      <dl className="num ml-auto grid w-fit grid-cols-[auto_auto] gap-x-3 text-xs text-warm-500">
        <dt>請求番号</dt>
        <dd className="text-right">{invoice.number}</dd>
        <dt>発行日</dt>
        <dd className="text-right">{formatFullDate(invoice.issuedOn)}</dd>
        {invoice.estimateNo && (
          <>
            <dt>見積番号</dt>
            <dd className="text-right">{invoice.estimateNo}</dd>
          </>
        )}
      </dl>

      {/* 和文帳票の表題は字間を空けて中央に置くのが通例 */}
      <h2 className="mt-4 pl-[0.5em] text-center text-xl font-semibold tracking-[0.5em] sm:text-2xl">御請求書</h2>
      {invoice.draft && <p className="mt-1 text-center text-xs text-warm-500">下書き（未発行）</p>}

      <div className="mt-8 flex flex-wrap gap-x-10 gap-y-6">
        <div className="min-w-0 flex-[1_1_18rem]">
          <p className="border-b border-ink pb-1 text-base font-semibold">
            {project?.client ?? "—"}
            <span className="ml-2 font-normal">御中</span>
          </p>

          <p className="mt-5 text-warm-500">下記のとおりご請求申し上げます。</p>
          <dl className="mt-2 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1">
            <dt className="text-warm-500">件名</dt>
            <dd className="font-semibold">{subject}</dd>
            <dt className="text-warm-500">お支払期限</dt>
            <dd className="num">{formatFullDate(invoice.dueOn)}</dd>
          </dl>

          <div className="relative mt-5">
            <p className="flex items-stretch border border-ink">
              <span className="flex items-center border-r border-ink bg-warm-50 px-3 text-xs font-semibold whitespace-nowrap sm:text-sm">
                ご請求金額
              </span>
              <span className="flex flex-1 items-baseline justify-end gap-2 px-3 py-2">
                <span className="num text-xl font-bold sm:text-2xl">{formatYen(invoice.amount)}</span>
                <span className="text-xs whitespace-nowrap text-warm-500">（税込）</span>
              </span>
            </p>
            {invoice.paidOn && <PaidStamp paidOn={invoice.paidOn} />}
          </div>
        </div>

        <address className="pt-8 text-xs leading-relaxed text-warm-500 not-italic">
          {/* 角印は見積書と同じく社名の末尾に半分かかるように押す */}
          <p className="relative w-fit text-sm font-semibold text-ink">
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
          <p className="num">TEL {ISSUER.tel}</p>
          <p className="num">登録番号 {ISSUER.registration}</p>
        </address>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse">
          <caption className="sr-only">請求明細</caption>
          <thead>
            <tr className="border-y border-ink text-xs">
              <th scope="col" className={`${CELL} w-full text-left font-semibold`}>品名</th>
              <th scope="col" className={`${CELL} text-right font-semibold whitespace-nowrap`}>数量</th>
              {/* 見積書と同じく、スマホでは単価を省いて品名の幅を確保する */}
              <th scope="col" className={`${CELL} hidden text-right font-semibold whitespace-nowrap sm:table-cell`}>単価</th>
              <th scope="col" className={`${CELL} text-right font-semibold whitespace-nowrap`}>金額（税抜）</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b border-line align-top">
                {/* 320px 幅では文節単位の折り返しだと品名列が縮まず表がはみ出すため、必要なときだけ文節の途中でも折る */}
                <td className={`${CELL} [overflow-wrap:anywhere]`}>{item.name}</td>
                <td className={`${CELL} num text-right whitespace-nowrap`}>{item.qty}</td>
                <td className={`${CELL} num hidden text-right whitespace-nowrap sm:table-cell`}>{formatYen(item.unitPrice)}</td>
                <td className={`${CELL} num text-right whitespace-nowrap`}>{formatYen(item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dl className="num mt-3 ml-auto w-full max-w-[280px] text-sm">
        <div className="flex justify-between px-2 py-1">
          <dt className="text-warm-500">小計</dt>
          <dd>{formatYen(subtotal)}</dd>
        </div>
        <div className="flex justify-between px-2 py-1">
          <dt className="text-warm-500">消費税（{TAX_RATE}%）</dt>
          <dd>{formatYen(tax)}</dd>
        </div>
        <div className="mt-1 flex justify-between border-y border-ink px-2 py-1.5 text-base font-bold">
          <dt>合計</dt>
          <dd>{formatYen(invoice.amount)}</dd>
        </div>
      </dl>

      <div className="mt-8 border border-line">
        <p className="border-b border-line bg-warm-50 px-3 py-1 text-xs font-semibold">お振込先</p>
        <dl className="grid grid-cols-[3em_minmax(0,1fr)] gap-y-0.5 px-3 py-2 text-xs">
          {BANK.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="text-warm-500">{label}</dt>
              <dd className="num">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="px-3 pb-2 text-[11px] text-warm-500">
          ※ デモ用の架空の口座です。振込手数料はご負担をお願いいたします。
        </p>
      </div>
    </article>
  );
}

/** 入金済のときだけ、ご請求金額の右上に控えめに押す「済」印。朱色1色・少し透かす */
function PaidStamp({ paidOn }: { paidOn: string }) {
  const [, m, d] = paidOn.split("-").map(Number);
  return (
    <span
      aria-label={`${m}月${d}日 入金済`}
      role="img"
      className="pointer-events-none absolute -top-9 right-2 flex h-14 w-14 -rotate-12 flex-col items-center justify-center rounded-full border-2 border-current leading-none opacity-80 [print-color-adjust:exact]"
      style={{ color: "#c8322b" }}
    >
      <span className="text-xl font-bold">済</span>
      <span className="num mt-0.5 text-[9px] font-semibold">
        {m}/{d}
      </span>
    </span>
  );
}

/** 架空の屋号「デモワークス之印」の角印。見積書と同じ印影（朱色1色・右の列から縦に読む 2列×4字） */
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
