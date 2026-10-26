import { cn } from "@/lib/utils";
import {
  type InvoiceStatus,
  type ProjectStatus,
  INVOICE_STATUS_LABEL,
  PROJECT_STATUS_LABEL,
} from "@/types";

/**
 * 状態は淡い地の小さな札で示す（記号は付けない）。色は使い分けを絞り、
 * 動いているもの（進行中・未入金）だけアクセントの青、期限超過（その画面の警告）だけをアクセント外の橙にする。
 */
const TONE = {
  active: "bg-blue-tint/55 text-blue-active",
  neutral: "bg-warm-100 text-warm-900",
  quiet: "bg-warm-100 text-warm-500",
  warn: "bg-orange/[0.08] font-semibold text-orange",
} as const;

function Status({ label, tone }: { label: string; tone: keyof typeof TONE }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] leading-4 font-medium whitespace-nowrap",
        TONE[tone],
      )}
    >
      {label}
    </span>
  );
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <Status
      label={PROJECT_STATUS_LABEL[status]}
      tone={status === "in_progress" ? "active" : status === "completed" ? "neutral" : "quiet"}
    />
  );
}

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <Status
      label={INVOICE_STATUS_LABEL[status]}
      tone={status === "overdue" ? "warn" : status === "unpaid" ? "active" : "quiet"}
    />
  );
}
