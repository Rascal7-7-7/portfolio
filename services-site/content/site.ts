/**
 * 依頼用サイトの文言とデータ。
 *
 * 読み手は X から来た小さなお店・個人事業の方。技術用語を使わず、主語は「あなたの業務」にする。
 * 根拠のない効果の数字（「工数 -70%」など）は書かない。作例はすべて公開デモで触れるものだけを出す。
 */

/**
 * 名乗り。本人の希望で本名・学校・資格は出さない（X のアカウント名で名乗る）。
 * 就活用ポートフォリオは本名を載せているので、このサイトからはリンクしない。
 */
export const owner = {
  name: "Rascal",
  role: "小さなお店・個人事業のWeb制作と業務ツールづくり",
  email: "rascal.devops@gmail.com",
  x: "https://x.com/Rascal_AI_Dev",
  xHandle: "@Rascal_AI_Dev",
} as const;

/** 依頼する前に知りたいこと（ヒーロー直下に置く、3 つの約束） */
export const promises = [
  {
    title: "業務を伺ってから作ります",
    body: "いまのやり方と困っている所を先に伺い、必要なものだけを作ります。使わない機能でお金をいただくことはしません。",
  },
  {
    title: "作りながら画面で確認できます",
    body: "完成してから「思っていたのと違う」とならないよう、途中の画面を触っていただき、直しながら進めます。",
  },
  {
    title: "完成の形を先に見られます",
    body: "このページの作例は、どれも実際に触れます。「こういうのが欲しい」を作例で指していただくだけで伝わります。",
  },
] as const;

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

/** 料金は要相談（本人の方針）。金額は出さず、何で決まるかだけを伝える */
export const pricing = {
  lead: "作るものの量に合わせて、お話を伺ってからお見積りします。ご相談とお見積りは無料です。",
  factors: [
    { title: "作るものの量", body: "ページの数や、予約・見積などの機能がいくつ要るか。" },
    { title: "ご用意いただけるもの", body: "文章や写真がお手元にあるか。無い場合は一緒に考えます。" },
    { title: "公開後のお手伝い", body: "修正や使い方のご説明を、どこまで含めるか。" },
  ],
} as const;

/** 作っている人。本人の希望で、出す経歴はこの 2 つだけにする */
export const profile = {
  lead: "AIも使いながら、小さなお店や個人事業向けのWebページと業務ツールを作っています。",
  facts: ["NPO法人でエンジニアとして活動しています", "デジタル庁のデジタル推進委員を務めています"],
} as const;

export type Faq = { readonly question: string; readonly answer: string };

export const faqs: readonly Faq[] = [
  {
    question: "個人に依頼して大丈夫ですか？",
    answer:
      "NPO法人でエンジニアとして活動しています。このページの作例はどれも実際に触れるので、仕上がりを確かめてからご相談いただけます。小さく作って確認しながら進めるので、途中で方向を変えることもできます。",
  },
  {
    question: "相談だけでも大丈夫ですか？",
    answer:
      "大丈夫です。「こんなことはできる？」の段階でも、X の DM かメールでお気軽にどうぞ。お見積りまでは無料です。",
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
