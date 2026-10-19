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
  modern: { label: 'モダン', note: '黒地に大きな見出し。美容室・バーに', swatch: '#0e0e0e' },
  pop: { label: 'ポップ', note: '明るい色面と大きな料金表示。整体・教室に', swatch: '#ff6b4a' },
}

export const TEMPLATE_KEYS = Object.keys(THEMES) as TemplateKey[]
