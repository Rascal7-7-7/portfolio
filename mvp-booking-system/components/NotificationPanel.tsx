import { formatShortDate } from '@/lib/date';
import { CHANNEL_NOTIFY_VIA, type Reservation } from '@/lib/types';
import { btn } from './ui';

interface Props {
  reservation: Reservation;
  today:       string;
  onSend:      (kind: 'confirmation' | 'reminder') => void;
}

/** 通知はモック。ボタンを押すとフラグが立ち、トーストが出るだけ */
export default function NotificationPanel({ reservation: r, today, onSend }: Props) {
  const via = CHANNEL_NOTIFY_VIA[r.channel];
  const disabled = r.status === 'canceled';
  return (
    <section className="border border-line rounded-lg" aria-labelledby="notice-title">
      <h2 id="notice-title" className="px-5 py-3 border-b border-line text-sm font-medium text-ink">お客様への連絡</h2>
      <ul className="divide-y divide-line">
        <Row label="予約確認" sent={r.confirmation_sent} via={via} disabled={disabled} onSend={() => onSend('confirmation')} />
        <Row label="前日連絡" sent={r.reminder_sent} via={via} disabled={disabled} onSend={() => onSend('reminder')}
          notApplicable={r.reservation_date <= today} />
      </ul>
      {/* 「LINEで手打ちしていた文面が自動で入る」ことを見せるための文面例 */}
      <figure className="px-5 pt-4 pb-5 border-t border-line">
        <figcaption className="text-xs text-dim mb-2">送られる文面（例）</figcaption>
        {/* トーク画面風。お店から送る側なので右寄せ。緑は LINE のときだけ（SMS・メールは白地） */}
        <div className="bg-muted rounded-lg px-3 py-4">
          <p className="text-center text-[11px] text-dim mb-3">
            {via === 'LINE' ? `${r.customer_name} 様とのトーク（LINE）` : `${r.customer_name} 様への${via}`}
          </p>
          <div className="flex items-end justify-end gap-1.5">
            <span className="shrink-0 text-[11px] text-dim">{r.confirmation_sent ? '送信済み' : '未送信'}</span>
            <p className={`max-w-[85%] rounded-[18px] rounded-tr-[4px] px-3.5 py-2.5 text-sm text-ink leading-relaxed ${
              via === 'LINE' ? 'bg-chat' : 'bg-canvas border border-line'
            }`}>
              {r.customer_name} 様、ご予約ありがとうございます。
              {formatShortDate(r.reservation_date)} {r.reservation_time}〜「{r.service_name}」でお待ちしております。            </p>
          </div>
        </div>
        <p className="text-xs text-dim mt-3 leading-relaxed">
          送信先：{via}（受付経路に合わせて自動選択）。デモ版のため実際には送信されません。
        </p>
      </figure>
    </section>
  );
}

function Row({ label, sent, via, disabled, onSend, notApplicable = false }: {
  label: string; sent: boolean; via: string; disabled: boolean; onSend: () => void; notApplicable?: boolean;
}) {
  return (
    // 幅が足りないときはボタンを次の行へ回す（ラベルとボタンが重ならないように）
    <li className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-5 py-3 min-h-14">
      <span className="text-sm text-ink whitespace-nowrap">{label}</span>
      {sent ? (
        <span className="inline-flex items-center gap-0.5 text-xs font-medium text-ink">
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }} aria-hidden="true">check</span>
          送信済み
        </span>
      ) : notApplicable ? (
        <span className="text-xs text-dim">対象外（当日・過去の予約）</span>
      ) : (
        <button type="button" onClick={onSend} disabled={disabled}
          aria-label={`${label}を${via}で送る`}
          className={btn('primary', 'sm')}>
          {via}で送る
        </button>
      )}
    </li>
  );
}
