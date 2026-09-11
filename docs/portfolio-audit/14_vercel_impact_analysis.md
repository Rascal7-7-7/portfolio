# 14. Vercel 整理の影響範囲

> 作成日: 2026-09-12
> 本書は実行前の影響評価。**この時点で Vercel には一切変更を加えていない。**

---

## 前提（本人確認で判明した訂正）

| 項目 | 訂正内容 |
|---|---|
| Vercel の `2026-project` | **モックアップ用**であり、ここまねの実アプリではない |
| ここまねの Neon DB | **本人のアカウントではなく別アカウント所有**。本人はコラボレーターとして参加 → **`kokomane`（穂風org）は整理対象外** |

---

## 現状（実測・12プロジェクト）

| プロジェクト | GitHubリポジトリ | Root | 本番URL | 最終デプロイ | HTTP |
|---|---|---|---|---|---|
| portfolio-mvps | **Rascal7-7-7/portfolio** | `portfolio-mvps` | portfolio-mvps.vercel.app | 2026-09-11 | 200 |
| ai-trade | Rascal7-7-7/AI_Trade | `web` | ai-trade-nine.vercel.app | 2026-09-08 | 200 |
| dashboard-v3 | **なし**（CLIデプロイ） | `.` | dashboard-v3-blush.vercel.app | 2026-08-30 | 200 |
| ai-prompt | Rascal7-7-7/AI_prompt | `.` | ai-prompt-pied.vercel.app | 2026-07-03 | 200 |
| lp-generator | Rascal7-7-7/lp-generator | `.` | lp-generator-rho.vercel.app | 2026-07-03 | 200 |
| 2026-project | **なし**（CLIデプロイ） | `.` | 2026-project-mu.vercel.app | 2026-06-12 | 200 |
| attendance-tracking-app | Rascal7-7-7/Attendance-Tracking-App | `.` | attendance-tracking-app-inky.vercel.app | 2026-06-11 | 200 |
| mvp-booking-system | Rascal7-7-7/mvp-booking-system | `.` | mvp-booking-system.vercel.app | 2026-03-27 | 200 |
| mvp-lp-generator | Rascal7-7-7/mvp-lp-generator | `.` | mvp-lp-generator.vercel.app | 2026-03-26 | 200 |
| mvp-estimate-manager | Rascal7-7-7/mvp-estimate-manager | `.` | mvp-estimate-manager.vercel.app | 2026-03-29 | 200 |
| mvp-subscription-ec | Rascal7-7-7/mvp-subscription-ec- | `.` | mvp-subscription-ec.vercel.app | 2026-03-31 | 200 |
| mvp-freelance-manager | Rascal7-7-7/mvp-freelance-manager | `.` | mvp-freelance-manager.vercel.app | 2026-03-31 | 200 |

**全12プロジェクトが 200 で稼働中。カスタムドメインは1つもなく、すべて `*.vercel.app` が1件ずつ。**

`portfolio-mvps` の Git 連携は、GitHub のリネーム（`portfolio-mvps` → `portfolio`）に**正しく追従している**。

---

## 候補A: `portfolio-mvps` → `portfolio` にリネーム

### 何が起きるか

**`portfolio-mvps.vercel.app` が使えなくなり、`portfolio.vercel.app`（または空きがなければ別名）に変わる。**
Vercel はプロジェクト名から既定ドメインを生成するため、リネームすると旧ドメインは解放される。

### 影響を受けるもの（実測）

| 箇所 | 内容 | 対応 |
|---|---|---|
| `portfolio-mvps/app/layout.tsx` | `metadataBase` / `canonical` / `og:url` に旧URLをハードコード | **必ず同時修正**。放置すると canonical と og:url が存在しないURLを指す |
| `docs/portfolio-audit/*.md` 3件 | 監査記録内の記述 | 追記で対応（履歴なので書き換えない） |
| GitHub リポジトリの homepage 設定 | `https://portfolio-mvps.vercel.app` | 要更新 |
| OG画像のURL | `portfolio-mvps.vercel.app/opengraph-image.png` | metadataBase 修正で自動追従 |
| **外部に共有済みのURL** | 学校への提出、採用担当への提示、SNS投稿など | **追跡不能。ここが最大のリスク** |

### リスク評価

**中〜高。** 技術的な作業自体は10分だが、**すでに人に渡したURLが無言で死ぬ**。
リダイレクトを張るには、旧名のプロジェクトを別途作って転送するなどの手当てが必要で、無料枠では手間に見合わない。

### 推奨

**今はやらない。** 実害は「GitHubが `portfolio`、Vercelが `portfolio-mvps` で名前が揃っていない」という見た目だけで、機能上の問題はない。

やるなら **Portfolio v2 の公開と同時**（どうせ大きく変わるタイミングで、周知もまとめてできる）。
さらに言えば、そのタイミングで**独自ドメインを取る**方が、今後こうしたURL変更に振り回されなくなる。

