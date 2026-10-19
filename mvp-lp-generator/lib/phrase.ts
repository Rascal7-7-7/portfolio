/**
 * 見出しを「文節っぽい単位」に区切る。各単位を inline-block で包むと、語の途中で改行されない。
 * CSS の word-break: auto-phrase は Safari で効かないため、その代わり。
 * SSR とクライアントで結果が変わらないよう、辞書（Intl.Segmenter）は使わず文字種だけで判定する。
 * ponytail: 文字種ヒューリスティック（漢字/カナの後ろに続くひらがな・句読点を1単位にまとめる）。
 * 精度が足りなくなったら BudouX 等の導入を検討。
 */
const HIRAGANA = /[ぁ-ゟ]/
const KANJI = /[㐀-鿿々]/
const KATAKANA = /[ァ-ヺ]/
const CLOSING = /[、。，．！？!?）」』】〕…・ 　]/
const PREFIX = /[おご]/
const MAX_UNIT = 10

export function toPhrases(text: string): string[] {
  const chars = Array.from(text)
  const units: string[] = []
  let cur = ''
  chars.forEach((ch, i) => {
    const prev = chars[i - 1]
    const next = chars[i + 1]
    const prevIsHiraOrClose = prev !== undefined && (HIRAGANA.test(prev) || CLOSING.test(prev))
    // 接頭辞「お」「ご」＋漢字は次の語に付ける（例: ご予約）
    const isPrefix = PREFIX.test(ch) && next !== undefined && KANJI.test(next)
    const afterPrefix = prev !== undefined && PREFIX.test(prev) && KANJI.test(ch)
    const startsWord = !HIRAGANA.test(ch) && !CLOSING.test(ch) && !afterPrefix
    // 漢字→カタカナの境目も語の切れ目（例: 髪質改善|トリートメント、姿勢|チェックつき）
    const kanjiToKana = prev !== undefined && KANJI.test(prev) && KATAKANA.test(ch) && cur.length >= 2
    const breakHere = cur !== '' && ((prevIsHiraOrClose && (startsWord || isPrefix || prev === ' ' || prev === '　')) || kanjiToKana)
    if (breakHere || cur.length >= MAX_UNIT) {
      units.push(cur)
      cur = ''
    }
    cur += ch
  })
  if (cur) units.push(cur)
  return units
}
