'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDateTime, formatFullDate } from '@/lib/date';
import { useStore } from '@/lib/store';
import {
  CHANNEL_NOTIFY_VIA, STATUSES, STATUS_LABEL, findMenu,
  type Reservation, type ReservationInput, type ReservationStatus,
} from '@/lib/types';
import ChannelBadge from '@/components/ChannelBadge';
import LoadingState from '@/components/LoadingState';
import NotificationPanel from '@/components/NotificationPanel';
import ReservationForm from '@/components/ReservationForm';
import StatusBadge from '@/components/StatusBadge';

const FORM_ID = 'edit-reservation';

/** 次に押すべきボタン。受付 → 確定 → 完了 の一本道 */
const NEXT_STEP: Partial<Record<ReservationStatus, { to: ReservationStatus; label: string; icon: string }>> = {
  pending:   { to: 'confirmed', label: '予約を確定する',   icon: 'event_available' },
  confirmed: { to: 'completed', label: '来店完了にする',   icon: 'task_alt' },
};

export default function ReservationDetailView({ id }: { id: number }) {
  const { reservations, update, remove, notify } = useStore();
  const router = useRouter();
  if (!reservations) return <LoadingState />;

  const r = reservations.find(x => x.id === id);
  if (!r) return <NotFound />;

  const changeStatus = (to: ReservationStatus) => {
    if (to === r.status) return;
    update(r.id, { status: to });
    notify(`${r.customer_name} 様の予約を「${STATUS_LABEL[to]}」に変更しました`);
  };

  const sendNotice = (kind: 'confirmation' | 'reminder') => {
    const via = CHANNEL_NOTIFY_VIA[r.channel];
    update(r.id, kind === 'confirmation' ? { confirmation_sent: true } : { reminder_sent: true });
    const what = kind === 'confirmation' ? '予約確認' : '前日リマインド';
    notify(`${r.customer_name} 様へ${what}を${via}で送信しました（デモのため実際には送信されません）`);
  };

  const save = (input: ReservationInput) => {
    update(r.id, input);
    notify('予約内容を保存しました');
  };

  const handleDelete = () => {
    if (!window.confirm(`${r.customer_name} 様の予約を削除しますか？`)) return;
    remove(r.id);
    notify('予約を削除しました');
    router.push('/reservations');
  };

  const menu = findMenu(r.service_name);
  const next = NEXT_STEP[r.status];

  return (
    <div className="px-4 md:px-10 py-6 md:py-8 max-w-5xl">
      <nav aria-label="パンくず" className="flex items-center gap-1.5 text-xs text-[#444653] mb-3">
        <Link href="/reservations" className="hover:text-[#00288e] underline-offset-2 hover:underline">予約一覧</Link>
        <span className="material-symbols-outlined" style={{ fontSize: '14px' }} aria-hidden="true">chevron_right</span>
        <span className="text-[#00288e] font-bold">予約 #{String(r.id).padStart(4, '0')}</span>
      </nav>

      <header className="bg-white rounded-xl p-5 md:p-6 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status={r.status} />
              <ChannelBadge channel={r.channel} />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-[#1a3844]">
              {r.customer_name} <span className="text-base font-normal text-[#444653]">様</span>
            </h1>
            <p className="text-sm font-bold text-[#191c1d] mt-1">
              {formatFullDate(r.reservation_date)} {r.reservation_time}〜 ・ {r.service_name}
              {menu && <span className="font-normal text-[#444653]">（{menu.minutes}分・¥{menu.price.toLocaleString()}）</span>}
            </p>
          </div>
          {next && (
            <button type="button" onClick={() => changeStatus(next.to)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white text-sm font-black shadow-md hover:opacity-90 active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00288e]"
              style={{ background: 'linear-gradient(135deg, #00288e, #1e40af)' }}>
              <span className="material-symbols-outlined" aria-hidden="true">{next.icon}</span>
              {next.label}
            </button>
          )}
        </div>
        <StatusSwitcher current={r.status} onChange={changeStatus} />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8">
          {/* key を付けて、別の予約に移ったときにフォームの初期値を入れ直す */}
          <ReservationForm key={r.id} id={FORM_ID} defaults={toInput(r)} onSubmit={save} />
          <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 mt-6">
            <button type="button" onClick={handleDelete}
              className="px-5 py-2.5 rounded-lg text-sm font-bold text-[#93000a] hover:bg-[#ffdad6] transition-colors focus-visible:outline-2 focus-visible:outline-[#ba1a1a]">
              この予約を削除
            </button>
            <button type="submit" form={FORM_ID}
              className="px-7 py-2.5 rounded-lg bg-[#1a3844] text-white text-sm font-bold hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a3844]">
              変更を保存する
            </button>
          </div>
        </div>

        {/* スマホでは連絡パネルをフォームより先に出す（デモで最初に押す操作のため） */}
        <div className="md:col-span-4 space-y-5 order-first md:order-none">
          <NotificationPanel reservation={r} onSend={sendNotice} />
          <div className="bg-white rounded-xl p-5 shadow-sm text-[11px] text-[#444653] space-y-1">
            <p>登録：{formatDateTime(r.created_at)}</p>
            <p>最終更新：{formatDateTime(r.updated_at)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function toInput(r: Reservation): ReservationInput {
  const { customer_name, customer_email, customer_phone, reservation_date, reservation_time, service_name, note, channel } = r;
  return { customer_name, customer_email, customer_phone, reservation_date, reservation_time, service_name, note, channel };
}

function StatusSwitcher({ current, onChange }: { current: ReservationStatus; onChange: (s: ReservationStatus) => void }) {
  return (
    <div role="group" aria-label="ステータスを変更" className="mt-5 bg-[#f3f4f5] p-1 rounded-xl grid grid-cols-4 gap-1">
      {STATUSES.map(s => {
        const active = s === current;
        return (
          <button key={s} type="button" aria-pressed={active} onClick={() => onChange(s)}
            className={`py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all focus-visible:outline-2 focus-visible:outline-[#00288e] ${
              active ? 'bg-white shadow-sm text-[#00288e]' : 'text-[#444653] hover:bg-white/60'
            }`}>
            {STATUS_LABEL[s]}
          </button>
        );
      })}
    </div>
  );
}

function NotFound() {
  return (
    <div className="px-4 md:px-10 py-16 max-w-xl text-center">
      <p className="text-lg font-bold text-[#1a3844]">予約が見つかりません</p>
      <p className="text-sm text-[#444653] mt-2">削除されたか、デモデータが初期化された可能性があります。</p>
      <Link href="/reservations" className="inline-block mt-6 px-5 py-2.5 rounded-lg bg-[#1a3844] text-white text-sm font-bold">
        予約一覧に戻る
      </Link>
    </div>
  );
}
