import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/lib/store';

const DESCRIPTION = '紙の台帳やLINEで受けていた予約を、1つの画面で管理するデモ（ダミーデータ）';

/** og:image は app/opengraph-image.png から Next.js が自動で入れる */
export const metadata: Metadata = {
  metadataBase: new URL('https://mvp-booking-system.vercel.app'),
  title: '予約管理システム',
  description: DESCRIPTION,
  openGraph: { title: '予約管理システム', description: DESCRIPTION, type: 'website', locale: 'ja_JP' },
  twitter: { card: 'summary_large_image', title: '予約管理システム', description: DESCRIPTION },
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
