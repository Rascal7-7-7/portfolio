import { CATEGORIES } from './categories'
import { isSamplePhotoPath } from './photo'
import { findSampleById } from './samples'
import { THEMES } from './themes'
import type { LPDoc } from './types'

// 「公開」はこのブラウザの localStorage に保存するだけのモック。サーバーには送らない。
const KEY_PREFIX = 'lp-concierge:published:'
// 編集中の内容（公開ページから戻ったり再読み込みしたりしても消えないように）。エディタの id ごとに1件
const DRAFT_PREFIX = 'lp-concierge:draft:'
const SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?$/

export const MOCK_DOMAIN = 'lp-concierge.jp'

export function mockPublicUrl(slug: string): string {
  return `https://${slug || 'your-shop'}.${MOCK_DOMAIN}`
}

export function sanitizeSlug(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 40)
}

export function isValidSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug)
}

/**
 * プレビューの URL 欄と公開ダイアログの初期値。店名がサンプルのままか、公開時に URL を決めた後は doc.slug。
 * 店名を変えたら英数字の店名から作り、和文の店名など作れないときは仮の your-shop にする
 */
export function slugFor(doc: LPDoc): string {
  const sample = findSampleById(doc.id)
  if (!sample || doc.slug !== sample.slug || doc.store.storeName === sample.store.storeName) return doc.slug
  const fromName = sanitizeSlug(doc.store.storeName.trim().replace(/\s+/g, '-'))
  return isValidSlug(fromName) ? fromName : 'your-shop'
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

const STORE_TEXT = ['storeName', 'catchCopy', 'description', 'address', 'hours', 'closed', 'phone', 'ctaLabel'] as const

/** 配列の要素がすべて、指定した文字列項目を持つ object か */
function isListOf(v: unknown, keys: readonly string[]): boolean {
  return Array.isArray(v) && v.every((item) => isObject(item) && keys.every((k) => typeof item[k] === 'string'))
}

/** ギャラリーに並べる写真の上限（下書きの中身は信用しないので数も絞る） */
const MAX_GALLERY = 6

const optional = (v: unknown, ok: (x: unknown) => boolean) => v === undefined || ok(v)

/** 予約ボタンの外部リンクは https の URL だけ通す（javascript: などをリンクにしない） */
export function isReserveUrl(v: unknown): v is string {
  if (typeof v !== 'string') return false
  try {
    return new URL(v).protocol === 'https:'
  } catch {
    return false
  }
}

/** localStorage の中身は信用しない。描画で触る項目の形を確かめてから使う（壊れた下書きでエディタが開けなくならないように）。 */
export function parseDoc(raw: string | null): LPDoc | null {
  if (!raw) return null
  try {
    const v: unknown = JSON.parse(raw)
    if (!isObject(v) || !isObject(v.store) || !isObject(v.sections)) return null
    const store = v.store
    const ok =
      typeof v.slug === 'string' &&
      typeof v.template === 'string' &&
      v.template in THEMES &&
      typeof v.id === 'string' &&
      STORE_TEXT.every((k) => typeof store[k] === 'string') &&
      typeof store.category === 'string' &&
      store.category in CATEGORIES &&
      isListOf(store.menu, ['emoji', 'name', 'description', 'price']) &&
      isListOf(store.features, ['emoji', 'title', 'text']) &&
      (store.features as Record<string, unknown>[]).every((f) => optional(f.photo, isSamplePhotoPath)) &&
      optional(store.gallery, (g) => Array.isArray(g) && g.length <= MAX_GALLERY && g.every(isSamplePhotoPath)) &&
      isListOf(store.voices, ['name', 'text']) &&
      optional(store.area, (x) => typeof x === 'string') &&
      optional(store.photo, isSamplePhotoPath) &&
      optional(store.reserveUrl, isReserveUrl) &&
      optional(store.owner, (o) => isListOf([o], ['role', 'name', 'message']) && optional((o as Record<string, unknown>).photo, isSamplePhotoPath))
    return ok ? (v as unknown as LPDoc) : null
  } catch {
    return null
  }
}

export function savePublished(doc: LPDoc): boolean {
  try {
    window.localStorage.setItem(KEY_PREFIX + doc.slug, JSON.stringify(doc))
    return true
  } catch {
    return false
  }
}

export function loadPublished(slug: string): LPDoc | null {
  try {
    return parseDoc(window.localStorage.getItem(KEY_PREFIX + slug))
  } catch {
    return null
  }
}

/** 保存できない環境（プライベートモード等）では false。エディタは「保存できません」と出し、再読み込みで編集が消えるだけにする */
export function saveDraft(doc: LPDoc): boolean {
  try {
    window.localStorage.setItem(DRAFT_PREFIX + doc.id, JSON.stringify(doc))
    return true
  } catch {
    return false
  }
}

export function loadDraft(id: string): LPDoc | null {
  try {
    const doc = parseDoc(window.localStorage.getItem(DRAFT_PREFIX + id))
    return doc?.id === id ? doc : null
  } catch {
    return null
  }
}
