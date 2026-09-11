import type { Project } from "./types";

export const mvpLpGenerator: Project = {
  slug: "mvp-lp-generator",
  name: "LP生成サービス",
  headline: "店舗情報を入力してLPを組み立てるエディタ",
  summary:
    "業種・店舗情報・訴求軸をフォームに入力すると、右側のプレビューに反映されます。テンプレートを組み合わせる方式で、公開用のURLを発行できます。",
  tier: "standard",
  categories: ["web"],
  team: { kind: "solo" },
  period: { start: "2026-03" },
  stack: ["Next.js", "API Routes", "Neon (PostgreSQL)"],
  highlights: [
    { label: "入力とプレビューが連動", type: "check" },
    { label: "公開URL（slug）を発行", type: "data" },
  ],
  verification: "live-demo",
  links: {
    demo: "https://mvp-lp-generator.vercel.app/editor/1",
    github: "https://github.com/Rascal7-7-7/portfolio/tree/main/mvp-lp-generator",
  },
  duration: "5日",
  audience: "小規模店舗・サロン",
};
