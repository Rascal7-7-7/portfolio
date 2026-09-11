# 07. 実装バックログ — Portfolio v2 Issue 候補

> 各 Issue は「1 Issue = 1目的」。そのまま GitHub Issue として起票できる粒度で記述している。
> 授業要件（Issue → Branch → Commit → PR → Merge）を満たすため、**このバックログをそのまま Issue 化して v2 開発を進めること**を推奨する。
> 対象パスの `site/` は現行の `portfolio-mvps/`（サイト本体ディレクトリ）を指す。

## 優先度の定義

| 優先度 | 定義 |
|---|---|
| **P0 CRITICAL** | 公開停止相当・秘密情報・虚偽表示・サイト利用不能 |
| **P1 HIGH** | 採用上かなり不利。ファーストビュー・Projects・モバイル崩れ |
| **P2 MEDIUM** | UI/UX・情報設計・アクセシビリティ・SEO の改善 |
| **P3 LOW** | 装飾・微調整・Nice-to-have |

---

# P0 — CRITICAL

## ISSUE-P0-01: 作品カードの技術タグを実装と一致させる

| | |
|---|---|
| **Priority** | P0 |
| **Impact** | 極大（技術面接での信頼失墜を防ぐ） |
| **Effort** | 極小（1ファイル・10行程度） |
| **Reason** | 5作品すべてで表示技術と `package.json` が不一致。GitHub を開けば5分で露見し、実装力の評価以前に「盛る人」と判断される |

**Purpose**: サイト上の技術表記を、実装の事実と一致させる。

**Changes**:
- `site/components/MVPGrid.tsx` の `mvps` 配列内 `tags` を修正
  - `Prisma`（4作品で表示 → 未使用）を削除し、実際の `pg` / 生SQL に置換
  - `OpenAI API`（LP生成）を削除（テンプレート方式であることを明記）
  - `Stripe`（サブスクEC）を削除、または「決済モックUI」と明示
  - `Chart.js`（フリーランス管理）を削除
- 正しいタグ例: `Next.js` / `TypeScript` / `PostgreSQL (Neon)` / `Tailwind CSS` / `Server Actions`

**Acceptance Criteria**:
- [ ] 5作品すべてのタグが、対応する `package.json` の依存関係と矛盾しない
- [ ] `prisma` / `openai` / `stripe` / `chart.js` の語がサイト上から消えている（モック明示を除く）
- [ ] `npm run build` が成功する

**Affected Files**: `site/components/MVPGrid.tsx`
**Dependencies**: なし（即着手可）

---

## ISSUE-P0-02: 根拠のない効果数値を削除または表現を修正する

| | |
|---|---|
| **Priority** | P0 |
| **Impact** | 大（誠実性の担保） |
| **Effort** | 小 |
| **Reason** | 「制作工数 -70%」「営業工数 -40%」「手動対応 -60%」等は実ユーザーのいないデモアプリの数値で、測定方法も比較対象も存在しない。就活では「盛り」と判断される |

**Purpose**: 検証不可能な数値主張をサイトから排除する。

**Changes**:
- `site/components/MVPGrid.tsx` の `effects` を以下のいずれかに変更
  - 案1: 削除し、代わりに「主要機能」3点を表示
  - 案2: 「想定効果」と明示したうえで残す
  - 案3: 操作ベースの検証可能な表現に置換（例: 「見積作成が3クリックで完了」）
- `site/components/MVPCard.tsx` の `Effect` 型と `effectIcons` を用途変更に合わせて調整

**Acceptance Criteria**:
- [ ] 実測していない％表記がサイト上に存在しない
- [ ] 残す場合は「想定」であることが視覚的に明示されている
- [ ] `npm run build` が成功する

**Affected Files**: `site/components/MVPGrid.tsx`, `site/components/MVPCard.tsx`
**Dependencies**: なし

---

## ISSUE-P0-03: 掲載候補リポジトリ `gin_ec` の秘密情報を処理する（サイト実装前）

