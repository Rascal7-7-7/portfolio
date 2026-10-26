'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { addDays, formatFullDate, formatShortDate, toMinutes } from '@/lib/date';
import { SHOP } from '@/lib/seed';
import { CLOSE_MIN, OPEN_MIN, availableSlots, toTime } from '@/lib/slots';
import { useStore } from '@/lib/store';
import { MENUS, STAFF, type Menu, type Staff } from '@/lib/types';
import LoadingState from '@/components/LoadingState';
import MonthCalendar from '@/components/MonthCalendar';
import { inputCls } from '@/components/ReservationForm';
import { btn } from '@/components/ui';
import Icon, { type IconName } from '@/components/Icon';
import { FieldError, FieldErrorsProvider, useFieldErrors } from '@/components/FieldError';

/** 予約を受け付ける期間（今日から何日先まで） */
const BOOK_DAYS = 30;
/** 再読み込みで入力が消えないよう、申し込み前の選択と入力はこのタブの間だけ残す */
const DRAFT_KEY = 'booking-draft';

type Fields = Record<string, string>;

interface Done { id: number; name: string; menu: Menu; date: string; time: string; staff: Staff }

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
  const [rawTime, setTime] = useState<string | null>(null);
  const [month, setMonth] = useState<string | null>(null);
  const [done, setDone] = useState<Done | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Fields>({});
  const [restored, setRestored] = useState(false);
  const formHeading = useRef<HTMLHeadingElement>(null);
  const fieldErrors = useFieldErrors();

  // 中身は信用しない。形が違うものは捨てる（時間が埋まっていれば申し込み時に弾かれる）
  useEffect(() => {
    try {
      const d = JSON.parse(window.sessionStorage.getItem(DRAFT_KEY) ?? 'null');
      const str = (v: unknown) => (typeof v === 'string' ? v : null);
      const m = MENUS.find(x => x.name === d?.menu);
      if (m) setMenu(m);
      setDate(str(d?.date));
      setTime(str(d?.time));
      if (d?.fields && typeof d.fields === 'object') setFields(Object.fromEntries(Object.entries(d.fields).filter(([, v]) => typeof v === 'string')) as Fields);
    } catch { /* 使えない環境では残さない */ }
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored || done) return;
    try {
      window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ menu: menu.name, date, time: rawTime, fields }));
    } catch { /* 使えない環境では残さない */ }
  }, [restored, done, menu, date, rawTime, fields]);

  // 時間を選んだら入力欄の見出しへ移る（スマホでは下にあるため）
  useEffect(() => {
    if (rawTime) formHeading.current?.focus();
  }, [rawTime]);

  if (!reservations) return <LoadingState />;

  const lastDay = addDays(today, BOOK_DAYS);
  const slotsOf = (d: string) =>
    d < today || d > lastDay ? [] : availableSlots(reservations, d, menu.minutes, d === today ? nowMinutes() : 0);
  // 日付を選ぶ前は、空きのある最初の日を選んでおく
  const firstOpen = Array.from({ length: BOOK_DAYS + 1 }, (_, i) => addDays(today, i)).find(d => slotsOf(d).length > 0) ?? today;
  const selectedDate = date && slotsOf(date).length > 0 ? date : firstOpen;
  const shownMonth = month ?? monthOf(selectedDate);
  const slots = slotsOf(selectedDate);
  // 復元した時刻は、選んだ日のまま空いているときだけ使う（日付が別の日に切り替わったら選び直し）
  const time = rawTime && (date === null || date === selectedDate) && slots.some(s => s.time === rawTime) ? rawTime : null;

  // メニューを変えると空きのある日も変わるので、表示する月も選択中の日の月へ戻す
  const chooseMenu = (m: Menu) => { setMenu(m); setTime(null); setMonth(null); setError(null); };
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
    try { window.sessionStorage.removeItem(DRAFT_KEY); } catch { /* 使えない環境では残していない */ }
    setFields({});
    setDone({ id, name, menu, date: selectedDate, time, staff: slot.staff });
  };

  const end = time ? toTime(toMinutes(time) + menu.minutes) : null;

  return (
    <div className="min-h-screen bg-paper">
      <DemoBar />
      <div className="px-4 pt-4 pb-10 md:pt-8 md:pb-16">
        {done ? (
          <Confirmed done={done} onAgain={() => { setDone(null); setTime(null); }}
            onAdmin={() => notify(`${done.name} 様の Web 予約が入りました。確定してください`)} />
        ) : (
          <div className="mx-auto max-w-5xl bg-canvas rounded-2xl overflow-hidden shadow-[0_0_0_1px_rgba(60,45,30,0.06),0_12px_40px_-12px_rgba(60,45,30,0.18)]">
            <ShopHeader />

            <div className="border-t border-line md:grid md:grid-cols-[minmax(0,19rem)_minmax(0,1fr)_minmax(0,14.5rem)]">
              {/* 左: メニュー（サロンの料金表のように、名前と料金を左右に振る） */}
              <section aria-labelledby="menu-title" className="p-5 md:p-7 border-b md:border-b-0 md:border-r border-line">
                <StepTitle id="menu-title">メニューを選ぶ</StepTitle>
                <fieldset className="mt-3">
                  <legend className="sr-only">メニュー</legend>
                  <div className="-mx-2 flex flex-col">
                    {MENUS.map(m => {
                      const active = m.name === menu.name;
                      return (
                        <label key={m.name}
                          className={`flex items-baseline gap-3 rounded-lg px-3 py-2.5 cursor-pointer has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand ${
                            active ? 'bg-accent-soft' : 'hover:bg-muted'
                          }`}>
                          <input type="radio" name="menu" value={m.name} checked={active}
                            onChange={() => chooseMenu(m)} className="sr-only" />
                          <span className="flex-1 min-w-0">
                            <span className={`block text-[15px] break-keep ${active ? 'text-accent-hover font-bold' : 'text-ink font-medium'}`}>
                              {m.name.split('＆').map((part, i) => <span key={part}>{i > 0 && <>＆<wbr /></>}{part}</span>)}
                            </span>
                            <span className="block text-xs text-dim tabular-nums mt-0.5">{m.minutes}分</span>
                          </span>
                          <span className={`shrink-0 text-[15px] tabular-nums ${active ? 'text-accent-hover font-bold' : 'text-ink'}`}>
                            ¥{m.price.toLocaleString()}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
                <p className="mt-4 px-1 text-xs text-dim">お支払いは店頭で承ります。</p>
              </section>

              {time ? (
                /* 右2列: 入力フォーム（Cal.com と同じく、時間を選ぶとカレンダーと入れ替わる） */
                <section aria-labelledby="form-title" className="p-5 md:p-7 md:col-span-2">
                  <h2 id="form-title" ref={formHeading} tabIndex={-1} className="text-lg font-bold text-ink outline-none">
                    お客様情報の入力
                  </h2>
                  <div className="mt-3 inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg bg-paper px-3.5 py-2.5 text-sm text-ink tabular-nums">
                    <span className="font-medium">{formatFullDate(selectedDate)} {time}–{end}</span>
                    <span className="whitespace-nowrap text-body">{menu.name}</span>
                    <DurationChip minutes={menu.minutes} />
                  </div>
                  <FieldErrorsProvider value={fieldErrors.errors}>
                  <form ref={fieldErrors.ref} onSubmit={handleSubmit}
                    onChange={e => setFields(Object.fromEntries(new FormData(e.currentTarget)) as Fields)}
                    className="mt-6 space-y-4 max-w-md">
                    <TextField id="book-name" name="name" defaultValue={fields.name} label="お名前" required autoComplete="name" placeholder="山田 花子" />
                    <TextField id="book-phone" name="phone" defaultValue={fields.phone} label="電話番号" type="tel" required autoComplete="tel" placeholder="090-0000-0000" />
                    <TextField id="book-email" name="email" defaultValue={fields.email} label="メールアドレス" type="email" autoComplete="email" placeholder="hanako@example.jp" />
                    <div>
                      <label htmlFor="book-note" className="block text-sm font-medium text-ink mb-1.5">
                        ご要望<span className="ml-1.5 text-xs font-normal text-dim">任意</span>
                      </label>
                      <textarea id="book-note" name="note" defaultValue={fields.note} rows={3} placeholder="髪の長さのご希望、アレルギーの有無など"
                        className={`${inputCls} resize-none`} />
                    </div>
                    <p className="text-xs text-dim leading-relaxed">
                      お店で内容を確認したあと、確定のご連絡をお送りします。デモのため、実際の連絡は届きません。
                    </p>
                    <div className="flex flex-col-reverse sm:flex-row gap-2 pt-1">
                      <button type="button" onClick={() => setTime(null)} className={btn('ghost', 'lg')}>戻る</button>
                      <button type="submit" className={`${btn('accent', 'lg')} sm:min-w-44 h-11`}>予約を申し込む</button>
                    </div>
                  </form>
                  </FieldErrorsProvider>
                </section>
              ) : (
                <>
                  {/* 中央: カレンダー */}
                  <section aria-labelledby="date-title" className="px-4 py-5 md:p-7 border-b md:border-b-0 border-line">
                    <StepTitle id="date-title">日付を選ぶ</StepTitle>
                    <div className="mt-4">
                      <MonthCalendar
                        month={shownMonth} today={today} selected={selectedDate}
                        isAvailable={d => slotsOf(d).length > 0}
                        canPrev={shownMonth > monthOf(today)} canNext={shownMonth < monthOf(lastDay)}
                        onMonth={delta => setMonth(shiftMonth(shownMonth, delta))}
                        onSelect={chooseDate}
                      />
                    </div>
                    <p className="mt-5 text-xs text-dim leading-relaxed">
                      色の付いた日に空きがあります。スタイリスト2名の予定から、メニューの所要時間<span className="whitespace-nowrap">（{menu.minutes}分）</span>が丸ごと空いている時間だけを表示しています。
                    </p>
                  </section>

                  {/* 右: 空き時間（午前・午後に分けて、目で探す距離を短くする） */}
                  <section aria-labelledby="slots-title" className="p-5 md:p-7 md:border-l border-line">
                    <StepTitle id="slots-title">
                      時間を選ぶ<span className="ml-2 text-sm font-normal text-dim tabular-nums">{formatShortDate(selectedDate)}</span>
                    </StepTitle>
                    {error && <p role="alert" className="mt-3 text-sm text-attn">{error}</p>}
                    {slots.length === 0 ? (
                      <p className="mt-3 text-sm text-dim">この日は空きがありません</p>
                    ) : (
                      <div className="mt-4 space-y-4">
                        {([['午前', slots.filter(s => s.time < '12:00')], ['午後', slots.filter(s => s.time >= '12:00')]] as const)
                          .filter(([, list]) => list.length > 0)
                          .map(([label, list]) => (
                            <div key={label}>
                              <p className="text-xs text-dim mb-2">{label}</p>
                              <ul className="grid grid-cols-3 md:grid-cols-2 gap-2">
                                {list.map(s => (
                                  <li key={s.time}>
                                    <button type="button" onClick={() => { setTime(s.time); setError(null); }}
                                      aria-label={`${s.time}から予約する`}
                                      className="w-full h-11 rounded-lg border border-line-strong bg-canvas text-[15px] font-medium text-ink tabular-nums hover:border-accent hover:text-accent-hover hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand">
                                      {s.time}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                      </div>
                    )}
                  </section>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** 店の写真と店名。お客様が最初に目にする「お店の顔」 */
function ShopHeader() {
  return (
    <header>
      <img src="/salon.webp" alt="木の床と植物のある、落ち着いた店内。丸い鏡のセット面と受付" width={1200} height={783}
        fetchPriority="high" className="block w-full h-44 sm:h-56 md:h-72 object-cover object-[center_45%]" />
      <div className="px-5 md:px-7 py-5 md:py-6 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <p className="font-serif text-[28px] md:text-4xl leading-none text-ink tracking-tight">{SHOP.name}</p>
          <h1 id="book-title" className="mt-2.5 text-sm text-body">{SHOP.branch}<span className="mx-2 text-line-strong" aria-hidden="true">|</span>Web 予約</h1>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-body">
          <Meta icon="schedule"><span className="tabular-nums">{toTime(OPEN_MIN)}–{toTime(CLOSE_MIN)}</span></Meta>
          <li>スタイリスト {STAFF.join('・')}</li>
        </ul>
      </div>
    </header>
  );
}

function StepTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return <h2 id={id} className="text-base font-bold text-ink">{children}</h2>;
}

/** デモであることと、管理画面への戻り道 */
function DemoBar() {
  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-5xl px-4 md:px-0 h-11 flex items-center justify-between gap-3 text-xs">
        <p className="text-dim truncate">お客様が見る予約ページ（デモ）</p>
        <Link href="/reservations" className="shrink-0 self-stretch inline-flex items-center gap-1 text-ink font-medium underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-brand rounded">
          <Icon name="arrow_back" size={16} />
          管理画面に戻る
        </Link>
      </div>
    </div>
  );
}

function Meta({ icon, children }: { icon: IconName; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-1.5">
      <Icon name={icon} size={16} className="text-dim" />
      <span className="min-w-0">{children}</span>
    </li>
  );
}

/** Cal.com の予約ページと同じ、所要時間のチップ */
function DurationChip({ minutes }: { minutes: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-accent-soft px-2 py-1 text-xs font-medium text-accent tabular-nums">
      <Icon name="schedule" size={14} />
      {minutes}分
    </span>
  );
}

function TextField({ id, label, required = false, ...input }: {
  id: string; name: string; label: string; required?: boolean; type?: string; autoComplete?: string; placeholder?: string; defaultValue?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink mb-1.5">
        {label}
        {!required && <span className="ml-1.5 text-xs font-normal text-dim">任意</span>}
      </label>
      <input id={id} required={required} {...input} className={inputCls} />
      <FieldError id={id} />
    </div>
  );
}

function Confirmed({ done, onAgain, onAdmin }: { done: Done; onAgain: () => void; onAdmin: () => void }) {
  const end = toTime(toMinutes(done.time) + done.menu.minutes);
  return (
    <section aria-labelledby="done-title" className="mx-auto max-w-lg bg-canvas rounded-2xl overflow-hidden text-center shadow-[0_0_0_1px_rgba(60,45,30,0.06),0_12px_40px_-12px_rgba(60,45,30,0.18)]">
      <img src="/salon.webp" alt="" width={1200} height={783} className="block w-full h-36 object-cover object-[center_45%]" />
      <div className="p-6 md:p-8">
      <p className="font-serif text-xl text-ink leading-none">{SHOP.name}</p>
      <h1 id="done-title" className="text-xl font-bold text-ink mt-4 inline-flex items-center gap-1.5">
        <Icon name="check" size={22} className="text-accent" />ご予約を受け付けました
      </h1>
      <p className="text-sm text-dim mt-1 text-balance">お店で確認したあと、確定のご連絡をお送りします。</p>
      <dl className="mt-6 text-left text-sm border-y border-line divide-y divide-line">
        <Row label="お名前">{done.name} 様</Row>
        <Row label="日時"><span className="tabular-nums">{formatFullDate(done.date)} <span className="whitespace-nowrap">{done.time}–{end}</span></span></Row>
        <Row label="メニュー"><span className="whitespace-nowrap">{done.menu.name}</span><span className="whitespace-nowrap">（¥{done.menu.price.toLocaleString()}）</span></Row>
        <Row label="受付番号"><span className="tabular-nums">#{String(done.id).padStart(4, '0')}</span></Row>
      </dl>
      <div className="mt-6 flex flex-col gap-2">
        <Link href={`/schedule?date=${done.date}&staff=${encodeURIComponent(done.staff)}&id=${done.id}`} onClick={onAdmin} className={btn('accent', 'lg')}>
          お店側の画面で確認する
        </Link>
        <button type="button" onClick={onAgain} className={btn('secondary', 'lg')}>別の予約をする</button>
      </div>
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
