"use client";

import type { MouseEvent } from "react";
import { Calendar } from "lucide-react";
import { formatInputDate } from "@/lib/dates";
import { buttonStyles } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { ISODate } from "@/types";

interface DateInputProps {
  id?: string;
  name?: string;
  value: ISODate;
  onChange: (value: ISODate) => void;
  min?: ISODate;
  required?: boolean;
  className?: string;
}

/**
 * ネイティブの日付ピッカーはそのまま使い、表示だけ「2026年10月20日（火）」にする
 * （estimate-manager と同じ方式）。透明な input を上に重ね、クリック・キーボード操作は input が受ける。
 */
export function DateInput({ id, name, value, onChange, min, required, className }: DateInputProps) {
  function openPicker(e: MouseEvent<HTMLInputElement>): void {
    try {
      e.currentTarget.showPicker();
    } catch {
      // showPicker 非対応ブラウザでは通常の input 操作にまかせる
    }
  }

  return (
    <span className={cn("relative block", className)}>
      <input
        id={id}
        name={name}
        type="date"
        value={value}
        min={min}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        onClick={openPicker}
        className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
      <span
        aria-hidden
        className={cn(
          buttonStyles.input,
          "pointer-events-none flex items-center justify-between gap-2 whitespace-nowrap peer-focus-visible:border-blue peer-focus-visible:ring-2 peer-focus-visible:ring-blue-tint",
        )}
      >
        <span className={value ? "num" : "text-warm-300"}>{value ? formatInputDate(value) : "日付を選択"}</span>
        <Calendar size={15} className="shrink-0 text-warm-500" />
      </span>
    </span>
  );
}
