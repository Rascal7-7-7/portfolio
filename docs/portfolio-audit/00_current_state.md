# 00. 現状調査 — Current State

> 監査日: 2026-09-11
> 対象: https://portfolio-mvps.vercel.app/ / https://github.com/Rascal7-7-7/portfolio-mvps
> 監査フェーズのため、アプリケーションコード・設定・デザイン・本番環境は一切変更していない。

---

## 1. リポジトリ状態（実測）

| 項目 | 値 |
|---|---|
| ローカルパス | `/Users/Rascal/work/portfolio-mvps` |
| リモート | `https://github.com/Rascal7-7-7/portfolio-mvps` (public) |
| ブランチ | `main` のみ（ローカル・リモートとも） |
| コミット数 | 6 |
| 最新コミット | `4b91fb2 chore: remove 3 broken skill symlinks and normalize mvp-subscription-ec project memory` |
| 未コミット | `M .claude/settings.json` / `M CLAUDE.md` / 未追跡 `.coderabbit.yaml` `.github/` `AGENTS.md` `DESIGN.md` |
| GitHub description | **なし** |
| GitHub topics | **0件** |
| GitHub homepage | `https://portfolio-mvps.vercel.app`（設定済み） |
| README | **リポジトリルートに存在しない（GitHub API 404）** |
| Issue / PR | **0件 / 0件** |
| ライセンス | なし |

### コミット履歴（全6件）

```
4b91fb2 chore: remove 3 broken skill symlinks and normalize mvp-subscription-ec project memory
e9526a7 chore: project-local rules を global canonical rules との差分のみに整理
67dbf40 chore: pre-migration commit
e2bdd57 fix: リンク・メール・scrollテキストを修正
d2e0a28 chore: Vercel用のvercel.json追加（Next.jsフレームワーク明示）
f7cf200 feat: ポートフォリオMVP一式を初回コミット
```

授業要件である **Issue → Branch → Commit → Pull Request → Merge のサイクル実績はゼロ**。
Conventional Commits 形式（`feat:` `fix:` `chore:`）は守られている。

---

## 2. モノレポ構成

このリポジトリは「ポートフォリオサイト本体」と「掲載作品5本」を同居させたモノレポ。

| ディレクトリ | 役割 | 公開URL |
|---|---|---|
| `portfolio-mvps/` | **ポートフォリオサイト本体（監査対象）** | https://portfolio-mvps.vercel.app/ |
| `mvp-lp-generator/` | 掲載作品1 | https://mvp-lp-generator.vercel.app/editor/1 |
| `mvp-booking-system/` | 掲載作品2 | https://mvp-booking-system.vercel.app/reservations |
| `mvp-estimate-manager/` | 掲載作品3 | https://mvp-estimate-manager.vercel.app/estimates |
| `mvp-subscription-ec/` | 掲載作品4 | https://mvp-subscription-ec.vercel.app/products |
| `mvp-freelance-manager/` | 掲載作品5 | https://mvp-freelance-manager.vercel.app/dashboard |

**注意**: サイトからリンクされている GitHub は、このモノレポではなく**個別に切り出された5つの別リポジトリ**（`Rascal7-7-7/mvp-*`）。いずれも public、最終 push は 2026-03-26〜03-31 で、モノレポ側の方が新しい。全リポジトリとも **description なし・topics 0件**、homepage のみ設定済み。

---

## 3. ポートフォリオサイト本体の技術構成（実測）

### 依存関係（`portfolio-mvps/package.json`）

| 種別 | パッケージ | バージョン |
|---|---|---|
| Framework | next | **14.2.5** |
| UI | react / react-dom | **^18** |
| 言語 | typescript | ^5（`strict: true`） |
| CSS | tailwindcss | ^3.4.1 + autoprefixer + postcss |
| アイコン | lucide-react | ^0.400.0 |
| ユーティリティ | clsx / tailwind-merge / class-variance-authority | — |

> 掲載作品5本は Next 15〜16 / React 19 で作られており、**サイト本体だけが Next 14 / React 18 と一世代古い**。

### スクリプト

`dev` / `build` / `start` / `lint` の4つのみ。**テスト・型チェック単体・フォーマッタのスクリプトなし。**

