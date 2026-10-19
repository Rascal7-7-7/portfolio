'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { addDays, formatFullDate, formatShortDate, toMinutes } from '@/lib/date';
import { SHOP } from '@/lib/seed';
import { availableSlots, toTime } from '@/lib/slots';
import { useStore } from '@/lib/store';
import { MENUS, type Menu } from '@/lib/types';
import LoadingState from '@/components/LoadingState';
import MonthCalendar from '@/components/MonthCalendar';
import { inputCls } from '@/components/ReservationForm';
import { btn } from '@/components/ui';

/** 予約を受け付ける期間（今日から何日先まで） */
const BOOK_DAYS = 30;

interface Done { id: number; name: string; menu: Menu; date: string; time: string }

function nowMinutes(): number {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

function monthOf(date: string): string {
  return `${date.slice(0, 7)}-01`;
}

function shiftMonth(month: string, delta: number): string {
  const d = new Date(`${month}T00:00:00`);
  d.setMonth(d.getMonth() + delta);
  return monthOf(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`);
}

/**
 * お客様向けの予約ページ（Cal.com の公開予約ページの構成）。
 * メニュー → 日付 → 空き時間 → お名前・連絡先 → 申し込み。
 * 申し込むと管理画面と同じストアに「Web・確定待ち」で入る。送信や外部通信はしない。
 */
export default function BookingView() {
  const { reservations, today, create, notify } = useStore();
  const [menu, setMenu] = useState<Menu>(MENUS[0]);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [month, setMonth] = useState<string | null>(null);
  const [done, setDone] = useState<Done | null>(null);
  const [error, setError] = useState<string | null>(null);
  const formHeading = useRef<HTMLHeadingElement>(null);

  // 時間を選んだら入力欄の見出しへ移る（スマホでは下にあるため）
  useEffect(() => {
    if (time) formHeading.current?.focus();
  }, [time]);

  if (!reservations) return <LoadingState />;

  const lastDay = addDays(today, BOOK_DAYS);
  const slotsOf = (d: string) =>
    d < today || d > lastDay ? [] : availableSlots(reservations, d, menu.minutes, d === today ? nowMinutes() : 0);
  // 日付を選ぶ前は、空きのある最初の日を選んでおく
  const firstOpen = Array.from({ length: BOOK_DAYS + 1 }, (_, i) => addDays(today, i)).find(d => slotsOf(d).length > 0) ?? today;
  const selectedDate = date && slotsOf(date).length > 0 ? date : firstOpen;
  const shownMonth = month ?? monthOf(selectedDate);
  const slots = slotsOf(selectedDate);

  const chooseMenu = (m: Menu) => { setMenu(m); setTime(null); setError(null); };
  const chooseDate = (d: string) => { setDate(d); setTime(null); setError(null); };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!time) return;
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? '').trim();
    // 入力している間に枠が埋まっていないか、申し込みの直前にもう一度確かめる
    const slot = slotsOf(selectedDate).find(s => s.time === time);
    if (!slot) {
      setError('申し訳ありません。この時間は埋まってしまいました。別の時間をお選びください。');
      setTime(null);
      return;
    }
    const name = get('name');
    const id = create({
      customer_name: name, customer_phone: get('phone'), customer_email: get('email'),
      reservation_date: selectedDate, reservation_time: time, service_name: menu.name,
      note: get('note'), channel: 'web', staff: slot.staff,
    });
    setDone({ id, name, menu, date: selectedDate, time });
  };

  const end = time ? toTime(toMinutes(time) + menu.minutes) : null;

  return (
    <div className="min-h-screen bg-muted">
      <DemoBar />
      <div className="px-4 py-6 md:py-12">
        {done ? (
          <Confirmed done={done} onAgain={() => { setDone(null); setTime(null); }}
            onAdmin={() => notify(`Web予約が入りました：${done.name} 様（確定待ち）`)} />
        ) : (
          <div className="mx-auto max-w-5xl bg-canvas border border-line rounded-xl md:grid md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)_minmax(0,14rem)]">

            {/* 左: お店・メニュー・選んだ内容 */}
            <section aria-labelledby="book-title" className="p-5 md:p-6 border-b md:border-b-0 md:border-r border-line">
              <p className="text-sm text-dim">{SHOP.name} {SHOP.branch}</p>
              <h1 id="book-title" className="text-xl font-bold text-ink mt-1">ご予約</h1>

              <fieldset className="mt-5">
                <legend className="text-sm font-medium text-ink mb-2">メニュー</legend>
                <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5">
                  {MENUS.map(m => (
                    <label key={m.name}
                      className={`flex items-center gap-3 rounded-md border px-3 py-2 cursor-pointer has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand ${
                        m.name === menu.name ? 'border-brand bg-muted' : 'border-line hover:bg-muted'
                      }`}>
                      <input type="radio" name="menu" value={m.name} checked={m.name === menu.name}
                        onChange={() => chooseMenu(m)} className="sr-only" />
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm text-ink">{m.name}</span>
                        <span className="block text-xs text-dim tabular-nums">{m.minutes}分 · ¥{m.price.toLocaleString()}</span>
                      </span>
                      {m.name === menu.name && <span className="material-symbols-outlined text-ink" aria-hidden="true">check</span>}
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* スマホでは入力欄の見出しに日時が出るので省く */}
              <ul className="hidden md:block mt-5 pt-5 border-t border-line space-y-2 text-sm text-body">
                <Meta icon="schedule">{menu.minutes}分</Meta>
                <Meta icon="calendar_today">
                  {time ? <span className="text-ink font-medium tabular-nums">{formatShortDate(selectedDate)} {time}–{end}</span> : '日時を選んでください'}
                </Meta>
                <Meta icon="location_on">{SHOP.branch} · お支払いは店頭で</Meta>
              </ul>
            </section>

            {time ? (
              /* 右2列: 入力フォーム（Cal.com と同じく、時間を選ぶとカレンダーと入れ替わる） */
              <section aria-labelledby="form-title" className="p-5 md:p-6 md:col-span-2">
                <h2 id="form-title" ref={formHeading} tabIndex={-1} className="text-base font-bold text-ink outline-none">
                  お客様情報の入力
                </h2>
                <p className="text-sm text-dim mt-1 tabular-nums">{formatFullDate(selectedDate)} {time}–{end} · {menu.name}</p>
                <form onSubmit={handleSubmit} className="mt-5 space-y-4 max-w-md">
                  <TextField id="book-name" name="name" label="お名前" required autoComplete="name" placeholder="山田 花子" />
                  <TextField id="book-phone" name="phone" label="電話番号" type="tel" required autoComplete="tel" placeholder="090-0000-0000" />
                  <TextField id="book-email" name="email" label="メールアドレス" type="email" autoComplete="email" placeholder="hanako@example.jp" />
                  <div>
                    <label htmlFor="book-note" className="block text-sm font-medium text-ink mb-1.5">
                      ご要望<span className="ml-1.5 text-xs font-normal text-dim">任意</span>
                    </label>
                    <textarea id="book-note" name="note" rows={3} placeholder="髪の長さのご希望、アレルギーの有無など"
                      className={`${inputCls} resize-none`} />
                  </div>
                  <p className="text-xs text-dim leading-relaxed">
                    お店で内容を確認したあと、確定のご連絡をお送りします。デモのため、実際の連絡は届きません。
                  </p>
                  <div className="flex flex-col-reverse sm:flex-row gap-2 pt-1">
                    <button type="button" onClick={() => setTime(null)} className={btn('ghost', 'lg')}>戻る</button>
                    <button type="submit" className={`${btn('primary', 'lg')} sm:min-w-40`}>予約を申し込む</button>
                  </div>
                </form>
              </section>
            ) : (
              <>
                {/* 中央: カレンダー */}
                <section aria-label="日付" className="p-5 md:p-6 border-b md:border-b-0 border-line">
                  <MonthCalendar
                    month={shownMonth} today={today} selected={selectedDate}
                    isAvailable={d => slotsOf(d).length > 0}
                    canPrev={shownMonth > monthOf(today)} canNext={shownMonth < monthOf(lastDay)}
                    onMonth={delta => setMonth(shiftMonth(shownMonth, delta))}
                    onSelect={chooseDate}
                  />
                  <p className="mt-4 text-xs text-dim leading-relaxed">
                    スタイリスト2名の予定から、メニューの所要時間（{menu.minutes}分）が丸ごと空いている時間だけを表示しています。
                  </p>
                </section>

                {/* 右: 空き時間 */}
                <section aria-labelledby="slots-title" className="p-5 md:p-6 md:border-l border-line">
                  <h2 id="slots-title" className="text-sm font-bold text-ink tabular-nums">
                    {formatShortDate(selectedDate)}<span className="font-normal text-dim ml-1.5">の空き時間</span>
                  </h2>
                  {error && <p role="alert" className="mt-3 text-sm text-attn">{error}</p>}
                  {slots.length === 0 ? (
                    <p className="mt-3 text-sm text-dim">この日は空きがありません</p>
                  ) : (
                    <ul className="mt-3 grid grid-cols-3 md:grid-cols-1 gap-2 md:max-h-[36rem] md:overflow-y-auto md:pr-1">
                      {slots.map(s => (
                        <li key={s.time}>
                          <button type="button" onClick={() => { setTime(s.time); setError(null); }}
                            aria-label={`${s.time}から予約する`}
                            className="w-full h-10 rounded-md border border-line-strong text-sm font-medium text-ink tabular-nums hover:border-brand hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand">
                            {s.time}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** デモであることと、管理画面への戻り道 */
function DemoBar() {
  return (
    <div className="bg-canvas border-b border-line">
      <div className="mx-auto max-w-5xl px-4 h-11 flex items-center justify-between gap-3 text-xs">
        <p className="text-dim truncate">お客様が見る予約ページ（デモ）</p>
        <Link href="/reservations" className="shrink-0 inline-flex items-center gap-1 text-ink font-medium underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-brand rounded">
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }} aria-hidden="true">arrow_back</span>
          管理画面に戻る
        </Link>
      </div>
    </div>
  );
}

function Meta({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="material-symbols-outlined text-dim mt-px" aria-hidden="true">{icon}</span>
      <span className="min-w-0">{children}</span>
    </li>
  );
}

function TextField({ id, label, required = false, ...input }: {
  id: string; name: string; label: string; required?: boolean; type?: string; autoComplete?: string; placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink mb-1.5">
        {label}
        {!required && <span className="ml-1.5 text-xs font-normal text-dim">任意</span>}
      </label>
      <input id={id} required={required} {...input} className={inputCls} />
    </div>
  );
}

function Confirmed({ done, onAgain, onAdmin }: { done: Done; onAgain: () => void; onAdmin: () => void }) {
  const end = toTime(toMinutes(done.time) + done.menu.minutes);
  return (
    <section aria-labelledby="done-title" className="mx-auto max-w-lg bg-canvas border border-line rounded-xl p-6 md:p-8 text-center">
      <span className="material-symbols-outlined text-ink" style={{ fontSize: '32px' }} aria-hidden="true">check_circle</span>
      <h1 id="done-title" className="text-xl font-bold text-ink mt-2">ご予約を受け付けました</h1>
      <p className="text-sm text-dim mt-1">お店で確認したあと、確定のご連絡をお送りします。</p>
      <dl className="mt-6 text-left text-sm border-y border-line divide-y divide-line">
        <Row label="お名前">{done.name} 様</Row>
        <Row label="日時"><span className="tabular-nums">{formatFullDate(done.date)} {done.time}–{end}</span></Row>
        <Row label="メニュー">{done.menu.name}（¥{done.menu.price.toLocaleString()}）</Row>
        <Row label="受付番号"><span className="tabular-nums">#{String(done.id).padStart(4, '0')}</span></Row>
      </dl>
      <div className="mt-6 flex flex-col gap-2">
        <Link href="/reservations" onClick={onAdmin} className={btn('primary', 'lg')}>
          管理画面で確認する<span className="font-normal opacity-80">（お店側の画面）</span>
        </Link>
        <button type="button" onClick={onAgain} className={btn('secondary', 'lg')}>別の予約をする</button>
      </div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 py-2.5">
      <dt className="w-20 shrink-0 text-dim">{label}</dt>
      <dd className="text-ink min-w-0">{children}</dd>
    </div>
  );
}