---

## 候補B: `ai-prompt` の削除

| 項目 | 内容 |
|---|---|
| URL への参照 | **0件**（`~/work` 配下を全検索） |
| GitHubリポジトリ | `Rascal7-7-7/AI_prompt` は**現役 public**（アーカイブ解除済み） |
| 最終デプロイ | 2026-07-03（約2ヶ月前） |
| 関連する Neon | `AI_prompt` プロジェクト（30.5MB）が残っている |

### 影響

`ai-prompt-pied.vercel.app` が消える。**参照がないため、リンク切れは発生しない。**
ただし GitHub リポジトリは現役なので、再びデプロイしたくなった場合は Vercel プロジェクトの作り直しが必要になる。

### 推奨

**削除して問題ない。** ただし得られるものは「一覧が1行減る」ことだけで、**Hobby プランはプロジェクト数に課金されない**ため、実利はほぼない。
Neon 側の `AI_prompt`（30.5MB）を一緒に消すなら、ストレージ削減の意味は出る。

---

## 候補C: `lp-generator` の削除

| 項目 | 内容 |
|---|---|
| URL への参照 | 1件（`_cleanup/neon-backups/lp-generator.json` = 私が取ったバックアップのみ） |
| GitHubリポジトリ | `Rascal7-7-7/lp-generator` は **private・現役**（69コミット、2026-07-03） |
| **Neon の DB** | **2026-09-11 に削除済み**（本人承認のうえ実施、JSONへ退避済み） |

### ⚠️ 注意

**このアプリのデータベースは既に存在しない。** HTTPは 200 を返すが、DBに触る画面は動作しない可能性が高い。
つまり**現時点で「公開されているが壊れている可能性のあるサイト」**になっている。

### 推奨

**削除を推奨。** DB がない以上、公開しておく意味がない。
GitHub リポジトリ（private・69コミット）は残るので、作り直したくなれば復元できる。

---

## 候補D: `2026-project`

| 項目 | 内容 |
|---|---|
| 実体 | **モックアップ用**（本人確認済み）。ここまねの実アプリではない |
| Git 連携 | **なし**（CLI からデプロイ） |
| URL への参照 | `2026-project-mu.vercel.app` は **0件** |

### 影響

**対応不要。** むしろ**私の監査ドキュメント側が間違っている**。
`docs/portfolio-audit/11` と `13` に「READMEが指す `2026-project.vercel.app` が404」と書いたが、これは**モックアップ用のプロジェクトを実アプリと誤認した記述**だった。訂正が必要。

### 推奨

**Vercel は触らない。ドキュメントを訂正する。**

---

## 候補E: 触ってはいけないもの

| プロジェクト | 理由 |
|---|---|
| **MVP 5本**（booking / lp-generator / estimate / subscription-ec / freelance） | **ポートフォリオ本体から直接リンクしている**（`content/projects/*.ts` に本番URLを記載）。消すとポートフォリオのデモ導線が全滅する |
| **attendance-tracking-app** | 掲載予定（STANDARD tier）。デモアカウント方式で使う |
| **portfolio-mvps** | ポートフォリオ本体 |
| **dashboard-v3** | `automation/dashboard-v3/scripts/deploy.sh` が参照。運用中 |
| **ai-trade** | 掲載保留中の候補 |

---

## GitHub 側のアーカイブとの関係（補足）

`13_dual_purpose_and_cleanup.md` で「MVP 5リポジトリをアーカイブする」と決めたが、**これらは Vercel プロジェクトと Git 連携している**。

- アーカイブしても **既存のデプロイは生き続ける**
- アーカイブ後も**リポジトリは読み取り可能**なので、Vercel からの再デプロイ自体は可能
- 塞がるのは「新しいコミットを push して自動デプロイする」経路

→ **アーカイブしても、デモが落ちることはない。** ただし `mvp-booking-system` は改修対象なので、アーカイブ対象から外す方針は維持する。

---

## まとめ（推奨アクション）

| 候補 | 推奨 | 理由 |
|---|---|---|
| A. `portfolio-mvps` のリネーム | **やらない**（v2公開時に、独自ドメインとセットで検討） | 共有済みURLが無言で死ぬ。実害は見た目だけ |
| B. `ai-prompt` の削除 | **任意**（実利はほぼない。Neon側と一緒なら意味あり） | 参照0件 |
| C. `lp-generator` の削除 | **推奨** | **DBを既に削除済みで、壊れた状態で公開されている** |
| D. `2026-project` | **触らない**（ドキュメントを訂正する） | モックアップ用と判明 |
| E. その他7件 | **触らない** | 稼働中・参照あり |

**実質的にやる価値があるのは C だけ**で、B は好みの範囲。A は時期を選ぶべき、という結論になる。
