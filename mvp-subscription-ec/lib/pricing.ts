// 金額計算はここに集約する（税込価格ベース）。
// node --test で直接読めるよう、型以外の import は持たない。
import type { Interval, Subscription, SubscriptionInterval, TaxRate, Totals } from './types';

export const SUBSCRIPTION_DISCOUNT_RATE = 0.1;
export const SHIPPING_FEE = 660;
export const FREE_SHIPPING_THRESHOLD = 5000;
const SHIPPING_TAX_RATE: TaxRate = 10;

export type PricingLine = {
  price: number;
  taxRate: TaxRate;
  interval: Interval;
  quantity: number;
};

/** 定期便は10%OFF。割引額の1円未満は切り捨てる */
export function unitPrice(price: number, interval: Interval): number {
  if (interval === 'once') return price;
  return price - Math.floor(price * SUBSCRIPTION_DISCOUNT_RATE);
}

/** 税込金額に含まれる消費税額（切り捨て） */
export function includedTax(amount: number, rate: TaxRate): number {
  return Math.floor((amount * rate) / (100 + rate));
}

/** 定期便を含む注文、または小計が基準額以上なら送料無料 */
export function shippingFee(subtotal: number, hasSubscription: boolean): number {
  if (subtotal === 0) return 0;
  if (hasSubscription || subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return SHIPPING_FEE;
}

export function calcTotals(lines: ReadonlyArray<PricingLine>): Totals {
  const listSubtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const subtotal = lines.reduce((sum, l) => sum + unitPrice(l.price, l.interval) * l.quantity, 0);
  const hasSubscription = lines.some((l) => l.interval !== 'once');
  const shipping = shippingFee(subtotal, hasSubscription);

  const amountByRate = lines.reduce<Record<TaxRate, number>>(
    (acc, l) => ({ ...acc, [l.taxRate]: acc[l.taxRate] + unitPrice(l.price, l.interval) * l.quantity }),
    { 8: 0, 10: shipping },
  );

  return {
    listSubtotal,
    discount: listSubtotal - subtotal,
    subtotal,
    shipping,
    total: subtotal + shipping,
    taxByRate: { 8: includedTax(amountByRate[8], 8), 10: includedTax(amountByRate[10], SHIPPING_TAX_RATE) },
  };
}

/** 送料無料まであといくらか（定期便を含む場合は 0） */
export function remainingForFreeShipping(subtotal: number, hasSubscription: boolean): number {
  if (hasSubscription) return 0;
  return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
}

// date.ts にも同じ対応表がある。node --test で値 import を持てないためここにも置く。
const MONTHS_PER_INTERVAL: Record<SubscriptionInterval, number> = { monthly: 1, bimonthly: 2 };

/** 定期便の月あたり金額の目安（2ヶ月ごと便は半額換算、1円未満は四捨五入） */
export function monthlyEquivalent(subs: ReadonlyArray<Pick<Subscription, 'interval' | 'unitPrice' | 'quantity'>>): number {
  return Math.round(subs.reduce((sum, s) => sum + (s.unitPrice * s.quantity) / MONTHS_PER_INTERVAL[s.interval], 0));
}

/** 合計欄の「うち消費税」に並べる行。0 円の税率は出さない */
export function taxLines(taxByRate: Record<TaxRate, number>): Array<{ rate: TaxRate; amount: number }> {
  return ([8, 10] as const).filter((rate) => taxByRate[rate] > 0).map((rate) => ({ rate, amount: taxByRate[rate] }));
}

export function yen(amount: number): string {
  return `¥${amount.toLocaleString('ja-JP')}`;
}
