/*
 * Case Study の本文用。2つのことだけをする。
 * 1. 図の信頼境界の枠と同じ語（「ポリシー層」「信頼境界」）を字の太さと濃さで示す。
 *    accent 色はリンクに見えるため使わない。
 * 2. 語の途中で折り返さないよう、日付（2026-09-12）と「カタカナ＋漢字1〜2字」の複合語
 *    （トークン方式・カタカナ表記など）、ハイフンを含む英語（--sandbox read-only・read-only）、
 *    範囲（1〜3個）をまとめる。英語の直後の「の」も行頭に来ないよう一緒にまとめる。
 */
const DATE = String.raw`\d{4}-\d{2}-\d{2}`;
const KATAKANA_COMPOUND = String.raw`[ァ-ヴー]{2,}[一-龠々]{1,2}`;
const FLAG = String.raw`--[A-Za-z][\w-]*(?: [A-Za-z][\w-]*)?(?: ?の)?`;
const HYPHENATED = String.raw`[A-Za-z0-9]+(?:-[A-Za-z0-9]+)+(?: ?の)?`;
const LATIN_NO = String.raw`[A-Za-z][\w.:]* ?の`;
const RANGE = String.raw`\d+〜\d+[一-龠ぁ-んァ-ヴ]?`;

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function RichText({ text, terms }: { text: string; terms: readonly string[] }) {
  // 語は長い順に先に試し、カタカナ複合語の規則に食われないようにする
  const sorted = [...terms].sort((a, b) => b.length - a.length).map(escape);
  const rules = [...sorted, DATE, FLAG, HYPHENATED, LATIN_NO, RANGE, KATAKANA_COMPOUND];
  const pattern = new RegExp(`(${rules.join("|")})`, "g");
  return (
    <>
      {text.split(pattern).map((part, i) => {
        if (i % 2 === 0) return part;
        const isTerm = terms.includes(part);
        return (
          <span
            key={i}
            className={isTerm ? "whitespace-nowrap font-medium text-ink" : "whitespace-nowrap"}
          >
            {part}
          </span>
        );
      })}
    </>
  );
}
