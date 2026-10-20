'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDateTime, formatFullDate } from '@/lib/date';
import { findConflict } from '@/lib/slots';
import { useStore } from '@/lib/store';
import {
  CHANNEL_LABEL, STATUSES, STATUS_LABEL, findMenu, notifyVia,
  type Reservation, type ReservationInput, type ReservationStatus,
} from '@/lib/types';
import LoadingState from '@/components/LoadingState';
import NotificationPanel from '@/components/NotificationPanel';
import ReservationForm from '@/components/ReservationForm';
import StatusBadge from '@/components/StatusBadge';
import { btn } from '@/components/ui';
import Icon from '@/components/Icon';

const FORM_ID = 'edit-reservation';

/** 次に押すべきボタン。確定待ち → 確定 → 完了 の一本道 */
const NEXT_STEP: Partial<Record<ReservationStatus, { to: ReservationStatus; label: string }>> = {
  pending:   { to: 'confirmed', label: '予約を確定する' },
  confirmed: { to: 'completed', label: '来店完了にする' },
};

export default function ReservationDetailView({ id }: { id: number }) {
  const { reservations, today, update, remove, notify } = useStore();
  const router = useRouter();
  if (!reservations) return <LoadingState />;

  const r = reservations.find(x => x.id === id);
  if (!r) return <NotFound />;

  const changeStatus = (to: ReservationStatus) => {
    if (to === r.status) return;
    // キャンセルから戻すと、その間に入った同じ担当の予約と重なることがある
    if (r.status === 'canceled' && to !== 'canceled') {
      const conflict = findConflict(reservations, r, r.id);
      if (conflict) {
        notify(`${conflict.reservation_time} の ${conflict.customer_name} 様の予約と重なるため、戻せません`);
        return;
      }
    }
    update(r.id, { status: to });
    notify(`${r.customer_name} 様の予約を「${STATUS_LABEL[to]}」に変更しました`);
  };

  const sendNotice = (kind: 'confirmation' | 'reminder') => {
    const via = notifyVia(r);
    if (!via) return;
    update(r.id, kind === 'confirmation' ? { confirmation_sent: true } : { reminder_sent: true });
    const what = kind === 'confirmation' ? '予約確認' : '前日連絡';
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
    <div className="px-4 md:px-10 py-6 md:py-10 max-w-5xl">
      <nav aria-label="パンくず" className="flex items-center gap-1 text-xs text-dim mb-4">
        <Link href="/reservations" className="py-3.5 -my-3.5 md:py-0 md:my-0 hover:text-ink underline-offset-2 hover:underline">予約一覧</Link>
        <Icon name="chevron_right" size={14} />
        <span className="text-body tabular-nums" aria-current="page">予約 #{String(r.id).padStart(4, '0')}</span>
      </nav>

      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h1 className={`text-2xl font-bold text-ink text-balance ${r.status === 'canceled' ? 'line-through' : ''}`}>
                {r.customer_name}<span className="text-base font-normal text-dim ml-1">様</span>
              </h1>
              <StatusBadge status={r.status} />
            </div>
            <p className="text-sm text-body mt-1.5 tabular-nums">
              {formatFullDate(r.reservation_date)} {r.reservation_time}〜<span className="hidden md:inline text-dim mx-1.5" aria-hidden="true">·</span><br className="md:hidden" /><span className="whitespace-nowrap">{r.service_name}</span>
              {menu && <span className="text-dim whitespace-nowrap">（{menu.minutes}分・¥{menu.price.toLocaleString()}）</span>}
            </p>
            <p className="text-xs text-dim mt-1">担当：{r.staff}<span className="mx-1.5" aria-hidden="true">·</span>受付：{CHANNEL_LABEL[r.channel]}</p>
          </div>
          {next && (
            <button type="button" onClick={() => changeStatus(next.to)} className={btn('primary', 'lg')}>
              {next.label}
            </button>
          )}
        </div>
        <StatusSwitcher current={r.status} onChange={changeStatus} />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        <div className="md:col-span-7 lg:col-span-8">
          {/* key を付けて、別の予約に移ったときにフォームの初期値を入れ直す */}
          <ReservationForm key={r.id} id={FORM_ID} defaults={toInput(r)} onSubmit={save}
            findConflict={input => (r.status === 'canceled' ? undefined : findConflict(reservations, input, r.id))} />
          <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 mt-5">
            <button type="button" onClick={handleDelete} className={btn('ghost')}>
              この予約を削除
            </button>
            <button type="submit" form={FORM_ID} className={btn('secondary')}>
              変更を保存する
            </button>
          </div>
        </div>

        {/* スマホでは連絡パネルをフォームより先に出す（デモで最初に押す操作のため） */}
        <div className="md:col-span-5 lg:col-span-4 order-first md:order-none">
          <NotificationPanel reservation={r} today={today} onSend={sendNotice} />
          <p className="text-xs text-dim mt-3 px-1 tabular-nums">
            登録 {formatDateTime(r.created_at)}<span className="mx-1.5" aria-hidden="true">·</span>最終更新 {formatDateTime(r.updated_at)}
          </p>
        </div>
      </div>
    </div>
  );
}

function toInput(r: Reservation): ReservationInput {
  const { customer_name, customer_email, customer_phone, reservation_date, reservation_time, service_name, note, channel, staff } = r;
  return { customer_name, customer_email, customer_phone, reservation_date, reservation_time, service_name, note, channel, staff };
}

/** Cal.com の ToggleGroup と同じ形の切り替え。現在の状態は白地＋太字で示す */
function StatusSwitcher({ current, onChange }: { current: ReservationStatus; onChange: (s: ReservationStatus) => void }) {
  return (
    <div role="group" aria-label="ステータスを変更" className="mt-5 inline-grid w-full sm:w-auto grid-cols-4 gap-0.5 p-0.5 rounded-md border border-line bg-muted">
      {STATUSES.map(s => {
        const active = s === current;
        return (
          <button key={s} type="button" aria-pressed={active} onClick={() => onChange(s)}
            className={`h-11 sm:h-8 min-w-0 px-1 sm:px-4 rounded-[5px] text-xs sm:text-sm whitespace-nowrap focus-visible:outline-2 focus-visible:outline-brand ${
              active ? 'bg-canvas text-ink font-medium shadow-[0_0_0_1px_var(--color-line),0_1px_2px_rgba(0,0,0,0.06)]' : 'text-dim hover:text-ink'
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
      <p className="text-lg font-bold text-ink">予約が見つかりません</p>
      <p className="text-sm text-dim mt-2">削除されたか、デモデータが初期化された可能性があります。</p>
      <Link href="/reservations" className={`${btn('primary')} mt-6`}>予約一覧に戻る</Link>
    </div>
  );
}
