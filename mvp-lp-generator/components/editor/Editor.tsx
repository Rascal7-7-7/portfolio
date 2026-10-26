'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cx } from '@/lib/cx'
import Icon from '../Icon'
import { photoError as checkPhoto } from '@/lib/photo'
import { findSampleById } from '@/lib/samples'
import { loadDraft, loadPublished, saveDraft } from '@/lib/storage'
import type { LPDoc, MenuItem, SectionKey, StoreInfo, TemplateKey } from '@/lib/types'
import EditorForm, { isEdited } from './EditorForm'
import { GENERATE_MS } from './GeneratingOverlay'
import PreviewPane from './PreviewPane'
import PublishDialog from './PublishDialog'

type Tab = 'form' | 'preview'
type Step = 1 | 2 | 3
/** 下書きの保存状態。入力が止まってから保存し、ヘッダーに小さく出す（Notion / Framer の「保存済み」表示） */
type Save = 'idle' | 'saving' | 'saved' | 'failed'
const SAVE_DELAY_MS = 500

const STEPS: readonly [Step, string][] = [
  [1, '入力'],
  [2, '生成・テンプレート選択'],
  [3, '公開'],
]

export default function Editor({ initial }: { initial: LPDoc }) {
  const [doc, setDoc] = useState(initial)
  // 保存済みの下書きを読むまでは本文を隠す（サンプルが一瞬出てから編集内容に切り替わるのを防ぐ）
  const [restored, setRestored] = useState(false)
  const [generating, setGenerating] = useState(false)
  // 1024px 未満では入力から始める（初めての人に、まず何を入れればよいかを見せる。生成するとプレビューに切り替わる）
  const [tab, setTab] = useState<Tab>('form')
  const [step, setStep] = useState<Step>(1)
  const [publishOpen, setPublishOpen] = useState(false)
  const [save, setSave] = useState<Save>('idle')
  const timer = useRef<number | undefined>(undefined)
  const firstSave = useRef(true)
  // 選んだ写真（object URL）。doc には入れないので、下書き（localStorage）にも公開データにも保存されない
  const [photo, setPhoto] = useState<{ url: string; name: string } | null>(null)
  const [photoError, setPhotoError] = useState('')

  useEffect(() => () => window.clearTimeout(timer.current), [])
  // 差し替え・取り外し・画面を離れるときに object URL を解放する
  useEffect(() => (photo ? () => URL.revokeObjectURL(photo.url) : undefined), [photo])
  // localStorage はサーバー描画に無いので、マウント後に読む（ハイドレーションの不一致を避ける）
  useEffect(() => {
    const draft = loadDraft(initial.id)
    if (draft) {
      setDoc(draft)
      // 進み具合は保存せず、下書きから決める（公開済みなら 3、サンプルから変えていれば 2）
      const sample = findSampleById(draft.id)
      if (loadPublished(draft.slug)) setStep(3)
      else if (!sample || isEdited(draft, sample)) setStep(2)
    }
    setRestored(true)
  }, [initial.id])
  useEffect(() => {
    if (!restored) return
    // 開いた直後の保存は表示しない（何もしていないのに「保存しました」と出さない）
    if (firstSave.current) {
      firstSave.current = false
      saveDraft(doc)
      return
    }
    setSave('saving')
    const id = window.setTimeout(() => setSave(saveDraft(doc) ? 'saved' : 'failed'), SAVE_DELAY_MS)
    return () => window.clearTimeout(id)
  }, [doc, restored])

  const generate = useCallback((next?: LPDoc) => {
    if (next) setDoc(next)
    setTab('preview')
    setStep((s) => (s < 2 ? 2 : s))
    // スマホでは下部のボタンから押されても LP の先頭（生成演出）が見えるようにする
    window.scrollTo({ top: 0 })
    setGenerating(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setGenerating(false), GENERATE_MS)
  }, [])

  const choosePhoto = (file: File) => {
    const error = checkPhoto(file)
    if (error) {
      setPhotoError(error)
      return
    }
    const url = URL.createObjectURL(file)
    // 種類が画像でも中身が壊れていることがあるので、実際に読めるか確かめてから使う
    const img = new Image()
    img.onload = () => {
      setPhotoError('')
      setPhoto({ url, name: file.name })
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      setPhotoError('この画像は読み込めませんでした。別の画像を選んでください')
    }
    img.src = url
  }
  const clearPhoto = () => {
    setPhoto(null)
    setPhotoError('')
  }

  const loadSample = (sample: LPDoc) => {
    // 写真は別のお店のものなので外す
    clearPhoto()
    // URL だけ揃える（再マウントすると生成演出が消えるため、ルーター遷移はしない）
    window.history.replaceState(null, '', `/editor/${sample.id}`)
    // 別のサンプルに切り替えるときは、そのサンプルの下書きがあればそれを開く（素のサンプルで上書きしない）
    generate(sample.id === doc.id ? sample : (loadDraft(sample.id) ?? sample))
  }
  const updateStore = (patch: Partial<StoreInfo>) => setDoc((d) => ({ ...d, store: { ...d.store, ...patch } }))
  const updateMenu = (index: number, patch: Partial<MenuItem>) =>
    setDoc((d) => ({ ...d, store: { ...d.store, menu: d.store.menu.map((m, i) => (i === index ? { ...m, ...patch } : m)) } }))
  const toggleSection = (key: SectionKey) => setDoc((d) => ({ ...d, sections: { ...d.sections, [key]: !d.sections[key] } }))
  const setTemplate = (template: TemplateKey) => {
    setDoc((d) => ({ ...d, template }))
    setStep((s) => (s < 2 ? 2 : s))
  }
  const onPublished = (slug: string) => {
    setDoc((d) => ({ ...d, slug }))
    setStep(3)
  }
  const canPublish = doc.store.storeName.trim() !== ''
  // プレビューにだけ写真を差し込む（サンプル写真より、選んだ写真を優先）
  const previewDoc = photo ? { ...doc, store: { ...doc.store, photo: photo.url } } : doc

  return (
    <div className="flex min-h-dvh flex-col bg-ed-bg text-ed-ink lg:h-dvh">
      {/* md 以上は3列にして、保存表示が出ても中央の手順が動かないようにする */}
      <header className="flex h-14 shrink-0 items-center justify-between gap-4 md:grid md:grid-cols-[1fr_auto_1fr] border-b border-ed-line bg-ed-panel px-4 lg:px-6">
        <p className="flex shrink-0 items-baseline gap-2 whitespace-nowrap">
          <span className="text-[15px] font-semibold">LP Concierge</span>
          <span className="hidden text-xs text-ed-muted sm:inline">デモ版</span>
        </p>
        <ol className="hidden items-center gap-2 text-xs text-ed-muted md:flex">
          {STEPS.map(([n, label]) => (
            <li key={n} className="flex items-center gap-2">
              {n > 1 && <span aria-hidden>—</span>}
              <span aria-current={step === n ? 'step' : undefined} className={cx(step === n && 'font-semibold text-ed-ink')}>
                {n}. {label}
              </span>
            </li>
          ))}
        </ol>
        <div className="flex shrink-0 items-center gap-3 md:justify-self-end">
          {canPublish && <SaveStatus state={save} />}
          {/* 店舗名が空の LP は公開ページのタイトルも見出しも決まらないので、公開に進ませない */}
          {!canPublish && (
            <p id="publish-blocked" className="text-xs font-medium text-[#b42318]">
              {/* スマホのヘッダーに収まるよう短く出す */}
              <span className="sm:hidden">店舗名が必要です</span>
              <span className="hidden sm:inline">店舗名を入力すると公開できます</span>
            </p>
          )}
          <button
            type="button"
            onClick={() => setPublishOpen(true)}
            disabled={!canPublish}
            aria-describedby={canPublish ? undefined : 'publish-blocked'}
            className="min-h-11 rounded-md bg-ed-ink px-4 text-[13px] font-semibold text-white transition-[background-color,transform] duration-150 hover:bg-[#33333a] active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-ed-line disabled:text-ed-muted disabled:active:scale-100 lg:min-h-9"
          >
            公開する
          </button>
        </div>
      </header>

      <div role="tablist" aria-label="表示切替" className="flex border-b border-ed-line bg-ed-panel lg:hidden">
        {(['form', 'preview'] as const).map((k) => (
          <button
            key={k}
            role="tab"
            type="button"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={cx(
              '-mb-px flex-1 border-b-2 py-3 text-sm font-medium transition-colors',
              tab === k ? 'border-ed-ink text-ed-ink' : 'border-transparent text-ed-muted',
            )}
          >
            {k === 'form' ? '入力' : 'プレビュー'}
          </button>
        ))}
      </div>

      <div className={cx('min-h-0 flex-1 lg:grid lg:grid-cols-[380px_1fr] lg:grid-rows-[minmax(0,1fr)]', !restored && 'invisible')}>
        <aside className={cx('overflow-y-auto border-ed-line bg-ed-panel lg:block lg:border-r', tab === 'form' ? 'block' : 'hidden')}>
          <EditorForm
            doc={doc}
            onStore={updateStore}
            onMenu={updateMenu}
            onToggleSection={toggleSection}
            onSample={loadSample}
            onGenerate={() => generate()}
            photoName={photo?.name ?? null}
            photoError={photoError}
            onPhoto={choosePhoto}
            onClearPhoto={clearPhoto}
          />
        </aside>
        <main className={cx('min-h-0 lg:block', tab === 'preview' ? 'block' : 'hidden')}>
          <PreviewPane doc={previewDoc} generating={generating} onTemplate={setTemplate} />
        </main>
      </div>

      <PublishDialog doc={doc} open={publishOpen} onClose={() => setPublishOpen(false)} onPublished={onPublished} />
    </div>
  )
}

/** 保存の反応。文言が変わるたびに短く浮かび上がる。失敗だけ赤で出す。1024px 未満のヘッダーには短い文言を出す */
const SAVE_LABELS: Record<Exclude<Save, 'idle'>, [string, string]> = {
  saving: ['保存中…', '保存中…'],
  saved: ['下書きを保存しました', '保存済み'],
  failed: ['このブラウザでは保存できません', '保存不可'],
}

function SaveStatus({ state }: { state: Save }) {
  // 読み上げ用の領域は常に置き、中身だけ差し替える（領域ごと作り直すと読み上げられない）
  return (
    <p role="status" className="text-xs">
      {state !== 'idle' && (
        <span
          key={state}
          className={cx(
            'flex items-center gap-1.5 whitespace-nowrap motion-safe:animate-rise',
            state === 'failed' ? 'font-medium text-[#b42318]' : 'text-ed-muted',
          )}
        >
          {state === 'saved' && <Icon name="check" className="h-3.5 w-3.5" />}
          <span className="lg:hidden">{SAVE_LABELS[state][1]}</span>
          <span className="hidden lg:inline">{SAVE_LABELS[state][0]}</span>
        </span>
      )}
    </p>
  )
}
