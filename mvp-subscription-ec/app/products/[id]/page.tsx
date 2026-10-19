import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { BRAND, PRODUCTS, findProduct } from '@/lib/catalog';
import { ProductVisual } from '@/components/ProductVisual';
import { Phrases } from '@/components/Phrases';
import { PlanPicker } from './_components/PlanPicker';
import { unitPrice, yen } from '@/lib/pricing';
import { cn } from '@/lib/cn';
import type { TasteAxis } from '@/lib/types';

type Params = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const product = findProduct((await params).id);
  if (!product) return { title: BRAND.en };
  const tagline = product.taglineParts.join('');
  const size = product.specs.find((s) => s.label === '内容量')?.value;
  const description = `${tagline}${size ? `内容量${size}。` : ''}定期便は${yen(unitPrice(product.price, 'monthly'))}（税込・10%OFF・送料無料）。`;
  const title = `${product.name}の定期便 — ${BRAND.en}`;
  return { title, description, openGraph: { title, description } };
}

export default async function ProductDetailPage({ params }: Params) {
  const product = findProduct((await params).id);
  if (!product) notFound();
  const endWidth = Math.max(...product.taste.flatMap((t) => [t.low.length, t.high.length]));

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
            {product.badge && <span>・{product.badge}</span>}
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

          {/* 軽減税率 8% の商品＝飲食料品なので「味わい」、それ以外は「使い心地」 */}
          <h2 className="mt-10 text-sm font-semibold text-on-surface">
            {product.taxRate === 8 ? '味わいの目安' : '使い心地の目安'}
          </h2>
          <dl className="mt-3 space-y-2.5 text-sm">
            {product.taste.map((t) => (
              <div key={t.label} className="flex items-center gap-4">
                <dt className="w-24 flex-shrink-0 text-on-surface-variant">{t.label}</dt>
                <dd className="flex flex-1 items-center gap-2 text-xs text-on-surface-variant">
                  <span className="sr-only">
                    5段階中{t.value}（{tasteWord(t)}）
                  </span>
                  {/* 両端の言葉は商品内でいちばん長い語の幅に揃え、目盛りの位置を全行で合わせる */}
                  <span aria-hidden className="flex-shrink-0 text-right" style={{ width: `${endWidth}em` }}>
                    {t.low}
                  </span>
                  <span aria-hidden className="grid max-w-48 flex-1 grid-cols-5 gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span key={n} className={cn('h-1.5', n <= t.value ? 'bg-on-surface' : 'bg-outline-variant/70')} />
                    ))}
                  </span>
                  <span aria-hidden className="flex-shrink-0" style={{ width: `${endWidth}em` }}>
                    {t.high}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <dl className="mt-8 divide-y divide-outline-variant/50 border-y border-outline-variant/50 text-sm">
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

/** 読み上げ用の言葉。例: 焙煎度 4 → 深め、3 → 中間 */
function tasteWord({ low, high, value }: TasteAxis): string {
  if (value === 3) return '中間';
  return `${value < 3 ? low : high}め`;
}
