import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PRODUCTS, findProduct } from '@/lib/catalog';
import { ProductCard } from '@/components/ProductCard';
import { ProductVisual } from '@/components/ProductVisual';
import { Phrases } from '@/components/Phrases';
import { perServing, unitPrice, yen } from '@/lib/pricing';

const PERKS = [
  { title: ['定期便は', 'ずっと10%OFF'], body: '2回目以降も、すべての商品が10%OFF。' },
  { title: ['送料無料'], body: '定期便を含むご注文は、何点でも送料無料。' },
  { title: ['縛りなし、', 'いつでも解約'], body: 'スキップ・お休み・解約はマイページから。' },
];

// つくり手ごとの小さな物語。写真は商品データの photo を使い、商品ページへつなぐ
const MAKERS = [
  { id: 'forest-roast', place: '小さな焙煎所から', body: '5kgずつの小釜で焙煎し、3日以内に発送します。' },
  { id: 'uji-gyokuro', place: '宇治の茶園から', body: '新芽を覆って育てた、一番茶だけを缶に詰めて。' },
  { id: 'hinoki-soap', place: '木曽の森から', body: '間伐材のひのきを蒸留した精油で、手洗いを森林浴に。' },
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

const HERO_ID = 'herb-tea';
const LIFE_PHOTO_ID = 'honey-granola';

export const metadata: Metadata = { title: '商品一覧' };

export default function ProductsPage() {
  // 一覧の1枚目（コーヒー）と同じ商品をヒーローに出すと、同じ絵が上下に並ぶ。
  // 一覧では最後に来るハーブティーを出す（ティーバッグなのでポスト投函の説明とも合う）
  const hero = findProduct(HERO_ID) ?? PRODUCTS[0];
  const heroPrice = unitPrice(hero.price, 'monthly');
  const heroServing = perServing(heroPrice, hero.specs);
  const heroSize = hero.specs.find((s) => s.label === '内容量')?.value.replace(/（.*）/, '');
  const lifePhoto = (findProduct(LIFE_PHOTO_ID) ?? PRODUCTS[0]).photo;

  return (
    <main>
      {/* Hero：左に言葉、右に森の写真を画面の端まで。スマホは写真を先に見せる */}
      <section className="grid lg:min-h-[640px] lg:grid-cols-2">
        <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:order-2 lg:aspect-auto">
          <Image
            src="/photos/forest.webp"
            alt="朝霧のなかに立つ松の木々"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center px-4 py-10 sm:px-6 sm:py-14 lg:py-20 lg:pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] lg:pr-16">
          <p className="text-sm text-on-surface-variant">つくり手から、ひと月ごとに。</p>
          <h1 className="mt-4 font-headline text-[2rem] font-normal leading-[1.35] tracking-[0.02em] text-on-background sm:text-5xl sm:leading-[1.3] lg:text-[2.625rem] xl:text-[2.875rem]">
            {/* 1行ずつ折り返さない塊にして、狭い列でも「森が／育てた」のように割れないようにする */}
            <span className="inline-block">森が育てた素材を、</span>
            <br />
            <span className="inline-block">暮らしの定期便に。</span>
          </h1>
          <p className="mt-5 max-w-md text-sm leading-loose text-on-surface-variant sm:mt-7 sm:text-base">
            小さな焙煎所、宇治の茶園、木曽のひのき。
            <br className="hidden sm:inline" />
            つくり手から直接、ちょうどいいペースでお届けします。
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-6 sm:mt-9">
            <Link href="#items" className="btn-primary inline-flex items-center px-7 py-3.5 text-sm font-medium">
              6つの定番を見る
            </Link>
            <Link href="#how" className="text-sm text-on-surface underline underline-offset-4 hover:text-primary">
              定期便のしくみ
            </Link>
          </div>

          {/* 今月のおすすめを1品だけ、毎月の値段と1杯の値段で見せる */}
          <Link
            href={`/products/${hero.id}`}
            className="group mt-10 flex max-w-md items-center gap-4 border-t border-outline-variant/60 pt-6 sm:mt-12"
            aria-label={`${hero.name}の商品ページへ`}
          >
            <ProductVisual product={hero} decorative className="h-20 w-16 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-on-surface-variant">
                <Phrases parts={['今月のおすすめ・', ...hero.nameParts, heroSize ? `（${heroSize}）` : '']} />
              </p>
              <p className="tnum mt-1 text-on-surface">
                <span className="mr-1.5 text-sm text-on-surface-variant">毎月</span>
                <span className="font-headline text-2xl font-normal">{yen(heroPrice)}</span>
                {heroServing && (
                  <span className="ml-3 whitespace-nowrap text-sm text-on-surface-variant">
                    1{heroServing.unit}あたり約{yen(heroServing.amount)}
                  </span>
                )}
              </p>
            </div>
          </Link>
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
      <section id="items" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14 sm:px-6 sm:py-24">
        <div className="mb-8 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-headline text-2xl font-normal tracking-[0.02em] text-on-background sm:text-[2rem]">
              定期便でお届けする、6つの定番
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
              <Phrases parts={['朝の一杯から、', '洗面所の手洗いまで。', '暮らしの5つの場面に。']} />
            </p>
          </div>
          <p className="text-xs text-on-surface-variant">価格はすべて税込です</p>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 sm:gap-y-14 lg:grid-cols-3">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* つくり手：写真を少しずつずらして並べ、雑誌の見開きのように読ませる */}
      <section aria-labelledby="makers-title" className="bg-surface-container-low">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-24">
          <div className="max-w-xl">
            <h2 id="makers-title" className="font-headline text-2xl font-normal leading-snug tracking-[0.02em] text-on-background sm:text-[2rem]">
              つくり手のそばから、まっすぐ。
            </h2>
            <p className="mt-4 text-sm leading-loose text-on-surface-variant sm:text-base">
              <Phrases parts={['店頭や問屋を通さず、', 'つくった人の手から', 'そのまま届けます。', 'だから、いつも作りたて。']} />
            </p>
          </div>
          <ul className="mt-10 grid gap-10 sm:mt-14 sm:grid-cols-3 sm:gap-6">
            {MAKERS.map(({ id, place, body }, i) => {
              const product = findProduct(id);
              if (!product) return null;
              return (
                <li key={id} className={i === 1 ? 'sm:mt-16' : undefined}>
                  <Link href={`/products/${id}`} className="group block">
                    <div className="relative aspect-[3/2] overflow-hidden sm:aspect-[4/5]">
                      <Image
                        src={product.photo.src}
                        alt={product.photo.alt}
                        fill
                        sizes="(min-width: 640px) 33vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    </div>
                    <h3 className="mt-5 font-headline text-lg font-medium text-on-surface">{place}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                      <Phrases parts={body.split('、').map((s, j, a) => (j < a.length - 1 ? `${s}、` : s))} />
                    </p>
                    <p className="mt-3 text-sm text-on-surface underline-offset-4 group-hover:underline">
                      {product.name}
                      <span aria-hidden className="ml-1.5 text-primary">→</span>
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* How it works：写真1枚と、届くまでの3ステップ */}
      <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14 sm:px-6 sm:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[5fr_6fr] lg:gap-20">
          <div className="relative aspect-[4/3] overflow-hidden lg:aspect-[4/5]">
            <Image src={lifePhoto.src} alt={lifePhoto.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>
          <div>
            <h2 className="font-headline text-2xl font-normal leading-snug tracking-[0.02em] text-on-background sm:text-[2rem]">
              <Phrases parts={['届く日が、', 'ちょっと楽しみになる。']} />
            </h2>
            <p className="mt-4 text-sm leading-loose text-on-surface-variant sm:text-base">
              <Phrases parts={['買い忘れも、', '買いすぎもなく。', '定期便のしくみは', '3つだけです。']} />
            </p>
            <ol className="mt-8 divide-y divide-outline-variant/60 border-y border-outline-variant/60">
              {STEPS.map((s) => (
                <li key={s.n} className="flex gap-5 py-5 sm:gap-7">
                  <span aria-hidden className="tnum w-6 flex-shrink-0 font-headline text-3xl font-light leading-none text-primary">
                    {s.n}
                  </span>
                  <div>
                    <p className="font-semibold text-on-surface">
                      <span className="sr-only">{s.n}. </span>
                      {s.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-3xl sm:mt-24">
          <h2 className="text-center font-headline text-xl font-normal text-on-background sm:text-2xl">よくあるご質問</h2>
          <div className="mt-6 divide-y divide-outline-variant/60 border-y border-outline-variant/60">
            {FAQS.map(({ q, a }) => (
              <details key={q} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-sm text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:text-base [&::-webkit-details-marker]:hidden">
                  <span className="[word-break:auto-phrase]">{q}</span>
                  <span aria-hidden className="text-lg text-on-surface-variant transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="max-w-2xl pb-5 text-sm leading-relaxed text-on-surface-variant [word-break:auto-phrase]">{a}</p>
              </details>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="#items" className="btn-primary inline-flex items-center px-7 py-3.5 text-sm font-medium">
              6つの定番から選ぶ
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
