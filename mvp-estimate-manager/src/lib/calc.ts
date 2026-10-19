// 金額計算の純粋関数。node --test から直接読むため、エイリアス import は使わない。

/** 消費税率（%）。デモでは標準税率 10% のみ扱う */
export const TAX_RATE_PERCENT = 10;

interface Priced {
  unitPrice: number;
  quantity: number;
}

export interface Totals {
  subtotal: number;
  tax: number;
  total: number;
}

export function lineAmount(item: Priced): number {
  return item.unitPrice * item.quantity;
}

/** 消費税は請求書単位で1回計算し、1円未満は切り捨てる */
export function calcTotals(items: readonly Priced[]): Totals {
  const subtotal = items.reduce((sum, item) => sum + lineAmount(item), 0);
  const tax = Math.floor((subtotal * TAX_RATE_PERCENT) / 100);
  return { subtotal, tax, total: subtotal + tax };
}

interface Summarizable {
  status: "draft" | "sent" | "won" | "lost";
  items: readonly Priced[];
}

export interface Summary {
  count: Record<Summarizable["status"], number>;
  /** 送付済み（回答待ち）の税込合計 */
  pendingAmount: number;
  /** 受注の税込合計 */
  wonAmount: number;
  /** 受注 ÷（受注＋失注）。決着が0件なら null */
  winRatePercent: number | null;
}

export function summarize(estimates: readonly Summarizable[]): Summary {
  const count = { draft: 0, sent: 0, won: 0, lost: 0 };
  let pendingAmount = 0;
  let wonAmount = 0;
  for (const e of estimates) {
    count[e.status] += 1;
    const { total } = calcTotals(e.items);
    if (e.status === "sent") pendingAmount += total;
    if (e.status === "won") wonAmount += total;
  }
  const decided = count.won + count.lost;
  const winRatePercent = decided === 0 ? null : Math.round((count.won / decided) * 100);
  return { count, pendingAmount, wonAmount, winRatePercent };
}
