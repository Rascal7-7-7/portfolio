/** 日付はすべてローカル日付の "YYYY-MM-DD" 文字列で持つ */
export type ISODate = string;

export type ProjectStatus = "estimate" | "in_progress" | "completed" | "lost";

export interface Project {
  readonly id: string;
  readonly name: string;
  readonly client: string;
  readonly amount: number;
  readonly status: ProjectStatus;
  readonly dueDate: ISODate;
}

export interface Task {
  readonly id: string;
  readonly projectId: string;
  readonly title: string;
  readonly dueDate: ISODate;
  readonly done: boolean;
  /** 完了にした日（アクティビティ表示用）。古い保存データには無い */
  readonly doneOn?: ISODate | null;
}

export interface Invoice {
  readonly id: string;
  readonly number: string;
  readonly projectId: string;
  readonly amount: number;
  readonly issuedOn: ISODate;
  readonly dueOn: ISODate;
  readonly paidOn: ISODate | null;
}

export type InvoiceStatus = "paid" | "unpaid" | "overdue";

export interface AppData {
  readonly projects: readonly Project[];
  readonly tasks: readonly Task[];
  readonly invoices: readonly Invoice[];
}

export const PROJECT_STATUSES: readonly ProjectStatus[] = [
  "in_progress",
  "estimate",
  "completed",
  "lost",
];

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  estimate: "見積中",
  in_progress: "進行中",
  completed: "完了",
  lost: "失注",
};

export const INVOICE_STATUS_LABEL: Record<InvoiceStatus, string> = {
  paid: "入金済",
  unpaid: "未入金",
  overdue: "期限超過",
};

