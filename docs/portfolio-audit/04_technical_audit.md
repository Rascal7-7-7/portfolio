# 04. 技術監査 — Performance / Accessibility / SEO / Network / Security

> `BROWSER_AUDIT=AVAILABLE`
> Chrome 152.0.7977.83 を headless + CDP で駆動。`Emulation.setDeviceMetricsOverride` によるビューポート再現、`Network.setCacheDisabled=true`、`PerformanceObserver`（LCP / Layout Shift）をドキュメント生成前に注入して実測。
> **Lighthouse CLI は未インストール**（監査中の依存追加は禁止事項のため実行せず）。よって総合スコア（0-100）は未取得。代わりに個別指標を CDP で実測した。

---

## 1. Performance

### 1-1. Core Web Vitals（実測・キャッシュ無効）

| ビューポート | TTFB | FCP | **LCP** | **CLS** | LCP要素 |
|---|---|---|---|---|---|
| 390×844 (DPR3) | 1,054ms | 1,144ms | **1,144ms** | **0** | `<h1>` |
| 768×1024 (DPR2) | 7ms | 56ms | **56ms** | **0** | `<h1>` |
| 1024×768 | 20ms | 92ms | **92ms** | **0** | `<h1>` |
| 1440×900 | 25ms | 88ms | **88ms** | **0** | `<h1>` |

**評価: 優秀。** LCP は Good しきい値（2.5秒）を大きく下回り、CLS は完全にゼロ。
390px の 1,144ms は**測定1回目のコールドスタート**（TTFB 1,054ms がその大半）。2回目以降の TTFB は 7〜25ms で、Vercel Edge の初回起動によるもの。実ユーザーへの影響は限定的。

INP は無操作ページ（インタラクティブ要素がリンクのみ）のため実測対象なし。

### 1-2. 転送量とリクエスト（1440 / キャッシュ無効）

| リソース | 転送量 | 時間 |
|---|---|---|
| HTML (document) | 12.5KB | — |
| `6cfa44056bb8ffd4.css` | 3.8KB | 11ms |
| `fd9d1056-....js` | 55.4KB | 44ms |
| `23-....js` | 33.1KB | 32ms |
| `webpack-....js` | 2.2KB | 43ms |
| `main-app-....js` | 0.8KB | 33ms |
| **合計** | **約108KB / 6リクエスト** | |

| チェック項目 | 結果 |
|---|---|
| 画像 | **0件**（`<img>` なし、`public/` 自体が存在しない） |
| 動画 | 0件 |
| Webフォント | **0件**（後述の不具合により読み込まれていない） |
| 外部スクリプト（解析タグ等） | 0件 |
| JSバンドル | 91.4KB（圧縮後）。Next.js 標準構成として妥当 |
| アニメーション | CSS transition のみ28箇所。JSアニメーションなし |

**「普通のスマートフォン・普通の回線で不快でないか」→ 問題なし。** 現行サイトのパフォーマンスは Portfolio v2 でも維持すべき資産。

### 1-3. パフォーマンス上のリスク（v2で作り込む際）

- 作品スクリーンショットを追加すると、**現在ゼロの画像転送量が一気に増える**。`next/image` + WebP/AVIF + `sizes` 指定を前提にすること。
- Webフォントを正しく読み込むようにすると、その分の転送とレンダリング遅延が発生する。`next/font`（自己ホスト + `font-display: swap` + サブセット）で導入すること。**現在の `@import` 方式に戻してはいけない。**

---

## 2. Accessibility（WCAG 2.2 基準・自動＋手動）

### 2-1. セマンティック構造

| 項目 | 実測 | 評価 |
|---|---|---|
| `<html lang="ja">` | あり | ✓ |
| `<main>` | 1個 | ✓ |
| `<footer>` | 1個 | ✓ |
| `<header>` | **0個** | ✗ |
| `<nav>` | **0個** | ✗ |
| `<section>` | 6個（うち **aria-label / aria-labelledby を持つもの 0個**） | ✗ |
| `<article>` | 5個（作品カード） | ✓ |
| スキップリンク | **なし** | ✗ |

### 2-2. 見出し階層

