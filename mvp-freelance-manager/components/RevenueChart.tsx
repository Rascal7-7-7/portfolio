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
/** 過去の入金は灰、今月の入金は緑（入金済み）、今月期日の未入金は薄い朱の面（見込み）。色は帳面の 2 色＋墨・灰だけ */
const PAST_BAR = "bg-bar";
const CURRENT_BAR = "bg-moss";
/** 見込みは面を薄い朱で塗り、上端だけ朱の実線で縁取る（破線にすると欠けた棒に見えるため） */
const EXPECTED_BAR = "border-t-2 border-shu bg-shu-face";

interface RevenueChartProps {
  data: readonly MonthlyRevenue[];
  /** 今月の入金が増えた直後だけ渡す。増える前の高さ（比率 0〜1）から伸ばす */
  growFrom?: number | null;
}

/**
 * CSS の棒グラフ。目盛りは「¥0 / 中間 / 上限」の3本で、帳面の罫のように細い実線、底辺だけ墨の線。
 * 値と月のラベルは小さな灰色の数字で、今月だけ濃くする
 */
export function RevenueChart({ data, growFrom }: RevenueChartProps) {
  // 目盛りは表示中の6か月に合わせる（未回収の総額まで取ると、ふだんの棒がグラフの下1/4に潰れる）。
  // 入金で目盛りが変わったときは、棒の高さの transition で全体が滑らかに縮む
  const max = niceMax(Math.max(...data.map((m) => m.paid + m.expected)));
  const pct = (v: number) => `${(v / max) * 100}%`;
  const summary = data.map((m) => `${formatMonthLabel(m.month)} 入金${formatYen(m.paid)}`).join("、");

  return (
    <figure>
      <div className="flex gap-2 sm:gap-3" role="img" aria-label={`月次の入金推移: ${summary}`}>
        <div className="num relative h-60 w-10 shrink-0 text-right text-[11px] tracking-tight text-warm-500" aria-hidden>
          <div className="absolute inset-x-0 top-7 bottom-7 flex flex-col justify-between">
            {TICKS.map((r) => (
              <span key={r} className="h-0 leading-[0]">
                {r === 0 ? "¥0" : `¥${formatManYen(max * r)}`}
              </span>
            ))}
          </div>
        </div>
        <div className="relative flex h-60 flex-1 items-end gap-2.5 sm:gap-8" aria-hidden>
          <div className="pointer-events-none absolute inset-x-0 top-7 bottom-7 flex flex-col justify-between">
            {TICKS.map((r) => (
              <div key={r} className={cn("border-t", r === 0 ? "border-ink/70" : "border-line")} />
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
                      "num mb-2 tracking-tight",
                      isCurrent
                        ? "text-[13px] font-semibold text-ink"
                        : "text-[11px] text-warm-500",
                      grow && "anim-rise",
                    )}
                  >
                    {total > 0 ? formatManYen(total) : "—"}
                  </span>
                  <div
                    className="flex w-full max-w-14 flex-col transition-[height] duration-500 ease-out motion-reduce:transition-none"
                    style={{ height: pct(total) }}
                  >
                    {m.expected > 0 && (
                      <div className={cn("rounded-t-[2px]", EXPECTED_BAR)} style={{ flexGrow: m.expected }} />
                    )}
                    <div
                      key={isCurrent ? m.paid : undefined}
                      className={cn(
                        isCurrent ? CURRENT_BAR : PAST_BAR,
                        m.expected > 0 ? "" : "rounded-t-[2px]",
                        grow && "anim-grow",
                      )}
                      style={{ flexGrow: m.paid, ...(grow ? ({ "--grow-from": growFrom } as CSSProperties) : {}) }}
                    />
                  </div>
                </div>
                <span className={cn("num h-7 pt-2.5 text-xs", isCurrent ? "font-semibold text-ink" : "text-warm-500")}>
                  {formatMonthLabel(m.month)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      {/* 凡例の色見本は 12px 四方。見込みは棒と同じ「薄い朱の面＋上端の朱線」で見せる */}
      <figcaption className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-warm-500">
        <span className="flex items-center gap-2">
          <span className={cn("h-3 w-3 shrink-0", PAST_BAR)} aria-hidden />
          過去の入金
        </span>
        <span className="flex items-center gap-2">
          <span className={cn("h-3 w-3 shrink-0", CURRENT_BAR)} aria-hidden />
          今月の入金
        </span>
        <span className="flex items-center gap-2">
          <span className={cn("h-3 w-3 shrink-0", EXPECTED_BAR)} aria-hidden />
          今月期日の未入金（見込み）
        </span>
      </figcaption>
    </figure>
  );
}
