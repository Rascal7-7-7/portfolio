import type { Estimate, EstimateInput, LineItem } from "@/types";
import { PRESET_ITEMS, VALID_DAYS } from "@/data/seed";
import { addDays, todayISO } from "@/lib/utils";
import { groupDigits, itemErrors, parseAmount } from "./item-check";

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

export function newItemId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function toDraftItem(item: Omit<LineItem, "id">): DraftItem {
  return {
    id: newItemId(),
    name: item.name,
    unit: item.unit,
    unitPrice: groupDigits(String(item.unitPrice)),
    quantity: String(item.quantity),
  };
}

export function emptyItem(): DraftItem {
  return { id: newItemId(), name: "", unit: "", unitPrice: "", quantity: "1" };
}

/** 今日を発行日にした日付欄。静的プリレンダーにビルド日が焼き込まれないよう、クライアントでだけ呼ぶ */
export function todayDates(): Pick<Draft, "issuedAt" | "validUntil"> {
  const issuedAt = todayISO();
  return { issuedAt, validUntil: addDays(issuedAt, VALID_DAYS) };
}

/** 日付は空のまま。作成フォームがマウント後に todayDates() で埋める */
export function emptyDraft(): Draft {
  return {
    clientName: "",
    contactName: "",
    subject: "",
    issuedAt: "",
    validUntil: "",
    note: "お支払い条件：納品月末締め翌月末払い",
    items: [emptyItem()],
  };
}

export function sampleDraft(): Draft {
  return {
    ...emptyDraft(),
    ...todayDates(),
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

/** 数量・単価が正しければ数値に直した明細、誤りがあれば null */
export function parseItem(item: DraftItem): LineItem | null {
  const e = itemErrors(item);
  if (e.quantity || e.unitPrice) return null;
  return { ...item, unitPrice: parseAmount(item.unitPrice), quantity: parseAmount(item.quantity) };
}

/** プレビュー用：数量・単価が不正な行は見積書にも合計にも入れない */
export function toPreview(draft: Draft): EstimateInput {
  return { ...draft, items: draft.items.flatMap((item) => parseItem(item) ?? []) };
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
    const label = `明細${i + 1}「${item.name.trim()}」`;
    const e = itemErrors(item);
    if (e.quantity) errors.push(`${label}の${e.quantity}`);
    if (e.unitPrice) errors.push(`${label}の${e.unitPrice}`);
    return {
      id: item.id,
      name: item.name.trim(),
      unit: item.unit.trim(),
      unitPrice: parseAmount(item.unitPrice),
      quantity: parseAmount(item.quantity),
    };
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
