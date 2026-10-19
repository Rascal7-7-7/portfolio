import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatYen(amount: number): string {
  return `¥${amount.toLocaleString("ja-JP")}`;
}

function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(iso: string, days: number): string {
  const date = parseISODate(iso);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

export function todayISO(): string {
  return toISODate(new Date());
}

/** from から to までの日数（to が過去なら負） */
export function daysBetween(from: string, to: string): number {
  const ms = parseISODate(to).getTime() - parseISODate(from).getTime();
  return Math.round(ms / 86_400_000);
}

export function formatDate(iso: string): string {
  const date = parseISODate(iso);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

/** 履歴用の短い日付：9/24 */
export function formatShortDate(iso: string): string {
  const date = parseISODate(iso);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

const WEEKDAYS_JA = "日月火水木金土";

/** フォーム表示用：2026年10月19日（月） */
export function formatDateWithWeekday(iso: string): string {
  return `${formatDate(iso)}（${WEEKDAYS_JA[parseISODate(iso).getDay()]}）`;
}

export function estimateNumber(id: number): string {
  return `EST-${String(id).padStart(4, "0")}`;
}

/** 受注後の請求は姉妹デモ「Hikae」で管理する。デモで連携しているのは EST-0014 だけ */
export const HIKAE_INVOICES_URL = "https://mvp-freelance-manager.vercel.app/invoices";
/** 連携済みの見積 id → Hikae 側の請求書番号（Hikae の seed と一致させる） */
const HIKAE_INVOICE_NUMBERS: Readonly<Record<number, string>> = { 14: "INV-0017" };

/** 連携済みの見積なら Hikae の請求書 URL、それ以外は null */
export function hikaeInvoiceUrl(id: number): string | null {
  return id in HIKAE_INVOICE_NUMBERS ? `${HIKAE_INVOICES_URL}/${estimateNumber(id).toLowerCase()}` : null;
}

/** 連携済みの見積なら Hikae 側の請求書番号、それ以外は null */
export function hikaeInvoiceNumber(id: number): string | null {
  return HIKAE_INVOICE_NUMBERS[id] ?? null;
}
