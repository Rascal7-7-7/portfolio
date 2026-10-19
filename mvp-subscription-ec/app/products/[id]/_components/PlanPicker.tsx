'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
    <div>
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-on-surface">購入方法を選ぶ</legend>
        <div className="divide-y divide-outline-variant/60 border-y border-outline-variant/60">
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
          <div className="grid grid-cols-2 gap-2">
            {SUBSCRIPTION_INTERVALS.map((value) => (
              <label
                key={value}
                className={cn(
                  'cursor-pointer rounded-sm px-3 py-2.5 text-center text-sm ring-1 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary',
                  frequency === value
                    ? 'font-semibold text-on-surface ring-2 ring-on-surface'
                    : 'text-on-surface-variant ring-outline-variant hover:ring-outline',
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
        className="mt-4 flex w-full items-center justify-center rounded-sm bg-primary py-3.5 text-base font-medium text-on-primary transition-opacity hover:opacity-90"
      >
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
      className="flex cursor-pointer items-start gap-3 py-4 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary"
    >
      <input type="radio" name="purchase-mode" checked={checked} onChange={onSelect} className="sr-only" />
      <span
        aria-hidden
        className={cn(
          'mt-0.5 flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border',
          checked ? 'border-on-surface' : 'border-on-surface-variant',
        )}
      >
        {checked && <span className="h-2.5 w-2.5 rounded-full bg-on-surface" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-on-surface">{title}</span>
          {tag && <span className="text-xs text-on-surface-variant">{tag}</span>}
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
