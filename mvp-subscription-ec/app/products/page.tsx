import Link from 'next/link';
import { ArrowRight, CalendarClock, Percent, Truck } from 'lucide-react';
import { BRAND, PRODUCTS } from '@/lib/catalog';
import { ProductCard } from '@/components/ProductCard';
import { ProductVisual } from '@/components/ProductVisual';

const PERKS = [
  { icon: Percent, title: 'ずっと10%OFF', body: '定期便は2回目以降も、すべての商品が10%OFF。' },
  { icon: Truck, title: '送料無料', body: '定期便を含むご注文は、何点でも送料無料です。' },
  { icon: CalendarClock, title: 'スキップ・解約は自由', body: '回数の縛りなし。マイページからいつでも変更できます。' },
];

const STEPS = [
  { n: '01', title: '商品とお届け間隔を選ぶ', body: '毎月、または2ヶ月ごと。暮らしのペースに合わせて。' },
  { n: '02', title: '3日後に初回お届け', body: '焙煎・製造したてを、ポストに入るサイズでお届けします。' },
  { n: '03', title: 'マイページで調整', body: '在庫が余ったらスキップ。お休みも解約もワンタップ。' },
];

export default function ProductsPage() {
  const [hero1, hero2, hero3] = [PRODUCTS[0], PRODUCTS[1], PRODUCTS[4]];

  return (
    <main>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-14 pt-10 sm:px-6 sm:pt-16 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <p className="label-editorial text-primary">{BRAND.en} — Since 2019</p>
          <h1 className="mt-4 font-headline text-[2.05rem] font-light leading-[1.12] tracking-[-0.02em] text-on-background sm:text-6xl">
            森が育てた素材を、
            <br />
            暮らしの定期便に。
          </h1>
          <p className="mt-5 max-w-md text-sm leading-loose text-on-surface-variant sm:text-base">
            小さな焙煎所、宇治の茶園、木曽のひのき。
            <br className="hidden sm:inline" />
            つくり手から直接、ちょうどいいペースでお届けします。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#items"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-on-primary transition-opacity hover:opacity-90"
            >
              商品を見る
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="#how"
              className="inline-flex items-center rounded-md px-5 py-3 text-sm font-medium text-primary ring-1 ring-primary/30 transition-colors hover:bg-primary/5"
            >
              定期便のしくみ
            </Link>
          </div>
        </div>

        <div className="relative mx-auto h-[300px] w-full max-w-[460px] sm:h-[400px]" aria-hidden>
          <ProductVisual product={hero2} decorative className="absolute left-0 top-10 h-[220px] w-[44%] rounded-lg shadow-elevation-3 sm:h-[300px]" />
          <ProductVisual product={hero1} decorative className="absolute left-[28%] top-0 z-10 h-[260px] w-[46%] rounded-lg shadow-elevation-3 sm:h-[350px]" />
          <ProductVisual product={hero3} decorative className="absolute right-0 top-16 h-[210px] w-[40%] rounded-lg shadow-elevation-3 sm:h-[290px]" />
          <div className="absolute bottom-0 left-4 z-20 rounded-md bg-surface-container-lowest px-4 py-3 shadow-elevation-2 ring-1 ring-outline-variant/40">
            <p className="text-[11px] text-on-surface-variant">次回のお届け</p>
            <p className="font-headline text-sm font-semibold text-on-surface">深森ブレンド ほか2点</p>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section aria-label="定期便の特典" className="border-y border-outline-variant/40 bg-surface-container-low">
        <ul className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6">
          {PERKS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex gap-3">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold text-on-surface">{title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-on-surface-variant">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Products */}
      <section id="items" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="label-editorial text-primary">Collection</p>
            <h2 className="mt-2 font-headline text-2xl font-light tracking-[-0.01em] text-on-surface sm:text-3xl">
              定期便でお届けする6つの定番
            </h2>
          </div>
          <p className="hidden text-xs text-on-surface-variant sm:block">価格はすべて税込です</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-4 sm:px-6">
        <div className="rounded-lg bg-primary px-6 py-10 text-on-primary sm:px-10">
          <p className="label-editorial text-inverse-primary">How it works</p>
          <h2 className="mt-2 font-headline text-2xl font-light sm:text-3xl">定期便のしくみ</h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n} className="border-t border-on-primary/25 pt-4">
                <p className="tnum font-headline text-sm text-inverse-primary">{s.n}</p>
                <p className="mt-2 font-semibold">{s.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-on-primary/80">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