```
h1 非効率な業務を、最短で「使えるシステム」に落とし込む。
  h2 業務の課題、聞かせてください。
  h2 実際に動く、業務改善の事例
    h3 ×5（作品カード）
  h2 なぜこの設計ができるのか
    h3 ×3
  h2 依頼から納品までの流れ
    h3 ×5
  h2 選ばれる理由
    h3 ×3
  h2 業務の課題、一緒に整理しませんか。
```

**評価: ✓ 階層の飛びなし。h1 は1個のみ。** スクリーンリーダーの見出しジャンプで構造を把握できる。
ただし `<section>` にアクセシブルな名前がないため、ランドマークナビゲーションでは「section」としか読まれない。

### 2-3. 画像 / アイコン

| 項目 | 実測 |
|---|---|
| `<img>` | 0個（alt 問題は発生しない） |
| インライン `<svg>`（lucide アイコン） | **40個** |
| うち `aria-hidden="true"` または `role` を持つもの | **0個** |

lucide-react はデフォルトで `aria-hidden` を付与しない。**40個の装飾アイコンすべてがアクセシビリティツリーに露出**しており、スクリーンリーダーで不要な読み上げやフォーカス外ノイズになる。装飾目的のアイコンには `aria-hidden="true"` が必要。

### 2-4. リンク

| 項目 | 実測 |
|---|---|
| リンク総数 | 18 |
| ボタン要素 | 0（すべて `<a>`） |
| フォーム要素 | 0 |
| 外部リンクの `rel` | 11件すべて `noopener noreferrer` ✓ |
| 新規タブで開く旨の明示 | **なし** ✗（WCAG 3.2.5 / G201） |

**同一テキストで遷移先が異なるリンク（WCAG 2.4.4 / 2.4.9 違反）**

| リンクテキスト | 出現数 | 異なる遷移先 |
|---|---|---|
| 「デモを見る」 | 5 | 5作品のデモURL |
| 「設計・コードを見る」 | 6 | 5リポジトリ + GitHubプロフィール |
| 「無料で相談する」 | 3 | `#contact` と `mailto:` の2種類 |

スクリーンリーダーの「リンク一覧」機能では、**同じ文字列が11個並び、どれがどの作品か区別できない**。
対応: `aria-label="LP生成サービスのデモを見る"` のように作品名を含める、またはリンクテキスト自体を「LP生成サービスのデモ」に変更する。

### 2-5. ターゲットサイズ（WCAG 2.2 SC 2.5.8 / 24×24px）

**未達 12件**（すべて高さ **20px**）

| 要素 | サイズ |
|---|---|
| 「デモを見る」×5 | 90×20 |
| 「設計・コードを見る」×5 | 146×20 |
| 「設計・コードを見る」（フッター） | 150×20 |
| 「お問い合わせ」（フッター） | 108×20 |

主要CTAボタン（`px-8 py-4` 等）は 56〜60px 高で問題なし。**カード内テキストリンクとフッターリンクのみが未達**。

### 2-6. コントラスト（実測: 126テキストサンプル）

**不合格 4件 / 126件中**

| 要素 | 前景 | 背景 | 比率 | 要求 | 判定 |
|---|---|---|---|---|---|
| CTAボタン「無料で相談する」（16px/600） | #ffffff | `brand-600` #0284c7 | **4.1:1** | 4.5:1 | **✗ AA未達** |
| CTAボタン「無料で相談する」（18px/700） | #ffffff | `brand-600` #0284c7 | **4.1:1** | 4.5:1 | **✗ AA未達** |

**それ以外の122サンプルはすべて合格。** 本文（surface-300/400）も見出しも問題なし。
**不合格しているのが、よりによってサイト全体の主要CTA**であるのが問題。
対応案: 背景を `brand-700` #0369a1（白文字で 5.9:1 前後）にする、または `brand-500` #0ea5e9 に濃色文字を載せる。

### 2-7. キーボード操作（手動実測: Tab×14回）

| 項目 | 結果 |
|---|---|
| フォーカス移動順 | **DOM順 = 視覚順。論理的** ✓ |
| フォーカストラップ | なし ✓ |
| キーボードで到達できない操作 | なし（インタラクティブ要素は全てリンク） ✓ |
| フォーカスインジケータ | **UAデフォルト `outline: auto 1px rgb(0,95,204)`** |
| ダーク背景での視認性 | **低い**。#005FCC は #09090b 背景に対してコントラストが不十分 ✗ |
| スキップリンク | **なし**。18リンクを順に辿るしかない ✗ |

