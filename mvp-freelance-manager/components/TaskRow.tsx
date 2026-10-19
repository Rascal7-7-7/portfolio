"use client";

import Link from "next/link";
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
  overdue: "font-semibold text-orange",
  today: "font-semibold text-blue",
  week: "text-warm-500",
  later: "text-warm-300",
  done: "text-warm-300",
} as const;

export function TaskRow({ task, today, project, deletable }: TaskRowProps) {
  const group = taskGroup(task, today);

  return (
    <li className="flex items-center gap-3 px-4 py-2.5 sm:px-5">
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => actions.toggleTask(task.id)}
        aria-label={`${task.title}（完了にする）`}
        className="h-[18px] w-[18px] shrink-0 cursor-pointer accent-[#0075de]"
      />
      <div className="min-w-0 flex-1">
        <p className={cn("truncate text-sm", task.done ? "text-warm-300 line-through" : "text-ink")}>
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
          className="shrink-0 rounded p-1 text-warm-300 hover:bg-black/5 hover:text-orange"
        >
          <Trash2 size={14} aria-hidden />
        </button>
      )}
    </li>
  );
}
