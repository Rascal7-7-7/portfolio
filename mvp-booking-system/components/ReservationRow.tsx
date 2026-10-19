import Link from 'next/link';
import { formatShortDate } from '@/lib/date';
import type { Reservation } from '@/lib/types';
import ChannelBadge from './ChannelBadge';
import NotificationBadge from './NotificationBadge';
import StatusBadge from './StatusBadge';

interface Props {
  r:       Reservation;
  isToday: boolean;
  muted?:  boolean;
}

export function needsAttention(r: Reservation): boolean {
  return !r.confirmation_sent && r.status === 'pending';
}

export function ReservationTableHeader() {
  return (
    <div className="hidden md:grid grid-cols-12 px-4 py-2 text-[11px] font-bold text-[#444653] tracking-wider bg-[#f3f4f5] rounded-lg">
      <div className="col-span-2">予約日時</div>
      <div className="col-span-4">顧客名 / メニュー</div>
      <div className="col-span-2 text-center">状態</div>
      <div className="col-span-2 text-center">確認通知</div>
      <div className="col-span-1 text-center">前日連絡</div>
      <div className="col-span-1" />
    </div>
  );
}

export default function ReservationRow({ r, isToday, muted = false }: Props) {
  const attention = needsAttention(r);
  const borderCls = attention
    ? 'border-l-4 border-[#ba1a1a]'
    : isToday ? 'border-l-4 border-[#00288e]' : 'border-l-4 border-transparent';

  return (
    <Link
      href={`/reservations/${r.id}`}
      className={`flex md:grid md:grid-cols-12 items-center px-4 py-3 md:py-4 rounded-xl transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00288e] gap-3 md:gap-0 ${
        // 透明度で薄くすると文字のコントラストが AA を割るため、背景色で「済んだ予約」を表す
        r.status === 'canceled' || muted ? 'bg-[#f3f4f5] ring-1 ring-black/5' : 'bg-white shadow-sm'
      } ${borderCls}`}
    >
      <div className="shrink-0 w-14 md:w-auto md:col-span-2">
        <p className={`text-base font-black ${isToday ? 'text-[#00288e]' : 'text-[#191c1d]'}`}>
          {r.reservation_time}
        </p>
        <p className="text-[11px] font-bold text-[#444653] mt-0.5">{formatShortDate(r.reservation_date)}</p>
      </div>

      <div className="flex-1 min-w-0 md:col-span-4">
        <p className="text-sm font-bold text-[#191c1d] truncate flex items-center gap-1.5">
          <span className="truncate">{r.customer_name} <span className="font-normal text-xs">様</span></span>
          <ChannelBadge channel={r.channel} />
        </p>
        <p className="text-xs text-[#444653] truncate mt-0.5">{r.service_name}</p>
        {attention && (
          <p className="md:hidden text-[11px] text-[#ba1a1a] font-bold mt-1">確認通知 未送信</p>
        )}
      </div>

      <div className="shrink-0 md:col-span-2 md:flex md:justify-center">
        <StatusBadge status={r.status} />
      </div>

      <div className="hidden md:flex col-span-2 justify-center">
        <NotificationBadge sent={r.confirmation_sent} label={r.confirmation_sent ? '送信済み' : '未送信'} />
      </div>
      <div className="hidden md:flex col-span-1 justify-center">
        <NotificationBadge sent={r.reminder_sent} label={r.reminder_sent ? '送信済み' : '未送信'} />
      </div>

      <div className="hidden md:flex shrink-0 md:col-span-1 md:justify-end">
        <span className="material-symbols-outlined text-[#757684]" aria-hidden="true">chevron_right</span>
      </div>
    </Link>
  );
}
