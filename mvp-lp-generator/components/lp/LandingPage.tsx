'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'
import type { LPDoc, TemplateKey } from '@/lib/types'
import ModernPage from './ModernPage'
import NaturalPage from './NaturalPage'
import PopPage from './PopPage'
import type { TemplateProps } from './shared'

const WIDE_MIN_PX = 760

const PAGES: Record<TemplateKey, (p: TemplateProps) => React.ReactNode> = {
  natural: NaturalPage,
  modern: ModernPage,
  pop: PopPage,
}

/**
 * ビューポートではなく「LP 自身の幅」でレイアウトを切り替える。
 * エディタ内のスマホ枠でも、公開ページでも同じ見え方にするため。
 */
function useIsWide(ref: RefObject<HTMLDivElement | null>): boolean {
  const [wide, setWide] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setWide(el.clientWidth >= WIDE_MIN_PX)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return wide
}

export default function LandingPage({ doc }: { doc: LPDoc }) {
  const ref = useRef<HTMLDivElement>(null)
  const wide = useIsWide(ref)
  const Page = PAGES[doc.template]
  return (
    // 本文は text-wrap: pretty で最終行の1文字落ち（「す。」だけの行）を避け、word-break: auto-phrase で文節の途中で改行しない
    // （auto-phrase は Chromium のみ。Safari では通常の改行に戻るだけ）。見出しは Phrases で文節単位に改行（Safari でも有効）
    <div ref={ref} data-lp-root className="min-h-full font-gothic antialiased [container-type:inline-size] [&_:is(p,blockquote,dd)]:[text-wrap:pretty] [&_:is(p,blockquote,dd)]:[word-break:auto-phrase]">
      <Page store={doc.store} sections={doc.sections} wide={wide} />
    </div>
  )
}
