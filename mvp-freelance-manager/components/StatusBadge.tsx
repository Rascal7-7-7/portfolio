import { cn } from "@/lib/utils";
import {
  type InvoiceStatus,
  type ProjectStatus,
  INVOICE_STATUS_LABEL,
  PROJECT_STATUS_LABEL,
} from "@/types";

/**
 * 状態は文字と色だけで示す（記号は付けない）。色は使い分けを絞り、
 * 期限超過（その画面の警告）だけをアクセント外の橙にする。
 */
function Status({ label, className }: { label: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center whitespace-nowrap text-xs", className)}>
      {label}
    </span>
  );
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <Status
      label={PROJECT_STATUS_LABEL[status]}
      className={status === "lost" || status === "estimate" ? "text-warm-500" : "text-warm-900"}
    />
  );
}

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <Status
      label={INVOICE_STATUS_LABEL[status]}
      className={status === "overdue" ? "font-semibold text-orange" : status === "paid" ? "text-warm-500" : "text-warm-900"}
    />
  );
}
