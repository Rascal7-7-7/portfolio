"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Check, FileText, Landmark } from "lucide-react";
import { actions, useAppStore } from "@/lib/store";
import { formatAgo, formatDate, formatRelative } from "@/lib/dates";
import { dueLabel, projectActivity, projectProgress, remainingBillable, sortTasks, sortInvoices, type ActivityItem } from "@/lib/selectors";
import { formatYen } from "@/lib/utils";
import { Card, Page, PageSkeleton, SegmentButton } from "@/components/ui";
import { TaskRow } from "@/components/TaskRow";
import { TaskQuickAdd } from "@/components/TaskQuickAdd";
import { InvoiceList } from "@/components/InvoiceList";
import { InvoiceForm } from "@/components/InvoiceForm";
import { EstimateSource, ExternalLink } from "@/components/ExternalLink";
import { PROJECT_STATUS_LABEL, PROJECT_STATUSES } from "@/types";

const ACTIVITY_ICON: Record<ActivityItem["kind"], typeof FileText> = {
  issued: FileText,
  paid: Landmark,
  task: Check,
};

/** Linear の案件アクティビティに倣い、何をしたかを相対時刻つきで新しい順に並べる */
function ActivityFeed({ items, today }: { items: readonly ActivityItem[]; today: string }) {
  if (items.length === 0) {
    return <p className="px-5 py-6 text-center text-sm text-warm-500">まだ記録はありません</p>;
  }
  return (
    <ol className="px-4 py-3 sm:px-5">
      {items.map((a, i) => {
        const Icon = ACTIVITY_ICON[a.kind];
        return (
          <li key={a.key} className="relative flex gap-3 py-2">
            {i < items.length - 1 && <span aria-hidden className="absolute top-[30px] -bottom-2 left-[9px] w-px bg-black/15" />}
            <Icon size={19} aria-hidden className={a.kind === "paid" ? "shrink-0 text-blue" : "shrink-0 text-warm-500"} />
            <p className="min-w-0 flex-1 text-sm break-words text-ink">{a.text}</p>
            <time dateTime={a.date} title={formatDate(a.date)} className="num shrink-0 text-xs text-warm-500">
              {formatAgo(today, a.date)}
            </time>
          </li>
        );
      })}
    </ol>
  );
}

export function ProjectDetailView({ id }: { id: string }) {
  const store = useAppStore();
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  if (!store) return <PageSkeleton />;
  const { data, today } = store;

  const project = data.projects.find((p) => p.id === id);
  if (!project) {
    return (
      <Page>
        <h1 className="py-16 text-center text-sm font-normal text-warm-500">
          案件が見つかりません。
          <Link href="/projects" className="ml-1 text-blue underline">
            案件一覧へ
          </Link>
        </h1>
      </Page>
    );
  }

  const prog = projectProgress(project, data);
  const tasks = sortTasks(data.tasks.filter((t) => t.projectId === id));
  const invoices = sortInvoices(data.invoices.filter((inv) => inv.projectId === id), today);
  // 下書き（見積の承認待ち）の分は請求予定なので未請求に数えない
  const uninvoiced = Math.max(0, remainingBillable(project, data.invoices));
  const meta = [
    { label: "受注額", value: formatYen(project.amount) },
    { label: "請求済", value: formatYen(prog.invoiced) },
    { label: "入金済", value: formatYen(prog.paid) },
    { label: dueLabel(project), value: `${formatDate(project.dueDate)}（${formatRelative(today, project.dueDate)}）` },
  ];

  return (
    <Page>
      <Link href="/projects" className="hit mb-4 inline-flex items-center gap-1 text-xs text-warm-500 hover:text-ink">
        <ArrowLeft size={14} aria-hidden />
        案件一覧
      </Link>

      <section className="mb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm text-warm-500">{project.client}</p>
            <h1 className="mt-0.5 text-xl font-semibold tracking-tight text-ink sm:text-2xl">{project.name}</h1>
            {(project.estimateNo || project.deliverableUrl) && (
              <div className="mt-2 flex flex-col gap-1 text-xs">
                {project.estimateNo && <EstimateSource estimateNo={project.estimateNo} />}
                {project.deliverableUrl && (
                  <span className="inline-flex flex-wrap items-center gap-x-2">
                    <span className="text-warm-500">納品物（デモ）</span>
                    <ExternalLink href={project.deliverableUrl}>{project.deliverableUrl.replace(/^https:\/\//, "")}</ExternalLink>
                  </span>
                )}
              </div>
            )}
          </div>
          {/* OS 標準の select ではなく、一覧の絞り込みと同じ切り替えボタンで選ぶ */}
          <div className="shrink-0">
            <p id="project-status-label" className="text-xs font-medium text-warm-900">ステータス</p>
            <div role="group" aria-labelledby="project-status-label" className="mt-1 flex gap-1">
              {PROJECT_STATUSES.map((s) => (
                <SegmentButton key={s} active={project.status === s} onClick={() => actions.setProjectStatus(project.id, s)}>
                  {PROJECT_STATUS_LABEL[s]}
                </SegmentButton>
              ))}
            </div>
          </div>
        </div>
        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-line py-4 sm:grid-cols-4">
          {meta.map((m) => (
            <div key={m.label} className="min-w-0">
              <dt className="text-xs text-warm-500">{m.label}</dt>
              <dd className="num mt-0.5 truncate text-sm font-medium text-ink">{m.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="grid gap-4">
        <Card
          title="タスク"
          action={<span className="num text-xs text-warm-500">完了 {prog.done}/{prog.total}</span>}
        >
          {tasks.length === 0 ? (
            <p className="px-5 py-6 text-center text-sm text-warm-500">タスクはまだありません</p>
          ) : (
            <ul className="divide-y divide-line">
              {tasks.map((t) => (
                <TaskRow key={t.id} task={t} today={today} deletable />
              ))}
            </ul>
          )}
          <TaskQuickAdd projectId={project.id} today={today} />
        </Card>

        <Card
          title="請求・入金"
          action={
            <button
              type="button"
              onClick={() => setShowInvoiceForm((v) => !v)}
              aria-expanded={showInvoiceForm}
              className="hit rounded text-xs font-medium text-ink hover:underline"
            >
              {showInvoiceForm ? "閉じる" : "＋ 請求書を作成"}
            </button>
          }
        >
          {showInvoiceForm && (
            <div className="border-b border-line bg-warm-50">
              <InvoiceForm
                key={prog.invoiced}
                projects={[project]}
                invoices={data.invoices}
                today={today}
                defaultProjectId={project.id}
                onCreated={() => setShowInvoiceForm(false)}
              />
            </div>
          )}
          <InvoiceList invoices={invoices} data={data} today={today} empty="この案件の請求はまだありません" withProject={false} />
          {uninvoiced > 0 && (
            <p className="num border-t border-line px-5 py-3 text-xs text-warm-500">
              未請求の残額 {formatYen(uninvoiced)}
            </p>
          )}
        </Card>

        <Card title="アクティビティ">
          <ActivityFeed items={projectActivity(project.id, data)} today={today} />
        </Card>
      </div>
    </Page>
  );
}
