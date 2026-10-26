import type { TemplateKey } from './types'

// 見た目の実体は components/lp/{Natural,Modern,Pop}Page.tsx。ここはテンプレート選択 UI 用の表示情報だけ
export interface Theme {
  readonly label: string
  readonly note: string
  /** テンプレート選択ボタンに出す地色の見本 */
  readonly swatch: string
}

export const THEMES: Record<TemplateKey, Theme> = {
  natural: { label: 'ナチュラル', note: '縦書きの明朝と生成り色。カフェ・和の店に', swatch: '#f7f3ec' },
  modern: { label: 'モダン', note: '白地に大きな見出しと写真。美容室・サロンに', swatch: '#1c1b19' },
  pop: { label: 'ポップ', note: '明るい色面と大きな料金表示。整体・教室に', swatch: '#ff6b4a' },
}

export const TEMPLATE_KEYS = Object.keys(THEMES) as TemplateKey[]
