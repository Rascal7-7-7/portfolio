"use client";

import { useAppStore } from "@/lib/store";
import { formatLongDate } from "@/lib/dates";
import { projectName, sortTasks, taskGroup, type TaskGroup } from "@/lib/selectors";
import { cn } from "@/lib/utils";
import { Card, Page, PageHeader, PageSkeleton } from "@/components/ui";
import { TaskRow } from "@/components/TaskRow";

const GROUPS: { key: TaskGroup; label: string; accent?: string }[] = [
  { key: "overdue", label: "期限切れ", accent: "text-orange" },
  { key: "today", label: "今日", accent: "text-blue" },
  { key: "week", label: "7日以内" },
  { key: "later", label: "それ以降" },
  { key: "done", label: "完了" },
];

export function TasksView() {
  const store = useAppStore();
  if (!store) return <PageSkeleton />;
  const { data, today } = store;

  const sorted = sortTasks(data.tasks);
  const open = sorted.filter((t) => !t.done).length;

  return (
    <Page narrow>
      <PageHeader
        eyebrow={formatLongDate(today)}
        title="タスク"
        description={`全案件の未完了タスク ${open}件を、期日順にまとめています。`}
      />
      <div className="grid gap-5">
        {GROUPS.map((g) => {
          const items = sorted.filter((t) => taskGroup(t, today) === g.key);
          if (items.length === 0) return null;
          return (
            <Card
              key={g.key}
              title={g.label}
              icon={<span className={cn("num text-xs font-bold", g.accent)}>{items.length}</span>}
            >
              <ul className="divide-y divide-line">
                {items.map((t) => (
                  <TaskRow
                    key={t.id}
                    task={t}
                    today={today}
                    project={{ id: t.projectId, name: projectName(data, t.projectId) }}
                  />
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
    </Page>
  );
}