### 2-8. モーション

| 項目 | 通常 | `prefers-reduced-motion: reduce` |
|---|---|---|
| `scroll-behavior` | `smooth` | **`smooth`（変化なし）** ✗ |
| transition を持つ要素 | 28個 | **28個（変化なし）** ✗ |

**`prefers-reduced-motion` に未対応**（実測で確認）。
現行のモーションは色変化と矢印の微小移動のみで健康被害リスクは低いが、`html { scroll-behavior: smooth }` は**アンカー移動時に長距離スクロールを発生させる**ため、reduce 指定時は `auto` にすべき。

### 2-9. スクリーンリーダーでの意味の通り方（構造からの評価）

- 見出しジャンプでの構造把握: **可能** ✓
- ランドマークでの移動: `main` / `footer` のみ。**`nav` がないため「ナビゲーションへ」が機能しない** ✗
- リンク一覧での移動: **同一テキストが11個並び機能しない** ✗
- 装飾アイコン40個が読み上げ対象に含まれる ✗

---

## 3. SEO / Social Preview

### 3-1. メタ情報（本番HTMLから実測）

| 項目 | 状態 | 内容 |
|---|---|---|
| `<title>` | ✓ | `業務改善・MVP開発 \| フリーランスエンジニア` |
| `meta description` | ✓ | 「非効率な業務を、最短で使えるシステムに…」（96字） |
| `lang` | ✓ | `ja` |
| `viewport` | ✓ | `width=device-width, initial-scale=1` |
| `charset` | ✓ | utf-8 |
| `og:title` / `og:description` / `og:type` | ✓ | あり |
| **`og:image`** | **✗ なし** | |
| **`og:url`** | **✗ なし** | |
| **`og:site_name`** | **✗ なし** | |
| `twitter:card` | △ | `summary`（画像がないため `summary_large_image` にできない） |
| **`canonical`** | **✗ なし** | |
| **`favicon`** | **✗ なし → `/favicon.ico` が 404（Consoleエラー発生）** | |
| **`robots.txt`** | **✗ 404** | |
| **`sitemap.xml`** | **✗ 404** | |
| 構造化データ（JSON-LD） | ✗ なし | `Person` スキーマの候補 |
| `metadataBase` | ✗ 未設定 | Next.js で相対URLのOG画像を使う際に必要 |

### 3-2. SNS / Slack / Discord に貼ったときのプレビュー

現状のプレビュー表示:

```
業務改善・MVP開発 | フリーランスエンジニア
非効率な業務を、最短で使えるシステムに落とし込む。
portfolio-mvps.vercel.app
```

**画像なし・ファビコンなしの文字だけのカード**になる。
かつ、タイトルが「フリーランスエンジニア」であるため、**採用担当者や教員に共有されたときに就活用ポートフォリオだと認識されない**。

### 3-3. タイトルの問題

現在の title は**就活用として機能しない**。v2 では以下の形式を推奨。

```
<氏名> | ポートフォリオ — AI・セキュリティ・クラウドに興味があるIT系専門学生
```

（TODO: 氏名は本人確認が必要 → `09_questions_for_owner.md` Q1）

### 3-4. 作品詳細ページの title

詳細ページが存在しないため該当なし。v2 で `/projects/[slug]` を作る際は、`generateMetadata` で作品ごとの title / description / og:image を出し分けること。

---

## 4. Network / Console 監査

### 4-1. Console（4ビューポートすべてで実測）

| 種別 | 件数 | 内容 |
|---|---|---|
| Console エラー | **1** | `Failed to load resource: the server responded with a status of 404 () — /favicon.ico` |
| Console 警告 | **0** | — |
| JavaScript 例外 | **0** | — |
| React のハイドレーション警告 | **0** | — |

**favicon 404 以外、Console は完全にクリーン。** これは確認した上での結論。

### 4-2. Network

