import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

const yen = new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" });

export function formatYen(amount: number): string {
  return yen.format(amount);
}

/** グラフ軸などの短縮表記: 1,250,000 → "125万" */
export function formatManYen(amount: number): string {
  return `${Math.round(amount / 10_000).toLocaleString("ja-JP")}万`;
}
