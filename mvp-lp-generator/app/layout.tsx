import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LP Concierge — 店舗情報からLPを即生成',
  description: '店舗情報を入れるだけで、その場で見栄えのよいランディングページが完成するデモ',
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
