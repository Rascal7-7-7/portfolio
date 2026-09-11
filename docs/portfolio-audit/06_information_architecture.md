# 06. Portfolio v2 情報設計（IA）と Before → After

---

## 1. Single Page か Multi Page か

### 判定: **ハイブリッド（トップは1ページ構成 + 作品のみ個別ページ）**

| 観点 | Single Page | Multi Page | 判断 |
|---|---|---|---|
| SEO | 1ページに全情報が集中。作品ごとの検索流入が取れない | 作品ごとに title / description / og:image を持てる | **MP有利**。ただし就活ポートフォリオの流入は「URLを直接渡す」が大半で、SEOの重要度は中程度 |
| 操作性 | スクロールのみで完結。迷いにくい | 遷移が発生。戻る操作が必要 | **SP有利**（トップに限る） |
| 作品増加 | **作品が10件を超えると1ページが破綻する** | 一覧+詳細で無限に拡張できる | **MP必須** |
| 保守性 | 1ファイルに全部入る＝編集が競合する | コンテンツをデータ層に分離できる | **MP有利** |
| 採用担当の閲覧行動 | 2分で全体を俯瞰したい → **スクロールが速い** | 気になった作品だけ深掘りしたい → **詳細ページが要る** | **両方必要** |

**結論**: 採用担当者の行動は「①2分で俯瞰 → ②1〜2作品だけ深掘り」の2段階。
①には Single Page の速度が、②には Multi Page の深さが必要。よって**トップページは1枚で俯瞰でき、作品だけが個別ページを持つ**構成が最適。

---

## 2. Portfolio v2 のページ構成

```
/                          トップ（1ページで俯瞰）
 ├─ Hero                   誰か・何をしているか・どこに興味があるか
 ├─ Featured Projects      代表作2〜3件（横長カード）
 ├─ About（要約）           3〜4行 + 「詳しく見る」→ /about
 ├─ Skills（要約）          主要技術のみ + 「全て見る」→ /skills
 ├─ All Projects（抜粋）    残りをコンパクトに + 「一覧へ」→ /projects
 └─ Contact                GitHub / メール / （任意）X

/projects                  作品一覧（フィルタ付き・全件）
/projects/[slug]           作品詳細（Case Study）
/about                     プロフィール詳細
/skills                    技術一覧（作品へのリンク付き）
/404                       カスタム404（現在はNext.jsデフォルト）
```

### ページ数を絞る理由

- `Experience` は独立ページにしない。**学生の職歴は量が少なく、1ページ作ると空疎になる**。About 内の「経歴」ブロックに統合する（学校 / アルバイト / インターン / 受託があれば箇条書き）。
- `Contact` も独立ページにしない。フォームを作ると送信先バックエンドが必要になり、スコープが膨らむ。**GitHub + メールのリンクで十分**。

---

## 3. 作品データモデル（v2の中核）

現状 `MVPGrid.tsx` 内にハードコードされている配列を、**コンテンツ層に分離**する。

```
content/projects/
  ├─ ouchi-cafe.ts          # おうちかふぇ（gin_ec）
  ├─ kokomane.ts            # ここまね（2026-project）
  ├─ attendance-tracker.ts
  ├─ mvp-lp-generator.ts
  ├─ mvp-booking-system.ts
  ├─ ... （残りのMVP）
  └─ index.ts               # 配列としてexport + 型定義
```

### 型定義（案）

```ts
type Tier = 'featured' | 'standard' | 'archive';
type Category = 'ai' | 'security' | 'network' | 'cloud' | 'web';
type TeamType = { kind: 'solo' } | { kind: 'team'; members: number; myRole: string };

type Project = {
  slug: string;
  title: string;              // 作品名（一覧で最も目立つ）
  oneLiner: string;           // 40字以内
  thumbnail: string;          // 必須。/images/projects/<slug>.webp
  tier: Tier;
  categories: Category[];     // 領域タグ（案Cへの布石）
  team: TeamType;
  period: { start: string; end?: string };  // "2025-10" 形式
  stack: string[];            // ★ 実装と一致させること
  links: { demo?: string; github?: string };
  // --- 以下は詳細ページ用（tier に応じて省略可） ---
  problem?: string;
  goal?: string;
  architecture?: string;
  features?: string[];
  decisions?: { question: string; answer: string }[];
  challenges?: { problem: string; investigation: string; solution: string }[];
  security?: string[];
  testing?: string;
  deployment?: string;
  cicd?: string;
  learned?: string[];
  futureWork?: string[];
  screenshots?: { src: string; caption: string }[];
};
```

