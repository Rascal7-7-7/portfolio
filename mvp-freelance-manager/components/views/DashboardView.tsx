"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatLongDate, formatMonthLabel } from "@/lib/dates";
import {
  dashboardSummary,
  monthlyRevenue,
  projectName,
  sortTasks,
  taskGroup,
  type DashboardSummary,
} from "@/lib/selectors";
import { useDelta } from "@/lib/useDelta";
import { cn, formatYen } from "@/lib/utils";
import { Card, MoreLink, Page, PageHeader, PageSkeleton } from "@/components/ui";
import { RevenueChart } from "@/components/RevenueChart";
import { TaskRow } from "@/components/TaskRow";
import { InvoiceList } from "@/components/InvoiceList";
import { ActiveProjects } from "@/components/ActiveProjects";
import type { AppData, ISODate } from "@/types";

interface SummaryRow {
  href: string;
  label: string;
  value: string;
  sub: string;
}

function signedYen(delta: number): string {
  return `${delta > 0 ? "+" : "−"}${formatYen(Math.abs(delta))}`;
}

interface FlowStep {
  label: string;
  value: number;
  sub: string;
  /** 直前の操作で変わった金額。数秒だけ表示する */
  delta?: number;
  warn?: boolean;
}

/**
 * freee の「請求 → 入金 → 残り」に倣い、請求したお金がどこまで回収できたかを1行で見せる。
 * 請求 = 今月の入金 + 未入金の合計（来月以降が期日の未入金も含む）なので、入金を記録すると「入金」が増え「残り」が同額減る。
 * 増減バッジは見出し行に出し、数字の行の高さは固定して下の要素を動かさない
 */
function BillingFlow({ summary: s, paidDelta, outstandingDelta }: {
  summary: DashboardSummary;
  paidDelta: number;
  outstandingDelta: number;
}) {
  const billed = s.thisMonthPaid + s.outstandingTotal;
  const ratio = billed > 0 ? s.thisMonthPaid / billed : 0;
  const steps: FlowStep[] = [
    { label: "請求", value: billed, sub: "今月の入金＋未入金" },
    { label: "今月の入金", value: s.thisMonthPaid, delta: paidDelta, sub: `請求の ${Math.round(ratio * 100)}%` },
    {
      label: "残り",
      value: s.outstandingTotal,
      delta: outstandingDelta,
      sub: s.overdueCount > 0 ? `うち期限超過 ${formatYen(s.overdueTotal)}` : "期限超過なし",
      warn: s.overdueCount > 0,
    },
  ];

  return (
    <Card title="請求と回収" className="mb-6" action={<MoreLink href="/invoices">請求一覧</MoreLink>}>
      <ol className="grid grid-cols-3">
        {steps.map((st, i) => (
          <li key={st.label} className={cn("relative min-w-0 px-3 pt-3 pb-3 sm:px-5 sm:pt-4", i > 0 && "border-l border-line")}>
            {i > 0 && (
              <ChevronRight
                size={14}
                aria-hidden
                className="absolute top-1/2 -left-[8px] -translate-y-1/2 rounded-full bg-canvas text-warm-300"
              />
            )}
            <p className="flex h-5 items-center justify-between gap-1 text-xs text-warm-500">
              {st.label}
              {st.delta ? (
                <span className="num anim-rise rounded bg-blue-tint/60 px-1 text-[11px] font-semibold text-blue-active">
                  {signedYen(st.delta)}
                </span>
              ) : null}
            </p>
            <p
              key={st.value}
              className={cn(
                "num mt-0.5 flex h-7 items-center text-base font-semibold tracking-tight text-ink sm:text-[22px]",
                st.delta && "anim-rise",
              )}
            >
              {formatYen(st.value)}
            </p>
            {/* スマホの3列では補足が2行に折り返すため、2行分の高さを常に取っておく */}
            <p
              className={cn(
                "num min-h-[2lh] text-[11px] sm:min-h-0 sm:text-xs",
                st.warn ? "font-semibold text-orange" : "text-warm-500",
              )}
            >
              {st.sub}
            </p>
          </li>
        ))}
      </ol>
      <div
        className="mx-3 mb-4 h-1.5 overflow-hidden rounded-full bg-warm-200 sm:mx-5"
        role="progressbar"
        aria-label="請求の回収率"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(ratio * 100)}
      >
        <div
          className="h-full rounded-full bg-blue transition-[width] duration-500 motion-reduce:transition-none"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
    </Card>
  );
}

