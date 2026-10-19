import { CATEGORIES } from '@/lib/categories'
import { cx } from '@/lib/cx'
import { catchCopy, ctaLabel, infoRows, menuItems, Phrases, storeName, type TemplateProps } from './shared'

/*
 * ナチュラル: 個人経営のカフェ・和の店のサイト（STUDIO「Cafe Flat」の細い額縁線、
 * 「鍼灸整体サロン SORA」の縦書きコピー）を手本にした、写真なしで成立する紙もの風の構成。
 * 装飾は「余白・細い罫線・明朝の縦書き」だけ。カード・影・角丸・グラデーションは使わない。
 */
const MUTED = 'text-[#2e2620]/75' // #f7f3ec 上で約 6:1
const ACCENT = 'text-[#8a5526]' // #f7f3ec 上で約 5.5:1
const LINE = 'border-[#2e2620]/15'
const BTN =
  'inline-flex items-center justify-center bg-[#2e2620] px-8 py-4 text-sm tracking-[0.14em] text-[#f7f3ec] transition-colors hover:bg-[#1c1712]'
const KANJI_NUM = ['一', '二', '三', '四', '五', '六']

/** 「、」「。」などの直後で列を分ける（縦書きの見出しを句ごとの列にする） */
const toLines = (text: string) => text.split(/(?<=[、。！？])/).filter(Boolean)

const pad = (wide: boolean) => (wide ? 'px-16 py-24' : 'px-6 py-16')

function H2({ text, lead, wide }: { text: string; lead?: string; wide: boolean }) {
  return (
    <div className="text-center">
      <h2 className={cx('font-mincho font-semibold tracking-[0.14em]', wide ? 'text-[28px]' : 'text-[22px]')}>
        <Phrases text={text} lead={lead} />
      </h2>
      <span aria-hidden className="mx-auto mt-5 block h-px w-10 bg-[#2e2620]/40" />
    </div>
  )
}

function Nav({ store, wide }: TemplateProps) {
  return (
    <nav className={cx('sticky top-0 z-10 flex items-center justify-between bg-[#f7f3ec]/95', wide ? 'px-16 py-6' : 'px-6 py-4')}>
      <span className="truncate font-mincho text-lg font-semibold tracking-[0.14em]">{storeName(store)}</span>
      <div className="flex shrink-0 items-center gap-8 text-[13px] tracking-[0.12em]">
        {wide && (
          <>
            <a href="#menu" className="hover:underline hover:underline-offset-4">メニュー</a>
            <a href="#access" className="hover:underline hover:underline-offset-4">店舗情報</a>
          </>
        )}
        <a href="#reserve" className="border-b border-[#2e2620] pb-0.5">ご予約</a>
      </div>
    </nav>
  )
}

