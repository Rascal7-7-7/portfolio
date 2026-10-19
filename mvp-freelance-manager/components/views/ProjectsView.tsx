"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Plus } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatDate } from "@/lib/dates";
import { projectProgress } from "@/lib/selectors";
import { cn, formatYen } from "@/lib/utils";
import { buttonStyles, Card, Page, PageHeader, PageSkeleton } from "@/components/ui";
import { ProjectStatusBadge } from "@/components/StatusBadge";
import { PROJECT_STATUS_LABEL, PROJECT_STATUSES, type ProjectStatus } from "@/types";

type Filter = ProjectStatus | "all";

export function ProjectsView() {
  const store = useAppStore();
  const [filter, setFilter] = useState<Filter>("all");
  if (!store) return <PageSkeleton />;
  const { data } = store;

  const count = (status: ProjectStatus) => data.projects.filter((p) => p.status === status).length;
  const sum = (status: ProjectStatus) =>
    data.projects.filter((p) => p.status === status).reduce((s, p) => s + p.amount, 0);
  const visible = filter === "all" ? data.projects : data.projects.filter((p) => p.status === filter);
  const tabs: { key: Filter; label: string; n: number }[] = [
    { key: "all", label: "すべて", n: data.projects.length },
    ...PROJECT_STATUSES.map((s) => ({ key: s, label: PROJECT_STATUS_LABEL[s], n: count(s) })),
  ];

  return (
    <Page>
      <PageHeader
        eyebrow="Projects"
        title="案件"
        description="受注から納品・入金まで、案件ごとの状況をひと目で。"
        action={
          <Link href="/projects/new" className={buttonStyles.primary}>
            <Plus size={16} aria-hidden />
            案件を登録
          </Link>
        }
      />

      <dl className="mb-5 grid grid-cols-3 gap-3">
        {[
          { label: "進行中の受注額", value: sum("in_progress") },
          { label: "見積中（見込み）", value: sum("estimate") },
          { label: "完了した案件", value: sum("completed") },
        ].map((item) => (
          <div key={item.label} className="min-w-0 rounded-xl border border-line bg-canvas p-3 shadow-card sm:p-4">
            <dt className="text-[11px] font-semibold text-warm-500 sm:text-xs">{item.label}</dt>
            <dd className="num mt-1 truncate text-sm font-bold text-ink sm:text-xl">{formatYen(item.value)}</dd>
          </div>
        ))}
      </dl>

      <div className="-mx-4 mb-3 flex gap-1.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" role="group" aria-label="ステータスで絞り込み">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            aria-pressed={filter === t.key}
            onClick={() => setFilter(t.key)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
              filter === t.key ? "bg-ink text-white" : "bg-black/5 text-warm-500 hover:bg-black/10",
            )}
          >
            {t.label} <span className="num opacity-70">{t.n}</span>
          </button>
        ))}
      </div>

      <Card>
        {visible.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-warm-500">該当する案件はありません</p>
        ) : (
          <ul className="divide-y divide-line">
            {visible.map((p) => {
              const prog = projectProgress(p, data);
              return (
                <li key={p.id}>
                  <Link href={`/projects/${p.id}`} className="flex items-center gap-3 px-4 py-3.5 hover:bg-warm-50 sm:px-5">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="min-w-0 text-sm font-medium break-words text-ink">{p.name}</p>
                        <ProjectStatusBadge status={p.status} />
                      </div>
                      {/* 区切りごとに折り返し、語の途中で改行しない */}
                      <p className="mt-0.5 flex flex-wrap gap-x-1 text-xs text-warm-500">
                        <span className="min-w-0 break-words">{p.client}</span>
                        <span className="num whitespace-nowrap">・ 納期 {formatDate(p.dueDate)}</span>
                        <span className="num whitespace-nowrap">・ タスク {prog.done}/{prog.total}</span>
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="num text-sm font-semibold text-ink">{formatYen(p.amount)}</p>
                      <p className="num text-[11px] text-warm-500">入金 {formatYen(prog.paid)}</p>
                    </div>
                    <ChevronRight size={16} className="shrink-0 text-warm-300" aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </Page>
  );
}
