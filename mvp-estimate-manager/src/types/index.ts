export type EstimateStatus = "draft" | "sent" | "won" | "lost";

export const STATUSES: readonly EstimateStatus[] = ["draft", "sent", "won", "lost"];

export const STATUS_LABELS: Record<EstimateStatus, string> = {
  draft: "下書き",
  sent: "送付済み",
  won: "受注",
  lost: "失注",
};

export interface LineItem {
  id: string;
  name: string;
  unit: string;
  unitPrice: number;
  quantity: number;
}

/** 日付はローカル日付の "YYYY-MM-DD" 文字列で持つ（タイムゾーンずれを避ける） */
export interface Estimate {
  id: number;
  clientName: string;
  contactName: string;
  subject: string;
  issuedAt: string;
  validUntil: string;
  note: string;
  items: LineItem[];
  status: EstimateStatus;
  /** 送付済みにした日。ステータス変更時に記録する */
  sentAt?: string;
  /** 受注・失注が決まった日 */
  decidedAt?: string;
}

export type EstimateInput = Omit<Estimate, "id" | "status" | "sentAt" | "decidedAt">;
