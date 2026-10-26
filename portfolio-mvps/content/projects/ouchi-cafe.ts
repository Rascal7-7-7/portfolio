import type { Project } from "./types";

export const ouchiCafe: Project = {
  slug: "ouchi-cafe",
  name: "おうちかふぇ",
  headline: "味覚診断の結果から商品を推薦するコーヒー・ティーEC",
  summary:
    "2025年度の卒業・進級制作。4人チームで開発しました。味覚診断の回答を12次元のベクトルに変換し、Python側の推薦エンジンが好みに近い商品を返します。フレームワークを使わない PHP で、ルーティング・DBアクセス・認証を自前で実装しました。",
  tier: "featured",
  categories: ["ai", "web"],
  team: {
    kind: "team",
    members: 4,
    myRole: "バックエンド（PHP・SQL）を担当。自分で書いた部分と、AI を使って直した部分があります。全 610 コミット中 556 件（main ブランチ、2026-10 時点）",
  },
  period: { start: "2025-10", end: "2026-02" },
  stack: ["PHP 8.2", "MySQL 8.0", "FastAPI", "LightGBM", "Stripe"],
  highlights: [
    { label: "味覚診断12次元ベクトル", type: "check" },
    { label: "LightGBMによる推薦", type: "check" },
    { label: "商品692件", type: "data" },
  ],
  verification: "code-only",
  evidence: {
    rows: [
      { label: "味覚診断のベクトル", value: "12 次元" },
      { label: "商品データ", value: "692 件" },
      { label: "テーブル", value: "101" },
      { label: "コミット（本人 / 全体）", value: "556 / 610" },
    ],
    source: {
      label: "GitHub の main ブランチ（2026-10 時点）",
      href: "https://github.com/Rascal7-7-7/ouchi-cafe",
    },
  },
  links: {
    github: "https://github.com/Rascal7-7-7/ouchi-cafe",
  },

  // ---- Case Study ----
  problem:
    "コーヒーや茶葉は種類が多く、詳しくない人ほど選べません。「何が自分に合うか分からない」状態のまま離脱してしまうのを、どうにかしたいと考えました。",
  goal: "味の好みを数値として扱い、選択肢を1〜3個に絞り込めるようにすること。",
  diagram: {
    description:
      "おうちかふぇ の構成図。味覚診断の回答を12次元のベクトルに変換し、Python 側の推薦エンジン（FastAPI・LightGBM）が好みに近い商品を返す。推薦エンジンは PHP 側から HTTP で呼ぶ。PHP はフレームワークを使わず、ルーティング・DBアクセス・認証を自前で実装し、データは MySQL に置く。推薦エンジンが落ちても EC の主要機能は動く。",
    steps: [
      { label: "味覚診断の回答", note: "診断結果を保存する" },
      { label: "12次元ベクトル", note: "味の好みを数値として扱う" },
      { label: "推薦エンジン（Python）", note: "FastAPI・LightGBM。PHP 側から HTTP で呼ぶ" },
      { label: "商品", note: "好みに近い商品を返す" },
    ],
    sidePath: {
      steps: [
        { label: "PHP（自前実装）", note: "ルーティング・DB・認証" },
        { label: "MySQL 8.0", note: "101 テーブル" },
      ],
      note: "推薦エンジンが落ちても EC の主要機能は動く",
    },
  },
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
      question: "なぜ Laravel をやめて素の PHP で書き直したのか",
      answer:
        "当初 Laravel で作り始めましたが、フレームワークが何を自動でやっているのかが分からないまま進んでいました。学習と保守の両面で、ルーティング・DBアクセス・認証をフレームワークに任せず、コードとして目に見える形にした方が説明できる状態になると判断し、移行しました。",
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
    "フレームワークが隠していた処理をコードとして目に見える形にすると、どこで何が起きているか説明できるようになる",
    "推薦の精度より、選択肢を減らして意思決定を助けることの方が体験に効く",
    "テストを後回しにすると、画面が増えたときに手動確認が破綻する",
  ],
  futureWork: [
    "商品画像をリポジトリに同梱していた。今ならオブジェクトストレージに置き、URLをDBに持たせる",
    "自動テストが不足している。主要な購入導線から先に固めたい",
  ],
};
