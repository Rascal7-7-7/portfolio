import { test } from "node:test";
import assert from "node:assert/strict";
import { calcTotals, lineAmount, summarize } from "./calc.ts";

test("明細金額は単価×数量", () => {
  assert.equal(lineAmount({ unitPrice: 45000, quantity: 3 }), 135000);
});

test("小計・消費税10%・合計", () => {
  const totals = calcTotals([
    { unitPrice: 300000, quantity: 1 },
    { unitPrice: 45000, quantity: 3 },
  ]);
  assert.deepEqual(totals, { subtotal: 435000, tax: 43500, total: 478500 });
});

test("消費税の1円未満は切り捨て", () => {
  assert.deepEqual(calcTotals([{ unitPrice: 1999, quantity: 1 }]), {
    subtotal: 1999,
    tax: 199,
    total: 2198,
  });
});

test("明細が空なら0円", () => {
  assert.deepEqual(calcTotals([]), { subtotal: 0, tax: 0, total: 0 });
});

test("集計: 受注率と金額", () => {
  const item = [{ unitPrice: 10000, quantity: 1 }];
  const s = summarize([
    { status: "won", items: item },
    { status: "lost", items: item },
    { status: "won", items: item },
    { status: "sent", items: item },
    { status: "draft", items: item },
  ]);
  assert.equal(s.winRatePercent, 67);
  assert.equal(s.wonAmount, 22000);
  assert.equal(s.pendingAmount, 11000);
  assert.deepEqual(s.count, { draft: 1, sent: 1, won: 2, lost: 1 });
});

test("集計: 決着0件なら受注率は null", () => {
  assert.equal(summarize([]).winRatePercent, null);
});
