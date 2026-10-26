'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { findSampleBySlug } from '@/lib/samples'
import { lpTitle } from '@/lib/pageTitle'
import { loadPublished, mockPublicUrl } from '@/lib/storage'
import type { LPDoc } from '@/lib/types'
import LandingPage from './lp/LandingPage'

type State = { status: 'loading' } | { status: 'missing' } | { status: 'ready'; doc: LPDoc }

export default function PublishedView({ slug }: { slug: string }) {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    // エディタで「公開」したデータ → 無ければ同じ slug のサンプル
    const doc = loadPublished(slug) ?? findSampleBySlug(slug)
    setState(doc ? { status: 'ready', doc } : { status: 'missing' })
    // 保存データの店名がサンプルと違う（または保存データだけの slug の）場合も、タブには店名を出す
    if (doc) document.title = lpTitle(doc.store)
  }, [slug])

  if (state.status === 'loading') return <div className="min-h-dvh bg-white" />

  if (state.status === 'missing') {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-ed-bg px-6 text-center">
        <h1 className="text-lg font-semibold">ページが見つかりません</h1>
        <p className="text-sm text-ed-muted">このURLのLPは、このブラウザではまだ公開されていません。</p>
        <Link href="/editor/1" className="mt-3 inline-flex min-h-11 items-center rounded-md bg-ed-ink px-5 text-sm font-semibold text-white hover:bg-[#33333a]">エディタでLPを作る</Link>
      </main>
    )
  }

  return (
    <>
      <div className="flex min-h-11 items-center justify-between gap-3 border-b border-ed-line bg-ed-bg px-4 text-xs text-ed-muted">
        <span className="truncate">
          <span className="mr-2 font-semibold text-ed-ink">公開イメージ</span>
          {mockPublicUrl(state.doc.slug)}
        </span>
        <Link href={`/editor/${state.doc.id}`} className="-mr-2 inline-flex min-h-11 shrink-0 items-center px-2 underline-offset-2 hover:text-ed-ink hover:underline">← エディタに戻る</Link>
      </div>
      <LandingPage doc={state.doc} />
    </>
  )
}
