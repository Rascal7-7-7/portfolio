import { toMinutes } from './date';
import { STAFF, findMenu, type Reservation, type Staff } from './types';

/** 営業時間 10:00〜20:00。予約枠は30分刻み */
export const OPEN_MIN = 10 * 60;
export const CLOSE_MIN = 20 * 60;
const STEP_MIN = 30;
/** メニューに無い施術名のときの所要時間 */
const DEFAULT_MIN = 60;

export function durationMin(r: Pick<Reservation, 'service_name'>): number {
  return findMenu(r.service_name)?.minutes ?? DEFAULT_MIN;
}

export function toTime(min: number): string {
  return `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
}

export function endTime(r: Pick<Reservation, 'reservation_time' | 'service_name'>): string {
  return toTime(toMinutes(r.reservation_time) + durationMin(r));
}

export interface Slot { time: string; staff: Staff }

/**
 * その日に予約できる開始時刻。担当2名のどちらかが [開始, 開始+所要時間) を丸ごと空けていれば出す。
 * キャンセル済みの予約は空きとして扱う。notBeforeMin より前の枠（本日の過ぎた時刻）は出さない。
 * ponytail: 全予約を毎回なめる O(枠数×予約数)。デモの件数なら十分で、実運用なら担当×日付で索引する。
 */
export function availableSlots(
  reservations: Reservation[], date: string, minutes: number, notBeforeMin = 0,
): Slot[] {
  const busy = reservations
    .filter(r => r.reservation_date === date && r.status !== 'canceled')
    .map(r => ({ staff: r.staff, start: toMinutes(r.reservation_time), end: toMinutes(r.reservation_time) + durationMin(r) }));

  const slots: Slot[] = [];
  for (let start = OPEN_MIN; start + minutes <= CLOSE_MIN; start += STEP_MIN) {
    if (start < notBeforeMin) continue;
    const end = start + minutes;
    const staff = STAFF.find(s => busy.every(b => b.staff !== s || b.end <= start || end <= b.start));
    if (staff) slots.push({ time: toTime(start), staff });
  }
  return slots;
}

/** 管理画面の時間の選択肢（営業時間内・30分刻み） */
export const TIME_OPTIONS = Array.from({ length: (CLOSE_MIN - OPEN_MIN) / STEP_MIN }, (_, i) => toTime(OPEN_MIN + i * STEP_MIN));

/** 同じ担当・同じ日で時間帯が重なる予約（キャンセル済みと、編集中の予約自身は除く） */
export function findConflict(
  reservations: Reservation[],
  input: Pick<Reservation, 'reservation_date' | 'reservation_time' | 'service_name' | 'staff'>,
  excludeId?: number,
): Reservation | undefined {
  const start = toMinutes(input.reservation_time);
  const end = start + durationMin(input);
  return reservations.find(r =>
    r.id !== excludeId && r.status !== 'canceled'
    && r.staff === input.staff && r.reservation_date === input.reservation_date
    && toMinutes(r.reservation_time) < end && start < toMinutes(r.reservation_time) + durationMin(r));
}
