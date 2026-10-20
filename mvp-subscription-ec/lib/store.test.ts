// 実行: npm test（node --test。Node 22.18+ / 24 の型ストリップで TS を直接実行する）
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { canSkip, seedState, storeReducer } from './store.ts';
import { PRODUCTS } from './catalog.ts';
import { addDays, addMonths, firstDelivery } from './date.ts';

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

test('スキップは1回だけで、取り消すと元の日付に戻る', () => {
  const state = seedState(TODAY);
  const sub = state.subscriptions[0];
  const skipped = storeReducer(state, { type: 'skip', id: sub.id });
  assert.equal(canSkip(skipped.subscriptions[0]), false);
  assert.deepEqual(storeReducer(skipped, { type: 'skip', id: sub.id }), skipped);
  const undone = storeReducer(skipped, { type: 'unskip', id: sub.id, today: TODAY }).subscriptions[0];
  assert.equal(undone.nextDelivery, sub.nextDelivery);
  assert.equal(canSkip(undone), true);
});

test('お届け間隔を変えると前回お届け日から数え直し、戻すと元の次回日になる', () => {
  const state = seedState(TODAY);
  const sub = state.subscriptions[0];
  const bi = storeReducer(state, { type: 'changeInterval', id: sub.id, interval: 'bimonthly', today: TODAY });
  assert.equal(bi.subscriptions[0].interval, 'bimonthly');
  assert.equal(bi.subscriptions[0].nextDelivery, addMonths(sub.nextDelivery!, 1));
  const back = storeReducer(bi, { type: 'changeInterval', id: sub.id, interval: 'monthly', today: TODAY });
  assert.equal(back.subscriptions[0].nextDelivery, sub.nextDelivery);
});

test('初回前の間隔変更では、約束済みの初回日を動かさない', () => {
  const state = orderedState();
  const sub = state.subscriptions[0];
  const after = storeReducer(state, { type: 'changeInterval', id: sub.id, interval: 'bimonthly', today: TODAY });
  assert.equal(after.subscriptions[0].nextDelivery, firstDelivery(TODAY));
});

test('月末の次回日でも、間隔を往復すると元の次回日に戻る', () => {
  const today = '2027-03-25';
  const state = seedState(today);
  const sub = state.subscriptions[0];
  assert.equal(sub.nextDelivery, '2027-03-31');
  const bi = storeReducer(state, { type: 'changeInterval', id: sub.id, interval: 'bimonthly', today });
  const back = storeReducer(bi, { type: 'changeInterval', id: sub.id, interval: 'monthly', today });
  assert.equal(back.subscriptions[0].nextDelivery, '2027-03-31');
});

test('スキップの取り消しで、過ぎた日付には戻さない', () => {
  const state = seedState(TODAY);
  const sub = state.subscriptions[0];
  const skipped = storeReducer(state, { type: 'skip', id: sub.id });
  const later = addDays(sub.nextDelivery!, 2);
  const undone = storeReducer(skipped, { type: 'unskip', id: sub.id, today: later }).subscriptions[0];
  assert.equal(undone.nextDelivery, firstDelivery(later));
});
