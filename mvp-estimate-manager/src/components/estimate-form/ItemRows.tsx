"use client";

import type { DraftItem } from "./draft";
import { groupDigits, itemErrors } from "./item-check";
import { cn, formatYen } from "@/lib/utils";
import Icon from "@/components/Icon";

export const INPUT_CLASS =
  "w-full rounded border border-line bg-white px-2.5 py-2.5 text-base text-navy sm:py-2 sm:text-sm placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

const INVALID_CLASS = "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20";

/** 列見出しは1行目にだけ見せ、2行目以降は読み上げ専用にする（表の見出し行と同じ役割） */
const labelClass = (first: boolean) => (first ? "mb-1 block text-xs text-muted" : "sr-only");

interface Props {
  items: DraftItem[];
  /** null は数量・単価が不正で合計に入れない行 */
  amounts: (number | null)[];
  onChange: (id: string, patch: Partial<DraftItem>) => void;
  onRemove: (id: string) => void;
}

export default function ItemRows({ items, amounts, onChange, onRemove }: Props) {
  return (
    <ol className="divide-y divide-line border-y border-line">
      {items.map((item, i) => {
        const n = i + 1;
        const first = i === 0;
        const err = itemErrors(item);
        const amount = amounts[i] ?? null;
        const describedBy = err.quantity || err.unitPrice ? `${item.id}-err` : undefined;
        return (
          <li key={item.id} className="grid grid-cols-3 gap-2 py-3 sm:grid-cols-[1fr_1fr_1.5fr_1.5fr]">
            <div className="col-span-full flex items-end gap-2">
              <label className="min-w-0 flex-1">
                <span className={labelClass(first)}>品名</span>
                <input
                  value={item.name}
                  onChange={(e) => onChange(item.id, { name: e.target.value })}
                  aria-label={`明細${n} 品名`}
                  placeholder="例：ページデザイン"
                  className={INPUT_CLASS}
                />
              </label>
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                disabled={items.length === 1}
                aria-label={`明細${n}を削除`}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded text-muted hover:bg-canvas sm:h-9 sm:w-9 hover:text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary disabled:invisible"
              >
                <Icon name="trash" />
              </button>
            </div>
            <label>
              <span className={labelClass(first)}>数量</span>
              <input
                inputMode="decimal"
                value={item.quantity}
                onChange={(e) => onChange(item.id, { quantity: e.target.value })}
                aria-label={`明細${n} 数量`}
                aria-invalid={err.quantity ? true : undefined}
                aria-describedby={describedBy}
                className={cn(INPUT_CLASS, "tnum text-right", err.quantity && INVALID_CLASS)}
              />
            </label>
            <label>
              <span className={labelClass(first)}>単位</span>
              <input
                value={item.unit}
                onChange={(e) => onChange(item.id, { unit: e.target.value })}
                aria-label={`明細${n} 単位`}
                placeholder="例：式"
                className={INPUT_CLASS}
              />
            </label>
            <label>
              <span className={labelClass(first)}>単価（税抜・円）</span>
              <input
                inputMode="numeric"
                value={item.unitPrice}
                onChange={(e) => onChange(item.id, { unitPrice: e.target.value })}
                onBlur={(e) => onChange(item.id, { unitPrice: groupDigits(e.target.value) })}
                aria-label={`明細${n} 単価（税抜・円）`}
                aria-invalid={err.unitPrice ? true : undefined}
                aria-describedby={describedBy}
                placeholder="0"
                className={cn(INPUT_CLASS, "tnum text-right", err.unitPrice && INVALID_CLASS)}
              />
            </label>
            <p className="col-span-3 flex items-baseline justify-end gap-2 sm:col-span-1 sm:flex-col sm:items-end sm:justify-end sm:gap-0">
              <span className={first ? "text-xs text-muted sm:mb-1" : "text-xs text-muted sm:sr-only"}>金額（自動計算）</span>
              <span className={cn("tnum text-sm font-semibold sm:py-2", amount === null ? "text-muted" : "text-navy")}>
                {amount === null ? "—" : formatYen(amount)}
              </span>
            </p>
            {amount === null && (
              <p id={`${item.id}-err`} className="col-span-full text-xs font-medium text-rose-700">
                {[err.quantity, err.unitPrice].filter(Boolean).join("／")}（この行は合計に入りません）
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
