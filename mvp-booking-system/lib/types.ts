export type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'canceled';

export const STATUSES: ReservationStatus[] = ['pending', 'confirmed', 'completed', 'canceled'];

export const STATUS_LABEL: Record<ReservationStatus, string> = {
  pending:   '確定待ち',
  confirmed: '確定',
  completed: '完了',
  canceled:  'キャンセル',
};

/** 担当スタイリスト（デモ用の架空の2名）。スケジュールは担当ごとの列で見る */
export const STAFF = ['山本', '石井'] as const;
export type Staff = (typeof STAFF)[number];

export function isStaff(v: unknown): v is Staff {
  return (STAFF as readonly unknown[]).includes(v);
}

/** どこから受けた予約か。「紙・LINE・電話がバラバラ」を一元化した感を出すための項目 */
export type Channel = 'line' | 'phone' | 'web' | 'walk_in';

export const CHANNELS: Channel[] = ['line', 'phone', 'web', 'walk_in'];

export const CHANNEL_LABEL: Record<Channel, string> = {
  line:    'LINE',
  phone:   '電話',
  web:     'Web',
  walk_in: '店頭',
};

export interface Menu {
  name:    string;
  minutes: number;
  price:   number;
}

export const MENUS: Menu[] = [
  { name: 'カット',                 minutes: 60,  price: 5500 },
  { name: 'カット＆カラー',         minutes: 120, price: 12100 },
  { name: 'カット＆トリートメント', minutes: 90,  price: 8800 },
  { name: 'カラーリング',           minutes: 90,  price: 7700 },
  { name: 'パーマ',                 minutes: 120, price: 11000 },
  { name: 'ヘッドスパ',             minutes: 45,  price: 4400 },
  { name: 'トリートメント',         minutes: 30,  price: 3300 },
];

export interface Reservation {
  id:                number;
  customer_name:     string;
  customer_email:    string;
  customer_phone:    string;
  reservation_date:  string; // YYYY-MM-DD（ローカル日付）
  reservation_time:  string; // HH:MM
  service_name:      string;
  note:              string;
  channel:           Channel;
  staff:             Staff;
  status:           ReservationStatus;
  confirmation_sent: boolean;
  reminder_sent:     boolean;
  created_at:        string; // ISO
  updated_at:        string; // ISO
}

/** フォームで入力する項目 */
export type ReservationInput = Pick<
  Reservation,
  | 'customer_name' | 'customer_email' | 'customer_phone'
  | 'reservation_date' | 'reservation_time' | 'service_name' | 'note' | 'channel' | 'staff'
>;

export type NotifyVia = 'LINE' | 'メール' | 'SMS';

/**
 * 確認通知をどの手段で送る想定か（モック表示用）。
 * LINE で受けた予約は LINE、それ以外はメールがあればメール、無ければ電話番号宛ての SMS。連絡先が無ければ null。
 */
export function notifyVia(r: Pick<Reservation, 'channel' | 'customer_email' | 'customer_phone'>): NotifyVia | null {
  if (r.channel === 'line') return 'LINE';
  if (r.customer_email) return 'メール';
  if (r.customer_phone) return 'SMS';
  return null;
}

export function isChannel(v: unknown): v is Channel {
  return (CHANNELS as unknown[]).includes(v);
}

export function isStatus(v: unknown): v is ReservationStatus {
  return (STATUSES as unknown[]).includes(v);
}

export function findMenu(name: string): Menu | undefined {
  return MENUS.find(m => m.name === name);
}
