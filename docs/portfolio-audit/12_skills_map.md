# 12. Portfolio v2 で使うスキル・エージェント対応表

> 調査日: 2026-09-11
> 実際にインストールされているものを `~/.claude-work/skills`（68件）/ `~/.claude-work/agents`（12件）/ `~/work/.claude/skills`（4件）/ `portfolio-mvps/.claude/skills`（5件）で確認した結果。
> **既存資産だけでほぼ全工程をカバーできる。** 不足しているものは最後にまとめた。

---

## 1. フェーズ別の対応表

### Phase 1 — 情報整理（Case Study の素材を引き出す）

| スキル / エージェント | 使いどころ | 優先度 |
|---|---|---|
| **`interview-me`** | **最重要。** 「なぜ作ったか / どこで詰まったか / どう解決したか」を1問ずつ聞き出す。本人が書けずに止まっている部分を、質問で引き出す用途にそのまま合う | **★★★** |
| `doc-coauthoring` | Case Study 本文を構造化しながら共同執筆する | ★★ |
| `natural-japanese` | 書いた文章のAI臭さ除去・読みやすさ改善。**ポートフォリオの全文章に最後に通す** | **★★★** |
| `ux-strategist` | 各作品の「誰のどんな課題を解いたか」を整理する（Problem / Goal の言語化） | ★★ |

> `interview-me` は「アンダースペックな依頼から本当の意図を引き出す」スキル。
> **`09_questions_for_owner.md` の Q12〜Q16（作品ごとの思考の記録）を埋める作業に最適。**

---

### Phase 2 — 即効修正

| スキル / エージェント | 使いどころ | 優先度 |
|---|---|---|
| `fixing-metadata` / `seo`（work配下） | favicon・OG画像・canonical・robots・sitemap。**`/fixing-metadata` コマンドとしても登録済み** | ★★★ |
| `image-gen` | OG画像・作品サムネイルの生成（fal.ai / Replicate、cost-limit ゲート付き） | ★★ |
| `ai-creative-tools` | 画像生成とデザインシステム参照の入口 | ★ |
| `vercel:env` / `vercel:vercel-cli` | 環境変数とデプロイ操作 | ★ |

---

### Phase 3〜4 — データ層・デザインシステム

| スキル / エージェント | 使いどころ | 優先度 |
|---|---|---|
| `architect`（agent） | `Project` 型とコンテンツ層の設計判断 | ★★ |
| `planner`（agent） | 実装計画の分解。バックログ28件の順序詰め | ★★ |
| `coding-standards` / `frontend-patterns` | TypeScript / React の書き方の基準 | ★★ |
| `composition-patterns` | Button / Card / Badge の再利用可能なAPI設計。**boolean prop の乱立を避ける** | ★★ |
| `baseline-ui` | **AI生成UIにありがちな安っぽさを防ぐ基準。`/baseline-ui` コマンドあり** | ★★★ |
| `constraint-driven-development` | 品質基準を `CONSTRAINTS.md` として明文化し、実装中に勝手に下げられるのを防ぐ。**「LCP 300ms以内 / CLS 0.1未満 / コントラストAA」を契約として固定できる** | ★★ |

---

### Phase 5〜8 — Hero / Projects / Case Study / About・Skills

| スキル / エージェント | 使いどころ | 優先度 |
|---|---|---|
| **`dev-nextjs-frontend`** | Next.js App Router + TypeScript + Tailwind 前提の画面設計・実装。**本プロジェクトの構成と完全一致** | **★★★** |
| `frontend-design-anthropic` / `frontend-design`（work配下） | 「AIっぽい見た目」を避けた質の高いUI実装。**2つは内容が重複しているので、どちらか一方に統一すること** | ★★ |
| `cc-design` | HTMLでの高忠実度プロトタイプ。**実装前に Hero / カードの案を素早く比較する用途** | ★★ |
| `design-requirements-grill` | 実装前に要件の曖昧さ・矛盾・スコープクリープを洗い出す | ★★ |
| `react-best-practices` | Vercel Engineering のパフォーマンス指針 | ★★ |
| `nextjs-turbopack` / `vercel:nextjs` | Next.js 固有の最適化 | ★ |
| `aidesigner-frontend`（agent） | デザイン案の生成とリポジトリへの取り込み | ★ |
| `article-writing` | Case Study の長文を読ませる文章に整える | ★★ |

---

### Phase 9〜10 — アクセシビリティ / パフォーマンス / SEO

