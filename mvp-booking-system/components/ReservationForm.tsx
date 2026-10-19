'use client';

import { CHANNELS, CHANNEL_LABEL, MENUS, type Channel, type ReservationInput } from '@/lib/types';

interface Props {
  id:        string;
  defaults:  ReservationInput;
  minDate?:  string;
  onSubmit:  (input: ReservationInput) => void;
}

export const inputCls =
  'w-full bg-[#f3f4f5] border-none rounded-lg px-4 py-3 text-sm text-[#191c1d] ' +
  'ring-1 ring-[#c4c5d5]/60 focus:ring-2 focus:ring-[#00288e] outline-none transition-all ' +
  'placeholder:text-[#757684]';

function isChannel(v: string): v is Channel {
  return (CHANNELS as string[]).includes(v);
}

function readForm(form: HTMLFormElement): ReservationInput {
  const fd = new FormData(form);
  const get = (k: string) => String(fd.get(k) ?? '').trim();
  const channel = get('channel');
  return {
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

/** 新規登録と編集で共通のフォーム。必須チェックはブラウザ標準（required）に任せる */
export default function ReservationForm({ id, defaults, minDate, onSubmit }: Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(readForm(e.currentTarget));
  };

  return (
    <form id={id} onSubmit={handleSubmit} className="space-y-6">
      <FormSection icon="person" title="お客様情報">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          <Field id={`${id}-name`} label="お名前" required>
            <input id={`${id}-name`} type="text" name="customer_name" required autoComplete="off"
              defaultValue={defaults.customer_name} placeholder="山田 花子" className={inputCls} />
          </Field>
          <Field id={`${id}-phone`} label="電話番号">
            <input id={`${id}-phone`} type="tel" name="customer_phone" autoComplete="off"
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

      <FormSection icon="calendar_today" title="予約内容">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          <Field id={`${id}-date`} label="予約日" required>
            <input id={`${id}-date`} type="date" name="reservation_date" required
              defaultValue={defaults.reservation_date} min={minDate} className={inputCls} />
          </Field>
          <Field id={`${id}-time`} label="予約時間" required>
            <input id={`${id}-time`} type="time" name="reservation_time" required step={1800}
              defaultValue={defaults.reservation_time} className={inputCls} />
          </Field>
          <Field id={`${id}-menu`} label="メニュー" required wide>
            <select id={`${id}-menu`} name="service_name" required defaultValue={defaults.service_name} className={inputCls}>
              <option value="">メニューを選択してください</option>
              {MENUS.map(m => (
                <option key={m.name} value={m.name}>
                  {m.name}（{m.minutes}分・¥{m.price.toLocaleString()}）
                </option>
              ))}
            </select>
          </Field>
          <Field id={`${id}-note`} label="備考" wide>
            <textarea id={`${id}-note`} name="note" rows={3} defaultValue={defaults.note}
              placeholder="アレルギーの有無やご要望など" className={`${inputCls} resize-none`} />
          </Field>
        </div>
      </FormSection>
    </form>
  );
}

function FormSection({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="bg-white rounded-xl p-5 md:p-7 shadow-sm">
      <legend className="sr-only">{title}</legend>
      <div className="flex items-center gap-2 mb-4 md:mb-5 pb-4 border-b border-[#f3f4f5]" aria-hidden="true">
        <span className="material-symbols-outlined text-[#00288e]">{icon}</span>
        <span className="text-sm font-bold text-[#1a3844]">{title}</span>
      </div>
      {children}
    </fieldset>
  );
}

function Field({ id, label, required = false, wide = false, children }: {
  id: string; label: string; required?: boolean; wide?: boolean; children: React.ReactNode;
}) {
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <label htmlFor={id} className="flex items-center gap-1.5 text-xs font-bold text-[#444653] mb-1.5">
        {label}
        {required
          ? <span className="text-[10px] px-1.5 py-0.5 bg-[#ffdad6] text-[#93000a] rounded-full font-bold">必須</span>
          : <span className="text-[10px] px-1.5 py-0.5 bg-[#e7e8e9] text-[#444653] rounded-full font-bold">任意</span>}
      </label>
      {children}
    </div>
  );
}
