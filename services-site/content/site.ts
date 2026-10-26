/**
 * 依頼用サイトの文言とデータ。
 *
 * 読み手は X から来た小さなお店・個人事業の方。技術用語を使わず、主語は「あなたの業務」にする。
 * 根拠のない効果の数字（「工数 -70%」など）は書かない。作例はすべて公開デモで触れるものだけを出す。
 */

export const owner = {
  name: "豊里拓巳",
  /** 肩書き。屋号はまだ無いので、何を作る人かで名乗る */
  role: "小さなお店・個人事業のWeb制作と業務ツールづくり",
  email: "rascal.devops@gmail.com",
  /** 就活用ポートフォリオ（技術的な詳細はそちらに置く） */
  portfolio: "https://portfolio-mvps.vercel.app",
} as const;

export type Work = {
  readonly slug: string;
  /** 困りごと（読み手の言葉で） */
  readonly pain: string;
  /** そのときに起きていること */
  readonly detail: string;
  /** 作例の名前と、何ができるか */
  readonly name: string;
  readonly solution: string;
  readonly demo: string;
  readonly image: string;
};

export const works: readonly Work[] = [
  {
    slug: "booking",
    pain: "予約を紙やLINEで受けている",
    detail: "ダブルブッキングや確認漏れが起きる。誰がいつ来るのか、ひと目で分からない。",
    name: "予約管理",
    solution: "お客様はスマホから空いている時間を選んで予約。お店は週の予定表と一覧で確認し、確認の連絡まで送れます。",
    demo: "https://mvp-booking-system.vercel.app/schedule",
    image: "/works/booking.webp",
  },
  {
    slug: "lp",
    pain: "お店の情報をまとめたページがない",
    detail: "SNSだけで案内していて、営業時間やメニュー、場所がすぐに伝わらない。",
    name: "お店の紹介ページ",
    solution: "店名・メニュー・営業時間・写真を入れるだけで、スマホで見やすい紹介ページになります。予約ボタンから予約の仕組みにもつなげられます。",
    demo: "https://mvp-lp-generator.vercel.app/lp/lien-omotesando",
    image: "/works/lp.webp",
  },
  {
    slug: "estimate",
    pain: "見積書を毎回Excelで作っている",
    detail: "明細の計算や転記に時間がかかる。前に出した見積を探すのもひと手間。",
    name: "見積の作成と管理",
    solution: "明細を入れると合計と消費税を自動で計算し、そのまま見積書になります。お客様は画面から承認でき、受注まで一覧で追えます。",
    demo: "https://mvp-estimate-manager.vercel.app/",
    image: "/works/estimate.webp",
  },
  {
    slug: "invoice",
    pain: "請求と入金の確認がばらばら",
    detail: "どの請求が入金済みで、どれが期限を過ぎているのか、通帳とExcelを見比べないと分からない。",
    name: "請求・入金の管理",
    solution: "今月期日の請求、入金済みの額、期限を過ぎたものを1画面にまとめます。和文の請求書もそのまま出せます。",
    demo: "https://mvp-freelance-manager.vercel.app/dashboard",
    image: "/works/invoice.webp",
  },
  {
    slug: "ec",
    pain: "定期便やネット販売を始めたい",
    detail: "大きな通販サービスは手数料も設定も重い。自分のお店らしい売り方をしたい。",
    name: "定期便の通販",
    solution: "商品を選んで定期便を申し込み、お客様自身がお届けの間隔変更やスキップをできる流れを作ります。",
    demo: "https://mvp-subscription-ec.vercel.app/",
    image: "/works/ec.webp",
  },
];

/** 美容室 Lien を例にした、紹介ページ → 予約 → お店の管理画面 の流れ */
export const flow = [
  {
    title: "紹介ページで知ってもらう",
    body: "メニュー・料金・場所がスマホでひと目で分かる。「WEB予約」から次へ進めます。",
    demo: "https://mvp-lp-generator.vercel.app/lp/lien-omotesando",
    image: "/works/flow-lp.webp",
  },
  {
    title: "お客様がスマホで予約する",
    body: "空いている時間だけが表示されるので、電話やDMのやり取りが要りません。",
    demo: "https://mvp-booking-system.vercel.app/book",
    image: "/works/flow-book.webp",
  },
  {
    title: "お店は一覧で確認する",
    body: "入った予約は「確定待ち」で一覧に並び、確認の連絡もそこから送れます。",
    demo: "https://mvp-booking-system.vercel.app/reservations",
    image: "/works/flow-admin.webp",
  },
] as const;

