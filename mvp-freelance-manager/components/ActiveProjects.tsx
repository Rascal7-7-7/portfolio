import Link from "next/link";
import { projectProgress } from "@/lib/selectors";
import { formatYen } from "@/lib/utils";
import type { AppData } from "@/types";

/** Linear のプロジェクト一覧に倣い、名前・進捗・金額を1行に並べる */
export function ActiveProjects({ data }: { data: AppData }) {
  const active = data.projects.filter((p) => p.status === "in_progress");
  if (active.length === 0) {
    return <p className="px-5 py-8 text-center text-sm text-warm-500">進行中の案件はありません</p>;
  }

  return (
    <ul className="divide-y divide-line">
      {active.map((p) => {
        const prog = projectProgress(p, data);
        const ratio = prog.total === 0 ? 0 : prog.done / prog.total;
        return (
          <li key={p.id}>
            <Link
              href={`/projects/${p.id}`}
              className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 px-4 py-3 hover:bg-warm-50 sm:grid-cols-[minmax(0,1fr)_minmax(0,220px)_140px] sm:gap-x-8 sm:px-5"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium break-words text-ink">{p.name}</p>
                <p className="truncate text-xs text-warm-500">{p.client}</p>
              </div>
              <div className="col-span-2 flex items-center gap-2 sm:col-span-1">
                <div
                  className="h-1 flex-1 overflow-hidden rounded-full bg-warm-200"
                  role="progressbar"
                  aria-label={`${p.name}のタスク進捗`}
                  aria-valuemin={0}
                  aria-valuemax={prog.total}
                  aria-valuenow={prog.done}
                >
                  <div className="h-full bg-warm-900" style={{ width: `${ratio * 100}%` }} />
                </div>
                <span className="num w-16 shrink-0 text-right text-xs text-warm-500">
                  タスク {prog.done}/{prog.total}
                </span>
              </div>
              <div className="col-start-2 row-start-1 text-right sm:col-start-3">
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
