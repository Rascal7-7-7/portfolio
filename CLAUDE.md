# Portfolio MVPs — 共通方針

## 目的

このワークスペースは、**就活**と**個人での依頼獲得**を兼ねるポートフォリオです（2026-10 に方針を更新）。
1つのサイトに、読み手ごとの入口を2つ置きます。

| 入口 | 読み手 | 伝えること |
|---|---|---|
| `/`（就活用） | 新卒エンジニアの採用担当 | 何を学び、どう考えて作ったか（AI × セキュリティが軸） |
| `/services`（依頼用） | 小さなお店・個人事業の方（X から流入） | どんな困りごとを、どう解決できるか |

5つのMVPは両方の入口から使う作例です。**完成品ではなく、3分でデモできるモックアップ**として作ります。

## MVPs

| ディレクトリ | 価値メッセージ | 分類 |
|---|---|---|
| `mvp-lp-generator` | LP制作を爆速で代替できる | 集客（LP） |
| `mvp-booking-system` | 紙やLINE管理をシステム化できる | 予約（業務） |
| `mvp-estimate-manager` | 営業の手作業を自動化できる | 営業（見積） |
| `mvp-subscription-ec` | D2C ECを作れる | 販売（EC） |
| `mvp-freelance-manager` | 個人事業の業務をまとめて管理できる | 管理（バックオフィス） |

## MVPの前提

- API・DB・外部通信は使わない。ダミーデータとブラウザ内の状態（必要なら localStorage）で動かす
- ダミーデータの日付は今日を基準にした相対日付にする（固定日付だと画面が空になる）
- 各MVPの Vercel プロジェクトは Git 連携しておらず、CLI でデプロイする（merge しても自動では更新されない）

## Priority

1. 一目で価値が伝わること
2. 3分以内でデモできること
3. UI / UX / 導線が分かりやすいこと
4. 必要最小限の機能だけで成立すること
5. 実運用前提の過剰実装を避けること

## Do

- 見せるために必要な画面を優先する
- ダミーデータや簡易実装を許容する
- 変更理由を明示する
- 修正は小さく安全に行う
- ファイル単位で整理して提案する
- コードは省略せず出す
- 実装前に、変更対象・影響範囲・最小安全案を整理する

## Don't

- 認証機能を追加しない（明示的に必要な場合のみ例外）
- 決済機能を追加しない（モックUIは許容）
- 運用管理機能を肥大化させない
- 完成品前提の拡張をしない
- 不要な抽象化をしない
- マイクロサービス化しない
- 不必要なライブラリを増やさない

## Review Standard

- 価値が一目で伝わるか
- 3分以内で説明できるか
- UIが直感的か
- 不要な機能が増えていないか
- 次の修正優先順位が明確か

## Output Rules

- まず目的を短く再確認する
- その後に最短実装順を示す
- 修正はファイル単位で整理する
- コードは省略せず提示する
- 最後に次の1手を最大3つまで示す

## コマンド対応表

| MVP | 推奨コマンド |
|---|---|
| mvp-lp-generator | `/mvp-plan` → `/auto-build-generator` → `/demo-check` |
| mvp-booking-system | `/mvp-plan` → `/auto-build-crud` → `/demo-check` |
| mvp-estimate-manager | `/mvp-plan` → `/auto-build-crud` → `/demo-check` |
| mvp-subscription-ec | `/mvp-plan` → `/auto-build-ui` → `/demo-check` |
| mvp-freelance-manager | `/mvp-plan` → `/auto-build-crud` → `/demo-check` |

## Claude Code の動作方針

- 既存構成を壊さず、最小構成で進める
- 出力はフルコード、省略なし
- 各MVPの `CLAUDE.local.md` を必ず参照してから作業する
- 不明点は破壊せず、最小安全策で進める

---

## AI Creative Tools

### Awesome Design MD（UI実装前に必ず参照）

MVP の UI 実装前に以下のデザインシステムを読み込む:

| MVP | 推奨デザインシステム | ファイルパス |
|-----|-----------------|------------|
| mvp-lp-generator | framer / webflow | `framer/DESIGN.md` |
| mvp-booking-system | notion / cal | `notion/DESIGN.md` |
| mvp-estimate-manager | stripe / airtable | `stripe/DESIGN.md` |
| mvp-subscription-ec | stripe / coinbase | `stripe/DESIGN.md` |
| mvp-freelance-manager | notion / airtable | `notion/DESIGN.md` |
| portfolio-mvps `/` | linear.app / vercel | `linear.app/DESIGN.md` |
| portfolio-mvps `/services` | notion / cal | `notion/DESIGN.md` |

ベースパス: `/Users/Rascal/work/_assets/design-md/`

### Pixa MCP（デモ用画像・OGP・バナー生成）

- MVPのデモ画像・OGP・ダミー商品写真が必要なときは Pixa を使う
- 「〇〇のバナーを作って」「デモ用の商品画像を作って」で即生成
- 生成物は各 MVP の `public/` または `assets/` ディレクトリに保存する
