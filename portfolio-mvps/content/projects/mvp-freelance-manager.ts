import type { Project } from "./types";

export const mvpFreelanceManager: Project = {
  slug: "mvp-freelance-manager",
  name: "フリーランス管理ツール",
  headline: "案件・タスク・金額を1画面に集約するダッシュボード",
  summary:
    "案件とタスクを登録し、ステータスを切り替えて管理します。ダッシュボードでは進行中の案件数・今週期限のタスク・完了案件・総案件金額をまとめて確認できます。",
  tier: "standard",
  categories: ["web"],
  team: { kind: "solo" },
  period: { start: "2026-03" },
  stack: ["Next.js", "Server Actions", "PostgreSQL"],
  highlights: [
    { label: "案件・タスク管理", type: "check" },
    { label: "KPIダッシュボード", type: "data" },
  ],
  verification: "live-demo",
  links: {
    demo: "https://mvp-freelance-manager.vercel.app/dashboard",
    github: "https://github.com/Rascal7-7-7/portfolio/tree/main/mvp-freelance-manager",
  },
  duration: "6日",
  audience: "フリーランス・個人事業主",
};
