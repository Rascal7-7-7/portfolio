// 集計ロジックの最小チェック: `npm run check`（Node 24 の型除去で直接実行）
import assert from "node:assert/strict";
import { addDays, diffDays, formatAgo, formatInputDate, shiftMonth } from "./dates.ts";
import { createSeed } from "./seed.ts";
import {
  dashboardSummary,
  invoiceStatus,
  monthlyRevenue,
  projectActivity,
  projectProgress,
  remainingBillable,
  sortInvoices,
  taskGroup,
} from "./selectors.ts";
import { clientInitial, formatYen } from "./utils.ts";

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

for (const p of data.projects) {
  const prog = projectProgress(p, data);
  assert.ok(prog.invoiced <= p.amount, `${p.name}: 請求額が受注額を超えている`);
}

const base = { id: "x", number: "INV", projectId: "p1", amount: 1, issuedOn: today };
assert.equal(invoiceStatus({ ...base, dueOn: addDays(today, -1), paidOn: null }, today), "overdue");
assert.equal(invoiceStatus({ ...base, dueOn: today, paidOn: null }, today), "unpaid");
assert.equal(invoiceStatus({ ...base, dueOn: today, paidOn: today }, today), "paid");
assert.equal(
  taskGroup({ id: "t", projectId: "p1", title: "", dueDate: today, done: false }, today),
  "today",
);

// 請求の初期金額 = 受注額 − 既存の請求額合計（一部請求済みの案件で過大請求しない）
const proj = { id: "p1", name: "", client: "", amount: 500_000, status: "in_progress" as const, dueDate: today };
const inv = (id: string, projectId: string, amount: number, dueOn: string, paidOn: string | null) =>
  ({ id, number: id, projectId, amount, issuedOn: today, dueOn, paidOn });
assert.equal(remainingBillable(proj, []), 500_000);
assert.equal(remainingBillable(proj, [inv("a", "p1", 200_000, today, today), inv("b", "p2", 999, today, null)]), 300_000);
assert.ok(remainingBillable(proj, [inv("a", "p1", 500_000, today, null)]) <= 0, "全額請求済みなら作成不可");
for (const p of data.projects) {
  assert.equal(remainingBillable(p, data.invoices), p.amount - projectProgress(p, data).invoiced);
}

// 一覧は期限超過を先頭に
const sorted = sortInvoices(
  [inv("paid", "p1", 1, today, today), inv("later", "p1", 1, addDays(today, 9), null),
   inv("soon", "p1", 1, addDays(today, 2), null), inv("over", "p1", 1, addDays(today, -3), null)],
  today,
);
assert.deepEqual(sorted.map((i) => i.id), ["over", "soon", "later", "paid"]);
assert.equal(sortInvoices(data.invoices, today)[0].id, data.invoices.find((i) => invoiceStatus(i, today) === "overdue")?.id);

assert.equal(summary.overdueTotal <= summary.outstandingTotal, true);
assert.equal(formatYen(1_234_000), "¥1,234,000");

// アクティビティは新しい順、相対時刻・和式日付・アバター頭文字
const activity = projectActivity("p1", data);
assert.ok(activity.length > 0);
assert.ok(activity.every((a, i) => i === 0 || activity[i - 1].date >= a.date), "新しい順");
assert.ok(activity.some((a) => a.text.startsWith("請求書 INV-")));
assert.equal(formatAgo(today, today), "今日");
assert.equal(formatAgo(today, addDays(today, -3)), "3日前");
assert.equal(formatInputDate("2026-10-20"), "2026年10月20日（火）");
assert.equal(clientInitial("株式会社ミナトデザイン工房"), "ミ");
assert.equal(clientInitial("カフェ ソラノイロ"), "カ");
assert.equal(clientInitial("Acme Inc."), "AC");

console.log("selectors.check: ok");