| | |
|---|---|
| **Priority** | P0 |
| **Impact** | 極大（公開した瞬間に実APIキーが流出する） |
| **Effort** | 中（鍵の再発行 + 公開用リポジトリの作成） |
| **Reason** | `gin_ec` の `main` に `.env` が実キー入りでコミットされている（OpenAI / Gemini / Google OAuth / Gmailアプリパスワード / reCAPTCHA）。加えてDBダンプに実メールアドレスと bcrypt ハッシュを含む。現在 private のため未露出だが、ポートフォリオ掲載のため public にすると即流出する |

**Purpose**: おうちかふぇを安全に掲載できる状態にする。

**Changes**（※これはサイトのコード変更ではなく、掲載準備作業）:
1. OpenAI / Google AI (Gemini) / Google OAuth クライアントシークレット / Gmail アプリパスワード / reCAPTCHA の**鍵をローテーション**
2. 公開する場合、`.env`・`database/exports/*.sql`・`vendor/`・高解像度画像を含まない**サニタイズ済み公開用リポジトリを新規作成**（既存リポジトリと履歴は保全する）
3. Unsplash 画像のライセンス表記を確認する

**Acceptance Criteria**:
- [ ] 旧キーが失効している（各サービスのコンソールで確認）
- [ ] 公開用リポジトリに `.env` / DBダンプ / 個人情報が含まれていない
- [ ] ポートフォリオからリンクする URL が決定している

**Affected Files**: なし（サイト外の作業）
**Dependencies**: なし。**ISSUE-P1-06（おうちかふぇの掲載）の前提条件**

---

# P1 — HIGH

## ISSUE-P1-01: Hero に氏名・所属・興味分野を追加する

| | |
|---|---|
| **Priority** | P1 |
| **Impact** | 極大（2分テストの FAIL 6項目のうち4項目を解消） |
| **Effort** | 小（実装）／ 中（文章の確定に本人判断が必要） |
| **Reason** | 氏名がサイト内に1文字も存在せず、学生であることも興味分野も伝わらない。エントリーシートと突合できず、採用フローで参照されない |

**Purpose**: 「誰が・何を学び・どこに興味があるのか」をファーストビューで伝える。

**Changes**:
- `site/components/Hero.tsx` を書き換え
  - 氏名（+ ふりがな / ローマ字）
  - 学校名・学科・学年
  - キャッチコピー（h1）を就活文脈に変更
  - 興味分野タグ（AI / Security / Network / Cloud）
  - CTA を「作品を見る」「GitHub」に差し替え（「無料で相談する」を撤去）

**Acceptance Criteria**:
- [ ] ファーストビュー（スクロールなし・390px と 1440px の両方）に氏名と所属が表示される
- [ ] 「無料で相談する」がファーストビューから消えている
- [ ] 興味分野が文字として存在する
- [ ] h1 が1つだけである

**Affected Files**: `site/components/Hero.tsx`, `site/app/layout.tsx`（title 更新）
**Dependencies**: `09_questions_for_owner.md` の Q1〜Q4 の回答

---

## ISSUE-P1-02: ヘッダーナビゲーションとスキップリンクを追加する

| | |
|---|---|
| **Priority** | P1 |
| **Impact** | 大（回遊性・アクセシビリティ） |
| **Effort** | 小〜中 |
| **Reason** | `<header>` `<nav>` が実測0個。ページ内移動手段が Hero のアンカー2つのみで、最下部から戻れない。WCAG 2.4.1 / 2.4.5 未対応 |

**Purpose**: サイト構造を可視化し、任意のセクションへ1クリックで到達できるようにする。

**Changes**:
- `site/components/Header.tsx` を新規作成（`<header>` + `<nav>`）
  - 左: 氏名（トップへのリンク）
  - 右: `Projects` / `About` / `Skills` / `GitHub`
  - モバイル: ハンバーガー、または最小構成（`Projects` + `GitHub`）
- `site/app/layout.tsx` に配置、`<main id="main">` に ID を付与
- スキップリンク（`メインコンテンツへスキップ`）を最上部に追加（フォーカス時のみ表示）

**Acceptance Criteria**:
- [ ] `<header>` と `<nav>` が DOM に存在する
- [ ] Tab キーの最初のフォーカスがスキップリンクで、Enter で `#main` へ移動する
- [ ] 390px でナビが機能し、横スクロールが発生しない
- [ ] キーボードのみで全ナビ項目に到達できる

