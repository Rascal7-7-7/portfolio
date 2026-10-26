import { Fragment } from "react";
import { loadDefaultJapaneseParser } from "budoux";

const parser = loadDefaultJapaneseParser();

/**
 * 短い日本語の文を、文節の切れ目でだけ折り返す。
 * BudouX で文節に分け、切れ目に <wbr> を入れたうえで、ほかの字の間では折り返さない（keep-all）。
 * CSS の word-break: auto-phrase と違い Safari でも効く。サーバーで描画するため、ブラウザに解析器は送らない。
 * 長い段落には使わない（行末がガタガタになる）。見出し・凡例・一言説明など数行の文に使う。
 */
export function Phrase({ text }: { text: string }) {
  return (
    <span className="phrase">
      {parser.parse(text).map((chunk, i) => (
        <Fragment key={i}>
          {i > 0 && <wbr />}
          {chunk}
        </Fragment>
      ))}
    </span>
  );
}
