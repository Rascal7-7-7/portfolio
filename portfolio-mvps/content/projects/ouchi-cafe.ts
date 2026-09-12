import type { Project } from "./types";

export const ouchiCafe: Project = {
  slug: "ouchi-cafe",
  name: "おうちかふぇ",
  headline: "味覚診断の結果から商品を推薦するコーヒー・ティーEC",
  summary:
    "2025年度の卒業・進級制作。4人チームで開発しました。味覚診断の回答を12次元のベクトルに変換し、Python側の推薦エンジンが好みに近い商品を返します。フレームワークを使わない PHP で、ルーティング・DBアクセス・認証を自前で実装しました。",
  tier: "featured",
  categories: ["ai", "web"],
  // TODO: チーム内での担当範囲を、本人の言葉で具体化する
  team: {
    kind: "team",
    members: 4,
    myRole: "608コミット中560件（GitHub の contributors 統計）",
  },
  period: { start: "2025-10", end: "2026-02" },
  stack: ["PHP 8.2", "MySQL 8.0", "FastAPI", "LightGBM", "Stripe"],
  highlights: [
    { label: "味覚診断12次元ベクトル", type: "check" },
    { label: "LightGBMによる推薦", type: "check" },
    { label: "商品692件・101テーブル", type: "data" },
  ],
  verification: "code-only",
  links: {
    github: "https://github.com/Rascal7-7-7/ouchi-cafe",
  },

  // ---- Case Study ----
  problem:
    "コーヒーや茶葉は種類が多く、詳しくない人ほど選べません。「何が自分に合うか分からない」状態のまま離脱してしまうのを、どうにかしたいと考えました。",
  goal: "味の好みを数値として扱い、選択肢を1〜3個に絞り込めるようにすること。",
  features: [
    "味覚診断（12次元ベクトル化）と診断結果の保存",
    "LightGBM による Learning to Rank、協調フィルタリング、クラスタリング",
    "商品比較（最大3件）",
    "セッション認証・OTP・信頼済みデバイス・メール認証",
    "Stripe によるテストモード決済",
    "商品・注文・ユーザー・レビューの管理画面",
  ],
  decisions: [
    {
      question: "なぜ Laravel を除去して素の PHP にしたのか",
      answer:
        "当初 Laravel で作り始めましたが、フレームワークが何を自動でやっているのかが分からないまま進んでいました。学習と保守の両面で、ルーティング・DBアクセス・認証を自分で書いた方が説明できる状態になると判断し、移行しました。",
    },
    {
      question: "なぜ推薦エンジンを Python の別サービスにしたのか",
      answer:
        "LightGBM や scikit-learn を使うため Python が必要でした。PHP 側から HTTP で呼ぶ構成にして、推薦エンジンが落ちても EC の主要機能は動くようにしています。",
    },
  ],
  security: [
    "セッション認証を自前で実装（OTP・信頼済みデバイス・メール認証）",
    "CSRF 対策（トークンのないPOSTを拒否することを動作確認済み）",
    "プレースホルダによる SQL インジェクション対策",
  ],
  testing: "PHPUnit は1ファイルのみで、画面ごとの手動テスト手順に依存していました。",
  deployment: "ローカル環境（PHP 8.2 + MySQL 8.0 + FastAPI）で動作します。",
  learned: [
    "フレームワークが隠していた処理を自分で書くと、どこで何が起きているか説明できるようになる",
    "推薦の精度より、選択肢を減らして意思決定を助けることの方が体験に効く",
    "テストを後回しにすると、画面が増えたときに手動確認が破綻する",
  ],
  futureWork: [
    "商品画像をリポジトリに同梱していた。今ならオブジェクトストレージに置き、URLをDBに持たせる",
    "自動テストが不足している。主要な購入導線から先に固めたい",
  ],
};
