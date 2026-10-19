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
  /** 1画面のアクセント色は1色だけ。次に進める操作だけ primary、ほかは中立 */
  tone: "primary" | "neutral";
  message: string;
}

const ACTIONS: Record<EstimateStatus, Action[]> = {
  draft: [
    { to: "sent", label: "送付済みにする", icon: "send", tone: "primary", message: "送付済みにしました（デモのため実際のメールは送信されません）" },
  ],
  sent: [
    { to: "won", label: "受注にする", icon: "check", tone: "primary", message: "受注にしました。一覧の受注金額・受注率に反映されます" },
    { to: "lost", label: "失注にする", icon: "x", tone: "neutral", message: "失注にしました" },
  ],
  won: [{ to: "sent", label: "送付済みに戻す", icon: "reset", tone: "neutral", message: "送付済みに戻しました" }],
  lost: [{ to: "sent", label: "送付済みに戻す", icon: "reset", tone: "neutral", message: "送付済みに戻しました" }],
};

const TONE_CLASS: Record<Action["tone"], string> = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  neutral: "border border-line bg-white text-navy hover:bg-canvas",
};

const BUTTON =
  "inline-flex items-center justify-center gap-1.5 rounded px-3.5 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

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
    <div className="mx-auto max-w-6xl p-4 sm:p-8 print:max-w-none print:p-0">
      {/* 一覧・作成画面と同じ max-w-6xl の枠で左端を揃え、帳票は読みやすい幅に留める */}
      <div className="max-w-4xl print:max-w-none">
      <div className="print:hidden">
        <Link href="/estimates" className="inline-flex items-center gap-1 text-sm text-body hover:text-navy">
          <Icon name="back" />
          見積一覧
        </Link>

        <section aria-label="ステータス" className="mt-4 space-y-5 border-b border-line pb-6">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <div className="min-w-0">
              <p className="tnum flex items-center gap-2 text-sm text-muted">
                {estimateNumber(estimate.id)}
                <StatusBadge status={estimate.status} />
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-navy">{estimate.subject}</h1>
              <p className="mt-0.5 text-sm text-body">{estimate.clientName}</p>
            </div>
            <p className="sm:text-right">
              <span className="block text-xs text-muted">合計（税込）</span>
              <span className="tnum text-2xl font-semibold text-navy">{formatYen(calcTotals(estimate.items).total)}</span>
            </p>
          </div>

          <StatusStepper status={estimate.status} />

          <div className="flex flex-wrap gap-2">
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

          <p
            role="status"
            aria-live="polite"
            className={notice ? "text-balance flex items-start gap-2 rounded border border-line bg-canvas px-3 py-2 text-sm text-navy" : "sr-only"}
          >
            {notice && <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />}
            {notice}
          </p>
        </section>
      </div>

      <div className="mt-6 rounded bg-canvas p-3 sm:p-6 print:mt-0 print:bg-white print:p-0">
        <EstimateDocument estimate={estimate} id={estimate.id} />
      </div>
      </div>
    </div>
  );
}
