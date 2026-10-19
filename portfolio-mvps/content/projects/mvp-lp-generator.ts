import type { Project } from "./types";

export const mvpLpGenerator: Project = {
  slug: "mvp-lp-generator",
  name: "LP生成サービス",
  headline: "店舗情報を入れるだけで、その場でLPが完成するエディタ",
  summary:
    "店舗名・業種・キャッチコピーなど5項目を入力すると、右側のプレビューにLPが即座に反映されます。3種類のテンプレートの切替、PC/スマホ表示、セクションの表示切替、公開イメージ（モック）まで、ブラウザ内だけで体験できます。",
  tier: "standard",
  categories: ["web"],
  team: { kind: "solo" },
  period: { start: "2026-03" },
  stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  highlights: [
    { label: "入力とプレビューが連動", type: "check" },
    { label: "3テンプレートをワンクリックで切替", type: "check" },
    { label: "PC / スマホ表示を切替", type: "check" },
  ],
  verification: "live-demo",
  links: {
    demo: "https://mvp-lp-generator.vercel.app/editor/1",
    github: "https://github.com/Rascal7-7-7/portfolio/tree/main/mvp-lp-generator",
  },
  duration: "5日",
  audience: "小規模店舗・サロン",
};
