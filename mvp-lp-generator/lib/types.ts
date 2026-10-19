export type CategoryKey = 'cafe' | 'salon' | 'seitai' | 'other'
export type TemplateKey = 'natural' | 'modern' | 'pop'
export type SectionKey = 'features' | 'menu' | 'voices' | 'access' | 'cta'

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
}

export interface LPDoc {
  readonly id: string
  readonly slug: string
  readonly template: TemplateKey
  readonly sections: Readonly<Record<SectionKey, boolean>>
  readonly store: StoreInfo
}
