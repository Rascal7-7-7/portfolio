'use client';

import Link from 'next/link';
import { sortByDateTime, useStore } from '@/lib/store';
import { CHANNELS, CHANNEL_LABEL, type Reservation } from '@/lib/types';
import LoadingState from '@/components/LoadingState';
import ReservationRow, { ReservationTableHeader, needsAttention } from '@/components/ReservationRow';
import { PageHeader, StatStrip, btn } from '@/components/ui';

export default function ReservationsView() {
  const { reservations, today, reset, notify } = useStore();
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
        description="紙の台帳やLINEの履歴に散らばっていた予約を、受付から来店完了までこの画面で管理します。"
        action={
          <Link href="/reservations/new" className={btn('primary')}>
            <span className="material-symbols-outlined" aria-hidden="true">add</span>
            新規予約
          </Link>
        }
      />

      <StatStrip items={[
        { label: '本日の予約', value: active.length, note: `キャンセル除く・全${todayList.length}件` },
        { label: '確定待ち', value: pending.length, note: pending.length > 0 ? '詳細画面から確定できます' : '確定待ちなし' },
        { label: '確認通知 未送信', value: unnotified.length, alert: unnotified.length > 0,
          note: unnotified.length > 0 ? '要対応：お客様へ未連絡' : 'すべて送信済み' },
      ]} />

      <div className="border border-line rounded-lg overflow-hidden [&>section:last-child>:last-child]:border-b-0">
        <ReservationTableHeader />
        <Group label="本日" rows={todayList} />
        <Group label="近日" rows={upcomingList} />
        <Group label="過去" rows={pastList} />
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
function Group({ label, rows }: { label: string; rows: Reservation[] }) {
  return (
    <section aria-label={`${label}の予約`}>
      <h2 className="px-4 py-2 bg-muted border-b border-line text-xs font-medium text-body">
        {label}<span className="text-dim font-normal ml-1.5 tabular-nums">{rows.length}件</span>
      </h2>
      {rows.length === 0 ? (
        <p className="px-4 py-6 text-sm text-dim border-b border-line">該当する予約はありません</p>
      ) : (
        <ul className="divide-y divide-line border-b border-line">
          {rows.map(r => <li key={r.id}><ReservationRow r={r} /></li>)}
        </ul>
      )}
    </section>
  );
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
