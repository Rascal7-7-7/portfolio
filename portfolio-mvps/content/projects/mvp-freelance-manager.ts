import type { Project } from "./types";

export const mvpFreelanceManager: Project = {
  slug: "mvp-freelance-manager",
  name: "フリーランス管理ツール",
  headline: "案件・タスク・請求と入金を1画面に集約するダッシュボード",
  summary:
    "個人事業の案件・タスク・請求をひとつにまとめたバックオフィスツール「Hikae（ひかえ）」のモックアップです。ダッシュボードで今月の入金・未入金の請求・今日やることを確認し、月次の入金推移はCSSの棒グラフで表示します。案件に紐づけた請求書の作成や入金の記録もブラウザ内で操作できます（DB・APIは使わず、ダミーデータとlocalStorageで動作）。",
  tier: "standard",
  categories: ["web"],
  team: { kind: "solo" },
  period: { start: "2026-03" },
  stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  highlights: [
    { label: "案件・タスク・請求の横断ダッシュボード", type: "data" },
    { label: "月次入金推移のグラフ", type: "data" },
    { label: "請求書作成と入金記録", type: "check" },
  ],
  verification: "live-demo",
  thumbnail: "/projects/mvp-freelance-manager.webp",
  links: {
    demo: "https://mvp-freelance-manager.vercel.app/dashboard",
    github: "https://github.com/Rascal7-7-7/portfolio/tree/main/mvp-freelance-manager",
  },
  duration: "6日",
  audience: "フリーランス・個人事業主",
};
