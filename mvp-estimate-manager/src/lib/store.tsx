"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Estimate, EstimateInput, EstimateStatus } from "@/types";
import { STATUSES } from "@/types";
import { buildSeed } from "@/data/seed";
import { calcTotals, summarize } from "@/lib/calc";
import type { Summary } from "@/lib/calc";
import { todayISO } from "@/lib/utils";

// ponytail: localStorage のみ。複数端末・複数人で共有するならサーバー保存が必要
const STORAGE_KEY = "mvp-estimate-manager:v5";

interface EstimatesContextValue {
  /** マウント前（localStorage 読み込み前）は null */
  estimates: Estimate[] | null;
  create: (input: EstimateInput) => number;
  update: (id: number, input: EstimateInput) => void;
  setStatus: (id: number, status: EstimateStatus) => void;
  reset: () => void;
  /** お客様画面での承認。受注にして、管理画面に戻ったときの通知と KPI の差分表示を予約する */
  approve: (id: number) => void;
  /** 未表示の受注通知（トースト用）。表示側が clearWonToast で消す */
  wonToast: WonToast | null;
  clearWonToast: () => void;
  /** 承認する直前の集計。一覧の KPI に差分（受注金額・受注率）を添えるのに使い、一覧側が takeKpiBase で受け取る */
  kpiBase: Summary | null;
  takeKpiBase: () => void;
}

export interface WonToast {
  id: number;
  subject: string;
  amount: number;
}

const EstimatesContext = createContext<EstimatesContextValue | null>(null);

function isEstimate(value: unknown): value is Estimate {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Partial<Estimate>;
  return (
    typeof v.id === "number" &&
    typeof v.clientName === "string" &&
    typeof v.issuedAt === "string" &&
    Array.isArray(v.items) &&
    STATUSES.includes(v.status as EstimateStatus)
  );
}

function loadStored(): Estimate[] | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.every(isEstimate) ? parsed : null;
  } catch {
    return null;
  }
}

function saveStored(estimates: Estimate[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(estimates));
  } catch {
    // 保存できない環境（プライベートモード等）でもメモリ上では動作させる
  }
}

/** 状態遷移の日付を記録する。送付済みに戻したときは送付日を残し、決定日だけ消す */
function withStatus(e: Estimate, status: EstimateStatus, today: string): Estimate {
  if (status === "draft") return { ...e, status, sentAt: undefined, decidedAt: undefined };
  if (status === "sent") return { ...e, status, sentAt: e.sentAt ?? today, decidedAt: undefined };
  return { ...e, status, sentAt: e.sentAt ?? today, decidedAt: today };
}

export function EstimatesProvider({ children }: { children: React.ReactNode }) {
  const [estimates, setEstimates] = useState<Estimate[] | null>(null);
  // 通知はページ遷移をまたいで残ればよいので保存しない（再読み込みで消える）
  const [wonToast, setWonToast] = useState<WonToast | null>(null);
  const [kpiBase, setKpiBase] = useState<Summary | null>(null);

  // 相対日付のダミーデータはクライアントの「今日」で作る（SSR との日付ずれを避ける）
  useEffect(() => {
    setEstimates(loadStored() ?? buildSeed(todayISO()));
  }, []);

  useEffect(() => {
    if (estimates) saveStored(estimates);
  }, [estimates]);

  const create = useCallback(
    (input: EstimateInput): number => {
      const current = estimates ?? [];
      const id = current.reduce((max, e) => Math.max(max, e.id), 0) + 1;
      setEstimates([{ ...input, id, status: "draft" }, ...current]);
      return id;
    },
    [estimates],
  );

  const update = useCallback((id: number, input: EstimateInput) => {
    setEstimates((prev) => prev?.map((e) => (e.id === id ? { ...e, ...input } : e)) ?? prev);
  }, []);

  const setStatus = useCallback((id: number, status: EstimateStatus) => {
    setEstimates((prev) => prev?.map((e) => (e.id === id ? withStatus(e, status, todayISO()) : e)) ?? prev);
  }, []);

  const reset = useCallback(() => {
    setEstimates(buildSeed(todayISO()));
    setWonToast(null);
    setKpiBase(null);
  }, []);

  const approve = useCallback(
    (id: number) => {
      const target = estimates?.find((e) => e.id === id);
      if (!estimates || !target || target.status === "won") return;
      const amount = calcTotals(target.items).total;
      setStatus(id, "won");
      setWonToast({ id, subject: target.subject, amount });
      // 一覧に戻る前に続けて承認しても、差分は最初の承認の直前から数える
      setKpiBase((base) => base ?? summarize(estimates));
    },
    [estimates, setStatus],
  );
  const clearWonToast = useCallback(() => setWonToast(null), []);
  const takeKpiBase = useCallback(() => setKpiBase(null), []);

  const value = useMemo(
    () => ({ estimates, create, update, setStatus, reset, approve, wonToast, clearWonToast, kpiBase, takeKpiBase }),
    [estimates, create, update, setStatus, reset, approve, wonToast, clearWonToast, kpiBase, takeKpiBase],
  );

  return <EstimatesContext.Provider value={value}>{children}</EstimatesContext.Provider>;
}

export function useEstimates(): EstimatesContextValue {
  const ctx = useContext(EstimatesContext);
  if (!ctx) throw new Error("useEstimates は EstimatesProvider の内側で使ってください");
  return ctx;
}