**Affected Files**: `site/components/Header.tsx`（新規）, `site/app/layout.tsx`, `site/app/page.tsx`
**Dependencies**: ISSUE-P1-01（氏名の確定）

---

## ISSUE-P1-03: 営業専用セクションを削除・置換する

| | |
|---|---|
| **Priority** | P1 |
| **Impact** | 大（サイトの用途を就活用に転換） |
| **Effort** | 小 |
| **Reason** | 7セクション中4つ（CTA / Process / Trust / Footer CTA）が受注営業専用。採用担当者には不要な情報で、かつ「採用ではなく受注を求めている」と誤読される |

**Purpose**: 営業導線を撤去し、就活用の情報に置き換える。

**Changes**:
- `site/components/CTA.tsx` を削除、または「連絡先」セクションに縮小して再構成
- `site/components/Process.tsx`（依頼から納品までの流れ）を削除、または「開発の進め方」に転換
- `site/components/Trust.tsx`（選ばれる理由）を削除
- `site/components/Why.tsx`（なぜこの設計ができるのか）は**残す**（設計思想として価値がある）
- `site/components/Footer.tsx` の最終CTAを削除し、氏名・学校・最終更新日・リンクに置換。`© 2025` を動的年に修正
- `site/app/page.tsx` の構成を更新

**Acceptance Criteria**:
- [ ] 「無料で相談する」「無料相談」がサイト上から消えている
- [ ] 「依頼」「納品」「選ばれる理由」といった受注文脈の語が消えている
- [ ] フッターの著作権年が現在年になっている
- [ ] ページ全高（390px）が現在の 8,406px より短縮されている
- [ ] `npm run build` が成功する

**Affected Files**: `site/app/page.tsx`, `site/components/CTA.tsx`, `Process.tsx`, `Trust.tsx`, `Footer.tsx`
**Dependencies**: ISSUE-P1-01

---

## ISSUE-P1-04: 作品データをコンテンツ層に分離し型を定義する

| | |
|---|---|
| **Priority** | P1 |
| **Impact** | 大（以降のすべての作品関連 Issue の前提） |
| **Effort** | 中 |
| **Reason** | 作品データが `MVPGrid.tsx` にハードコードされており、追加のたびにUIコンポーネントを編集する必要がある。作品が増えると破綻する |

**Purpose**: 作品データをUIから分離し、一覧・詳細・フィルタの土台を作る。

**Changes**:
- `site/content/projects/` を新規作成
- `site/content/projects/types.ts` に `Project` 型を定義（`06_information_architecture.md` セクション3の型に準拠）
  - `tier` / `categories` / `team` / `period` / `stack` / `thumbnail` を必須項目に含める
- 既存5作品を `<slug>.ts` に移行
- `site/content/projects/index.ts` で配列として export
- `MVPGrid.tsx` はデータを import するだけに変更

**Acceptance Criteria**:
- [ ] `MVPGrid.tsx` に作品データのリテラルが存在しない
- [ ] `Project` 型が定義され、全作品が型チェックを通る（`tsc --noEmit`）
- [ ] 表示結果が変更前と同一（技術タグ修正分を除く）
- [ ] `npm run build` が成功する

**Affected Files**: `site/content/projects/*`（新規）, `site/components/MVPGrid.tsx`
**Dependencies**: ISSUE-P0-01（タグ修正を反映した状態で移行する）

---

## ISSUE-P1-05: Webフォントを `next/font` で正しく読み込む

| | |
|---|---|
| **Priority** | P1 |
| **Impact** | 中〜大（意図したデザインが再現されていない） |
| **Effort** | 小 |
| **Reason** | `globals.css` の `@import` が `@tailwind` の後ろにあり、CSS仕様上無効。実測で `fonts.googleapis.com` へのリクエスト0件、`document.fonts` 登録0件。Inter / Noto Sans JP が適用されていない |

**Purpose**: 指定フォントを確実に適用しつつ、パフォーマンスを劣化させない。

