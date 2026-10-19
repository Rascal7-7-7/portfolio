import type { AppData, Invoice, InvoiceStatus, ISODate, Project, Task } from "@/types";
import { diffDays, monthKey, shiftMonth } from "./dates.ts";

export function invoiceStatus(invoice: Invoice, today: ISODate): InvoiceStatus {
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
      .filter((inv) => !inv.paidOn && monthKey(inv.dueOn) === month)
      .reduce((sum, inv) => sum + inv.amount, 0);
    return { month, paid, expected };
  });
}

export interface DashboardSummary {
  readonly thisMonthPaid: number;
  readonly thisMonthExpected: number;
  readonly outstandingTotal: number;
  readonly outstandingCount: number;
  readonly overdueCount: number;
  readonly overdueTotal: number;
  readonly activeProjectCount: number;
  readonly activeProjectAmount: number;
  readonly todayTaskCount: number;
  readonly overdueTaskCount: number;
}

export function dashboardSummary(data: AppData, today: ISODate): DashboardSummary {
  const [revenue] = monthlyRevenue(data.invoices, today, 1);
  const unpaid = data.invoices.filter((inv) => !inv.paidOn);
  const overdue = unpaid.filter((inv) => invoiceStatus(inv, today) === "overdue");
  const active = data.projects.filter((p) => p.status === "in_progress");
  const openTasks = data.tasks.filter((t) => !t.done);
  return {
    thisMonthPaid: revenue.paid,
    thisMonthExpected: revenue.expected,
    outstandingTotal: unpaid.reduce((sum, inv) => sum + inv.amount, 0),
    outstandingCount: unpaid.length,
    overdueCount: overdue.length,
    overdueTotal: overdue.reduce((sum, inv) => sum + inv.amount, 0),
    activeProjectCount: active.length,
    activeProjectAmount: active.reduce((sum, p) => sum + p.amount, 0),
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
  const invoices = data.invoices.filter((inv) => inv.projectId === project.id);
  return {
    done: tasks.filter((t) => t.done).length,
    total: tasks.length,
    invoiced: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    paid: invoices.filter((inv) => inv.paidOn).reduce((sum, inv) => sum + inv.amount, 0),
  };
}

/** 受注額 − 既存の請求額合計。0 以下なら追加の請求はできない */
export function remainingBillable(project: Project, invoices: readonly Invoice[]): number {
  const invoiced = invoices.filter((inv) => inv.projectId === project.id).reduce((sum, inv) => sum + inv.amount, 0);
  return project.amount - invoiced;
}

const STATUS_ORDER: Record<InvoiceStatus, number> = { overdue: 0, unpaid: 1, paid: 2 };

/** 期限超過 → 未入金（期日が近い順）→ 入金済（新しい順） */
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

export function projectName(data: AppData, projectId: string): string {
  return data.projects.find((p) => p.id === projectId)?.name ?? "（削除された案件）";
}
