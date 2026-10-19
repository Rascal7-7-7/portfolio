'use client'

import { useEffect, useState } from 'react'

const STEPS = ['業種に合う構成を選んでいます', 'キャッチコピーを配置しています', '配色とレイアウトを整えています'] as const
const STEP_MS = 300
/** 生成演出の長さ。デモのテンポを落とさないよう 1 秒未満に抑える */
export const GENERATE_MS = STEP_MS * STEPS.length

export default function GeneratingOverlay() {
  const [step, setStep] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), STEP_MS)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div role="status" aria-live="polite" className="absolute inset-0 z-20 flex items-start justify-center bg-ed-bg/80 pt-24 lg:items-center lg:pt-0">
      <div className="w-72 rounded-lg border border-ed-line bg-ed-panel p-5 shadow-sm">
        <p className="text-sm font-semibold">LPを生成しています</p>
        <p className="mt-1 text-xs text-ed-muted">{STEPS[step]}…</p>
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-ed-line">
          <div className="h-full bg-accent transition-[width] duration-300" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
      </div>
    </div>
  )
}
