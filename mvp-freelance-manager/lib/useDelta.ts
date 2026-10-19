"use client";

import { useEffect, useState } from "react";

const SHOW_MS = 3000;

/**
 * 値が変わった直後の変化量を数秒だけ返す（変化なし・表示終了後は 0）。
 * 「入金済にする」を押したとき、どの数字が動いたかを示すために使う。初回表示では 0。
 */
export function useDelta(value: number): number {
  const [prev, setPrev] = useState(value);
  const [delta, setDelta] = useState(0);
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
