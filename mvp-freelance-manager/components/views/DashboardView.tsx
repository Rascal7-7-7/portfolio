"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatLongDate, formatMonthLabel } from "@/lib/dates";
import {
  dashboardSummary,
  isOutstanding,
  monthlyRevenue,
  projectName,
  sortTasks,
  taskGroup,
  type DashboardSummary,
  type MonthlyRevenue,
} from "@/lib/selectors";
import { useDelta } from "@/lib/useDelta";
import { cn, formatYen } from "@/lib/utils";
import { Card, MoreLink, Page, PageHeader, PageSkeleton, Yen } from "@/components/ui";
import { RevenueChart } from "@/components/RevenueChart";
import { TaskRow } from "@/components/TaskRow";
import { InvoiceList } from "@/components/InvoiceList";
import { ActiveProjects } from "@/components/ActiveProjects";
import type { AppData, ISODate } from "@/types";

function signedYen(delta: number): string {
  return `${delta > 0 ? "+" : "−"}${formatYen(Math.abs(delta))}`;
}

interface Metric {
  label: string;
  value: number;
  sub: string;
  /** 直前の操作で変わった金額。数秒だけ表示する */
  delta?: number;
  warn?: boolean;
}

interface BillingDeltas {
  duePaid: number;
  overdue: number;
  later: number;
}

/**
 * 今月の請求がどこまで回収できたかを、説明なしで読める3つの数字で見せる。
 * 「今月期日の請求 = うち入金 + 残り」が常に成り立つ。期限超過は先月以前の分も含めて別に出し、
 * 来月以降が期日の分は「今後の入金予定」として下の行に分ける。
 * 増減バッジは見出し行に出し、数字の行の高さは固定して下の要素を動かさない
 */
