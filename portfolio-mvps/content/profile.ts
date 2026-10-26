/**
 * 自己紹介の情報。サイト各所から参照する。
 *
 * NPO法人タダカヨは「所属・活動」としてのみ記載する。
 * 業務内容・技術・担当範囲は、先方の許諾がない限り作品として扱わない。
 */
export const profile = {
  name: "豊里拓巳",
  nameReading: "とよざと たくみ",
  school: "清風情報工科学院",
  department: "デザイン・コンピューター学科 IT・情報処理専攻",
  status: "学生",
  graduation: "2028年3月卒業予定",
  activity: "NPO法人タダカヨでエンジニアとして活動中（2026年4月〜）",
  /** 脆弱性の報告。対象の名前は本人の希望で伏せる。件数は本人の記憶があいまいなため書かない */
  disclosure: "OSS の脆弱性を見つけ、開発者へメールで報告（対象は非公開。1件は開発者から返礼あり）",
  aim: "セキュリティエンジニア志望",
  /** 語の途中で折り返さないよう、意味の切れ目で区切って持つ */
  certifications: ["ITパスポート取得、", "基本情報技術者試験は科目A免除済み", "（科目Bを受験予定）"],
  /** 興味の優先順位。上ほど強い。 */
  interests: [
    { label: "AI × セキュリティ", primary: true },
    { label: "クラウド", primary: false },
    { label: "ネットワーク", primary: false },
  ],
  links: {
    github: "https://github.com/Rascal7-7-7",
    email: "rascal.devops@gmail.com",
  },
} as const;
