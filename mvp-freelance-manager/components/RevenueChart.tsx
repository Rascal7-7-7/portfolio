import type { MonthlyRevenue } from "@/lib/selectors";
import { formatMonthLabel } from "@/lib/dates";
import { cn, formatManYen, formatYen } from "@/lib/utils";

/** 目盛りをきりの良い値（20万円単位）に丸める */
function niceMax(value: number): number {
  const step = 200_000;
  return Math.max(step, Math.ceil(value / step) * step);
}

/** CSS の棒グラフ。文字は HTML なので画面幅に関わらず読める大きさを保つ */
export function RevenueChart({ data }: { data: readonly MonthlyRevenue[] }) {
  const max = niceMax(Math.max(...data.map((m) => m.paid + m.expected)));
  const pct = (v: number) => `${(v / max) * 100}%`;
  const summary = data.map((m) => `${formatMonthLabel(m.month)} 入金${formatYen(m.paid)}`).join("、");

  return (
    <figure>
      <div className="flex gap-2" role="img" aria-label={`月次の入金推移: ${summary}`}>
        <div className="num relative h-52 w-9 shrink-0 text-right text-[11px] text-warm-300" aria-hidden>
          <div className="absolute inset-x-0 top-7 bottom-6 flex flex-col justify-between">
            {[1, 0.5, 0].map((r) => (
              <span key={r} className="h-0 leading-[0]">
                {formatManYen(max * r)}
              </span>
            ))}
          </div>
        </div>
        <div className="relative flex h-52 flex-1 items-end gap-2 sm:gap-4" aria-hidden>
          <div className="pointer-events-none absolute inset-x-0 top-7 bottom-6 flex flex-col justify-between">
            {[0, 1, 2].map((i) => (
              <div key={i} className="border-t border-black/[0.07]" />
            ))}
          </div>
          {data.map((m, i) => {
            const isCurrent = i === data.length - 1;
            return (
              <div key={m.month} className="relative flex h-full flex-1 flex-col items-center">
                <div className="relative flex w-full flex-1 flex-col items-center justify-end pt-7">
                  <span
                    className={cn(
                      "num mb-1 text-[11px] font-semibold sm:text-xs",
                      isCurrent ? "text-blue" : "text-warm-500",
                    )}
                  >
                    {formatManYen(m.paid + m.expected)}
                  </span>
                  <div className="flex w-full max-w-11 flex-col" style={{ height: pct(m.paid + m.expected) }}>
                    {m.expected > 0 && (
                      <div
                        className="rounded-t border border-dashed border-[#62aef0] bg-badge-blue"
                        style={{ flexGrow: m.expected }}
                      />
                    )}
                    <div
                      className={cn(
                        isCurrent ? "bg-blue" : "bg-[#9cc7ef]",
                        m.expected > 0 ? "rounded-b" : "rounded",
                      )}
                      style={{ flexGrow: m.paid }}
                    />
                  </div>
                </div>
                <span className={cn("h-6 pt-1.5 text-xs", isCurrent ? "font-bold text-ink" : "text-warm-500")}>
                  {isCurrent ? "今月" : formatMonthLabel(m.month)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <figcaption className="mt-3 flex flex-wrap gap-4 text-xs text-warm-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-blue" aria-hidden />
          入金済み
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm border border-dashed border-[#62aef0] bg-badge-blue" aria-hidden />
          今月期日の未入金（見込み）
        </span>
      </figcaption>
    </figure>
  );
}