### ファイル構成（node_modules / .next 除く18ファイル）

```
portfolio-mvps/
├── app/
│   ├── globals.css       # Tailwind ディレクティブ + Google Fonts @import + CSS変数
│   ├── layout.tsx        # metadata(title/description/OG) + html lang="ja"
│   └── page.tsx          # 7コンポーネントを縦に並べるだけ
├── components/
│   ├── Hero.tsx          # ファーストビュー
│   ├── CTA.tsx           # サービスチップ3件 + 相談CTA（id="contact"）
│   ├── MVPGrid.tsx       # 作品5件のデータ定義 + グリッド（id="mvps"）
│   ├── MVPCard.tsx       # 作品カード
│   ├── Why.tsx           # 「なぜこの設計ができるのか」3ステップ
│   ├── Process.tsx       # 「依頼から納品までの流れ」5ステップ
│   ├── Trust.tsx         # 「選ばれる理由」3点
│   └── Footer.tsx        # 最終CTA + GitHub/メール
├── next.config.mjs       # 空（設定なし）
├── tailwind.config.ts    # brand(sky系) / surface(zinc系) / fontFamily
├── postcss.config.mjs
├── tsconfig.json         # strict, paths: @/*
├── vercel.json           # framework: nextjs, buildCommand, outputDirectory
└── package.json
```

**`public/` ディレクトリが存在しない** → favicon・OG画像・作品スクリーンショットが1枚もない。

### ページ構成

**シングルページ1枚のみ**（`/` だけ）。ルーティングなし。セクション内アンカー `#mvps` `#contact` で移動。

### コンポーネント構成（描画順）

| # | コンポーネント | 役割 | 見出し |
|---|---|---|---|
| 1 | `Hero` | キャッチコピー + CTA2つ | h1 ×1 |
| 2 | `CTA` | サービス3種 + 相談CTA | h2 |
| 3 | `MVPGrid` | 作品5件 | h2 + h3×5 |
| 4 | `Why` | 設計思想3ステップ | h2 + h3×3 |
| 5 | `Process` | 依頼〜納品5ステップ | h2 + h3×5 |
| 6 | `Trust` | 選ばれる理由3点 | h2 + h3×3 |
| 7 | `Footer` | 最終CTA + リンク | h2 |

### デザイントークン（`tailwind.config.ts`）

```
brand:   50 #f0f9ff / 100 #e0f2fe / 500 #0ea5e9 / 600 #0284c7 / 700 #0369a1 / 900 #0c4a6e
surface: 50 #fafafa / 100 #f4f4f5 / 200 #e4e4e7 / 800 #27272a / 900 #18181b / 950 #09090b
font:    Inter, Noto Sans JP, sans-serif
```

ダークテーマ固定（ライトモード切替なし）。トークン定義自体は整理されている。

---

## 4. デプロイ / 環境変数

| 項目 | 状態 |
|---|---|
| ホスティング | Vercel（`server: Vercel` ヘッダ確認） |
| 設定 | `vercel.json`: `framework: nextjs` / `buildCommand: npm run build` / `outputDirectory: .next` |
| 環境変数 | **サイト本体は環境変数を一切使用していない**（DB接続なし・API呼び出しなし） |
| `.gitignore` | `**/.env*` を網羅。`git ls-files` で追跡ファイル18件を確認、秘密情報の混入なし |
| CI/CD | `.github/workflows/ci.yml` が**未コミット状態で存在**（変更MVP検出 → ビルド。サイト本体のジョブは未確認） |
| キャッシュ | `cache-control: public, max-age=0, must-revalidate`（HTML）/ `x-vercel-cache: HIT` |
| HTTPS | HSTS あり（`max-age=63072000; includeSubDomains; preload`） |

**掲載作品5本は PostgreSQL (Neon) に依存**し、`DATABASE_URL` を必要とする。サイト本体とは独立。

---

## 5. ビルド検証（実測）

監査時点のローカルで、6アプリすべての `next build` が成功することを確認した（exit=0、エラー・警告なし）。Node v24.14.1 / npm 11.11.0。

```
portfolio-mvps exit=0   mvp-lp-generator exit=0   mvp-booking-system exit=0
mvp-estimate-manager exit=0   mvp-subscription-ec exit=0   mvp-freelance-manager exit=0
```

