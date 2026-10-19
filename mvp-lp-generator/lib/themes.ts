import type { TemplateKey } from './types'

export type HeroVariant = 'split' | 'center' | 'poster'

export interface Theme {
  readonly label: string
  readonly note: string
  readonly swatch: readonly [string, string, string]
  readonly hero: HeroVariant
  readonly root: string
  readonly heroBg: string
  readonly navBg: string
  readonly heading: string
  readonly eyebrow: string
  readonly muted: string
  readonly accent: string
  readonly btn: string
  readonly btnGhost: string
  readonly card: string
  readonly alt: string
  readonly art: string
  readonly line: string
  readonly ctaBand: string
  readonly mapBase: string
  readonly mapRoad: string
}

// 文字色はすべて WCAG AA（本文 4.5:1 / 大きな文字 3:1）を満たす値にしている
// Tailwind の任意値クラスはビルド時に文字列から抽出されるため、すべてリテラルで書く
export const THEMES: Record<TemplateKey, Theme> = {
  natural: {
    label: 'ナチュラル',
    note: '明朝体×生成り色。カフェ・雑貨に',
    swatch: ['#faf6ef', '#c08a55', '#3b2f25'],
    hero: 'split',
    root: 'bg-[#faf6ef] text-[#3b2f25]',
    heroBg: 'bg-[#faf6ef]',
    navBg: 'bg-[#faf6ef]/90',
    heading: 'font-mincho font-semibold tracking-wide',
    eyebrow: 'text-[11px] tracking-[0.35em] uppercase text-[#8a5526]',
    muted: 'text-[#3b2f25]/70',
    accent: 'text-[#8a5526]',
    btn: 'bg-[#3b2f25] text-[#faf6ef] hover:bg-[#2a211a] rounded-full',
    btnGhost: 'border border-[#3b2f25]/25 hover:bg-[#3b2f25]/5 rounded-full',
    card: 'bg-white border border-[#3b2f25]/10 rounded-2xl shadow-[0_18px_40px_-24px_rgba(59,47,37,0.35)]',
    alt: 'bg-[#f2eadd]',
    art: 'bg-gradient-to-br from-[#f7e3c6] via-[#e8b885] to-[#b97a42]',
    line: 'border-[#3b2f25]/10',
    ctaBand: 'bg-[#3b2f25] text-[#faf6ef]',
    mapBase: '#efe6d6',
    mapRoad: 'rgba(255,255,255,0.85)',
  },
  modern: {
    label: 'モダン',
    note: '黒×ゴールド。美容室・バーに',
    swatch: ['#0d0d0f', '#d9b779', '#ffffff'],
    hero: 'center',
    root: 'bg-[#0d0d0f] text-white',
    heroBg: 'bg-[#0d0d0f]',
    navBg: 'bg-[#0d0d0f]/80',
    heading: 'font-gothic font-bold tracking-tight',
    eyebrow: 'text-[11px] tracking-[0.35em] uppercase text-[#d9b779]',
    muted: 'text-white/60',
    accent: 'text-[#d9b779]',
    btn: 'bg-[#d9b779] text-[#0d0d0f] hover:bg-[#e6c78e] rounded-full',
    btnGhost: 'border border-white/20 hover:bg-white/10 rounded-full',
    card: 'bg-white/[0.04] border border-white/10 rounded-2xl',
    alt: 'bg-[#141417]',
    art: 'bg-gradient-to-br from-[#2a241c] via-[#7d6038] to-[#d9b779]',
    line: 'border-white/10',
    ctaBand: 'bg-gradient-to-br from-[#d9b779] to-[#b48f4f] text-[#0d0d0f]',
    mapBase: '#1b1b1f',
    mapRoad: 'rgba(255,255,255,0.08)',
  },
  pop: {
    label: 'ポップ',
    note: '元気な配色と丸み。整体・教室に',
    swatch: ['#e9f8f1', '#ff6b4a', '#1f2a37'],
    hero: 'poster',
    root: 'bg-white text-[#1f2a37]',
    heroBg: 'bg-[#e9f8f1]',
    navBg: 'bg-[#e9f8f1]/90',
    heading: 'font-gothic font-extrabold tracking-tight',
    eyebrow: 'text-xs font-bold tracking-wider text-[#c2412d]',
    muted: 'text-[#1f2a37]/65',
    accent: 'text-[#c2412d]',
    btn: 'bg-[#ff6b4a] text-[#1f2a37] hover:bg-[#ff7d5f] rounded-2xl shadow-[0_5px_0_#d9462a] active:translate-y-0.5 active:shadow-[0_3px_0_#d9462a]',
    btnGhost: 'border-2 border-[#1f2a37] hover:bg-[#1f2a37]/5 rounded-2xl',
    card: 'bg-white border-2 border-[#1f2a37] rounded-3xl shadow-[6px_6px_0_#1f2a37]',
    alt: 'bg-[#fff6dc]',
    art: 'bg-gradient-to-br from-[#ffe08a] via-[#ffb38a] to-[#ff6b4a]',
    line: 'border-[#1f2a37]/10',
    ctaBand: 'bg-[#ff6b4a] text-[#1f2a37]',
    mapBase: '#dff3ea',
    mapRoad: 'rgba(255,255,255,0.95)',
  },
}

export const TEMPLATE_KEYS = Object.keys(THEMES) as TemplateKey[]
