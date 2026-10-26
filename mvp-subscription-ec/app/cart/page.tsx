'use client';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { useStore } from '@/components/StoreProvider';
import { ProductVisual } from '@/components/ProductVisual';
import { QuantityStepper } from '@/components/QuantityStepper';
import { TotalsTable } from '@/components/TotalsTable';
import { PlanBadge } from '@/components/PlanBadge';
import { CheckoutSteps } from '@/components/CheckoutSteps';
import { cartTotals, toCartLines } from '@/lib/cart';
import { remainingForFreeShipping, yen } from '@/lib/pricing';

export default function CartPage() {
  const { state, loaded, dispatch } = useStore();
  if (!loaded) return <main className="min-h-[60vh]" aria-busy="true" />;

  const lines = toCartLines(state.cart);
  if (lines.length === 0) return <EmptyCart />;

  const totals = cartTotals(lines);
  const hasSubscription = lines.some((l) => l.interval !== 'once');
  const remaining = remainingForFreeShipping(totals.subtotal, hasSubscription);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <CheckoutSteps current={0} />
      <h1 className="mb-6 font-headline text-2xl font-light text-on-background sm:text-3xl">カート</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <section aria-label="カートの商品">
          <ul className="divide-y divide-outline-variant/60 border-y border-outline-variant/60">
            {lines.map((line) => (
              <li key={`${line.productId}-${line.interval}`} className="flex gap-4 py-5">
                <Link href={`/products/${line.productId}`} className="flex-shrink-0">
                  <ProductVisual product={line.product} decorative className="h-24 w-20 sm:h-28 sm:w-24" />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-on-surface">{line.product.name}</p>
                      <div className="mt-1">
                        <PlanBadge interval={line.interval} />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'removeFromCart', productId: line.productId, interval: line.interval })}
                      className="-m-2 p-3.5 text-on-surface-variant transition-colors hover:text-on-surface"
                      aria-label={`${line.product.name}をカートから削除`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <QuantityStepper
                      value={line.quantity}
                      label={`${line.product.name}の数量`}
                      onChange={(quantity) =>
                        dispatch({ type: 'setQuantity', productId: line.productId, interval: line.interval, quantity })
                      }
                    />
                    <div className="tnum text-right">
                      <p className="font-headline font-semibold text-on-surface">{yen(line.unitPrice * line.quantity)}</p>
                      {line.unitPrice < line.product.price && (
                        <p className="text-xs text-on-surface-variant line-through">
                          {yen(line.product.price * line.quantity)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/products" className="mt-4 inline-block text-sm text-on-surface underline underline-offset-4 hover:text-primary">
            ← 買い物を続ける
          </Link>
        </section>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="bg-surface-container-low p-5">
            <p className="mb-4 text-xs text-on-surface-variant">
              {hasSubscription
                ? '定期便を含むため送料無料です'
                : remaining > 0
                  ? `あと ${yen(remaining)} で送料無料`
                  : '送料無料の対象です'}
            </p>
            <TotalsTable totals={totals} />
            <Link
              href="/checkout"
              className="mt-5 flex w-full items-center justify-center btn-primary py-3.5 font-medium"
            >
              ご購入手続きへ
            </Link>
            {hasSubscription && (
              <p className="mt-3 text-balance text-center text-xs leading-relaxed text-on-surface-variant">
                定期便は2回目以降も同じ割引価格。スキップ・解約はマイページから。
              </p>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}

function EmptyCart() {
  return (
    <main className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-headline text-2xl font-light text-on-surface">カートは空です</h1>
      <p className="mt-2 text-sm text-on-surface-variant">気になる商品を、定期便か単品でカートに入れてください。</p>
      <Link
        href="/products"
        className="mt-8 inline-flex items-center btn-primary px-6 py-3 text-sm font-medium"
      >
        商品を見る
      </Link>
    </main>
  );
}
