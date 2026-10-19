import type { Metadata } from "next";
import "./globals.css";
import Sidebar, { MobileNav } from "@/components/Sidebar";
import { EstimatesProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "見積マネージャー",
  description: "品目・数量・単価から小計・消費税・合計を自動計算し、見積のステータスを管理するデモアプリ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="font-sans">
        <EstimatesProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="min-w-0 flex-1">
              <header className="flex h-12 items-center border-b border-line bg-white px-4 md:hidden print:hidden">
                <p className="text-sm font-bold text-navy">見積マネージャー</p>
                <span className="ml-2 rounded bg-canvas px-1.5 py-0.5 text-[10px] text-muted">デモ</span>
              </header>
              <main className="pb-20 md:pb-0 print:pb-0">{children}</main>
            </div>
          </div>
          <MobileNav />
        </EstimatesProvider>
      </body>
    </html>
  );
}
