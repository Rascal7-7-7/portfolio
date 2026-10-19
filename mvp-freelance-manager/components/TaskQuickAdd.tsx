"use client";

import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { addDays } from "@/lib/dates";
import { actions } from "@/lib/store";
import { buttonStyles } from "@/components/ui";
import { DateInput } from "@/components/DateInput";
import type { ISODate } from "@/types";

export function TaskQuickAdd({ projectId, today }: { projectId: string; today: ISODate }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(addDays(today, 3));

  function submit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || !dueDate) return;
    actions.addTask({ projectId, title: trimmed.slice(0, 80), dueDate });
    setTitle("");
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 border-t border-dashed border-line p-4 sm:flex-row sm:px-5">
      <label className="sr-only" htmlFor="task-title">
        タスク名
      </label>
      <input
        id="task-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="タスクを追加（例：修正版を送付）"
        required
        maxLength={80}
        className={buttonStyles.input}
      />
      <label className="sr-only" htmlFor="task-due">
        期日
      </label>
      <DateInput id="task-due" value={dueDate} onChange={setDueDate} required className="shrink-0 sm:w-56" />
      <button type="submit" className={`${buttonStyles.secondary} shrink-0`}>
        <Plus size={15} aria-hidden />
        追加
      </button>
    </form>
  );
}
