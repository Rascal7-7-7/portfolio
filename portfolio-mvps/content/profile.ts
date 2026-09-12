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
  activity: "NPO法人タダカヨでエンジニアとして活動中",
  /** 興味の優先順位。上ほど強い。 */
  interests: [
    { label: "AI × セキュリティ", primary: true },
    { label: "セキュリティ", primary: true },
    { label: "AI", primary: false },
    { label: "クラウド", primary: false },
    { label: "ネットワーク", primary: false },
  ],
  links: {
    github: "https://github.com/Rascal7-7-7",
    email: "rascal.devops@gmail.com",
  },
} as const;
