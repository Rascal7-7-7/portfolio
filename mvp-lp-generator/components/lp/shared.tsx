import { Fragment } from 'react'
import { CATEGORIES } from '@/lib/categories'
import { toPhrases } from '@/lib/phrase'
import type { LPDoc, SectionKey, StoreInfo } from '@/lib/types'

export interface TemplateProps {
  store: StoreInfo
  sections: LPDoc['sections']
  /** LP 自身の幅が PC レイアウト相当か（ビューポートではなくコンテナ基準） */
  wide: boolean
  /** PC レイアウトの中でも横幅に余裕があるか（1100px 以上）。エディタのプレビュー枠では false */
  roomy: boolean
  /** ヒーロー見出しの要素。公開ページは h1、エディタのプレビューはエディタ側の h1 と重ならないよう h2 */
  headline: 'h1' | 'h2'
}

/** 見出し用。文節単位で包んで語の途中の改行を防ぐ（Safari でも有効）。lead は分割しない先頭部分（店名など） */
export function Phrases({ text, lead }: { text: string; lead?: string }) {
  const units = lead ? [lead, ...toPhrases(text)] : toPhrases(text)
  return (
    <>
      {units.map((u, i) => {
        // 末尾の空白は inline-block の中だと消えるので外に出す（「初回お試し 60分」の空白を残す）
        const body = u.trimEnd()
        return (
          <Fragment key={i}>
            <span className="inline-block">{body}</span>
            {u.slice(body.length)}
          </Fragment>
        )
      })}
    </>
  )
}

export const storeName = (s: StoreInfo) => s.storeName || 'お店の名前'
export const catchCopy = (s: StoreInfo) => s.catchCopy || 'キャッチコピーを入力してください'
export const ctaLabel = (s: StoreInfo) => s.ctaLabel || 'ご予約はこちら'
export const menuItems = (s: StoreInfo) => s.menu.filter((m) => m.name)
export const num = (i: number) => String(i + 1).padStart(2, '0')

export const menuTitle = (s: StoreInfo) => CATEGORIES[s.category].menuTitle
/** 「営業」か「受付」（業種で呼び方が違う） */
export const hoursWord = (s: StoreInfo) => CATEGORIES[s.category].hours

export function infoRows(s: StoreInfo): [string, string][] {
  const rows: [string, string][] = [
    ['住所', s.address],
    [`${hoursWord(s)}時間`, s.hours],
    ['定休日', s.closed],
    ['電話', s.phone],
  ]
  return rows.filter(([, v]) => v)
}

const ORDER: readonly SectionKey[] = ['features', 'greeting', 'menu', 'voices', 'access', 'cta']

/** あいさつ文があるときだけ返す（旧データ・空欄では描画しない） */
export const ownerOf = (s: StoreInfo) => (s.owner?.message ? s.owner : null)

/** エリア・ジャンル（任意入力）。業種の選択値は内部の分類なので LP には出さない */
export const areaOf = (s: StoreInfo) => s.area?.trim() ?? ''

/** 予約ボタンの行き先。外部の予約ページがあれば新しいタブで開き、無ければページ内の予約欄へ */
export const reserveLink = (s: StoreInfo) =>
  s.reserveUrl ? { href: s.reserveUrl, target: '_blank', rel: 'noopener noreferrer' } : { href: '#reserve' }

/**
 * 料金が安い品（飲み物 1 杯など）か。大きな料金表示にすると「¥580」だけが目立って間が抜けるので、控えめに組む。
 * ponytail: 先頭の数字の並びだけで判定（「¥1,000〜」は 1000）。数字が無ければ安い扱いにしない
 */
export const LOW_PRICE_YEN = 2000
export function isLowPrice(price: string): boolean {
  const m = price.normalize('NFKC').replace(/,/g, '').match(/\d+/)
  return m !== null && Number(m[0]) < LOW_PRICE_YEN
}

/** 実際に描画されるセクションだけを順に並べる（番号付きの見出しで使う）。品目0件のメニュー・文の無いあいさつは描画されないので除く */
export const visibleSections = (sections: LPDoc['sections'], store: StoreInfo) =>
  ORDER.filter((k) => sections[k] && (k !== 'menu' || menuItems(store).length > 0) && (k !== 'greeting' || ownerOf(store) !== null))
