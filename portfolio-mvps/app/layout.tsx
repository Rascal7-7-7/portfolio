import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans_JP } from "next/font/google";
import { profile } from "@/content/profile";
import "./globals.css";

/*
 * 書体は IBM Plex の 2 系統だけにする（本文・見出し = Sans JP、数値・日付 = Mono）。
 * Inter + Noto の組み合わせは生成 AI の既定に近く既視感が出るため、技術系の硬さがある Plex にした。
 * Sans JP は欧文も同じ設計で持つので、和欧で別の書体を混ぜずに済む。
 */
// 日本語フォントはファイルサイズが大きいため preload は行わず、
// 必要になった時点で読み込ませる（FCP を優先する）。
const plexSansJP = IBM_Plex_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-plex-sans-jp",
  display: "swap",
  preload: false,
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-mvps.vercel.app"),
  title: `${profile.name} | ポートフォリオ`,
  description:
    "AI × セキュリティに関心があるIT系専門学生のポートフォリオ。生成AIをアプリへ組み込むなかで、Prompt Injection などAI特有のセキュリティ問題に関心を持つようになりました。小さな作品は公開デモで、代表作はソースコードで確認できます。",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${profile.name} | ポートフォリオ`,
    description:
      "AI × セキュリティに関心があるIT系専門学生のポートフォリオ。",
    type: "website",
    url: "/",
    siteName: `${profile.name} | ポートフォリオ`,
  },
  twitter: {
    card: "summary_large_image",
  },
};

/** 検索エンジン向けの構造化データ。肩書と在籍校を、ページの表示と同じ値で出す */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: "https://portfolio-mvps.vercel.app",
  jobTitle: profile.aim,
  affiliation: { "@type": "EducationalOrganization", name: profile.school },
  sameAs: [profile.links.github],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${plexSansJP.variable} ${plexMono.variable}`}>
      <body className="bg-paper text-ink antialiased">
        <script
          type="application/ld+json"
          // 中身はサイト内の固定値だけで組み立てている（外部入力を含まない）
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
