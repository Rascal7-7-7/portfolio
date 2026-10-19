'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { isValidSlug, mockPublicUrl, MOCK_DOMAIN, sanitizeSlug, savePublished } from '@/lib/storage'
import type { LPDoc } from '@/lib/types'
import Icon from '../Icon'
import { inputCls } from './fields'

interface Props {
  doc: LPDoc
  open: boolean
  onClose: () => void
}

export default function PublishDialog({ doc, open, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const [slug, setSlug] = useState(doc.slug)
  const [published, setPublished] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) {
      setSlug(doc.slug)
      setPublished(false)
      setError('')
      setCopied(false)
      el.showModal()
    }
    if (!open && el.open) el.close()
  }, [open, doc.slug])

  function publish() {
    if (!isValidSlug(slug)) {
      setError('英小文字・数字・ハイフンで入力してください（先頭と末尾は英数字）')
      return
    }
    if (!savePublished({ ...doc, slug })) {
      setError('このブラウザでは保存できませんでした（プライベートモード等）。サンプルの公開ページは表示できます。')
      return
    }
    setError('')
    setPublished(true)
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(mockPublicUrl(slug))
      setCopied(true)
    } catch {
      setError('コピーできませんでした。URLを選択してコピーしてください。')
    }
  }

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="publish-title"
      className="w-[min(440px,calc(100vw-32px))] rounded-3xl border border-white/10 bg-ed-panel p-0 text-white shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
            <Icon name={published ? 'check' : 'rocket'} className="h-5 w-5" />
          </span>
          <div>
            <h2 id="publish-title" className="text-base font-semibold">{published ? '公開しました' : 'LPを公開する'}</h2>
            <p className="text-xs text-ed-muted">デモのため、実際にはインターネットへ公開されません</p>
          </div>
        </div>

        {!published ? (
          <div className="mt-6 space-y-2">
            <label htmlFor="f-slug" className="text-xs font-medium text-white/80">公開URL</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-ed-muted">https://</span>
              <input id="f-slug" value={slug} onChange={(e) => setSlug(sanitizeSlug(e.target.value))} className={inputCls} />
              <span className="shrink-0 text-sm text-ed-muted">.{MOCK_DOMAIN}</span>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/10 p-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-accent">PUBLIC URL</p>
            <p className="mt-1 break-all text-sm font-semibold">{mockPublicUrl(slug)}</p>
            <button type="button" onClick={copy} className="mt-3 inline-flex items-center gap-1.5 text-xs text-white/80 hover:text-white">
              <Icon name={copied ? 'check' : 'copy'} className="h-3.5 w-3.5" />
              {copied ? 'コピーしました' : 'URLをコピー'}
            </button>
          </div>
        )}

        {error && <p role="alert" className="mt-3 text-xs text-[#ff8a80]">{error}</p>}

        <div className="mt-6 flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 rounded-full border border-white/10 py-2.5 text-sm text-white/80 hover:bg-white/5">
            閉じる
          </button>
          {!published ? (
            <button type="button" onClick={publish} className="flex-1 rounded-full bg-accent py-2.5 text-sm font-semibold hover:brightness-110">
              公開する
            </button>
          ) : (
            <Link href={`/lp/${slug}`} className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-accent py-2.5 text-sm font-semibold hover:brightness-110">
              公開ページを開く
              <Icon name="external" className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </dialog>
  )
}
