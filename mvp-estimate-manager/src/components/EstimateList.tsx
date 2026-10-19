"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Estimate, EstimateStatus } from "@/types";
import { STATUSES, STATUS_LABELS } from "@/types";
import { useEstimates } from "@/lib/store";
import { calcTotals, summarize } from "@/lib/calc";
import { cn, daysBetween, estimateNumber, formatDate, formatYen, todayISO } from "@/lib/utils";
import Icon from "@/components/Icon";
import KpiCards from "@/components/KpiCards";
import LoadingState from "@/components/LoadingState";
import StatusBadge from "@/components/StatusBadge";

type Filter = EstimateStatus | "all";

const DUE_SOON_DAYS = 7;

function DueNote({ estimate }: { estimate: Estimate }) {
  if (estimate.status !== "sent") return null;
  const left = daysBetween(todayISO(), estimate.validUntil);
  if (left > DUE_SOON_DAYS) return null;
  return (
    <span className="ml-2 whitespace-nowrap rounded bg-amber-50 px-1.5 py-0.5 text-[11px] font-semibold text-amber-800">
      {left < 0 ? "期限切れ" : `期限まで${left}日`}
    </span>
  );
}

export default function EstimateList() {
  const { estimates } = useEstimates();
  const [filter, setFilter] = useState<Filter>("all");
  const [keyword, setKeyword] = useState("");

  const sorted = useMemo(
    () =>
      [...(estimates ?? [])].sort(
        (a, b) => b.issuedAt.localeCompare(a.issuedAt) || b.id - a.id,
      ),
    [estimates],
  );

  if (!estimates) return <LoadingState />;

  const summary = summarize(estimates);
  const q = keyword.trim();
  const visible = sorted.filter(
    (e) =>
      (filter === "all" || e.status === filter) &&
      (q === "" || e.clientName.includes(q) || e.subject.includes(q)),
  );
  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "すべて", count: estimates.length },
    ...STATUSES.map((s) => ({ key: s, label: STATUS_LABELS[s], count: summary.count[s] })),
  ];

  return (
    <div className="space-y-5">
      <KpiCards summary={summary} />

      <section aria-label="見積一覧" className="overflow-hidden rounded-md bg-white shadow-card">
        <div className="flex flex-col gap-3 border-b border-line p-3 sm:flex-row sm:items-center sm:justify-between">
          <div role="group" aria-label="ステータスで絞り込み" className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                aria-pressed={filter === tab.key}
                onClick={() => setFilter(tab.key)}
                className={cn(
                  "whitespace-nowrap rounded px-3 py-1.5 text-sm font-medium",
                  filter === tab.key ? "bg-primary-soft text-primary" : "text-body hover:bg-canvas",
                )}
              >
                {tab.label}
                <span className="tnum ml-1 text-xs opacity-70">{tab.count}</span>
              </button>
            ))}
          </div>
          <label className="relative block sm:w-64">
            <span className="sr-only">取引先・件名で検索</span>
            <Icon name="search" className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="取引先・件名で検索"
              className="w-full rounded border border-line py-1.5 pl-8 pr-2 text-sm text-navy placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </label>
        </div>

        {visible.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted">該当する見積がありません</p>
        ) : (
          <ul className="divide-y divide-line">
            {visible.map((e) => (
              <li key={e.id}>
                <Link
                  href={`/estimates/${e.id}`}
                  className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-4 py-3 hover:bg-canvas focus-visible:bg-canvas focus-visible:outline-none sm:grid-cols-[120px_1fr_100px_140px]"
                >
                  <span className="order-3 col-span-2 text-xs text-muted sm:order-none sm:col-span-1">
                    <span className="tnum">{estimateNumber(e.id)}</span>
                    <span className="sm:block">
                      <span className="sm:hidden"> ・ </span>
                      {formatDate(e.issuedAt)}
                    </span>
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-navy">{e.clientName}</span>
                    <span className="block truncate text-xs text-body">{e.subject}</span>
                  </span>
                  <span className="hidden sm:block">
                    <StatusBadge status={e.status} />
                  </span>
                  <span className="text-right">
                    <span className="tnum block text-sm font-semibold text-navy">
                      {formatYen(calcTotals(e.items).total)}
                    </span>
                    <span className="mt-0.5 flex items-center justify-end sm:hidden">
                      <StatusBadge status={e.status} />
                    </span>
                    <DueNote estimate={e} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
