import { CATEGORIES } from './categories'
import type { StoreInfo } from './types'

/** 公開ページの <title>。ツールの名前ではなく、お店の名前（＋業種）を出す */
export const lpTitle = (s: StoreInfo) => `${s.storeName.trim() || 'お店の名前'}｜${CATEGORIES[s.category].label}`
