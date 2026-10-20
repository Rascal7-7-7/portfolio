export type Interval = 'once' | 'monthly' | 'bimonthly';
export type SubscriptionInterval = Exclude<Interval, 'once'>;
export type TaxRate = 8 | 10;

export type PackageShape = 'bag' | 'tin' | 'jar' | 'pump' | 'bottle' | 'box';

/** ラベルに添える、素材にちなんだ小さな印 */
export type Motif = 'bean' | 'tea' | 'wheat' | 'hinoki' | 'petal' | 'herb';

export type Visual = {
  shape: PackageShape;
  motif: Motif;
  /** 背景グラデーション */
  from: string;
  to: string;
  /** パッケージ本体の色 */
  ink: string;
  /** ラベル・装飾の差し色 */
  accent: string;
};

export type Product = {
  id: string;
  name: string;
  /** 改行してよい位置で区切った商品名（join すると name。空白は単独要素） */
  nameParts: ReadonlyArray<string>;
  nameEn: string;
  category: string;
  /** 文節ごとに区切ったひとこと・説明文（join すると本文） */
  taglineParts: ReadonlyArray<string>;
  descriptionParts: ReadonlyArray<string>;
  /** 税込の通常価格（円） */
  price: number;
  taxRate: TaxRate;
  badge?: string;
  specs: ReadonlyArray<{ label: string; value: string }>;
  /** 味・使い心地の目安。value は low 側を 1 とした 5 段階 */
  taste: ReadonlyArray<TasteAxis>;
  visual: Visual;
};

export type TasteAxis = { label: string; low: string; high: string; value: 1 | 2 | 3 | 4 | 5 };

export type CartItem = {
  productId: string;
  interval: Interval;
  quantity: number;
};

export type SubscriptionStatus = 'active' | 'paused' | 'canceled';

export type Subscription = {
  id: string;
  productId: string;
  interval: SubscriptionInterval;
  quantity: number;
  /** 割引後の税込単価 */
  unitPrice: number;
  status: SubscriptionStatus;
  /** YYYY-MM-DD。一時停止・解約中は null */
  nextDelivery: string | null;
  startedAt: string;
  deliveredCount: number;
  /** 次回をスキップしたときの元の日付（取り消しで戻す）。古い保存データには無い */
  skippedFrom?: string | null;
  /** 間隔を変える前の次回日と間隔。月末の丸めで往復すると日付がずれないよう、ここから数え直す。古い保存データには無い */
  intervalFrom?: { date: string; interval: SubscriptionInterval } | null;
};

export type Totals = {
  listSubtotal: number;
  discount: number;
  subtotal: number;
  shipping: number;
  total: number;
  taxByRate: Record<TaxRate, number>;
};

export type OrderLine = {
  productId: string;
  interval: Interval;
  quantity: number;
  unitPrice: number;
};

export type Order = {
  id: string;
  placedAt: string;
  lines: OrderLine[];
  totals: Totals;
  firstDelivery: string;
};
