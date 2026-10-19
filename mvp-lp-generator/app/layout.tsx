import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LP Concierge — 店舗情報からLPを即生成',
  description: '店舗情報を入れるだけで、その場で見栄えのよいランディングページが完成するデモ',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-ed-bg font-gothic">{children}</body>
    </html>
  )
}
