import type { Project } from "./types";

export const mvpBookingSystem: Project = {
  slug: "mvp-booking-system",
  name: "予約管理システム",
  headline: "紙やLINEの予約管理を画面に載せ替える管理ツール",
  summary:
    "LINE・電話・Web・店頭で受けた予約を1画面にまとめるモックアップです。予約の登録・編集・削除、確定待ち→確定→完了のワンクリック更新、日別スケジュール、確認通知の送信演出までを、API やデータベースを使わずブラウザ内のダミーデータで操作できます。",
  tier: "standard",
  categories: ["web"],
  team: { kind: "solo" },
  period: { start: "2026-03" },
  stack: ["Next.js (App Router)", "React", "TypeScript", "Tailwind CSS"],
  highlights: [
    { label: "予約の登録・編集・削除", type: "check" },
    { label: "受付経路（LINE・電話・Web）の一元管理", type: "data" },
    { label: "ワンクリックのステータス更新と通知演出", type: "check" },
  ],
  verification: "live-demo",
  links: {
    demo: "https://mvp-booking-system.vercel.app/reservations",
    github: "https://github.com/Rascal7-7-7/portfolio/tree/main/mvp-booking-system",
  },
  duration: "7日",
  audience: "美容室・クリニック・個人サロン",
};
