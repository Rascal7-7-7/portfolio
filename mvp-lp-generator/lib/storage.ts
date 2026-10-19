import { CATEGORIES } from './categories'
import { THEMES } from './themes'
import type { LPDoc } from './types'

// 「公開」はこのブラウザの localStorage に保存するだけのモック。サーバーには送らない。
const KEY_PREFIX = 'lp-concierge:published:'
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

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

/** localStorage の中身は信用しない。最低限の形を確かめてから使う。 */
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
      typeof store.storeName === 'string' &&
      typeof store.category === 'string' &&
      store.category in CATEGORIES &&
      Array.isArray(store.menu) &&
      Array.isArray(store.features) &&
      Array.isArray(store.voices)
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
