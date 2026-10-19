import Link from 'next/link';
import type { Product } from '@/lib/types';
import { unitPrice, yen } from '@/lib/pricing';
import { ProductVisual } from '@/components/ProductVisual';
import { Phrases } from '@/components/Phrases';

/** 枠も影もない一覧の1項目。画像の下に「名前・ひとこと・内容量・価格」だけを置く */
export function ProductCard({ product }: { product: Product }) {
  const subPrice = unitPrice(product.price, 'monthly');
  const size = product.specs.find((s) => s.label === '内容量')?.value;
  return (
    <Link href={`/products/${product.id}`} className="group flex flex-col">
      <ProductVisual product={product} decorative className="aspect-[4/5]" />
      <div className="flex flex-1 flex-col pt-3 sm:pt-4">
        <p className="text-xs text-on-surface-variant">
          {product.category}
          {product.badge && <span> ・ {product.badge}</span>}
        </p>
        <h3 className="mt-1 font-headline text-[15px] font-semibold leading-snug text-on-surface underline-offset-4 group-hover:underline sm:text-base">
          <Phrases parts={product.nameParts} />
        </h3>
        <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-on-surface-variant">{product.tagline}</p>
        {size && <p className="mt-2 text-xs text-on-surface-variant">{size}</p>}
        <p className="tnum mt-2 text-sm text-on-surface">
          <span className="whitespace-nowrap">
            定期便 <span className="font-semibold">{yen(subPrice)}</span>
          </span>
          <span className="ml-3 whitespace-nowrap text-xs text-on-surface-variant">単品 {yen(product.price)}</span>
        </p>
      </div>
    </Link>
  );
}
