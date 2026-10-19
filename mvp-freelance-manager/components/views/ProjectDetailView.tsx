"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ListChecks, Receipt } from "lucide-react";
import { actions, useAppStore } from "@/lib/store";
import { formatDate, formatRelative } from "@/lib/dates";
import { dueLabel, projectProgress, sortTasks, sortInvoices } from "@/lib/selectors";
import { formatYen } from "@/lib/utils";
import { buttonStyles, Card, Page, PageSkeleton } from "@/components/ui";
import { TaskRow } from "@/components/TaskRow";
import { TaskQuickAdd } from "@/components/TaskQuickAdd";
import { InvoiceList } from "@/components/InvoiceList";
import { InvoiceForm } from "@/components/InvoiceForm";
import { PROJECT_STATUS_LABEL, PROJECT_STATUSES, type ProjectStatus } from "@/types";

export function ProjectDetailView({ id }: { id: string }) {
  const store = useAppStore();
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  if (!store) return <PageSkeleton />;
  const { data, today } = store;

  const project = data.projects.find((p) => p.id === id);
  if (!project) {
    return (
      <Page narrow>
        <p className="py-16 text-center text-sm text-warm-500">
          案件が見つかりません。
          <Link href="/projects" className="ml-1 text-blue hover:underline">
            案件一覧へ
          </Link>
        </p>
      </Page>
    );
  }

  const prog = projectProgress(project, data);
  const tasks = sortTasks(data.tasks.filter((t) => t.projectId === id));
  const invoices = sortInvoices(data.invoices.filter((inv) => inv.projectId === id), today);
  const uninvoiced = Math.max(0, project.amount - prog.invoiced);
  const meta = [
    { label: "受注額", value: formatYen(project.amount) },
    { label: "請求済", value: formatYen(prog.invoiced) },
    { label: "入金済", value: formatYen(prog.paid) },
    { label: dueLabel(project), value: `${formatDate(project.dueDate)}（${formatRelative(today, project.dueDate)}）` },
  ];

  return (
    <Page narrow>
      <Link href="/projects" className="mb-4 inline-flex items-center gap-1 text-xs text-warm-500 hover:text-ink">
        <ArrowLeft size={14} aria-hidden />
        案件一覧
      </Link>

      <section className="mb-5 rounded-xl border border-line bg-canvas p-5 shadow-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm text-warm-500">{project.client}</p>
            <h1 className="mt-0.5 text-xl font-bold tracking-tight text-ink sm:text-2xl">{project.name}</h1>
          </div>
          <label className="flex shrink-0 flex-col text-xs font-semibold text-warm-500">
            ステータス
            <select
              value={project.status}
              onChange={(e) => actions.setProjectStatus(project.id, e.target.value as ProjectStatus)}
              className={`${buttonStyles.input} mt-1 sm:w-36`}
            >
              {PROJECT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {PROJECT_STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {meta.map((m) => (
            <div key={m.label} className="min-w-0">
              <dt className="text-xs text-warm-500">{m.label}</dt>
              <dd className="num mt-0.5 truncate text-sm font-semibold text-ink">{m.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="grid gap-5">
        <Card
          title="タスク"
          icon={<ListChecks size={16} />}
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
          icon={<Receipt size={16} />}
          action={
            <button
              type="button"
              onClick={() => setShowInvoiceForm((v) => !v)}
              aria-expanded={showInvoiceForm}
              className="text-xs font-semibold text-blue hover:underline"
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
      </div>
    </Page>
  );
}
