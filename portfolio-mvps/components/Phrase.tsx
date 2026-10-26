import { Fragment } from "react";
import { loadDefaultJapaneseParser } from "budoux";

const parser = loadDefaultJapaneseParser();

/**
 * 短い日本語の文を、文節の切れ目でだけ折り返す。
 * BudouX で文節に分け、各文節を折り返さない span で包み、文節の間にだけ <wbr> を置く。
 * keep-all だけに頼ると WebKit が開き括弧「（」の直後で折り返すため、文節ごとに nowrap にしている。
 * CSS の word-break: auto-phrase と違い Safari でも効く。サーバーで描画するため、ブラウザに解析器は送らない。
 * 長い段落には使わない（行末がガタガタになる）。見出し・凡例・一言説明など数行の文に使う。
 * 空白を含む文節（「Microsoft Office Specialist Excel 365」のような欧文）は nowrap にしない。
 * 1 文節として丸ごと折り返さないと、狭い画面で横にはみ出すため。欧文は空白の位置で折り返る。
 */
export function Phrase({ text }: { text: string }) {
  return (
    <span>
      {parser.parse(text).map((chunk, i) => (
        <Fragment key={i}>
          {i > 0 && <wbr />}
          {/\s/.test(chunk) ? chunk : <span className="whitespace-nowrap">{chunk}</span>}
        </Fragment>
      ))}
    </span>
  );
}
