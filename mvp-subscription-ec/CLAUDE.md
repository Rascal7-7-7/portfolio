# mvp-subscription-ec

portfolio-mvps の1つ。サブスク型 D2C EC のデモ用モックアップ（架空ブランド「MORI ATELIER / 森の定期便」）。

## Stack

- Next.js (App Router) / React / TypeScript
- Tailwind CSS、clsx + tailwind-merge、lucide-react
- DB・API・外部通信なし。商品はリポジトリ内のダミーデータ、状態は React context + localStorage
- 決済はモック UI のみ（カード情報の入力欄なし）。認証なし（マイページはデモユーザー固定）
- Vercel（`vercel.json` は現状空）

## Commands

```bash
npm run dev
npm run build
npm start
npm run lint
npm test   # 金額・お届け日計算の assert テスト（node --test）
```

## Layout

```
app/{products, products/[id], cart, checkout, complete, mypage}
components/   StoreProvider（状態）・ProductVisual（SVG の商品ビジュアル）ほか
lib/{catalog.ts, pricing.ts, date.ts, store.ts, cart.ts, types.ts}
```

## Project rules

このMVPの目的・優先フロー・やらないことは `CLAUDE.local.md` にある
（価値メッセージ、Product Goal、優先フロー、Priority、Avoid、コマンド、Execution Rules）。
重複管理を避けるためここには複製せず、そちらを参照する。

MVP共通の方針（デモ優先・レビュー基準・コマンド対応表）は親の
`portfolio-mvps/CLAUDE.md` が定める。

スキルは `.claude/skills/` から自動探索されるため、ここに一覧を持たない。
