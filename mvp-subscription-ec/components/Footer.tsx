import { BRAND } from '@/lib/catalog';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-outline-variant/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="font-headline text-sm font-semibold tracking-[0.18em] text-on-surface">{BRAND.en}</p>
          <p className="mt-1 text-sm text-on-surface-variant">森が育てた素材を、暮らしの定期便に。</p>
        </div>
        <p className="text-xs leading-relaxed text-on-surface-variant">
          このサイトはポートフォリオ用のデモです。ブランド・商品は架空で、
          <br className="hidden sm:inline" />
          注文や決済は実際には行われません。
        </p>
      </div>
    </footer>
  );
}
