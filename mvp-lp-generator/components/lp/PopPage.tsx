import { CATEGORIES } from '@/lib/categories'
import { cx } from '@/lib/cx'
import { catchCopy, ctaLabel, infoRows, menuItems, num, Phrases, storeName, type TemplateProps } from './shared'

/*
 * ポップ: 街の整体院・教室のサイト（STUDIO「ぬくもり鍼灸・整骨院」の白い箱に載せた見出しと
 * ヘッダーの電話番号、「SORA」の大きな色面）を手本にした構成。
 * 写真の代わりに珊瑚色の大きな色面を置き、見出しを白い箱で切り抜く。影・グラデーションは使わない。
 */
const NAVY = 'text-[#1f2a37]'
const MUTED = 'text-[#1f2a37]/75' // 白・クリーム地で約 5:1 以上
const ACCENT = 'text-[#b43a26]' // 白で約 5.9:1 / クリーム地で約 5.4:1
const BTN =
  'inline-flex items-center justify-center rounded-full bg-[#1f2a37] px-7 py-4 text-sm font-bold text-white transition-colors hover:bg-[#33435a]'

const pad = (wide: boolean) => (wide ? 'px-14 py-24' : 'px-5 py-16')

function H2({ text, lead, wide }: { text: string; lead?: string; wide: boolean }) {
  return (
    <h2 className={cx('text-center font-extrabold', wide ? 'text-[32px]' : 'text-[24px]')}>
      <Phrases text={text} lead={lead} />
    </h2>
  )
}

function Nav({ store, wide }: TemplateProps) {
  return (
    <nav className={cx('sticky top-0 z-10 flex items-center justify-between gap-6 border-b border-[#1f2a37]/10 bg-white/95', wide ? 'px-8 py-3' : 'px-4 py-3')}>
      <span className="truncate text-lg font-extrabold">{storeName(store)}</span>
      <div className="flex shrink-0 items-center gap-6">
        {wide && store.phone && (
          <div className="text-right leading-tight">
            <p className="text-lg font-extrabold tabular-nums">Tel. {store.phone}</p>
            {store.hours && <p className={cx(MUTED, 'text-[11px] font-bold')}>受付 {store.hours}</p>}
          </div>
        )}
        <a href="#reserve" className="rounded-full bg-[#1f2a37] px-4 py-2 text-xs font-bold text-white hover:bg-[#33435a]">
          {wide ? 'WEB予約' : '予約'}
        </a>
      </div>
    </nav>
  )
}

