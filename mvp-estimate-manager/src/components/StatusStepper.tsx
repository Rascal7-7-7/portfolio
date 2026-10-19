import type { EstimateStatus } from "@/types";
import { cn } from "@/lib/utils";

const STEPS = ["下書き", "送付済み", "受注 / 失注"] as const;

const STEP_INDEX: Record<EstimateStatus, number> = { draft: 0, sent: 1, won: 2, lost: 2 };

export default function StatusStepper({ status }: { status: EstimateStatus }) {
  const current = STEP_INDEX[status];
  const lastLabel = status === "won" ? "受注" : status === "lost" ? "失注" : STEPS[2];

  return (
    <ol aria-label="進捗" className="flex items-center gap-2 text-xs font-semibold">
      {STEPS.map((step, i) => {
        const label = i === 2 ? lastLabel : step;
        const done = i <= current;
        return (
          <li key={step} className="flex items-center gap-2" aria-current={i === current ? "step" : undefined}>
            {i > 0 && <span aria-hidden="true" className={cn("h-px w-4 sm:w-8", done ? "bg-primary" : "bg-line")} />}
            <span
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap",
                done ? "text-navy" : "text-muted",
                i === 2 && status === "lost" && "text-rose-700",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[11px]",
                  done ? "bg-primary text-white" : "bg-canvas text-muted ring-1 ring-line",
                  i === 2 && status === "lost" && "bg-rose-600",
                )}
              >
                {i + 1}
              </span>
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
