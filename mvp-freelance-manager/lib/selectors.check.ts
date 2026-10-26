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
assert.equal(summary.laterDueCount + summary.overdueCount <= 3, true, "下書きの est-0014 は未入金に数えない");
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
for (const p of data.projects.filter((x) => x.id !== "p11")) {
  assert.equal(remainingBillable(p, data.invoices), p.amount - projectProgress(p, data).invoiced);
}
// 下書きは請求済に数えないが、二重請求しないよう請求できる残額からは引く
const p11 = data.projects.find((p) => p.id === "p11")!;
assert.equal(projectProgress(p11, data).invoiced, 0);
assert.equal(remainingBillable(p11, data.invoices), 0);

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
assert.equal(fromEstimate.draft, true, "見積管理の初期状態（EST-0014 は送付済み・未承認）に合わせて下書き");
assert.equal(invoiceStatus(fromEstimate, today), "draft");
assert.equal(fromEstimate.estimateNo, "EST-0014");
assert.equal(fromEstimate.number, "INV-0017", "見積管理 src/lib/utils.ts の HIKAE_INVOICE_NUMBERS と一致");
assert.equal(fromEstimate.issuedOn, today);
assert.equal(createSeed("2026-10-20").invoices.find((i) => i.id === ESTIMATE_INVOICE_ID)?.dueOn, "2026-11-30", "納品月末締め翌月末払い");
assert.equal(createSeed("2026-12-15").invoices.find((i) => i.id === ESTIMATE_INVOICE_ID)?.dueOn, "2027-01-31", "年をまたいでも翌月末");
const minato = data.projects.find((p) => p.id === fromEstimate.projectId);
assert.equal(minato?.client, "株式会社みなと不動産");
assert.equal(minato?.name, "コーポレートサイト リニューアル");
assert.equal(minato?.amount, 1_243_000);
assert.equal(minato?.status, "in_progress");
assert.equal(estimateUrl("EST-0014"), "https://mvp-estimate-manager.vercel.app/estimates/14");
assert.equal(data.projects.find((p) => p.name === "予約管理システム開発")?.client, "Hair Salon Lien 表参道店");
assert.ok(!data.projects.some((p) => p.client.includes("ミナト")), "紛らわしい取引先名を残さない");
assert.equal(new Set(data.invoices.map((i) => i.number)).size, data.invoices.length, "請求番号は重複しない");

// EST-0014 と同じ明細（単価 × 数量 = 金額）
assert.deepEqual(
  fromEstimate.items?.map((it) => [it.name, it.qty, it.unitPrice, it.amount]),
  [
    ["Webサイト設計・ディレクション", "1 式", 180_000, 180_000],
    ["ページデザイン", "8 ページ", 45_000, 360_000],
    ["コーディング（レスポンシブ対応）", "8 ページ", 30_000, 240_000],
    ["物件検索機能 開発", "1 式", 350_000, 350_000],
  ],
);

// 明細の合計（税抜）＋消費税 = 請求額。seed の請求はすべて 2〜4 行の明細を持つ
for (const i of data.invoices) {
  for (const it of i.items ?? []) assert.equal(it.unitPrice * Number.parseInt(it.qty), it.amount, `${i.number}: 単価×数量`);
  assert.ok(i.items && i.items.length >= 2 && i.items.length <= 4, `${i.number}: 明細は 2〜4 行`);
  assert.equal(i.items.reduce((sum, it) => sum + it.amount, 0) + taxIncluded(i.amount), i.amount, `${i.number}: 明細の合計がずれている`);
}

// ダッシュボードの集計（10/26 時点の seed で実際の数字を固定する）
const day = "2026-10-26";
const seed = createSeed(day);
const before = dashboardSummary(seed, day);
assert.deepEqual(
  [before.thisMonthDueTotal, before.thisMonthDuePaid, before.overdueTotal, before.laterDueTotal, before.outstandingTotal],
  [620_000, 400_000, 220_000, 290_000, 510_000],
  "承認前: 下書きの est-0014 は集計に入らない",
);
const approved = { ...seed, invoices: seed.invoices.map((i) => (i.id === ESTIMATE_INVOICE_ID ? { ...i, draft: false } : i)) };
const after = dashboardSummary(approved, day);
assert.equal(after.laterDueTotal, before.laterDueTotal + 1_243_000, "承認後: 翌月末期日なので今後の入金予定に入る");
assert.equal(after.thisMonthDueTotal, before.thisMonthDueTotal);
assert.equal(after.outstandingTotal, before.outstandingTotal + 1_243_000);
assert.equal(monthlyRevenue(seed.invoices, day).at(-1)?.expected, monthlyRevenue(approved.invoices, day).at(-1)?.expected);
// 未入金の合計 = 期限超過 + 今月期日の残り（10/26 時点では期限超過も今月期日なので残りに含まれる）+ 今後の入金予定
for (const x of [before, after]) {
  assert.equal(x.thisMonthDueTotal - x.thisMonthDuePaid + x.laterDueTotal, x.outstandingTotal);
}

console.log("selectors.check: ok");