| スキル / エージェント | 使いどころ | 優先度 |
|---|---|---|
| **`web-design-guidelines`** | UIコードを Web Interface Guidelines に照らしてレビュー | **★★★** |
| `fixing-accessibility` / `accessibility`（work配下） | WCAG 2.2 対応。**本監査で出た指摘（タップ領域24px・重複リンクテキスト・aria-hidden・フォーカス表示）を直す担当。`/fixing-accessibility` コマンドあり** | ★★★ |
| `fixing-motion-performance` | `prefers-reduced-motion` 対応とアニメーション性能 | ★★ |
| `vercel-optimize` | Vercel のメトリクス実測にもとづく最適化（**推測で直さず計測から入る設計**） | ★★ |
| `performance-optimizer`（agent） | バンドルサイズ・レンダリング最適化 | ★★ |
| `seo`（work配下）/ `fixing-metadata` | 構造化データ・sitemap・メタタグ | ★★ |

---

### Phase 11 — 最終QA

| スキル / エージェント | 使いどころ | 優先度 |
|---|---|---|
| **`design-review`** | **出荷前の総合デザインレビュー。go/no-go 判定を出す。** 本監査の再実施にそのまま使える | **★★★** |
| **`webapp-testing`** | Playwright でローカルアプリを操作・検証・スクリーンショット取得。**今回CDPで手作りした監査を、以後はこれで回せる** | **★★★** |
| `e2e-testing` | Playwright の設計パターン（Page Object Model・CI連携） | ★★ |
| `code-reviewer`（agent）/ `code-review`（コマンド） | 実装のレビュー | ★★ |
| `simplify`（コマンド） | 冗長なコードの整理 | ★ |

---

### デプロイ・Git 運用（授業要件に直結）

| スキル / エージェント | 使いどころ | 優先度 |
|---|---|---|
| `git-workflow` | ブランチ戦略・コミット規約・PR運用。**授業要件の Issue→Branch→PR→Merge をここで担保** | ★★★ |
| `commit-commands:commit-push-pr` | コミット→push→PR作成を一連で | ★★ |
| `pr-review-toolkit:review-pr` | PR のレビュー | ★★ |
| `vercel:deploy` / `vercel:deployments-cicd` | デプロイとCI/CD | ★★ |
| `deployment-patterns` | デプロイ戦略一般 | ★ |
| `fewer-permission-prompts` | 作業中の権限プロンプトを減らす（付随的） | ★ |

---

## 2. 掲載作品の整備に使うスキル

### it-study のデプロイ（🟢 LIVE DEMO 化）

| スキル | 用途 |
|---|---|
| `vercel:deploy` / `vercel:env` | Vercel へのデプロイと環境変数 |
| `postgres-patterns` | Neon（PostgreSQL）のスキーマ・クエリ設計 |
| `database-migrations` | マイグレーション運用 |

### Attendance-Tracking-App のデモアカウント整備

| スキル | 用途 |
|---|---|
| `security-review` | 認証まわりを触るため。デモアカウントの権限範囲の確認 |
| `postgres-patterns` / `database-migrations` | シードデータ投入 |

### mvp-booking-system の改修（AI × セキュリティのショーケース）

**ここが最もスキルを活かせる工程。**

| スキル | 用途 | 優先度 |
|---|---|---|
| **`security-review`** | 認証・入力検証・シークレット管理・APIエンドポイントのチェックリスト | **★★★** |
| **`security-reviewer`（agent）** | OWASP Top 10・インジェクション・シークレット混入の検出 | **★★★** |
| **`claude-api`** | LLM 組み込みの実装リファレンス（モデルID・ツール使用・ストリーミング）。**LLM を扱う前に必ず読む設定になっている** | **★★★** |
| **`prompt-techniques`** | プロンプト設計。**Prompt Injection 対策を設計する前提知識** | ★★★ |
| `empirical-prompt-tuning` | サブエージェントで偏りなくプロンプト品質を評価する。**injection 耐性の検証にそのまま使える** | ★★ |
| `tdd-workflow` / `tdd-guide`（agent） | injection ペイロードを流して弾かれることをテストで証明する | ★★★ |
| `implementing-jwt-signing-and-verification` | 認証にJWTを使う場合。アルゴリズム混同・none攻撃への対策まで含む | ★★ |
| `api-design` / `backend-patterns` | API設計 | ★★ |
| `e2e-testing` / `e2e-runner`（agent） | E2E | ★★ |

### おうちかふぇ / ここまね のデモ動画・資料

| スキル | 用途 |
|---|---|
| `natural-japanese` | Case Study 本文・ナレーション原稿 |
| `image-gen` | サムネイル・OGP |
| `pptx` / `docx` | 学校提出用の資料が必要な場合 |
| `doc-updater`（agent） | README・ドキュメントの整備 |

