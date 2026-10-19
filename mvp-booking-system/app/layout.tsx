import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/lib/store';

export const metadata: Metadata = {
  title: '予約管理システム',
  description: '紙の台帳やLINEで受けていた予約を、1つの画面で管理するデモ（ダミーデータ）',
};

/** 管理画面とお客様の予約ページで同じストアを使うため、ストアはここで1つだけ持つ */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full bg-canvas text-body">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
