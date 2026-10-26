import type { StoreInfo } from './types'

/** 公開ページの <title>。ツールの名前ではなく、お店の名前（＋エリア・ジャンル）を出す。業種の選択値は内部の分類なので出さない */
export const lpTitle = (s: StoreInfo): string => [s.storeName.trim() || 'お店の名前', s.area?.trim()].filter(Boolean).join('｜')
