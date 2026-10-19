export type Interval = 'once' | 'monthly' | 'bimonthly';
export type SubscriptionInterval = Exclude<Interval, 'once'>;
export type TaxRate = 8 | 10;

export type PackageShape = 'bag' | 'tin' | 'jar' | 'pump' | 'bottle' | 'box';

export type Visual = {
  shape: PackageShape;
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
  tagline: string;
  description: string;
  /** 税込の通常価格（円） */
  price: number;
  taxRate: TaxRate;
  badge?: string;
  specs: ReadonlyArray<{ label: string; value: string }>;
  visual: Visual;
};

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
