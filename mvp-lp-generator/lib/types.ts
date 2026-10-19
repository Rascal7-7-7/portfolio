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

/** 施術者・店主のあいさつ。写真は持たないので、名前の1文字目を文字組みで見せる */
export interface Owner {
  readonly role: string
  readonly name: string
  readonly message: string
}

export interface StoreInfo {
  readonly storeName: string
  readonly category: CategoryKey
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
