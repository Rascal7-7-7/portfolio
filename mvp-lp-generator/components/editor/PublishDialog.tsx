'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { isValidSlug, mockPublicUrl, MOCK_DOMAIN, sanitizeSlug, savePublished, slugFor } from '@/lib/storage'
import type { LPDoc } from '@/lib/types'
import Icon from '../Icon'
import { inputCls } from './fields'

interface Props {
  doc: LPDoc
  open: boolean
  onClose: () => void
  /** 公開に使った URL をエディタ側の doc に残し、次に開いたときの初期値とプレビューの URL 欄にする */
  onPublished: (slug: string) => void
}

export default function PublishDialog({ doc, open, onClose, onPublished }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const [slug, setSlug] = useState(() => slugFor(doc))
  const [published, setPublished] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) {
      setSlug(slugFor(doc))
      setPublished(false)
      setError('')
      setCopied(false)
      el.showModal()
    }
    if (!open && el.open) el.close()
  }, [open, doc])

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
    onPublished(slug)
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
      className="w-[min(440px,calc(100vw-32px))] rounded-lg border border-ed-line bg-ed-panel p-0 text-ed-ink shadow-[0_24px_48px_-16px_rgba(24,24,27,0.3)] backdrop:bg-black/40 open:motion-safe:animate-rise"
    >
      <div className="p-6">
        <h2 id="publish-title" className="flex items-center gap-2 text-base font-semibold">
          {published && <Icon name="check" className="h-4 w-4 text-[#067647] motion-safe:animate-fade-in" />}
          {published ? '公開しました' : 'LPを公開する'}
        </h2>
        <p className="mt-1 text-xs text-ed-muted">デモのため、実際にはインターネットへ公開されません</p>

        {!published ? (
          <div className="mt-6 space-y-2">
            <label htmlFor="f-slug" className="text-[13px] font-medium">公開URL</label>
            {/* 390px でも入力欄が切れないよう、スマホでは縦積みにしてドメインは下に小さく出す。sm 以上は1行の URL として並べる */}
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2">
              <span className="text-xs text-ed-muted sm:text-sm">https://</span>
              <input id="f-slug" value={slug} onChange={(e) => setSlug(sanitizeSlug(e.target.value))} className={`${inputCls} min-w-0`} />
              <span className="shrink-0 text-xs text-ed-muted sm:text-sm">.{MOCK_DOMAIN}</span>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-md border border-ed-line bg-ed-bg p-4 motion-safe:animate-rise">
            <p className="text-xs text-ed-muted">公開URL</p>
            <p className="mt-1 break-all text-sm font-semibold">{mockPublicUrl(slug)}</p>
            <button type="button" onClick={copy} className="-mx-2 mt-1 inline-flex min-h-11 items-center gap-1.5 rounded px-2 text-xs font-medium text-accent hover:underline lg:min-h-9">
              <Icon name={copied ? 'check' : 'copy'} className="h-3.5 w-3.5" />
              {copied ? 'コピーしました' : 'URLをコピー'}
            </button>
          </div>
        )}

        {error && <p role="alert" className="mt-3 text-xs text-[#b42318]">{error}</p>}

        <div className="mt-6 flex gap-2">
          <button type="button" onClick={onClose} className="min-h-11 flex-1 rounded-md border border-ed-line text-sm font-medium transition-colors hover:bg-ed-bg">
            閉じる
          </button>
          {!published ? (
            <button type="button" onClick={publish} className="min-h-11 flex-1 rounded-md bg-ed-ink text-sm font-semibold text-white transition-[background-color,transform] duration-150 hover:bg-[#33333a] active:scale-[0.98]">
              公開する
            </button>
          ) : (
            <Link href={`/lp/${slug}`} className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-md bg-ed-ink text-sm font-semibold text-white transition-colors hover:bg-[#33333a]">
              公開ページを開く
              <Icon name="external" className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </dialog>
  )
}
