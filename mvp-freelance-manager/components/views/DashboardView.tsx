"use client";

import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { formatLongDate, formatMonthLabel } from "@/lib/dates";
import { dashboardSummary, monthlyRevenue, projectName, sortTasks, taskGroup } from "@/lib/selectors";
import { formatYen } from "@/lib/utils";
import { Card, MoreLink, Page, PageHeader, PageSkeleton } from "@/components/ui";
import { RevenueChart } from "@/components/RevenueChart";
import { TaskRow } from "@/components/TaskRow";
import { InvoiceList } from "@/components/InvoiceList";
import { ActiveProjects } from "@/components/ActiveProjects";

interface SummaryRow {
  href: string;
  label: string;
  value: string;
  sub: string;
}

/** 右側の要約。タイルではなく1枚のパネルに行として並べる */
function SummaryList({ rows }: { rows: readonly SummaryRow[] }) {
  return (
    <Card className="flex flex-col">
      <ul className="grid flex-1 grid-cols-3 divide-x divide-line lg:grid-cols-1 lg:divide-x-0 lg:divide-y">
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
  const { data, today } = store;

  const s = dashboardSummary(data, today);
  const revenue = monthlyRevenue(data.invoices, today);
  const focusTasks = sortTasks(
    data.tasks.filter((t) => ["overdue", "today"].includes(taskGroup(t, today)) || (t.done && t.dueDate === today)),
  );
  const unpaid = data.invoices
    .filter((inv) => !inv.paidOn)
    .toSorted((a, b) => a.dueOn.localeCompare(b.dueOn));
  const sixMonthTotal = revenue.reduce((sum, m) => sum + m.paid, 0);
  const firstMonth = formatMonthLabel(revenue[0].month);

  const summary: SummaryRow[] = [
    {
      href: "/invoices",
      label: "未入金の請求",
      value: formatYen(s.outstandingTotal),
      sub: s.overdueCount > 0 ? `${s.outstandingCount}件 ・ うち期限超過 ${formatYen(s.overdueTotal)}` : `${s.outstandingCount}件`,
    },
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

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 px-4 pt-4 sm:px-5 sm:pt-5">
            <div className="min-w-0">
              <h2 className="text-[13px] text-warm-500">今月の入金</h2>
              <p className="num mt-1 text-[28px] leading-none font-semibold tracking-tight text-ink">
                {formatYen(s.thisMonthPaid)}
              </p>
              <p className="num mt-2 text-xs text-warm-500">
                見込み込み {formatYen(s.thisMonthPaid + s.thisMonthExpected)}
              </p>
            </div>
            <p className="num text-xs text-warm-500">
              {firstMonth}〜 6ヶ月計 <span className="font-medium text-ink">{formatYen(sixMonthTotal)}</span>
            </p>
          </div>
          <div className="px-3 pt-2 pb-4 sm:px-5">
            <RevenueChart data={revenue} />
          </div>
        </Card>
        <SummaryList rows={summary} />
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-5">
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
        <Card title="未入金の請求" className="lg:col-span-3" action={<MoreLink href="/invoices">請求一覧</MoreLink>}>
          <InvoiceList invoices={unpaid} data={data} today={today} empty="未入金の請求はありません" />
        </Card>
      </div>

      <Card title="進行中の案件" action={<MoreLink href="/projects">案件一覧</MoreLink>}>
        <ActiveProjects data={data} />
      </Card>
    </Page>
  );
}
