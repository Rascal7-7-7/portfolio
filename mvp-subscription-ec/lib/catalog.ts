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

/** 「|」で区切った文節の配列にする（Phrases で語中改行を防ぐため） */
const phrases = (text: string): ReadonlyArray<string> => text.split('|');

export const PRODUCTS: ReadonlyArray<Product> = [
  {
    id: 'forest-roast',
    name: '深森ブレンド コーヒー豆',
    nameParts: ['深森ブレンド', ' ', 'コーヒー豆'],
    nameEn: 'Forest Roast',
    category: 'コーヒー',
    taglineParts: phrases('杉の香りと|ベリーの余韻。|朝いちばんの|一杯に。'),
    descriptionParts: phrases(
      'エチオピアと|グアテマラの|豆を、|焙煎所で|一回あたり|5kgずつ|小釜焙煎。|深煎りなのに|重すぎず、|冷めても|甘さが|残ります。|焙煎から|3日以内に|発送します。',
    ),
    price: 2480,
    taxRate: 8,
    badge: '定番',
    specs: [
      { label: '内容量', value: '200g（約20杯分）' },
      { label: '焙煎度', value: '深煎り' },
      { label: '産地', value: 'エチオピア / グアテマラ' },
    ],
    taste: [
      { label: '焙煎度', low: '浅', high: '深', value: 4 },
      { label: '酸味', low: '弱', high: '強', value: 2 },
      { label: '苦味', low: '弱', high: '強', value: 4 },
    ],
    visual: { shape: 'bag', motif: 'bean', from: '#efe6d6', to: '#d9c6a5', ink: '#3d2c22', accent: '#c9925a' },
  },
  {
    id: 'uji-gyokuro',
    name: '宇治 特選玉露',
    nameParts: ['宇治', ' ', '特選玉露'],
    nameEn: 'Uji Gyokuro',
    category: '日本茶',
    taglineParts: phrases('とろりとした|旨み。|ぬるめの|お湯で|ゆっくりと。'),
    descriptionParts: phrases(
      '京都・宇治の|契約茶園で、|新芽を|覆って|育てた|一番茶のみを|使用。|60℃ほどの|お湯で|淹れると、|出汁のような|深い旨みが|広がります。',
    ),
    price: 3240,
    taxRate: 8,
    specs: [
      { label: '内容量', value: '50g（缶入り）' },
      { label: '産地', value: '京都府宇治市' },
      { label: '淹れ方', value: '60℃・2分' },
    ],
    taste: [
      { label: '旨み', low: '弱', high: '強', value: 5 },
      { label: '渋み', low: '弱', high: '強', value: 2 },
      { label: '香り', low: '弱', high: '強', value: 3 },
    ],
    visual: { shape: 'tin', motif: 'tea', from: '#e4ecd9', to: '#c3d5ad', ink: '#2f4a2f', accent: '#b8cf8f' },
  },
  {
    id: 'honey-granola',
    name: '森のはちみつグラノーラ',
    nameParts: ['森の', 'はちみつ', 'グラノーラ'],
    nameEn: 'Honey Granola',
    category: 'フード',
    taglineParts: phrases('国産はちみつと|雑穀を、|低温で|じっくり|焼き上げて。'),
    descriptionParts: phrases(
      '岩手の|百花はちみつ、|国産オーツ麦、|くるみ、|かぼちゃの種を|140℃で|90分。|甘さ控えめで、|ヨーグルトにも|そのままでも。',
    ),
    price: 1620,
    taxRate: 8,
    specs: [
      { label: '内容量', value: '300g（瓶入り）' },
      { label: '原材料', value: 'オーツ麦、はちみつ、くるみ ほか' },
      { label: '賞味期限', value: '製造から60日' },
    ],
    taste: [
      { label: '甘さ', low: '弱', high: '強', value: 2 },
      { label: '食感', low: '軽', high: '硬', value: 4 },
    ],
    visual: { shape: 'jar', motif: 'wheat', from: '#f5e9d2', to: '#e8cf9f', ink: '#6b4a2b', accent: '#d9a556' },
  },
  {
    id: 'hinoki-soap',
    name: 'ひのきのハンドソープ',
    nameParts: ['ひのきの', 'ハンドソープ'],
    nameEn: 'Hinoki Hand Soap',
    category: 'ボディケア',
    taglineParts: phrases('木曽ひのきの|精油で、|手洗いを|森林浴に。'),
    descriptionParts: phrases(
      '木曽ひのきの|間伐材から|蒸留した|精油を配合。|植物由来の|洗浄成分で、|洗い上がりは|しっとり。|詰め替えにも|使える|ガラスボトルです。',
    ),
    price: 2200,
    taxRate: 10,
    specs: [
      { label: '内容量', value: '250ml' },
      { label: '香り', value: 'ひのき・柚子' },
      { label: '生産', value: '長野県木曽町' },
    ],
    taste: [
      { label: '香り', low: '弱', high: '強', value: 3 },
      { label: '洗い上がり', low: 'さっぱり', high: 'しっとり', value: 4 },
    ],
    visual: { shape: 'pump', motif: 'hinoki', from: '#e7eee8', to: '#c9d8cd', ink: '#4c6a5a', accent: '#a7c4b0' },
  },
  {
    id: 'wild-toner',
    name: '和草の化粧水',
    nameParts: ['和草の', '化粧水'],
    nameEn: 'Wild Herb Toner',
    category: 'スキンケア',
    taglineParts: phrases('どくだみと|月桃。|ゆらぎやすい|肌のための|一本。'),
    descriptionParts: phrases(
      '国内の|契約農園で|育てた|どくだみ・|月桃・|ヨモギを|低温抽出。|香料・|着色料・|アルコール|不使用で、|敏感な季節の|肌にも|なじみます。',
    ),
    price: 3960,
    taxRate: 10,
    specs: [
      { label: '内容量', value: '120ml' },
      { label: '使用目安', value: '約1.5ヶ月' },
      { label: '無添加', value: '香料・着色料・アルコール' },
    ],
    taste: [
      { label: '香り', low: '弱', high: '強', value: 1 },
      { label: '使用感', low: 'さっぱり', high: 'しっとり', value: 3 },
    ],
    visual: { shape: 'bottle', motif: 'petal', from: '#efe5e7', to: '#d9c3c9', ink: '#7a5562', accent: '#e3b9c3' },
  },
  {
    id: 'herb-tea',
    name: '和ハーブ ブレンドティー',
    nameParts: ['和ハーブ', ' ', 'ブレンドティー'],
    nameEn: 'Herbal Blend',
    category: 'お茶',
    taglineParts: phrases('ヨモギ・|クロモジ・|柚子皮。|夜に|ほっと|一息。'),
    descriptionParts: phrases(
      'ノンカフェインの|和ハーブを|3種ブレンド。|クロモジの|すっきりした|香りと|柚子の|ほのかな|酸味で、|寝る前の|ひとときに。',
    ),
    price: 1980,
    taxRate: 8,
    badge: '新入荷',
    specs: [
      { label: '内容量', value: '15包（ティーバッグ）' },
      { label: 'カフェイン', value: 'なし' },
      { label: '産地', value: '鳥取県 / 高知県' },
    ],
    taste: [
      { label: '香り', low: '弱', high: '強', value: 4 },
      { label: '酸味', low: '弱', high: '強', value: 2 },
      { label: '渋み', low: '弱', high: '強', value: 1 },
    ],
    visual: { shape: 'box', motif: 'herb', from: '#f0ead8', to: '#dccfa6', ink: '#8a6b33', accent: '#e9c77b' },
  },
];

export function findProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
