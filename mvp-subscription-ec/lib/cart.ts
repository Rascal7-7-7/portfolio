import type { CartItem, Product, Totals } from './types';
import { findProduct } from './catalog';
import { calcTotals, unitPrice } from './pricing';

export type CartLine = CartItem & { product: Product; unitPrice: number };

export function toCartLines(cart: ReadonlyArray<CartItem>): CartLine[] {
  return cart.flatMap((item) => {
    const product = findProduct(item.productId);
    return product ? [{ ...item, product, unitPrice: unitPrice(product.price, item.interval) }] : [];
  });
}

export function cartTotals(lines: ReadonlyArray<CartLine>): Totals {
  return calcTotals(
    lines.map((l) => ({ price: l.product.price, taxRate: l.product.taxRate, interval: l.interval, quantity: l.quantity })),
  );
}