| 項目 | 結果 |
|---|---|
| リクエスト数 | 6（HTML / CSS / JS×4） |
| 転送量合計 | 約108KB |
| 読み込み時間 | DOMContentLoaded 36〜67ms、load 46〜100ms（warm） |
| 失敗リクエスト | **favicon 以外 0件**（`Network.loadingFailed` を監視して確認） |
| CORS エラー | **0件** |
| Mixed Content | **0件**（全リソースHTTPS） |
| 壊れた画像 | **該当なし**（画像0件） |
| 大きな画像 | **なし**（画像0件） |
| 不要なJavaScript | なし。外部タグ・解析スクリプトの混入なし |
| リダイレクトチェーン | なし |

### 4-3. リンク切れ検査（全外部リンク11件）

| リンク先 | HTTPステータス |
|---|---|
| github.com/Rascal7-7-7 | 200 |
| github.com/Rascal7-7-7/mvp-lp-generator | 200 |
| github.com/Rascal7-7-7/mvp-booking-system | 200 |
| github.com/Rascal7-7-7/mvp-estimate-manager | 200 |
| github.com/Rascal7-7-7/mvp-subscription-ec- | 200 |
| github.com/Rascal7-7-7/mvp-freelance-manager | 200 |
| mvp-lp-generator.vercel.app/editor/1 | 200 |
| mvp-booking-system.vercel.app/reservations | 200 |
| mvp-estimate-manager.vercel.app/estimates | 200 |
| mvp-subscription-ec.vercel.app/products | 200 |
| mvp-freelance-manager.vercel.app/dashboard | 200 |

**リンク切れ 0件。** 内部アンカー `#mvps` `#contact` も対応する `id` の存在を確認済み。

### 4-4. HTTPステータスの確認（授業要件対応）

| パス | ステータス | 備考 |
|---|---|---|
| `/` | 200 | |
| 存在しないパス | **404** | Next.js デフォルト404ページ。**正しく404を返している**（200を返す誤実装ではない） |
| `/favicon.ico` | 404 | 要修正 |
| `/robots.txt` | 404 | 要追加 |
| `/sitemap.xml` | 404 | 要追加 |

### 4-5. キャッシュ / ヘッダ

```
cache-control: public, max-age=0, must-revalidate   （HTML）
x-vercel-cache: HIT
server: Vercel
strict-transport-security: max-age=63072000; includeSubDomains; preload
```

| ヘッダ | 状態 |
|---|---|
| HSTS | ✓ あり |
| `X-Content-Type-Options` | ✗ なし |
| `X-Frame-Options` / CSP `frame-ancestors` | ✗ なし |
| `Referrer-Policy` | ✗ なし |
| `Content-Security-Policy` | ✗ なし |
| `Permissions-Policy` | ✗ なし |

静的な公開ポートフォリオのため実害は小さいが、**セキュリティに興味がある学生のポートフォリオとしては、これらを設定してあること自体が評価材料になる**（`next.config.mjs` の `headers()` で数行）。

---

## 5. Security / Privacy

### 5-1. ポートフォリオサイト本体

| チェック項目 | 結果 |
|---|---|
| APIキー / トークン / Secret の露出 | **なし**（サイト本体は環境変数を一切使用していない） |
| `.env` のコミット | **なし**（`git ls-files` で追跡18ファイルを全確認） |
| ソースマップの公開 | **なし**（`.js.map` は404、`sourceMappingURL` コメントもなし） |
| 内部URL / 開発用エンドポイント | なし |
| デバッグ情報 | なし |
| 学校内部情報 | なし |
| **メールアドレスの露出** | **あり**: `rascal.devops@gmail.com` がHTML内に平文で3箇所 |

**メールアドレスについて**: 公開ポートフォリオに連絡先を置くこと自体は正当だが、`mailto:` の平文はスクレイピングによるスパム収集の対象になる。またアドレス自体が就活用として適切かは要確認（`09` Q9）。**CRITICAL ではなく P2 相当**。

### 5-2. 🔴 CRITICAL — 掲載候補リポジトリ `gin_ec`（おうちかふぇ）

**本監査の対象サイト外だが、Portfolio v2 で掲載を検討している作品のため報告する。**

`github.com/Rascal7-7-7/gin_ec`（**現在 private**）の `main` ブランチに **`.env` が実キー入りでコミットされている**。

