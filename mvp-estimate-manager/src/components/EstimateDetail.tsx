"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Estimate, EstimateStatus } from "@/types";
import { useEstimates } from "@/lib/store";
import { calcTotals } from "@/lib/calc";
import { estimateNumber, formatShortDate, formatYen, HIKAE_INVOICES_URL, hikaeInvoiceNumber, hikaeInvoiceUrl } from "@/lib/utils";
import EstimateDocument from "@/components/EstimateDocument";
import Icon, { type IconName } from "@/components/Icon";
import LoadingState from "@/components/LoadingState";
import NotFoundState from "@/components/NotFoundState";
import StatusStepper from "@/components/StatusStepper";

interface Action {
  to: EstimateStatus;
  label: string;
  icon: IconName;
  message: string;
}

const ACTIONS: Record<EstimateStatus, Action[]> = {
  draft: [
    { to: "sent", label: "送付済みにする", icon: "send", message: "送付済みにしました（デモのため実際のメールは送信されません）。「お客様の画面を見る」で先方に届く画面を確認できます" },
  ],
  sent: [
    { to: "won", label: "受注にする", icon: "check", message: "受注にしました。一覧の受注金額・受注率に反映されます" },
    { to: "lost", label: "失注にする", icon: "x", message: "失注にしました" },
  ],
  won: [{ to: "sent", label: "送付済みに戻す", icon: "reset", message: "送付済みに戻しました" }],
  lost: [{ to: "sent", label: "送付済みに戻す", icon: "reset", message: "送付済みに戻しました" }],
};

/** 1画面のアクセント色は1色だけ。主ボタンだけ primary、ほかは中立 */
const TONE_CLASS: Record<"primary" | "neutral", string> = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  neutral: "border border-line bg-white text-navy hover:bg-canvas",
};

const SAVED_NOTICE = "保存しました。";

const BUTTON =
  "inline-flex items-center justify-center gap-1.5 rounded px-3.5 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

interface Props {
  id: number;
  justSaved: boolean;
}

export default function EstimateDetail({ id, justSaved }: Props) {
  const { estimates, setStatus } = useEstimates();
  const [notice, setNotice] = useState(justSaved ? SAVED_NOTICE : "");

  if (!estimates) return <LoadingState />;
  const estimate = estimates.find((e) => e.id === id);
  if (!estimate) return <NotFoundState />;

  // 主ボタンは1つだけ。下書きは「送付済みにする」、送付後は承認の流れを見せる「お客様の画面」、受注後は Hikae の請求書
  const actions = ACTIONS[estimate.status];
  // 「送付済みにする」があるのは下書きだけ。送付後に保存したときは案内を付けない
  const shownNotice = notice === SAVED_NOTICE && estimate.status === "draft" ? `${SAVED_NOTICE}内容を確認して「送付済みにする」で送付できます` : notice;
  const primary = estimate.status === "draft" ? actions[0] : null;
  const others = primary ? actions.slice(1) : actions;

  const handleAction = (action: Action) => {
    setStatus(estimate.id, action.to);
    setNotice(action.message);
  };

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-8 print:max-w-none print:p-0">
      {/* 一覧・作成画面と同じ max-w-6xl の枠で左右端を揃え、帳票だけ読みやすい幅に留める */}
      <div className="print:hidden">
        <Link href="/estimates" className="inline-flex items-center gap-1 text-sm text-body hover:text-navy">
          <Icon name="back" />
          見積一覧
        </Link>

        <section aria-label="ステータス" className="mt-4 space-y-5 border-b border-line pb-6">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <div className="min-w-0">
              <p className="tnum text-sm text-muted">{estimateNumber(estimate.id)}</p>
              <h1 className="mt-1 text-2xl font-semibold text-navy">{estimate.subject}</h1>
              <p className="mt-0.5 text-sm text-body">{estimate.clientName}</p>
            </div>
            <p className="sm:text-right">
              <span className="block text-xs text-muted">合計（税込）</span>
              <span className="tnum text-2xl font-semibold text-navy">{formatYen(calcTotals(estimate.items).total)}</span>
            </p>
          </div>

          <StatusStepper status={estimate.status} />

          <History estimate={estimate} />

          <div className="flex flex-wrap items-start gap-2">
            {primary ? (
              <button type="button" onClick={() => handleAction(primary)} className={`${BUTTON} ${TONE_CLASS.primary}`}>
                <Icon name={primary.icon} />
                {primary.label}
              </button>
            ) : estimate.status === "won" ? (
              <HikaeLink id={estimate.id} />
            ) : (
              // 受注は「その他」に入れてあるので、ふだんの流れ（先方の承認）を一言添える
              <div className="flex flex-col gap-1">
                <CustomerLink id={estimate.id} className={`${BUTTON} ${TONE_CLASS.primary}`} />
                {estimate.status === "sent" && <p className="text-xs text-muted">お客様が承認すると受注になります（手動なら「その他」から）</p>}
              </div>
            )}
            <MoreMenu>
              {(close) => (
                <>
                  {others.map((action) => (
                    <button key={action.to} type="button" onClick={() => { close(); handleAction(action); }} className={MENU_ITEM}>
                      <Icon name={action.icon} />
                      {action.label}
                    </button>
                  ))}
                  {estimate.status === "won" && <CustomerLink id={estimate.id} className={MENU_ITEM} />}
                  <Link href={`/estimates/${estimate.id}/edit`} className={MENU_ITEM}>
                    <Icon name="edit" />
                    編集
                  </Link>
                  <button type="button" onClick={() => { close(); window.print(); }} className={MENU_ITEM}>
                    <Icon name="print" />
                    印刷
                  </button>
                </>
              )}
            </MoreMenu>
          </div>

          <p
            role="status"
            aria-live="polite"
            className={shownNotice ? "text-balance flex items-start gap-2 rounded border border-line bg-canvas px-3 py-2 text-sm text-navy" : "sr-only"}
          >
            {shownNotice && <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />}
            {shownNotice}
          </p>
        </section>
      </div>

      <div className="mt-6 max-w-4xl rounded bg-canvas p-3 sm:p-6 print:mt-0 print:max-w-none print:bg-white print:p-0">
        <EstimateDocument estimate={estimate} id={estimate.id} />
      </div>
    </div>
  );
}

