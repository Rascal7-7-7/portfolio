'use client';

import { useState } from 'react';
import { formatFullDate } from '@/lib/date';
import { TIME_OPTIONS } from '@/lib/slots';
import Icon from '@/components/Icon';
import {
  CHANNELS, CHANNEL_LABEL, MENUS, STAFF, isChannel, isStaff,
  type Reservation, type ReservationInput,
} from '@/lib/types';

interface Props {
  id:        string;
  defaults:  ReservationInput;
  minDate?:  string;
  /** 同じ担当・時間帯に入っている予約を返す。あれば登録せずエラーを出す */
  findConflict: (input: ReservationInput) => Reservation | undefined;
  onSubmit:  (input: ReservationInput) => void;
}

export const inputCls =
  'w-full bg-canvas border border-line-strong rounded-md px-3 py-2 text-sm text-ink ' +
  'focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none aria-[invalid=true]:border-attn ' +
  'placeholder:text-dim';

function readForm(form: HTMLFormElement): ReservationInput {
  const fd = new FormData(form);
  const get = (k: string) => String(fd.get(k) ?? '').trim();
  const channel = get('channel');
  const staff = get('staff');
  return {
    staff:            isStaff(staff) ? staff : STAFF[0],
    customer_name:    get('customer_name'),
    customer_email:   get('customer_email'),
    customer_phone:   get('customer_phone'),
    reservation_date: get('reservation_date'),
    reservation_time: get('reservation_time'),
    service_name:     get('service_name'),
    note:             get('note'),
    channel:          isChannel(channel) ? channel : 'phone',
  };
}

