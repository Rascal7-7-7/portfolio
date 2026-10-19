'use client';

import { useState } from 'react';
import Link from 'next/link';
import { addDays, formatFullDate, toMinutes } from '@/lib/date';
import { sortByDateTime, useStore } from '@/lib/store';
import { findMenu, type Reservation } from '@/lib/types';
import ChannelBadge from '@/components/ChannelBadge';
import LoadingState from '@/components/LoadingState';
import { needsAttention } from '@/components/ReservationRow';
import StatusBadge from '@/components/StatusBadge';
import { PageHeader, StatStrip, btn } from '@/components/ui';

const SLOT_H = 112;
/** メニューに無い施術名のときの所要時間 */
const DEFAULT_MIN = 60;
/** これより低いカードは1行目に名前まで詰める */
const COMPACT_H = 100;
const OPEN_HOURS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

function durationMin(r: Reservation): number {
  return findMenu(r.service_name)?.minutes ?? DEFAULT_MIN;
}

function endTime(r: Reservation): string {
  const end = toMinutes(r.reservation_time) + durationMin(r);
  return `${String(Math.floor(end / 60)).padStart(2, '0')}:${String(end % 60).padStart(2, '0')}`;
}

/** 予定ブロックの見た目。色は「要対応」だけに使い、ほかは地の色と枠の形（キャンセル=破線）で区別する */
function blockCls(r: Reservation): string {
  if (r.status === 'canceled')  return 'bg-canvas border border-dashed border-line-strong';
  if (r.status === 'pending')   return 'bg-attn-soft border border-attn-bg';
  if (r.status === 'completed') return 'bg-canvas border border-line';
  return 'bg-subtle border border-line';
}

export default function ScheduleView() {
  const { reservations, today } = useStore();
  const [offset, setOffset] = useState(0);
  if (!reservations) return <LoadingState />;

  const date = addDays(today, offset);
  const list = sortByDateTime(reservations.filter(r => r.reservation_date === date));
  const active = list.filter(r => r.status === 'pending' || r.status === 'confirmed');
  const unnotified = list.filter(needsAttention);

  return (
    <div className="px-4 md:px-10 py-6 md:py-10 max-w-4xl">
      <PageHeader title="日別スケジュール" description="ホワイトボードや紙の予定表の代わりに、1日の流れを確認できます。" />

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
        { label: '対応予定', value: active.length },
        { label: '未通知', value: unnotified.length, alert: unnotified.length > 0 },
      ]} />

      {list.length === 0 ? (
        <p className="border border-line rounded-lg px-6 py-14 text-center text-sm text-dim">この日の予約はありません</p>
      ) : (
        <>
          <Timeline list={list} />
          <ul className="md:hidden border border-line rounded-lg divide-y divide-line">
            {list.map(r => <li key={r.id}><MobileRow r={r} /></li>)}
          </ul>
        </>
      )}
    </div>
  );
}

function DayButton({ label, icon, onClick }: { label: string; icon: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label={label}
      className="h-8 w-9 flex items-center justify-center bg-canvas text-body hover:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand">
      <span className="material-symbols-outlined" aria-hidden="true">{icon}</span>
    </button>
  );
}

interface Placed { r: Reservation; lane: number; lanes: number }

/** 時間が近くカードが重なる予約を横に並べる（list は時刻順） */
export function placeInLanes(list: Reservation[]): Placed[] {
  const placed: Placed[] = [];
  let cluster: { r: Reservation; lane: number }[] = [];
  let laneEnds: number[] = [];
  const flush = () => {
    placed.push(...cluster.map(c => ({ ...c, lanes: laneEnds.length })));
    cluster = [];
    laneEnds = [];
  };
  for (const r of list) {
    const start = toMinutes(r.reservation_time);
    if (laneEnds.length > 0 && laneEnds.every(end => end <= start)) flush();
    const free = laneEnds.findIndex(end => end <= start);
    const lane = free === -1 ? laneEnds.length : free;
    const end = start + durationMin(r);
    laneEnds = laneEnds.map((e, i) => (i === lane ? end : e));
    if (lane === laneEnds.length) laneEnds = [...laneEnds, end];
    cluster = [...cluster, { r, lane }];
  }
  flush();
  return placed;
}

/** デスクトップ: 営業時間の時間軸に予約を並べる */
function Timeline({ list }: { list: Reservation[] }) {
  const startMin = OPEN_HOURS[0] * 60;
  return (
    <div className="hidden md:block border border-line rounded-lg overflow-hidden">
      <div className="grid grid-cols-[64px_1fr]">
        <div className="border-r border-line pt-1.5">
          {OPEN_HOURS.map(h => (
            <div key={h} className="pr-3 text-right text-xs text-dim tabular-nums" style={{ height: SLOT_H }}>
              {String(h).padStart(2, '0')}:00
            </div>
          ))}
        </div>
        <div className="relative" style={{ height: SLOT_H * OPEN_HOURS.length }}>
          {OPEN_HOURS.map((h, i) => (
            <div key={h} className="absolute left-0 right-0 border-t border-line" style={{ top: i * SLOT_H + 3 }} />
          ))}
          {placeInLanes(list).map(({ r, lane, lanes }) => {
            const top = Math.max(0, ((toMinutes(r.reservation_time) - startMin) / 60) * SLOT_H + 3);
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
        </div>
      </div>
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
