"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Plus } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatDate } from "@/lib/dates";
import { dueLabel, projectProgress } from "@/lib/selectors";
import { formatYen } from "@/lib/utils";
import { buttonStyles, Card, MetricStrip, Page, PageHeader, PageSkeleton, SegmentButton } from "@/components/ui";
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
        title="案件"
        description="受注から納品・入金まで、案件ごとの状況をひと目で。"
        action={
          <Link href="/projects/new" className={buttonStyles.primary}>
            <Plus size={16} aria-hidden />
            案件を登録
          </Link>
        }
      />

      <MetricStrip
        className="mb-6"
        items={[
          { label: "進行中の受注額", value: formatYen(sum("in_progress")), sub: `${count("in_progress")}件` },
          { label: "見積中（見込み）", value: formatYen(sum("estimate")), sub: `${count("estimate")}件` },
          { label: "完了した案件", value: formatYen(sum("completed")), sub: `${count("completed")}件` },
        ]}
      />

      <div className="-mx-4 mb-2 flex gap-1 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" role="group" aria-label="ステータスで絞り込み">
        {tabs.map((t) => (
          <SegmentButton key={t.key} active={filter === t.key} onClick={() => setFilter(t.key)}>
            {t.label} <span className="num ml-0.5 text-warm-500">{t.n}</span>
          </SegmentButton>
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
                  <Link href={`/projects/${p.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-warm-50 sm:gap-4 sm:px-5">
                    <div className="hidden w-16 shrink-0 sm:block">
                      <ProjectStatusBadge status={p.status} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium break-words text-ink">{p.name}</p>
                      <div className="mt-0.5 sm:hidden">
                        <ProjectStatusBadge status={p.status} />
                      </div>
                      {/* 区切りごとに折り返し、語の途中で改行しない */}
                      <p className="mt-0.5 flex flex-wrap gap-x-1 text-xs text-warm-500">
                        <span className="min-w-0 break-words">{p.client}</span>
                        <span className="num whitespace-nowrap">・ {dueLabel(p)} {formatDate(p.dueDate)}</span>
                        <span className="num whitespace-nowrap">・ タスク {prog.done}/{prog.total}</span>
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="num text-sm font-medium text-ink">{formatYen(p.amount)}</p>
                      <p className="num text-xs text-warm-500">入金 {formatYen(prog.paid)}</p>
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
