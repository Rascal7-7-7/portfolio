"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Estimate } from "@/types";
import { KNOWN_CLIENTS, PRESET_ITEMS } from "@/data/seed";
import { useEstimates } from "@/lib/store";
import { calcTotals, lineAmount, TAX_RATE_PERCENT } from "@/lib/calc";
import { formatYen } from "@/lib/utils";
import EstimateDocument from "@/components/EstimateDocument";
import Icon from "@/components/Icon";
import ItemRows, { INPUT_CLASS } from "./ItemRows";
import {
  type Draft,
  type DraftItem,
  draftFromEstimate,
  emptyDraft,
  emptyItem,
  sampleDraft,
  toDraftItem,
  toPreview,
  validateDraft,
} from "./draft";

interface Props {
  /** 渡されたら編集モード */
  initial?: Estimate;
}

type TextField = "clientName" | "contactName" | "subject" | "issuedAt" | "validUntil" | "note";

export default function EstimateForm({ initial }: Props) {
  const router = useRouter();
  const { create, update } = useEstimates();
  const [draft, setDraft] = useState<Draft>(() => (initial ? draftFromEstimate(initial) : emptyDraft()));
  const [errors, setErrors] = useState<string[]>([]);

  const preview = toPreview(draft);
  const amounts = preview.items.map(lineAmount);
  const totals = calcTotals(preview.items.filter((item) => item.name.trim() !== ""));

  const setField = (field: TextField, value: string) => setDraft((d) => ({ ...d, [field]: value }));
  const changeItem = (id: string, patch: Partial<DraftItem>) =>
    setDraft((d) => ({ ...d, items: d.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) }));
  const removeItem = (id: string) =>
    setDraft((d) => ({ ...d, items: d.items.filter((it) => it.id !== id) }));
  const appendItem = (item: DraftItem) =>
    setDraft((d) => {
      // 未入力の空行は取り除いてから追加する
      const kept = d.items.filter((it) => it.name.trim() !== "" || it.unitPrice !== "");
      return { ...d, items: [...kept, item] };
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateDraft(draft);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setErrors([]);
    if (initial) {
      update(initial.id, result.value);
      router.push(`/estimates/${initial.id}?saved=1`);
    } else {
      router.push(`/estimates/${create(result.value)}?saved=1`);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="space-y-5">
        {!initial && (
          <button
            type="button"
            onClick={() => setDraft(sampleDraft())}
            className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary-soft px-3 py-1.5 text-sm font-semibold text-primary hover:bg-primary/10"
          >
            <Icon name="bolt" />
            サンプルを入力（デモ用）
          </button>
        )}

        <fieldset className="grid gap-4 rounded-md bg-white p-4 shadow-card sm:grid-cols-2 sm:p-5">
          <legend className="sr-only">基本情報</legend>
          <TextInput label="取引先名" required value={draft.clientName} onChange={(v) => setField("clientName", v)} list="known-clients" placeholder="例：株式会社みなと不動産" />
          <datalist id="known-clients">
            {KNOWN_CLIENTS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          <TextInput label="ご担当者" value={draft.contactName} onChange={(v) => setField("contactName", v)} placeholder="例：佐藤 健一" />
          <div className="sm:col-span-2">
            <TextInput label="件名" required value={draft.subject} onChange={(v) => setField("subject", v)} placeholder="例：コーポレートサイト リニューアル" />
          </div>
          <TextInput label="発行日" type="date" required value={draft.issuedAt} onChange={(v) => setField("issuedAt", v)} />
          <TextInput label="有効期限" type="date" value={draft.validUntil} onChange={(v) => setField("validUntil", v)} />
        </fieldset>

        <fieldset className="space-y-4 rounded-md bg-white p-4 shadow-card sm:p-5">
          <legend className="sr-only">明細</legend>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-navy">明細</h2>
            <button
              type="button"
              onClick={() => appendItem(emptyItem())}
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover"
            >
              <Icon name="plus" />
              行を追加
            </button>
          </div>
          <ItemRows items={draft.items} amounts={amounts} onChange={changeItem} onRemove={removeItem} />
          <div>
            <p className="mb-2 text-xs font-medium text-muted">よく使う品目（クリックで追加）</p>
            <div className="flex flex-wrap gap-2">
              {PRESET_ITEMS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => appendItem(toDraftItem(preset))}
                  className="rounded-full border border-line px-3 py-1 text-xs text-body hover:border-primary hover:text-primary"
                >
                  + {preset.name}
                </button>
              ))}
            </div>
          </div>
        </fieldset>

        <section aria-label="合計金額" aria-live="polite" className="tnum space-y-1 rounded-md bg-navy p-4 text-sm text-slate-300 sm:p-5">
          <p className="flex justify-between"><span>小計</span><span className="text-white">{formatYen(totals.subtotal)}</span></p>
          <p className="flex justify-between"><span>消費税（{TAX_RATE_PERCENT}%・端数切り捨て）</span><span className="text-white">{formatYen(totals.tax)}</span></p>
          <p className="flex items-baseline justify-between border-t border-white/20 pt-2">
            <span className="font-semibold text-white">合計（税込）</span>
            <span className="text-2xl font-semibold text-white">{formatYen(totals.total)}</span>
          </p>
        </section>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-body">備考</span>
          <textarea value={draft.note} onChange={(e) => setField("note", e.target.value)} rows={2} className={INPUT_CLASS} />
        </label>

        {errors.length > 0 && (
          <ul role="alert" className="space-y-1 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
            {errors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        )}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={() => router.back()} className="rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-body hover:bg-canvas">
            キャンセル
          </button>
          <button type="submit" className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white shadow-card hover:bg-primary-hover">
            {initial ? "変更を保存" : "下書きとして保存"}
          </button>
        </div>
      </div>

      <div className="xl:sticky xl:top-6 xl:self-start">
        <p className="mb-2 text-xs font-medium text-muted">見積書プレビュー（入力と同時に更新）</p>
        <EstimateDocument estimate={preview} id={initial?.id} />
      </div>
    </form>
  );
}

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "date";
  required?: boolean;
  placeholder?: string;
  list?: string;
}

function TextInput({ label, value, onChange, type = "text", required, placeholder, list }: TextInputProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-body">
        {label}
        {required && <span className="ml-1 text-rose-600" aria-hidden="true">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        aria-required={required}
        placeholder={placeholder}
        list={list}
        className={INPUT_CLASS}
      />
    </label>
  );
}
