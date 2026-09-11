import type { Project } from "./types";

export const mvpSubscriptionEc: Project = {
  slug: "mvp-subscription-ec",
  name: "サブスクEC",
  headline: "定期便の申し込みフローを通したD2C向けEC",
  summary:
    "商品一覧・詳細からカートに入れ、定期便プランを選んで申し込みまで進めます。決済はデモ用のモックUIで、実際の課金は発生しません。注文とサブスクの状態を画面で確認できます。",
  tier: "standard",
  categories: ["web"],
  team: { kind: "solo" },
  period: { start: "2026-03" },
  stack: ["Next.js", "API Routes", "PostgreSQL"],
  highlights: [
    { label: "定期便プランの選択", type: "check" },
    { label: "カート〜申込フロー（決済はデモ）", type: "check" },
    { label: "注文・サブスクの管理", type: "data" },
  ],
  verification: "live-demo",
  links: {
    demo: "https://mvp-subscription-ec.vercel.app/products",
    github: "https://github.com/Rascal7-7-7/portfolio/tree/main/mvp-subscription-ec",
  },
  duration: "8日",
  audience: "D2C事業者・ネットショップ",
};
