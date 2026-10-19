import type { Estimate, EstimateStatus, LineItem } from "@/types";
import { addDays } from "@/lib/utils";

/** 見積書の発行元（デモ用の架空の会社） */
export const ISSUER = {
  name: "株式会社デモワークス",
  address: "東京都千代田区架空町 1-2-3 デモワークスビル 5F",
  tel: "03-0000-0000",
  registration: "T1234567890123（デモ）",
} as const;

export const VALID_DAYS = 30;

/** フォームで1クリック追加できる品目（単価は税抜） */
export const PRESET_ITEMS: readonly Omit<LineItem, "id">[] = [
  { name: "Webサイト設計・ディレクション", unit: "式", unitPrice: 180000, quantity: 1 },
  { name: "ページデザイン", unit: "ページ", unitPrice: 45000, quantity: 5 },
  { name: "コーディング（レスポンシブ対応）", unit: "ページ", unitPrice: 30000, quantity: 5 },
  { name: "CMS導入・設定", unit: "式", unitPrice: 120000, quantity: 1 },
  { name: "保守運用サポート", unit: "ヶ月", unitPrice: 25000, quantity: 12 },
  { name: "撮影・素材制作", unit: "日", unitPrice: 80000, quantity: 1 },
];

export const KNOWN_CLIENTS: readonly string[] = [
  "株式会社みなと不動産",
  "有限会社さくら工務店",
  "株式会社グリーンフィールド",
  "医療法人社団ひだまり会",
  "株式会社北斗精機",
  "合同会社ヤマト物流サービス",
  "一般社団法人まちづくり推進協会",
  "株式会社ミライ食品",
];

interface SeedRow {
  client: string;
  contact: string;
  subject: string;
  daysAgo: number;
  status: EstimateStatus;
  items: [string, string, number, number][];
}

