// 日付は 'YYYY-MM-DD' 文字列で持ち、UTC で計算する（サーバー/ブラウザのタイムゾーン差を避ける）。
import type { SubscriptionInterval } from './types';

export const FIRST_DELIVERY_LEAD_DAYS = 3;
const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];
const MONTHS_PER_INTERVAL: Record<SubscriptionInterval, number> = { monthly: 1, bimonthly: 2 };

function parse(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function toIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function todayIso(now: Date = new Date()): string {
  const local = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  return toIso(local);
}

export function addDays(iso: string, days: number): string {
  const date = parse(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return toIso(date);
}

/** 月末をまたぐ場合は月末日に丸める（1/31 + 1ヶ月 = 2/28） */
export function addMonths(iso: string, months: number): string {
  const date = parse(iso);
  const day = date.getUTCDate();
  const target = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(day, lastDay));
  return toIso(target);
}

export function nextAfter(iso: string, interval: SubscriptionInterval): string {
  return addMonths(iso, MONTHS_PER_INTERVAL[interval]);
}

export function prevBefore(iso: string, interval: SubscriptionInterval): string {
  return addMonths(iso, -MONTHS_PER_INTERVAL[interval]);
}

export function firstDelivery(today: string): string {
  return addDays(today, FIRST_DELIVERY_LEAD_DAYS);
}

/** 例: 11月5日(木) */
export function formatJa(iso: string): string {
  const date = parse(iso);
  return `${date.getUTCMonth() + 1}月${date.getUTCDate()}日(${WEEKDAYS[date.getUTCDay()]})`;
}

export function formatJaLong(iso: string): string {
  return `${parse(iso).getUTCFullYear()}年${formatJa(iso)}`;
}
