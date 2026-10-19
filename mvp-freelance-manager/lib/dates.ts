import type { ISODate } from "@/types";

const DAY_MS = 24 * 60 * 60 * 1000;

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function toISODate(date: Date): ISODate {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** "YYYY-MM-DD" をローカル日付の 0 時として解釈する（UTC ずれを避ける） */
export function parseISODate(value: ISODate): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function todayISO(): ISODate {
  return toISODate(new Date());
}

export function addDays(base: ISODate, days: number): ISODate {
  const date = parseISODate(base);
  return toISODate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + days));
}

/** 同じ日 = 0、明日 = 1、昨日 = -1 */
export function diffDays(from: ISODate, to: ISODate): number {
  return Math.round((parseISODate(to).getTime() - parseISODate(from).getTime()) / DAY_MS);
}

/** "YYYY-MM" */
export function monthKey(value: ISODate): string {
  return value.slice(0, 7);
}

/** base の月から offset ヶ月ずらした "YYYY-MM" */
export function shiftMonth(base: ISODate, offset: number): string {
  const date = parseISODate(base);
  const shifted = new Date(date.getFullYear(), date.getMonth() + offset, 1);
  return `${shifted.getFullYear()}-${pad(shifted.getMonth() + 1)}`;
}

export function formatDate(value: ISODate): string {
  const date = parseISODate(value);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

/** "10月19日(日)" */
export function formatLongDate(value: ISODate): string {
  return new Intl.DateTimeFormat("ja-JP", { month: "long", day: "numeric", weekday: "short" }).format(
    parseISODate(value),
  );
}

export function formatMonthLabel(key: string): string {
  return `${Number(key.slice(5, 7))}月`;
}

/** 今日を基準にした「あと3日」「2日超過」などの表示 */
export function formatRelative(today: ISODate, target: ISODate): string {
  const days = diffDays(today, target);
  if (days === 0) return "今日";
  if (days === 1) return "明日";
  if (days > 0) return `あと${days}日`;
  return `${-days}日超過`;
}

/** 過去の日付を「今日」「昨日」「3日前」「2ヶ月前」で表す（アクティビティ用） */
export function formatAgo(today: ISODate, past: ISODate): string {
  const days = diffDays(past, today);
  if (days <= 0) return "今日";
  if (days === 1) return "昨日";
  if (days < 30) return `${days}日前`;
  return `${Math.floor(days / 30)}ヶ月前`;
}

/** 日付入力の表示 "2026年10月20日（火）"。ブラウザのロケールに左右されない */
export function formatInputDate(value: ISODate): string {
  const date = parseISODate(value);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日（${"日月火水木金土"[date.getDay()]}）`;
}
