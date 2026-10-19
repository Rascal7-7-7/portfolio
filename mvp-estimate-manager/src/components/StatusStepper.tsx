import type { EstimateStatus } from "@/types";
import { cn } from "@/lib/utils";

const STEPS = ["下書き", "送付済み", "受注 / 失注"] as const;

const STEP_INDEX: Record<EstimateStatus, number> = { draft: 0, sent: 1, won: 2, lost: 2 };

/** 番号付きの丸ではなく、細い進捗バー＋文字で現在地を示す */
export default function StatusStepper({ status }: { status: EstimateStatus }) {
  const current = STEP_INDEX[status];
  const lastLabel = status === "won" ? "受注" : status === "lost" ? "失注" : STEPS[2];

  return (
    <ol aria-label="進捗" className="grid grid-cols-3 gap-1 text-xs">
      {STEPS.map((step, i) => {
        const done = i <= current;
        return (
          <li key={step} aria-current={i === current ? "step" : undefined}>
            <span aria-hidden="true" className={cn("block h-1 rounded-sm", done ? "bg-primary" : "bg-line")} />
            <span className={cn("mt-1.5 block", i === current ? "font-semibold text-navy" : done ? "text-body" : "text-muted")}>
              {i === 2 ? lastLabel : step}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
