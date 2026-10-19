"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Estimate, EstimateInput, EstimateStatus } from "@/types";
import { STATUSES } from "@/types";
import { buildSeed } from "@/data/seed";
import { todayISO } from "@/lib/utils";

// ponytail: localStorage のみ。複数端末・複数人で共有するならサーバー保存が必要
const STORAGE_KEY = "mvp-estimate-manager:v3";

interface EstimatesContextValue {
  /** マウント前（localStorage 読み込み前）は null */
  estimates: Estimate[] | null;
  create: (input: EstimateInput) => number;
  update: (id: number, input: EstimateInput) => void;
  setStatus: (id: number, status: EstimateStatus) => void;
  reset: () => void;
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

export function EstimatesProvider({ children }: { children: React.ReactNode }) {
  const [estimates, setEstimates] = useState<Estimate[] | null>(null);

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
    setEstimates((prev) => prev?.map((e) => (e.id === id ? { ...e, status } : e)) ?? prev);
  }, []);

  const reset = useCallback(() => setEstimates(buildSeed(todayISO())), []);

  const value = useMemo(
    () => ({ estimates, create, update, setStatus, reset }),
    [estimates, create, update, setStatus, reset],
  );

  return <EstimatesContext.Provider value={value}>{children}</EstimatesContext.Provider>;
}

export function useEstimates(): EstimatesContextValue {
  const ctx = useContext(EstimatesContext);
  if (!ctx) throw new Error("useEstimates は EstimatesProvider の内側で使ってください");
  return ctx;
}