/** 新規登録と編集で共通のフォーム。必須チェックはブラウザ標準（required）、二重予約だけここで確かめる */
export default function ReservationForm({ id, defaults, minDate, findConflict, onSubmit }: Props) {
  const [conflict, setConflict] = useState<{ staff: string; hit: Reservation } | null>(null);
  const errorId = `${id}-conflict`;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = readForm(e.currentTarget);
    const hit = findConflict(input);
    if (hit) {
      setConflict({ staff: input.staff, hit });
      return;
    }
    setConflict(null);
    onSubmit(input);
  };

  // 担当・日時・メニューを変えたら、前のエラーは消す
  const clear = () => setConflict(null);
  const invalid = conflict ? { 'aria-invalid': true, 'aria-describedby': errorId } : {};

  return (
    <form id={id} onSubmit={handleSubmit} className="space-y-5">
      <FormSection title="お客様情報">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field id={`${id}-name`} label="お名前" required>
            <input id={`${id}-name`} type="text" name="customer_name" required autoComplete="off"
              defaultValue={defaults.customer_name} placeholder="山田 花子" className={inputCls} />
          </Field>
          {/* お客様の予約ページと同じく電話番号は必須（メールが無いときの SMS の宛先になる） */}
          <Field id={`${id}-phone`} label="電話番号" required>
            <input id={`${id}-phone`} type="tel" name="customer_phone" required autoComplete="off"
              defaultValue={defaults.customer_phone} placeholder="090-0000-0000" className={inputCls} />
          </Field>
          <Field id={`${id}-email`} label="メールアドレス">
            <input id={`${id}-email`} type="email" name="customer_email" autoComplete="off"
              defaultValue={defaults.customer_email} placeholder="hanako@example.jp" className={inputCls} />
          </Field>
          <Field id={`${id}-channel`} label="受付経路" required>
            <select id={`${id}-channel`} name="channel" required defaultValue={defaults.channel} className={inputCls}>
              {CHANNELS.map(c => <option key={c} value={c}>{CHANNEL_LABEL[c]}</option>)}
            </select>
          </Field>
        </div>
      </FormSection>

      <FormSection title="予約内容">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" onChange={clear}>
          <Field id={`${id}-date`} label="予約日" required>
            <DateInput id={`${id}-date`} name="reservation_date" defaultValue={defaults.reservation_date} min={minDate} />
          </Field>
          <Field id={`${id}-time`} label="予約時間" required>
            <select id={`${id}-time`} name="reservation_time" required defaultValue={defaults.reservation_time}
              className={inputCls} {...invalid}>
              {!TIME_OPTIONS.includes(defaults.reservation_time) && defaults.reservation_time && (
                <option value={defaults.reservation_time}>{defaults.reservation_time}</option>
              )}
              {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field id={`${id}-menu`} label="メニュー" required>
            <select id={`${id}-menu`} name="service_name" required defaultValue={defaults.service_name} className={inputCls}>
              <option value="">メニューを選択してください</option>
              {MENUS.map(m => (
                <option key={m.name} value={m.name}>
                  {m.name}（{m.minutes}分・¥{m.price.toLocaleString()}）
                </option>
              ))}
            </select>
          </Field>
          <Field id={`${id}-staff`} label="担当" required>
            <select id={`${id}-staff`} name="staff" required defaultValue={defaults.staff} className={inputCls} {...invalid}>
              {STAFF.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          {conflict && (
            <p id={errorId} role="alert" className="sm:col-span-2 -mt-1 text-sm text-attn font-medium text-pretty">
              {conflict.staff}さんは同じ時間帯に{conflict.hit.customer_name} 様
              <span className="whitespace-nowrap">（{conflict.hit.reservation_time}〜・</span>
              <span className="whitespace-nowrap">{conflict.hit.service_name}）</span>
              の予約があります。担当か時間を変えてください。
            </p>
          )}
          <Field id={`${id}-note`} label="備考" wide>
            <textarea id={`${id}-note`} name="note" rows={3} defaultValue={defaults.note}
              placeholder="アレルギーの有無やご要望など" className={`${inputCls} resize-none`} />
          </Field>
        </div>
      </FormSection>
    </form>
  );
}

/**
 * ネイティブの日付ピッカーは使いつつ、表示はブラウザの言語設定に関係なく「2026年10月19日（月）」にする。
 * 透明な input を下に敷いて和式の表示を重ねる（クリック・キーボード操作は input が受ける）。
 */
function DateInput({ id, name, defaultValue, min }: { id: string; name: string; defaultValue: string; min?: string }) {
  const [value, setValue] = useState(defaultValue);
  const openPicker = (e: React.MouseEvent<HTMLInputElement>) => {
    try {
      e.currentTarget.showPicker();
    } catch {
      // showPicker 非対応のブラウザでは通常の input 操作にまかせる
    }
  };
  return (
    <span className="relative block">
      <input id={id} type="date" name={name} required value={value} min={min}
        onChange={e => setValue(e.target.value)} onClick={openPicker}
        className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0" />
      <span aria-hidden="true"
        className={`${inputCls} pointer-events-none flex items-center justify-between peer-focus:border-brand peer-focus:ring-2 peer-focus:ring-brand/20`}>
        <span className={value ? 'tabular-nums' : 'text-dim'}>{value ? formatFullDate(value) : '日付を選択'}</span>
        <Icon name="calendar_today" className="text-dim" />
      </span>
    </span>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border border-line rounded-lg">
      <legend className="sr-only">{title}</legend>
      <p className="px-5 py-3 border-b border-line text-sm font-medium text-ink" aria-hidden="true">{title}</p>
      <div className="p-5">{children}</div>
    </fieldset>
  );
}

/** 必須の項目が多いので、Cal.com と同じく「任意」の方だけに印を付ける */
function Field({ id, label, required = false, wide = false, children }: {
  id: string; label: string; required?: boolean; wide?: boolean; children: React.ReactNode;
}) {
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <label htmlFor={id} className="block text-sm font-medium text-ink mb-1.5">
        {label}
        {!required && <span className="ml-1.5 text-xs font-normal text-dim">任意</span>}
      </label>
      {children}
    </div>
  );
}
