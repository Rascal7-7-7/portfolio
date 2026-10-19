// 架空ブランド「MORI ATELIER」のダミー商品。価格はすべて税込。
import type { Interval, Product, SubscriptionInterval } from './types';

export const BRAND = { en: 'MORI ATELIER', ja: '森の定期便' } as const;

export const DEMO_USER = {
  name: '山田 花子',
  email: 'hanako.demo@example.com',
  address: '〒150-0001 東京都渋谷区神宮前 1-2-3 森のハイツ 201',
} as const;

export const INTERVAL_LABEL: Record<Interval, string> = {
  once: '今回のみ',
  monthly: '毎月お届け',
  bimonthly: '2ヶ月ごと',
};

export const SUBSCRIPTION_INTERVALS: ReadonlyArray<SubscriptionInterval> = ['monthly', 'bimonthly'];

export const PRODUCTS: ReadonlyArray<Product> = [
  {
    id: 'forest-roast',
    name: '深森ブレンド コーヒー豆',
    nameParts: ['深森ブレンド', ' ', 'コーヒー豆'],
    nameEn: 'Forest Roast',
    category: 'コーヒー',
    tagline: '杉の香りとベリーの余韻。朝いちばんの一杯に。',
    description:
      'エチオピアとグアテマラの豆を、焙煎所で一回あたり5kgずつ小釜焙煎。深煎りなのに重すぎず、冷めても甘さが残ります。焙煎から3日以内に発送します。',
    price: 2480,
    taxRate: 8,
    badge: '定番',
    specs: [
      { label: '内容量', value: '200g（約20杯分）' },
      { label: '焙煎度', value: '深煎り' },
      { label: '産地', value: 'エチオピア / グアテマラ' },
    ],
    visual: { shape: 'bag', motif: 'bean', from: '#efe6d6', to: '#d9c6a5', ink: '#3d2c22', accent: '#c9925a' },
  },
  {
    id: 'uji-gyokuro',
    name: '宇治 特選玉露',
    nameParts: ['宇治', ' ', '特選玉露'],
    nameEn: 'Uji Gyokuro',
    category: '日本茶',
    tagline: 'とろりとした旨み。ぬるめのお湯でゆっくりと。',
    description:
      '京都・宇治の契約茶園で、新芽を覆って育てた一番茶のみを使用。60℃ほどのお湯で淹れると、出汁のような深い旨みが広がります。',
    price: 3240,
    taxRate: 8,
    specs: [
      { label: '内容量', value: '50g（缶入り）' },
      { label: '産地', value: '京都府宇治市' },
      { label: '淹れ方', value: '60℃・2分' },
    ],
    visual: { shape: 'tin', motif: 'tea', from: '#e4ecd9', to: '#c3d5ad', ink: '#2f4a2f', accent: '#b8cf8f' },
  },
  {
    id: 'honey-granola',
    name: '森のはちみつグラノーラ',
    nameParts: ['森の', 'はちみつ', 'グラノーラ'],
    nameEn: 'Honey Granola',
    category: 'フード',
    tagline: '国産はちみつと雑穀を、低温でじっくり焼き上げて。',
    description:
      '岩手の百花はちみつ、国産オーツ麦、くるみ、かぼちゃの種を140℃で90分。甘さ控えめで、ヨーグルトにもそのままでも。',
    price: 1620,
    taxRate: 8,
    specs: [
      { label: '内容量', value: '300g（瓶入り）' },
      { label: '原材料', value: 'オーツ麦、はちみつ、くるみ ほか' },
      { label: '賞味期限', value: '製造から60日' },
    ],
    visual: { shape: 'jar', motif: 'wheat', from: '#f5e9d2', to: '#e8cf9f', ink: '#6b4a2b', accent: '#d9a556' },
  },
  {
    id: 'hinoki-soap',
    name: 'ひのきのハンドソープ',
    nameParts: ['ひのきの', 'ハンドソープ'],
    nameEn: 'Hinoki Hand Soap',
    category: 'ボディケア',
    tagline: '木曽ひのきの精油で、手洗いを森林浴に。',
    description:
      '木曽ひのきの間伐材から蒸留した精油を配合。植物由来の洗浄成分で、洗い上がりはしっとり。詰め替えにも使えるガラスボトルです。',
    price: 2200,
    taxRate: 10,
    specs: [
      { label: '内容量', value: '250ml' },
      { label: '香り', value: 'ひのき・柚子' },
      { label: '生産', value: '長野県木曽町' },
    ],
    visual: { shape: 'pump', motif: 'hinoki', from: '#e7eee8', to: '#c9d8cd', ink: '#4c6a5a', accent: '#a7c4b0' },
  },
  {
    id: 'wild-toner',
    name: '和草の化粧水',
    nameParts: ['和草の', '化粧水'],
    nameEn: 'Wild Herb Toner',
    category: 'スキンケア',
    tagline: 'どくだみと月桃。ゆらぎやすい肌のための一本。',
    description:
      '国内の契約農園で育てたどくだみ・月桃・ヨモギを低温抽出。香料・着色料・アルコール不使用で、敏感な季節の肌にもなじみます。',
    price: 3960,
    taxRate: 10,
    specs: [
      { label: '内容量', value: '120ml' },
      { label: '使用目安', value: '約1.5ヶ月' },
      { label: '無添加', value: '香料・着色料・アルコール' },
    ],
    visual: { shape: 'bottle', motif: 'petal', from: '#efe5e7', to: '#d9c3c9', ink: '#7a5562', accent: '#e3b9c3' },
  },
  {
    id: 'herb-tea',
    name: '和ハーブ ブレンドティー',
    nameParts: ['和ハーブ', ' ', 'ブレンドティー'],
    nameEn: 'Herbal Blend',
    category: 'お茶',
    tagline: 'ヨモギ・クロモジ・柚子皮。夜にほっと一息。',
    description:
      'ノンカフェインの和ハーブを3種ブレンド。クロモジのすっきりした香りと柚子のほのかな酸味で、寝る前のひとときに。',
    price: 1980,
    taxRate: 8,
    badge: '新入荷',
    specs: [
      { label: '内容量', value: '15包（ティーバッグ）' },
      { label: 'カフェイン', value: 'なし' },
      { label: '産地', value: '鳥取県 / 高知県' },
    ],
    visual: { shape: 'box', motif: 'herb', from: '#f0ead8', to: '#dccfa6', ink: '#8a6b33', accent: '#e9c77b' },
  },
];

export function findProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
