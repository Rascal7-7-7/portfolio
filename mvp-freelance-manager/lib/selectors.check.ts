// 集計ロジックの最小チェック: `npm run check`（Node 24 の型除去で直接実行）
import assert from "node:assert/strict";
import { addDays, diffDays, shiftMonth } from "./dates.ts";
import { createSeed } from "./seed.ts";
import { dashboardSummary, invoiceStatus, monthlyRevenue, taskGroup } from "./selectors.ts";

const today = "2026-03-01";
assert.equal(addDays(today, -1), "2026-02-28");
assert.equal(diffDays(today, "2026-03-04"), 3);
assert.equal(shiftMonth("2026-01-31", -1), "2025-12");

const data = createSeed(today);
const revenue = monthlyRevenue(data.invoices, today);
assert.equal(revenue.length, 6);
assert.equal(revenue[5].month, "2026-03");
assert.ok(revenue.every((m) => m.paid > 0), "ダミーデータは毎月入金がある");

const summary = dashboardSummary(data, today);
assert.equal(summary.thisMonthPaid, revenue[5].paid);
assert.equal(summary.outstandingCount, 3);
assert.equal(summary.overdueCount, 1);
assert.ok(summary.todayTaskCount >= summary.overdueTaskCount);

const base = { id: "x", number: "INV", projectId: "p1", amount: 1, issuedOn: today };
assert.equal(invoiceStatus({ ...base, dueOn: addDays(today, -1), paidOn: null }, today), "overdue");
assert.equal(invoiceStatus({ ...base, dueOn: today, paidOn: null }, today), "unpaid");
assert.equal(invoiceStatus({ ...base, dueOn: today, paidOn: today }, today), "paid");
assert.equal(
  taskGroup({ id: "t", projectId: "p1", title: "", dueDate: today, done: false }, today),
  "today",
);

console.log("selectors.check: ok");
