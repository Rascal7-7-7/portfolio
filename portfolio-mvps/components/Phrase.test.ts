import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Phrase } from "./Phrase";

describe("Phrase", () => {
  it("空白を含む欧文の文節は nowrap にせず、空白で折り返せるようにする", () => {
    const html = renderToStaticMarkup(
      createElement(Phrase, { text: "Microsoft Office Specialist Excel 365" }),
    );
    expect(html).not.toContain("whitespace-nowrap");
    expect(html).toContain("Microsoft Office Specialist Excel 365");
  });

  it("文節の切れ目にだけ <wbr> を入れ、カタカナ語を割らない", () => {
    const html = renderToStaticMarkup(
      createElement(Phrase, { text: "危険な発話は、前段のポリシー層（発話のキーワード照合）で止まる" }),
    );
    const chunks = Array.from(html.matchAll(/<span class="whitespace-nowrap">(.*?)<\/span>/g), (m) => m[1]);
    expect(chunks.join("")).toBe("危険な発話は、前段のポリシー層（発話のキーワード照合）で止まる");
    expect(chunks).toContain("ポリシー層");
    expect(chunks.some((c) => c.includes("キーワード"))).toBe(true);
    expect(chunks.every((c) => !c.endsWith("ポ") && !c.endsWith("キーワー"))).toBe(true);
  });
});
