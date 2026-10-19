'use client';

import Link from 'next/link';
import { sortByDateTime, useStore } from '@/lib/store';
import { CHANNELS, CHANNEL_LABEL, type Reservation } from '@/lib/types';
import LoadingState from '@/components/LoadingState';
import ReservationRow, { ReservationTableHeader, needsAttention } from '@/components/ReservationRow';

export default function ReservationsView() {
  const { reservations, today, reset, notify } = useStore();
  if (!reservations) return <LoadingState />;

  const sorted       = sortByDateTime(reservations);
  const todayList    = sorted.filter(r => r.reservation_date === today);
  const upcomingList = sorted.filter(r => r.reservation_date > today);
  const pastList     = sorted.filter(r => r.reservation_date < today).reverse();

  const active     = todayList.filter(r => r.status !== 'canceled');
  const pending    = todayList.filter(r => r.status === 'pending');
  const unnotified = sorted.filter(r => r.reservation_date >= today && needsAttention(r));

  const handleReset = () => {
    reset();
    notify('デモデータを初期状態に戻しました');
  };

  return (
    <div className="px-4 md:px-10 py-6 md:py-8 max-w-5xl">
      <div className="flex items-end justify-between gap-3 mb-5">
        <div>
          <p className="text-[11px] font-bold text-[#00288e] tracking-widest mb-1">RESERVATIONS</p>
          <h1 className="text-xl md:text-2xl font-black text-[#1a3844]">予約一覧</h1>
        </div>
        <Link
          href="/reservations/new"
          className="flex items-center gap-1.5 px-4 md:px-5 py-2.5 rounded-lg text-white text-sm font-bold shadow-sm transition-all hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00288e]"
          style={{ background: 'linear-gradient(135deg, #00288e, #1e40af)' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }} aria-hidden="true">add</span>
          新規予約
        </Link>
      </div>

      <ValueBanner reservations={reservations} />

      <div className="grid grid-cols-3 gap-3 md:gap-5 mb-8 md:mb-10">
        <SummaryCard label="本日の予約" value={active.length} accent="#00288e"
          sub={`キャンセル除く・全${todayList.length}件`} />
        <SummaryCard label="本日 確定待ち" value={pending.length} accent="#1a3844"
          sub={pending.length > 0 ? 'ワンクリックで確定できます' : '確定待ちなし'} />
        <SummaryCard label="確認通知 未送信" value={unnotified.length} accent="#ba1a1a"
          sub={unnotified.length > 0 ? '赤い線の予約が対象です' : 'すべて送信済み'} alert={unnotified.length > 0} />
      </div>

      <Section label="本日の予約" count={todayList.length} dot="#00288e">
        <List rows={todayList} today={today} />
      </Section>
      <Section label="近日の予約" count={upcomingList.length} dot="#1a3844">
        <List rows={upcomingList} today={today} />
      </Section>
      <Section label="過去の予約" count={pastList.length} dot="#c4c5d5">
        <List rows={pastList} today={today} muted />
      </Section>

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-[#444653]">
        <span>デモ版：データはこのブラウザ内にだけ保存されます。</span>
        <button
          type="button"
          onClick={handleReset}
          className="underline underline-offset-2 hover:text-[#00288e] focus-visible:outline-2 focus-visible:outline-[#00288e] rounded"
        >
          デモデータに戻す
        </button>
      </div>
    </div>
  );
}

/** 最初の画面で「紙やLINEがシステムに乗った」ことを伝える帯 */
function ValueBanner({ reservations }: { reservations: Reservation[] }) {
  const counts = CHANNELS.map(c => ({ c, n: reservations.filter(r => r.channel === c).length }));
  return (
    <section
      aria-label="このシステムでできること"
      className="bg-white rounded-xl p-4 md:p-5 mb-6 md:mb-8 border border-black/10"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#444653] shrink-0">
          <span className="px-2.5 py-1 rounded-md bg-[#f6f5f4] line-through decoration-[#ba1a1a]/60">紙の台帳</span>
          <span className="px-2.5 py-1 rounded-md bg-[#f6f5f4] line-through decoration-[#ba1a1a]/60">LINEの履歴</span>
          <span className="material-symbols-outlined text-[#00288e]" aria-hidden="true">arrow_forward</span>
          <span className="px-2.5 py-1 rounded-md bg-[#dde1ff] text-[#173bab]">この1画面</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#191c1d]">
            電話・LINE・Web・店頭の予約を、受付から来店完了までまとめて管理
          </p>
          <p className="text-xs text-[#444653] mt-1">
            受付経路の内訳：
            {counts.map(({ c, n }, i) => (
              <span key={c}>{i > 0 && ' / '}{CHANNEL_LABEL[c]} {n}件</span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

interface SummaryCardProps {
  label: string; value: number; accent: string; sub: string; alert?: boolean;
}

function SummaryCard({ label, value, accent, sub, alert = false }: SummaryCardProps) {
  return (
    <div className="bg-white rounded-xl p-3 md:p-6 shadow-sm flex flex-col justify-between"
      style={{ borderBottom: `4px solid ${accent}` }}>
      <div>
        <p className="text-[11px] md:text-xs font-bold text-[#444653] mb-1 md:mb-2 leading-tight">{label}</p>
        <p className="text-2xl md:text-4xl font-extrabold" style={{ color: accent }}>
          {value}<span className="text-xs md:text-base font-bold text-[#444653] ml-0.5 md:ml-1">件</span>
        </p>
      </div>
      <p className={`text-[11px] font-bold mt-2 md:mt-3 hidden sm:block ${alert ? 'text-[#ba1a1a]' : 'text-[#444653]'}`}>
        {sub}
      </p>
    </div>
  );
}

function Section({ label, count, dot, children }: {
  label: string; count: number; dot: string; children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="flex items-center gap-2 mb-3 text-sm font-bold text-[#444653]">
        <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: dot }} aria-hidden="true" />
        {label}
        <span className="text-[#444653] font-normal">（{count}件）</span>
      </h2>
      {children}
    </section>
  );
}

function List({ rows, today, muted = false }: { rows: Reservation[]; today: string; muted?: boolean }) {
  if (rows.length === 0) {
    return (
      <div className="bg-white rounded-xl px-6 py-8 text-center text-sm text-[#444653] shadow-sm">
        該当する予約はありません
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <ReservationTableHeader />
      {rows.map(r => (
        <ReservationRow key={r.id} r={r} isToday={r.reservation_date === today} muted={muted} />
      ))}
    </div>
  );
}
