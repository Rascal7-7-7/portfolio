"use client";

import Link from "next/link";
import { Banknote, Briefcase, CircleAlert, ListChecks, TrendingUp, Wallet } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatLongDate, formatRelative } from "@/lib/dates";
import { dashboardSummary, invoiceStatus, monthlyRevenue, projectName, sortTasks, taskGroup } from "@/lib/selectors";
import { formatYen } from "@/lib/utils";
import { Card, MoreLink, Page, PageHeader, PageSkeleton } from "@/components/ui";
import { KpiCard } from "@/components/KpiCard";
import { RevenueChart } from "@/components/RevenueChart";
import { TaskRow } from "@/components/TaskRow";
import { InvoiceList } from "@/components/InvoiceList";
import { ActiveProjects } from "@/components/ActiveProjects";

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
  const overdue = unpaid.filter((inv) => invoiceStatus(inv, today) === "overdue");
  const sixMonthTotal = revenue.reduce((sum, m) => sum + m.paid, 0);

  return (
    <Page>
      <PageHeader
        eyebrow={formatLongDate(today)}
        title="ダッシュボード"
        description={`今日やること ${s.todayTaskCount}件 ・ 未入金 ${formatYen(s.outstandingTotal)} ・ 進行中 ${s.activeProjectCount}案件`}
      />

      {overdue.length > 0 && (
        <div role="status" className="mb-5 flex items-start gap-3 rounded-xl border border-orange/25 bg-orange-soft px-4 py-3">
          <CircleAlert size={18} className="mt-0.5 shrink-0 text-orange" aria-hidden />
          <div className="min-w-0 flex-1 text-sm">
            <p className="font-semibold text-orange">支払期日を過ぎた請求が{overdue.length}件あります</p>
            <p className="mt-0.5 text-warm-900">
              {data.projects.find((p) => p.id === overdue[0].projectId)?.client ?? "取引先"}への請求
              {overdue[0].number}（{formatYen(overdue[0].amount)}）が期日を
              {formatRelative(today, overdue[0].dueOn)}しています。
            </p>
          </div>
          <Link href="/invoices" className="shrink-0 self-center text-xs font-semibold text-orange hover:underline">
            確認する
          </Link>
        </div>
      )}

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          href="/invoices"
          label="今月の入金"
          value={formatYen(s.thisMonthPaid)}
          icon={<Banknote size={17} />}
          sub={`見込み込み ${formatYen(s.thisMonthPaid + s.thisMonthExpected)}`}
        />
        <KpiCard
          href="/invoices"
          label="未入金の請求"
          value={formatYen(s.outstandingTotal)}
          icon={<Wallet size={17} />}
          sub={s.overdueCount > 0 ? `${s.outstandingCount}件・うち期限超過 ${formatYen(s.overdueTotal)}` : `${s.outstandingCount}件`}
          tone={s.overdueCount > 0 ? "alert" : "default"}
        />
        <KpiCard
          href="/projects"
          label="進行中の案件"
          value={`${s.activeProjectCount}件`}
          icon={<Briefcase size={17} />}
          sub={`受注額 ${formatYen(s.activeProjectAmount)}`}
        />
        <KpiCard
          href="/tasks"
          label="今日やること"
          value={`${s.todayTaskCount}件`}
          icon={<ListChecks size={17} />}
          sub={s.overdueTaskCount > 0 ? `うち期限切れ${s.overdueTaskCount}件` : "期限切れなし"}
          tone={s.overdueTaskCount > 0 ? "alert" : "default"}
        />
      </div>

      <div className="mb-5 grid gap-5 lg:grid-cols-3">
        <Card
          title="月次の入金推移"
          icon={<TrendingUp size={16} />}
          className="lg:col-span-2"
          action={<span className="num text-xs text-warm-500">6ヶ月計 {formatYen(sixMonthTotal)}</span>}
        >
          <div className="px-3 pb-4 pt-3 sm:px-5">
            <RevenueChart data={revenue} />
          </div>
        </Card>
        <Card title="今日やること" icon={<ListChecks size={16} />} action={<MoreLink href="/tasks">すべて</MoreLink>}>
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

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="進行中の案件" icon={<Briefcase size={16} />} action={<MoreLink href="/projects">案件一覧</MoreLink>}>
          <ActiveProjects data={data} />
        </Card>
        <Card title="未入金の請求" icon={<Wallet size={16} />} action={<MoreLink href="/invoices">請求一覧</MoreLink>}>
          <InvoiceList invoices={unpaid} data={data} today={today} empty="未入金の請求はありません" />
        </Card>
      </div>
    </Page>
  );
}