function CustomerLink({ id, className }: { id: number; className: string }) {
  return (
    <Link href={`/estimates/${id}/customer`} className={className}>
      <Icon name="eye" />
      お客様の画面を見る（デモ）
    </Link>
  );
}

/** 受注後の次の一手。請求は姉妹デモ Hikae で扱う。連携先があるのは EST-0014 だけなので、ほかは案内に留める */
function HikaeLink({ id }: { id: number }) {
  const url = hikaeInvoiceUrl(id);
  const invoiceNumber = hikaeInvoiceNumber(id);
  if (!url || !invoiceNumber) {
    return (
      <p className="self-center text-balance text-sm text-body">
        請求は{" "}
        <a href={HIKAE_INVOICES_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-2 hover:text-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
          Hikae
          <span className="sr-only">（新しいタブで開きます）</span>
        </a>{" "}
        で管理します<span className="inline-block">（デモでは EST-0014 のみ連携）</span>
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      <a href={url} target="_blank" rel="noopener noreferrer" className={`${BUTTON} ${TONE_CLASS.primary}`}>
        <Icon name="file" />
        Hikae で請求書を見る（デモ）
        <span className="sr-only">（新しいタブで開きます）</span>
      </a>
      <p className="text-xs text-muted">
        <span className="inline-block">
          請求書 <span className="tnum">{invoiceNumber}</span> を
        </span>{" "}
        <span className="inline-block">Hikae で発行済み（デモ）</span>
      </p>
    </div>
  );
}

const MENU_ITEM =
  "flex w-full items-center gap-2 whitespace-nowrap px-3 py-2 text-left text-sm text-navy hover:bg-canvas focus-visible:bg-canvas focus-visible:outline-none";

/** ネイティブの details で作る「その他」メニュー。Esc・外側へのフォーカス移動で閉じる */
function MoreMenu({ children }: { children: (close: () => void) => ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDetailsElement>(null);
  const close = () => setOpen(false);
  // 外側のクリックで閉じる。Safari はクリックしたボタンにフォーカスを移さず relatedTarget が null になるため、blur だけに頼らない
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);
  return (
    <details
      ref={ref}
      open={open}
      onToggle={(e) => setOpen(e.currentTarget.open)}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          close();
          e.currentTarget.querySelector("summary")?.focus();
        }
      }}
      onBlur={(e) => {
        // キーボードで外へ移ったときだけ閉じる（クリックは上の pointerdown で扱う）
        const next = e.relatedTarget as Node | null;
        if (next && !e.currentTarget.contains(next)) close();
      }}
      className="relative"
    >
      <summary
        aria-expanded={open}
        aria-haspopup="true"
        className={`${BUTTON} ${TONE_CLASS.neutral} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}
      >
        その他
        <Icon name="chevron" className={open ? "h-4 w-4 rotate-180" : "h-4 w-4"} />
      </summary>
      <div className="absolute right-0 top-full z-20 mt-1 min-w-[12rem] overflow-hidden rounded border border-line bg-white py-1 shadow-lg">
        {children(close)}
      </div>
    </details>
  );
}

/** 作成 9/20 → 送付 9/24 → 受注 10/19 のように、状態が進んだ日を1行で見せる */
function History({ estimate }: { estimate: Estimate }) {
  const steps = [
    { label: "作成", date: estimate.issuedAt },
    estimate.sentAt && { label: "送付", date: estimate.sentAt },
    estimate.decidedAt && { label: estimate.status === "lost" ? "失注" : "受注", date: estimate.decidedAt },
  ].filter((s): s is { label: string; date: string } => Boolean(s));
  return (
    <p aria-label="履歴" className="tnum flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-body">
      {steps.map((s, i) => (
        <span key={s.label} className="inline-flex items-center gap-2 whitespace-nowrap">
          {i > 0 && <span aria-hidden="true" className="text-muted">→</span>}
          <span>
            <span className="text-muted">{s.label}</span> {formatShortDate(s.date)}
          </span>
        </span>
      ))}
    </p>
  );
}
