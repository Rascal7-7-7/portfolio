// デモの状態遷移（カート・注文・定期便）。すべて新しいオブジェクトを返す純粋関数。
import type { CartItem, Interval, Order, Subscription } from './types';
import { findProduct } from './catalog';
import { addDays, addMonths, firstDelivery, nextAfter } from './date';
import { calcTotals, unitPrice } from './pricing';

export const MAX_QUANTITY = 9;

export type StoreState = {
  cart: CartItem[];
  subscriptions: Subscription[];
  lastOrder: Order | null;
};

export type StoreAction =
  | { type: 'hydrate'; state: StoreState }
  | { type: 'addToCart'; item: CartItem }
  | { type: 'setQuantity'; productId: string; interval: Interval; quantity: number }
  | { type: 'removeFromCart'; productId: string; interval: Interval }
  | { type: 'placeOrder'; today: string; orderId: string }
  | { type: 'skip'; id: string }
  | { type: 'pause'; id: string }
  | { type: 'resume'; id: string; today: string }
  | { type: 'cancel'; id: string }
  | { type: 'reset'; today: string };

const sameLine = (a: Pick<CartItem, 'productId' | 'interval'>, b: Pick<CartItem, 'productId' | 'interval'>) =>
  a.productId === b.productId && a.interval === b.interval;

const clampQty = (n: number) => Math.min(MAX_QUANTITY, Math.max(1, Math.floor(n)));

/** マイページを空にしないための、契約済みデモ定期便 */
export function seedState(today: string): StoreState {
  return {
    cart: [],
    lastOrder: null,
    subscriptions: [
      {
        id: 'SUB-0412',
        productId: 'uji-gyokuro',
        interval: 'monthly',
        quantity: 1,
        unitPrice: unitPrice(findProduct('uji-gyokuro')?.price ?? 0, 'monthly'),
        status: 'active',
        nextDelivery: addDays(today, 6),
        startedAt: addMonths(today, -4),
        deliveredCount: 4,
      },
    ],
  };
}

function updateSub(state: StoreState, id: string, fn: (s: Subscription) => Subscription): StoreState {
  return { ...state, subscriptions: state.subscriptions.map((s) => (s.id === id ? fn(s) : s)) };
}

function placeOrder(state: StoreState, today: string, orderId: string): StoreState {
  const lines = state.cart.flatMap((item) => {
    const product = findProduct(item.productId);
    return product ? [{ item, product }] : [];
  });
  if (lines.length === 0) return state;

  const delivery = firstDelivery(today);
  const totals = calcTotals(
    lines.map(({ item, product }) => ({ price: product.price, taxRate: product.taxRate, interval: item.interval, quantity: item.quantity })),
  );
  const newSubs: Subscription[] = lines.flatMap(({ item, product }, i) =>
    item.interval === 'once'
      ? []
      : [
          {
            id: `SUB-${orderId.slice(-4)}${i + 1}`,
            productId: product.id,
            interval: item.interval,
            quantity: item.quantity,
            unitPrice: unitPrice(product.price, item.interval),
            status: 'active',
            nextDelivery: delivery,
            startedAt: today,
            deliveredCount: 0,
          },
        ],
  );

  const order: Order = {
    id: orderId,
    placedAt: today,
    firstDelivery: delivery,
    totals,
    lines: lines.map(({ item, product }) => ({
      productId: product.id,
      interval: item.interval,
      quantity: item.quantity,
      unitPrice: unitPrice(product.price, item.interval),
    })),
  };

  return { cart: [], lastOrder: order, subscriptions: [...newSubs, ...state.subscriptions] };
}

export function storeReducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case 'hydrate':
      return action.state;
    case 'addToCart': {
      const existing = state.cart.find((i) => sameLine(i, action.item));
      const cart = existing
        ? state.cart.map((i) => (sameLine(i, action.item) ? { ...i, quantity: clampQty(i.quantity + action.item.quantity) } : i))
        : [...state.cart, { ...action.item, quantity: clampQty(action.item.quantity) }];
      return { ...state, cart };
    }
    case 'setQuantity':
      return {
        ...state,
        cart: state.cart.map((i) => (sameLine(i, action) ? { ...i, quantity: clampQty(action.quantity) } : i)),
      };
    case 'removeFromCart':
      return { ...state, cart: state.cart.filter((i) => !sameLine(i, action)) };
    case 'placeOrder':
      return placeOrder(state, action.today, action.orderId);
    case 'skip':
      return updateSub(state, action.id, (s) =>
        s.status === 'active' && s.nextDelivery ? { ...s, nextDelivery: nextAfter(s.nextDelivery, s.interval) } : s,
      );
    case 'pause':
      return updateSub(state, action.id, (s) => (s.status === 'active' ? { ...s, status: 'paused', nextDelivery: null } : s));
    case 'resume':
      return updateSub(state, action.id, (s) =>
        s.status === 'paused' ? { ...s, status: 'active', nextDelivery: firstDelivery(action.today) } : s,
      );
    case 'cancel':
      return updateSub(state, action.id, (s) => ({ ...s, status: 'canceled', nextDelivery: null }));
    case 'reset':
      return seedState(action.today);
  }
}

/** localStorage から読んだ値の最低限の形チェック */
export function isStoreState(value: unknown): value is StoreState {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return Array.isArray(v.cart) && Array.isArray(v.subscriptions) && 'lastOrder' in v;
}
