import { test } from "node:test";
import assert from "node:assert/strict";
import { calcTotals, lineAmount, monthlyWon, summarize } from "./calc.ts";
import { hikaeInvoiceNumber, hikaeInvoiceUrl } from "./utils.ts";

test("Hikae の請求書リンクは連携済みの EST-0014 だけ", () => {
  assert.equal(hikaeInvoiceUrl(14), "https://mvp-freelance-manager.vercel.app/invoices/est-0014");
  assert.equal(hikaeInvoiceUrl(13), null);
  assert.equal(hikaeInvoiceNumber(14), "INV-0017");
  assert.equal(hikaeInvoiceNumber(13), null);
});

test("月別受注額は直近Nヶ月を古い順に、受注のみ・年またぎで集計", () => {
  const item = [{ unitPrice: 1000, quantity: 1 }];
  const result = monthlyWon(
    [
      { status: "won", issuedAt: "2026-01-10", items: item },
      { status: "won", issuedAt: "2026-01-20", items: item },
      { status: "won", issuedAt: "2025-12-31", items: item },
      { status: "lost", issuedAt: "2026-01-05", items: item },
      { status: "won", issuedAt: "2025-10-01", items: item }, // 範囲外
    ],
    "2026-01-15",
    3,
  );
  assert.deepEqual(result, [
    { month: "2025-11", amount: 0 },
    { month: "2025-12", amount: 1100 },
    { month: "2026-01", amount: 2200 },
  ]);
});

test("明細金額は単価×数量", () => {
  assert.equal(lineAmount({ unitPrice: 45000, quantity: 3 }), 135000);
});

test("小数の数量（㎡・m など）は明細ごとに1円未満を四捨五入", () => {
  assert.equal(lineAmount({ unitPrice: 3800, quantity: 12.5 }), 47500);
  assert.equal(lineAmount({ unitPrice: 333, quantity: 1.5 }), 500); // 499.5 → 500
  assert.equal(lineAmount({ unitPrice: 1999, quantity: 1.15 }), 2299); // 2298.85 → 2299
  assert.equal(lineAmount({ unitPrice: 100, quantity: 0.35 }), 35); // 浮動小数の誤差を出さない
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
