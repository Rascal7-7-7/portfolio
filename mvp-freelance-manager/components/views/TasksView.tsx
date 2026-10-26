"use client";

import { useAppStore } from "@/lib/store";
import { formatLongDate } from "@/lib/dates";
import { projectName, sortTasks, taskGroup, type TaskGroup } from "@/lib/selectors";
import { cn } from "@/lib/utils";
import { Card, Page, PageHeader, PageSkeleton } from "@/components/ui";
import { TaskRow } from "@/components/TaskRow";

/** 期限切れの見出しだけが、この画面で唯一の警告色 */
const GROUPS: { key: TaskGroup; label: string; alert?: boolean }[] = [
  { key: "overdue", label: "期限切れ", alert: true },
  { key: "today", label: "今日" },
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
    <Page>
      <PageHeader
        eyebrow={formatLongDate(today)}
        title="タスク"
        description={`全案件の未完了タスク ${open}件を、期日順にまとめています。`}
      />
      {/* Linear のリスト表示に倣い、1枚のリストを件数付きのグループ見出しで区切る */}
      <Card className="overflow-hidden">
        {GROUPS.map((g) => {
          const items = sorted.filter((t) => taskGroup(t, today) === g.key);
          if (items.length === 0) return null;
          return (
            <section key={g.key} aria-label={g.label} className="[&:last-child>ul]:border-b-0">
              <h2 className="flex items-center gap-2 border-b border-line bg-warm-50 px-4 py-2.5 text-xs font-semibold sm:px-5">
                <span className={cn(g.alert ? "text-orange" : "text-ink")}>{g.label}</span>
                <span className="num font-normal text-warm-500">{items.length}</span>
              </h2>
              <ul className="divide-y divide-line border-b border-line">
                {items.map((t) => (
                  <TaskRow
                    key={t.id}
                    task={t}
                    today={today}
                    project={{ id: t.projectId, name: projectName(data, t.projectId) }}
                  />
                ))}
              </ul>
            </section>
          );
        })}
      </Card>
    </Page>
  );
}
