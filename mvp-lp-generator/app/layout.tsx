import type { Metadata, Viewport } from 'next'
import './globals.css'

const TITLE = 'LP Concierge — 店舗情報からLPを即生成'
const DESCRIPTION = '店舗情報を入れるだけで、その場で見栄えのよいランディングページが完成するデモ'

// 画像は app/opengraph-image.png（ファイル規約）から og:image / twitter:image に入る
export const metadata: Metadata = {
  metadataBase: new URL('https://mvp-lp-generator.vercel.app'),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION, type: 'website', locale: 'ja_JP', siteName: 'LP Concierge' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

// 下部の固定バーを iPhone のホームバーの上に出すため（env(safe-area-inset-bottom) を有効にする）
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-ed-bg font-gothic text-ed-ink">{children}</body>
    </html>
  )
}
