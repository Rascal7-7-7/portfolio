"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Estimate } from "@/types";
import { KNOWN_CLIENTS, PRESET_ITEMS } from "@/data/seed";
import { useEstimates } from "@/lib/store";
import { calcTotals, lineAmount, TAX_RATE_PERCENT } from "@/lib/calc";
import { formatDateWithWeekday, formatYen } from "@/lib/utils";
import EstimateDocument from "@/components/EstimateDocument";
import Icon from "@/components/Icon";
import ItemRows, { INPUT_CLASS } from "./ItemRows";
import {
  type Draft,
  type DraftItem,
  draftFromEstimate,
  emptyDraft,
  emptyItem,
  parseItem,
  sampleDraft,
  toDraftItem,
  todayDates,
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

  // 新規作成の発行日・有効期限はクライアントの「今日」で入れる（プリレンダー時の日付と食い違うと hydration エラーになる）
  useEffect(() => {
    if (!initial) setDraft((d) => (d.issuedAt ? d : { ...d, ...todayDates() }));
  }, [initial]);

  const preview = toPreview(draft);
  // 行ごとの金額。数量・単価が不正な行は null（行内に赤字で理由を出し、合計には入れない）
  const amounts = draft.items.map((item) => {
    const parsed = parseItem(item);
    return parsed ? lineAmount(parsed) : null;
  });
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
    <form onSubmit={handleSubmit} noValidate className="grid grid-cols-[minmax(0,1fr)] gap-8 pb-16 xl:pb-0 xl:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <div className="space-y-8">
        {!initial && (
          <button
            type="button"
            onClick={() => setDraft(sampleDraft())}
            className={`${SECONDARY_BUTTON} gap-1.5`}
          >
            <Icon name="bolt" className="h-4 w-4 text-primary" />
            サンプルを入力（デモ用）
          </button>
        )}

        <fieldset>
          <legend className={SECTION_TITLE}>基本情報</legend>
          <div className="grid gap-4 sm:grid-cols-2">
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
            <DateInput label="発行日" required value={draft.issuedAt} onChange={(v) => setField("issuedAt", v)} />
            <DateInput label="有効期限" value={draft.validUntil} onChange={(v) => setField("validUntil", v)} />
          </div>
        </fieldset>

        <fieldset>
          <legend className={SECTION_TITLE}>明細</legend>
          <ItemRows items={draft.items} amounts={amounts} onChange={changeItem} onRemove={removeItem} />
          <button
            type="button"
            onClick={() => appendItem(emptyItem())}
            className="mt-2 inline-flex min-h-11 items-center gap-1 rounded py-1 text-sm font-semibold sm:min-h-0 text-primary hover:text-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            <Icon name="plus" />
            行を追加
          </button>

          <div className="mt-4">
            <p className="mb-2 text-xs text-muted">よく使う品目（クリックで追加）</p>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_ITEMS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => appendItem(toDraftItem(preset))}
                  className="min-h-11 rounded border border-line bg-white px-2.5 py-1 text-xs text-body sm:min-h-0 hover:border-slate-300 hover:bg-canvas hover:text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  + {preset.name}
                </button>
              ))}
            </div>
          </div>

          <section aria-label="合計金額" aria-live="polite" className="tnum ml-auto mt-6 max-w-sm text-sm">
            <p className="flex justify-between py-1">
              <span className="text-body">小計</span>
              <span className="text-navy">{formatYen(totals.subtotal)}</span>
            </p>
            <p className="flex justify-between py-1">
              <span className="text-body">消費税（{TAX_RATE_PERCENT}%・端数切り捨て）</span>
              <span className="text-navy">{formatYen(totals.tax)}</span>
            </p>
            <p className="mt-1 flex items-baseline justify-between border-t border-navy pt-2">
              <span className="font-semibold text-navy">合計（税込）</span>
              <span key={totals.total} className="num-tick text-2xl font-semibold text-navy">{formatYen(totals.total)}</span>
            </p>
          </section>
        </fieldset>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-body">備考</span>
          <textarea value={draft.note} onChange={(e) => setField("note", e.target.value)} rows={2} className={INPUT_CLASS} />
        </label>

        {errors.length > 0 && (
          <ul role="alert" className="space-y-1 rounded border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
            {errors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        )}

        <div className="flex flex-col-reverse gap-2 border-t border-line pt-6 sm:flex-row sm:justify-end">
          <button type="button" onClick={() => router.back()} className={SECONDARY_BUTTON}>
            キャンセル
          </button>
          <button
            type="submit"
            className="rounded bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {initial ? "変更を保存" : "下書きとして保存"}
          </button>
        </div>
      </div>

      {/* Stripe の請求書エディタと同じく、右側にグレー地の上で帳票プレビューを並べる */}
      <div id="estimate-preview" className="scroll-mt-4 rounded bg-canvas p-3 sm:p-6 xl:sticky xl:p-4 xl:top-4 xl:self-start">
        <p className="mb-3 text-xs font-medium text-body">見積書プレビュー（入力と同時に更新）</p>
        <EstimateDocument estimate={preview} id={initial?.id} annotate />
      </div>

      {/*
        プレビューが横に並ばない幅では、入力中も合計が見えるよう画面下に固定する。
        スマホは下部ナビ（罫線込みで高さ 61px）の上、md 以上はサイドバー（w-60）の右に置く
      */}
      <div className="fixed inset-x-0 bottom-[calc(3.8125rem+env(safe-area-inset-bottom))] z-30 flex items-center justify-between gap-3 border-t border-line bg-white px-4 py-2 md:bottom-0 md:left-60 md:pb-[calc(0.5rem+env(safe-area-inset-bottom))] md:pl-8 md:pr-8 xl:hidden print:hidden">
        <p className="tnum min-w-0">
          <span className="block text-xs text-muted">合計（税込）</span>
          <span key={totals.total} className="num-tick block text-lg font-semibold leading-tight text-navy">{formatYen(totals.total)}</span>
        </p>
        <a
          href="#estimate-preview"
          className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded border border-line px-3 py-2 text-sm font-semibold text-primary hover:bg-canvas focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          見積書を確認
          <span aria-hidden="true">↓</span>
        </a>
      </div>
    </form>
  );
}

