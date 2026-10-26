import type { AppData, Invoice, InvoiceStatus, ISODate, Project, Task } from "@/types";
import { diffDays, monthKey, shiftMonth } from "./dates.ts";

export function invoiceStatus(invoice: Invoice, today: ISODate): InvoiceStatus {
  if (invoice.draft) return "draft";
  if (invoice.paidOn) return "paid";
  return diffDays(today, invoice.dueOn) < 0 ? "overdue" : "unpaid";
}

export interface MonthlyRevenue {
  readonly month: string;
  /** その月に入金された金額 */
  readonly paid: number;
  /** その月が支払期日の未入金額（入金見込み） */
  readonly expected: number;
}

/** 発行済みで未入金（下書きは含めない）。未入金の集計・一覧はすべてこれを通す */
export function isOutstanding(invoice: Invoice): boolean {
  return !invoice.draft && !invoice.paidOn;
}

/** 今月を含む直近 months ヶ月の入金額・入金見込み */
export function monthlyRevenue(
  invoices: readonly Invoice[],
  today: ISODate,
  months = 6,
): MonthlyRevenue[] {
  return Array.from({ length: months }, (_, i) => {
    const month = shiftMonth(today, i - (months - 1));
    const paid = invoices
      .filter((inv) => inv.paidOn && monthKey(inv.paidOn) === month)
      .reduce((sum, inv) => sum + inv.amount, 0);
    const expected = invoices
      .filter((inv) => isOutstanding(inv) && monthKey(inv.dueOn) === month)
      .reduce((sum, inv) => sum + inv.amount, 0);
    return { month, paid, expected };
  });
}

export interface DashboardSummary {
  /** 今月入金された額（月次グラフの今月の入金と同じ） */
  readonly thisMonthPaid: number;
  /** 今月が期日の請求（入金済・未入金の両方） */
  readonly thisMonthDueTotal: number;
  readonly thisMonthDueCount: number;
  /** うち入金済の額 */
  readonly thisMonthDuePaid: number;
  /** 発行済みで未入金の合計（期限超過・今月期日・来月以降すべて） */
  readonly outstandingTotal: number;
  readonly overdueCount: number;
  readonly overdueTotal: number;
  /** 来月以降が期日の未入金（今後の入金予定） */
  readonly laterDueTotal: number;
  readonly laterDueCount: number;
  readonly activeProjectCount: number;
  readonly activeProjectAmount: number;
  readonly todayTaskCount: number;
  readonly overdueTaskCount: number;
}

const sum = (invoices: readonly Invoice[]): number => invoices.reduce((total, inv) => total + inv.amount, 0);

export function dashboardSummary(data: AppData, today: ISODate): DashboardSummary {
  const month = monthKey(today);
  const issued = data.invoices.filter((inv) => !inv.draft);
  const unpaid = issued.filter(isOutstanding);
  const overdue = unpaid.filter((inv) => invoiceStatus(inv, today) === "overdue");
  const dueThisMonth = issued.filter((inv) => monthKey(inv.dueOn) === month);
  const later = unpaid.filter((inv) => monthKey(inv.dueOn) > month);
  const active = data.projects.filter((p) => p.status === "in_progress");
  const openTasks = data.tasks.filter((t) => !t.done);
  return {
    thisMonthPaid: sum(issued.filter((inv) => inv.paidOn && monthKey(inv.paidOn) === month)),
    thisMonthDueTotal: sum(dueThisMonth),
    thisMonthDueCount: dueThisMonth.length,
    thisMonthDuePaid: sum(dueThisMonth.filter((inv) => inv.paidOn)),
    outstandingTotal: sum(unpaid),
    overdueCount: overdue.length,
    overdueTotal: sum(overdue),
    laterDueTotal: sum(later),
    laterDueCount: later.length,
    activeProjectCount: active.length,
    activeProjectAmount: active.reduce((total, p) => total + p.amount, 0),
    todayTaskCount: openTasks.filter((t) => diffDays(today, t.dueDate) <= 0).length,
    overdueTaskCount: openTasks.filter((t) => diffDays(today, t.dueDate) < 0).length,
  };
}

export interface ProjectProgress {
  readonly done: number;
  readonly total: number;
  readonly invoiced: number;
  readonly paid: number;
}

