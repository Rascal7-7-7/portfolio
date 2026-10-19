import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Noto_Sans_JP, Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { StoreProvider } from '@/components/StoreProvider';

const headline = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-headline',
  display: 'swap',
  weight: ['300', '400', '600', '700'],
});

const bodyJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-body-jp',
  display: 'swap',
  weight: ['300', '400', '500', '700'],
});

const label = Be_Vietnam_Pro({
  subsets: ['latin'],
  variable: '--font-label',
  display: 'swap',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'MORI ATELIER — 森の定期便',
  description: '森が育てた素材を、暮らしの定期便に。架空ブランドによる D2C 定期購入 EC のデモサイトです。',
};

// 固定バーで env(safe-area-inset-bottom) を効かせるため
export const viewport: Viewport = { viewportFit: 'cover' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body
        className={`${headline.variable} ${bodyJP.variable} ${label.variable} font-body bg-background text-on-surface min-h-screen flex flex-col`}
      >
        <StoreProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-on-primary"
          >
            本文へスキップ
          </a>
          <Header />
          <div id="main" className="flex-1">
            {children}
          </div>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
