import { BRAND } from '@/lib/catalog';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-outline-variant/40 bg-inverse-surface text-inverse-on-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="label-editorial text-inverse-primary">{BRAND.en}</p>
          <p className="mt-1 font-headline text-lg font-light">森が育てた素材を、暮らしの定期便に。</p>
        </div>
        <p className="text-xs leading-relaxed text-inverse-on-surface/70">
          このサイトはポートフォリオ用のデモです。ブランド・商品は架空で、
          <br className="hidden sm:inline" />
          注文や決済は実際には行われません。
        </p>
      </div>
    </footer>
  );
}