export function projectProgress(project: Project, data: AppData): ProjectProgress {
  const tasks = data.tasks.filter((t) => t.projectId === project.id);
  // 下書きはまだ請求していないので請求済に数えない
  const invoices = data.invoices.filter((inv) => inv.projectId === project.id && !inv.draft);
  return {
    done: tasks.filter((t) => t.done).length,
    total: tasks.length,
    invoiced: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    paid: invoices.filter((inv) => inv.paidOn).reduce((sum, inv) => sum + inv.amount, 0),
  };
}

/** 受注額 − 既存の請求額合計（下書きも含める。二重に請求しないため）。0 以下なら追加の請求はできない */
export function remainingBillable(project: Project, invoices: readonly Invoice[]): number {
  const invoiced = invoices.filter((inv) => inv.projectId === project.id).reduce((sum, inv) => sum + inv.amount, 0);
  return project.amount - invoiced;
}

const STATUS_ORDER: Record<InvoiceStatus, number> = { overdue: 0, unpaid: 1, draft: 2, paid: 3 };

/** 期限超過 → 未入金（期日が近い順）→ 下書き → 入金済（新しい順） */
export function sortInvoices(invoices: readonly Invoice[], today: ISODate): Invoice[] {
  return invoices.toSorted((a, b) => {
    const sa = invoiceStatus(a, today);
    const sb = invoiceStatus(b, today);
    if (sa !== sb) return STATUS_ORDER[sa] - STATUS_ORDER[sb];
    return sa === "paid" ? (b.paidOn ?? "").localeCompare(a.paidOn ?? "") : a.dueOn.localeCompare(b.dueOn);
  });
}

/** 年間契約は「納期」ではなく「契約満了」。ponytail: 案件名で判定、契約種別を持たせるならフィールド化する */
export function dueLabel(project: Project): string {
  return project.name.includes("年間契約") ? "契約満了" : "納期";
}

export type TaskGroup = "overdue" | "today" | "week" | "later" | "done";

export function taskGroup(task: Task, today: ISODate): TaskGroup {
  if (task.done) return "done";
  const days = diffDays(today, task.dueDate);
  if (days < 0) return "overdue";
  if (days === 0) return "today";
  if (days <= 7) return "week";
  return "later";
}

/** 未完了を期日順、完了は後ろへ */
export function sortTasks(tasks: readonly Task[]): Task[] {
  return [...tasks].sort((a, b) =>
    a.done === b.done ? a.dueDate.localeCompare(b.dueDate) : a.done ? 1 : -1,
  );
}

export interface ActivityItem {
  readonly key: string;
  readonly date: ISODate;
  readonly kind: "issued" | "paid" | "task";
  readonly text: string;
}

/** 案件の操作履歴を既存データから組み立てる（新しい順）。履歴テーブルは持たない */
export function projectActivity(projectId: string, data: AppData, limit = 8): ActivityItem[] {
  const invoices = data.invoices.filter((inv) => inv.projectId === projectId && !inv.draft);
  const items: ActivityItem[] = [
    ...invoices.flatMap((inv): ActivityItem[] => [
      { key: `${inv.id}-issued`, date: inv.issuedOn, kind: "issued", text: `請求書 ${inv.number} を発行` },
      ...(inv.paidOn
        ? [{ key: `${inv.id}-paid`, date: inv.paidOn, kind: "paid" as const, text: `${inv.number} の入金を記録` }]
        : []),
    ]),
    ...data.tasks
      .filter((t) => t.projectId === projectId && t.done)
      .map((t): ActivityItem => ({ key: `${t.id}-done`, date: t.doneOn ?? t.dueDate, kind: "task", text: `タスク「${t.title}」を完了` })),
  ];
  // 同じ日は「完了 → 入金 → 発行」の順（後で起きやすい操作を上に）
  const order = { task: 0, paid: 1, issued: 2 } as const;
  return items
    .toSorted((a, b) => b.date.localeCompare(a.date) || order[a.kind] - order[b.kind])
    .slice(0, limit);
}

export function projectName(data: AppData, projectId: string): string {
  return data.projects.find((p) => p.id === projectId)?.name ?? "（削除された案件）";
}
