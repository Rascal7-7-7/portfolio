'use client';
import { Minus, Plus } from 'lucide-react';
import { MAX_QUANTITY } from '@/lib/store';

type Props = {
  value: number;
  onChange: (next: number) => void;
  labelledBy?: string;
  label?: string;
};

export function QuantityStepper({ value, onChange, labelledBy, label }: Props) {
  const btn =
    'flex h-8 w-8 items-center justify-center rounded text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-30 disabled:hover:bg-transparent';
  return (
    <div role="group" aria-labelledby={labelledBy} aria-label={label} className="inline-flex items-center rounded-md ring-1 ring-outline-variant">
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="数量を減らす">
        <Minus className="h-3.5 w-3.5" aria-hidden />
      </button>
      <span className="tnum w-8 text-center text-sm font-semibold text-on-surface" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value + 1)}
        disabled={value >= MAX_QUANTITY}
        aria-label="数量を増やす"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden />
      </button>
    </div>
  );
}
