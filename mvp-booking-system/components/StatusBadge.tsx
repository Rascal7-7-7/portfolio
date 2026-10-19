import { STATUS_LABEL, type ReservationStatus } from '@/lib/types';
import Icon from '@/components/Icon';

/**
 * Cal.com の予約一覧と同じく、色付きの札は「対応が必要な状態」（確定待ち）だけに付ける。
 * ほかは形と文字で区別する: 確定=チェック付きの文字 / 完了=補足色の文字 / キャンセル=灰色の札（お客様名には取り消し線）。
 */
export default function StatusBadge({ status }: { status: ReservationStatus }) {
  const label = STATUS_LABEL[status];
  switch (status) {
    case 'pending':
      return <span className="inline-flex items-center rounded-[4px] px-1.5 py-1 text-xs leading-none font-medium whitespace-nowrap bg-attn-bg text-attn">{label}</span>;
    case 'confirmed':
      return (
        <span className="inline-flex items-center gap-0.5 text-xs font-medium whitespace-nowrap text-ink">
          <Icon name="check" size={14} />
          {label}
        </span>
      );
    case 'completed':
      return <span className="text-xs whitespace-nowrap text-dim">{label}</span>;
    case 'canceled':
      return <span className="inline-flex items-center rounded-[4px] px-1.5 py-1 text-xs leading-none whitespace-nowrap bg-emphasis text-body">{label}</span>;
  }
}
