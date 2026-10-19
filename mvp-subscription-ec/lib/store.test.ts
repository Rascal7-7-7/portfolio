// 実行: npm test（node --test。Node 22.18+ / 24 の型ストリップで TS を直接実行する）
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { canSkip, seedState, storeReducer } from './store.ts';
import { PRODUCTS } from './catalog.ts';
import { addMonths, firstDelivery } from './date.ts';

const TODAY = '2026-10-19';

function orderedState() {
  const withCart = storeReducer(seedState(TODAY), {
    type: 'addToCart',
    item: { productId: 'forest-roast', interval: 'monthly', quantity: 1 },
  });
  return storeReducer(withCart, { type: 'placeOrder', today: TODAY, orderId: 'ORD-0001' });
}

test('注文直後の定期便は初回をスキップできない（完了画面で約束した日付を守る）', () => {
  const state = orderedState();
  const sub = state.subscriptions[0];
  assert.equal(sub.deliveredCount, 0);
  assert.equal(sub.nextDelivery, firstDelivery(TODAY));
  assert.equal(canSkip(sub), false);

  const after = storeReducer(state, { type: 'skip', id: sub.id });
  assert.equal(after.subscriptions[0].nextDelivery, firstDelivery(TODAY));
});

test('2回目以降はスキップで次回が1間隔ぶん先へ動く', () => {
  const state = seedState(TODAY);
  const sub = state.subscriptions[0];
  assert.equal(canSkip(sub), true);
  const after = storeReducer(state, { type: 'skip', id: sub.id });
  assert.equal(after.subscriptions[0].nextDelivery, addMonths(sub.nextDelivery!, 1));
});

test('デモ定期便の開始日は、お届け回数と次回日から逆算した日付になる', () => {
  const sub = seedState(TODAY).subscriptions[0];
  assert.ok(sub.startedAt < TODAY);
  assert.equal(addMonths(firstDelivery(sub.startedAt), sub.deliveredCount), sub.nextDelivery);
});

test('商品名の文節（nameParts）をつなぐと商品名に一致する', () => {
  for (const p of PRODUCTS) assert.equal(p.nameParts.join(''), p.name);
});