| キー | 状態 |
|---|---|
| `OPENAI_API_KEY` | `sk-proj-…` 164文字 — **実キー** |
| `GOOGLE_AI_API_KEY` | `AIzaSy…` 39文字 — **実キー** |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-…` — **実OAuthシークレット** |
| `MAIL_PASSWORD` | 16文字 — **Gmailアプリパスワード** |
| `RECAPTCHA_SECRET_KEY` | 40文字 — 実キー |
| `STRIPE_SECRET` / `STRIPE_WEBHOOK_SECRET` | `sk_test_…` / `whsec_…` — テストキー |

- `.gitignore` に `.env` は記載されているが、**追跡開始後に追加されたため無効**。`.env` を含むコミットが3件残存。
- 加えて `database/exports/` に **DBダンプ（17MB / 33MB）がコミット**されており、`users` テーブルの INSERT に実メールアドレス3件（うち2件は `@i-seifu.jp`）と bcrypt ハッシュ3件が含まれる。
- 共同作業者3名がリポジトリにアクセス可能。

**現在 private のため外部露出はないが、ポートフォリオ掲載のために public にした瞬間に流出する。**
**対応（Portfolio v2 の実装より前に実施すべき）:**
1. OpenAI / Gemini / Google OAuth / Gmailアプリパスワード / reCAPTCHA の**鍵をローテーション**
2. 公開する場合は、`.env` と DBダンプを含まない**サニタイズ済みの公開用リポジトリを別途作成**する（履歴の破壊的書き換えは行わない）

> 本監査では、指示に従い Git 履歴の書き換え等の破壊的処理は一切実施していない。上記は報告のみ。

### 5-3. その他の掲載候補リポジトリでの注意

| リポジトリ | 注意点 |
|---|---|
| `2026-project`（ここまね） | `.env` は git 未追跡を確認済み。メンタルヘルス関連＝要配慮個人情報の扱い方針が README に明記されており、むしろ加点材料 |
| `tadakayo`（WAM） | 実在NPOの案件。団体名・事業予算・先方提供資料・ケアプラン書式を含む。**クライアント許諾なしに掲載不可** |
| `AI_Trade` | `.env`（証券API キー）と実損益データを除外すること |
| `game-security-academy` | git に `.pem` が18件追跡されている |
| `nox` | 実在ゲーム向けチート。**掲載不可** |

---

## 6. 技術監査サマリ

### 強み（Portfolio v2 で維持すべきもの）

1. **パフォーマンス**: LCP 88ms / CLS 0 / 108KB。学生ポートフォリオとして極めて良好
2. **Console / Network がクリーン**: エラーは favicon 404 のみ、リンク切れゼロ
3. **セマンティックHTML**: 見出し階層が正しく、`main` / `footer` / `article` を適切に使用
4. **コントラストがほぼ全域で合格**: 126件中122件
5. **外部リンクの `rel="noopener noreferrer"`**: 適切
6. **秘密情報の混入なし**: サイト本体は clean
7. **レスポンシブ**: 4幅すべてで横スクロール・崩れなし

### 弱み（P0〜P2 で対応）

| # | 問題 | 重大度 |
|---|---|---|
| 1 | 技術タグが実装と不一致（Prisma/OpenAI/Stripe/Chart.js） | **P0** |
| 2 | favicon 404（Consoleエラー・タブとSNSで無名） | **P1** |
| 3 | Webフォントが読み込まれていない（`@import` 位置ミス） | **P1** |
| 4 | 主要CTAのコントラスト 4.1:1（AA未達） | **P1** |
| 5 | `<nav>` / `<header>` / スキップリンクが存在しない | **P1** |
| 6 | 同一テキストのリンク11件（遷移先が異なる） | **P2** |
| 7 | タップ領域24px未満が12件 | **P2** |
| 8 | `prefers-reduced-motion` 未対応 | **P2** |
| 9 | og:image / canonical / robots.txt / sitemap.xml なし | **P2** |
| 10 | 装飾SVG 40個に `aria-hidden` なし | **P2** |
| 11 | セキュリティヘッダ未設定 | **P3** |
| 12 | メールアドレス平文露出 | **P2** |
