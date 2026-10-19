import type { MonthlyRevenue } from "@/lib/selectors";
import { formatMonthLabel } from "@/lib/dates";
import { cn, formatManYen, formatYen } from "@/lib/utils";

/** 目盛りをきりの良い値（20万円単位）に丸める */
function niceMax(value: number): number {
  const step = 200_000;
  return Math.max(step, Math.ceil(value / step) * step);
}

/**
 * CSS の棒グラフ。Stripe の概要グラフに倣い、過去は無彩色・今月だけアクセント色、
 * 罫線は細く、値は小さな灰色の数字で添える。文字は HTML なので画面幅に関わらず読める
 */
export function RevenueChart({ data }: { data: readonly MonthlyRevenue[] }) {
  const max = niceMax(Math.max(...data.map((m) => m.paid + m.expected)));
  const pct = (v: number) => `${(v / max) * 100}%`;
  const summary = data.map((m) => `${formatMonthLabel(m.month)} 入金${formatYen(m.paid)}`).join("、");

  return (
    <figure>
      <div className="flex gap-3" role="img" aria-label={`月次の入金推移: ${summary}`}>
        <div className="num relative h-48 w-8 shrink-0 text-right text-[11px] text-warm-500" aria-hidden>
          <div className="absolute inset-x-0 top-6 bottom-6 flex flex-col justify-between">
            {[1, 0.5, 0].map((r) => (
              <span key={r} className="h-0 leading-[0]">
                {formatManYen(max * r)}
              </span>
            ))}
          </div>
        </div>
        <div className="relative flex h-48 flex-1 items-end gap-3 sm:gap-6" aria-hidden>
          <div className="pointer-events-none absolute inset-x-0 top-6 bottom-6 flex flex-col justify-between">
            {[1, 0.5, 0].map((r) => (
              <div key={r} className={cn("border-t", r === 0 ? "border-black/15" : "border-black/[0.06]")} />
            ))}
          </div>
          {data.map((m, i) => {
            const isCurrent = i === data.length - 1;
            return (
              <div key={m.month} className="relative flex h-full flex-1 flex-col items-center">
                <div className="relative flex w-full flex-1 flex-col items-center justify-end pt-6">
                  <span className={cn("num mb-1 text-[11px]", isCurrent ? "font-semibold text-ink" : "text-warm-500")}>
                    {formatManYen(m.paid + m.expected)}
                  </span>
                  <div className="flex w-full max-w-8 flex-col" style={{ height: pct(m.paid + m.expected) }}>
                    {m.expected > 0 && (
                      <div
                        className="rounded-t-[3px] border border-b-0 border-dashed border-blue/60"
                        style={{ flexGrow: m.expected }}
                      />
                    )}
                    <div
                      className={cn(isCurrent ? "bg-blue" : "bg-[#d3d0cc]", m.expected > 0 ? "" : "rounded-t-[3px]")}
                      style={{ flexGrow: m.paid }}
                    />
                  </div>
                </div>
                <span className={cn("num h-6 pt-1.5 text-[11px]", isCurrent ? "font-semibold text-ink" : "text-warm-500")}>
                  {formatMonthLabel(m.month)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <figcaption className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-warm-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-[2px] bg-[#d3d0cc]" aria-hidden />
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
