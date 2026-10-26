import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Phrase } from "./Phrase";

describe("Phrase", () => {
  it("文節の切れ目にだけ <wbr> を入れ、カタカナ語を割らない", () => {
    const html = renderToStaticMarkup(
      createElement(Phrase, { text: "危険な発話は、前段のポリシー層（発話のキーワード照合）で止まる" }),
    );
    const chunks = html.replace(/^<span class="phrase">|<\/span>$/g, "").split("<wbr/>");
    expect(chunks.join("")).toBe("危険な発話は、前段のポリシー層（発話のキーワード照合）で止まる");
    expect(chunks).toContain("ポリシー層");
    expect(chunks.some((c) => c.includes("キーワード"))).toBe(true);
    expect(chunks.every((c) => !c.endsWith("ポ") && !c.endsWith("キーワー"))).toBe(true);
  });
});
