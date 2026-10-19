import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** シリーズ共通で半角「¥」を使う（ja-JP の Intl 通貨表記は全角「￥」になるため自前で付ける） */
export function formatYen(amount: number): string {
  const sign = amount < 0 ? "-" : "";
  return `${sign}¥${Math.abs(Math.round(amount)).toLocaleString("ja-JP")}`;
}

/** グラフ軸などの短縮表記: 1,250,000 → "125万" */
export function formatManYen(amount: number): string {
  return `${Math.round(amount / 10_000).toLocaleString("ja-JP")}万`;
}

/** "２２0,000円" → "220000"。数字以外は捨て、先頭の 0 は落とす */
export function toDigits(value: string): string {
  return value
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/\D/g, "")
    .replace(/^0+/, "")
    .slice(0, 12);
}
