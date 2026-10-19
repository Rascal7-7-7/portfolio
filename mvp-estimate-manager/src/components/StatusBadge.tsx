import { STATUS_LABELS } from "@/types";
import type { EstimateStatus } from "@/types";
import { cn } from "@/lib/utils";

/** 色を持つのは受注だけ（画面のアクセント1色）。ほかは灰色の濃淡と塗り/枠の違いで分け、文字ラベルで判別できる */
const STATUS_STYLES: Record<EstimateStatus, string> = {
  draft: "bg-slate-100 text-slate-700 ring-slate-200",
  sent: "bg-white text-navy ring-slate-400",
  won: "bg-primary text-white ring-primary",
  lost: "bg-white text-slate-500 ring-slate-200",
};

export default function StatusBadge({ status }: { status: EstimateStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded px-2 py-0.5 text-xs font-semibold ring-1 ring-inset",
        STATUS_STYLES[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
