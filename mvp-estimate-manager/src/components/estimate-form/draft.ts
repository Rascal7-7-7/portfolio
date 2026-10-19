import type { Estimate, EstimateInput, LineItem } from "@/types";
import { PRESET_ITEMS, VALID_DAYS } from "@/data/seed";
import { addDays, todayISO } from "@/lib/utils";

/** フォーム入力中の明細。数値は入力途中の文字列のまま持つ */
export interface DraftItem {
  id: string;
  name: string;
  unit: string;
  unitPrice: string;
  quantity: string;
}

export interface Draft extends Omit<EstimateInput, "items"> {
  items: DraftItem[];
}

const MAX_AMOUNT = 1_000_000_000;
/** 数量は小数2桁まで（例：12.5 ㎡）。金額計算 lineAmount の精度と揃える */
const QUANTITY_PATTERN = /^\d{1,6}(\.\d{1,2})?$/;

export function newItemId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function toDraftItem(item: Omit<LineItem, "id">): DraftItem {
  return {
    id: newItemId(),
    name: item.name,
    unit: item.unit,
    unitPrice: String(item.unitPrice),
    quantity: String(item.quantity),
  };
}

export function emptyItem(): DraftItem {
  return { id: newItemId(), name: "", unit: "式", unitPrice: "", quantity: "1" };
}

export function emptyDraft(): Draft {
  const issuedAt = todayISO();
  return {
    clientName: "",
    contactName: "",
    subject: "",
    issuedAt,
    validUntil: addDays(issuedAt, VALID_DAYS),
    note: "お支払い条件：納品月末締め翌月末払い",
    items: [emptyItem()],
  };
}

export function sampleDraft(): Draft {
  return {
    ...emptyDraft(),
    clientName: "株式会社ミライ食品",
    contactName: "山本 彩",
    subject: "新商品 特設サイト制作",
    items: PRESET_ITEMS.slice(0, 3).map(toDraftItem),
  };
}

export function draftFromEstimate(estimate: Estimate): Draft {
  return {
    clientName: estimate.clientName,
    contactName: estimate.contactName,
    subject: estimate.subject,
    issuedAt: estimate.issuedAt,
    validUntil: estimate.validUntil,
    note: estimate.note,
    items: estimate.items.map(toDraftItem),
  };
}

function parseAmount(value: string): number {
  return Number(value.replace(/,/g, "").trim());
}

/** プレビュー用：不正な数値は 0 として扱う */
export function toPreview(draft: Draft): EstimateInput {
  return {
    ...draft,
    items: draft.items.map((item) => {
      const unitPrice = parseAmount(item.unitPrice);
      const quantity = parseAmount(item.quantity);
      return {
        ...item,
        unitPrice: Number.isFinite(unitPrice) ? unitPrice : 0,
        quantity: Number.isFinite(quantity) ? quantity : 0,
      };
    }),
  };
}

export type ValidationResult = { ok: true; value: EstimateInput } | { ok: false; errors: string[] };

export function validateDraft(draft: Draft): ValidationResult {
  const errors: string[] = [];
  if (!draft.clientName.trim()) errors.push("取引先名を入力してください");
  if (!draft.subject.trim()) errors.push("件名を入力してください");
  if (!draft.issuedAt) errors.push("発行日を入力してください");
  if (draft.validUntil && draft.validUntil < draft.issuedAt) {
    errors.push("有効期限は発行日以降にしてください");
  }

  const filled = draft.items.filter((item) => item.name.trim() !== "");
  if (filled.length === 0) errors.push("明細を1行以上入力してください");

  const items: LineItem[] = filled.map((item, i) => {
    const unitPrice = parseAmount(item.unitPrice);
    const quantity = parseAmount(item.quantity);
    const label = `明細${i + 1}「${item.name.trim()}」`;
    if (!QUANTITY_PATTERN.test(item.quantity.replace(/,/g, "").trim()) || quantity <= 0) {
      errors.push(`${label}の数量は0より大きい数（小数は2桁まで）にしてください`);
    }
    if (!Number.isInteger(unitPrice) || unitPrice < 0 || unitPrice > MAX_AMOUNT) {
      errors.push(`${label}の単価は0〜10億円の整数（円）で入力してください`);
    }
    return { id: item.id, name: item.name.trim(), unit: item.unit.trim(), unitPrice, quantity };
  });

  if (errors.length > 0) return { ok: false, errors };
  return {
    ok: true,
    value: {
      clientName: draft.clientName.trim(),
      contactName: draft.contactName.trim(),
      subject: draft.subject.trim(),
      issuedAt: draft.issuedAt,
      validUntil: draft.validUntil,
      note: draft.note.trim(),
      items,
    },
  };
}