**この型を先に決めることが Phase 1 の実質的な成果物**になる。型が決まれば、コンテンツ執筆（本人しか書けない部分）と実装（機械的に進められる部分）を並行できる。

---

## 4. 掲載作品の配置計画（現時点の候補）

| Tier | 作品 | 理由 | 前提条件 |
|---|---|---|---|
| **FEATURED** | **おうちかふぇ（gin_ec）** | 608コミット / 4人チーム / PHP+FastAPI+ML推薦 / 卒業・進級制作 | **鍵のローテーションとサニタイズが必須**（`04` 5-2） |
| **FEATURED** | **ここまね（2026-project）** | 568コミット / 4人チーム / Flutter+FastAPI+ローカルLLM / CI・PR運用あり | 掲載可否の本人確認 |
| **STANDARD** | Attendance-Tracking-App | **唯一テストが揃っている**（vitest 6 + Playwright 2） | — |
| **STANDARD** | MVP 5本（LP生成 / 予約 / 見積 / EC / 案件管理） | 全て本番稼働中。個人開発の幅を示す | **技術タグの修正が必須** |
| **STANDARD / 候補** | it-study | Next.js 16 + Vitest。未デプロイ | IPA問題画像の著作権確認 |
| **STANDARD / 候補** | brock_project (NetworkShield) | Swift + Network Extension。**Network領域を埋められる数少ない作品** | 規模の小ささをどう説明するか |
| **ARCHIVE** | 授業課題（karaoke-signup 等） | 一覧のみ | — |
| **掲載不可** | nox / security-training-data / tadakayo（許諾なし） | — | — |

---

## 5. Before → After（セクション別）

### Header

- **CURRENT**: `<header>` も `<nav>` も存在しない（実測0個）。ページ内移動の手段は Hero のアンカー2つのみ。
- **PROBLEM**: サイトの全体像が分からない。作品一覧・About・GitHub へ即座に行けない。最下部から戻る手段がない。スクリーンリーダーのランドマーク移動で「ナビゲーション」が使えない。
- **PROPOSED**: 固定ヘッダーを新設。左に氏名（ロゴ代わり）、右に `Projects / About / Skills / GitHub`。モバイルはハンバーガー（または最小構成として `Projects` と `GitHub` の2項目のみ表示）。スキップリンク（`メインコンテンツへスキップ`）を最上部に配置。
- **WHY**: 採用担当者の「作品はどこ？」を1クリックで解決する。WCAG 2.4.1（ブロックスキップ）／2.4.5（複数の到達手段）に対応する。

### Hero

- **CURRENT**: バッジ「小規模事業者・チーム向け 業務改善 & MVP開発」／ h1「非効率な業務を、最短で『使えるシステム』に落とし込む。」／ CTA「無料で相談する」「MVP事例を見る」。**氏名なし・学生であることの記載なし・興味分野の記載なし。**
- **PROBLEM**: 2分テストの1〜3・5項目（誰か／学生か／何を学んでいるか／興味分野）がすべて FAIL。かつCTAが営業用で、採用担当者が押す理由がない。
- **PROPOSED**:
  ```
  [氏名]（ふりがな） / ◯◯専門学校 ◯◯学科 ◯年
  h1: 一言で自分を定義する文（例: 「AIとセキュリティの交差点で、動くものを作る」）
  補足: 2〜3行。今学んでいること + 何を作ってきたか
  領域タグ: AI / Security / Network / Cloud
  CTA: [作品を見る] [GitHub]
  ```
  TODO: 氏名・学校・学年・キャッチコピーは本人確認が必要（`09` Q1〜Q4）
- **WHY**: 採用担当者が最初に確認するのは「誰か」。氏名がなければエントリーシートと突合できず、ポートフォリオとして運用できない。

### About

- **CURRENT**: **存在しない。**
- **PROBLEM**: 人物像がゼロ。技術だけが並び、なぜその技術をやっているのかが読めない。
- **PROPOSED**: トップに要約4行 + `/about` に詳細（現在地 / 今やっていること / 興味の方向 / これから）。400〜600字。経歴は箇条書きで統合。
- **WHY**: 「何ができるか」と同じくらい「どういう人か」が見られる。ただし履歴書の全文転記は逆効果なので、スクロールなしで読める分量に抑える。

