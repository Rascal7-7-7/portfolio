import { notFound } from 'next/navigation'
import Editor from '@/components/editor/Editor'
import { findSampleById, SAMPLES } from '@/lib/samples'

export const dynamicParams = false

export function generateStaticParams() {
  return SAMPLES.map((s) => ({ id: s.id }))
}

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sample = findSampleById(id)
  if (!sample) notFound()
  return <Editor initial={sample} />
}
