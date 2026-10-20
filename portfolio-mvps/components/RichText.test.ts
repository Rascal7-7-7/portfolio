import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { RichText } from "./RichText";

const nowrapParts = (text: string) =>
  Array.from(
    renderToStaticMarkup(createElement(RichText, { text, terms: [] })).matchAll(
      /<span class="whitespace-nowrap">(.*?)<\/span>/g,
    ),
    (m) => m[1],
  );

describe("RichText の折り返し防止", () => {
  it("ハイフンを含む英語・フラグ・範囲・英語の直後の「の」をまとめる", () => {
    expect(nowrapParts("argv に固定した --sandbox read-only だと確かめた")).toEqual([
      "--sandbox read-only",
    ]);
    expect(nowrapParts("read-only の制約")).toEqual(["read-only の"]);
    expect(nowrapParts("1〜3個まで")).toEqual(["1〜3個"]);
    expect(nowrapParts("Codex の設定")).toEqual(["Codex の"]);
    expect(nowrapParts("2026-09-12 時点")).toEqual(["2026-09-12"]);
  });
});
