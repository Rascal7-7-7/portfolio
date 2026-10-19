'use client';
import { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import { isStoreState, seedState, storeReducer, type StoreAction, type StoreState } from '@/lib/store';
import { todayIso } from '@/lib/date';

const STORAGE_KEY = 'mori-atelier-demo:v1';

type StoreContextValue = {
  state: StoreState;
  /** localStorage から復元が終わるまで false（SSR とのズレを避ける） */
  loaded: boolean;
  dispatch: (action: StoreAction) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

function readStorage(): StoreState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isStoreState(parsed) ? parsed : null;
  } catch {
    // プライベートモード等で使えない場合はメモリ上の状態だけで動かす
    return null;
  }
}

function writeStorage(state: StoreState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // 保存できなくてもデモの操作自体は続けられる
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(storeReducer, { cart: [], subscriptions: [], lastOrder: null });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    dispatch({ type: 'hydrate', state: readStorage() ?? seedState(todayIso()) });
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) writeStorage(state);
  }, [state, loaded]);

  const value = useMemo(() => ({ state, loaded, dispatch }), [state, loaded]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore は StoreProvider の内側で使ってください');
  return ctx;
}
