import Link from 'next/link';
import NavItem from '@/components/NavItem';
import { SHOP } from '@/lib/seed';
import Icon from '@/components/Icon';

/** 管理画面（スタッフ側）の枠。お客様の予約ページ /book はこの外にある */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* モバイル: トップヘッダー */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-canvas flex items-center justify-between px-4 h-12 border-b border-line">
        <span className="font-serif text-lg leading-none text-ink">{SHOP.name}</span>
        <span className="text-xs text-dim">{SHOP.branch} · 予約管理</span>
      </header>

      {/* デスクトップ: サイドバー。外側は本文と同じ高さまで伸ばして背景を途切れさせず、中身だけ画面に追従させる */}
      <aside className="hidden md:block w-56 shrink-0 bg-muted border-r border-line">
        <div className="sticky top-0 h-screen flex flex-col px-3 py-5">
          <div className="px-2 mb-7 pt-1">
            <p className="font-serif text-xl leading-none text-ink tracking-tight">{SHOP.name}</p>
            <p className="text-xs text-dim mt-2">{SHOP.branch} · 予約管理</p>
          </div>

          <nav aria-label="画面の切り替え" className="flex flex-col gap-0.5 flex-1">
            <NavItem href="/reservations" icon="event_note" label="予約一覧" />
            <NavItem href="/reservations/new" icon="add" label="新規予約" />
            <NavItem href="/schedule" icon="calendar_view_day" label="スケジュール" />
          </nav>

          <div className="px-2 pt-4 border-t border-line">
            <Link href="/book"
              className="flex items-center gap-2.5 -mx-2 px-2 py-1.5 rounded-md text-sm text-ink hover:bg-subtle focus-visible:outline-2 focus-visible:outline-brand">
              <Icon name="storefront" />
              <span>お客様の予約ページ</span>
            </Link>
            <p className="text-xs text-dim mt-1 leading-relaxed">デモ：お客様の画面で予約すると、管理画面に入ってきます</p>
            <p className="text-xs text-dim mt-4">受付スタッフ ・ ダミーデータ</p>
            {/* 制作側（フリーランス管理MVP）で、この予約システムを案件として管理している画面へ */}
            <a href="https://mvp-freelance-manager.vercel.app/projects/p2" target="_blank" rel="noopener noreferrer"
              className="block text-xs text-dim mt-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-brand rounded">
              <span className="underline underline-offset-2">制作案件を見る</span>（Hikae）<span className="sr-only">（新しいタブで開きます）</span>
            </a>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0 min-h-screen bg-page pt-12 pb-20 md:pt-0 md:pb-0">
        {children}
      </main>

      {/* モバイル: ボトムナビ */}
      <nav aria-label="画面の切り替え" className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-canvas border-t border-line flex">
        <NavItem href="/reservations" icon="event_note" label="予約一覧" mobile />
        <NavItem href="/reservations/new" icon="add" label="新規予約" mobile />
        <NavItem href="/schedule" icon="calendar_view_day" label="スケジュール" mobile />
        <NavItem href="/book" icon="storefront" label="予約ページ" mobile />
      </nav>

    </div>
  );
}
