import { CATEGORIES } from '@/lib/categories'
import { cx } from '@/lib/cx'
import { Phrases, type SectionProps } from './sections'

const SHINE = 'bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.55),transparent_55%)]'
// 写真が無くても「素材感」が出るよう、細かいドットと業種の英字を重ねる
const GRAIN = 'bg-[radial-gradient(rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:14px_14px]'

function Wordmark({ text, className }: { text: string; className: string }) {
  return (
    <span aria-hidden className={cx('pointer-events-none absolute whitespace-nowrap font-mincho italic leading-none', className)}>
      {text}
    </span>
  )
}

function CtaButtons({ store, t, center }: SectionProps & { center?: boolean }) {
  return (
    <div className={cx('mt-9 flex flex-wrap gap-3', center && 'justify-center')}>
      <a href="#reserve" className={cx(t.btn, 'inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold transition')}>
        {store.ctaLabel || 'ご予約はこちら'}
        <span aria-hidden>→</span>
      </a>
      <a href="#menu" className={cx(t.btnGhost, 'inline-flex items-center px-7 py-3.5 text-sm font-bold transition')}>
        メニューを見る
      </a>
    </div>
  )
}

function InfoChips({ store, t, center }: SectionProps & { center?: boolean }) {
  const items = [
    store.hours && `🕒 ${store.hours}`,
    store.closed && `定休日 ${store.closed}`,
    store.address && `📍 ${store.address}`,
  ].filter(Boolean) as string[]
  return (
    <ul className={cx('mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs', t.muted, center && 'justify-center')}>
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  )
}

function Copy(props: SectionProps & { center?: boolean; size: string }) {
  const { store, t, center, size } = props
  return (
    <div className={cx(center && 'text-center')}>
      <p className={t.eyebrow}>
        {CATEGORIES[store.category].label}
        <span className="mx-2 opacity-50">/</span>
        {store.storeName || 'お店の名前'}
      </p>
      <h1 className={cx(t.heading, size, 'mt-5 text-balance')}>
        <Phrases text={store.catchCopy || 'キャッチコピーを入力してください'} />
      </h1>
      {store.description && (
        <p className={cx(t.muted, 'mt-6 text-[15px] leading-loose', center && 'mx-auto max-w-xl')}>{store.description}</p>
      )}
      <CtaButtons {...props} />
      <InfoChips {...props} />
    </div>
  )
}

function SplitHero(props: SectionProps) {
  const { store, t, wide } = props
  const motif = CATEGORIES[store.category].motif
  return (
    <section className={cx(t.heroBg, wide ? 'px-14 py-20' : 'px-6 py-12')}>
      <div className={cx('mx-auto max-w-6xl', wide ? 'grid grid-cols-[1.1fr_1fr] items-center gap-14' : 'space-y-10')}>
        <Copy {...props} size={wide ? 'text-[50px] leading-[1.3]' : 'text-[30px] leading-[1.4]'} />
        <div className={cx('relative overflow-hidden rounded-[2rem]', t.art, wide ? 'aspect-[4/5]' : 'aspect-[4/3]')}>
          <div className={cx('absolute inset-0', SHINE)} />
          <div className={cx('absolute inset-0', GRAIN)} />
          <Wordmark text={CATEGORIES[store.category].en} className={cx('text-white/45', wide ? 'bottom-24 right-6 text-[72px]' : 'right-5 top-5 text-[44px]')} />
          <span aria-hidden className="absolute inset-0 flex items-center justify-center text-[110px] drop-shadow-xl">
            {CATEGORIES[store.category].emoji}
          </span>
          <span aria-hidden className={cx('absolute text-4xl', wide ? 'right-6 top-6' : 'bottom-6 right-6')}>{motif[0]}</span>
          <span aria-hidden className="absolute left-8 top-1/3 text-3xl">{motif[2]}</span>
          {store.hours && (
            <div className="absolute bottom-5 left-5 rounded-2xl bg-white/90 px-4 py-3 text-[#3b2f25] shadow-lg backdrop-blur">
              <p className="text-[10px] font-bold tracking-[0.2em] text-[#8a5526]">OPEN</p>
              <p className="text-sm font-bold">{store.hours}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function CenterHero(props: SectionProps) {
  const { store, t, wide } = props
  const motif = CATEGORIES[store.category].motif
  return (
    <section className={cx(t.heroBg, 'relative overflow-hidden', wide ? 'px-14 pb-20 pt-24' : 'px-6 pb-12 pt-14')}>
      <div aria-hidden className="absolute left-1/2 top-[-200px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#d9b779]/20 blur-[110px]" />
      <div className="relative mx-auto max-w-4xl">
        <Copy {...props} center size={wide ? 'text-[60px] leading-[1.2]' : 'text-[32px] leading-[1.35]'} />
        <div className={cx('relative mt-14 overflow-hidden rounded-3xl', t.art, wide ? 'aspect-[21/8]' : 'aspect-[4/3]')}>
          <div className={cx('absolute inset-0 opacity-40', SHINE)} />
          <div className={cx('absolute inset-0 opacity-50', GRAIN)} />
          <Wordmark text={CATEGORIES[store.category].en} className={cx('text-white/30', wide ? 'bottom-6 left-10 text-[56px]' : 'bottom-4 left-5 text-[28px]')} />
          <div aria-hidden className="absolute inset-0 flex items-center justify-center gap-10 text-6xl drop-shadow-lg">
            <span>{motif[0]}</span>
            <span className="text-8xl">{CATEGORIES[store.category].emoji}</span>
            <span>{motif[1]}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function PosterHero(props: SectionProps) {
  const { store, t, wide } = props
  const lead = store.menu.find((m) => m.name)
  return (
    <section className={cx(t.heroBg, 'relative overflow-hidden', wide ? 'px-14 py-20' : 'px-6 py-12')}>
      <div aria-hidden className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#ffd84d]" />
      <div aria-hidden className="absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-[#ff6b4a]/15" />
      <div className={cx('relative mx-auto max-w-6xl', wide ? 'grid grid-cols-[1.2fr_1fr] items-center gap-12' : 'space-y-10')}>
        <Copy {...props} size={wide ? 'text-[52px] leading-[1.25]' : 'text-[30px] leading-[1.35]'} />
        <div className={cx('relative mx-auto aspect-square w-full', wide ? 'max-w-[420px]' : 'max-w-[280px]')}>
          <div className={cx('absolute inset-0 rounded-full border-2 border-[#1f2a37] shadow-[8px_8px_0_#1f2a37]', t.art)} />
          <span aria-hidden className="absolute inset-0 flex items-center justify-center text-[110px]">
            {CATEGORIES[store.category].emoji}
          </span>
          {lead && (
            <div className="absolute -left-2 top-4 rotate-[-10deg] rounded-full border-2 border-[#1f2a37] bg-white px-4 py-3 text-center shadow-[4px_4px_0_#1f2a37]">
              <p className="text-[10px] font-bold text-[#c2412d]">{lead.name}</p>
              <p className="text-lg font-extrabold leading-none">{lead.price}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default function Hero(props: SectionProps) {
  if (props.t.hero === 'center') return <CenterHero {...props} />
  if (props.t.hero === 'poster') return <PosterHero {...props} />
  return <SplitHero {...props} />
}
