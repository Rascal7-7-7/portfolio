"use client";

import { useState, type FormEvent } from "react";
import { addDays } from "@/lib/dates";
import { actions } from "@/lib/store";
import { buttonStyles } from "@/components/ui";
import type { ISODate, Project } from "@/types";

interface InvoiceFormProps {
  projects: readonly Project[];
  today: ISODate;
  defaultProjectId?: string;
  onCreated?: () => void;
}

/** 案件に紐づけて金額・支払期日を決める。実際の送付は行わない（モック） */
export function InvoiceForm({ projects, today, defaultProjectId, onCreated }: InvoiceFormProps) {
  const selectable = projects.filter((p) => p.status !== "lost");
  const [projectId, setProjectId] = useState(defaultProjectId ?? selectable[0]?.id ?? "");
  const [amount, setAmount] = useState(String(selectable.find((p) => p.id === projectId)?.amount ?? ""));
  const [dueOn, setDueOn] = useState(addDays(today, 30));
  const [error, setError] = useState<string | null>(null);

  function selectProject(id: string): void {
    setProjectId(id);
    setAmount(String(projects.find((p) => p.id === id)?.amount ?? ""));
  }

  function submit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const value = Number(amount);
    if (!projectId) return setError("案件を選んでください");
    if (!Number.isInteger(value) || value <= 0) return setError("金額は1円以上の整数で入力してください");
    if (!dueOn || dueOn < today) return setError("支払期日は今日以降の日付にしてください");
    actions.addInvoice({ projectId, amount: value, dueOn });
    setError(null);
    onCreated?.();
  }

  return (
    <form onSubmit={submit} className="grid gap-3 p-4 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-end sm:p-5" noValidate>
      <label className="block text-xs font-semibold text-warm-500">
        案件
        <select value={projectId} onChange={(e) => selectProject(e.target.value)} className={`${buttonStyles.input} mt-1`}>
          {selectable.map((p) => (
            <option key={p.id} value={p.id}>
              {p.client} ／ {p.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-xs font-semibold text-warm-500">
        請求金額（円）
        <input
          type="number"
          inputMode="numeric"
          min={1}
          step={1000}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={`${buttonStyles.input} num mt-1`}
        />
      </label>
      <label className="block text-xs font-semibold text-warm-500">
        支払期日
        <input
          type="date"
          min={today}
          value={dueOn}
          onChange={(e) => setDueOn(e.target.value)}
          className={`${buttonStyles.input} num mt-1`}
        />
      </label>
      <button type="submit" className={buttonStyles.primary}>
        請求書を作成
      </button>
      {error && (
        <p role="alert" className="text-xs font-semibold text-orange sm:col-span-4">
          {error}
        </p>
      )}
    </form>
  );
}