export type Step = { readonly title: string; readonly body: string };

export const steps: readonly Step[] = [
  {
    title: "お話を伺う",
    body: "いまどんな手順で、誰が、何に困っているかを伺います。仕組みを売り込むのではなく、手間のかかっている所を一緒に見つけるところから始めます。",
  },
  {
    title: "必要なものだけを提案する",
    body: "「全部入り」にはしません。困りごとを解くのに必要な最小の構成と、費用の目安をお伝えします。",
  },
  {
    title: "確認しながら作る",
    body: "途中で画面を見ていただき、使いにくい所を直しながら進めます。",
  },
  {
    title: "公開して、使い方をお伝えする",
    body: "公開後に迷わず使えるよう、操作の流れをご説明します。",
  },
];

export type Price = { readonly title: string; readonly price: string; readonly note: string };

/**
 * 仮の金額（本人が決めるまでは公開しない）。
 * 相場の出典: LP 5万〜20万円（ココナラ, 2026-03）、予約サービス連携型 初期10万〜40万円（atsoho）。
 */
export const prices: readonly Price[] = [
  {
    title: "お店・サービスの紹介ページ",
    price: "5万円〜",
    note: "ページの量と、文章・写真のご用意があるかで変わります。",
  },
  {
    title: "予約の仕組みづくり",
    price: "10万円〜",
    note: "既存の予約サービスとの連携を基本にご提案します。",
  },
  {
    title: "見積・請求などの業務ツール",
    price: "ご相談",
    note: "業務の内容を伺ってから、お見積りします。",
  },
];

/** 作っている人。事実だけを書く（就活用ポートフォリオと同じ内容） */
export const profile = {
  lead: "専門学校で IT を学びながら、NPO法人でエンジニアとして活動しています。",
  facts: [
    "清風情報工科学院 IT・情報処理専攻（2028年3月卒業予定）",
    "NPO法人タダカヨでエンジニアとして活動中（2026年4月〜）",
    "卒業進級制作発表会2025 企業賞・理事長賞（チームで作ったコーヒー・ティーのEC）",
    "デジタル庁 デジタル推進委員（2026年6月〜）",
    "ITパスポート試験 合格",
  ],
} as const;

export type Faq = { readonly question: string; readonly answer: string };

export const faqs: readonly Faq[] = [
  {
    question: "学生ですが、依頼して大丈夫ですか？",
    answer:
      "専門学校で学びながら、NPO法人でエンジニアとして活動しています。このページの作例はどれも実際に触れます。小さく作って確認しながら進めるので、途中で方向を変えることもできます。",
  },
  {
    question: "パソコンが苦手でも使えますか？",
    answer:
      "使う方に合わせて、画面の項目やボタンを最小限にします。作っている途中で実際に触っていただき、迷った所を直してから公開します。",
  },
  {
    question: "公開したあとの修正はお願いできますか？",
    answer: "できます。どこまでを料金に含めるかは、お見積りのときに決めます。",
  },
  {
    question: "どんな方からの依頼を受けていますか？",
    answer:
      "お店や個人事業など、事業者の方からのご依頼をお受けしています。個人の私用のご依頼はお受けしていません。",
  },
];

/** 問い合わせメールのひな形。返信に必要なことを最初から書いてもらう */
export const inquiry = {
  subject: "【ご相談】Web制作・業務ツールについて",
  body: ["お名前・屋号：", "業種：", "困っていること：", "ご希望の時期（任意）：", "ご予算の目安（任意）："].join(
    "\n",
  ),
} as const;

export const mailto = `mailto:${owner.email}?subject=${encodeURIComponent(inquiry.subject)}&body=${encodeURIComponent(inquiry.body)}`;
