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
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col md:flex-row bg-canvas text-body">

        {/* モバイル: トップヘッダー */}
        <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-canvas flex items-center justify-between px-4 h-12 border-b border-line">
          <span className="text-sm font-bold text-ink">予約管理</span>
          <span className="text-xs text-dim">{SHOP.name} {SHOP.branch}</span>
        </header>

        {/* デスクトップ: サイドバー。外側は本文と同じ高さまで伸ばして背景を途切れさせず、中身だけ画面に追従させる */}
        <aside className="hidden md:block w-56 shrink-0 bg-muted border-r border-line">
          <div className="sticky top-0 h-screen flex flex-col px-3 py-5">
            <div className="px-2 mb-6">
              <p className="text-sm font-bold text-ink leading-tight">予約管理</p>
              <p className="text-xs text-dim mt-1">{SHOP.name} {SHOP.branch}</p>
            </div>

            <nav aria-label="画面の切り替え" className="flex flex-col gap-0.5 flex-1">
              <NavItem href="/reservations" icon="event_note" label="予約一覧" />
              <NavItem href="/reservations/new" icon="add" label="新規登録" />
              <NavItem href="/schedule" icon="calendar_view_day" label="スケジュール" />
            </nav>

            <div className="px-2 pt-4 border-t border-line">
              <p className="text-xs font-medium text-ink">受付スタッフ</p>
              <p className="text-xs text-dim mt-0.5">デモ版・ダミーデータ</p>
            </div>
          </div>
        </aside>

        <StoreProvider>
          <main className="flex-1 min-w-0 min-h-screen pt-12 pb-20 md:pt-0 md:pb-0">
            {children}
          </main>
        </StoreProvider>

        {/* モバイル: ボトムナビ */}
        <nav aria-label="画面の切り替え" className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-canvas border-t border-line flex">
          <NavItem href="/reservations" icon="event_note" label="予約一覧" mobile />
          <NavItem href="/reservations/new" icon="add" label="新規登録" mobile />
          <NavItem href="/schedule" icon="calendar_view_day" label="スケジュール" mobile />
        </nav>

      </body>
    </html>
  );
}
