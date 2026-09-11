import type { Project } from "./types";

export const mvpBookingSystem: Project = {
  slug: "mvp-booking-system",
  name: "予約管理システム",
  headline: "紙やLINEの予約管理を画面に載せ替える管理ツール",
  summary:
    "予約の登録・編集と、受付中／確定／完了のステータス管理を行います。本日・近日・過去の予約を分けて表示し、確認通知とリマインドの送信状況をフラグで管理します。",
  tier: "standard",
  categories: ["web"],
  team: { kind: "solo" },
  period: { start: "2026-03" },
  stack: ["Next.js (App Router)", "Server Actions", "PostgreSQL"],
  highlights: [
    { label: "予約の登録・編集", type: "check" },
    { label: "ステータス管理", type: "data" },
    { label: "通知状況のフラグ管理", type: "data" },
  ],
  verification: "live-demo",
  links: {
    demo: "https://mvp-booking-system.vercel.app/reservations",
    github: "https://github.com/Rascal7-7-7/portfolio/tree/main/mvp-booking-system",
  },
  duration: "7日",
  audience: "美容室・クリニック・個人サロン",
};
