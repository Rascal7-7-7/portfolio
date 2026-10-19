import PublishedView from '@/components/PublishedView'
import { SAMPLES } from '@/lib/samples'

export function generateStaticParams() {
  return SAMPLES.map((s) => ({ slug: s.slug }))
}

export default async function PublicLPPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <PublishedView slug={slug} />
}
