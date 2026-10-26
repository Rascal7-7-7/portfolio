import type { Metadata } from "next";
import { Zen_Kaku_Gothic_New } from "next/font/google";
import { owner } from "@/content/site";
import "./globals.css";

// 日本語フォントは大きいので preload せず、最初の表示を優先する
const zenKaku = Zen_Kaku_Gothic_New({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-zen-kaku",
  display: "swap",
  preload: false,
});

const description =
  "予約・見積・請求・お店の紹介ページ。紙やLINE、Excelで回している業務を伺って、必要なものだけを小さく作ります。作例はすべて実際に触れます。";

export const metadata: Metadata = {
  // OG 画像を絶対 URL で出すための基準。Vercel のプロジェクト rascal-works の本番 URL
  metadataBase: new URL("https://rascal-works.vercel.app"),
  title: `${owner.name} | 小さなお店のWeb制作・業務ツールづくり`,
  description,
  openGraph: {
    title: `${owner.name} | 小さなお店のWeb制作・業務ツールづくり`,
    description,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={zenKaku.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
