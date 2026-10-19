import { addDays } from './date';
import type { Channel, Reservation, ReservationStatus } from './types';

/** 架空の店舗。デモ用のダミーデータ */
export const SHOP = {
  name:   'Hair Salon Lien',
  branch: '表参道店',
};

type SeedRow = [
  dayOffset: number, time: string, name: string, phone: string, email: string,
  service: string, channel: Channel, status: ReservationStatus,
  confirmation: boolean, reminder: boolean, note: string,
];

// 日付は「今日からの相対日数」で持つ。固定日付だと日が経つと「本日の予約 0件」になるため
const ROWS: SeedRow[] = [
  [-2, '10:30', '中村 健一',   '090-7712-3381', 'kenichi.n@example.jp', 'カット',                 'line',    'completed', true,  true,  ''],
  [-1, '11:00', '渡辺 由美',   '080-2245-9910', 'yumi.w@example.jp',    'カラーリング',           'web',     'completed', true,  true,  '白髪ぼかし希望'],
  [-1, '16:00', '小林 奈々',   '070-8830-1247', 'nana.k@example.jp',    'パーマ',                 'phone',   'canceled',  true,  false, '体調不良のため電話でキャンセル'],
  [0,  '10:00', '田中 花子',   '090-1234-5678', 'hanako.t@example.jp',  'カット＆カラー',         'line',    'confirmed', true,  true,  '初回来店。インスタを見て予約'],
  [0,  '11:30', '鈴木 美咲',   '080-9876-5432', 'misaki.s@example.jp',  'カット',                 'line',    'pending',   false, false, ''],
  [0,  '13:00', '山田 太郎',   '070-1111-2222', 'taro.y@example.jp',    'ヘッドスパ',             'phone',   'pending',   false, false, '頭皮が敏感。薬剤アレルギーあり（要確認）'],
  [0,  '14:30', '高橋 里奈',   '090-4567-0012', 'rina.t@example.jp',    'トリートメント',         'web',     'confirmed', true,  true,  ''],
  [0,  '16:00', '加藤 真由',   '080-3344-5566', 'mayu.k@example.jp',    'カット＆トリートメント', 'line',    'pending',   false, false, '前回と同じ長さで'],
  [0,  '18:00', '吉田 翔',     '090-6655-4433', 'sho.y@example.jp',     'カット',                 'walk_in', 'confirmed', true,  false, '仕事帰り。18時ちょうどは難しいかも'],
  [1,  '11:00', '佐藤 あゆみ', '090-3333-4444', 'ayumi.s@example.jp',   'カット＆トリートメント', 'line',    'confirmed', true,  false, ''],
  [1,  '14:00', '伊藤 さくら', '080-5555-6666', 'sakura.i@example.jp',  'カラーリング',           'phone',   'pending',   false, false, '明るめのベージュ希望'],
  [2,  '10:00', '松本 恵',     '070-2020-3030', 'megumi.m@example.jp',  'パーマ',                 'web',     'pending',   false, false, ''],
  [3,  '15:00', '井上 千尋',   '090-8181-7272', 'chihiro.i@example.jp', 'ヘッドスパ',             'line',    'confirmed', true,  false, '誕生日月クーポン利用'],
];

export function createSeed(today: string, now: Date = new Date()): Reservation[] {
  return ROWS.map(([offset, time, name, phone, email, service, channel, status, confirmation, reminder, note], i) => {
    // 登録日時は予約日の数日前にしておく
    const created = new Date(now.getTime() - (5 - offset + i) * 3600_000 * 7).toISOString();
    return {
      id: i + 1,
      customer_name: name,
      customer_phone: phone,
      customer_email: email,
      reservation_date: addDays(today, offset),
      reservation_time: time,
      service_name: service,
      note,
      channel,
      status,
      confirmation_sent: confirmation,
      reminder_sent: reminder,
      created_at: created,
      updated_at: created,
    };
  });
}