function Hero({ store, wide }: TemplateProps) {
  const lead = menuItems(store)[0]
  return (
    <section className={wide ? 'p-6' : 'p-3'}>
      <div className={cx('rounded-[28px] bg-[#ff6b4a]', wide ? 'grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-end gap-12 px-14 py-16' : 'px-5 py-10')}>
        <div className="min-w-0">
          <p className="text-sm font-bold">
            {CATEGORIES[store.category].label}｜{storeName(store)}
          </p>
          {/* 1行ずつ白い箱で切り抜く。折り返した行にも箱が付くよう box-decoration-break: clone */}
          <h1 className={cx('mt-6 font-extrabold', wide ? 'text-[clamp(30px,4.4cqw,46px)] leading-[1.9]' : 'text-[24px] leading-[1.95]')}>
            <span className="bg-white px-3 py-1 [-webkit-box-decoration-break:clone] [box-decoration-break:clone]">
              <Phrases text={catchCopy(store)} />
            </span>
          </h1>
          {store.description && <p className="mt-8 max-w-[30em] text-[15px] font-medium leading-[1.9]">{store.description}</p>}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a href="#reserve" className={BTN}>{ctaLabel(store)}</a>
            <a href="#menu" className="border-b-2 border-[#1f2a37] pb-0.5 text-sm font-bold">料金を見る</a>
          </div>
        </div>
        {lead && (
          <div className={cx('rounded-2xl bg-white p-7', !wide && 'mt-10')}>
            <p className={cx(ACCENT, 'text-xs font-extrabold')}>おすすめメニュー</p>
            <p className="mt-3 text-lg font-extrabold">{lead.name}</p>
            {lead.description && <p className={cx(MUTED, 'mt-1 text-xs')}>{lead.description}</p>}
            <p className="mt-5 text-[44px] font-extrabold leading-none tabular-nums">{lead.price}</p>
            {(store.hours || store.closed) && (
              <p className={cx(MUTED, 'mt-5 border-t border-[#1f2a37]/10 pt-4 text-xs font-bold')}>
                {store.hours && `受付 ${store.hours}`}
                {store.hours && store.closed && '　'}
                {store.closed && `定休 ${store.closed}`}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

function Features({ store, wide }: TemplateProps) {
  return (
    <section className={pad(wide)}>
      <H2 lead={`${storeName(store)}が`} text="選ばれる理由" wide={wide} />
      <ol className={cx('mx-auto mt-12 grid max-w-6xl gap-5', wide && 'grid-cols-3')}>
        {store.features.map((f, i) => (
          <li key={f.title} className="rounded-2xl bg-[#fff4ea] p-7">
            <span className={cx(ACCENT, 'inline-block rounded-md bg-white px-2.5 py-1 text-sm font-extrabold tabular-nums')}>{num(i)}</span>
            <h3 className="mt-5 text-lg font-extrabold">{f.title}</h3>
            <p className={cx(MUTED, 'mt-2 text-sm leading-[1.9]')}>{f.text}</p>
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
    <section id="menu" className={cx('bg-[#fff4ea]', pad(wide))}>
      <H2 text="メニュー・料金" wide={wide} />
      <ul className="mx-auto mt-12 max-w-3xl divide-y divide-[#1f2a37]/10 rounded-2xl bg-white">
        {items.map((m) => (
          <li key={m.name} className={cx('flex items-center justify-between gap-4', wide ? 'px-8 py-6' : 'px-5 py-5')}>
            <div className="min-w-0">
              <h3 className="text-[17px] font-extrabold">{m.name}</h3>
              {m.description && <p className={cx(MUTED, 'mt-1 text-xs')}>{m.description}</p>}
            </div>
            <p className={cx(ACCENT, 'shrink-0 font-extrabold tabular-nums', wide ? 'text-2xl' : 'text-xl')}>{m.price}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Voices({ store, wide }: TemplateProps) {
  return (
    <section className={pad(wide)}>
      <H2 text="お客様の声" wide={wide} />
      <div className={cx('mx-auto mt-12 grid max-w-4xl gap-5', wide && 'grid-cols-2')}>
        {store.voices.map((v) => (
          <figure key={v.name} className="rounded-2xl border-2 border-[#1f2a37] p-7">
            <blockquote className="text-[15px] font-medium leading-[1.9]">{v.text}</blockquote>
            <figcaption className={cx(ACCENT, 'mt-4 text-xs font-extrabold')}>{v.name}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

function Access({ store, wide }: TemplateProps) {
  return (
    <section id="access" className={cx('bg-[#fff4ea]', pad(wide))}>
      <H2 text="アクセス・受付時間" wide={wide} />
      <dl className={cx('mx-auto mt-12 max-w-2xl rounded-2xl bg-white text-sm', wide ? 'px-8 py-3' : 'px-5 py-2')}>
        {infoRows(store).map(([k, v]) => (
          <div key={k} className="grid grid-cols-[6em_minmax(0,1fr)] gap-4 border-b border-[#1f2a37]/10 py-4 last:border-b-0">
            <dt className="font-extrabold">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function Cta({ store, wide }: TemplateProps) {
  return (
    <section id="reserve" className={wide ? 'p-6' : 'p-3'}>
      <div className={cx('rounded-[28px] bg-[#ff6b4a] text-center', wide ? 'px-14 py-20' : 'px-5 py-14')}>
        <H2 text="まずはお気軽にご予約ください" wide={wide} />
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          <a href="#reserve" className={BTN}>{ctaLabel(store)}</a>
          {store.phone && (
            <p className={cx('leading-tight', wide && 'text-left')}>
              <span className="block text-xs font-bold">お電話でのご予約</span>
              <span className="text-[28px] font-extrabold tabular-nums">{store.phone}</span>
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export default function PopPage(props: TemplateProps) {
  const { store, sections } = props
  return (
    <div className={cx('min-h-full bg-white', NAVY)}>
      <Nav {...props} />
      <Hero {...props} />
      {sections.features && <Features {...props} />}
      {sections.menu && <Menu {...props} />}
      {sections.voices && <Voices {...props} />}
      {sections.access && <Access {...props} />}
      {sections.cta && <Cta {...props} />}
      <footer className={cx(MUTED, 'px-6 py-10 text-center text-xs font-bold')}>© {storeName(store)}</footer>
    </div>
  )
}
