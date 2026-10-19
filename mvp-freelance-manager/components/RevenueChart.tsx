import type { CSSProperties } from "react";
import type { MonthlyRevenue } from "@/lib/selectors";
import { formatMonthLabel } from "@/lib/dates";
import { cn, formatManYen, formatYen } from "@/lib/utils";

/** 目盛りをきりの良い値（20万円単位）に丸める */
function niceMax(value: number): number {
  const step = 200_000;
  return Math.max(step, Math.ceil(value / step) * step);
}

const TICKS = [1, 0.5, 0] as const;
/** 過去の棒はアクセントの青を薄めたもの。色相を増やさず「今月だけ濃い」で差を付ける */
const PAST_BAR = "bg-blue/25";

interface RevenueChartProps {
  data: readonly MonthlyRevenue[];
  /** 今月の入金が増えた直後だけ渡す。増える前の高さ（比率 0〜1）から伸ばす */
  growFrom?: number | null;
  /** 目盛りの上限に含める額。今月の入金＋未回収の合計を渡すと、どの請求を入金済にしても目盛りが変わらない */
  ceiling?: number;
}

/**
 * CSS の棒グラフ。Stripe ホームの売上グラフに倣い、目盛りは「¥0 / ¥60万 / ¥120万」の3本、
 * 罫線は点線で薄く、底辺だけ実線。値と月のラベルは小さな灰色の数字で、今月だけ濃くする
 */
export function RevenueChart({ data, growFrom, ceiling = 0 }: RevenueChartProps) {
  const max = niceMax(Math.max(ceiling, ...data.map((m) => m.paid + m.expected)));
  const pct = (v: number) => `${(v / max) * 100}%`;
  const summary = data.map((m) => `${formatMonthLabel(m.month)} 入金${formatYen(m.paid)}`).join("、");

  return (
    <figure>
      <div className="flex gap-2 sm:gap-3" role="img" aria-label={`月次の入金推移: ${summary}`}>
        <div className="num relative h-52 w-10 shrink-0 text-right text-[11px] tracking-tight text-warm-500" aria-hidden>
          <div className="absolute inset-x-0 top-7 bottom-7 flex flex-col justify-between">
            {TICKS.map((r) => (
              <span key={r} className="h-0 leading-[0]">
                {r === 0 ? "¥0" : `¥${formatManYen(max * r)}`}
              </span>
            ))}
          </div>
        </div>
        <div className="relative flex h-52 flex-1 items-end gap-2 sm:gap-5" aria-hidden>
          <div className="pointer-events-none absolute inset-x-0 top-7 bottom-7 flex flex-col justify-between">
            {TICKS.map((r) => (
              <div key={r} className={cn("border-t", r === 0 ? "border-black/20" : "border-dashed border-black/[0.09]")} />
            ))}
          </div>
          {data.map((m, i) => {
            const isCurrent = i === data.length - 1;
            const total = m.paid + m.expected;
            const grow = isCurrent && growFrom != null && growFrom < 1;
            return (
              <div key={m.month} className="relative flex h-full flex-1 flex-col items-center">
                <div className="relative flex w-full flex-1 flex-col items-center justify-end pt-7">
                  <span
                    key={isCurrent ? m.paid : undefined}
                    className={cn(
                      "num mb-1.5 text-[11px] tracking-tight",
                      isCurrent ? "font-semibold text-ink" : "text-warm-500",
                      grow && "anim-rise",
                    )}
                  >
                    {total > 0 ? formatManYen(total) : "—"}
                  </span>
                  <div className="flex w-full max-w-9 flex-col" style={{ height: pct(total) }}>
                    {m.expected > 0 && (
                      <div
                        className="rounded-t-[4px] border border-b-0 border-dashed border-blue/60"
                        style={{ flexGrow: m.expected }}
                      />
                    )}
                    <div
                      key={isCurrent ? m.paid : undefined}
                      className={cn(
                        isCurrent ? "bg-blue" : PAST_BAR,
                        m.expected > 0 ? "" : "rounded-t-[4px]",
                        grow && "anim-grow",
                      )}
                      style={{ flexGrow: m.paid, ...(grow ? ({ "--grow-from": growFrom } as CSSProperties) : {}) }}
                    />
                  </div>
                </div>
                <span className={cn("num h-7 pt-2 text-[11px]", isCurrent ? "font-semibold text-ink" : "text-warm-500")}>
                  {formatMonthLabel(m.month)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <figcaption className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-warm-500">
        <span className="flex items-center gap-1.5">
          <span className={cn("h-2 w-2 rounded-[2px]", PAST_BAR)} aria-hidden />
          過去の入金
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-[2px] bg-blue" aria-hidden />
          今月の入金
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-[2px] border border-dashed border-blue/60" aria-hidden />
          今月期日の未入金（見込み）
        </span>
      </figcaption>
    </figure>
  );
}
