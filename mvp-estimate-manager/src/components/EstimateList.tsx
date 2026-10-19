"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Estimate, EstimateStatus } from "@/types";
import { STATUSES, STATUS_LABELS } from "@/types";
import { useEstimates } from "@/lib/store";
import { calcTotals, monthlyWon, summarize } from "@/lib/calc";
import { cn, daysBetween, estimateNumber, formatDate, formatYen, todayISO } from "@/lib/utils";
import Icon from "@/components/Icon";
import KpiCards from "@/components/KpiCards";
import LoadingState from "@/components/LoadingState";
import StatusBadge from "@/components/StatusBadge";

type Filter = EstimateStatus | "all";

const DUE_SOON_DAYS = 7;
const SPARK_MONTHS = 6;
const DELTA_SHOW_MS = 5000;

/** 一覧の列。見出し行と各行で同じ grid を使い、列をそろえる */
const ROW_GRID = "sm:grid-cols-[88px_minmax(0,1fr)_96px_120px_128px]";

/** 期限が近い送付済みの見積に、バッジではなく注記の文字で知らせる */
function DueNote({ estimate }: { estimate: Estimate }) {
  if (estimate.status !== "sent") return null;
  const left = daysBetween(todayISO(), estimate.validUntil);
  if (left > DUE_SOON_DAYS) return null;
  return (
    <span className="block whitespace-nowrap text-xs font-medium text-amber-800">
      {left < 0 ? "期限切れ" : `期限まで${left}日`}
    </span>
  );
}

export default function EstimateList() {
  const { estimates, wonDelta, takeWonDelta } = useEstimates();
  const [filter, setFilter] = useState<Filter>("all");
  // 承認で増えた受注額を受け取り、数秒だけ KPI に添える（受け取ったら store 側は 0 に戻す）
  const [shownDelta, setShownDelta] = useState(0);
  useEffect(() => {
    if (wonDelta === 0) return;
    setShownDelta(wonDelta);
    takeWonDelta();
  }, [wonDelta, takeWonDelta]);
  useEffect(() => {
    if (shownDelta === 0) return;
    const timer = window.setTimeout(() => setShownDelta(0), DELTA_SHOW_MS);
    return () => window.clearTimeout(timer);
  }, [shownDelta]);
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
    <div className="space-y-8">
      <KpiCards summary={summary} monthly={monthlyWon(estimates, todayISO(), SPARK_MONTHS)} wonDelta={shownDelta} />

      <section aria-label="見積一覧">
        <div className="flex flex-col gap-3 border-b border-line sm:flex-row sm:items-end sm:justify-between">
          {/* 狭い幅ではタブが横にスクロールする。右端のフェードで続きがあることを示す（末尾は余白に掛かるだけ） */}
          <div className="relative -mx-4 after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:w-10 after:bg-gradient-to-l after:from-white after:content-[''] sm:mx-0 sm:after:hidden">
          <div role="group" aria-label="ステータスで絞り込み" className="flex overflow-x-auto pl-4 pr-10 sm:px-0">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                aria-pressed={filter === tab.key}
                onClick={() => setFilter(tab.key)}
                className={cn(
                  "-mb-px inline-flex shrink-0 items-baseline gap-1.5 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm first:pl-0",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary",
                  filter === tab.key
                    ? "border-primary font-semibold text-primary"
                    : "border-transparent text-body hover:text-navy",
                )}
              >
                {tab.label}
                <span className={cn("tnum text-xs", filter === tab.key ? "text-primary" : "text-muted")}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
          </div>
          <label className="relative mb-3 block sm:mb-2 sm:w-64">
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

        <div aria-hidden="true" className={cn("hidden gap-x-4 border-b border-line py-2 text-xs text-muted sm:grid", ROW_GRID)}>
          <span>番号</span>
          <span>取引先 / 件名</span>
          <span>ステータス</span>
          <span>発行日</span>
          <span className="text-right">合計（税込）</span>
        </div>

        {visible.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">該当する見積がありません</p>
        ) : (
          <ul className="divide-y divide-line border-b border-line">
            {visible.map((e) => (
              <li key={e.id}>
                <Link
                  href={`/estimates/${e.id}`}
                  className={cn(
                    "-mx-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 px-4 py-3 hover:bg-canvas sm:mx-0 sm:px-0",
                    "focus-visible:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
                    ROW_GRID,
                  )}
                >
                  <span className="tnum order-3 text-xs text-muted sm:order-none sm:text-sm">
                    {estimateNumber(e.id)}
                    <span className="sm:hidden"> ・ {formatDate(e.issuedAt)}</span>
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-navy">{e.clientName}</span>
                    <span className="block truncate text-xs text-body">{e.subject}</span>
                  </span>
                  <span className="order-4 justify-self-end sm:order-none sm:justify-self-start">
                    <StatusBadge status={e.status} />
                  </span>
                  <span className="tnum hidden text-sm text-body sm:block">{formatDate(e.issuedAt)}</span>
                  <span className="text-right">
                    <span className="tnum block text-sm font-semibold text-navy">
                      {formatYen(calcTotals(e.items).total)}
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
