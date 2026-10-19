import type { ReactNode } from 'react'
import { CATEGORIES } from '@/lib/categories'
import { cx } from '@/lib/cx'
import type { SectionKey } from '@/lib/types'
import { catchCopy, ctaLabel, infoRows, menuItems, num, Phrases, storeName, visibleSections, type TemplateProps } from './shared'

/*
 * モダン: 美容室のエディトリアルなサイト（STUDIO「muku」の「02 — ABOUT」番号付き見出し）を手本にした構成。
 * 写真の代わりに「大きな見出し・罫線・左に番号列」で誌面のリズムを作る。
 * 黒地は業種（美容室・バー）の雰囲気づくりとして選べるテンプレートの1つ。アクセント色は金1色だけ。
 */
const MUTED = 'text-[#f2f0eb]/65' // #0e0e0e 上で約 7.5:1
const ACCENT = 'text-[#d9b779]' // #0e0e0e 上で約 10:1
const LINE = 'border-white/15'
const BTN =
  'inline-flex items-center justify-center bg-[#f2f0eb] px-7 py-4 text-sm font-semibold tracking-[0.06em] text-[#0e0e0e] transition-colors hover:bg-white'

function Nav({ store, wide }: TemplateProps) {
  return (
    <nav className={cx(LINE, 'sticky top-0 z-10 flex items-center justify-between border-b bg-[#0e0e0e]', wide ? 'px-14 py-5' : 'px-6 py-4')}>
      <span className="truncate text-[15px] font-semibold tracking-[0.06em]">{storeName(store)}</span>
      <div className="flex shrink-0 items-center gap-7 text-[13px]">
        {wide && (
          <>
            <a href="#menu" className={cx(MUTED, 'hover:text-[#f2f0eb]')}>メニュー</a>
            <a href="#access" className={cx(MUTED, 'hover:text-[#f2f0eb]')}>アクセス</a>
          </>
        )}
        <a href="#reserve" className={cx(ACCENT, 'border-b border-[#d9b779] pb-0.5 font-semibold')}>予約する</a>
      </div>
    </nav>
  )
}

