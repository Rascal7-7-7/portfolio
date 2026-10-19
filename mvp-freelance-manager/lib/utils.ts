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

const CORPORATE_TERMS = /株式会社|有限会社|合同会社|一般社団法人|（株）|\(株\)|\s/g;

/** 取引先アバターの頭文字。法人格を除いた先頭1文字（英字なら2文字） */
export function clientInitial(client: string): string {
  const name = client.replace(CORPORATE_TERMS, "") || client;
  const latin = name.match(/^[A-Za-z]{1,2}/);
  return latin ? latin[0].toUpperCase() : (Array.from(name)[0] ?? "?");
}
