'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ShoppingBag } from 'lucide-react';
import type { Interval, Product, SubscriptionInterval } from '@/lib/types';
import { INTERVAL_LABEL, SUBSCRIPTION_INTERVALS } from '@/lib/catalog';
import { unitPrice, yen } from '@/lib/pricing';
import { useStore } from '@/components/StoreProvider';
import { QuantityStepper } from '@/components/QuantityStepper';
import { cn } from '@/lib/cn';

type Mode = 'subscription' | 'once';

export function PlanPicker({ product }: { product: Product }) {
  const { dispatch } = useStore();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('subscription');
  const [frequency, setFrequency] = useState<SubscriptionInterval>('monthly');
  const [quantity, setQuantity] = useState(1);

  const interval: Interval = mode === 'once' ? 'once' : frequency;
  const price = unitPrice(product.price, interval);
  const saving = product.price - unitPrice(product.price, 'monthly');

  const addToCart = () => {
    dispatch({ type: 'addToCart', item: { productId: product.id, interval, quantity } });
    router.push('/cart');
  };

  return (
    <div className="rounded-lg bg-surface-container-lowest p-4 shadow-elevation-2 ring-1 ring-outline-variant/40 sm:p-5">
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-on-surface">購入方法を選ぶ</legend>
        <div className="space-y-2.5">
          <PlanOption
            checked={mode === 'subscription'}
            onSelect={() => setMode('subscription')}
            title="定期便"
            tag="10%OFF・送料無料"
            note={`1回あたり ${yen(saving)} おトク。スキップ・解約はいつでも。`}
            price={unitPrice(product.price, 'monthly')}
            listPrice={product.price}
          />
          <PlanOption
            checked={mode === 'once'}
            onSelect={() => setMode('once')}
            title="今回のみ購入"
            note="5,000円以上で送料無料（未満は660円）"
            price={product.price}
          />
        </div>
      </fieldset>

      {mode === 'subscription' && (
        <fieldset className="mt-5">
          <legend className="mb-2 text-sm font-semibold text-on-surface">お届け間隔</legend>
          <div className="grid grid-cols-2 gap-1 rounded-md bg-surface-container p-1">
            {SUBSCRIPTION_INTERVALS.map((value) => (
              <label
                key={value}
                className={cn(
                  'cursor-pointer rounded px-3 py-2 text-center text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary',
                  frequency === value
                    ? 'bg-surface-container-lowest font-semibold text-on-surface shadow-elevation-1'
                    : 'text-on-surface-variant hover:text-on-surface',
                )}
              >
                <input
                  type="radio"
                  name="frequency"
                  value={value}
                  checked={frequency === value}
                  onChange={() => setFrequency(value)}
                  className="sr-only"
                />
                {INTERVAL_LABEL[value]}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="mt-5 flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-on-surface" id="qty-label">
          数量
        </span>
        <QuantityStepper value={quantity} onChange={setQuantity} labelledBy="qty-label" />
      </div>

      <div className="mt-5 flex items-baseline justify-between border-t border-outline-variant/50 pt-4">
        <span className="text-sm text-on-surface-variant">
          {mode === 'subscription' ? `${INTERVAL_LABEL[frequency]}・1回のお支払い` : 'お支払い'}
        </span>
        <span className="tnum font-headline text-2xl font-semibold text-on-surface">
          {yen(price * quantity)}
          <span className="ml-1 text-xs font-normal text-on-surface-variant">税込</span>
        </span>
      </div>

      <button
        type="button"
        onClick={addToCart}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3.5 text-base font-medium text-on-primary transition-opacity hover:opacity-90"
      >
        <ShoppingBag className="h-5 w-5" aria-hidden />
        {mode === 'subscription' ? '定期便をカートに入れる' : 'カートに入れる'}
      </button>
    </div>
  );
}

type PlanOptionProps = {
  checked: boolean;
  onSelect: () => void;
  title: string;
  tag?: string;
  note: string;
  price: number;
  listPrice?: number;
};

function PlanOption({ checked, onSelect, title, tag, note, price, listPrice }: PlanOptionProps) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-start gap-3 rounded-md p-4 ring-1 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary',
        checked ? 'bg-primary/5 ring-2 ring-primary' : 'ring-outline-variant hover:ring-outline',
      )}
    >
      <input type="radio" name="purchase-mode" checked={checked} onChange={onSelect} className="sr-only" />
      <span
        aria-hidden
        className={cn(
          'mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2',
          checked ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant',
        )}
      >
        {checked && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-on-surface">{title}</span>
          {tag && <span className="rounded bg-primary px-1.5 py-0.5 text-[11px] font-medium text-on-primary">{tag}</span>}
        </span>
        <span className="mt-1 block text-xs leading-relaxed text-on-surface-variant">{note}</span>
      </span>
      <span className="tnum text-right">
        <span className="block font-headline text-lg font-semibold text-on-surface">{yen(price)}</span>
        {listPrice && <span className="block text-xs text-on-surface-variant line-through">{yen(listPrice)}</span>}
      </span>
    </label>
  );
}
