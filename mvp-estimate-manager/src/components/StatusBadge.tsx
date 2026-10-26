import { STATUS_LABELS } from "@/types";
import type { EstimateStatus } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Stripe の請求書一覧にならい、淡い地＋濃い文字＋小さな点で状態を色分けする。
 * 送付済み＝青（相手の返事待ち）、受注＝角印の朱、下書き・失注＝灰。色だけに頼らず文字ラベルでも判別できる
 */
const STATUS_STYLES: Record<EstimateStatus, { pill: string; dot: string }> = {
  draft: { pill: "bg-slate-100 text-slate-700", dot: "bg-slate-400" },
  sent: { pill: "bg-sky-50 text-sky-800 ring-1 ring-inset ring-sky-200", dot: "bg-sky-500" },
  won: { pill: "bg-shu-soft text-shu-ink ring-1 ring-inset ring-shu-line", dot: "bg-shu" },
  lost: { pill: "bg-white text-slate-500 ring-1 ring-inset ring-slate-200", dot: "bg-slate-300" },
};

export default function StatusBadge({ status }: { status: EstimateStatus }) {
  const style = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold",
        style.pill,
      )}
    >
      <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
      {STATUS_LABELS[status]}
    </span>
  );
}
