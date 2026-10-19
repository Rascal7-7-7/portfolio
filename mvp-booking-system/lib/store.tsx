'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { todayStr } from './date';
import { createSeed } from './seed';
import type { Reservation, ReservationInput } from './types';

/**
 * デモ用のクライアント側ストア。API・DB は使わない。
 * データはこのブラウザの localStorage にだけ保存する（使えない環境ではメモリのみ）。
 * ponytail: 日付が変わったらダミーデータを作り直す。実運用ならここが DB になる。
 */

const STORAGE_KEY = 'booking-demo-v1';

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

function load(today: string): Reservation[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Partial<Saved>;
      if (saved.seededOn === today && Array.isArray(saved.reservations)) {
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

function Toast({ message }: { message: string | null }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed z-[60] left-4 right-4 bottom-24 md:bottom-8 md:left-auto md:right-8 md:max-w-sm pointer-events-none"
    >
      {message && (
        <div className="flex items-start gap-2.5 bg-ink text-white rounded-md px-4 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
          <span className="material-symbols-outlined shrink-0 mt-px" aria-hidden="true">check</span>
          <p className="text-sm leading-relaxed">{message}</p>
        </div>
      )}
    </div>
  );
}
