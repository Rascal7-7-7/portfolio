import Link from 'next/link';
import { formatShortDate } from '@/lib/date';
import type { Reservation } from '@/lib/types';
import ChannelBadge from './ChannelBadge';
import StatusBadge from './StatusBadge';
import Icon from '@/components/Icon';

export function needsAttention(r: Reservation): boolean {
  return !r.confirmation_sent && r.status === 'pending';
}

/** 一覧の列。見出し行と各行で同じ定義を使う */
export const ROW_GRID = 'md:grid md:grid-cols-[8rem_minmax(0,1fr)_7rem_9rem_1.5rem] md:items-center';

export function ReservationTableHeader() {
  return (
    <div className={`hidden ${ROW_GRID} px-4 py-2 text-xs text-dim border-b border-line`} aria-hidden="true">
      <div>日時</div>
      <div>お客様 / メニュー</div>
      <div>状態</div>
      <div>通知</div>
      <div />
    </div>
  );
}

/** 30分以内に入った予約。お客様の予約ページから来た予約を一覧で見つけやすくする */
const NEW_WITHIN_MS = 30 * 60_000;
export function isNew(r: Reservation): boolean {
  return Date.now() - new Date(r.created_at).getTime() < NEW_WITHIN_MS;
}

export default function ReservationRow({ r }: { r: Reservation }) {
  const attention = needsAttention(r);
  const canceled = r.status === 'canceled';

  return (
    <Link
      href={`/reservations/${r.id}`}
      className={`group flex gap-3 ${ROW_GRID} md:gap-0 px-4 py-3.5 hover:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand`}
    >
      <div className="shrink-0 w-14 md:w-auto tabular-nums">
        <p className="text-sm font-medium text-ink">{r.reservation_time}</p>
        <p className="text-xs text-dim mt-0.5">{formatShortDate(r.reservation_date)}</p>
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium text-ink truncate ${canceled ? 'line-through' : ''}`}>
          {r.customer_name}<span className="font-normal text-xs text-dim ml-0.5">様</span>
          {isNew(r) && (
            <span className="ml-2 inline-block rounded-[4px] bg-accent-soft px-1 py-0.5 text-[11px] leading-none font-medium text-accent no-underline align-[1px]">新着</span>
          )}
        </p>
        <p className="text-xs text-dim truncate mt-0.5">
          {r.service_name}<span aria-hidden="true"> · </span><ChannelBadge channel={r.channel} />
          <span className="hidden md:inline"><span aria-hidden="true"> · </span>担当 {r.staff}</span>
        </p>
        {attention && <p className="md:hidden text-xs text-attn font-medium mt-1">確認通知 未送信</p>}
      </div>

      <div className="shrink-0 self-start md:self-auto">
        <StatusBadge status={r.status} />
      </div>

      <dl className="hidden md:block text-xs leading-5">
        <NoticeLine label="確認" sent={r.confirmation_sent} alert={attention} />
        <NoticeLine label="前日" sent={r.reminder_sent} />
      </dl>

      <Icon name="chevron_right" className="hidden md:block text-line-strong group-hover:text-ink transition-colors" />
    </Link>
  );
}

function NoticeLine({ label, sent, alert = false }: { label: string; sent: boolean; alert?: boolean }) {
  return (
    <div className="flex gap-2">
      <dt className="text-dim">{label}</dt>
      <dd className={sent ? 'text-body' : alert ? 'text-attn font-medium' : 'text-dim'}>
        {sent ? '送信済み' : '未送信'}
      </dd>
    </div>
  );
}
