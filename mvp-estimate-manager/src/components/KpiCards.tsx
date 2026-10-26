import type { MonthlyAmount, Summary } from "@/lib/calc";
import { formatYen } from "@/lib/utils";
import Money from "@/components/Money";

interface Kpi {
  label: string;
  value: React.ReactNode;
  /** 承認直前からの差分の表示文字列（例「+¥1,243,000」「+2pt」）。変化がなければ出さない */
  delta?: string;
  note: string;
  extra?: React.ReactNode;
}

interface Props {
  summary: Summary;
  /** 月別受注額（古い順）。受注金額の欄にスパークラインで添える */
  monthly: MonthlyAmount[];
  /** 承認直前の集計。承認後に一覧へ戻ったとき、受注金額・受注率の横に数秒だけ差分を出す。null なら出さない */
  base?: Summary | null;
}

/** Stripe Dashboard の概要欄にならい、1枚の白いパネルを縦の罫線で4つに区切る（カードを並べない） */
export default function KpiCards({ summary, monthly, base = null }: Props) {
  const { count, pendingAmount, wonAmount, winRatePercent } = summary;
  const kpis: Kpi[] = [
    {
      label: "受注金額（税込）",
      value: <Money amount={wonAmount} />,
      delta: base ? signed(wonAmount - base.wonAmount, formatYen) : undefined,
      note: `受注 ${count.won} 件`,
      extra: <WonTrend monthly={monthly} />,
    },
    { label: "回答待ち（税込）", value: <Money amount={pendingAmount} />, note: `送付済み ${count.sent} 件` },
    {
      label: "受注率",
      value:
        winRatePercent === null ? "—" : (
          <>
            {winRatePercent}
            <span className="ml-0.5 text-[0.6em] font-medium text-muted">%</span>
          </>
        ),
      delta:
        base && winRatePercent !== null && base.winRatePercent !== null
          ? signed(winRatePercent - base.winRatePercent, (n) => `${n}pt`)
          : undefined,
      note: `受注 ${count.won} / 決着 ${count.won + count.lost} 件`,
    },
    { label: "下書き", value: (
        <>
          {count.draft}
          <span className="ml-1 text-[0.6em] font-medium text-muted">件</span>
        </>
      ), note: "送付前の見積" },
  ];

  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line shadow-[0_1px_2px_rgba(6,27,49,0.04),0_8px_24px_-12px_rgba(6,27,49,0.12)] lg:grid-cols-4">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="bg-white px-4 py-4 sm:px-5 sm:py-5">
          <dt className="text-xs font-medium text-body">{kpi.label}</dt>
          <dd className="tnum mt-1.5 flex flex-wrap items-baseline gap-x-2 text-[22px] font-semibold tracking-tight text-navy sm:text-[28px] sm:leading-tight">
            {kpi.value}
            {kpi.delta ? (
              <span className="delta-in rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold tracking-normal text-emerald-800">
                <span className="sr-only">承認前から</span>
                {kpi.delta}
              </span>
            ) : null}
          </dd>
          <dd className="tnum mt-0.5 text-xs text-muted">{kpi.note}</dd>
          {kpi.extra}
        </div>
      ))}
    </dl>
  );
}

/** 0 なら undefined（差分を出さない）。符号は文字で付ける */
function signed(diff: number, format: (abs: number) => string): string | undefined {
  if (diff === 0) return undefined;
  return `${diff > 0 ? "+" : "−"}${format(Math.abs(diff))}`;
}

const SPARK_W = 64;
const SPARK_H = 24;
const SPARK_PAD = 3;

/** 月別受注額の小さな折れ線。色はアクセント1色、今月の値を文字でも添える */
function WonTrend({ monthly }: { monthly: MonthlyAmount[] }) {
  if (monthly.length < 2) return null;
  const max = Math.max(...monthly.map((m) => m.amount), 1);
  const step = (SPARK_W - SPARK_PAD * 2) / (monthly.length - 1);
  const points = monthly.map((m, i) => ({
    x: SPARK_PAD + i * step,
    y: SPARK_H - SPARK_PAD - (m.amount / max) * (SPARK_H - SPARK_PAD * 2),
  }));
  const last = points[points.length - 1];
  const current = monthly[monthly.length - 1];
  const monthLabel = (m: MonthlyAmount) => `${Number(m.month.slice(5))}月`;

  return (
    <dd className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
      <svg width={SPARK_W} height={SPARK_H} viewBox={`0 0 ${SPARK_W} ${SPARK_H}`} aria-hidden="true" className="shrink-0 text-emerald-600">
        <polygon
          points={`${points[0].x},${SPARK_H} ${points.map((p) => `${p.x},${p.y}`).join(" ")} ${last.x},${SPARK_H}`}
          fill="currentColor"
          opacity="0.1"
        />
        <polyline
          points={points.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <circle cx={last.x} cy={last.y} r="2.5" fill="currentColor" />
      </svg>
      <span className="tnum min-w-0 text-xs leading-tight">
        <span className="block whitespace-nowrap font-semibold text-navy">今月 {formatYen(current.amount)}</span>
        <span className="block whitespace-nowrap text-muted">
          {monthLabel(monthly[0]).replace("月", "")}〜{monthLabel(current)}の推移
        </span>
      </span>
      <span className="sr-only">
        月別受注額：{monthly.map((m) => `${monthLabel(m)} ${formatYen(m.amount)}`).join("、")}
      </span>
    </dd>
  );
}
