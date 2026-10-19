import { formatShortDate } from '@/lib/date';
import { SHOP } from '@/lib/seed';
import { notifyVia, type NotifyVia, type Reservation } from '@/lib/types';
import { btn } from './ui';
import Icon from '@/components/Icon';

interface Props {
  reservation: Reservation;
  today:       string;
  onSend:      (kind: 'confirmation' | 'reminder') => void;
}

/** 通知はモック。ボタンを押すとフラグが立ち、トーストが出るだけ */
export default function NotificationPanel({ reservation: r, today, onSend }: Props) {
  const via = notifyVia(r);
  const disabled = r.status === 'canceled' || !via;
  return (
    <section className="border border-line rounded-lg" aria-labelledby="notice-title">
      <h2 id="notice-title" className="px-5 py-3 border-b border-line text-sm font-medium text-ink">お客様への連絡</h2>
      <ul className="divide-y divide-line">
        <Row label="予約確認" sent={r.confirmation_sent} via={via} disabled={disabled} onSend={() => onSend('confirmation')} />
        <Row label="前日連絡" sent={r.reminder_sent} via={via} disabled={disabled} onSend={() => onSend('reminder')}
          notApplicable={r.reservation_date <= today} />
      </ul>
      {/* 「LINE で手打ちしていた文面が自動で入る」ことを見せるための文面例 */}
      <figure className="px-5 pt-4 pb-5 border-t border-line">
        <figcaption className="text-xs text-dim mb-2">送られる文面（例）</figcaption>
        {via ? <Preview r={r} via={via} /> : (
          <p className="bg-muted rounded-lg px-4 py-4 text-sm text-body text-pretty">
            連絡先が登録されていないため送れません。電話番号かメールアドレスを登録してください。
          </p>
        )}
        {via && (
          <p className="text-xs text-dim mt-3 leading-relaxed text-pretty">
            送信先：{via}（{via === 'LINE' ? 'LINE で受けた予約' : via === 'メール' ? r.customer_email : `${r.customer_phone} 宛て`}）。
            受付経路と連絡先から自動で選びます。デモ版のため実際には送信されません。
          </p>
        )}
      </figure>
    </section>
  );
}

/** 手段ごとに見た目を変える。LINE だけトーク画面風（緑の吹き出し）、メールは件名付き、SMS は白い吹き出し */
function Preview({ r, via }: { r: Reservation; via: NotifyVia }) {
  const body = `${r.customer_name} 様、ご予約ありがとうございます。${formatShortDate(r.reservation_date)} ${r.reservation_time}〜「${r.service_name}」でお待ちしております。`;
  const status = r.confirmation_sent ? '送信済み' : '未送信';

  if (via === 'メール') {
    return (
      <div className="bg-muted rounded-lg p-3">
        <div className="bg-canvas border border-line rounded-md text-sm">
          <dl className="px-3.5 py-2.5 border-b border-line text-xs space-y-1">
            <div className="flex gap-2"><dt className="w-8 shrink-0 text-dim">宛先</dt><dd className="text-ink break-all">{r.customer_email}</dd></div>
            <div className="flex gap-2"><dt className="w-8 shrink-0 text-dim">件名</dt><dd className="text-ink">ご予約内容のご確認（{SHOP.name}）</dd></div>
          </dl>
          <p className="px-3.5 py-3 text-ink leading-relaxed">{body}</p>
        </div>
        <p className="text-right text-[11px] text-dim mt-1.5">{status}</p>
      </div>
    );
  }

  const line = via === 'LINE';
  return (
    <div className="bg-muted rounded-lg px-3 py-4">
      <p className="text-center text-[11px] text-dim mb-3">
        {line ? `${r.customer_name} 様とのトーク（LINE）` : `${r.customer_phone} へのSMS`}
      </p>
      {/* お店から送る側なので右寄せ */}
      <div className="flex items-end justify-end gap-1.5">
        <span className="shrink-0 text-[11px] text-dim">{status}</span>
        <p className={`max-w-[85%] rounded-[18px] rounded-tr-[4px] px-3.5 py-2.5 text-sm text-ink leading-relaxed ${
          line ? 'bg-chat' : 'bg-canvas border border-line'
        }`}>
          {body}
        </p>
      </div>
    </div>
  );
}

function Row({ label, sent, via, disabled, onSend, notApplicable = false }: {
  label: string; sent: boolean; via: NotifyVia | null; disabled: boolean; onSend: () => void; notApplicable?: boolean;
}) {
  return (
    // 幅が足りないときはボタンを次の行へ回す（ラベルとボタンが重ならないように）
    <li className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-5 py-3 min-h-14">
      <span className="text-sm text-ink whitespace-nowrap">{label}</span>
      {sent ? (
        <span className="inline-flex items-center gap-0.5 text-xs font-medium text-ink">
          <Icon name="check" size={14} />
          送信済み
        </span>
      ) : notApplicable ? (
        <span className="text-xs text-dim">対象外（当日・過去の予約）</span>
      ) : !via ? (
        <span className="text-xs text-dim">連絡先なし</span>
      ) : (
        <button type="button" onClick={onSend} disabled={disabled}
          aria-label={`${label}を${via}で送る`}
          className={btn('secondary', 'sm')}>
          {via}で送る
        </button>
      )}
    </li>
  );
}
