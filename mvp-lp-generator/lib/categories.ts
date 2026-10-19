import type { CategoryKey, SectionKey } from './types'

/**
 * menuTitle: メニューの見出し（カフェの「お品書き」が美容室に出ないよう業種で持つ）
 * hours: 営業時間の呼び方（整体は「受付」）。見出しは「受付時間」、短い表記は「受付 9:00 – 21:00」
 */
export const CATEGORIES: Record<CategoryKey, { label: string; en: string; menuTitle: string; hours: '営業' | '受付' }> = {
  cafe: { label: 'カフェ・飲食店', en: 'Café', menuTitle: 'お品書き', hours: '営業' },
  salon: { label: '美容室・サロン', en: 'Hair & Beauty', menuTitle: 'メニュー・料金', hours: '営業' },
  seitai: { label: '整体・マッサージ', en: 'Body Care', menuTitle: '施術メニュー', hours: '受付' },
  other: { label: 'その他の店舗', en: 'Welcome', menuTitle: 'メニュー・料金', hours: '営業' },
}

export const CATEGORY_KEYS = Object.keys(CATEGORIES) as CategoryKey[]

export const SECTION_LABELS: Record<SectionKey, string> = {
  features: '選ばれる理由',
  menu: 'メニュー・料金',
  voices: 'お客様の声',
  access: 'アクセス・営業時間',
  cta: '予約ボタン（締め）',
}

export const SECTION_KEYS = Object.keys(SECTION_LABELS) as SectionKey[]
