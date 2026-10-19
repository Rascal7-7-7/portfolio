"use client";

import type { DraftItem } from "./draft";
import { itemErrors } from "./item-check";
import { cn, formatYen } from "@/lib/utils";
import Icon from "@/components/Icon";

export const INPUT_CLASS =
  "w-full rounded border border-line bg-white px-2.5 py-2 text-sm text-navy placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

const INVALID_CLASS = "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20";

const LABEL_CLASS = "mb-1 block text-xs text-muted";

interface Props {
  items: DraftItem[];
  /** null は数量・単価が不正で合計に入れない行 */
  amounts: (number | null)[];
  onChange: (id: string, patch: Partial<DraftItem>) => void;
  onRemove: (id: string) => void;
}

export default function ItemRows({ items, amounts, onChange, onRemove }: Props) {
  return (
    <ol className="space-y-3">
      {items.map((item, i) => {
        const n = i + 1;
        const err = itemErrors(item);
        const amount = amounts[i] ?? null;
        return (
          <li key={item.id} className="space-y-2 rounded border border-line p-3">
            <div className="flex items-end gap-2">
              <label className="min-w-0 flex-1">
                <span className={LABEL_CLASS}>明細{n} 品名</span>
                <input
                  value={item.name}
                  onChange={(e) => onChange(item.id, { name: e.target.value })}
                  placeholder="例：ページデザイン"
                  className={INPUT_CLASS}
                />
              </label>
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                disabled={items.length === 1}
                aria-label={`明細${n}を削除`}
                className="rounded p-2 text-muted hover:bg-rose-50 hover:text-rose-700 disabled:invisible"
              >
                <Icon name="trash" />
              </button>
            </div>
            <div className="grid grid-cols-[1fr_1fr_1.6fr] gap-2 sm:grid-cols-[1fr_1fr_1.6fr_1.6fr]">
              <label>
                <span className={LABEL_CLASS}>数量</span>
                <input
                  inputMode="decimal"
                  value={item.quantity}
                  onChange={(e) => onChange(item.id, { quantity: e.target.value })}
                  aria-label={`明細${n} 数量`}
                  aria-invalid={err.quantity ? true : undefined}
                  aria-describedby={err.quantity || err.unitPrice ? `${item.id}-err` : undefined}
                  className={cn(INPUT_CLASS, "tnum text-right", err.quantity && INVALID_CLASS)}
                />
              </label>
              <label>
                <span className={LABEL_CLASS}>単位</span>
                <input
                  value={item.unit}
                  onChange={(e) => onChange(item.id, { unit: e.target.value })}
                  aria-label={`明細${n} 単位`}
                  placeholder="例：式"
                  className={INPUT_CLASS}
                />
              </label>
              <label>
                <span className={LABEL_CLASS}>単価（税抜・円）</span>
                <input
                  inputMode="numeric"
                  value={item.unitPrice}
                  onChange={(e) => onChange(item.id, { unitPrice: e.target.value })}
                  aria-label={`明細${n} 単価（税抜・円）`}
                  aria-invalid={err.unitPrice ? true : undefined}
                  aria-describedby={err.quantity || err.unitPrice ? `${item.id}-err` : undefined}
                  placeholder="0"
                  className={cn(INPUT_CLASS, "tnum text-right", err.unitPrice && INVALID_CLASS)}
                />
              </label>
              <p className="col-span-3 flex items-baseline justify-end gap-2 sm:col-span-1 sm:flex-col sm:items-end sm:justify-end sm:gap-0">
                <span className="text-xs text-muted">金額（自動計算）</span>
                <span className={`tnum py-1.5 text-sm font-semibold ${amount === null ? "text-muted" : "text-navy"}`}>
                  {amount === null ? "—" : formatYen(amount)}
                </span>
              </p>
            </div>
            {amount === null && (
              <p id={`${item.id}-err`} className="text-xs font-medium text-rose-700">
                {[err.quantity, err.unitPrice].filter(Boolean).join("／")}（この行は合計に入りません）
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
