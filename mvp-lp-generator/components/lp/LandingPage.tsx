'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'
import { cx } from '@/lib/cx'
import { THEMES } from '@/lib/themes'
import type { LPDoc } from '@/lib/types'
import Hero from './Hero'
import { Access, Cta, Features, Footer, Menu, Nav, Voices } from './sections'

const WIDE_MIN_PX = 760

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

interface Props {
  doc: LPDoc
}

export default function LandingPage({ doc }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const wide = useIsWide(ref)
  const t = THEMES[doc.template]
  const { store, sections } = doc
  const props = { store, t, wide }

  return (
    <div ref={ref} className={cx(t.root, 'font-gothic min-h-full antialiased [container-type:inline-size]')}>
      <Nav {...props} />
      <Hero {...props} />
      {sections.features && <Features {...props} />}
      {sections.menu && <Menu {...props} />}
      {sections.voices && <Voices {...props} />}
      {sections.access && <Access {...props} />}
      {sections.cta && <Cta {...props} />}
      <Footer {...props} />
    </div>
  )
}
