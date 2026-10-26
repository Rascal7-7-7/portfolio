'use client'

import { useEffect, useRef, useState } from 'react'
import { cx } from '@/lib/cx'
import type { StoreInfo } from '@/lib/types'
import { ctaLabel, reserveLink } from './shared'

export interface BarTone {
  /** バー全体の地色と上の線 */
  bar: string
  /** 電話ボタン（線のボタン） */
  tel: string
  /** Web予約ボタン（塗りのボタン） */
  web: string
}

/** ヒーローの予約ボタンに付ける目印。これが見えている間は下部バーを出さない */
export const HERO_CTA = { 'data-hero-cta': '' } as const

/**
 * スマホ幅の LP の下部に固定する「電話｜予約」の2ボタン（予約側は本文のボタンと同じ文言）（街の整体院サイトでよく見る形）。
 * position: fixed だとエディタのスマホ枠からはみ出すので、LP の末尾に置いた sticky で下端に貼り付ける。
 * スクロール領域が画面でも枠でも同じように動く。
 */
export default function MobileBar({ store, tone }: { store: StoreInfo; tone: BarTone }) {
  const ref = useRef<HTMLDivElement>(null)
  const [heroVisible, setHeroVisible] = useState(true)

  useEffect(() => {
    const cta = ref.current?.closest('[data-lp-root]')?.querySelector('[data-hero-cta]')
    if (!cta) {
      setHeroVisible(false)
      return
    }
    // root 省略でも、祖先のスクロール枠で隠れている部分は「見えていない」と判定される
    const io = new IntersectionObserver(([e]) => setHeroVisible(e.isIntersecting))
    io.observe(cta)
    return () => io.disconnect()
  }, [])

  const btn = 'flex min-h-12 flex-1 items-center justify-center rounded-md text-sm font-bold'
  return (
    <div
      ref={ref}
      inert={heroVisible}
      aria-hidden={heroVisible}
      className={cx(
        'sticky bottom-0 z-10 flex gap-2 border-t px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] transition-[transform,opacity] duration-200',
        tone.bar,
        heroVisible && 'pointer-events-none translate-y-full opacity-0',
      )}
    >
      {store.phone && (
        <a href={`tel:${store.phone.replace(/[^\d+]/g, '')}`} className={cx(btn, 'border', tone.tel)}>
          電話する
        </a>
      )}
      <a {...reserveLink(store)} className={cx(btn, tone.web)}>
        {ctaLabel(store)}
      </a>
    </div>
  )
}
