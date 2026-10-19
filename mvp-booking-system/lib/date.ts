const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

/** ローカル時刻での YYYY-MM-DD。toISOString() は UTC になり日本時間の朝に前日扱いになるため使わない */
export function toDateStr(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function todayStr(): string {
  return toDateStr(new Date());
}

function parse(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00`);
}

export function addDays(dateStr: string, days: number): string {
  const d = parse(dateStr);
  d.setDate(d.getDate() + days);
  return toDateStr(d);
}

/** from から to まで何日か（to が後なら正） */
export function diffDays(from: string, to: string): number {
  return Math.round((parse(to).getTime() - parse(from).getTime()) / 86_400_000);
}

/** その日を含む週（日曜はじまり）の7日分 */
export function weekOf(dateStr: string): string[] {
  const start = addDays(dateStr, -parse(dateStr).getDay());
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/** 週表示の列見出し用：日付の数字と曜日 */
export function dayParts(dateStr: string): { day: number; weekday: string } {
  const d = parse(dateStr);
  return { day: d.getDate(), weekday: WEEKDAYS[d.getDay()] };
}

/** 10/19(月) */
export function formatShortDate(dateStr: string): string {
  const d = parse(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}(${WEEKDAYS[d.getDay()]})`;
}

/** 2026年10月19日（月） */
export function formatFullDate(dateStr: string): string {
  const d = parse(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${WEEKDAYS[d.getDay()]}）`;
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('ja-JP', {
    month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}
