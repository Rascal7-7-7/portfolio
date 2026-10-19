import type { Project } from "./types";

export const mvpSubscriptionEc: Project = {
  slug: "mvp-subscription-ec",
  name: "サブスクEC",
  headline: "定期便の申し込みフローを通したD2C向けEC",
  summary:
    "架空ブランドのストアフロントで、商品詳細から定期便のお届け間隔を選び、カート・申し込み・マイページまで一通り操作できるモックアップです。データはブラウザ内だけで動き、決済はモックUIのため実際の課金は発生しません。",
  tier: "standard",
  categories: ["web"],
  team: { kind: "solo" },
  period: { start: "2026-03" },
  stack: ["Next.js", "TypeScript", "Tailwind CSS"],
  highlights: [
    { label: "定期便の割引・送料・税込の金額計算", type: "check" },
    { label: "カート〜申込フロー（決済はモック）", type: "check" },
    { label: "マイページで定期便のスキップ・お休み・解約", type: "data" },
  ],
  verification: "live-demo",
  thumbnail: "/projects/mvp-subscription-ec.webp",
  links: {
    demo: "https://mvp-subscription-ec.vercel.app/products",
    github: "https://github.com/Rascal7-7-7/portfolio/tree/main/mvp-subscription-ec",
  },
  duration: "8日",
  audience: "D2C事業者・ネットショップ",
};
