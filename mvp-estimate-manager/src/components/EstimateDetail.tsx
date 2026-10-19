"use client";

import Link from "next/link";
import { useState } from "react";
import type { EstimateStatus } from "@/types";
import { useEstimates } from "@/lib/store";
import { calcTotals } from "@/lib/calc";
import { estimateNumber, formatYen } from "@/lib/utils";
import EstimateDocument from "@/components/EstimateDocument";
import Icon, { type IconName } from "@/components/Icon";
import LoadingState from "@/components/LoadingState";
import NotFoundState from "@/components/NotFoundState";
import StatusBadge from "@/components/StatusBadge";
import StatusStepper from "@/components/StatusStepper";

interface Action {
  to: EstimateStatus;
  label: string;
  icon: IconName;
  tone: "primary" | "success" | "danger" | "neutral";
  message: string;
}

const ACTIONS: Record<EstimateStatus, Action[]> = {
  draft: [
    { to: "sent", label: "送付済みにする", icon: "send", tone: "primary", message: "送付済みにしました（デモのため実際のメールは送信されません）" },
  ],
  sent: [
    { to: "won", label: "受注にする", icon: "check", tone: "success", message: "受注にしました。一覧の受注金額・受注率に反映されます" },
    { to: "lost", label: "失注にする", icon: "x", tone: "danger", message: "失注にしました" },
  ],
  won: [{ to: "sent", label: "送付済みに戻す", icon: "reset", tone: "neutral", message: "送付済みに戻しました" }],
  lost: [{ to: "sent", label: "送付済みに戻す", icon: "reset", tone: "neutral", message: "送付済みに戻しました" }],
};

const TONE_CLASS: Record<Action["tone"], string> = {
  primary: "bg-primary text-white hover:bg-primary-hover shadow-card",
  success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-card",
  danger: "border border-rose-200 bg-white text-rose-700 hover:bg-rose-50",
  neutral: "border border-line bg-white text-body hover:bg-canvas",
};

const BUTTON = "inline-flex items-center justify-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-semibold";

interface Props {
  id: number;
  justSaved: boolean;
}

export default function EstimateDetail({ id, justSaved }: Props) {
  const { estimates, setStatus } = useEstimates();
  const [notice, setNotice] = useState(justSaved ? "保存しました。内容を確認して「送付済みにする」で送付できます" : "");

  if (!estimates) return <LoadingState />;
  const estimate = estimates.find((e) => e.id === id);
  if (!estimate) return <NotFoundState />;

  const handleAction = (action: Action) => {
    setStatus(estimate.id, action.to);
    setNotice(action.message);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5 p-4 sm:p-8 print:max-w-none print:p-0">
      <div className="space-y-4 print:hidden">
        <Link href="/estimates" className="inline-flex items-center gap-1 text-sm text-body hover:text-navy">
          <Icon name="back" />
          見積一覧
        </Link>

        <section aria-label="ステータス" className="space-y-4 rounded-md bg-white p-4 shadow-card sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="tnum flex items-center gap-2 text-xs text-muted">
                {estimateNumber(estimate.id)}
                <StatusBadge status={estimate.status} />
              </p>
              <h1 className="mt-1 text-xl font-semibold tracking-tight text-navy">{estimate.subject}</h1>
              <p className="text-sm text-body">{estimate.clientName}</p>
            </div>
            <p className="sm:text-right">
              <span className="block text-xs text-muted">合計（税込）</span>
              <span className="tnum text-2xl font-semibold text-navy">{formatYen(calcTotals(estimate.items).total)}</span>
            </p>
          </div>

          <StatusStepper status={estimate.status} />

          <div className="flex flex-wrap gap-2 border-t border-line pt-4">
            {ACTIONS[estimate.status].map((action) => (
              <button key={action.to} type="button" onClick={() => handleAction(action)} className={`${BUTTON} ${TONE_CLASS[action.tone]}`}>
                <Icon name={action.icon} />
                {action.label}
              </button>
            ))}
            <span className="hidden flex-1 sm:block" />
            <Link href={`/estimates/${estimate.id}/edit`} className={`${BUTTON} ${TONE_CLASS.neutral}`}>
              <Icon name="edit" />
              編集
            </Link>
            <button type="button" onClick={() => window.print()} className={`${BUTTON} ${TONE_CLASS.neutral}`}>
              <Icon name="print" />
              印刷
            </button>
          </div>

          <p role="status" aria-live="polite" className={notice ? "rounded bg-primary-soft px-3 py-2 text-sm text-primary" : "sr-only"}>
            {notice}
          </p>
        </section>
      </div>

      <EstimateDocument estimate={estimate} id={estimate.id} />
    </div>
  );
}
