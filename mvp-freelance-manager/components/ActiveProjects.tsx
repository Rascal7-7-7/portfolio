import Link from "next/link";
import { diffDays, formatRelative } from "@/lib/dates";
import { dueLabel, projectProgress } from "@/lib/selectors";
import { cn, formatYen } from "@/lib/utils";
import type { AppData, ISODate } from "@/types";

/** 名前・進捗・金額を帳簿の1行のように並べる */
export function ActiveProjects({ data, today }: { data: AppData; today: ISODate }) {
  const active = data.projects.filter((p) => p.status === "in_progress");
  if (active.length === 0) {
    return <p className="px-5 py-8 text-center text-sm text-warm-500">進行中の案件はありません</p>;
  }

  return (
    <ul className="divide-y divide-line">
      {active.map((p) => {
        const prog = projectProgress(p, data);
        const ratio = prog.total === 0 ? 0 : prog.done / prog.total;
        const late = diffDays(today, p.dueDate) < 0;
        return (
          <li key={p.id}>
            <Link
              href={`/projects/${p.id}`}
              className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 px-4 py-3.5 transition-colors hover:bg-warm-100/70 sm:grid-cols-[minmax(0,1fr)_minmax(0,220px)_140px] sm:gap-x-8 sm:px-5"
            >
              <div className="col-span-2 min-w-0 sm:col-span-1">
                <p className="text-sm font-semibold break-words text-ink">{p.name}</p>
                <p className="flex flex-wrap gap-x-2.5 text-xs text-warm-500">
                  <span className="min-w-0 truncate">{p.client}</span>
                  <span
                    className={cn("num whitespace-nowrap", late && "font-semibold text-shu")}
                    title={`${dueLabel(p)}まで`}
                  >
                    {formatRelative(today, p.dueDate)}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="h-1.5 flex-1 overflow-hidden bg-warm-200"
                  role="progressbar"
                  aria-label={`${p.name}のタスク進捗`}
                  aria-valuemin={0}
                  aria-valuemax={prog.total}
                  aria-valuenow={prog.done}
                >
                  <div className="h-full bg-ink" style={{ width: `${ratio * 100}%` }} />
                </div>
                <span className="num w-16 shrink-0 text-right text-xs text-warm-500">
                  タスク {prog.done}/{prog.total}
                </span>
              </div>
              <div className="text-right">
                <p className="num text-[15px] font-semibold tracking-[-0.01em] text-ink">{formatYen(p.amount)}</p>
                <p className="num text-xs text-warm-500">入金 {formatYen(prog.paid)}</p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
