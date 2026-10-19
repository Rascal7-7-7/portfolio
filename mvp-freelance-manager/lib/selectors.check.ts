// 集計ロジックの最小チェック: `npm run check`（Node 24 の型除去で直接実行）
import assert from "node:assert/strict";
import { addDays, diffDays, formatAgo, formatInputDate, shiftMonth } from "./dates.ts";
import { createSeed, ESTIMATE_INVOICE_ID } from "./seed.ts";
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
import { estimateUrl, formatYen, taxIncluded, toDigits } from "./utils.ts";

const today = "2026-03-01";
assert.equal(addDays(today, -1), "2026-02-28");
assert.equal(toDigits("２２0,000円"), "220000");
assert.equal(toDigits("00"), "");
assert.equal(diffDays(today, "2026-03-04"), 3);
assert.equal(shiftMonth("2026-01-31", -1), "2025-12");

const data = createSeed(today);
const revenue = monthlyRevenue(data.invoices, today);
assert.equal(revenue.length, 6);
assert.equal(revenue[5].month, "2026-03");
assert.ok(revenue.every((m) => m.paid > 0), "ダミーデータは毎月入金がある");

const summary = dashboardSummary(data, today);
assert.equal(summary.thisMonthPaid, revenue[5].paid);
assert.equal(summary.outstandingCount, 4);
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

// アクティビティは新しい順、相対時刻・和式日付
const activity = projectActivity("p1", data);
assert.ok(activity.length > 0);
assert.ok(activity.every((a, i) => i === 0 || activity[i - 1].date >= a.date), "新しい順");
assert.ok(activity.some((a) => a.text.startsWith("請求書 INV-")));
assert.equal(formatAgo(today, today), "今日");
assert.equal(formatAgo(today, addDays(today, -3)), "3日前");
assert.equal(formatInputDate("2026-10-20"), "2026年10月20日（火）");

// シリーズの約束事（見積管理・予約管理と値を合わせる）
const fromEstimate = data.invoices.find((i) => i.id === ESTIMATE_INVOICE_ID);
assert.ok(fromEstimate, "est-0014 の請求がある");
assert.equal(fromEstimate.amount, 1_243_000);
assert.equal(fromEstimate.paidOn, null);
assert.equal(fromEstimate.estimateNo, "EST-0014");
assert.equal(diffDays(today, fromEstimate.dueOn), 30);
const minato = data.projects.find((p) => p.id === fromEstimate.projectId);
assert.equal(minato?.client, "株式会社みなと不動産");
assert.equal(minato?.name, "コーポレートサイト リニューアル");
assert.equal(minato?.amount, 1_243_000);
assert.equal(minato?.status, "in_progress");
assert.equal(estimateUrl("EST-0014"), "https://mvp-estimate-manager.vercel.app/estimates/14");
assert.equal(data.projects.find((p) => p.name === "予約管理システム開発")?.client, "Hair Salon Lien 表参道店");
assert.ok(!data.projects.some((p) => p.client.includes("ミナト")), "紛らわしい取引先名を残さない");
assert.equal(new Set(data.invoices.map((i) => i.number)).size, data.invoices.length, "請求番号は重複しない");

// 明細の合計（税抜）＋消費税 = 請求額。seed の請求はすべて 2〜4 行の明細を持つ
for (const i of data.invoices) {
  assert.ok(i.items && i.items.length >= 2 && i.items.length <= 4, `${i.number}: 明細は 2〜4 行`);
  assert.equal(i.items.reduce((sum, it) => sum + it.amount, 0) + taxIncluded(i.amount), i.amount, `${i.number}: 明細の合計がずれている`);
}

// 「請求と回収」の残り = グラフに出る未入金（今月以前が期日）＋ 来月以降が期日の分
const charted = data.invoices.filter((i) => !i.paidOn && i.dueOn.slice(0, 7) <= revenue[5].month).reduce((sum, i) => sum + i.amount, 0);
assert.equal(charted + summary.laterDueTotal, summary.outstandingTotal);
const later = dashboardSummary(createSeed("2026-10-19"), "2026-10-19").laterDueTotal;
assert.ok(later >= 1_243_000, "10/19 なら est-0014（11/18 期日）は来月以降の分に入る");

console.log("selectors.check: ok");