---

## 3. ⚠️ 注意すべき点

### 3-1. プロジェクト固有スキルが「取引先向け営業」前提になっている

`portfolio-mvps/.claude/skills/` の5件は、すべて**取引先に見せるMVPを作る**という旧目的で書かれている。

| スキル | 説明文 | v2 との関係 |
|---|---|---|
| `mvp-demo-polish` | 「UI/UX/導線を、**取引先に魅せやすい形**へ調整する」 | **目的が違う** |
| `mvp-review-checklist` | 「**取引先に見せる前**のMVPチェックを行う」 | **目的が違う** |
| `mvp-scope-guard` | 「完成品に寄せず、**魅せるための最小構成**MVPとして保つ」 | **v2では逆効果**。Case Study は作り込みが要る |
| `mvp-product-builder` / `nextjs-mvp-reviewer` | MVP量産用 | MVP改修時のみ |

さらに親の `CLAUDE.md` 自体が「**取引先に『依頼したくなる』と思わせるためのポートフォリオ**」と定義しており、v2 の目的（就職活動）と食い違っている。

**対応**: Phase 3 の前に、`portfolio-mvps/CLAUDE.md` と `.claude/skills/` の目的定義を**就活ポートフォリオ用に書き換える**。これをやらないと、スキルとルールが実装を旧方針（営業LP・最小構成）へ引き戻し続ける。

### 3-2. 重複しているスキル（どちらを使うか決める）

| 重複 | 推奨 |
|---|---|
| `frontend-design-anthropic`（global）と `frontend-design`（work配下） | 内容がほぼ同一。**どちらか一方に統一**する |
| `fixing-accessibility`（global）と `accessibility`（work配下） | 前者はコマンド登録済み。**`fixing-accessibility` を主に** |
| `fixing-metadata`（global）と `seo`（work配下） | 前者はコマンド登録済み。SEO全般は `seo` を補助的に |

### 3-3. 今回の監査で使った手法は、以後 `webapp-testing` で再現できる

本監査では Playwright が未インストールだったため、Chrome headless + CDP を Python から手作りして計測した。
**`webapp-testing` スキルは Playwright 前提**なので、Phase 9〜11 の再検証時には Playwright を入れる（= 依存追加）判断が要る。監査フェーズでは禁止だったが、**実装フェーズでは入れてよい**。

---

## 4. 不足しているもの（自作を推奨）

`skill-creator` で作れる。いずれも小さく、再発防止の効果が大きい。

### ① `portfolio-fact-check`（**最優先**）

**目的**: 本監査で見つかった最大の問題（技術タグと実装の不一致）の再発防止。

```
やること:
  content/projects/*.ts の stack と、
  対応するリポジトリの package.json / requirements.txt / composer.json を突き合わせ、
  実装に存在しない技術名が書かれていたら落とす。
  効果数値（-70% 等）のような検証不可能な表現も検出する。
```

**CIに組み込めば、二度と同じ嘘が載らない。**

### ② `case-study-writer`

**目的**: Case Study の情報モデル（`03_content_audit.md` セクション5）をテンプレート化し、
「存在しない情報を埋めない」「TODO を明示する」を強制する。
`interview-me` で引き出した素材を、そのまま型に流し込む。

### ③ `recruiter-review`

**目的**: `01_recruiter_review.md` の2分テスト10項目と100点満点の採点を、いつでも再実行できるようにする。
Phase 11 の go/no-go 判定に使う（目標 75点以上）。

---

## 5. 最短の使用順（推奨）

```
Phase 1   interview-me → doc-coauthoring → natural-japanese
Phase 2   fixing-metadata → image-gen →（vercel:deploy）
Phase 3   architect(agent) → constraint-driven-development
Phase 4   composition-patterns → baseline-ui
Phase 5-8 dev-nextjs-frontend → frontend-design-anthropic → cc-design → article-writing
Phase 9   fixing-accessibility → web-design-guidelines → fixing-motion-performance
Phase 10  vercel-optimize → performance-optimizer(agent) → seo
Phase 11  design-review → webapp-testing → recruiter-review(自作)
常時      git-workflow / code-reviewer(agent) / security-reviewer(agent)
```

**先に着手すべきは2つだけ。**

1. **`portfolio-mvps/CLAUDE.md` と `.claude/skills/` の目的定義の書き換え**（3-1）— これをやらないと他のすべてが旧方針に引っ張られる
2. **`interview-me` で Phase 1 を開始**（Case Study の素材出し）— ここが全体の律速
