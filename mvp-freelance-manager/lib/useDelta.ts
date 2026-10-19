"use client";

import { useEffect, useState } from "react";

const SHOW_MS = 3000;

/**
 * 値が変わった直後の変化量を数秒だけ返す（変化なし・表示終了後は 0）。
 * 「入金済にする」を押したとき、どの数字が動いたかを示すために使う。
 * key を渡すと最後の値を sessionStorage に残し、請求書で入金してから戻ってきた初回表示でも差を出す。
 */
export function useDelta(value: number, key?: string): number {
  const [prev, setPrev] = useState(value);
  const [delta, setDelta] = useState(() => {
    const saved = key ? readSaved(key) : null;
    return saved === null ? 0 : value - saved;
  });
  useEffect(() => {
    if (!key) return;
    try {
      window.sessionStorage.setItem(key, String(value));
    } catch {
      // 保存できない環境では、ページをまたいだ差を出さないだけ
    }
  }, [key, value]);
  if (value !== prev) {
    // 描画中に前回値との差を取る（React 推奨の「props の変化に合わせて state を調整する」形）
    setPrev(value);
    setDelta(value - prev);
  }
  useEffect(() => {
    if (delta === 0) return;
    const timer = window.setTimeout(() => setDelta(0), SHOW_MS);
    return () => window.clearTimeout(timer);
  }, [delta, value]);
  return delta;
}

function readSaved(key: string): number | null {
  try {
    const raw = window.sessionStorage.getItem(key);
    const n = raw === null ? NaN : Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}