### Skills

- **CURRENT**: **存在しない。** 技術情報は作品カードのタグのみ（しかも実装と不一致）。
- **PROBLEM**: 何ができる人か技術面から評価できない。かつ現在表示中のタグは Prisma / OpenAI API / Stripe / Chart.js が事実と異なる。
- **PROPOSED**: 3段構成（主に使ってきたもの / 学習中・触れたことがあるもの / 関心を持って学んでいる領域）。**各技術から使用作品へリンク**。スキルバー・％表記は作らない。
- **WHY**: 「知っている」と「説明できる」を分離しないと、面接で説明できない技術について質問されて破綻する。作品へのリンクは「その技術を何に使ったか」への回答になる。

### Projects（一覧）

- **CURRENT**: 5枚のカードがフラットに並ぶ。データは `MVPGrid.tsx` にハードコード。分類・絞り込み・序列・詳細導線・画像すべてなし。
- **PROBLEM**: 作品追加のたびにUIコンポーネントを編集する必要があり、10件を超えると閲覧者が目的の作品に辿り着けない。代表作が分からない。興味を持った瞬間にサイト外へ出るしかない。
- **PROPOSED**:
  - データを `content/projects/` に分離（上記の型定義）
  - トップは FEATURED 2〜3件（横長カード・サムネイル大）＋ その他抜粋
  - `/projects` に全件 + 領域フィルタ（AI / Security / Network / Cloud / Web）+ 個人/チーム フィルタ
  - カード必須項目: **サムネイル / 作品名 / 一言 / 主な技術3〜4 / 個人orチーム / 詳細を見る**
- **WHY**: 「一覧は選ぶための情報、詳細は評価するための情報」。現在は両者が混在した上で評価材料が欠落している。

### Project Detail（詳細）

- **CURRENT**: **存在しない。** カードが終点。
- **PROBLEM**: 本ポートフォリオ最大の構造欠陥。「なぜ作ったか」「どこで詰まったか」「どう解決したか」を書く場所がない＝**思考を見せる手段がない**。
- **PROPOSED**: `/projects/[slug]` を新設。案B（Technical Document）の読み物レイアウト。
  ```
  Summary → Problem/Goal → Role（個人/チーム・担当範囲）→ Tech Stack →
  Architecture → Key Features → Technical Decisions（なぜこの技術か）→
  Challenges（詰まった点）→ Solutions（切り分けと解決）→ Security →
  Testing → Deployment / CI-CD → Screenshots → What I Learned →
  Future Improvements → Links
  ```
  Tier に応じて記述量を変える（FEATURED=全項目 / STANDARD=主要項目 / ARCHIVE=一覧のみ）。
  **存在しない情報は書かない。** テストがない作品は「テスト: なし（今後の課題）」と正直に書く。
- **WHY**: 採用担当者と技術面接官が知りたいのは What ではなく Why と How。ここが v2 の中心的な差別化要素。

### Experience

- **CURRENT**: 存在しない。
- **PROBLEM**: 学校・チーム開発・受託経験（もしあれば）が伝わらない。特に**おうちかふぇ（4人）・ここまね（4人）というチーム開発経験が完全に埋もれている**。
- **PROPOSED**: 独立ページは作らず、About 内に時系列の箇条書きで統合。各項目から関連作品へリンク。
- **WHY**: 学生の経歴は量が少ないため独立ページにすると空疎になる。ただしチーム開発経験は採用上の重要情報なので、埋もれさせない。

### Contact

- **CURRENT**: 「無料で相談する」→ `mailto:rascal.devops@gmail.com`。CTAセクションとフッターの2箇所。
- **PROBLEM**: 文言が営業用。また同じラベル「無料で相談する」が Hero ではアンカー移動、他ではメーラー起動と**挙動が異なる**。メールアドレスが平文で3箇所露出。
- **PROPOSED**: 「連絡先」セクションに統一。GitHub / メール（+ 任意でX）。ラベルは「メールを送る」等、動作が予測できる文言に。フォームは作らない。
  TODO: 就活で使う連絡先の確認（`09` Q9）
