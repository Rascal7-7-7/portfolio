import { CHANNEL_NOTIFY_VIA, type Reservation } from '@/lib/types';

interface Props {
  reservation: Reservation;
  onSend:      (kind: 'confirmation' | 'reminder') => void;
}

/** 通知はモック。ボタンを押すとフラグが立ち、トーストが出るだけ */
export default function NotificationPanel({ reservation: r, onSend }: Props) {
  const via = CHANNEL_NOTIFY_VIA[r.channel];
  const disabled = r.status === 'canceled';
  return (
    <section className="bg-white rounded-xl p-5 md:p-6 shadow-sm" style={{ borderLeft: '4px solid #00288e' }}>
      <h2 className="flex items-center gap-2 mb-4 text-sm font-bold text-[#1a3844]">
        <span className="material-symbols-outlined text-[#00288e]" aria-hidden="true">notifications</span>
        お客様への連絡
      </h2>
      <div className="space-y-3">
        <Row label="予約確認" sent={r.confirmation_sent} via={via} disabled={disabled} onSend={() => onSend('confirmation')} />
        <Row label="前日リマインド" sent={r.reminder_sent} via={via} disabled={disabled} onSend={() => onSend('reminder')} />
      </div>
      <p className="text-[11px] text-[#444653] mt-4 leading-relaxed">
        送信先：{via}（受付経路に合わせて自動選択）。デモ版のため実際には送信されません。
      </p>
    </section>
  );
}

function Row({ label, sent, via, disabled, onSend }: {
  label: string; sent: boolean; via: string; disabled: boolean; onSend: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 bg-[#f3f4f5] rounded-lg px-4 py-3">
      <div className="flex items-center gap-2 min-w-0">
        <span className="material-symbols-outlined shrink-0" aria-hidden="true"
          style={{ color: sent ? '#006e1c' : '#757684', fontVariationSettings: sent ? "'FILL' 1" : "'FILL' 0" }}>
          check_circle
        </span>
        <span className="text-sm font-medium text-[#191c1d] whitespace-nowrap">{label}</span>
      </div>
      {sent ? (
        <span className="text-xs font-bold text-[#005313]">送信済み</span>
      ) : (
        <button type="button" onClick={onSend} disabled={disabled}
          className="shrink-0 px-3 py-1.5 rounded-md bg-[#00288e] text-white text-xs font-bold hover:opacity-90 disabled:bg-[#c4c5d5] disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00288e]">
          {via}で送る
        </button>
      )}
    </div>
  );
}
