import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { PaidToast } from "@/components/PaidToast";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const TITLE = "Hikae — 個人事業の業務をまとめて管理";
const DESCRIPTION = "案件・タスク・請求と入金をひとつの画面で。フリーランス向けバックオフィスのデモ";

// og:image は app/opengraph-image.png（ファイル規約）から自動で付く
export const metadata: Metadata = {
  metadataBase: new URL("https://mvp-freelance-manager.vercel.app"),
  title: { default: TITLE, template: "%s | Hikae" },
  description: DESCRIPTION,
  openGraph: { type: "website", siteName: "Hikae", title: TITLE, description: DESCRIPTION, locale: "ja_JP" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: "/opengraph-image.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={notoSansJP.variable}>
      <body className="antialiased">
        <div className="flex min-h-screen flex-col md:flex-row">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col pb-20 md:pb-0">{children}</div>
        </div>
        <PaidToast />
      </body>
    </html>
  );
}