function Hero({ store, wide }: TemplateProps) {
  const rows = [store.hours && `営業 ${store.hours}`, store.closed && `定休 ${store.closed}`, store.address].filter(Boolean)
  return (
    <section className={wide ? 'px-14 pb-20 pt-24' : 'px-6 pb-14 pt-14'}>
      <p className={cx(MUTED, 'text-xs tracking-[0.08em]')}>
        {CATEGORIES[store.category].label}
        <span className="mx-2">/</span>
        {CATEGORIES[store.category].en}
      </p>
      <h1
        className={cx(
          'mt-8 font-bold tracking-[-0.01em]',
          wide ? 'text-[clamp(44px,7cqw,84px)] leading-[1.18]' : 'text-[34px] leading-[1.35]',
        )}
      >
        <Phrases text={catchCopy(store)} />
      </h1>
      <div className={cx(LINE, 'border-t', wide ? 'mt-20 grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-16 pt-10' : 'mt-12 space-y-8 pt-8')}>
        {store.description && <p className={cx(MUTED, 'max-w-[34em] text-[15px] leading-[2]')}>{store.description}</p>}
        <div>
          {rows.length > 0 && (
            <ul className="space-y-1 text-[13px] leading-relaxed">
              {rows.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          )}
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            <a href="#reserve" className={BTN}>{ctaLabel(store)}</a>
            <a href="#menu" className="border-b border-white/40 pb-0.5 text-sm hover:border-white">メニュー・料金</a>
          </div>
        </div>
      </div>
    </section>
  )
}

/** 左に番号と見出し、右に本文の2列（スマホでは縦積み） */
function Block({ id, index, title, wide, children }: { id?: string; index: number; title: ReactNode; wide: boolean; children: ReactNode }) {
  return (
    <section id={id} className={cx(LINE, 'border-t', wide ? 'grid grid-cols-[240px_minmax(0,1fr)] gap-12 px-14 py-20' : 'px-6 py-14')}>
      <header className={wide ? '' : 'mb-8'}>
        <p className={cx(ACCENT, 'text-xs font-semibold tabular-nums tracking-[0.1em]')}>{num(index)}</p>
        <h2 className="mt-3 text-xl font-bold">{title}</h2>
      </header>
      <div>{children}</div>
    </section>
  )
}

export default function ModernPage(props: TemplateProps) {
  const { store, sections, wide } = props
  const order = visibleSections(sections, store)
  const idx = (k: SectionKey) => order.indexOf(k)
  const items = menuItems(store)
  return (
    <div className="min-h-full bg-[#0e0e0e] text-[#f2f0eb]">
      <Nav {...props} />
      <Hero {...props} />

      {sections.features && (
        <Block index={idx('features')} title="選ばれる理由" wide={wide}>
          <ol className="divide-y divide-white/15">
            {store.features.map((f) => (
              <li key={f.title} className={cx('py-6 first:pt-0 last:pb-0', wide && 'grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-10')}>
                <h3 className="text-[17px] font-semibold"><Phrases text={f.title} /></h3>
                <p className={cx(MUTED, 'text-sm leading-[1.9]', !wide && 'mt-2')}>{f.text}</p>
              </li>
            ))}
          </ol>
        </Block>
      )}

      {sections.menu && items.length > 0 && (
        <Block id="menu" index={idx('menu')} title="メニュー・料金" wide={wide}>
          <ul className="divide-y divide-white/15">
            {items.map((m) => (
              <li key={m.name} className="flex items-baseline justify-between gap-6 py-5 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <h3 className="text-[17px] font-medium"><Phrases text={m.name} /></h3>
                  {m.description && <p className={cx(MUTED, 'mt-1 text-xs')}>{m.description}</p>}
                </div>
                <p className={cx(ACCENT, 'shrink-0 text-xl tabular-nums')}>{m.price}</p>
              </li>
            ))}
          </ul>
        </Block>
      )}

      {sections.voices && (
        <Block index={idx('voices')} title="お客様の声" wide={wide}>
          <div className="divide-y divide-white/15">
            {store.voices.map((v) => (
              <figure key={v.name} className="py-7 first:pt-0 last:pb-0">
                <blockquote className={cx('leading-[1.9]', wide ? 'text-[19px]' : 'text-base')}>{v.text}</blockquote>
                <figcaption className={cx(MUTED, 'mt-4 text-xs')}>{v.name}</figcaption>
              </figure>
            ))}
          </div>
        </Block>
      )}

      {sections.access && (
        <Block id="access" index={idx('access')} title="アクセス" wide={wide}>
          <dl className="divide-y divide-white/15 text-sm">
            {infoRows(store).map(([k, v]) => (
              <div key={k} className="grid grid-cols-[6.5em_minmax(0,1fr)] gap-4 py-4 first:pt-0 last:pb-0">
                <dt className={MUTED}>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </Block>
      )}

      {sections.cta && (
        <section id="reserve" className={cx(LINE, 'border-t', wide ? 'flex items-end justify-between gap-12 px-14 py-24' : 'px-6 py-16')}>
          <h2 className={cx('font-bold', wide ? 'text-[clamp(28px,4.2cqw,46px)] leading-[1.3]' : 'text-[26px] leading-[1.4]')}>
            <Phrases text="まずはお気軽にご予約ください" />
          </h2>
          <div className={cx('shrink-0', wide ? 'text-right' : 'mt-8')}>
            <a href="#reserve" className={BTN}>{ctaLabel(store)}</a>
            {store.phone && <p className={cx(MUTED, 'mt-4 text-sm')}>Tel. {store.phone}</p>}
          </div>
        </section>
      )}

      <footer className={cx(LINE, MUTED, 'flex flex-wrap justify-between gap-2 border-t text-xs', wide ? 'px-14 py-8' : 'px-6 py-8')}>
        <span>{storeName(store)}</span>
        <span>© {storeName(store)}</span>
      </footer>
    </div>
  )
}
