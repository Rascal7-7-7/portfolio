/** 明細1行の数量・単価チェック（依存なし。node --test で直接テストする） */

const MAX_AMOUNT = 1_000_000_000;
/** 数量は小数2桁まで（例：12.5 ㎡）。金額計算 lineAmount の精度と揃える */
const QUANTITY_PATTERN = /^\d{1,6}(\.\d{1,2})?$/;

export function parseAmount(value: string): number {
  return Number(value.replace(/,/g, "").trim());
}

/** 保存時の検証・フォームの行内表示・プレビュー合計で共通に使う */
export function itemErrors(item: { quantity: string; unitPrice: string }): { quantity?: string; unitPrice?: string } {
  const quantity = parseAmount(item.quantity);
  const unitPrice = parseAmount(item.unitPrice);
  return {
    ...(!QUANTITY_PATTERN.test(item.quantity.replace(/,/g, "").trim()) || quantity <= 0
      ? { quantity: "数量は0より大きい数（小数は2桁まで）にしてください" }
      : {}),
    ...(!Number.isInteger(unitPrice) || unitPrice < 0 || unitPrice > MAX_AMOUNT
      ? { unitPrice: "単価は0〜10億円の整数（円）で入力してください" }
      : {}),
  };
}
