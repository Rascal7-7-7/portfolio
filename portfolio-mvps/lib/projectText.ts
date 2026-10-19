import type { Project, Verification } from "../content/projects";

/*
 * 作品データから表示用の文字列を作る関数。JSX を含まないため、単体テストから直接読める。
 */

/** 閲覧者がどこまで確かめられるか。一覧の時点で分かるようにする。 */
const verificationLabels = {
  "live-demo": "デモで操作できる",
  "demo-video": "動画で確認できる",
  "code-only": "コードで確認できる",
} satisfies Record<Verification, string>;

export function periodLabel({ period }: Project): string {
  const start = period.start.replace("-", "/");
  return period.end ? `${start}〜${period.end.replace("-", "/")}` : `${start}〜`;
}

export function teamLabel({ team }: Project): string {
  return team.kind === "team" ? `チーム開発（${team.members}人）` : "個人開発";
}

/** 体制・確認方法・技術。MetaLine に並べる項目。 */
export function metaItems(project: Project): string[] {
  return [teamLabel(project), verificationLabels[project.verification], ...project.stack];
}

/**
 * 複数の作品に共通する制作時期・体制・確認方法・技術。連作の説明に1回だけ書くために使う。
 * 「Next.js (App Router)」のような括弧の補足は外して比べる。
 */
export function sharedMetaItems(group: readonly Project[]): string[] {
  const base = (item: string) => item.replace(/\s*\(.*\)$/, "");
  const [first, ...rest] = group.map((p) => [periodLabel(p), ...metaItems(p)].map(base));
  return (first ?? []).filter((item) => rest.every((items) => items.includes(item)));
}

/** 図で信頼境界の枠を持つ段の語。括弧の補足（「（決定的）」）は外す。境界の無い図は空。 */
export function boundaryTerms(project: Project): string[] {
  const labels = (project.diagram?.steps ?? [])
    .filter((step) => step.boundary)
    .map((step) => step.label.replace(/（.*）$/, ""));
  return labels.length ? Array.from(new Set([...labels, "信頼境界"])) : [];
}

