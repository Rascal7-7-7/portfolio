import type { CategoryKey, SectionKey } from './types'

export const CATEGORIES: Record<CategoryKey, { label: string; en: string; emoji: string; motif: readonly string[] }> = {
  cafe: { label: 'カフェ・飲食店', en: 'Café', emoji: '☕', motif: ['🥐', '🍰', '🌿'] },
  salon: { label: '美容室・サロン', en: 'Hair & Beauty', emoji: '✂️', motif: ['💇‍♀️', '✨', '🌸'] },
  seitai: { label: '整体・マッサージ', en: 'Body Care', emoji: '🌿', motif: ['🧘', '💆', '🍃'] },
  other: { label: 'その他の店舗', en: 'Welcome', emoji: '🏪', motif: ['⭐', '🎁', '💡'] },
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
