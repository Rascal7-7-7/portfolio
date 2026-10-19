'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { addDays, dayParts, diffDays, formatFullDate, toMinutes, weekOf } from '@/lib/date';
import { CLOSE_MIN, OPEN_MIN, availableSlots, durationMin, endTime, placeInLanes, toTime } from '@/lib/slots';
import { sortByDateTime, useStore } from '@/lib/store';
import { MENUS, STAFF, type Reservation, type Staff } from '@/lib/types';
import ChannelBadge from '@/components/ChannelBadge';
import LoadingState from '@/components/LoadingState';
import { needsAttention } from '@/components/ReservationRow';
import StatusBadge from '@/components/StatusBadge';
import { PageHeader, STAFF_TONE, StatStrip, btn } from '@/components/ui';
import Icon, { type IconName } from '@/components/Icon';
import WeekGrid, { WeekLegend } from '@/components/WeekGrid';

const SLOT_H = 112;
/** これより低いカードは1行目に名前まで詰める */
const COMPACT_H = 100;
/** 空き枠を数えるときの基準（いちばん短いメニュー） */
const SHORTEST = MENUS.reduce((a, b) => (b.minutes < a.minutes ? b : a));
const OPEN_HOURS = Array.from({ length: (CLOSE_MIN - OPEN_MIN) / 60 }, (_, i) => OPEN_MIN / 60 + i);

/** 予定ブロックの見た目。色は「要対応」だけに使い、ほかは地の色と枠の形（キャンセル=破線）で区別する */
function blockCls(r: Reservation): string {
  if (r.status === 'canceled')  return 'bg-canvas border border-dashed border-line-strong';
  if (r.status === 'pending')   return 'bg-attn-soft border border-attn-bg';
  if (r.status === 'completed') return 'bg-canvas border border-line';
  return 'bg-subtle border border-line';
}