**Changes**:
- `site/app/globals.css` から Google Fonts の `@import` 行を削除
- `site/app/layout.tsx` で `next/font/google` の `Inter` と `Noto_Sans_JP` を読み込み、`variable` として `<html>` に付与
- `site/tailwind.config.ts` の `fontFamily.sans` を CSS 変数参照に変更
- `display: 'swap'` / 必要なウェイトのみに絞る

**Acceptance Criteria**:
- [ ] DevTools の Network で font ファイルの読み込みが確認できる
- [ ] `document.fonts.size > 0` である
- [ ] LCP が現在の実測値（1440: 88ms）から大きく悪化していない（+200ms 以内）
- [ ] CLS が 0 のままである

**Affected Files**: `site/app/layout.tsx`, `site/app/globals.css`, `site/tailwind.config.ts`
**Dependencies**: なし

---

## ISSUE-P1-06: 作品詳細ページ `/projects/[slug]` を新設する

| | |
|---|---|
| **Priority** | P1 |
| **Impact** | 極大（v2 の中心的な差別化要素） |
| **Effort** | 大 |
| **Reason** | 詳細ページが存在せず、「なぜ作ったか / どこで詰まったか / どう解決したか」を書く場所がない。現状は興味を持った瞬間にサイト外へ出るしかない |

**Purpose**: 作品ごとに Case Study を掲載し、思考の過程を読ませる。

**Changes**:
- `site/app/projects/[slug]/page.tsx` を新規作成（`generateStaticParams` + `generateMetadata`）
- セクション: Summary / Problem・Goal / Role / Tech Stack / Architecture / Key Features / Technical Decisions / Challenges / Solutions / Security / Testing / Deployment・CI-CD / Screenshots / What I Learned / Future Improvements / Links
- `tier` に応じて表示項目を出し分ける（FEATURED=全項目、STANDARD=主要項目）
- **未記入の項目は非表示にする**（空セクションを出さない）
- 読み物レイアウト（`max-w-[68ch]`）+ デスクトップは目次

**Acceptance Criteria**:
- [ ] 全作品に詳細ページが生成され、404 にならない
- [ ] 各ページで title / description / og:image が作品ごとに出し分けられる
- [ ] 見出し階層が h1 → h2 → h3 で飛ばない
- [ ] 存在しない情報の欄が表示されない
- [ ] 390px でレイアウトが崩れない

**Affected Files**: `site/app/projects/[slug]/page.tsx`（新規）, `site/content/projects/*`
**Dependencies**: ISSUE-P1-04 / コンテンツは `09` の Q10〜Q13 の回答が必要

---

## ISSUE-P1-07: 作品サムネイル画像を用意して一覧に表示する

| | |
|---|---|
| **Priority** | P1 |
| **Impact** | 大（一覧の識別性・第一印象） |
| **Effort** | 中（撮影・書き出し作業を含む） |
| **Reason** | サイト全体で画像が0枚（`public/` すら存在しない）。作品の見た目が一切伝わらず、作品が増えると文字だけのカードの海になる |

**Purpose**: 作品を視覚的に識別できるようにする。

**Changes**:
- `site/public/images/projects/` を作成
- 各作品のデモ画面を撮影し、WebP で書き出し（推奨: 1200×750、200KB以下）
- `MVPCard` に `next/image` でサムネイルを追加（`sizes` 指定、`priority` は FEATURED のみ）
- 詳細ページ用のスクリーンショット（2〜4枚 + キャプション）も同時に用意

**Acceptance Criteria**:
- [ ] 全作品にサムネイルが表示される
- [ ] `next/image` を使用し、WebP/AVIF が配信される
- [ ] CLS が 0 のまま（width/height または aspect-ratio 指定）
- [ ] 一覧ページの転送量増加が 1MB 以内に収まっている
- [ ] すべての画像に意味のある `alt` がある

**Affected Files**: `site/public/images/projects/*`（新規）, `site/components/MVPCard.tsx`, `site/next.config.mjs`
**Dependencies**: ISSUE-P1-04

---

## ISSUE-P1-08: favicon と OG 画像を追加する

