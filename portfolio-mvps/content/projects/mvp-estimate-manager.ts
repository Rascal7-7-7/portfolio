import type { Project } from "./types";

export const mvpEstimateManager: Project = {
  slug: "mvp-estimate-manager",
  name: "見積管理ツール",
  headline: "明細から合計を自動計算する見積作成ツール",
  summary:
    "品目・数量・単価を入力すると、小計・消費税（10%）・合計と見積書プレビューをその場で更新します。下書き→送付済み→受注／失注のステータスで管理し、受注金額・回答待ち金額・受注率を一覧で集計します。デモはダミーデータとブラウザ内保存で動き、外部通信はしません。",
  tier: "standard",
  categories: ["web"],
  team: { kind: "solo" },
  period: { start: "2026-03" },
  stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  highlights: [
    { label: "小計・消費税・合計を自動計算", type: "check" },
    { label: "入力と連動する見積書プレビュー", type: "check" },
    { label: "受注・失注のステータス管理と受注率の集計", type: "data" },
  ],
  verification: "live-demo",
  thumbnail: "/projects/mvp-estimate-manager.webp",
  links: {
    demo: "https://mvp-estimate-manager.vercel.app/estimates",
    github: "https://github.com/Rascal7-7-7/portfolio/tree/main/mvp-estimate-manager",
  },
  duration: "6日",
  audience: "フリーランス・小規模営業チーム",
};
