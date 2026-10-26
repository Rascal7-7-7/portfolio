'use client';

import { toDateStr } from '@/lib/date';
import Icon, { type IconName } from '@/components/Icon';

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

interface Props {
  /** 表示中の月の1日（YYYY-MM-01） */
  month:       string;
  today:       string;
  selected:    string | null;
  isAvailable: (date: string) => boolean;
  canPrev:     boolean;
  canNext:     boolean;
  onMonth:     (delta: -1 | 1) => void;
  onSelect:    (date: string) => void;
}

/** Cal.com の予約ページと同じ月カレンダー。空きのある日だけ地色を付けて押せるようにする */
export default function MonthCalendar({ month, today, selected, isAvailable, canPrev, canNext, onMonth, onSelect }: Props) {
  const first = new Date(`${month}T00:00:00`);
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) =>
    toDateStr(new Date(first.getFullYear(), first.getMonth(), i + 1)));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="font-serif text-lg text-ink tabular-nums" aria-live="polite">
          {first.getFullYear()}年{first.getMonth() + 1}月
        </p>
        <div className="flex gap-1">
          <MonthButton label="前の月" icon="chevron_left" disabled={!canPrev} onClick={() => onMonth(-1)} />
          <MonthButton label="次の月" icon="chevron_right" disabled={!canNext} onClick={() => onMonth(1)} />
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-center" role="group" aria-label="日付を選ぶ">
        {WEEKDAYS.map(w => <span key={w} className="text-xs text-dim pb-1" aria-hidden="true">{w}</span>)}
        {Array.from({ length: first.getDay() }, (_, i) => <span key={`pad-${i}`} />)}
        {days.map(d => {
          const available = isAvailable(d);
          const isSelected = d === selected;
          const [, m, day] = d.split('-').map(Number);
          return (
            <button key={d} type="button" disabled={!available} aria-pressed={isSelected}
              aria-label={`${m}月${day}日${available ? '' : d < today ? '（受付終了）' : '（空きなし）'}`}
              onClick={() => onSelect(d)}
              className={`relative aspect-square max-h-12 w-full rounded-lg text-sm tabular-nums focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand ${
                isSelected ? 'bg-accent text-white font-bold'
                  : available ? 'bg-accent-soft text-ink font-medium hover:bg-[#f1e0dc]'
                  : 'text-dim/40 cursor-not-allowed'
              }`}>
              {day}
              {d === today && (
                <span aria-hidden="true" className={`absolute bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full ${isSelected ? 'bg-white' : 'bg-ink'}`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MonthButton({ label, icon, disabled, onClick }: { label: string; icon: IconName; disabled: boolean; onClick: () => void }) {
  return (
    <button type="button" aria-label={label} disabled={disabled} onClick={onClick}
      className="size-8 flex items-center justify-center rounded-md text-body hover:bg-muted disabled:text-line-strong disabled:hover:bg-transparent focus-visible:outline-2 focus-visible:outline-brand">
      <Icon name={icon} />
    </button>
  );
}
