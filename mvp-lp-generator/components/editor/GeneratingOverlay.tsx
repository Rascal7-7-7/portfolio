'use client'

import { useEffect, useState } from 'react'

const STEPS = ['業種に合う構成を選んでいます', 'キャッチコピーを配置しています', '配色とレイアウトを整えています'] as const
export const STEP_MS = 420

export default function GeneratingOverlay() {
  const [step, setStep] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), STEP_MS)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div role="status" aria-live="polite" className="absolute inset-0 z-20 flex items-start justify-center bg-ed-bg/70 pt-24 lg:items-center lg:pt-0 backdrop-blur-md">
      <div className="w-72 rounded-2xl border border-white/10 bg-ed-panel p-6 text-center shadow-2xl">
        <div aria-hidden className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-accent" />
        <p className="mt-4 text-sm font-semibold">LPを生成しています</p>
        <p className="mt-1 text-xs text-ed-muted">{STEPS[step]}…</p>
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-accent transition-all duration-300" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
      </div>
    </div>
  )
}
