"use client";

import { useState, type FormEvent } from "react";
import { addDays } from "@/lib/dates";
import { actions } from "@/lib/store";
import { remainingBillable } from "@/lib/selectors";
import { formatYen } from "@/lib/utils";
import { buttonStyles } from "@/components/ui";
import { DateInput } from "@/components/DateInput";
import type { Invoice, ISODate, Project } from "@/types";

interface InvoiceFormProps {
  projects: readonly Project[];
  /** 既存の請求。初期金額を「受注額 − 請求済み」にするために使う */
  invoices: readonly Invoice[];
  today: ISODate;
  defaultProjectId?: string;
  onCreated?: () => void;
}

/** 案件に紐づけて金額・支払期日を決める。実際の送付は行わない（モック） */
export function InvoiceForm({ projects, invoices, today, defaultProjectId, onCreated }: InvoiceFormProps) {
  const selectable = projects.filter((p) => p.status !== "lost");
  const remainingOf = (id: string): number | null => {
    const project = projects.find((p) => p.id === id);
    return project ? remainingBillable(project, invoices) : null;
  };
  const initialAmount = (id: string): string => {
    const rest = remainingOf(id);
    return rest !== null && rest > 0 ? String(rest) : "";
  };
  const [projectId, setProjectId] = useState(defaultProjectId ?? selectable[0]?.id ?? "");
  const [amount, setAmount] = useState(() => initialAmount(projectId));
  const [dueOn, setDueOn] = useState(addDays(today, 30));
  const [error, setError] = useState<string | null>(null);
  const remaining = remainingOf(projectId);
  const fullyBilled = remaining !== null && remaining <= 0;

  function selectProject(id: string): void {
    setProjectId(id);
    setAmount(initialAmount(id));
    setError(null);
  }

  function submit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const value = Number(amount);
    if (!projectId) return setError("案件を選んでください");
    if (fullyBilled) return setError("この案件は受注額まで請求済みです");
    if (!Number.isInteger(value) || value <= 0) return setError("金額は1円以上の整数で入力してください");
    if (remaining !== null && value > remaining) {
      return setError(`残り請求可能額 ${formatYen(remaining)} 以下にしてください`);
    }
    if (!dueOn || dueOn < today) return setError("支払期日は今日以降の日付にしてください");
    actions.addInvoice({ projectId, amount: value, dueOn });
    setError(null);
    onCreated?.();
  }

  return (
    <form onSubmit={submit} className="grid gap-3 p-4 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-end sm:p-5" noValidate>
      {selectable.length === 1 ? (
        // 案件詳細から開いたときは案件が決まっているので、選択欄ではなく表示だけにする
        <div className="min-w-0 text-xs font-medium text-warm-900">
          請求先
          <p className="mt-1 py-2 text-sm font-medium break-words text-ink">{selectable[0].client}</p>
        </div>
      ) : (
        <label className="block text-xs font-medium text-warm-900">
          案件
          <select value={projectId} onChange={(e) => selectProject(e.target.value)} className={`${buttonStyles.input} mt-1`}>
            {selectable.map((p) => (
              <option key={p.id} value={p.id}>
                {p.client} ／ {p.name}
              </option>
            ))}
          </select>
        </label>
      )}
      <label className="block text-xs font-medium text-warm-900">
        請求金額（円）
        <input
          type="number"
          inputMode="numeric"
          min={1}
          step={1000}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          aria-describedby="invoice-remaining"
          className={`${buttonStyles.input} num mt-1`}
        />
      </label>
      <label className="block text-xs font-medium text-warm-900">
        支払期日
        <DateInput min={today} value={dueOn} onChange={setDueOn} className="mt-1" />
      </label>
      <button type="submit" disabled={fullyBilled} className={`${buttonStyles.primary} disabled:cursor-not-allowed disabled:opacity-50`}>
        請求書を作成
      </button>
      {remaining !== null && (
        <p
          id="invoice-remaining"
          className={`num text-xs sm:col-span-4 ${fullyBilled ? "font-semibold text-orange" : "text-warm-500"}`}
        >
          {fullyBilled
            ? "この案件は受注額まで請求済みのため、新しい請求書は作成できません（受注額の変更は案件側で行います）。"
            : `残り請求可能額 ${formatYen(remaining)}（受注額 − 請求済みの合計）`}
        </p>
      )}
      {error && (
        <p role="alert" className="text-xs font-semibold text-orange sm:col-span-4">
          {error}
        </p>
      )}
    </form>
  );
}
