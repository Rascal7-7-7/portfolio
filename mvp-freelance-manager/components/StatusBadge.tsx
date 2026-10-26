import { cn } from "@/lib/utils";
import {
  type InvoiceStatus,
  type ProjectStatus,
  INVOICE_STATUS_LABEL,
  PROJECT_STATUS_LABEL,
} from "@/types";

/**
 * 状態は帳面に押す小さな角印のような枠付きの札で示す（記号は付けない）。
 * 意味を持つ色は 2 つだけ：緑＝入金済・完了（順調に片付いたもの）、朱＝期限超過（要対応）。
 * 動いているもの（進行中・未入金）は墨の枠、見積中・失注・下書きは灰にする。
 */
const TONE = {
  active: "border-ink/70 text-ink",
  done: "border-moss/50 bg-moss-tint text-moss",
  quiet: "border-transparent bg-warm-100 text-warm-500",
  warn: "border-shu/50 bg-shu-tint font-semibold text-shu",
} as const;

function Status({ label, tone }: { label: string; tone: keyof typeof TONE }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[3px] border px-1.5 py-px text-[11px] leading-4 font-medium whitespace-nowrap",
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
      tone={status === "in_progress" ? "active" : status === "completed" ? "done" : "quiet"}
    />
  );
}

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <Status
      label={INVOICE_STATUS_LABEL[status]}
      tone={status === "overdue" ? "warn" : status === "unpaid" ? "active" : status === "paid" ? "done" : "quiet"}
    />
  );
}
