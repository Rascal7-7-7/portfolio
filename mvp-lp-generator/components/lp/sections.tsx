import { cx } from '@/lib/cx'
import type { Theme } from '@/lib/themes'
import type { StoreInfo } from '@/lib/types'

export interface SectionProps {
  store: StoreInfo
  t: Theme
  wide: boolean
}

const pad = (wide: boolean) => (wide ? 'px-14 py-24' : 'px-6 py-16')

function Head({ t, wide, eyebrow, title }: SectionProps & { eyebrow: string; title: string }) {
  return (
    <div className={cx('text-center', wide ? 'mb-14' : 'mb-10')}>
      <p className={t.eyebrow}>{eyebrow}</p>
      <h2 className={cx(t.heading, 'mt-3 [word-break:auto-phrase]', wide ? 'text-[34px]' : 'text-[24px]')}>{title}</h2>
    </div>
  )
}

export function Nav({ store, t, wide }: SectionProps) {
  return (
    <nav className={cx(t.navBg, t.line, 'sticky top-0 z-10 flex items-center justify-between border-b backdrop-blur', wide ? 'px-14 py-4' : 'px-5 py-3')}>
      <span className={cx(t.heading, 'truncate text-lg')}>{store.storeName || 'お店の名前'}</span>
      <div className="flex items-center gap-6 text-xs font-bold">
        {wide && (
          <>
            <a href="#menu" className="opacity-70 hover:opacity-100">メニュー</a>
            <a href="#access" className="opacity-70 hover:opacity-100">アクセス</a>
          </>
        )}
        <a href="#reserve" className={cx(t.btn, 'px-4 py-2 transition')}>予約</a>
      </div>
    </nav>
  )
}

export function Features(props: SectionProps) {
  const { store, t, wide } = props
  return (
    <section className={cx(t.alt, pad(wide))}>
      <Head {...props} eyebrow="WHY US" title={`${store.storeName || '当店'}が選ばれる理由`} />
      <div className={cx('mx-auto grid max-w-6xl gap-6', wide ? 'grid-cols-3' : 'grid-cols-1')}>
        {store.features.map((f, i) => (
          <article key={f.title} className={cx(t.card, 'p-7')}>
            <div className="flex items-center gap-3">
              <span aria-hidden className="text-3xl">{f.emoji}</span>
              <span className={cx(t.accent, 'font-gothic text-xs font-bold')}>POINT {String(i + 1).padStart(2, '0')}</span>
            </div>
            <h3 className={cx(t.heading, 'mt-5 text-lg')}>{f.title}</h3>
            <p className={cx(t.muted, 'mt-3 text-sm leading-relaxed')}>{f.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export function Menu(props: SectionProps) {
  const { store, t, wide } = props
  const items = store.menu.filter((m) => m.name)
  if (items.length === 0) return null
  return (
    <section id="menu" className={pad(wide)}>
      <Head {...props} eyebrow="MENU" title="メニュー・料金" />
      <div className={cx('mx-auto grid max-w-6xl gap-6', wide ? 'grid-cols-3' : 'grid-cols-1')}>
        {items.map((m) => (
          <article key={m.name} className={cx(t.card, 'overflow-hidden')}>
            <div className={cx(t.art, 'relative flex aspect-[16/10] items-center justify-center')}>
              <span aria-hidden className="text-6xl drop-shadow-lg">{m.emoji}</span>
            </div>
            <div className="flex items-end justify-between gap-4 p-6">
              <div className="min-w-0">
                <h3 className={cx(t.heading, 'text-base')}>{m.name}</h3>
                {m.description && <p className={cx(t.muted, 'mt-1 text-xs')}>{m.description}</p>}
              </div>
              <p className={cx(t.accent, 'shrink-0 font-gothic text-xl font-bold')}>{m.price}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export function Voices(props: SectionProps) {
  const { store, t, wide } = props
  return (
    <section className={cx(t.alt, pad(wide))}>
      <Head {...props} eyebrow="VOICE" title="お客様の声" />
      <div className={cx('mx-auto grid max-w-4xl gap-6', wide ? 'grid-cols-2' : 'grid-cols-1')}>
        {store.voices.map((v) => (
          <figure key={v.name} className={cx(t.card, 'p-7')}>
            <p aria-label="5つ星" className={cx(t.accent, 'text-sm tracking-widest')}>★★★★★</p>
            <blockquote className="mt-4 text-[15px] leading-relaxed">「{v.text}」</blockquote>
            <figcaption className={cx(t.muted, 'mt-4 text-xs')}>— {v.name}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

export function Access(props: SectionProps) {
  const { store, t, wide } = props
  const rows = [
    ['住所', store.address],
    ['営業時間', store.hours],
    ['定休日', store.closed],
    ['電話', store.phone],
  ].filter(([, v]) => v)
  const map = {
    backgroundColor: t.mapBase,
    backgroundImage: `linear-gradient(90deg, ${t.mapRoad} 7px, transparent 7px), linear-gradient(${t.mapRoad} 7px, transparent 7px), linear-gradient(35deg, transparent 48%, ${t.mapRoad} 48%, ${t.mapRoad} 52%, transparent 52%)`,
    backgroundSize: '96px 72px, 96px 72px, 100% 100%',
  }
  return (
    <section id="access" className={pad(wide)}>
      <Head {...props} eyebrow="ACCESS" title="アクセス・営業時間" />
      <div className={cx('mx-auto grid max-w-5xl items-center gap-10', wide ? 'grid-cols-2' : 'grid-cols-1')}>
        <div role="img" aria-label={`${store.address} の地図イメージ`} style={map} className="relative aspect-[4/3] overflow-hidden rounded-3xl">
          <span aria-hidden className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full text-5xl drop-shadow-lg">📍</span>
        </div>
        <dl>
          {rows.map(([k, v]) => (
            <div key={k} className={cx(t.line, 'flex gap-6 border-b py-4 text-sm')}>
              <dt className={cx(t.muted, 'w-20 shrink-0 font-bold')}>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export function Cta({ store, t, wide }: SectionProps) {
  return (
    <section id="reserve" className={cx(wide ? 'px-14 pb-24' : 'px-5 pb-16')}>
      <div className={cx(t.ctaBand, 'mx-auto max-w-5xl rounded-[2rem] text-center', wide ? 'px-14 py-16' : 'px-6 py-12')}>
        <p className="text-xs font-bold tracking-[0.3em] opacity-70">RESERVATION</p>
        <h2 className={cx(t.heading, 'mt-4', wide ? 'text-[32px]' : 'text-[22px]')}>まずはお気軽にご予約ください</h2>
        <a href="#reserve" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-[#1f2a37] shadow-lg transition hover:scale-[1.02]">
          {store.ctaLabel || 'ご予約はこちら'} <span aria-hidden>→</span>
        </a>
        {store.phone && <p className="mt-5 text-sm opacity-80">お電話でも受付中：{store.phone}</p>}
      </div>
    </section>
  )
}

export function Footer({ store, t }: SectionProps) {
  return (
    <footer className={cx(t.line, 'border-t px-6 py-10 text-center')}>
      <p className={cx(t.heading, 'text-base')}>{store.storeName || 'お店の名前'}</p>
      <p className={cx(t.muted, 'mt-2 text-xs')}>© {store.storeName || 'Your Shop'} — Made with LP Concierge</p>
    </footer>
  )
}