function BillingSummary({ summary: s, deltas }: { summary: DashboardSummary; deltas: BillingDeltas }) {
  const ratio = s.thisMonthDueTotal > 0 ? s.thisMonthDuePaid / s.thisMonthDueTotal : 0;
  const rest = s.thisMonthDueTotal - s.thisMonthDuePaid;
  const metrics: Metric[] = [
    { label: "今月期日の請求", value: s.thisMonthDueTotal, sub: `${s.thisMonthDueCount}件` },
    {
      label: "うち入金",
      value: s.thisMonthDuePaid,
      delta: deltas.duePaid,
      sub: rest > 0 ? `残り ${formatYen(rest)}` : "すべて入金済",
    },
    {
      label: "期限超過",
      value: s.overdueTotal,
      delta: deltas.overdue,
      sub: s.overdueCount > 0 ? `${s.overdueCount}件・要連絡` : "なし",
      warn: s.overdueCount > 0,
    },
  ];

  return (
    <Card title="今月の請求と入金" className="mb-5" action={<MoreLink href="/invoices">請求一覧</MoreLink>}>
      <dl className="grid grid-cols-3">
        {metrics.map((m, i) => (
          <div key={m.label} className={cn("min-w-0 px-3 pt-4 pb-3 sm:px-6 sm:pt-5", i > 0 && "border-l border-line")}>
            <dt className="flex h-5 items-center justify-between gap-1 text-xs text-warm-500">
              {m.label}
              <DeltaBadge delta={m.delta} />
            </dt>
            <dd
              key={m.value}
              className={cn(
                "mt-1 flex h-7 items-center text-[17px] font-semibold tracking-[-0.025em] sm:h-11 sm:text-[32px]",
                m.warn ? "text-shu" : "text-ink",
                m.delta && "anim-rise",
              )}
            >
              <Yen value={m.value} />
            </dd>
            {/* スマホの3列では補足が2行に折り返すことがあるため、2行分の高さを常に取っておく */}
            <dd
              className={cn(
                "num mt-0.5 min-h-[2lh] text-[11px] sm:min-h-0 sm:text-xs",
                m.warn ? "font-semibold text-shu" : "text-warm-500",
              )}
            >
              {m.sub}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mx-3 mb-5 flex items-center gap-3 sm:mx-6">
      <div
        className="h-2 flex-1 overflow-hidden bg-warm-200"
        role="progressbar"
        aria-label="今月期日の請求のうち入金済の割合"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(ratio * 100)}
      >
        <div
          className="h-full bg-moss transition-[width] duration-500 motion-reduce:transition-none"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
        <span aria-hidden className="num shrink-0 text-xs text-warm-500">
          <span className="font-semibold text-ink">{Math.round(ratio * 100)}%</span> 回収
        </span>
      </div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 border-t border-line px-3 py-3 sm:px-6">
        <p className="flex items-center gap-2 text-xs text-warm-500">
          今後の入金予定
          <span className="num">来月以降が期日・{s.laterDueCount}件</span>
          <DeltaBadge delta={deltas.later} />
        </p>
        <p key={s.laterDueTotal} className={cn("num text-sm font-semibold text-ink", deltas.later && "anim-rise")}>
          {formatYen(s.laterDueTotal)}
        </p>
      </div>
    </Card>
  );
}

function DeltaBadge({ delta }: { delta?: number }) {
  if (!delta) return null;
  return (
    <span className="num anim-rise rounded-[2px] bg-moss-tint px-1 text-[11px] font-semibold text-moss">
      {signedYen(delta)}
    </span>
  );
}

/** 「数値で見る」の開閉。ブラウザ標準の三角ではなく、ほかのリンクと同じ文字＋シェブロンにする */
function MonthlyTableToggle({ rows }: { rows: readonly MonthlyRevenue[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="monthly-table"
        onClick={() => setOpen((v) => !v)}
        className="hit inline-flex items-center gap-1 rounded text-xs text-warm-500 hover:text-ink"
      >
        数値で見る
        <ChevronDown
          size={14}
          aria-hidden
          className={cn("transition-transform duration-200 motion-reduce:transition-none", open && "rotate-180")}
        />
      </button>
      {open && (
        <div id="monthly-table">
          <MonthlyTable rows={rows} />
        </div>
      )}
    </div>
  );
}

/** グラフの数値を確かめるための月別の表（帳簿の小さな表。罫線は行の区切りだけ） */
function MonthlyTable({ rows }: { rows: readonly MonthlyRevenue[] }) {
  const th = "px-2 py-1.5 font-medium";
  return (
    <table className="num mt-2 w-full text-xs">
      <caption className="sr-only">月別の入金と入金見込み</caption>
      <thead className="text-warm-500">
        <tr className="border-b border-line">
          <th scope="col" className={`${th} text-left`}>月</th>
          <th scope="col" className={`${th} text-right`}>入金</th>
          <th scope="col" className={`${th} text-right`}>見込み</th>
          <th scope="col" className={`${th} text-right`}>計</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((m, i) => {
          const current = i === rows.length - 1;
          return (
            <tr key={m.month} className={cn("border-b border-line last:border-0", current ? "font-semibold text-ink" : "text-warm-900")}>
              <th scope="row" className={`${th} text-left`}>
                {formatMonthLabel(m.month)}
                {current && <span className="ml-1 font-normal text-warm-500">今月</span>}
              </th>
              <td className="px-2 py-1.5 text-right">{formatYen(m.paid)}</td>
              <td className="px-2 py-1.5 text-right">{m.expected > 0 ? formatYen(m.expected) : "—"}</td>
              <td className="px-2 py-1.5 text-right">{formatYen(m.paid + m.expected)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function DashboardView() {
  const store = useAppStore();
  if (!store) return <PageSkeleton />;
  return <Dashboard data={store.data} today={store.today} />;
}

function Dashboard({ data, today }: { data: AppData; today: ISODate }) {
  const s = dashboardSummary(data, today);
  // グラフの今月の棒を伸ばすための差分（入金日ベース）
  const paidDelta = useDelta(s.thisMonthPaid, "hikae-delta-paid");
  const deltas: BillingDeltas = {
    duePaid: useDelta(s.thisMonthDuePaid, "hikae-delta-due-paid"),
    overdue: useDelta(s.overdueTotal, "hikae-delta-overdue"),
    later: useDelta(s.laterDueTotal, "hikae-delta-later"),
  };
  const revenue = monthlyRevenue(data.invoices, today);
  const focusTasks = sortTasks(
    data.tasks.filter((t) => ["overdue", "today"].includes(taskGroup(t, today)) || (t.done && (t.dueDate === today || t.doneOn === today))),
  );
  const unpaid = data.invoices
    .filter(isOutstanding)
    .toSorted((a, b) => a.dueOn.localeCompare(b.dueOn));
  const sixMonthTotal = revenue.reduce((sum, m) => sum + m.paid, 0);
  const firstMonth = formatMonthLabel(revenue[0].month);
  const lastMonth = formatMonthLabel(revenue[revenue.length - 1].month);

  return (
    <Page>
      <PageHeader eyebrow={formatLongDate(today)} title="ダッシュボード" />

      <BillingSummary summary={s} deltas={deltas} />

      <Card className="mb-5">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1 px-4 pt-5 sm:px-6">
          <div>
            <h2 className="font-serif text-[15px] font-semibold text-ink">入金の推移</h2>
            <p className="num mt-0.5 text-xs text-warm-500">
              {firstMonth}から{lastMonth}の入金
            </p>
          </div>
          <p className="text-2xl font-semibold tracking-[-0.025em] text-ink sm:text-[28px]">
            <Yen value={sixMonthTotal} />
          </p>
        </div>
        <div className="px-3 pt-3 pb-5 sm:px-6">
          <RevenueChart
            data={revenue}
            growFrom={paidDelta > 0 ? (s.thisMonthPaid - paidDelta) / s.thisMonthPaid : null}
          />
          <MonthlyTableToggle rows={revenue} />
        </div>
      </Card>

      <div className="mb-5 grid gap-5 lg:grid-cols-5 lg:items-start">
        {/* 「入金済にする」がデモの山場なので、見た目もフォーカス順も今日やることより先に置く */}
        <Card title="未入金の請求" className="lg:col-span-3" action={<MoreLink href="/invoices">請求一覧</MoreLink>}>
          <InvoiceList invoices={unpaid} data={data} today={today} empty="未入金の請求はありません" />
        </Card>
        <Card title="今日やること" className="lg:col-span-2" action={<MoreLink href="/tasks">すべて見る</MoreLink>}>
          {focusTasks.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-warm-500">今日のタスクはすべて完了です</p>
          ) : (
            <ul className="divide-y divide-line">
              {focusTasks.map((t) => (
                <TaskRow
                  key={t.id}
                  task={t}
                  today={today}
                  project={{ id: t.projectId, name: projectName(data, t.projectId) }}
                />
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card title="進行中の案件" action={<MoreLink href="/projects">案件一覧</MoreLink>}>
        <ActiveProjects data={data} today={today} />
      </Card>
    </Page>
  );
}
