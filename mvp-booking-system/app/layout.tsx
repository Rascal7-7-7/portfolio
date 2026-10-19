import type { Metadata } from 'next';
import './globals.css';
import NavItem from '@/components/NavItem';
import { StoreProvider } from '@/lib/store';
import { SHOP } from '@/lib/seed';

export const metadata: Metadata = {
  title: '予約管理システム',
  description: '紙の台帳やLINEで受けていた予約を、1つの画面で管理するデモ（ダミーデータ）',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=Noto+Sans+JP:wght@300;400;500;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col md:flex-row bg-[#f8f9fa]">

        {/* モバイル: トップヘッダー */}
        <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#f3f4f5] flex items-center justify-between px-4 h-14 border-b border-[#c4c5d5]/20">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00288e] to-[#1e40af] flex items-center justify-center text-white">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }} aria-hidden="true">spa</span>
            </div>
            <span className="text-sm font-black text-[#00288e]">予約管理システム</span>
          </div>
          <span className="text-[11px] text-[#444653]">{SHOP.name} {SHOP.branch}</span>
        </header>

        {/* デスクトップ: サイドバー。外側は本文と同じ高さまで伸ばして背景を途切れさせず、中身だけ画面に追従させる */}
        <aside className="hidden md:block w-64 shrink-0 bg-[#f3f4f5]">
          <div className="sticky top-0 h-screen flex flex-col p-6">
            {/* ロゴ */}
            <div className="mb-10 px-2">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00288e] to-[#1e40af] flex items-center justify-center text-white">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }} aria-hidden="true">spa</span>
                </div>
                <div>
                  <p className="text-base font-black text-[#00288e] leading-tight">予約管理システム</p>
                  <p className="text-[11px] text-[#444653] mt-0.5">{SHOP.name} {SHOP.branch}</p>
                </div>
              </div>
            </div>

            {/* ナビゲーション */}
            <nav aria-label="画面の切り替え" className="flex flex-col gap-1.5 flex-1">
              <NavItem href="/reservations" icon="event_note" label="予約一覧" />
              <NavItem href="/reservations/new" icon="add_circle" label="新規登録" />
              <NavItem href="/schedule" icon="calendar_view_day" label="スケジュール" />
            </nav>

            {/* フッター */}
            <div className="pt-5 border-t border-[#c4c5d5]/30">
              <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-full bg-[#1e40af]/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#00288e]" style={{ fontSize: '16px' }} aria-hidden="true">account_circle</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#191c1d]">受付スタッフ</p>
                  <p className="text-[11px] text-[#444653]">デモ版・ダミーデータ</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* メインコンテンツ */}
        <StoreProvider>
          <main className="flex-1 min-w-0 min-h-screen pt-14 pb-20 md:pt-0 md:pb-0">
            {children}
          </main>
        </StoreProvider>

        {/* モバイル: ボトムナビ */}
        <nav aria-label="画面の切り替え" className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#e7e8e9] flex">
          <NavItem href="/reservations" icon="event_note" label="予約一覧" mobile />
          <NavItem href="/reservations/new" icon="add_circle" label="新規登録" mobile />
          <NavItem href="/schedule" icon="calendar_view_day" label="スケジュール" mobile />
        </nav>

      </body>
    </html>
  );
}
