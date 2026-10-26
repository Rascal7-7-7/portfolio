import type { LPDoc } from './types'

/** 予約システムのお客様画面（同じポートフォリオの別 MVP） */
const BOOKING_URL = 'https://mvp-booking-system.vercel.app/book'

const ALL_SECTIONS = { features: true, greeting: true, menu: true, voices: true, access: true, cta: true } as const

// 住所・電話番号・人名はすべて架空のダミーです
export const SAMPLES: readonly LPDoc[] = [
  {
    id: '1',
    slug: 'komorebi-coffee',
    template: 'natural',
    sections: ALL_SECTIONS,
    store: {
      storeName: '木漏れ日珈琲',
      category: 'cafe',
      area: '鎌倉の自家焙煎珈琲',
      photo: '/samples/komorebi-coffee.webp',
      catchCopy: '朝の光と、一杯の深煎りを。',
      description:
        '鎌倉駅から徒歩3分。自家焙煎の豆で淹れるハンドドリップと、毎朝焼き上げるスコーンで、ゆっくりとした時間をお届けします。',
      address: '神奈川県鎌倉市御成町 0-0-0',
      hours: '8:00 – 18:00',
      closed: '毎週水曜日',
      phone: '0467-00-0000',
      ctaLabel: '席を予約する',
      features: [
        { emoji: '🫘', title: '店内で毎朝焙煎', text: '季節ごとに選んだシングルオリジンを、小さな焙煎機で焼いています。' },
        { emoji: '🥐', title: '焼きたての焼き菓子', text: 'スコーンとケーキは毎朝店内で。午前中は焼きたてに出会えます。' },
        { emoji: '🔌', title: '電源・Wi-Fi完備', text: '窓際のカウンター席は全席電源つき。お仕事や読書にも。' },
      ],
      menu: [
        { emoji: '☕', name: 'ハンドドリップ', description: '本日の豆から3種類', price: '¥580' },
        { emoji: '🥐', name: 'スコーンセット', description: 'ドリンク＋自家製スコーン', price: '¥980' },
        { emoji: '🍰', name: '季節のチーズケーキ', description: '数量限定', price: '¥620' },
      ],
      voices: [
        { name: '30代・会社員', text: '朝の通勤前に寄るのが日課に。深煎りの香りで一日が始まります。' },
        { name: '20代・学生', text: '窓際の席が落ち着いて、レポートがはかどりました。スコーンが絶品です。' },
      ],
      owner: {
        role: '店主',
        name: '森 和也',
        message: '焙煎機の前に立って十年になります。豆の具合は季節や天気で毎日変わるので、いちばんおいしい焼き加減を毎朝確かめています。「今日のおすすめは？」と気軽に聞いてください。',
        photo: '/samples/komorebi-coffee-staff.webp',
      },
    },
  },
  {
    id: '2',
    // 予約システム（mvp-booking-system）・Hikae（mvp-freelance-manager）と同じ店。LP で集客 → 予約システムで受付、の流れを見せる
    slug: 'lien-omotesando',
    template: 'modern',
    sections: ALL_SECTIONS,
    store: {
      storeName: 'Hair Salon Lien 表参道店',
      category: 'salon',
      area: '表参道の美容室',
      photo: '/samples/lien-omotesando.webp',
      reserveUrl: BOOKING_URL,
      catchCopy: '似合うを、毎日の自信に。',
      description:
        '表参道駅A2出口から徒歩2分。スタイリスト2名の小さなサロンです。骨格と髪質を見極めるカウンセリングで、朝のスタイリングが楽になるデザインをご提案します。',
      address: '東京都港区北青山 0-0-0 2F',
      hours: '10:00 – 20:00',
      closed: '年末年始',
      phone: '03-0000-0000',
      ctaLabel: 'WEB予約',
      features: [
        { emoji: '💬', title: '15分の丁寧なカウンセリング', text: '骨格・髪質・普段のお手入れを伺ってから、似合わせを設計します。' },
        { emoji: '✂️', title: '最初から最後まで同じ担当', text: 'カウンセリングから仕上げまで、ひとりのスタイリストが担当します。' },
        { emoji: '🕗', title: '夜20時まで営業', text: 'お仕事帰りにも。空いている時間は24時間WEBで確認・予約できます。' },
      ],
      menu: [
        { emoji: '✂️', name: 'カット', description: 'シャンプー・ブロー込み', price: '¥5,500' },
        { emoji: '🎨', name: 'カット＆カラー', description: '白髪ぼかし・透明感カラー', price: '¥12,100' },
        { emoji: '💆', name: 'ヘッドスパ', description: '頭皮の汚れを落とし、血行を整えます', price: '¥4,400' },
      ],
      voices: [
        { name: '20代・会社員', text: 'くせ毛が悩みでしたが、乾かすだけでまとまるようになりました。' },
        { name: '40代・主婦', text: '白髪ぼかしの提案が的確で、伸びてきても目立ちにくいです。' },
      ],
      owner: {
        role: '担当スタイリスト',
        name: '山本 葵',
        message: '「朝、乾かすだけでまとまる」を目標に、毎回カウンセリングから始めます。くせや生えぐせも、活かし方しだいで扱いやすいデザインになります。気になっていることは何でもお話しください。',
        photo: '/samples/lien-omotesando-staff.webp',
      },
    },
  },
  {
    id: '3',
    slug: 'hidamari-seitai',
    template: 'pop',
    sections: ALL_SECTIONS,
    store: {
      storeName: 'ひだまり整体院',
      category: 'seitai',
      area: '吉祥寺の整体院',
      photo: '/samples/hidamari-seitai.webp',
      catchCopy: 'その肩こり、根本から軽くしませんか。',
      description:
        '吉祥寺駅から徒歩5分。姿勢と骨盤のバランスを確認し、ボキボキしないやさしい施術で、くり返す不調を根本からケアします。',
      address: '東京都武蔵野市吉祥寺本町 0-0-0',
      hours: '9:00 – 21:00',
      closed: '不定休',
      phone: '0422-00-0000',
      ctaLabel: '初回予約はこちら',
      features: [
        { emoji: '🩺', title: '姿勢チェックつき', text: '施術前後の姿勢を写真で比べて、変化を一緒に確認します。' },
        { emoji: '🤲', title: 'ボキボキしない施術', text: '筋肉と関節にやさしくアプローチ。初めての方も安心です。' },
        { emoji: '🌙', title: '夜21時まで営業', text: 'お仕事帰りにも通いやすい時間帯で営業しています。' },
      ],
      menu: [
        { emoji: '🎁', name: '初回お試し 60分', description: 'カウンセリング＋全身調整', price: '¥3,980' },
        { emoji: '🦴', name: '骨盤矯正', description: '産後の方にもおすすめ', price: '¥5,500' },
        { emoji: '💆', name: '肩こり集中ケア', description: 'デスクワークの方に人気', price: '¥4,400' },
      ],
      voices: [
        { name: '30代・エンジニア', text: '長年の肩こりがかなり楽に。姿勢の写真で変化が分かるのが嬉しいです。' },
        { name: '50代・自営業', text: '痛くない施術で安心しました。夜遅くまで開いているので通いやすいです。' },
      ],
      owner: {
        role: '院長',
        name: '日向 誠',
        message: '開業前は整形外科で8年間リハビリを担当していました。痛みを我慢しながら通う方を多く見てきたので、ここでは強く押したり鳴らしたりしない施術にこだわっています。まずはお体の状態を一緒に確かめるところから始めましょう。',
        photo: '/samples/hidamari-seitai-staff.webp',
      },
    },
  },
]

export const findSampleById = (id: string) => SAMPLES.find((s) => s.id === id)
export const findSampleBySlug = (slug: string) => SAMPLES.find((s) => s.slug === slug)
