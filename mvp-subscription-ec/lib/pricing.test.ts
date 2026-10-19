// 実行: npm test（node --test。Node 22.18+ / 24 の型ストリップで TS を直接実行する）
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calcTotals, includedTax, remainingForFreeShipping, unitPrice } from './pricing.ts';
import { addMonths, firstDelivery, formatJa, nextAfter } from './date.ts';

test('定期便は10%OFF、単品は定価', () => {
  assert.equal(unitPrice(2480, 'once'), 2480);
  assert.equal(unitPrice(2480, 'monthly'), 2232);
  assert.equal(unitPrice(1625, 'bimonthly'), 1463); // 割引 162.5 → 162 円
});

test('税込金額から内税を切り捨てで出す', () => {
  assert.equal(includedTax(1080, 8), 80);
  assert.equal(includedTax(1100, 10), 100);
  assert.equal(includedTax(2232, 8), 165);
});

test('単品のみ・5,000円未満は送料660円（送料は10%対象）', () => {
  const t = calcTotals([{ price: 1620, taxRate: 8, interval: 'once', quantity: 2 }]);
  assert.equal(t.subtotal, 3240);
  assert.equal(t.discount, 0);
  assert.equal(t.shipping, 660);
  assert.equal(t.total, 3900);
  assert.deepEqual(t.taxByRate, { 8: 240, 10: 60 });
  assert.equal(remainingForFreeShipping(t.subtotal, false), 1760);
});

test('定期便を含むと送料無料・割引額を表示用に返す', () => {
  const t = calcTotals([
    { price: 2480, taxRate: 8, interval: 'monthly', quantity: 1 },
    { price: 3960, taxRate: 10, interval: 'once', quantity: 1 },
  ]);
  assert.equal(t.listSubtotal, 6440);
  assert.equal(t.discount, 248);
  assert.equal(t.subtotal, 6192);
  assert.equal(t.shipping, 0);
  assert.equal(t.total, 6192);
  assert.deepEqual(t.taxByRate, { 8: 165, 10: 360 });
});

test('単品でも5,000円以上は送料無料、空カートは0円', () => {
  assert.equal(calcTotals([{ price: 5000, taxRate: 10, interval: 'once', quantity: 1 }]).shipping, 0);
  assert.equal(calcTotals([]).total, 0);
});

test('お届け日：初回は3日後、スキップは間隔ぶん先へ（月末は丸める）', () => {
  assert.equal(firstDelivery('2026-10-30'), '2026-11-02');
  assert.equal(nextAfter('2026-11-02', 'monthly'), '2026-12-02');
  assert.equal(nextAfter('2026-12-15', 'bimonthly'), '2027-02-15');
  assert.equal(addMonths('2027-01-31', 1), '2027-02-28');
  assert.equal(formatJa('2026-11-02'), '11月2日(月)');
});