| | |
|---|---|
| **Priority** | P1 |
| **Impact** | 中〜大（Consoleエラー解消 + SNS共有時の見え方） |
| **Effort** | 小 |
| **Reason** | `/favicon.ico` が 404（唯一のConsoleエラー）。`og:image` がないため Slack / Discord / X に貼ると文字だけのカードになる。就活では教員・採用担当にURLを共有する場面が多い |

**Purpose**: タブと共有プレビューで認識されるようにする。

**Changes**:
- `site/app/icon.png`（または `favicon.ico`）を追加
- `site/app/opengraph-image.tsx`（または静的 `og.png` 1200×630）を追加
- `site/app/layout.tsx` の `metadata` に `metadataBase` / `openGraph.url` / `openGraph.siteName` / `twitter.card: 'summary_large_image'` を追加

**Acceptance Criteria**:
- [ ] `/favicon.ico`（または `/icon.png`）が 200 を返す
- [ ] Console エラーが 0 件になる
- [ ] `og:image` が HTML に出力される
- [ ] OGP デバッガ（またはSlackへの貼り付け）で画像付きプレビューが表示される

**Affected Files**: `site/app/icon.png`（新規）, `site/app/opengraph-image.tsx`（新規）, `site/app/layout.tsx`
**Dependencies**: ISSUE-P1-01（氏名をOG画像に入れる場合）

---

## ISSUE-P1-09: 主要CTAのコントラストを WCAG AA に適合させる

| | |
|---|---|
| **Priority** | P1 |
| **Impact** | 中（アクセシビリティ + 「見た目だけでなく基準を理解している」証明） |
| **Effort** | 極小 |
| **Reason** | 実測126サンプル中4件が不合格。すべて主要CTA（白文字 on `brand-600` #0284c7 = **4.1:1**、要求 4.5:1） |

**Purpose**: すべてのテキストを WCAG 2.2 AA に適合させる。

