'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, UserRound } from 'lucide-react';
import { useStore } from '@/components/StoreProvider';
import { BRAND } from '@/lib/catalog';
import { cn } from '@/lib/cn';

export function Header() {
  const { state, loaded } = useStore();
  const pathname = usePathname();
  const count = state.cart.reduce((sum, i) => sum + i.quantity, 0);

  const navClass = (href: string) =>
    cn(
      'inline-flex items-center gap-1.5 px-3 py-2 text-sm text-on-surface-variant underline-offset-4 transition-colors hover:text-on-surface hover:underline',
      pathname.startsWith(href) && 'text-on-surface',
    );

  return (
    <header className="sticky top-0 z-50 border-b border-outline-variant/40 bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/products" className="group flex flex-col leading-none">
          <span className="font-headline text-[15px] font-semibold tracking-[0.18em] text-on-surface">{BRAND.en}</span>
          <span className="mt-1 text-[11px] text-on-surface-variant">{BRAND.ja}</span>
        </Link>

        <nav aria-label="メインメニュー" className="flex items-center gap-1">
          <Link href="/products" className={cn(navClass('/products'), 'hidden sm:inline-flex')}>
            ショップ
          </Link>
          <Link href="/mypage" className={navClass('/mypage')} aria-label="マイページ">
            <UserRound className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">マイページ</span>
          </Link>
          <Link
            href="/cart"
            className={navClass('/cart')}
            aria-label={loaded && count > 0 ? `カート（${count}点）` : 'カート'}
          >
            <ShoppingBag className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">カート</span>
            {loaded && count > 0 && (
              <span aria-hidden className="tnum">
                ({count})
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
