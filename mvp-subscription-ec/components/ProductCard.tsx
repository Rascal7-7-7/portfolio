import Link from 'next/link';
import type { Product } from '@/lib/types';
import { unitPrice, yen } from '@/lib/pricing';
import { ProductVisual } from '@/components/ProductVisual';

export function ProductCard({ product }: { product: Product }) {
  const subPrice = unitPrice(product.price, 'monthly');
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-lg bg-surface-container-lowest shadow-elevation-1 ring-1 ring-outline-variant/40 transition-shadow hover:shadow-elevation-3"
    >
      <div className="relative">
        <ProductVisual
          product={product}
          decorative
          className="aspect-[4/5] transition-transform duration-500 group-hover:scale-[1.02]"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded bg-on-surface px-2 py-1 text-[11px] font-medium text-surface">
            {product.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="label-editorial text-on-surface-variant">{product.category}</p>
        <h3 className="mt-1.5 font-headline text-base font-semibold leading-snug text-on-surface [word-break:auto-phrase]">{product.name}</h3>
        <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-on-surface-variant">{product.tagline}</p>
        <div className="mt-4 flex flex-col gap-1 border-t border-outline-variant/40 pt-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] text-primary">定期便 10%OFF</p>
            <p className="tnum whitespace-nowrap font-headline text-lg font-semibold text-on-surface sm:text-xl">
              {yen(subPrice)}
              <span className="ml-1 text-[11px] font-normal text-on-surface-variant">税込</span>
            </p>
          </div>
          <p className="tnum whitespace-nowrap text-xs text-on-surface-variant">
            単品 <span className="line-through">{yen(product.price)}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
