import { ArrowRight } from "lucide-react";
import { MVPCard, type MVPCardProps } from "./MVPCard";

const mvps: MVPCardProps[] = [
  {
    title: "LP生成サービス",
    valueMessage: "店舗情報を入力してLPを組み立てるエディタ",
    description:
      "業種・店舗情報・訴求軸をフォームに入力すると、右側のプレビューに反映されます。テンプレートを組み合わせる方式で、公開用のURLを発行できます。",
    tags: ["Next.js", "API Routes", "Neon (PostgreSQL)"],
    effects: [
      { label: "入力とプレビューが連動", type: "check" },
      { label: "公開URL（slug）を発行", type: "data" },
    ],
    period: "5日",
    target: "小規模店舗・サロン",
    githubUrl: "https://github.com/Rascal7-7-7/portfolio/tree/main/mvp-lp-generator",
    demoUrl: "https://mvp-lp-generator.vercel.app/editor/1",
  },
  {
    title: "予約管理システム",
    valueMessage: "紙やLINEの予約管理を画面に載せ替える管理ツール",
    description:
      "予約の登録・編集と、受付中／確定／完了のステータス管理を行います。本日・近日・過去の予約を分けて表示し、確認通知とリマインドの送信状況をフラグで管理します。",
    tags: ["Next.js (App Router)", "Server Actions", "PostgreSQL"],
    effects: [
      { label: "予約の登録・編集", type: "check" },
      { label: "ステータス管理", type: "data" },
      { label: "通知状況のフラグ管理", type: "data" },
    ],
    period: "7日",
    target: "美容室・クリニック・個人サロン",
    githubUrl: "https://github.com/Rascal7-7-7/portfolio/tree/main/mvp-booking-system",
    demoUrl: "https://mvp-booking-system.vercel.app/reservations",
  },
  {
    title: "見積管理ツール",
    valueMessage: "明細から合計を自動計算する見積作成ツール",
    description:
      "品目・数量・単価を入力すると、小計・税・合計を自動計算します。下書き／送付済み／承認済みのステータスで案件を管理し、承認済みの金額を集計します。",
    tags: ["Next.js", "Server Actions", "PostgreSQL"],
    effects: [
      { label: "小計・税・合計を自動計算", type: "check" },
      { label: "ステータス管理", type: "data" },
      { label: "承認金額の集計", type: "data" },
    ],
    period: "6日",
    target: "フリーランス・小規模営業チーム",
    githubUrl: "https://github.com/Rascal7-7-7/portfolio/tree/main/mvp-estimate-manager",
    demoUrl: "https://mvp-estimate-manager.vercel.app/estimates",
  },
  {
    title: "サブスクEC",
    valueMessage: "定期便の申し込みフローを通したD2C向けEC",
    description:
      "商品一覧・詳細からカートに入れ、定期便プランを選んで申し込みまで進めます。決済はデモ用のモックUIで、実際の課金は発生しません。注文とサブスクの状態を画面で確認できます。",
    tags: ["Next.js", "API Routes", "PostgreSQL"],
    effects: [
      { label: "定期便プランの選択", type: "check" },
      { label: "カート〜申込フロー（決済はデモ）", type: "check" },
      { label: "注文・サブスクの管理", type: "data" },
    ],
    period: "8日",
    target: "D2C事業者・ネットショップ",
    githubUrl: "https://github.com/Rascal7-7-7/portfolio/tree/main/mvp-subscription-ec",
    demoUrl: "https://mvp-subscription-ec.vercel.app/products",
  },
  {
    title: "フリーランス管理ツール",
    valueMessage: "案件・タスク・金額を1画面に集約するダッシュボード",
    description:
      "案件とタスクを登録し、ステータスを切り替えて管理します。ダッシュボードでは進行中の案件数・今週期限のタスク・完了案件・総案件金額をまとめて確認できます。",
    tags: ["Next.js", "Server Actions", "PostgreSQL"],
    effects: [
      { label: "案件・タスク管理", type: "check" },
      { label: "KPIダッシュボード", type: "data" },
    ],
    period: "6日",
    target: "フリーランス・個人事業主",
    githubUrl: "https://github.com/Rascal7-7-7/portfolio/tree/main/mvp-freelance-manager",
    demoUrl: "https://mvp-freelance-manager.vercel.app/dashboard",
  },
];

export function MVPGrid() {
  return (
    <section id="mvps" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-brand-500 text-sm font-semibold mb-3">MVP CASES</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-surface-50 mb-4">
            実際に動く、業務改善の事例
          </h2>
          <p className="text-surface-400 max-w-xl">
            機能を作るのではなく、業務の課題を解くことを目的に設計しています。
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {mvps.map((mvp) => (
            <MVPCard key={mvp.title} {...mvp} />
          ))}
        </div>

        {/* Post-grid CTA */}
        <div className="bg-surface-900 rounded-2xl p-8 text-center">
          <p className="text-surface-300 text-lg font-medium mb-2">
            このような業務課題も解決できます
          </p>
          <p className="text-surface-500 text-sm mb-6">
            まずは気軽にご相談ください
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-700 hover:bg-brand-800 text-white font-semibold rounded-xl transition-colors"
          >
            無料相談
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
