import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { BRAND, PRODUCTS, findProduct } from '@/lib/catalog';
import { ProductVisual } from '@/components/ProductVisual';
import { Phrases } from '@/components/Phrases';
import { PlanPicker } from './_components/PlanPicker';

type Params = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const product = findProduct((await params).id);
  return { title: product ? `${product.name} — ${BRAND.en}` : BRAND.en };
}

export default async function ProductDetailPage({ params }: Params) {
  const product = findProduct((await params).id);
  if (!product) notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 sm:pt-10 lg:pb-10 lg:pt-6">
      <Link
        href="/products"
        className="mb-4 inline-flex items-center gap-1 text-sm text-on-surface-variant transition-colors hover:text-on-surface"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        商品一覧
      </Link>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ProductVisual product={product} className="aspect-[3/2] sm:aspect-[5/4] lg:aspect-square" />
        </div>

        <div>
          <p className="text-xs text-on-surface-variant">
            {product.category}
            {product.badge && <span> ・ {product.badge}</span>}
          </p>
          <h1 className="mt-2 font-headline text-3xl font-light leading-snug tracking-[-0.01em] text-on-background sm:text-4xl">
            <Phrases parts={product.nameParts} />
          </h1>
          <p className="mt-3 text-base text-on-surface">
            <Phrases parts={product.taglineParts} />
          </p>
          <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
            <Phrases parts={product.descriptionParts} />
          </p>

          <div className="mt-6">
            <PlanPicker product={product} />
          </div>

          <dl className="mt-10 divide-y divide-outline-variant/50 border-y border-outline-variant/50 text-sm">
            {product.specs.map((s) => (
              <div key={s.label} className="flex gap-4 py-3">
                <dt className="w-24 flex-shrink-0 text-on-surface-variant">{s.label}</dt>
                <dd className="text-on-surface">{s.value}</dd>
              </div>
            ))}
            <div className="flex gap-4 py-3">
              <dt className="w-24 flex-shrink-0 text-on-surface-variant">消費税</dt>
              <dd className="text-on-surface">{product.taxRate === 8 ? '8%（軽減税率対象）' : '10%'}</dd>
            </div>
          </dl>
        </div>
      </div>
    </main>
  );
}
