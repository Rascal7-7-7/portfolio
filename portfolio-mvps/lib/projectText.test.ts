import { describe, expect, it } from "vitest";
import { getProjectBySlug, getProjectsByTier } from "../content/projects";
import { boundaryTerms, sharedMetaItems } from "./projectText";

/**
 * トップの連作の説明は、各行から省いたメタ情報（時期・体制・確認方法・技術）を1回だけ書く。
 * 説明文の「公開デモがある」が、データ（全作品にデモのリンクがあること）とずれたら落とす。
 * 「API・DB を使わない」はデータに持たないため、ここでは検証していない。
 */
describe("業務モックアップの連作", () => {
  const series = getProjectsByTier("standard");

  it("共通の時期・体制・確認方法・技術がデータから導かれる", () => {
    expect(series).toHaveLength(5);
    expect(sharedMetaItems(series)).toEqual([
      "2026/03〜",
      "個人開発",
      "デモで操作できる",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
    ]);
  });

  it("5本とも公開デモのリンクを持つ", () => {
    for (const project of series) expect(project.links.demo, project.slug).toBeTruthy();
  });
});

describe("図と本文の語の色", () => {
  it("信頼境界の枠を持つ図の語だけを返す", () => {
    expect(boundaryTerms(getProjectBySlug("jarvis-voice-agent")!)).toEqual([
      "ポリシー層",
      "信頼境界",
    ]);
    expect(boundaryTerms(getProjectBySlug("ouchi-cafe")!)).toEqual([]);
  });
});
