import { CATEGORIES } from '@/lib/categories'
import { cx } from '@/lib/cx'
import Icon from '../Icon'
import { LineArt, Rings } from './Art'
import { Phrases, type SectionProps } from './sections'

const SHINE = 'bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.55),transparent_55%)]'
// 絵の枠自身を container にして、英字ロゴを枠幅基準で縮める（枠からはみ出さない）
const FRAME = 'relative overflow-hidden [container-type:inline-size]'

/** 業種の英字を大きく敷くタイポグラフィ。単語単位で折り返し、枠の内側に必ず収める */
function Wordmark({ text, className }: { text: string; className: string }) {
  return (
    <span aria-hidden className={cx('pointer-events-none absolute break-words font-mincho italic leading-[0.92] tracking-tight', className)}>
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
    store.hours && { icon: 'clock' as const, text: store.hours },
    store.closed && { icon: null, text: `定休日 ${store.closed}` },
    store.address && { icon: 'pin' as const, text: store.address },
  ].filter((i): i is { icon: 'clock' | 'pin' | null; text: string } => Boolean(i))
  return (
    <ul className={cx('mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs', t.muted, center && 'justify-center')}>
      {items.map((i) => (
        <li key={i.text} className="inline-flex items-center gap-1.5">
          {i.icon && <Icon name={i.icon} className="h-3.5 w-3.5 opacity-80" />}
          {i.text}
        </li>
      ))}
    </ul>
  )
}

function Copy(props: SectionProps & { center?: boolean; size: string }) {
  const { store, t, center, size } = props
  return (
    <div className={cx('min-w-0', center && 'text-center')}>
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
  const cat = CATEGORIES[store.category]
  return (
    <section className={cx(t.heroBg, wide ? 'px-14 py-20' : 'px-6 py-12')}>
      <div className={cx('mx-auto max-w-6xl', wide ? 'grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-center gap-14' : 'space-y-10')}>
        {/* 見出しはコンテナ（LP 自身）の幅基準で縮める。エディタの狭いプレビューでも語の途中で折れない */}
        <Copy {...props} size={wide ? 'text-[clamp(30px,4.6cqw,50px)] leading-[1.3]' : 'text-[30px] leading-[1.4]'} />
        <div className={cx(FRAME, 'rounded-[2rem]', t.art, t.artInk, wide ? 'aspect-[4/5]' : 'aspect-[4/3]')}>
          <div className={cx('absolute inset-0', SHINE)} />
          <Rings className="absolute -right-[30%] -top-[25%] w-[110%] opacity-25" />
          <LineArt category={store.category} className={cx('absolute stroke-[1.75px]', wide ? 'right-[12%] top-[16%] w-[52%]' : 'right-[8%] top-[10%] w-[42%]')} />
          <Wordmark text={cat.en} className={cx('bottom-[7%] left-[7%] right-[7%] opacity-80', wide ? 'text-[17cqw]' : 'text-[13cqw]')} />
          <p className="absolute left-[7%] top-[7%] text-[10px] font-bold uppercase tracking-[0.3em] opacity-70">No.01 — {cat.en}</p>
          {store.hours && wide && (
            <div className="absolute bottom-[7%] right-[7%] rounded-2xl bg-white/90 px-4 py-3 text-[#3b2f25] shadow-lg backdrop-blur">
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
  const cat = CATEGORIES[store.category]
  return (
    <section className={cx(t.heroBg, 'relative overflow-hidden', wide ? 'px-14 pb-20 pt-24' : 'px-6 pb-12 pt-14')}>
      <div aria-hidden className="absolute left-1/2 top-[-200px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#d9b779]/20 blur-[110px]" />
      <div className="relative mx-auto max-w-4xl">
        <Copy {...props} center size={wide ? 'text-[clamp(36px,6.4cqw,60px)] leading-[1.2]' : 'text-[32px] leading-[1.35]'} />
        <div className={cx(FRAME, 'mt-14 rounded-3xl border border-[#d9b779]/25', t.art, t.artInk, wide ? 'aspect-[21/8]' : 'aspect-[4/3]')}>
          <Rings className={cx('absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 opacity-20', wide ? 'h-[170%]' : 'h-[120%]')} />
          <LineArt category={store.category} className={cx('absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 stroke-[1.25px]', wide ? 'h-[66%]' : 'h-[48%]')} />
          <Wordmark text={cat.en} className={cx('opacity-90', wide ? 'bottom-[10%] left-[5%] max-w-[34%] text-[6.5cqw]' : 'bottom-[7%] left-[7%] right-[7%] text-[11cqw]')} />
          <div className={cx('absolute text-right text-[10px] font-bold uppercase tracking-[0.3em]', wide ? 'bottom-[10%] right-[5%]' : 'right-[7%] top-[7%]')}>
            <p className="opacity-70">Open</p>
            {store.hours && <p className="mt-1 text-xs tracking-[0.15em]">{store.hours}</p>}
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
      <div className={cx('relative mx-auto max-w-6xl', wide ? 'grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center gap-12' : 'space-y-10')}>
        <Copy {...props} size={wide ? 'text-[clamp(30px,4.8cqw,52px)] leading-[1.25]' : 'text-[30px] leading-[1.35]'} />
        <div className={cx('relative mx-auto aspect-square w-full', wide ? 'max-w-[420px]' : 'max-w-[280px]')}>
          <div className={cx('absolute inset-0 overflow-hidden rounded-full border-2 border-[#1f2a37] shadow-[8px_8px_0_#1f2a37]', t.art, t.artInk)}>
            <div aria-hidden className="absolute inset-[9%] rounded-full border-2 border-dashed border-[#1f2a37]/35" />
            <LineArt category={store.category} className="absolute inset-[20%] stroke-[3px]" />
          </div>
          {lead && (
            <div className="absolute -left-2 top-4 rotate-[-10deg] rounded-full border-2 border-[#1f2a37] bg-white px-4 py-3 text-center shadow-[4px_4px_0_#1f2a37]">
              <p className="text-[10px] font-bold text-[#c2412d]">{lead.name}</p>
              <p className="text-lg font-extrabold leading-none">{lead.price}</p>
            </div>
          )}
          <p aria-hidden className="absolute -right-1 bottom-6 rotate-[6deg] rounded-full bg-[#1f2a37] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-white">
            {CATEGORIES[store.category].en}
          </p>
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
