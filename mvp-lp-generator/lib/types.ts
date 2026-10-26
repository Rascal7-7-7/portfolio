export type CategoryKey = 'cafe' | 'salon' | 'seitai' | 'other'
export type TemplateKey = 'natural' | 'modern' | 'pop'
export type SectionKey = 'features' | 'greeting' | 'menu' | 'voices' | 'access' | 'cta'

export interface MenuItem {
  readonly emoji: string
  readonly name: string
  readonly description: string
  readonly price: string
}

export interface Feature {
  readonly emoji: string
  readonly title: string
  readonly text: string
}

export interface Voice {
  readonly name: string
  readonly text: string
}

/** 施術者・店主のあいさつ */
export interface Owner {
  readonly role: string
  readonly name: string
  readonly message: string
  /** サンプル用の写真（public/samples/*.webp）。ファイルが無いときは名前だけで組む */
  readonly photo?: string
}

export interface StoreInfo {
  readonly storeName: string
  /** 業種はテンプレートの言い回し（「お品書き」など）を決める内部の分類。LP には出さない */
  readonly category: CategoryKey
  /** LP の見出しの上に出す「エリア・ジャンル」（例: 鎌倉の自家焙煎珈琲）。任意 */
  readonly area?: string
  /**
   * ヒーローの写真。データに書けるのはサンプル用の public/samples/*.webp だけ（ファイルが無ければ線画のまま）。
   * エディタで選んだ写真は object URL のままプレビューにだけ渡し、ここには保存しない
   */
  readonly photo?: string
  /** 予約ボタンの行き先（外部の予約ページ）。無ければページ内の予約欄へ */
  readonly reserveUrl?: string
  readonly catchCopy: string
  readonly description: string
  readonly address: string
  readonly hours: string
  readonly closed: string
  readonly phone: string
  readonly ctaLabel: string
  readonly features: readonly Feature[]
  readonly menu: readonly MenuItem[]
  readonly voices: readonly Voice[]
  /** 旧バージョンで公開（localStorage 保存）したデータには無い */
  readonly owner?: Owner
}

export interface LPDoc {
  readonly id: string
  readonly slug: string
  readonly template: TemplateKey
  readonly sections: Readonly<Record<SectionKey, boolean>>
  readonly store: StoreInfo
}
