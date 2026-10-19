'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, CreditCard, Info, Lock, MapPin, Store } from 'lucide-react';
import { useStore } from '@/components/StoreProvider';
import { TotalsTable } from '@/components/TotalsTable';
import { PlanBadge } from '@/components/PlanBadge';
import { CheckoutSteps } from '@/components/CheckoutSteps';
import { RecurringSummary } from '@/components/RecurringSummary';
import { DEMO_USER } from '@/lib/catalog';
import { cartTotals, toCartLines } from '@/lib/cart';
import { firstDelivery, formatJa, todayIso } from '@/lib/date';
import { yen } from '@/lib/pricing';
import { cn } from '@/lib/cn';

const PAYMENT_METHODS = [
  { id: 'card', label: 'クレジットカード', icon: CreditCard, note: '登録済みカード（デモ）' },
  { id: 'konbini', label: 'コンビニ後払い', icon: Store, note: '請求書を同梱（デモ）' },
] as const;

type PaymentId = (typeof PAYMENT_METHODS)[number]['id'];

export default function CheckoutPage() {
  const { state, loaded, dispatch } = useStore();
  const router = useRouter();
  const [payment, setPayment] = useState<PaymentId>('card');
  const [placing, setPlacing] = useState(false);

  if (!loaded || placing) {
    return (
      <main className="min-h-[60vh] py-24 text-center text-sm text-on-surface-variant" aria-busy="true">
        {placing && '申し込みを処理しています…'}
      </main>
    );
  }

  const lines = toCartLines(state.cart);
  if (lines.length === 0) {
    return (
      <main className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-on-surface-variant">カートに商品がありません</p>
        <Link href="/products" className="mt-4 inline-block text-sm text-primary hover:underline">
          商品一覧へ
        </Link>
      </main>
    );
  }

  const totals = cartTotals(lines);
  const delivery = firstDelivery(todayIso());

  const placeOrder = () => {
    setPlacing(true);
    dispatch({ type: 'placeOrder', today: todayIso(), orderId: `MA-${Date.now().toString().slice(-6)}` });
    router.push('/complete');
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <CheckoutSteps current={1} />
      <h1 className="mb-6 font-headline text-2xl font-light text-on-background sm:text-3xl">ご購入手続き</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <Section icon={MapPin} title="お届け先">
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm leading-relaxed">
                <p className="font-medium text-on-surface">{DEMO_USER.name} 様</p>
                <p className="text-on-surface-variant">{DEMO_USER.address}</p>
                <p className="text-on-surface-variant">{DEMO_USER.email}</p>
              </div>
              <span className="flex-shrink-0 rounded bg-surface-container px-2 py-1 text-[11px] text-on-surface-variant">
                デモユーザー
              </span>
            </div>
          </Section>

          <Section icon={CalendarDays} title="初回お届け予定">
            <p className="tnum font-headline text-xl font-semibold text-on-surface">{formatJa(delivery)}</p>
            <p className="mt-1 text-xs text-on-surface-variant">定期便の2回目以降は、マイページでスキップ・お休みできます。</p>
          </Section>

          <Section icon={Lock} title="お支払い方法">
            <fieldset>
              <legend className="sr-only">お支払い方法を選ぶ</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {PAYMENT_METHODS.map(({ id, label, icon: Icon, note }) => (
                  <label
                    key={id}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-md p-3 ring-1 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary',
                      payment === id ? 'bg-primary/5 ring-2 ring-primary' : 'ring-outline-variant hover:ring-outline',
                    )}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={id}
                      checked={payment === id}
                      onChange={() => setPayment(id)}
                      className="sr-only"
                    />
                    <Icon className="h-5 w-5 text-on-surface-variant" aria-hidden />
                    <span>
                      <span className="block text-sm font-medium text-on-surface">{label}</span>
                      <span className="block text-[11px] text-on-surface-variant">{note}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <p className="mt-3 flex items-start gap-2 rounded-md bg-surface-container px-3 py-2.5 text-xs leading-relaxed text-on-surface-variant">
              <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" aria-hidden />
              デモのため、カード番号などの入力は不要です。決済は行われず、情報もどこにも送信されません。
            </p>
          </Section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg bg-surface-container-lowest p-5 shadow-elevation-2 ring-1 ring-outline-variant/40">
            <h2 className="mb-4 text-sm font-semibold text-on-surface">ご注文内容</h2>
            <ul className="mb-4 space-y-3 border-b border-outline-variant/60 pb-4">
              {lines.map((l) => (
                <li key={`${l.productId}-${l.interval}`} className="flex justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="text-on-surface">
                      {l.product.name} <span className="tnum text-on-surface-variant">× {l.quantity}</span>
                    </p>
                    <div className="mt-1">
                      <PlanBadge interval={l.interval} />
                    </div>
                  </div>
                  <p className="tnum flex-shrink-0 text-on-surface">{yen(l.unitPrice * l.quantity)}</p>
                </li>
              ))}
            </ul>
            <TotalsTable totals={totals} />
            <div className="mt-4">
              <RecurringSummary lines={lines} firstDelivery={delivery} />
            </div>
            <button
              type="button"
              onClick={placeOrder}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3.5 font-medium text-on-primary transition-opacity hover:opacity-90"
            >
              <Lock className="h-4 w-4" aria-hidden />
              申し込みを確定する
            </button>
            <p className="mt-3 text-center text-[11px] text-on-surface-variant">※ デモのため実際の決済は発生しません</p>
          </div>
        </aside>
      </div>
    </main>
  );
}

type SectionProps = { icon: typeof MapPin; title: string; children: React.ReactNode };

function Section({ icon: Icon, title, children }: SectionProps) {
  return (
    <section className="rounded-lg bg-surface-container-lowest p-5 shadow-elevation-1 ring-1 ring-outline-variant/40">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-on-surface">
        <Icon className="h-4 w-4 text-primary" aria-hidden />
        {title}
      </h2>
      {children}
    </section>
  );
}
