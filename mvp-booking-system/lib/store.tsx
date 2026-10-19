'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { todayStr } from './date';
import { createSeed } from './seed';
import { isChannel, isStaff, isStatus, type Reservation, type ReservationInput } from './types';
import Icon from '@/components/Icon';

/**
 * デモ用のクライアント側ストア。API・DB は使わない。
 * データはこのブラウザの localStorage にだけ保存する（使えない環境ではメモリのみ）。
 * ponytail: 日付が変わったらダミーデータを作り直す。実運用ならここが DB になる。
 */

// v2: 担当（staff）を追加。古い形のデータは読み込まずダミーデータを作り直す
const STORAGE_KEY = 'booking-demo-v2';

interface Saved {
  seededOn:     string;
  reservations: Reservation[];
}

type Patch = Partial<Omit<Reservation, 'id' | 'created_at' | 'updated_at'>>;

interface Store {
  /** 読み込み前は null（サーバー描画とブラウザの日付ズレを避けるため、ブラウザで初期化する） */
  reservations: Reservation[] | null;
  today:        string;
  create:       (input: ReservationInput) => number;
  update:       (id: number, patch: Patch) => void;
  remove:       (id: number) => void;
  reset:        () => void;
  toast:        string | null;
  notify:       (message: string) => void;
}

const StoreContext = createContext<Store | null>(null);

const STRING_KEYS = [
  'customer_name', 'customer_email', 'customer_phone', 'service_name', 'note', 'created_at', 'updated_at',
] as const;

/** localStorage の中身は信用しない。1件でも形が違えばダミーデータに戻す */
function isReservation(v: unknown): v is Reservation {
  if (typeof v !== 'object' || v === null) return false;
  const r = v as Record<string, unknown>;
  return Number.isInteger(r.id)
    && STRING_KEYS.every(k => typeof r[k] === 'string')
    && typeof r.reservation_date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(r.reservation_date)
    && typeof r.reservation_time === 'string' && /^\d{2}:\d{2}$/.test(r.reservation_time)
    && isStaff(r.staff) && isChannel(r.channel) && isStatus(r.status)
    && typeof r.confirmation_sent === 'boolean' && typeof r.reminder_sent === 'boolean';
}

function load(today: string): Reservation[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Partial<Saved>;
      if (saved.seededOn === today && Array.isArray(saved.reservations) && saved.reservations.every(isReservation)) {
        return saved.reservations;
      }
    }
  } catch {
    // 壊れたデータやプライベートモード等。ダミーデータで続行する
  }
  return createSeed(today);
}

function save(data: Saved): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // 保存できなくても画面上の操作は続けられる
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [reservations, setReservations] = useState<Reservation[] | null>(null);
  const [today, setToday] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const t = todayStr();
    setToday(t);
    setReservations(load(t));
  }, []);

  useEffect(() => {
    if (reservations && today) save({ seededOn: today, reservations });
  }, [reservations, today]);

  const notify = useCallback((message: string) => {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  // 予約ページを別タブで開いてデモしたとき、管理画面のタブにも新しい予約がすぐ入るようにする
  const latest = useRef(reservations);
  useEffect(() => { latest.current = reservations; }, [reservations]);
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !today) return;
      const next = load(today);
      const known = new Set((latest.current ?? []).map(r => r.id));
      const added = next.filter(r => !known.has(r.id));
      setReservations(next);
      if (added.length > 0) notify(`新しい予約が入りました：${added.map(r => `${r.customer_name} 様`).join('、')}`);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [today, notify]);

  const create = useCallback((input: ReservationInput) => {
    const list = reservations ?? [];
    const id = list.reduce((max, r) => Math.max(max, r.id), 0) + 1;
    const now = new Date().toISOString();
    const created: Reservation = {
      ...input,
      id,
      status: 'pending',
      confirmation_sent: false,
      reminder_sent: false,
      created_at: now,
      updated_at: now,
    };
    setReservations([...list, created]);
    return id;
  }, [reservations]);

  const update = useCallback((id: number, patch: Patch) => {
    const now = new Date().toISOString();
    setReservations(list =>
      (list ?? []).map(r => (r.id === id ? { ...r, ...patch, updated_at: now } : r)),
    );
  }, []);

  const remove = useCallback((id: number) => {
    setReservations(list => (list ?? []).filter(r => r.id !== id));
  }, []);

  const reset = useCallback(() => {
    setReservations(createSeed(today || todayStr()));
  }, [today]);

  const value = useMemo<Store>(
    () => ({ reservations, today, create, update, remove, reset, toast, notify }),
    [reservations, today, create, update, remove, reset, toast, notify],
  );

  return (
    <StoreContext.Provider value={value}>
      {children}
      <Toast message={toast} />
    </StoreContext.Provider>
  );
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore は StoreProvider の内側で使ってください');
  return store;
}

/** 日付・時刻順に並べる */
export function sortByDateTime(list: Reservation[]): Reservation[] {
  return [...list].sort((a, b) =>
    (a.reservation_date + a.reservation_time).localeCompare(b.reservation_date + b.reservation_time),
  );
}

/** スマホでは画面上部（ヘッダーの下）に出す。下に出すと、送った文面のプレビューなど直前に見ていた内容を隠すため */
function Toast({ message }: { message: string | null }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed z-[60] left-4 right-4 top-14 md:top-auto md:bottom-8 md:left-auto md:right-8 md:max-w-sm pointer-events-none"
    >
      {message && (
        <div className="flex items-start gap-2.5 bg-ink text-white rounded-md px-4 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
          <Icon name="check" className="shrink-0 mt-px" />
          <p className="text-sm leading-relaxed">{message}</p>
        </div>
      )}
    </div>
  );
}
