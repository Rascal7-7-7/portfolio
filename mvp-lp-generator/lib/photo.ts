/**
 * 写真の入力の境界。エディタで選んだ画像はブラウザの中（object URL）だけで使い、サーバーにも localStorage にも送らない。
 */
export const PHOTO_MAX_MB = 8
const PHOTO_MAX_BYTES = PHOTO_MAX_MB * 1024 * 1024
/** accept="image/*" は選択画面の絞り込みにすぎないので、種類はここで確かめる（SVG は対象外） */
const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'] as const

/** 使えない写真ならその理由を返す。使えるなら null */
export function photoError(file: { type: string; size: number }): string | null {
  if (!(PHOTO_TYPES as readonly string[]).includes(file.type)) return 'JPEG・PNG・WebP などの画像ファイルを選んでください'
  if (file.size === 0) return 'ファイルが空です。別の画像を選んでください'
  if (file.size > PHOTO_MAX_BYTES) return `${PHOTO_MAX_MB}MB 以下の画像を選んでください`
  return null
}

/**
 * データに書けるサンプル写真のパス（public/samples/ の .webp だけ）。localStorage の下書きは信用しないので、
 * 外部 URL や blob: を読み込まないようにここで絞る
 */
export const isSamplePhotoPath = (v: unknown): v is string => typeof v === 'string' && /^\/samples\/[a-z0-9-]+\.webp$/.test(v)
