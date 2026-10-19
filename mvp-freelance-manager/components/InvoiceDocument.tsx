import { formatFullDate } from "@/lib/dates";
import { formatYen, TAX_RATE, taxIncluded } from "@/lib/utils";
import type { Invoice, Project } from "@/types";

/** 発行者・振込先はデモ用の架空の値。実在の口座と取り違えないよう名前でデモと分かるようにする */
const ISSUER = {
  name: "デモ 花子",
  trade: "デモワークス",
  email: "hello@example.com",
  registration: "T0000000000000",
} as const;

const BANK = [
  ["銀行", "デモ銀行 サンプル支店（000）"],
  ["口座", "普通 0000000"],
  ["名義", "デモワークス デモ ハナコ"],
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
  const items = invoice.items ?? [{ name: subject, qty: "1 式", amount: subtotal }];

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
          <p className="text-sm font-semibold text-ink">{ISSUER.trade}</p>
          <p className="text-ink">{ISSUER.name}</p>
          <p>
            <span className="inline-block">東京都デモ区</span>
            <span className="inline-block">サンプル町 1-2-3</span>
          </p>
          <p>{ISSUER.email}</p>
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
              <th scope="col" className={`${CELL} text-right font-semibold whitespace-nowrap`}>金額（税抜）</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.name} className="border-b border-line align-top">
                <td className={CELL}>{item.name}</td>
                <td className={`${CELL} num text-right whitespace-nowrap`}>{item.qty}</td>
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
