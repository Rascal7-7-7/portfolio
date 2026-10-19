'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatFullDate } from '@/lib/date';
import { sortByDateTime, useStore } from '@/lib/store';
import { CHANNELS, CHANNEL_LABEL, type Reservation } from '@/lib/types';
import LoadingState from '@/components/LoadingState';
import ReservationRow, { ReservationTableHeader, needsAttention } from '@/components/ReservationRow';
import { PageHeader, StatStrip, btn } from '@/components/ui';
import Icon from '@/components/Icon';

export default function ReservationsView() {
  const { reservations, today, reset, notify } = useStore();
  const arrived = useArrived(reservations !== null);
  if (!reservations) return <LoadingState />;

  const sorted       = sortByDateTime(reservations);
  const todayList    = sorted.filter(r => r.reservation_date === today);
  const upcomingList = sorted.filter(r => r.reservation_date > today);
  const pastList     = sorted.filter(r => r.reservation_date < today).reverse();

  const active     = todayList.filter(r => r.status !== 'canceled');
  const pending    = todayList.filter(r => r.status === 'pending');
  // スケジュール画面の「未通知」と同じく本日分だけ数える
  const unnotified = todayList.filter(needsAttention);

  const handleReset = () => {
    reset();
    notify('デモデータを初期状態に戻しました');
  };

  return (
    <div className="px-4 md:px-10 py-6 md:py-10 max-w-5xl">
      <PageHeader
        title="予約一覧"
        description={<span className="tabular-nums">{formatFullDate(today)}</span>}
        action={
          <Link href="/reservations/new" className={btn('primary')}>
            <Icon name="add" />
            新規予約
          </Link>
        }
      />

      <StatStrip items={[
        { label: '本日の予約', value: active.length, note: `キャンセル除く・全${todayList.length}件` },
        { label: '本日 確定待ち', value: pending.length, note: pending.length > 0 ? '詳細画面から確定できます' : '確定待ちなし' },
        { label: '確認通知 未送信', value: unnotified.length, alert: unnotified.length > 0,
          note: unnotified.length > 0 ? '要対応：お客様へ未連絡' : 'すべて送信済み' },
      ]} />

      {/* デモ台本の起点：お客様側で予約 → ここに「Web・確定待ち」で入ってくる */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 px-4 py-3 border border-line rounded-lg">
        <p className="text-sm text-body text-pretty">
          お客様がスマホから予約すると、<span className="font-medium text-ink">受付経路「Web」・確定待ち</span>でこの一覧に入ってきます。
        </p>
        <Link href="/book" className={`${btn('secondary', 'sm')} self-start sm:self-auto`}>
          <Icon name="storefront" />
          お客様の予約ページを開く
        </Link>
      </div>

      <div className="border border-line rounded-lg overflow-hidden [&>section:last-child>:last-child]:border-b-0">
        <ReservationTableHeader />
        <Group label="本日" rows={todayList} arrived={arrived} empty="本日の予約はまだありません。お客様の予約ページから予約すると、ここに表示されます" />
        <Group label="近日" rows={upcomingList} arrived={arrived} />
        <Group label="過去" rows={pastList} arrived={arrived} />
      </div>

      <ChannelSummary reservations={reservations} />

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-dim">
        <span>デモ版：データはこのブラウザ内にだけ保存されます。</span>
        <button
          type="button"
          onClick={handleReset}
          className="underline underline-offset-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-brand rounded"
        >
          デモデータに戻す
        </button>
      </div>
    </div>
  );
}

/** Cal.com の予約一覧と同じく、1枚の表の中を区切り行（本日 / 近日 / 過去）で分ける */
function Group({ label, rows, arrived, empty = '該当する予約はありません' }: {
  label: string; rows: Reservation[]; arrived: number | null; empty?: string;
}) {
  return (
    <section aria-label={`${label}の予約`}>
      <h2 className="px-4 py-2 bg-muted border-b border-line text-xs font-medium text-body">
        {label}<span className="text-dim font-normal ml-1.5 tabular-nums">{rows.length}件</span>
      </h2>
      {rows.length === 0 ? (
        <p className="px-4 py-6 text-sm text-dim border-b border-line">{empty}</p>
      ) : (
        <ul className="divide-y divide-line border-b border-line">
          {rows.map(r => (
            <li key={r.id} id={`reservation-${r.id}`} className={`scroll-mt-16 ${r.id === arrived ? 'arrive' : ''}`}>
              <ReservationRow r={r} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/**
 * 予約ページの「お店側の画面で確認する」から ?new=ID で来たとき、その行まで送ってハイライトする（デモの山場）。
 * 再読み込みで繰り返さないよう、URL からはすぐ消す。
 */
function useArrived(loaded: boolean): number | null {
  const [arrived, setArrived] = useState<number | null>(null);
  useEffect(() => {
    if (!loaded) return;
    const id = Number(new URLSearchParams(window.location.search).get('new'));
    if (!Number.isInteger(id) || id <= 0) return;
    window.history.replaceState(null, '', window.location.pathname);
    setArrived(id);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(`reservation-${id}`)?.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
  }, [loaded]);
  return arrived;
}

/** 「電話もLINEも1か所に集まった」ことを数字で見せる */
function ChannelSummary({ reservations }: { reservations: Reservation[] }) {
  return (
    <p className="mt-4 text-xs text-dim tabular-nums">
      受付経路：
      {CHANNELS.map((c, i) => (
        <span key={c}>{i > 0 && ' / '}{CHANNEL_LABEL[c]} {reservations.filter(r => r.channel === c).length}件</span>
      ))}
    </p>
  );
}
