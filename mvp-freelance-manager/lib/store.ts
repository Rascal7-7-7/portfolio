"use client";

import { useSyncExternalStore } from "react";
import type { AppData, Invoice, ISODate, Project, ProjectStatus, Task } from "@/types";
import { todayISO } from "./dates.ts";
import { createSeed } from "./seed.ts";

/**
 * デモ用のクライアント側ストア。API・DB は使わず、操作内容は localStorage に保存する。
 * ponytail: 日付が変わるとダミーデータを作り直す（相対日付を常に「今日」基準に保つため）。
 */
const STORAGE_KEY = "freelancehub-demo-v2";

interface Snapshot {
  readonly today: ISODate;
  readonly data: AppData;
}

let snapshot: Snapshot | null = null;
const listeners = new Set<() => void>();

function load(): Snapshot {
  const today = todayISO();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Partial<Snapshot>;
      if (saved.today === today && saved.data && Array.isArray(saved.data.projects)) {
        return { today, data: saved.data };
      }
    }
  } catch {
    // 保存領域が使えない環境（プライベートモード等）ではダミーデータで動かす
  }
  return { today, data: createSeed(today) };
}

function persist(next: Snapshot): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // 保存できなくても画面上の操作は継続できる
  }
}

function getSnapshot(): Snapshot {
  if (!snapshot) snapshot = load();
  return snapshot;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function update(fn: (data: AppData) => AppData): void {
  const current = getSnapshot();
  snapshot = { today: current.today, data: fn(current.data) };
  persist(snapshot);
  listeners.forEach((l) => l());
}

/** サーバー描画中は null（ダミーデータは閲覧日の日付で作るため、ブラウザでのみ生成する） */
export function useAppStore(): Snapshot | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

/** 入金を記録した直後に出すトースト。保存はしない（再読み込みで消えてよい） */
export interface PaidToast {
  /** 同じ請求を続けて記録しても表示タイマーを掛け直せるよう、毎回変わる番号 */
  readonly key: number;
  readonly invoiceId: string;
  readonly number: string;
  readonly amount: number;
  readonly client: string;
}

let paidToast: PaidToast | null = null;
let toastSeq = 0;

function setPaidToast(next: PaidToast | null): void {
  paidToast = next;
  listeners.forEach((l) => l());
}

export function usePaidToast(): PaidToast | null {
  return useSyncExternalStore(subscribe, () => paidToast, () => null);
}

function newId(prefix: string): string {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export type NewProject = Omit<Project, "id">;
export type NewTask = Omit<Task, "id" | "done">;
export type NewInvoice = Pick<Invoice, "projectId" | "amount" | "dueOn">;

export const actions = {
  addProject(input: NewProject): string {
    const id = newId("p");
    update((d) => ({ ...d, projects: [{ ...input, id }, ...d.projects] }));
    return id;
  },
  setProjectStatus(id: string, status: ProjectStatus): void {
    update((d) => ({
      ...d,
      projects: d.projects.map((p) => (p.id === id ? { ...p, status } : p)),
    }));
  },
  addTask(input: NewTask): void {
    update((d) => ({ ...d, tasks: [...d.tasks, { ...input, id: newId("t"), done: false }] }));
  },
  toggleTask(id: string): void {
    const today = getSnapshot().today;
    update((d) => ({
      ...d,
      tasks: d.tasks.map((t) => (t.id === id ? { ...t, done: !t.done, doneOn: t.done ? null : today } : t)),
    }));
  },
  deleteTask(id: string): void {
    update((d) => ({ ...d, tasks: d.tasks.filter((t) => t.id !== id) }));
  },
  addInvoice(input: NewInvoice): string {
    const today = getSnapshot().today;
    const id = newId("i");
    update((d) => ({
      ...d,
      invoices: [
        ...d.invoices,
        {
          ...input,
          id,
          number: `INV-${String(d.invoices.length + 1).padStart(4, "0")}`,
          issuedOn: today,
          paidOn: null,
        },
      ],
    }));
    return id;
  },
  setInvoicePaid(id: string, paid: boolean): void {
    const { today, data } = getSnapshot();
    const invoice = data.invoices.find((inv) => inv.id === id);
    update((d) => ({
      ...d,
      invoices: d.invoices.map((inv) =>
        inv.id === id ? { ...inv, paidOn: paid ? today : null } : inv,
      ),
    }));
    if (paid && invoice) {
      const client = data.projects.find((p) => p.id === invoice.projectId)?.client ?? "";
      toastSeq += 1;
      setPaidToast({ key: toastSeq, invoiceId: id, number: invoice.number, amount: invoice.amount, client });
    } else if (paidToast?.invoiceId === id) {
      setPaidToast(null);
    }
  },
  clearPaidToast(): void {
    setPaidToast(null);
  },
  reset(): void {
    const today = todayISO();
    snapshot = { today, data: createSeed(today) };
    paidToast = null;
    persist(snapshot);
    listeners.forEach((l) => l());
  },
};
