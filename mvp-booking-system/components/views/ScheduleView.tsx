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

function accentColor(r: Reservation): string {
  if (r.status === 'canceled')  return '#c4c5d5';
  if (needsAttention(r))        return '#ba1a1a';
  if (r.status === 'completed') return '#006e1c';
  if (r.status === 'confirmed') return '#00288e';
  return '#1a3844';
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
    <div className="px-4 md:px-10 py-6 md:py-8 max-w-4xl">
      <div className="mb-6">
        <p className="text-[11px] font-bold text-[#00288e] tracking-widest mb-1">DAILY SCHEDULE</p>
        <h1 className="text-xl md:text-2xl font-black text-[#1a3844]">日別スケジュール</h1>
        <p className="text-sm text-[#444653] mt-1">ホワイトボードや紙の予定表の代わりに、1日の流れを確認できます。</p>
      </div>

      <div className="flex items-center justify-between bg-white rounded-xl px-2 md:px-4 py-2 md:py-3 shadow-sm mb-6">
        <DayButton label="前日" icon="chevron_left" onClick={() => setOffset(o => o - 1)} />
        <div className="text-center" aria-live="polite">
          <p className="text-sm md:text-base font-black text-[#191c1d]">{formatFullDate(date)}</p>
          {offset === 0 ? (
            <span className="text-[11px] font-bold text-[#00288e]">本日</span>
          ) : (
            <button type="button" onClick={() => setOffset(0)} className="text-[11px] text-[#444653] hover:text-[#00288e] underline underline-offset-2">
              今日に戻る
            </button>
          )}
        </div>
        <DayButton label="翌日" icon="chevron_right" iconAfter onClick={() => setOffset(o => o + 1)} />
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
        {[
          { label: '予約件数', value: list.length,       color: '#191c1d' },
          { label: '対応予定', value: active.length,     color: '#00288e' },
          { label: '未通知',   value: unnotified.length, color: unnotified.length > 0 ? '#ba1a1a' : '#191c1d' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl px-3 md:px-5 py-3 md:py-4 shadow-sm text-center">
            <p className="text-[11px] font-bold text-[#444653] mb-1">{label}</p>
            <p className="text-2xl md:text-3xl font-black" style={{ color }}>
              {value}<span className="text-xs font-bold text-[#444653] ml-0.5">件</span>
            </p>
          </div>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="bg-white rounded-xl px-6 py-14 text-center text-sm text-[#444653] shadow-sm">
          この日の予約はありません
        </div>
      ) : (
        <>
          <Timeline list={list} />
          <div className="md:hidden space-y-3">
            {list.map(r => <Card key={r.id} r={r} />)}
          </div>
        </>
      )}
    </div>
  );
}

function DayButton({ label, icon, iconAfter = false, onClick }: {
  label: string; icon: string; iconAfter?: boolean; onClick: () => void;
}) {
  const i = <span className="material-symbols-outlined" aria-hidden="true">{icon}</span>;
  return (
    <button type="button" onClick={onClick}
      className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-[#444653] hover:text-[#00288e] hover:bg-[#f3f4f5] font-medium focus-visible:outline-2 focus-visible:outline-[#00288e]">
      {!iconAfter && i}{label}{iconAfter && i}
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
    <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="grid grid-cols-[72px_1fr]">
        <div className="bg-[#f3f4f5]/60 border-r border-[#f3f4f5] pt-3">
          {OPEN_HOURS.map(h => (
            <div key={h} className="flex items-start justify-end pr-3 text-[11px] font-black text-[#444653]" style={{ height: SLOT_H }}>
              {String(h).padStart(2, '0')}:00
            </div>
          ))}
        </div>
        <div className="relative" style={{ height: SLOT_H * OPEN_HOURS.length }}>
          {OPEN_HOURS.map((h, i) => (
            <div key={h} className="absolute left-0 right-0 border-t border-[#f3f4f5]" style={{ top: i * SLOT_H + 3 }} />
          ))}
          {placeInLanes(list).map(({ r, lane, lanes }) => {
            const top = Math.max(0, ((toMinutes(r.reservation_time) - startMin) / 60) * SLOT_H + 3);
            const width = `calc((100% - 24px - ${(lanes - 1) * 8}px) / ${lanes})`;
            const left = `calc(12px + (${width} + 8px) * ${lane})`;
            // カードの高さ = 所要時間（区切りが見えるよう 4px 詰める）
            const height = (durationMin(r) / 60) * SLOT_H - 4;
            return (
              <div key={r.id} className="absolute" style={{ top, left, width, height }}>
                <Card r={r} height={height} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** height 指定時（タイムライン）は枠いっぱいに伸ばし、はみ出た行は隠す */
function Card({ r, height }: { r: Reservation; height?: number }) {
  if (height !== undefined && height < COMPACT_H) return <CompactCard r={r} />;
  return (
    <Link href={`/reservations/${r.id}`}
      className={`flex items-start gap-3 rounded-lg px-4 py-3 ${height !== undefined ? 'h-full overflow-hidden' : ''} ring-1 ring-black/5 hover:shadow-md transition-shadow focus-visible:outline-2 focus-visible:outline-[#00288e] ${r.status === 'canceled' ? 'bg-[#f3f4f5]' : 'bg-white shadow-sm'}`}
      style={{ borderLeft: `4px solid ${accentColor(r)}` }}>
      <div className="shrink-0 w-[4.5rem]">
        <p className="text-base font-black text-[#191c1d]">{r.reservation_time}</p>
        <p className="text-[11px] font-bold text-[#444653]">〜{endTime(r)}</p>
        <div className="mt-1"><StatusBadge status={r.status} /></div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#191c1d] truncate flex items-center gap-1.5">
          <span className="truncate">{r.customer_name} <span className="font-normal text-xs text-[#444653]">様</span></span>
          <ChannelBadge channel={r.channel} />
        </p>
        <p className="text-xs text-[#444653] truncate mt-0.5">{r.service_name}</p>
        {needsAttention(r) && <p className="text-[11px] text-[#ba1a1a] font-bold mt-1">確認通知 未送信</p>}
        {r.note && <p className="text-[11px] text-[#444653] mt-0.5 truncate">備考: {r.note}</p>}
      </div>
    </Link>
  );
}

/** 30〜45分の短い予約用。1行目に時刻・名前・状態をまとめる */
function CompactCard({ r }: { r: Reservation }) {
  return (
    <Link href={`/reservations/${r.id}`}
      className={`block h-full overflow-hidden rounded-lg px-3 py-1.5 ring-1 ring-black/5 hover:shadow-md transition-shadow focus-visible:outline-2 focus-visible:outline-[#00288e] ${r.status === 'canceled' ? 'bg-[#f3f4f5]' : 'bg-white shadow-sm'}`}
      style={{ borderLeft: `4px solid ${accentColor(r)}` }}>
      <p className="flex items-center gap-2 min-w-0">
        <span className="text-sm font-black text-[#191c1d] shrink-0">{r.reservation_time}〜{endTime(r)}</span>
        <span className="text-sm font-bold text-[#191c1d] truncate">{r.customer_name} <span className="font-normal text-xs text-[#444653]">様</span></span>
        <StatusBadge status={r.status} />
      </p>
      <p className="text-xs text-[#444653] truncate">
        {r.service_name}
        {needsAttention(r) && <span className="text-[11px] text-[#ba1a1a] font-bold ml-2">確認通知 未送信</span>}
      </p>
    </Link>
  );
}
