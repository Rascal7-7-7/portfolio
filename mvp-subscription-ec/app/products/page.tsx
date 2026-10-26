import type { Metadata } from 'next';
import Link from 'next/link';
import { PRODUCTS } from '@/lib/catalog';
import { ProductCard } from '@/components/ProductCard';
import { ProductVisual } from '@/components/ProductVisual';
import { Phrases } from '@/components/Phrases';
import { perServing, unitPrice, yen } from '@/lib/pricing';

const PERKS = [
  { title: ['定期便は', 'ずっと10%OFF'], body: '2回目以降も、すべての商品が10%OFF。' },
  { title: ['送料無料'], body: '定期便を含むご注文は、何点でも送料無料。' },
  { title: ['縛りなし、', 'いつでも解約'], body: 'スキップ・お休み・解約はマイページから。' },
];

const FAQS = [
  {
    q: 'スキップはいつまでにすればいいですか？',
    a: 'お届け予定日の5日前までに、マイページの「次回をスキップ」を押してください。お届けが1回ぶん先に延びます。初回分は発送準備に入るため、スキップは2回目からです。',
  },
  {
    q: '解約はどうすればいいですか？',
    a: 'マイページの「解約」から手続きできます。回数の縛りや解約金はありません。しばらく不要なときは「お休みする」も選べます。',
  },
  {
    q: 'どんな形で届きますか？',
    a: 'コーヒー豆やティーバッグなど薄い袋・箱の商品は、原則ポスト投函です。瓶入りのグラノーラやボトル入りのハンドソープ・化粧水は宅配便でお届けします。ご注文の組み合わせによっては、まとめて宅配便にすることがあります。',
  },
];

const STEPS = [
  { n: '1', title: '商品とお届け間隔を選ぶ', body: '毎月、または2ヶ月ごと。暮らしのペースに合わせて。' },
  { n: '2', title: '3日後に初回お届け', body: '焙煎・製造したてを、商品の形に合わせてポスト投函か宅配便でお届けします。' },
  { n: '3', title: 'マイページで調整', body: '在庫が余ったらスキップ。お休みも解約もワンタップ。' },
];

export const metadata: Metadata = { title: '商品一覧' };

export default function ProductsPage() {
  const hero = PRODUCTS[0];
  const heroPrice = unitPrice(hero.price, 'monthly');
  const heroServing = perServing(heroPrice, hero.specs);
  const heroSize = hero.specs.find((s) => s.label === '内容量')?.value.replace(/（.*）/, '');

  return (
    <main>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-end gap-6 px-4 pb-6 pt-6 sm:gap-10 sm:px-6 sm:pb-16 sm:pt-16 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <h1 className="font-headline text-[1.75rem] font-light leading-[1.2] tracking-[-0.02em] text-on-background sm:text-5xl">
            森が育てた素材を、
            <br />
            暮らしの定期便に。
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-on-surface-variant sm:mt-6 sm:text-base sm:leading-loose">
            小さな焙煎所、宇治の茶園、木曽のひのき。
            <br className="hidden sm:inline" />
            つくり手から直接、ちょうどいいペースでお届けします。
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-6 sm:mt-8">
            <Link
              href="#items"
              className="inline-flex items-center btn-primary px-6 py-3 text-sm font-medium"
            >
              商品を見る
            </Link>
            <Link href="#how" className="text-sm text-on-surface underline underline-offset-4 hover:text-primary">
              定期便のしくみ
            </Link>
          </div>
        </div>

        {/* 定番の1品を「写真」として大きく見せ、横に毎月の値段と1杯の値段だけを置く */}
        <div className="flex items-center gap-5 border-t border-outline-variant/60 pt-6 sm:gap-10 sm:pt-10 lg:border-t-0 lg:pt-0">
          <Link href={`/products/${hero.id}`} className="group w-28 flex-shrink-0 overflow-hidden sm:w-48 lg:w-60" aria-label={`${hero.name}の商品ページへ`}>
            <ProductVisual
              product={hero}
              decorative
              className="aspect-[4/5] transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          </Link>
          <div className="min-w-0">
            <p className="text-xs text-on-surface-variant sm:text-sm">
              <Phrases parts={[...hero.nameParts, heroSize ? `（${heroSize}）の定期便` : 'の定期便']} />
            </p>
            <p className="tnum mt-1 font-headline text-3xl font-light tracking-[-0.02em] text-on-background sm:mt-2 sm:text-5xl">
              <span className="mr-2 text-base text-on-surface-variant sm:text-xl">毎月</span>
              {yen(heroPrice)}
            </p>
            {heroServing && (
              <p className="tnum mt-1 text-sm text-on-surface sm:mt-2 sm:text-lg">
                <span aria-hidden className="mr-1.5 text-primary">→</span>
                <span className="whitespace-nowrap">
                  1{heroServing.unit}あたり約<span className="ml-0.5 font-semibold">{yen(heroServing.amount)}</span>
                </span>
              </p>
            )}
            <p className="mt-2 text-xs text-on-surface-variant sm:mt-3">
              <Phrases parts={['ポストに届く薄い箱で、', '送料無料。']} />
            </p>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section aria-label="定期便の特典" className="border-y border-outline-variant/60">
        {/* 商品グリッドと同じ列幅・間隔にして、文字の開始位置を揃える。区切り線は列間の中央に引く */}
        <ul className="mx-auto grid max-w-6xl grid-cols-3 gap-x-3 px-4 sm:gap-x-6 sm:px-6">
          {PERKS.map(({ title, body }) => (
            <li
              key={title.join('')}
              className="relative py-4 text-center before:absolute before:inset-y-0 before:-left-1.5 before:border-l before:border-outline-variant/60 first:before:hidden sm:py-6 sm:text-left sm:before:-left-3"
            >
              <p className="text-xs font-semibold text-on-surface sm:text-sm">
                <Phrases parts={title} />
              </p>
              <p className="mt-1 hidden text-xs leading-relaxed text-on-surface-variant sm:block">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Products */}
      <section id="items" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-8 sm:px-6 sm:py-16">
        <div className="mb-5 flex items-baseline justify-between gap-4 sm:mb-8">
          <h2 className="font-headline text-xl font-light tracking-[-0.01em] text-on-surface sm:text-2xl">
            定期便でお届けする6つの定番
          </h2>
          <p className="hidden text-xs text-on-surface-variant sm:block">価格はすべて税込です</p>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-4 sm:px-6">
        <div className="border-t border-outline-variant/60 pt-8 sm:pt-12">
          <h2 className="font-headline text-xl font-light text-on-surface sm:text-2xl">定期便のしくみ</h2>
          <ol className="mt-6 grid gap-6 sm:mt-8 sm:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n}>
                <p className="font-semibold text-on-surface">
                  <span className="tnum mr-2 text-on-surface-variant">{s.n}.</span>
                  {s.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">{s.body}</p>
              </li>
            ))}
          </ol>

          <h3 className="mt-10 text-sm font-semibold text-on-surface sm:mt-12">よくあるご質問</h3>
          <div className="mt-3 divide-y divide-outline-variant/60 border-y border-outline-variant/60">
            {FAQS.map(({ q, a }) => (
              <details key={q} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                  <span className="[word-break:auto-phrase]">{q}</span>
                  <span aria-hidden className="text-on-surface-variant transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="max-w-2xl pb-4 text-sm leading-relaxed text-on-surface-variant [word-break:auto-phrase]">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
