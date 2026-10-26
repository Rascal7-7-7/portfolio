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
  /** 元になった見積の番号（見積マネージャー側の EST-xxxx） */
  readonly estimateNo?: string;
  /** 納品物のデモ URL */
  readonly deliverableUrl?: string;
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
  readonly estimateNo?: string;
  /** 下書き（元の見積が承認待ち）。集計・未入金一覧には入れない */
  readonly draft?: boolean;
  /** 明細（税抜）。合計は amount の税抜額と一致させる。無い請求は「案件名 1式」で表示 */
  readonly items?: readonly InvoiceItem[];
}

export interface InvoiceItem {
  readonly name: string;
  readonly qty: string;
  /** 単価（税抜）。見積書の単価列とそろえる */
  readonly unitPrice: number;
  readonly amount: number;
}

export type InvoiceStatus = "draft" | "paid" | "unpaid" | "overdue";

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
  draft: "下書き",
  paid: "入金済",
  unpaid: "未入金",
  overdue: "期限超過",
};