---

## 6. 本番サイトの実測値

### ブラウザ監査環境

`BROWSER_AUDIT=AVAILABLE`
Chrome 152.0.7977.83 を headless + CDP（Chrome DevTools Protocol）で駆動。
`Emulation.setDeviceMetricsOverride` による正確なビューポート再現、キャッシュ無効化、`PerformanceObserver` 注入で LCP / CLS を実測。

| ビューポート | DPR | モバイル | ページ全高 | 横スクロール |
|---|---|---|---|---|
| 390×844 | 3.0 | あり | 8,406px | **なし** |
| 768×1024 | 2.0 | あり | 6,316px | **なし** |
| 1024×768 | 1.0 | なし | 5,536px | **なし** |
| 1440×900 | 1.0 | なし | 5,629px | **なし** |

### パフォーマンス（キャッシュ無効・実測）

| 指標 | 390 | 768 | 1024 | 1440 |
|---|---|---|---|---|
| TTFB | 1,054ms（コールドスタート） | 7ms | 20ms | 25ms |
| FCP | 1,144ms | 56ms | 92ms | 88ms |
| **LCP** | 1,144ms | 56ms | 92ms | 88ms |
| **CLS** | **0** | **0** | **0** | **0** |
| LCP要素 | `<h1>`（テキスト） | 同左 | 同左 | 同左 |

### 転送量（1440、キャッシュ無効）

| リソース | サイズ |
|---|---|
| HTML | 12.5KB |
| CSS ×1 | 3.8KB |
| JS ×4 | 91.4KB |
| **合計** | **約108KB / 6リクエスト** |

画像・動画・Webフォント・外部スクリプトの読み込みは**0件**。

### Console / Network

- Console エラー: **1件**（`/favicon.ico` 404）
- Console 警告: 0件
- JavaScript 例外: 0件
- 失敗リクエスト: favicon 以外 0件
- Mixed Content / CORS エラー: 0件
- 壊れた画像: 該当なし（`<img>` 0件）

### HTTPステータス（実測）

| パス | ステータス |
|---|---|
| `/` | 200 |
| `/favicon.ico` | **404** |
| `/robots.txt` | **404** |
| `/sitemap.xml` | **404** |
| 存在しないパス | 404（Next.js デフォルト404ページ、8,236B） |

外部リンク11件（GitHub 6件 / デモ5件）は**すべて 200 で到達**。リンク切れなし。

---

## 7. 既知の不整合（事実のみ）

1. **Webフォントが適用されていない。** `globals.css` の Google Fonts `@import` が `@tailwind` ディレクティブの後ろに置かれている。CSS 仕様上 `@import` は先頭でなければ無効。ビルド後CSSでも該当箇所は先頭から10,445バイト目にあり、ブラウザ実測でも `fonts.googleapis.com` へのリクエストは**0件**、`document.fonts` の登録フェイスも**0件**。結果として Inter / Noto Sans JP は読み込まれず、システムフォントで描画されている。
2. **作品カードの技術タグが実装と一致しない。** サイトは `Prisma` `OpenAI API` `Stripe` `Chart.js` を表示しているが、5本すべての `package.json` を検索した結果、これらの依存は**0件**。実際は `pg` / `@neondatabase/serverless` による生SQL、AI連携なし、決済なし、グラフライブラリなし。
3. **サイト本体の README が存在しない。** 掲載作品5本も README は create-next-app のデフォルトか欠落。
4. **フッターの著作権表記が `© 2025`**（監査日は2026年）。
5. **氏名がサイト上のどこにも存在しない。** 名乗りは「フリーランスエンジニア」のみ。

---

## 8. 参照した監査データ

- CDP 実測生データ: セッション作業領域（`audit_raw.json`、リポジトリ外）
- スクリーンショット: `docs/portfolio-audit/screenshots/`
  - `home-390w-full.png` / `home-768w-full.png` / `home-1024w-full.png` / `home-1440w-full.png`（全ページ）
  - `hero-390w.png` / `hero-1440w.png` / `projects-390w.png` / `projects-1440w.png` / `footer-1440w.png`（部分）
