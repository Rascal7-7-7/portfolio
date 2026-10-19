'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cx } from '@/lib/cx'
import type { LPDoc, MenuItem, SectionKey, StoreInfo, TemplateKey } from '@/lib/types'
import Icon from '../Icon'
import EditorForm from './EditorForm'
import PreviewPane from './PreviewPane'
import PublishDialog from './PublishDialog'

const GENERATE_MS = 1300
type Tab = 'form' | 'preview'

export default function Editor({ initial }: { initial: LPDoc }) {
  const [doc, setDoc] = useState(initial)
  const [generating, setGenerating] = useState(false)
  const [tab, setTab] = useState<Tab>('form')
  const [publishOpen, setPublishOpen] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const generate = useCallback((next?: LPDoc) => {
    if (next) setDoc(next)
    setTab('preview')
    setGenerating(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setGenerating(false), GENERATE_MS)
  }, [])

  const loadSample = (sample: LPDoc) => {
    // URL だけ揃える（再マウントすると生成演出が消えるため、ルーター遷移はしない）
    window.history.replaceState(null, '', `/editor/${sample.id}`)
    generate(sample)
  }
  const updateStore = (patch: Partial<StoreInfo>) => setDoc((d) => ({ ...d, store: { ...d.store, ...patch } }))
  const updateMenu = (index: number, patch: Partial<MenuItem>) =>
    setDoc((d) => ({ ...d, store: { ...d.store, menu: d.store.menu.map((m, i) => (i === index ? { ...m, ...patch } : m)) } }))
  const toggleSection = (key: SectionKey) => setDoc((d) => ({ ...d, sections: { ...d.sections, [key]: !d.sections[key] } }))
  const setTemplate = (template: TemplateKey) => setDoc((d) => ({ ...d, template }))

  return (
    <div className="flex min-h-dvh flex-col bg-ed-bg text-white lg:h-dvh">
      <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-white/[0.08] px-4 lg:px-6">
        <div className="flex items-center gap-2.5">
          <span aria-hidden className="h-6 w-6 rounded-lg bg-gradient-to-br from-accent to-[#7b5cff]" />
          <span className="text-sm font-semibold tracking-tight">LP Concierge</span>
          <span className="hidden rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-ed-muted sm:inline">DEMO</span>
        </div>
        <ol className="hidden items-center gap-2 text-xs text-ed-muted md:flex">
          <li>① 入力</li>
          <li aria-hidden>→</li>
          <li>② 生成・テンプレート選択</li>
          <li aria-hidden>→</li>
          <li>③ 公開</li>
        </ol>
        <button
          type="button"
          onClick={() => setPublishOpen(true)}
          className="flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-black transition hover:bg-white/90"
        >
          <Icon name="rocket" className="h-3.5 w-3.5" />
          公開する
        </button>
      </header>

      <div role="tablist" aria-label="表示切替" className="flex gap-1 border-b border-white/[0.08] p-2 lg:hidden">
        {(['form', 'preview'] as const).map((k) => (
          <button
            key={k}
            role="tab"
            type="button"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={cx('flex-1 rounded-full py-2 text-xs font-medium', tab === k ? 'bg-white/10 text-white' : 'text-ed-muted')}
          >
            {k === 'form' ? '入力' : 'プレビュー'}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 lg:grid lg:grid-cols-[400px_1fr] lg:grid-rows-[minmax(0,1fr)]">
        <aside className={cx('overflow-y-auto border-white/[0.08] lg:block lg:border-r', tab === 'form' ? 'block' : 'hidden')}>
          <EditorForm
            doc={doc}
            onStore={updateStore}
            onMenu={updateMenu}
            onToggleSection={toggleSection}
            onSample={loadSample}
            onGenerate={() => generate()}
          />
        </aside>
        <main className={cx('min-h-0 lg:block', tab === 'preview' ? 'block' : 'hidden')}>
          <PreviewPane doc={doc} generating={generating} onTemplate={setTemplate} />
        </main>
      </div>

      <PublishDialog doc={doc} open={publishOpen} onClose={() => setPublishOpen(false)} />
    </div>
  )
}