/** 右側の要約。タイルではなく1枚のパネルに行として並べる */
function SummaryList({ rows }: { rows: readonly SummaryRow[] }) {
  return (
    <Card className="flex flex-col">
      <ul className="grid flex-1 grid-cols-1 divide-y divide-line sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-1 lg:divide-x-0 lg:divide-y">
        {rows.map((r) => (
          <li key={r.label} className="min-w-0">
            <Link href={r.href} className="flex h-full flex-col justify-center px-3 py-3 hover:bg-warm-50 sm:px-5 sm:py-3.5">
              <span className="text-xs text-warm-500">{r.label}</span>
              <span className="num mt-0.5 text-base font-semibold text-ink sm:text-lg">{r.value}</span>
              <span className="num text-[11px] text-warm-500 sm:text-xs">{r.sub}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function DashboardView() {
  const store = useAppStore();
  if (!store) return <PageSkeleton />;
  return <Dashboard data={store.data} today={store.today} />;
}

function Dashboard({ data, today }: { data: AppData; today: ISODate }) {
  const s = dashboardSummary(data, today);
  const paidDelta = useDelta(s.thisMonthPaid);
  const outstandingDelta = useDelta(s.outstandingTotal);
  const revenue = monthlyRevenue(data.invoices, today);
  const focusTasks = sortTasks(
    data.tasks.filter((t) => ["overdue", "today"].includes(taskGroup(t, today)) || (t.done && t.dueDate === today)),
  );
  const unpaid = data.invoices
    .filter((inv) => !inv.paidOn)
    .toSorted((a, b) => a.dueOn.localeCompare(b.dueOn));
  const sixMonthTotal = revenue.reduce((sum, m) => sum + m.paid, 0);
  const firstMonth = formatMonthLabel(revenue[0].month);
  const lastMonth = formatMonthLabel(revenue[revenue.length - 1].month);

  const summary: SummaryRow[] = [
    {
      href: "/projects",
      label: "進行中の案件",
      value: `${s.activeProjectCount}件`,
      sub: `受注額 ${formatYen(s.activeProjectAmount)}`,
    },
    {
      href: "/tasks",
      label: "今日やること",
      value: `${s.todayTaskCount}件`,
      sub: s.overdueTaskCount > 0 ? `うち期限切れ ${s.overdueTaskCount}件` : "期限切れなし",
    },
  ];

  return (
    <Page>
      <PageHeader eyebrow={formatLongDate(today)} title="ダッシュボード" />

      <BillingFlow summary={s} paidDelta={paidDelta} outstandingDelta={outstandingDelta} />

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-4 pt-4 sm:px-5 sm:pt-5">
            <h2 className="text-[13px] font-semibold text-ink">入金の推移</h2>
            <p className="num text-xs text-warm-500">
              {firstMonth}から{lastMonth}の入金 <span className="font-medium text-ink">{formatYen(sixMonthTotal)}</span>
            </p>
          </div>
          <div className="px-3 pt-2 pb-4 sm:px-5">
            <RevenueChart
              data={revenue}
              growFrom={paidDelta > 0 ? (s.thisMonthPaid - paidDelta) / s.thisMonthPaid : null}
            />
          </div>
        </Card>
        <SummaryList rows={summary} />
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-5 lg:items-start">
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
