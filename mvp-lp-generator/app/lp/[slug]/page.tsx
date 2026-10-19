import type { Metadata } from 'next'
import PublishedView from '@/components/PublishedView'
import { lpTitle } from '@/lib/pageTitle'
import { findSampleBySlug, SAMPLES } from '@/lib/samples'

export function generateStaticParams() {
  return SAMPLES.map((s) => ({ slug: s.slug }))
}

// サンプル店舗はサーバーで店名のタイトルを出す。ブラウザ保存の LP は PublishedView が document.title を差し替える
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const sample = findSampleBySlug(slug)
  return sample ? { title: lpTitle(sample.store), description: sample.store.description } : {}
}

export default async function PublicLPPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <PublishedView slug={slug} />
}