- **WHY**: 就活では「応募後の連絡手段」であり、営業の入口ではない。同一ラベルで異なる挙動は UX・アクセシビリティ双方の問題。

### Footer

- **CURRENT**: 最終CTA（営業）+ GitHub/メール + `© 2025 All rights reserved.`。氏名なし。
- **PROBLEM**: 著作権表記が古い（監査日2026年）。誰のサイトか分からないまま終わる。最終CTAが営業。
- **PROPOSED**: 氏名 + 学校 + 最終更新日 + GitHub / メール + トップへ戻るリンク。年は動的生成。
- **WHY**: フッターは「誰のサイトか」を最後に確認する場所。最終更新日があると「今も動いている人」だと伝わる。

### Mobile

- **CURRENT**: 390px で横スクロール・崩れ・文字切れなし（実測）。ただしページ全高 **8,406px（約10画面）**。ナビゲーションがないため、下まで行くと戻れない。タップ領域20pxのリンクが12件。
- **PROBLEM**: 作品カードに到達するまでにスクロールが必要で、その先も営業セクションが続く。目的地へジャンプする手段がない。指で押しにくいリンクがある。
- **PROPOSED**: 固定ヘッダー（またはボトムナビ）でセクション移動を可能に。営業3セクション（CTA / Process / Trust）の削除でページ長を大幅短縮。テキストリンクを `py-2` でタップ領域44px確保。
- **WHY**: 授業要件「スマートフォンでも正常表示される」は既に満たしているが、**「正常表示」と「使いやすい」は別**。採用担当者はスマホで開くことが多い。

---

## 6. 授業要件との整合性チェック

| 授業で重視される項目 | 現状 | v2 での対応 |
|---|---|---|
| 実際にURLで公開されている | ✓ Vercel で稼働中 | **維持**（GitHub Pages へ移行しない） |
| スマートフォンで正常表示 | ✓ 実測で崩れなし | 維持 + ナビ追加で使いやすさ向上 |
| GitHubで開発履歴が確認できる | △ 6コミット・README なし | README 追加、v2 開発を Issue ベースで進める |
| Issue → Branch → Commit → PR → Merge | **✗ Issue 0 / PR 0 / ブランチ main のみ** | **v2 の実装を全てこのサイクルで行う**（`07` のバックログをそのまま Issue 化） |
| main を常に正常な状態に保つ | ✓ 現状 main は正常（ビルド成功） | feature ブランチ運用 + PR で main を保護 |
| 制作理由を説明する | ✗ | Case Study の Problem / Goal |
| 詰まった点を説明する | ✗ | Case Study の Challenges |
| 解決方法を説明する | ✗ | Case Study の Solutions |
| 今なら何を変えるか説明する | ✗ | Case Study の Future Improvements |
| HTTPステータスを理解する | ✓ 404は正しく404を返す | カスタム404ページを作り、実装として説明できる状態に |
| 404を確認する | ✓ 確認済み（Next.jsデフォルト） | カスタム404 + トップへ戻る導線 |
| 相対パス / 絶対パス | △ 内部アンカーのみ | 内部リンクは `next/link` の相対、外部は絶対で統一し説明できるように |
| キャッシュを理解する | △ Vercel 既定 | `cache-control` の挙動を DevTools で確認し、説明できる状態に |
| Network DevTools を利用する | — | v2 実装時に実測ログを残す（本監査の実測値が教材になる） |
| CI/CD を理解する | △ `.github/workflows/ci.yml` が未コミット | **サイト本体のビルド+リンク検査を CI に入れ、PR で緑を確認してからマージ** |

### GitHub Pages について（提案のみ・実施しない）

授業で GitHub Pages の使用が求められる場合、**本番 Vercel を置き換えるのではなく、別リポジトリで授業提出用の静的版を用意する**案を提示する。

| 方式 | 内容 | 留意点 |
|---|---|---|
| 現状維持（推奨） | 本番は Vercel のまま。授業では Vercel の URL を提出 | Next.js の App Router / 動的ルートがそのまま使える |
| 併存案 | `next build` の静的エクスポートを別リポジトリの GitHub Pages に配置 | 画像最適化・動的機能に制約。二重管理になる |

**本監査では既存の Vercel 本番環境に一切変更を加えていない。** 上記は提案のみ。
