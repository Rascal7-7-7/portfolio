import { cx } from '@/lib/cx'
import { toPhrases } from '@/lib/phrase'
import type { Theme } from '@/lib/themes'
import type { StoreInfo } from '@/lib/types'
import Icon from '../Icon'
import { Rings } from './Art'

export interface SectionProps {
  store: StoreInfo
  t: Theme
  wide: boolean
}

/** 見出し用。文節単位で包んで語の途中の改行を防ぐ（Safari でも有効）。lead は分割しない先頭部分（店名など） */
export function Phrases({ text, lead }: { text: string; lead?: string }) {
  const units = lead ? [lead, ...toPhrases(text)] : toPhrases(text)
  return (
    <>
      {units.map((u, i) => (
        <span key={i} className="inline-block">
          {u}
        </span>
      ))}
    </>
  )
}

const num = (i: number) => String(i + 1).padStart(2, '0')

const pad = (wide: boolean) => (wide ? 'px-14 py-24' : 'px-6 py-16')

function Head({ t, wide, eyebrow, title, lead }: SectionProps & { eyebrow: string; title: string; lead?: string }) {
  return (
    <div className={cx('text-center', wide ? 'mb-14' : 'mb-10')}>
      <p className={t.eyebrow}>{eyebrow}</p>
      <h2 className={cx(t.heading, 'mt-3 text-balance', wide ? 'text-[34px]' : 'text-[24px]')}>
        <Phrases text={title} lead={lead} />
      </h2>
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
      <Head {...props} eyebrow="WHY US" lead={`${store.storeName || '当店'}が`} title="選ばれる理由" />
      <div className={cx('mx-auto grid max-w-6xl gap-6', wide ? 'grid-cols-3' : 'grid-cols-1')}>
        {store.features.map((f, i) => (
          <article key={f.title} className={cx(t.card, 'p-7')}>
            <p className={cx(t.accent, 'flex items-baseline gap-3 font-gothic text-xs font-bold tracking-[0.2em]')}>
              <span aria-hidden className="font-mincho text-4xl font-normal italic tracking-normal">{num(i)}</span>
              POINT
            </p>
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
      <div className={cx('mx-auto grid max-w-6xl', wide ? 'grid-cols-3 gap-6' : 'grid-cols-1 gap-4')}>
        {items.map((m, i) => (
          // スマホでは横並びのメニュー表にして、大きなグラデーション面が続かないようにする
          <article key={m.name} className={cx(t.card, 'overflow-hidden', !wide && 'flex items-center')}>
            {/* 写真の代わりに番号と幾何学パターンで「品書き」らしく見せる */}
            <div aria-hidden className={cx(t.art, t.artInk, 'relative flex shrink-0 items-center justify-center overflow-hidden', wide ? 'aspect-[16/10]' : 'm-3 h-20 w-20 rounded-xl')}>
              <Rings className={cx('absolute opacity-25', wide ? '-right-[25%] -top-[40%] w-[90%]' : 'inset-0')} />
              <span className={cx('relative font-mincho italic leading-none', wide ? 'text-7xl' : 'text-3xl')}>{num(i)}</span>
            </div>
            <div className={cx('flex min-w-0 flex-1', wide ? 'items-end justify-between gap-4 p-6' : 'flex-col gap-1 py-4 pl-1 pr-5')}>
              <div className="min-w-0">
                <h3 className={cx(t.heading, 'text-base')}>{m.name}</h3>
                {m.description && <p className={cx(t.muted, 'mt-1 text-xs')}>{m.description}</p>}
              </div>
              <p className={cx(t.accent, 'shrink-0 font-gothic font-bold', wide ? 'text-xl' : 'text-lg')}>{m.price}</p>
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
    // 道路の線が地図の縁に来て「枠」に見えないよう、格子をずらす
    backgroundPosition: '44px 30px, 44px 30px, 0 0',
  }
  return (
    <section id="access" className={pad(wide)}>
      <Head {...props} eyebrow="ACCESS" title="アクセス・営業時間" />
      <div className={cx('mx-auto grid max-w-5xl items-center gap-10', wide ? 'grid-cols-2' : 'grid-cols-1')}>
        <div role="img" aria-label={`${store.address} の地図イメージ`} style={map} className="relative aspect-[4/3] overflow-hidden rounded-3xl">
          <span aria-hidden className={cx(t.ctaBand, 'absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-full items-center justify-center rounded-full rounded-bl-none -rotate-45 shadow-lg')}>
            <span className="rotate-45"><Icon name="pin" className="h-5 w-5" /></span>
          </span>
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
        <p className="text-xs font-bold tracking-[0.3em] opacity-90">RESERVATION</p>
        <h2 className={cx(t.heading, 'mt-4 text-balance', wide ? 'text-[32px]' : 'text-[22px]')}>
          <Phrases text="まずはお気軽にご予約ください" />
        </h2>
        <a href="#reserve" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-[#1f2a37] shadow-lg transition hover:scale-[1.02]">
          {store.ctaLabel || 'ご予約はこちら'} <span aria-hidden>→</span>
        </a>
        {store.phone && <p className="mt-5 text-sm opacity-90">お電話でも受付中：{store.phone}</p>}
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
