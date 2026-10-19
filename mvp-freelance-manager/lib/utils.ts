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

export const TAX_RATE = 10;

/** 請求額は税込で持っているため、内税として消費税を割り戻す（1円未満切り捨て） */
export function taxIncluded(amount: number): number {
  return Math.floor((amount * TAX_RATE) / (100 + TAX_RATE));
}

/** 見積マネージャー（別 MVP）の該当見積ページ。"EST-0014" → /estimates/14 */
export function estimateUrl(estimateNo: string): string {
  return `https://mvp-estimate-manager.vercel.app/estimates/${Number(estimateNo.replace(/\D/g, ""))}`;
}