**Changes**:
- CTAボタン背景を `brand-600` → `brand-700`(#0369a1) に変更、または文字色を濃色に
- `site/tailwind.config.ts` にCTA用の専用トークンを定義して再利用可能にする

**Acceptance Criteria**:
- [ ] すべてのテキストのコントラスト比が 4.5:1（大きい文字は 3:1）以上
- [ ] ホバー状態・フォーカス状態でも基準を満たす

**Affected Files**: `site/tailwind.config.ts`, `site/components/*.tsx`
**Dependencies**: なし

---

# P2 — MEDIUM

## ISSUE-P2-01: リンクテキストを一意にする

| | |
|---|---|
| **Priority** | P2 / **Impact** 中 / **Effort** 小 |
| **Reason** | 「デモを見る」×5、「設計・コードを見る」×6、「無料で相談する」×3（遷移先2種）。スクリーンリーダーのリンク一覧で判別不能。WCAG 2.4.4 / 2.4.9 |

**Changes**: `aria-label="<作品名>のデモを見る"` を付与、またはリンクテキスト自体に作品名を含める。
**AC**: [ ] 同一テキストで異なる遷移先のリンクが0件 [ ] アクセシブルネームが一意
**Files**: `site/components/MVPCard.tsx`, `Footer.tsx`
**Deps**: なし

## ISSUE-P2-02: タップターゲットを24px以上にする

| | |
|---|---|
| **Priority** | P2 / **Impact** 中 / **Effort** 極小 |
| **Reason** | 高さ20pxのリンクが12件。WCAG 2.2 SC 2.5.8 未達 |

**Changes**: カード内・フッターのテキストリンクに `py-2`（またはボタン化）で 44px 相当を確保。
**AC**: [ ] すべてのインタラクティブ要素が 24×24px 以上（推奨44px） [ ] 390px でレイアウトが崩れない
**Files**: `site/components/MVPCard.tsx`, `Footer.tsx`
**Deps**: なし

## ISSUE-P2-03: `prefers-reduced-motion` に対応する

| | |
|---|---|
| **Priority** | P2 / **Impact** 小〜中 / **Effort** 極小 |
| **Reason** | 実測で reduce 指定時も `scroll-behavior: smooth` と28件の transition がそのまま |

**Changes**: `globals.css` に `@media (prefers-reduced-motion: reduce)` を追加し、`scroll-behavior: auto` と transition/animation の無効化。
**AC**: [ ] reduce エミュレーション時に `scroll-behavior` が `auto` [ ] transition が無効化される
**Files**: `site/app/globals.css`
**Deps**: なし

## ISSUE-P2-04: フォーカスインジケータをダークテーマ用に設計する

| | |
|---|---|
| **Priority** | P2 / **Impact** 中 / **Effort** 小 |
| **Reason** | UAデフォルト `outline: auto 1px #005FCC` が `surface-950` 背景で視認しづらい |

**Changes**: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500` 等を共通適用。
**AC**: [ ] 全フォーカス可能要素で輪郭が明確 [ ] コントラスト 3:1 以上 [ ] マウス操作時には出ない（`focus-visible`）
**Files**: `site/app/globals.css`, 各コンポーネント
**Deps**: なし

## ISSUE-P2-05: 装飾アイコンに `aria-hidden` を付与する

| | |
|---|---|
| **Priority** | P2 / **Impact** 小 / **Effort** 極小 |
| **Reason** | lucide の SVG 40個すべてが `aria-hidden` なしでアクセシビリティツリーに露出 |

**Changes**: 装飾目的の `<Icon />` に `aria-hidden="true"` を付与。意味を持つアイコンには `aria-label` を付ける。
**AC**: [ ] 装飾SVGが支援技術に露出しない
**Files**: 全コンポーネント
**Deps**: なし

## ISSUE-P2-06: robots.txt / sitemap.xml / canonical を追加する

| | |
|---|---|
| **Priority** | P2 / **Impact** 小〜中 / **Effort** 小 |
| **Reason** | いずれも404。作品詳細ページを作る前提では sitemap の価値が上がる |

**Changes**: `site/app/robots.ts` と `site/app/sitemap.ts` を追加。`metadata.alternates.canonical` を設定。
**AC**: [ ] `/robots.txt` `/sitemap.xml` が 200 [ ] sitemap に全作品詳細URLが含まれる [ ] canonical が出力される
**Files**: `site/app/robots.ts`（新規）, `site/app/sitemap.ts`（新規）, `site/app/layout.tsx`
**Deps**: ISSUE-P1-06

## ISSUE-P2-07: About ページ / セクションを作る

| | |
|---|---|
| **Priority** | P2 / **Impact** 大 / **Effort** 中（文章は本人） |
| **Reason** | 人物像が皆無。導線B（Home→About→Skills→Projects）が1ステップ目で成立しない |

**Changes**: トップに要約4行、`site/app/about/page.tsx` に詳細（現在地 / 今やっていること / 興味の方向 / これから / 経歴）。400〜600字。
**AC**: [ ] 氏名・学校・学年・興味分野・将来像が記載されている [ ] 履歴書の全文転記になっていない [ ] TODO のまま公開される箇所がない
**Files**: `site/app/about/page.tsx`（新規）, `site/components/AboutSummary.tsx`（新規）
**Deps**: `09` Q1〜Q5, Q8

## ISSUE-P2-08: Skills セクションを作る（作品へのリンク付き）

| | |
|---|---|
| **Priority** | P2 / **Impact** 大 / **Effort** 中 |
| **Reason** | 技術情報が作品タグのみ。何ができる人か技術面から評価できない |

**Changes**: 3段構成（主に使ってきたもの / 学習中 / 関心領域）。各技術から使用作品へリンク。**スキルバー・％表記は作らない**。
**AC**: [ ] ％表記・レベルバーが存在しない [ ] 「主に使用」の各技術に対応作品リンクがある [ ] 「学習中」と「主に使用」が視覚的に区別されている
**Files**: `site/app/skills/page.tsx`（新規）, `site/content/skills.ts`（新規）
**Deps**: ISSUE-P1-04, `09` Q6〜Q7

## ISSUE-P2-09: 作品一覧ページ `/projects` と領域フィルタを作る

| | |
|---|---|
| **Priority** | P2 / **Impact** 大 / **Effort** 中 |
| **Reason** | 現在は5件フラット。今後の追加（おうちかふぇ / ここまね / it-study 等）で破綻する |

**Changes**: `site/app/projects/page.tsx` を新設。FEATURED / STANDARD / ARCHIVE の3階層表示 + 領域フィルタ（AI / Security / Network / Cloud / Web）+ 個人/チームフィルタ。
**AC**: [ ] 全作品が一覧に表示される [ ] フィルタがキーボードで操作できる [ ] フィルタ状態が URL に反映される（共有可能） [ ] 0件時のメッセージがある
**Files**: `site/app/projects/page.tsx`（新規）, `site/components/ProjectFilter.tsx`（新規）
**Deps**: ISSUE-P1-04, ISSUE-P1-06

## ISSUE-P2-10: カスタム404ページを作る

| | |
|---|---|
| **Priority** | P2 / **Impact** 小 / **Effort** 極小 |
| **Reason** | 現在は Next.js デフォルト。授業要件（404の確認・HTTPステータスの理解）の説明材料になる |

**Changes**: `site/app/not-found.tsx` を追加。トップ・作品一覧への導線を置く。
**AC**: [ ] 存在しないURLで 404 ステータスとカスタムページが返る [ ] トップへ戻る導線がある
**Files**: `site/app/not-found.tsx`（新規）
**Deps**: なし

## ISSUE-P2-11: リポジトリ README とGitHub表示情報を整備する

| | |
|---|---|
| **Priority** | P2 / **Impact** 大 / **Effort** 小〜中 |
| **Reason** | `portfolio-mvps` に README なし・description なし・topics 0件。ポートフォリオからGitHubへ飛んだ先が無説明 |

**Changes**:
- ルート `README.md` を作成（概要 / 公開URL / 技術構成 / ローカル起動手順 / ディレクトリ構成 / スクリーンショット）
- GitHub の description と topics（`portfolio` `nextjs` `typescript` `tailwindcss` 等）を設定
- 各MVPリポジトリにも最小限の README（概要・技術・デモURL・セットアップ・環境変数の説明）

**AC**: [ ] `README.md` がルートに存在する [ ] GitHub上で description と topics が表示される [ ] README に公開URLとスクリーンショットが含まれる
**Files**: `README.md`（新規）, 各MVPリポジトリ
**Deps**: ISSUE-P1-07（スクリーンショット）

## ISSUE-P2-12: メールアドレスの露出を緩和する

| | |
|---|---|
| **Priority** | P2 / **Impact** 小 / **Effort** 小 |
| **Reason** | `rascal.devops@gmail.com` がHTML内に平文で3箇所。スクレイピング対象になる |

**Changes**: 表示を1箇所に集約。必要に応じて JS による組み立てや画像化ではなく、**就活用の別アドレスを使う**方が実務的。
**AC**: [ ] 連絡先の表示箇所が1〜2箇所に集約されている [ ] 使用アドレスが本人の意図したものである
**Files**: `site/components/Footer.tsx`, `Contact` セクション
**Deps**: `09` Q9

## ISSUE-P2-13: CI に本体サイトのビルド + リンク検査を追加する

| | |
|---|---|
| **Priority** | P2 / **Impact** 中（授業要件のCI/CD理解） / **Effort** 小〜中 |
| **Reason** | `.github/workflows/ci.yml` が未コミット状態で存在。サイト本体のジョブが未整備。PR で緑を確認してからマージする運用の土台になる |

**Changes**: サイト本体の `npm ci` → `tsc --noEmit` → `next build` を CI に追加。可能なら外部リンクの死活チェックも。
**AC**: [ ] PR 作成時に CI が起動する [ ] main へのマージ前にビルド成功が確認できる [ ] CI が緑である
**Files**: `.github/workflows/ci.yml`
**Deps**: なし

---

# P3 — LOW

## ISSUE-P3-01: セキュリティヘッダを設定する
**P3 / Impact 小 / Effort 極小** — `next.config.mjs` の `headers()` で `X-Content-Type-Options` / `Referrer-Policy` / `X-Frame-Options`（または CSP `frame-ancestors`）/ `Permissions-Policy` を追加。**セキュリティ志望の学生として、設定してあること自体が説明材料になる。**
**AC**: [ ] 各ヘッダがレスポンスに含まれる [ ] サイトが正常に表示される

## ISSUE-P3-02: ボタン / カード / バッジをコンポーネント化する
**P3 / Impact 小〜中 / Effort 中** — 現在CTAボタンのスタイルが5箇所にコピペされ、パディングが不統一（`px-8 py-4` / `px-10 py-4` / `px-8 py-3.5`）。`cva`（導入済み）を使って `Button` / `Card` / `Badge` / `SectionHeader` を作る。
**AC**: [ ] CTAのスタイル定義が1箇所 [ ] 見た目が変わらない

## ISSUE-P3-03: 余白スケールを整理する
**P3 / Impact 小 / Effort 小** — `mb-2〜mb-16` の9段階、セクション `py-24`/`py-20` の混在を4〜5段階に整理。

## ISSUE-P3-04: コンテナ幅を見直す
**P3 / Impact 小 / Effort 極小** — 全セクション `max-w-5xl`（1024px）のため1440pxで左右余白が過大。一覧系のみ `max-w-6xl` に。

## ISSUE-P3-05: 3カラム5枚の空セル対策
**P3 / Impact 小 / Effort 小** — FEATURED 2件を横長にすれば自然に解消する（ISSUE-P2-09 と統合可能）。

## ISSUE-P3-06: Next.js / React のバージョンを揃える
**P3 / Impact 小 / Effort 小〜中** — サイト本体が Next 14 / React 18、作品群が Next 15〜16 / React 19。「最新構成」と説明するなら揃える。**ただし動作に問題はないため優先度は低い。**

---

## 一覧（優先度順）

| ID | Title | P | Impact | Effort |
|---|---|---|---|---|
| P0-01 | 技術タグを実装と一致させる | P0 | 極大 | 極小 |
| P0-02 | 根拠のない効果数値を削除 | P0 | 大 | 小 |
| P0-03 | gin_ec の秘密情報を処理 | P0 | 極大 | 中 |
| P1-01 | Hero に氏名・所属・興味分野 | P1 | 極大 | 小 |
| P1-02 | ヘッダーナビ + スキップリンク | P1 | 大 | 小〜中 |
| P1-03 | 営業セクションの削除・置換 | P1 | 大 | 小 |
| P1-04 | 作品データのコンテンツ層分離 | P1 | 大 | 中 |
| P1-05 | `next/font` でフォント修正 | P1 | 中〜大 | 小 |
| P1-06 | 作品詳細ページ新設 | P1 | 極大 | 大 |
| P1-07 | 作品サムネイル画像 | P1 | 大 | 中 |
| P1-08 | favicon / OG画像 | P1 | 中〜大 | 小 |
| P1-09 | CTAコントラスト AA 適合 | P1 | 中 | 極小 |
| P2-01 | リンクテキストの一意化 | P2 | 中 | 小 |
| P2-02 | タップターゲット24px以上 | P2 | 中 | 極小 |
| P2-03 | prefers-reduced-motion 対応 | P2 | 小〜中 | 極小 |
| P2-04 | フォーカスインジケータ設計 | P2 | 中 | 小 |
| P2-05 | 装飾アイコンの aria-hidden | P2 | 小 | 極小 |
| P2-06 | robots / sitemap / canonical | P2 | 小〜中 | 小 |
| P2-07 | About | P2 | 大 | 中 |
| P2-08 | Skills | P2 | 大 | 中 |
| P2-09 | /projects + フィルタ | P2 | 大 | 中 |
| P2-10 | カスタム404 | P2 | 小 | 極小 |
| P2-11 | README / GitHub表示情報 | P2 | 大 | 小〜中 |
| P2-12 | メールアドレス露出の緩和 | P2 | 小 | 小 |
| P2-13 | CI にビルド + リンク検査 | P2 | 中 | 小〜中 |
| P3-01〜06 | セキュリティヘッダ / コンポーネント化 / 余白 / 幅 / グリッド / バージョン | P3 | 小 | 小〜中 |
