import type { Project } from "./types";

export const mvpEstimateManager: Project = {
  slug: "mvp-estimate-manager",
  name: "見積管理ツール",
  headline: "明細から合計を自動計算する見積作成ツール",
  summary:
    "品目・数量・単価を入力すると、小計・税・合計を自動計算します。下書き／送付済み／承認済みのステータスで案件を管理し、承認済みの金額を集計します。",
  tier: "standard",
  categories: ["web"],
  team: { kind: "solo" },
  period: { start: "2026-03" },
  stack: ["Next.js", "Server Actions", "PostgreSQL"],
  highlights: [
    { label: "小計・税・合計を自動計算", type: "check" },
    { label: "ステータス管理", type: "data" },
    { label: "承認金額の集計", type: "data" },
  ],
  verification: "live-demo",
  links: {
    demo: "https://mvp-estimate-manager.vercel.app/estimates",
    github: "https://github.com/Rascal7-7-7/portfolio/tree/main/mvp-estimate-manager",
  },
  duration: "6日",
  audience: "フリーランス・小規模営業チーム",
};
