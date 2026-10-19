import type { AppData, Invoice, ISODate, Project, Task } from "@/types";
import { addDays, parseISODate, shiftMonth } from "./dates.ts";

/** offset ヶ月前の day 日。今月分は今日を越えないように丸める */
function dayInMonth(today: ISODate, offset: number, day: number): ISODate {
  const key = shiftMonth(today, offset);
  const safeDay = offset === 0 ? Math.min(day, parseISODate(today).getDate()) : day;
  return `${key}-${String(safeDay).padStart(2, "0")}`;
}

function projects(today: ISODate): Project[] {
  const d = (n: number) => addDays(today, n);
  return [
    { id: "p1", name: "コーポレートサイトリニューアル", client: "株式会社ミナトデザイン工房", amount: 880_000, status: "in_progress", dueDate: d(18) },
    { id: "p2", name: "予約管理システム開発", client: "整体院こもれび", amount: 1_200_000, status: "in_progress", dueDate: d(32) },
    { id: "p3", name: "採用LP制作", client: "株式会社アオバ物流", amount: 360_000, status: "in_progress", dueDate: d(6) },
    { id: "p4", name: "ECサイト保守（月額）", client: "有限会社まるやま茶園", amount: 110_000, status: "in_progress", dueDate: d(12) },
    { id: "p5", name: "社内ポータル改修", client: "北斗建設株式会社", amount: 640_000, status: "estimate", dueDate: d(45) },
    { id: "p6", name: "ブランドサイト制作", client: "ベーカリー麦と陽", amount: 420_000, status: "estimate", dueDate: d(40) },
    { id: "p7", name: "会員アプリUI設計", client: "株式会社リンクスフィット", amount: 750_000, status: "completed", dueDate: d(-24) },
    { id: "p8", name: "秋キャンペーンLP", client: "株式会社ミナトデザイン工房", amount: 280_000, status: "completed", dueDate: d(-120) },
    { id: "p9", name: "多言語観光サイト構築", client: "おもてなし観光協会", amount: 950_000, status: "lost", dueDate: d(-10) },
    { id: "p10", name: "店舗サイト制作", client: "カフェ ソラノイロ", amount: 330_000, status: "completed", dueDate: d(-150) },
  ];
}

function tasks(today: ISODate): Task[] {
  const d = (n: number) => addDays(today, n);
  const rows: [string, string, number, boolean][] = [
    ["p1", "トップページのデザイン修正（2回目）", -1, false],
    ["p1", "中間金の入金確認と先方への連絡", 0, false],
    ["p1", "下層ページのコーディング", 3, false],
    ["p1", "公開前チェックリストの確認", 14, false],
    ["p1", "デザインカンプ提出", -6, true],
    ["p2", "予約カレンダー画面の実装", 0, false],
    ["p2", "管理画面の要件すり合わせ", 0, true],
    ["p2", "通知メール文面の確認依頼", 2, false],
    ["p2", "DB設計レビュー", -8, true],
    ["p3", "求人原稿の最終確認を依頼", 0, false],
    ["p3", "撮影素材の受け取り", 1, false],
    ["p3", "OGP画像の作成", 4, false],
    ["p4", "新茶ページの差し替え", 5, false],
    ["p4", "月次アクセスレポート作成", 9, false],
    ["p5", "見積書の提出", 2, false],
    ["p5", "ヒアリング議事録のまとめ", -2, true],
    ["p6", "提案資料の作成", 7, false],
  ];
  return rows.map(([projectId, title, offset, done], i) => ({
    id: `t${i + 1}`,
    projectId,
    title,
    dueDate: d(offset),
    done,
  }));
}

function invoices(today: ISODate): Invoice[] {
  const m = (offset: number, day: number) => dayInMonth(today, offset, day);
  const paid: [string, number, ISODate][] = [
    ["p10", 330_000, m(-5, 10)],
    ["p4", 110_000, m(-5, 27)],
    ["p7", 375_000, m(-4, 8)],
    ["p8", 280_000, m(-4, 20)],
    ["p4", 110_000, m(-4, 27)],
    ["p1", 440_000, m(-3, 15)],
    ["p4", 110_000, m(-3, 27)],
    ["p2", 400_000, m(-2, 12)],
    ["p4", 110_000, m(-2, 27)],
    ["p3", 180_000, m(-1, 9)],
    ["p7", 375_000, m(-1, 18)],
    ["p4", 110_000, m(-1, 27)],
    ["p2", 400_000, m(0, 5)],
  ];
  const paidInvoices = paid.map(([projectId, amount, paidOn]) => ({
    projectId,
    amount,
    issuedOn: addDays(paidOn, -20),
    dueOn: addDays(paidOn, 2),
    paidOn,
  }));
  const unpaidInvoices = [
    { projectId: "p1", amount: 220_000, issuedOn: addDays(today, -34), dueOn: addDays(today, -4), paidOn: null },
    { projectId: "p4", amount: 110_000, issuedOn: addDays(today, -3), dueOn: addDays(today, 11), paidOn: null },
    { projectId: "p3", amount: 180_000, issuedOn: addDays(today, -1), dueOn: addDays(today, 29), paidOn: null },
  ];
  return [...paidInvoices, ...unpaidInvoices].map((invoice, i) => ({
    ...invoice,
    id: `i${i + 1}`,
    number: `INV-${String(i + 1).padStart(4, "0")}`,
  }));
}

export function createSeed(today: ISODate): AppData {
  return { projects: projects(today), tasks: tasks(today), invoices: invoices(today) };
}