const ROWS: SeedRow[] = [
  {
    client: "株式会社みなと不動産",
    contact: "佐藤 健一",
    subject: "コーポレートサイト リニューアル",
    daysAgo: 1,
    // 一覧の先頭を送付済みにして、詳細→「お客様の画面を見る」→承認の流れにすぐ入れるようにする
    status: "sent",
    items: [
      ["Webサイト設計・ディレクション", "式", 180000, 1],
      ["ページデザイン", "ページ", 45000, 8],
      ["コーディング（レスポンシブ対応）", "ページ", 30000, 8],
      ["物件検索機能 開発", "式", 350000, 1],
    ],
  },
  {
    client: "有限会社さくら工務店",
    contact: "田中 美咲",
    subject: "施工事例ページ追加",
    daysAgo: 4,
    status: "draft",
    items: [
      ["ページデザイン", "ページ", 45000, 3],
      ["コーディング（レスポンシブ対応）", "ページ", 30000, 3],
      ["撮影・素材制作", "日", 80000, 1],
    ],
  },
  {
    client: "株式会社北斗精機",
    contact: "高橋 誠",
    subject: "製品カタログ LP 制作",
    daysAgo: 14,
    status: "won",
    items: [
      ["LP 構成・コピーライティング", "式", 120000, 1],
      ["ページデザイン", "ページ", 45000, 1],
      ["コーディング（レスポンシブ対応）", "ページ", 30000, 1],
      ["お問い合わせフォーム設置", "式", 40000, 1],
    ],
  },
  {
    client: "株式会社グリーンフィールド",
    contact: "伊藤 大輔",
    subject: "採用サイト制作",
    daysAgo: 21,
    status: "won",
    items: [
      ["Webサイト設計・ディレクション", "式", 180000, 1],
      ["ページデザイン", "ページ", 45000, 6],
      ["コーディング（レスポンシブ対応）", "ページ", 30000, 6],
      ["CMS導入・設定", "式", 120000, 1],
      ["社員インタビュー撮影", "日", 80000, 2],
    ],
  },
  {
    client: "医療法人社団ひだまり会",
    contact: "鈴木 由紀",
    subject: "Web予約導線の改善",
    daysAgo: 25,
    status: "sent",
    items: [
      ["現状分析・改善提案", "式", 150000, 1],
      ["予約フォーム改修", "式", 220000, 1],
      ["保守運用サポート", "ヶ月", 25000, 6],
    ],
  },
  {
    client: "合同会社ヤマト物流サービス",
    contact: "渡辺 翔太",
    subject: "配送状況ページ 改修",
    daysAgo: 27,
    status: "lost",
    items: [
      ["要件定義", "人日", 60000, 3],
      ["画面改修", "人日", 55000, 8],
    ],
  },
  {
    client: "株式会社ミライ食品",
    contact: "山本 彩",
    subject: "EC サイト 保守契約（年間）",
    daysAgo: 33,
    status: "won",
    items: [
      ["保守運用サポート", "ヶ月", 25000, 12],
      ["月次レポート作成", "ヶ月", 15000, 12],
    ],
  },
  {
    client: "一般社団法人まちづくり推進協会",
    contact: "中村 浩二",
    subject: "イベント告知サイト",
    daysAgo: 40,
    status: "lost",
    items: [
      ["ページデザイン", "ページ", 45000, 2],
      ["コーディング（レスポンシブ対応）", "ページ", 30000, 2],
    ],
  },
  // ここから下は一覧の月別受注額（スパークライン）を見せるための過去分
  {
    client: "株式会社みなと不動産",
    contact: "佐藤 健一",
    subject: "物件写真 撮影",
    daysAgo: 52,
    status: "won",
    items: [["撮影・素材制作", "日", 80000, 3]],
  },
  {
    client: "株式会社ミライ食品",
    contact: "山本 彩",
    subject: "新商品 LP 制作",
    daysAgo: 66,
    status: "lost",
    items: [
      ["LP 構成・コピーライティング", "式", 120000, 1],
      ["ページデザイン", "ページ", 45000, 1],
    ],
  },
  {
    client: "有限会社さくら工務店",
    contact: "田中 美咲",
    subject: "コーポレートサイト 保守（半年）",
    daysAgo: 84,
    status: "won",
    items: [["保守運用サポート", "ヶ月", 25000, 6]],
  },
  {
    client: "株式会社北斗精機",
    contact: "高橋 誠",
    subject: "採用 LP 制作",
    daysAgo: 108,
    status: "won",
    items: [
      ["LP 構成・コピーライティング", "式", 120000, 1],
      ["ページデザイン", "ページ", 45000, 2],
      ["コーディング（レスポンシブ対応）", "ページ", 30000, 2],
    ],
  },
  {
    client: "医療法人社団ひだまり会",
    contact: "鈴木 由紀",
    subject: "クリニックサイト リニューアル",
    daysAgo: 140,
    status: "won",
    items: [
      ["Webサイト設計・ディレクション", "式", 180000, 1],
      ["ページデザイン", "ページ", 45000, 4],
      ["コーディング（レスポンシブ対応）", "ページ", 30000, 4],
    ],
  },
  {
    client: "株式会社グリーンフィールド",
    contact: "伊藤 大輔",
    subject: "ブランドサイト 制作",
    daysAgo: 165,
    status: "won",
    items: [
      ["ページデザイン", "ページ", 45000, 3],
      ["コーディング（レスポンシブ対応）", "ページ", 30000, 3],
    ],
  },
];

/** 今日を基準にした相対日付でダミー見積を作る。ROWS は新しい順（daysAgo 昇順）に並べ、番号順＝発行日順にする */
export function buildSeed(today: string): Estimate[] {
  return ROWS.map((row, index) => {
    const id = ROWS.length - index;
    const issuedAt = addDays(today, -row.daysAgo);
    return {
      id,
      clientName: row.client,
      contactName: row.contact,
      subject: row.subject,
      issuedAt,
      validUntil: addDays(issuedAt, VALID_DAYS),
      note: "お支払い条件：納品月末締め翌月末払い",
      status: row.status,
      items: row.items.map(([name, unit, unitPrice, quantity], i) => ({
        id: `${id}-${i}`,
        name,
        unit,
        unitPrice,
        quantity,
      })),
    };
  });
}
