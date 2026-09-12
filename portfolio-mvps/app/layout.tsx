import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import { profile } from "@/content/profile";
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
  title: `${profile.name} | ポートフォリオ`,
  description:
    "AI × セキュリティに関心があるIT系専門学生のポートフォリオ。生成AIをアプリへ組み込むなかで、Prompt Injection などAI特有のセキュリティ問題に関心を持つようになりました。作ったものは公開URLで触れる状態にしています。",
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