function minutesNow(): number {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

/** 現在時刻（分）。1分ごとに更新して、スケジュールの赤線を動かす */
function useNowMinutes(): number {
  const [now, setNow] = useState(minutesNow);
  useEffect(() => {
    const t = setInterval(() => setNow(minutesNow()), 60_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

type Mode = 'day' | 'week';

export default function ScheduleView() {
  const { reservations, today } = useStore();
  const [offset, setOffset] = useState(0);
  // デスクトップは週表示から。スマホは幅が足りないので常に日表示（タブも出さない）
  const [mode, setMode] = useState<Mode>('week');
  const [staff, setStaff] = useState<Staff>(STAFF[0]);
  const now = useNowMinutes();
  if (!reservations) return <LoadingState />;

  const date = addDays(today, offset);
  const nowInHours = now >= OPEN_MIN && now < CLOSE_MIN ? now : null;
  const pickDay = (d: string) => { setOffset(diffDays(today, d)); setMode('day'); };

  return (
    <div className="px-4 md:px-10 py-6 md:py-10 max-w-5xl">
      <PageHeader title="スケジュール" action={<ModeTabs mode={mode} onChange={setMode} />} />
      {mode === 'week' && (
        <div className="hidden md:block">
          <WeekSection date={date} today={today} reservations={reservations} nowMin={nowInHours}
            onMove={days => setOffset(o => (days === 0 ? 0 : o + days))} onPickDay={pickDay} />
        </div>
      )}
      <div className={mode === 'week' ? 'md:hidden' : ''}>
        <DaySection date={date} offset={offset} today={today} reservations={reservations} now={now}
          nowMin={offset === 0 ? nowInHours : null} staff={staff} onStaff={setStaff} onOffset={setOffset} />
      </div>
    </div>
  );
}

/** 日表示 / 週表示の切り替え（デスクトップだけ） */
function ModeTabs({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div role="group" aria-label="表示の切り替え" className="hidden md:grid grid-cols-2 gap-0.5 p-0.5 rounded-md border border-line bg-muted">
      {([['day', '日'], ['week', '週']] as const).map(([m, label]) => (
        <button key={m} type="button" aria-pressed={mode === m} onClick={() => onChange(m)}
          className={`h-7 px-4 rounded-[5px] text-sm focus-visible:outline-2 focus-visible:outline-brand ${
            mode === m ? 'bg-canvas text-ink font-medium shadow-[0_0_0_1px_var(--color-line),0_1px_2px_rgba(0,0,0,0.06)]' : 'text-dim hover:text-ink'
          }`}>
          {label}
        </button>
      ))}
    </div>
  );
}

function WeekSection({ date, today, reservations, nowMin, onMove, onPickDay }: {
  date: string; today: string; reservations: Reservation[]; nowMin: number | null;
  onMove: (days: number) => void; onPickDay: (d: string) => void;
}) {
  const days = weekOf(date);
  const weeksAway = diffDays(weekOf(today)[0], days[0]) / 7;
  const list = reservations.filter(r => days.includes(r.reservation_date));
  const active = list.filter(r => r.status !== 'canceled');
  const pending = list.filter(r => r.status === 'pending');
  const unnotified = list.filter(needsAttention);
  const last = dayParts(days[6]);
  return (
    <>
      <div className="flex items-center justify-between gap-2 mb-6">
        <div className="min-w-0" aria-live="polite">
          <p className="text-base font-bold text-ink tabular-nums">{formatFullDate(days[0])} 〜 {last.day}日（{last.weekday}）</p>
          <p className="text-xs text-dim mt-0.5">{weeksAway === 0 ? '今週' : weeksAway > 0 ? `${weeksAway}週後` : `${-weeksAway}週前`}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {weeksAway !== 0 && (
            <button type="button" onClick={() => onMove(0)} className={btn('secondary', 'sm')}>今週に戻る</button>
          )}
          <div className="inline-flex rounded-md border border-line-strong divide-x divide-line-strong overflow-hidden">
            <DayButton label="前の週" icon="chevron_left" onClick={() => onMove(-7)} />
            <DayButton label="次の週" icon="chevron_right" onClick={() => onMove(7)} />
          </div>
        </div>
      </div>
      <StatStrip items={[
        { label: 'この週の予約', value: active.length, note: `キャンセル除く・全${list.length}件` },
        { label: '確定待ち', value: pending.length },
        { label: '未通知', value: unnotified.length, alert: unnotified.length > 0 },
      ]} />
      <div className="mb-3"><WeekLegend /></div>
      <WeekGrid days={days} reservations={list} today={today} nowMin={nowMin} onPickDay={onPickDay} />
    </>
  );
}

function DaySection({ date, offset, today, reservations, now, nowMin, staff, onStaff: setStaff, onOffset: setOffset }: {
  date: string; offset: number; today: string; reservations: Reservation[]; now: number; nowMin: number | null;
  staff: Staff; onStaff: (s: Staff) => void; onOffset: (update: number | ((o: number) => number)) => void;
}) {
  const list = sortByDateTime(reservations.filter(r => r.reservation_date === date));
  // 「予約件数」と重ならない指標として、まだ予約を受けられる枠を出す（本日は過ぎた時刻を除く）
  const open = date < today ? 0 : availableSlots(reservations, date, SHORTEST.minutes, date === today ? now : 0).length;
  const unnotified = list.filter(needsAttention);
  const byStaff = (s: Staff) => list.filter(r => r.staff === s);

  return (
    <>
      <div className="flex items-center justify-between gap-2 mb-6">
        <div className="min-w-0" aria-live="polite">
          <p className="text-base font-bold text-ink tabular-nums">{formatFullDate(date)}</p>
          <p className="text-xs text-dim mt-0.5">{offset === 0 ? '本日' : `本日から${offset > 0 ? `${offset}日後` : `${-offset}日前`}`}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {offset !== 0 && (
            <button type="button" onClick={() => setOffset(0)} className={btn('secondary', 'sm')}>今日に戻る</button>
          )}
          <div className="inline-flex rounded-md border border-line-strong divide-x divide-line-strong overflow-hidden">
            <DayButton label="前日" icon="chevron_left" onClick={() => setOffset(o => o - 1)} />
            <DayButton label="翌日" icon="chevron_right" onClick={() => setOffset(o => o + 1)} />
          </div>
        </div>
      </div>

      <StatStrip items={[
        { label: '予約件数', value: list.length },
        { label: '空き枠', value: open, unit: '枠', note: `${SHORTEST.minutes}分メニューで予約できる開始時刻` },
        { label: '未通知', value: unnotified.length, alert: unnotified.length > 0 },
      ]} />

      {list.length === 0 ? (
        <p className="border border-line rounded-lg px-6 py-14 text-center text-sm text-dim">この日の予約はありません</p>
      ) : (
        <>
          <Timeline byStaff={byStaff} nowMin={nowMin} />
          <div className="md:hidden">
            <StaffSwitcher current={staff} counts={STAFF.map(s => byStaff(s).length)} onChange={setStaff} />
            {byStaff(staff).length === 0 ? (
              <p className="border border-line rounded-lg px-6 py-10 text-center text-sm text-dim">{staff} さんの予約はありません</p>
            ) : (
              <ul className="border border-line rounded-lg divide-y divide-line">
                {byStaff(staff).map(r => <li key={r.id}><MobileRow r={r} /></li>)}
              </ul>
            )}
          </div>
        </>
      )}
    </>
  );
}

function DayButton({ label, icon, onClick }: { label: string; icon: IconName; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label={label}
      className="h-8 w-9 flex items-center justify-center bg-canvas text-body hover:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand">
      <Icon name={icon} />
    </button>
  );
}

/** スマホ: 担当の切り替え（詳細画面のステータス切り替えと同じ形） */
function StaffSwitcher({ current, counts, onChange }: { current: Staff; counts: number[]; onChange: (s: Staff) => void }) {
  return (
    <div role="group" aria-label="担当を切り替え" className="grid grid-cols-2 gap-0.5 p-0.5 mb-3 rounded-md border border-line bg-muted">
      {STAFF.map((s, i) => {
        const active = s === current;
        return (
          <button key={s} type="button" aria-pressed={active} onClick={() => onChange(s)}
            className={`h-9 rounded-[5px] text-sm focus-visible:outline-2 focus-visible:outline-brand ${
              active ? 'bg-canvas text-ink font-medium shadow-[0_0_0_1px_var(--color-line),0_1px_2px_rgba(0,0,0,0.06)]' : 'text-dim hover:text-ink'
            }`}>
            <span className={`inline-block size-2 rounded-full mr-1.5 align-[1px] ${STAFF_TONE[s].dot}`} aria-hidden="true" />
            {s}<span className="ml-1 text-xs font-normal text-dim tabular-nums">{counts[i]}件</span>
          </button>
        );
      })}
    </div>
  );
}

/** デスクトップ: 営業時間の時間軸に、担当ごとの列で予約を並べる */
function Timeline({ byStaff, nowMin }: { byStaff: (s: Staff) => Reservation[]; nowMin: number | null }) {
  const nowTop = nowMin === null ? null : ((nowMin - OPEN_MIN) / 60) * SLOT_H + 3;
  const cols = { gridTemplateColumns: `64px repeat(${STAFF.length}, minmax(0, 1fr))` };
  return (
    <div className="hidden md:block border border-line rounded-lg overflow-hidden">
      <div className="grid border-b border-line bg-muted" style={cols}>
        <div className="border-r border-line" />
        {STAFF.map((s, i) => (
          <p key={s} className={`flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink ${i > 0 ? 'border-l border-line' : ''}`}>
            <span className={`size-2 rounded-full ${STAFF_TONE[s].dot}`} aria-hidden="true" />{s}<span className="ml-1.5 text-xs font-normal text-dim tabular-nums">{byStaff(s).length}件</span>
          </p>
        ))}
      </div>
      <div className="grid" style={cols}>
        <div className="relative border-r border-line pt-1.5">
          {nowTop !== null && (
            <p className="absolute right-1 -translate-y-1/2 z-10 bg-canvas px-0.5 text-[11px] font-medium text-now tabular-nums" style={{ top: nowTop }}>
              <span className="sr-only">現在時刻 </span>{toTime(nowMin ?? 0)}
            </p>
          )}
          {OPEN_HOURS.map(h => (
            <div key={h} className="pr-3 text-right text-xs text-dim tabular-nums" style={{ height: SLOT_H }}>
              {String(h).padStart(2, '0')}:00
            </div>
          ))}
        </div>
        {STAFF.map((s, i) => (
          <StaffColumn key={s} list={byStaff(s)} divider={i > 0} nowTop={nowTop} />
        ))}
      </div>
    </div>
  );
}

/** 列の地は白のまま。担当の色は列見出しの色見本だけに使う（地を塗ると意味のない帯に見える） */
function StaffColumn({ list, divider, nowTop }: { list: Reservation[]; divider: boolean; nowTop: number | null }) {
  return (
    <div className={`relative ${divider ? 'border-l border-line' : ''}`} style={{ height: SLOT_H * OPEN_HOURS.length }}>
      {OPEN_HOURS.map((h, i) => (
        <div key={h} className="absolute left-0 right-0 border-t border-line" style={{ top: i * SLOT_H + 3 }} />
      ))}
      {placeInLanes(list).map(({ r, lane, lanes }) => {
        const top = Math.max(0, ((toMinutes(r.reservation_time) - OPEN_MIN) / 60) * SLOT_H + 3);
        const width = `calc((100% - 16px - ${(lanes - 1) * 6}px) / ${lanes})`;
        const left = `calc(8px + (${width} + 6px) * ${lane})`;
        // ブロックの高さ = 所要時間（区切りが見えるよう 4px 詰める）
        const height = (durationMin(r) / 60) * SLOT_H - 4;
        return (
          <div key={r.id} className="absolute" style={{ top: top + 2, left, width, height }}>
            <Block r={r} compact={height < COMPACT_H} />
          </div>
        );
      })}
      {nowTop !== null && <div aria-hidden="true" className="absolute left-0 right-0 z-10 h-0.5 bg-now pointer-events-none" style={{ top: nowTop - 1 }} />}
    </div>
  );
}

/** 時間軸上の予定ブロック。短い予約（compact）は1行目に時刻・名前・状態をまとめる */
function Block({ r, compact }: { r: Reservation; compact: boolean }) {
  const canceled = r.status === 'canceled';
  return (
    <Link href={`/reservations/${r.id}`}
      className={`block h-full overflow-hidden rounded-md px-3 ${compact ? 'py-1.5' : 'py-2.5'} hover:brightness-[0.98] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand ${blockCls(r)}`}>
      <p className="flex items-center gap-2 min-w-0">
        <span className="text-xs text-body tabular-nums shrink-0">{r.reservation_time}–{endTime(r)}</span>
        {compact && <Name r={r} canceled={canceled} />}
        <span className="ml-auto shrink-0"><StatusBadge status={r.status} /></span>
      </p>
      {!compact && <p className="mt-1"><Name r={r} canceled={canceled} /></p>}
      <p className="text-xs text-dim truncate mt-0.5">
        {r.service_name}<span aria-hidden="true"> · </span><ChannelBadge channel={r.channel} />
        {compact && needsAttention(r) && <span className="text-attn font-medium ml-2">確認通知 未送信</span>}
      </p>
      {!compact && needsAttention(r) && <p className="text-xs text-attn font-medium mt-1">確認通知 未送信</p>}
      {!compact && r.note && <p className="text-xs text-dim mt-0.5 truncate">備考: {r.note}</p>}
    </Link>
  );
}

function Name({ r, canceled }: { r: Reservation; canceled: boolean }) {
  return (
    <span className={`text-sm font-medium text-ink truncate ${canceled ? 'line-through' : ''}`}>
      {r.customer_name}<span className="font-normal text-xs text-dim ml-0.5">様</span>
    </span>
  );
}

/** スマホ: 一覧画面と同じ行の形で、終了時刻と備考まで出す */
function MobileRow({ r }: { r: Reservation }) {
  return (
    <Link href={`/reservations/${r.id}`}
      className="flex gap-3 px-4 py-3.5 hover:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand">
      <div className="shrink-0 w-14 tabular-nums">
        <p className="text-sm font-medium text-ink">{r.reservation_time}</p>
        <p className="text-xs text-dim mt-0.5">〜{endTime(r)}</p>
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate"><Name r={r} canceled={r.status === 'canceled'} /></p>
        <p className="text-xs text-dim truncate mt-0.5">
          {r.service_name}<span aria-hidden="true"> · </span><ChannelBadge channel={r.channel} />
        </p>
        {needsAttention(r) && <p className="text-xs text-attn font-medium mt-1">確認通知 未送信</p>}
        {r.note && <p className="text-xs text-dim mt-0.5 truncate">備考: {r.note}</p>}
      </div>
      <div className="shrink-0"><StatusBadge status={r.status} /></div>
    </Link>
  );
}