function Hero({ store, wide }: TemplateProps) {
  const rows = [store.hours && `営業 ${store.hours}`, store.closed && `定休 ${store.closed}`, store.address].filter(Boolean)
  return (
    <section className={cx('grid items-end', wide ? 'min-h-[600px] grid-cols-[minmax(0,1fr)_auto] gap-16 px-16 pb-24 pt-16' : 'gap-12 px-6 pb-16 pt-10')}>
      <div className={cx(wide ? 'max-w-[30em]' : 'order-2')}>
        <p className={cx(ACCENT, 'text-xs tracking-[0.2em]')}>{CATEGORIES[store.category].label}</p>
        {store.description && <p className={cx(MUTED, 'mt-6 text-[15px] leading-[2.1] tracking-[0.06em]')}>{store.description}</p>}
        {rows.length > 0 && (
          <ul className={cx(LINE, 'mt-8 space-y-1 border-l pl-4 text-[13px] leading-relaxed tracking-[0.06em]')}>
            {rows.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        )}
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <a href="#reserve" className={BTN}>{ctaLabel(store)}</a>
          <a href="#menu" className="border-b border-[#2e2620]/40 pb-0.5 text-sm tracking-[0.12em] hover:border-[#2e2620]">メニューを見る</a>
        </div>
      </div>
      {/* 縦書きのキャッチコピー。句読点で列を改め、長すぎる列は max-height で文節単位に折り返す */}
      <h1
        className={cx(
          'font-mincho font-semibold leading-[1.7] tracking-[0.2em] [writing-mode:vertical-rl]',
          wide ? 'max-h-[11em] justify-self-end text-[46px]' : 'order-1 max-h-[10em] justify-self-center text-[32px]',
        )}
      >
        {toLines(catchCopy(store)).map((line, i) => (
          <span key={i} className="block">
            <Phrases text={line} />
          </span>
        ))}
      </h1>
    </section>
  )
}

function Features({ store, wide }: TemplateProps) {
  return (
    <section className={cx('bg-[#efe8dc]', pad(wide))}>
      <H2 lead={`${storeName(store)}の`} text="こだわり" wide={wide} />
      <ol className={cx('mx-auto mt-14 grid max-w-5xl', wide ? 'grid-cols-3 divide-x' : 'divide-y', 'divide-[#2e2620]/15')}>
        {store.features.map((f, i) => (
          <li key={f.title} className={wide ? 'px-10' : 'py-8 first:pt-0 last:pb-0'}>
            <p aria-hidden className={cx(ACCENT, 'font-mincho text-2xl')}>{KANJI_NUM[i] ?? i + 1}</p>
            <h3 className="mt-4 font-mincho text-lg font-semibold tracking-[0.08em]">{f.title}</h3>
            <p className={cx(MUTED, 'mt-3 text-sm leading-[2] tracking-[0.04em]')}>{f.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Menu({ store, wide }: TemplateProps) {
  const items = menuItems(store)
  if (items.length === 0) return null
  return (
    <section id="menu" className={pad(wide)}>
      <H2 text="お品書き" wide={wide} />
      <ul className="mx-auto mt-12 max-w-2xl">
        {items.map((m) => (
          <li key={m.name} className={cx(LINE, 'border-b py-6')}>
            <div className="flex items-baseline gap-4">
              <h3 className="font-mincho text-[17px] font-semibold tracking-[0.08em]">{m.name}</h3>
              <span aria-hidden className="flex-1 border-b border-dotted border-[#2e2620]/35" />
              <p className="shrink-0 font-mincho text-[17px] tabular-nums tracking-[0.04em]">{m.price}</p>
            </div>
            {m.description && <p className={cx(MUTED, 'mt-1.5 text-[13px] tracking-[0.04em]')}>{m.description}</p>}
          </li>
        ))}
      </ul>
    </section>
  )
}

function Voices({ store, wide }: TemplateProps) {
  return (
    <section className={cx('bg-[#efe8dc]', pad(wide))}>
      <H2 text="お客様の声" wide={wide} />
      <div className={cx('mx-auto mt-14 grid max-w-4xl', wide ? 'grid-cols-2 gap-16' : 'gap-10')}>
        {store.voices.map((v) => (
          <figure key={v.name} className={cx(LINE, 'border-t pt-8')}>
            <blockquote className="font-mincho text-base leading-[2.1] tracking-[0.06em]">{v.text}</blockquote>
            <figcaption className={cx(MUTED, 'mt-5 text-xs tracking-[0.12em]')}>{v.name}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

function Access({ store, wide }: TemplateProps) {
  return (
    <section id="access" className={pad(wide)}>
      <H2 text="店舗情報" wide={wide} />
      <dl className={cx(LINE, 'mx-auto mt-12 max-w-xl border-t text-sm tracking-[0.06em]')}>
        {infoRows(store).map(([k, v]) => (
          <div key={k} className={cx(LINE, 'grid grid-cols-[6.5em_minmax(0,1fr)] gap-4 border-b py-5')}>
            <dt className={MUTED}>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function Cta({ store, wide }: TemplateProps) {
  return (
    <section id="reserve" className={cx(LINE, 'border-t text-center', pad(wide))}>
      <H2 text="ご来店をお待ちしております" wide={wide} />
      <a href="#reserve" className={cx(BTN, 'mt-10')}>{ctaLabel(store)}</a>
      {store.phone && <p className={cx(MUTED, 'mt-6 text-sm tracking-[0.1em]')}>お電話 {store.phone}</p>}
    </section>
  )
}

export default function NaturalPage(props: TemplateProps) {
  const { store, sections, wide } = props
  return (
    // 額縁の細い線（Cafe Flat の手法）。写真が無くても「紙の上に組んだ」印象になる
    <div className={cx('min-h-full bg-[#f7f3ec] text-[#2e2620]', wide ? 'p-4' : 'p-2.5')}>
      <div className={cx(LINE, 'border')}>
        <Nav {...props} />
        <Hero {...props} />
        {sections.features && <Features {...props} />}
        {sections.menu && <Menu {...props} />}
        {sections.voices && <Voices {...props} />}
        {sections.access && <Access {...props} />}
        {sections.cta && <Cta {...props} />}
        <footer className={cx(LINE, MUTED, 'border-t px-6 py-10 text-center text-xs tracking-[0.12em]')}>
          © {storeName(store)}
        </footer>
      </div>
    </div>
  )
}
