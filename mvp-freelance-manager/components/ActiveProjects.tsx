import Link from "next/link";
import { projectProgress } from "@/lib/selectors";
import { formatYen } from "@/lib/utils";
import type { AppData } from "@/types";

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
            <Link href={`/projects/${p.id}`} className="block px-4 py-3 hover:bg-warm-50 sm:px-5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="min-w-0 text-sm font-medium break-words text-ink">{p.name}</p>
                <p className="num shrink-0 text-sm font-semibold text-ink">{formatYen(p.amount)}</p>
              </div>
              <div className="mt-0.5 flex items-center justify-between gap-3 text-xs text-warm-500">
                <span className="truncate">{p.client}</span>
                <span className="num shrink-0">入金 {formatYen(prog.paid)}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div
                  className="h-1.5 flex-1 overflow-hidden rounded-full bg-warm-200"
                  role="progressbar"
                  aria-label={`${p.name}のタスク進捗`}
                  aria-valuemin={0}
                  aria-valuemax={prog.total}
                  aria-valuenow={prog.done}
                >
                  <div className="h-full rounded-full bg-blue" style={{ width: `${ratio * 100}%` }} />
                </div>
                <span className="num w-20 shrink-0 text-right text-xs text-warm-500">
                  タスク {prog.done}/{prog.total}
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
