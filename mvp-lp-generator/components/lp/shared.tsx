import { toPhrases } from '@/lib/phrase'
import type { LPDoc, SectionKey, StoreInfo } from '@/lib/types'

export interface TemplateProps {
  store: StoreInfo
  sections: LPDoc['sections']
  /** LP 自身の幅が PC レイアウト相当か（ビューポートではなくコンテナ基準） */
  wide: boolean
}

/** 見出し用。文節単位で包んで語の途中の改行を防ぐ（Safari でも有効）。lead は分割しない先頭部分（店名など） */
export function Phrases({ text, lead }: { text: string; lead?: string }) {
  const units = lead ? [lead, ...toPhrases(text)] : toPhrases(text)
  return (
    <>
      {units.map((u, i) => (
        <span key={i} className="inline-block">
          {u}
        </span>
      ))}
    </>
  )
}

export const storeName = (s: StoreInfo) => s.storeName || 'お店の名前'
export const catchCopy = (s: StoreInfo) => s.catchCopy || 'キャッチコピーを入力してください'
export const ctaLabel = (s: StoreInfo) => s.ctaLabel || 'ご予約はこちら'
export const menuItems = (s: StoreInfo) => s.menu.filter((m) => m.name)
export const num = (i: number) => String(i + 1).padStart(2, '0')

export function infoRows(s: StoreInfo): [string, string][] {
  const rows: [string, string][] = [
    ['住所', s.address],
    ['営業時間', s.hours],
    ['定休日', s.closed],
    ['電話', s.phone],
  ]
  return rows.filter(([, v]) => v)
}

const ORDER: readonly SectionKey[] = ['features', 'menu', 'voices', 'access', 'cta']

/** 表示中のセクションだけを順に並べる（番号付きの見出しで使う） */
export const visibleSections = (sections: LPDoc['sections']) => ORDER.filter((k) => sections[k])
