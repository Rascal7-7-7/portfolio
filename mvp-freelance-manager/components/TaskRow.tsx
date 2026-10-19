"use client";

import Link from "next/link";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { actions } from "@/lib/store";
import { formatDate, formatRelative } from "@/lib/dates";
import { taskGroup } from "@/lib/selectors";
import { cn } from "@/lib/utils";
import type { ISODate, Task } from "@/types";

interface TaskRowProps {
  task: Task;
  today: ISODate;
  /** 横断ビューでは案件名を出す。案件詳細では出さない */
  project?: { id: string; name: string };
  deletable?: boolean;
}

const DUE_STYLE = {
  overdue: "font-semibold text-ink",
  today: "font-medium text-ink",
  week: "text-warm-500",
  later: "text-warm-300",
  done: "text-warm-300",
} as const;

/** 完了にした行を打ち消し線の状態で少し残してから移動させ、次の行が詰まって誤クリックされるのを防ぐ */
const COMPLETE_DELAY_MS = 300;

export function TaskRow({ task, today, project, deletable }: TaskRowProps) {
  const [completing, setCompleting] = useState(false);
  const done = task.done || completing;
  const group = done ? "done" : taskGroup(task, today);

  function toggle(): void {
    if (completing) return;
    if (task.done) return actions.toggleTask(task.id);
    setCompleting(true);
    // 行が移動するとこのコンポーネントは外れることがある（React 19 ではアンマウント後の setState は無害）
    window.setTimeout(() => {
      actions.toggleTask(task.id);
      setCompleting(false);
    }, COMPLETE_DELAY_MS);
  }

  return (
    <li
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 transition-opacity duration-300 motion-reduce:transition-none sm:px-5",
        completing && "opacity-60",
      )}
    >
      <input
        type="checkbox"
        checked={done}
        onChange={toggle}
        aria-label={`${task.title}（完了にする）`}
        className="h-[18px] w-[18px] shrink-0 cursor-pointer accent-[#31302e]"
      />
      <div className="min-w-0 flex-1">
        <p className={cn("line-clamp-2 text-sm break-words", done ? "text-warm-300 line-through" : "text-ink")}>
          {task.title}
        </p>
        {project && (
          <Link href={`/projects/${project.id}`} className="block truncate text-xs text-warm-500 hover:underline">
            {project.name}
          </Link>
        )}
      </div>
      <span className={cn("num shrink-0 text-xs", DUE_STYLE[group])}>
        {task.done ? formatDate(task.dueDate) : formatRelative(today, task.dueDate)}
      </span>
      {deletable && (
        <button
          type="button"
          onClick={() => actions.deleteTask(task.id)}
          aria-label={`${task.title}を削除`}
          className="shrink-0 rounded p-1 text-warm-300 hover:bg-black/5 hover:text-ink"
        >
          <Trash2 size={14} aria-hidden />
        </button>
      )}
    </li>
  );
}
