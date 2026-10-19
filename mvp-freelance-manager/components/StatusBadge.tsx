import { cn } from "@/lib/utils";
import {
  type InvoiceStatus,
  type ProjectStatus,
  INVOICE_STATUS_LABEL,
  PROJECT_STATUS_LABEL,
} from "@/types";

/**
 * Linear の課題ステータスと同じく「形＋文字」で状態を示す。色は使わず、
 * 期限超過（その画面の警告）だけをアクセント外の橙にする。
 */
type Glyph = "empty" | "half" | "full" | "cross";

const PROJECT_GLYPH: Record<ProjectStatus, Glyph> = {
  estimate: "empty",
  in_progress: "half",
  completed: "full",
  lost: "cross",
};

const INVOICE_GLYPH: Record<InvoiceStatus, Glyph> = {
  unpaid: "empty",
  overdue: "empty",
  paid: "full",
};

function StatusGlyph({ glyph }: { glyph: Glyph }) {
  return (
    <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 shrink-0" aria-hidden>
      <circle cx="7" cy="7" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {glyph === "half" && <path d="M7 3.5a3.5 3.5 0 0 1 0 7z" fill="currentColor" />}
      {glyph === "full" && (
        <>
          <circle cx="7" cy="7" r="5.5" fill="currentColor" />
          <path d="M4.6 7.2l1.6 1.6 3.2-3.4" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {glyph === "cross" && <path d="M5 5l4 4M9 5l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />}
    </svg>
  );
}

function Status({ glyph, label, className }: { glyph: Glyph; label: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap text-xs", className)}>
      <StatusGlyph glyph={glyph} />
      {label}
    </span>
  );
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <Status
      glyph={PROJECT_GLYPH[status]}
      label={PROJECT_STATUS_LABEL[status]}
      className={status === "lost" || status === "estimate" ? "text-warm-500" : "text-warm-900"}
    />
  );
}

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <Status
      glyph={INVOICE_GLYPH[status]}
      label={INVOICE_STATUS_LABEL[status]}
      className={status === "overdue" ? "font-semibold text-orange" : status === "paid" ? "text-warm-500" : "text-warm-900"}
    />
  );
}
