'use client';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { useStore } from '@/components/StoreProvider';
import { ProductVisual } from '@/components/ProductVisual';
import { PlanBadge } from '@/components/PlanBadge';
import { TotalsTable } from '@/components/TotalsTable';
import { CheckoutSteps } from '@/components/CheckoutSteps';
import { RecurringSummary } from '@/components/RecurringSummary';
import { DEMO_USER, findProduct } from '@/lib/catalog';
import { formatJaLong } from '@/lib/date';
import { yen } from '@/lib/pricing';

export default function CompletePage() {
  const { state, loaded } = useStore();
  if (!loaded) return <main className="min-h-[60vh]" aria-busy="true" />;

  const order = state.lastOrder;
  if (!order) {
    return (
      <main className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-on-surface-variant">表示できるご注文がありません</p>
        <Link href="/products" className="mt-4 inline-block text-sm text-on-surface underline underline-offset-4">
          商品一覧へ
        </Link>
      </main>
    );
  }

  const subscriptionCount = order.lines.filter((l) => l.interval !== 'once').length;

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <CheckoutSteps current={2} />

      <div className="text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-primary" strokeWidth={1.25} aria-hidden />
        <h1 className="mt-4 font-headline text-3xl font-light text-on-background [word-break:auto-phrase]">ご注文ありがとうございます</h1>
        <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
          {DEMO_USER.name} 様のお申し込みを受け付けました。
          <br />
          ご注文番号 <span className="tnum font-medium text-on-surface">{order.id}</span>
        </p>
      </div>

      <div className="mt-8 border-y border-outline-variant/60 py-6 text-center">
        <div>
          <p className="text-xs text-on-surface-variant">初回お届け予定</p>
          <p className="tnum mt-1 font-headline text-2xl font-light text-on-surface">{formatJaLong(order.firstDelivery)}</p>
          {subscriptionCount > 0 && (
            <p className="mt-2 text-balance text-xs text-on-surface-variant">
              定期便 {subscriptionCount} 件を開始しました。2回目以降はマイページで確認できます。
            </p>
          )}
        </div>
      </div>

      <section className="mt-8 bg-surface-container-low p-5">
        <h2 className="mb-4 text-sm font-semibold text-on-surface">ご注文内容</h2>
        <ul className="mb-4 space-y-3 border-b border-outline-variant/60 pb-4">
          {order.lines.map((l) => {
            const product = findProduct(l.productId);
            if (!product) return null;
            return (
              <li key={`${l.productId}-${l.interval}`} className="flex items-center gap-3">
                <ProductVisual product={product} decorative className="h-14 w-12 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-on-surface">
                    {product.name} <span className="tnum text-on-surface-variant">× {l.quantity}</span>
                  </p>
                  <div className="mt-1">
                    <PlanBadge interval={l.interval} />
                  </div>
                </div>
                <p className="tnum text-sm text-on-surface">{yen(l.unitPrice * l.quantity)}</p>
              </li>
            );
          })}
        </ul>
        <TotalsTable totals={order.totals} />
        <div className="mt-4">
          <RecurringSummary lines={order.lines} firstDelivery={order.firstDelivery} />
        </div>
      </section>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link
          href="/mypage"
          className="flex items-center justify-center rounded-sm bg-primary py-3.5 font-medium text-on-primary hover:opacity-90"
        >
          マイページで定期便を見る
        </Link>
        <Link
          href="/products"
          className="flex items-center justify-center rounded-sm py-3.5 font-medium text-on-surface ring-1 ring-outline hover:ring-on-surface"
        >
          ショップに戻る
        </Link>
      </div>
    </main>
  );
}