const SECTION_TITLE = "mb-4 text-base font-semibold text-navy";

const SECONDARY_BUTTON =
  "inline-flex items-center justify-center rounded border border-line bg-white px-4 py-2 text-sm font-semibold text-navy hover:bg-canvas focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  list?: string;
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <span className="mb-1 block text-xs font-medium text-body">
      {label}
      {required && <span className="ml-1 text-rose-600" aria-hidden="true">*</span>}
    </span>
  );
}

function TextInput({ label, value, onChange, required, placeholder, list }: TextInputProps) {
  return (
    <label className="block">
      <FieldLabel label={label} required={required} />
      <input
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

/**
 * ネイティブの日付ピッカーを使いつつ、表示はブラウザのロケールに関係なく「2026年10月19日（月）」にする。
 * 透明な input を下に敷き、上に和暦風の表示を重ねる（クリック・キーボード操作は input が受ける）。
 */
function DateInput({ label, value, onChange, required }: Omit<TextInputProps, "placeholder" | "list">) {
  const openPicker = (e: React.MouseEvent<HTMLInputElement>) => {
    try {
      e.currentTarget.showPicker();
    } catch {
      // showPicker 非対応ブラウザでは通常の input 操作にまかせる
    }
  };
  return (
    <label className="block">
      <FieldLabel label={label} required={required} />
      <span className="relative block">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onClick={openPicker}
          required={required}
          aria-required={required}
          className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        <span
          aria-hidden="true"
          className={`${INPUT_CLASS} pointer-events-none flex items-center justify-between peer-focus-visible:border-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/20`}
        >
          <span className={value ? "tnum" : "text-muted"}>{value ? formatDateWithWeekday(value) : "日付を選択"}</span>
          <Icon name="calendar" className="h-4 w-4 text-muted" />
        </span>
      </span>
    </label>
  );
}
