/**
 * 作品データの型定義。
 *
 * 一覧・詳細・絞り込みのすべてがこの型を起点にする。
 * 表示に必要な最小限は必須、Case Study 用の項目は任意にしている。
 * 事実が確認できていない項目は、埋めずに省略する。
 */

/** 掲載の重みづけ。記述量と表示サイズを決める。 */
export type Tier = "featured" | "standard" | "archive";

/** 技術領域。一覧の絞り込みと、志望分野の裏づけに使う。 */
export type Category = "ai" | "security" | "network" | "cloud" | "web";

/** 制作体制。個人とチームで、成果の読まれ方が変わるため必ず持たせる。 */
export type Team =
  | { readonly kind: "solo" }
  | { readonly kind: "team"; readonly members: number; readonly myRole: string };

/** 閲覧者がどう確認できるか。すべてを公開デモにはできないため明示する。 */
export type Verification = "live-demo" | "demo-video" | "code-only";

/** カード上に出す短い特徴。検証できる事実だけを書く。 */
export type Highlight = {
  readonly label: string;
  /** check: 機能として存在する / data: 集計・可視化する */
  readonly type: "check" | "data";
};

/** 制作時期。進行中の作品は end を省略する。 */
export type Period = {
  /** "2026-03" 形式 */
  readonly start: string;
  readonly end?: string;
};

export type ProjectLinks = {
  readonly demo?: string;
  readonly github?: string;
  readonly article?: string;
};

export type Screenshot = {
  readonly src: string;
  readonly caption: string;
};

/** 技術選定の記録。「なぜそれを選んだか」を1問1答で持つ。 */
export type Decision = {
  readonly question: string;
  readonly answer: string;
};

/** 詰まった点と、その切り分け方・解決方法。 */
export type Challenge = {
  readonly problem: string;
  readonly investigation: string;
  readonly solution: string;
};

export type Project = {
  // ---- 一覧に必要なもの ----
  readonly slug: string;
  /** 作品名。記憶と質問の単位になるため、一覧で最も目立たせる。 */
  readonly name: string;
  /** 一言でどういうものか。40字程度。 */
  readonly headline: string;
  /** 2〜3行の説明。 */
  readonly summary: string;
  readonly tier: Tier;
  readonly categories: readonly Category[];
  readonly team: Team;
  readonly period: Period;
  /** 実装に存在する技術のみを書く。表示と実装の不一致を作らない。 */
  readonly stack: readonly string[];
  readonly highlights: readonly Highlight[];
  readonly verification: Verification;
  readonly links: ProjectLinks;
  readonly thumbnail?: string;

  // ---- 旧レイアウト互換（Phase 6 で見直す） ----
  /** 制作にかけた期間の表示。 */
  readonly duration?: string;
  /** 想定した利用者。 */
  readonly audience?: string;

  // ---- Case Study（tier に応じて記述量を変える。無い項目は省略する） ----
  readonly problem?: string;
  readonly goal?: string;
  readonly architecture?: string;
  readonly features?: readonly string[];
  readonly decisions?: readonly Decision[];
  readonly challenges?: readonly Challenge[];
  readonly security?: readonly string[];
  readonly testing?: string;
  readonly deployment?: string;
  readonly cicd?: string;
  readonly learned?: readonly string[];
  readonly futureWork?: readonly string[];
  readonly screenshots?: readonly Screenshot[];
};
