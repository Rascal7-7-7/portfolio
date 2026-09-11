import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

// 日本語フォントはファイルサイズが大きいため preload は行わず、
// 必要になった時点で読み込ませる（FCP を優先する）。
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-mvps.vercel.app"),
  title: "業務改善・MVP開発 | フリーランスエンジニア",
  description:
    "非効率な業務を、最短で使えるシステムに落とし込む。小規模事業者・チーム向けに、課題ヒアリング〜設計〜実装まで対応します。",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "業務改善・MVP開発 | フリーランスエンジニア",
    description: "非効率な業務を、最短で使えるシステムに落とし込む。",
    type: "website",
    url: "/",
    siteName: "業務改善・MVP開発",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${inter.variable} ${notoSansJP.variable}`}>
      <body className="bg-surface-950 text-surface-50 antialiased">
        {children}
      </body>
    </html>
  );
}
