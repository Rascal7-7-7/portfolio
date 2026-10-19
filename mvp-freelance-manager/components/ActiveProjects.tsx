import Link from "next/link";
import { diffDays, formatRelative } from "@/lib/dates";
import { dueLabel, projectProgress } from "@/lib/selectors";
import { clientInitial, cn, formatYen } from "@/lib/utils";
import type { AppData, ISODate } from "@/types";

/** Linear のプロジェクト一覧に倣い、名前・進捗・金額を1行に並べる */
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
              className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 px-4 py-3 hover:bg-warm-50 sm:grid-cols-[minmax(0,1fr)_minmax(0,220px)_140px] sm:gap-x-8 sm:px-5"
            >
              <div className="col-span-2 flex min-w-0 items-start gap-3 sm:col-span-1">
                {/* 取引先の頭文字。色で塗り分けず無彩色にそろえる */}
                <span
                  aria-hidden
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-warm-200 text-xs font-semibold text-warm-900"
                >
                  {clientInitial(p.client)}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium break-words text-ink">{p.name}</p>
                  <p className="flex flex-wrap gap-x-2.5 text-xs text-warm-500">
                    <span className="min-w-0 truncate">{p.client}</span>
                    <span
                      className={cn("num whitespace-nowrap", late && "font-semibold text-orange")}
                      title={`${dueLabel(p)}まで`}
                    >
                      {formatRelative(today, p.dueDate)}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 pl-10 sm:pl-0">
                <div
                  className="h-1 flex-1 overflow-hidden rounded-full bg-warm-200"
                  role="progressbar"
                  aria-label={`${p.name}のタスク進捗`}
                  aria-valuemin={0}
                  aria-valuemax={prog.total}
                  aria-valuenow={prog.done}
                >
                  <div className="h-full bg-blue" style={{ width: `${ratio * 100}%` }} />
                </div>
                <span className="num w-16 shrink-0 text-right text-xs text-warm-500">
                  タスク {prog.done}/{prog.total}
                </span>
              </div>
              <div className="text-right">
                <p className="num text-sm font-medium text-ink">{formatYen(p.amount)}</p>
                <p className="num text-xs text-warm-500">入金 {formatYen(prog.paid)}</p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
