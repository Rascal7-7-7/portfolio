import { CATEGORIES } from '@/lib/categories'
import { cx } from '@/lib/cx'
import { catchCopy, ctaLabel, infoRows, menuItems, num, Phrases, storeName, type TemplateProps } from './shared'

/*
 * ポップ: 街の整体院・教室のサイト（STUDIO「ぬくもり鍼灸・整骨院」の白い箱に載せた見出し・
 * ヘッダーの電話番号・英字の小見出し・角の小さいボタン、「SORA」の大きな色面）を手本にした構成。
 * 写真の代わりに珊瑚色の大きな色面を置き、見出しだけを白い箱で切り抜く。
 * カードは使わず、線と色面（白／クリーム）の切り替えで区切る。影・グラデーションは使わない。
 */
const NAVY = 'text-[#1f2a37]'
const MUTED = 'text-[#1f2a37]/75' // 白・クリーム地で約 5:1 以上
const ACCENT = 'text-[#b43a26]' // 白で約 5.9:1 / クリーム地で約 5.4:1
const LINE = 'border-[#1f2a37]/15'
const RULE = 'border-[#1f2a37]' // 区切りの太線
const CORAL = 'bg-[#ff6b4a]' // 紺 #1f2a37 の文字で約 5.1:1（珊瑚色の上の文字は不透明の紺だけ）
const CREAM = 'bg-[#fff4ea]'
const BTN =
  'inline-flex items-center justify-center rounded-lg bg-[#1f2a37] px-7 py-4 text-sm font-bold text-white transition-colors hover:bg-[#33435a]'

const pad = (wide: boolean) => (wide ? 'px-14 py-24' : 'px-5 py-16')

/** 英字の小見出し＋和文の見出し（手本の「Features / 当院の特徴」の組み方） */
function H2({ en, text, lead, wide, onColor }: { en: string; text: string; lead?: string; wide: boolean; onColor?: boolean }) {
  return (
    <div className="text-center">
      <p className={cx(!onColor && ACCENT, 'text-xs font-extrabold tracking-[0.16em]')}>{en}</p>
      <h2 className={cx('mt-3 font-extrabold', wide ? 'text-[32px]' : 'text-[24px]')}>
        <Phrases text={text} lead={lead} />
      </h2>
    </div>
  )
}

function Nav({ store, wide }: TemplateProps) {
  return (
    <nav className={cx('sticky top-0 z-10 flex items-center justify-between gap-6 border-b bg-white', LINE, wide ? 'px-8 py-3' : 'px-4 py-3')}>
      <span className="truncate text-lg font-extrabold">{storeName(store)}</span>
      <div className="flex shrink-0 items-center gap-6">
        {wide && store.phone && (
          <div className="text-right leading-tight">
            <p className="text-lg font-extrabold tabular-nums">Tel. {store.phone}</p>
            {store.hours && <p className={cx(MUTED, 'text-[11px] font-bold')}>受付 {store.hours}</p>}
          </div>
        )}
        <a href="#reserve" className="rounded-md bg-[#1f2a37] px-4 py-2 text-xs font-bold text-white hover:bg-[#33435a]">
          {wide ? 'WEB予約' : '予約'}
        </a>
      </div>
    </nav>
  )
}

function LeadMenu({ store, wide }: TemplateProps) {
  const lead = menuItems(store)[0]
  if (!lead) return null
  return (
    <div className={cx('border-t-2 pt-5', RULE, !wide && 'mt-12')}>
      <p className="text-xs font-extrabold tracking-[0.16em]">おすすめメニュー</p>
      <p className="mt-3 text-lg font-extrabold">{lead.name}</p>
      {lead.description && <p className="mt-1 text-xs font-medium">{lead.description}</p>}
      <p className={cx('mt-4 font-extrabold leading-none tabular-nums', wide ? 'text-[64px]' : 'text-[48px]')}>{lead.price}</p>
      {(store.hours || store.closed) && (
        <p className="mt-5 text-xs font-bold">
          {store.hours && `受付 ${store.hours}`}
          {store.hours && store.closed && '　'}
          {store.closed && `定休 ${store.closed}`}
        </p>
      )}
    </div>
  )
}

function Hero(props: TemplateProps) {
  const { store, wide } = props
  return (
    <section className={wide ? 'px-6 pt-6' : 'px-3 pt-3'}>
      {/* 写真の代わりの大きな色面。右上に一段明るい大きな円をはみ出させて、面に奥行きと温かさを出す */}
      <div className={cx('relative isolate overflow-hidden rounded-lg', CORAL, wide ? 'min-h-[560px] px-14 pb-16 pt-12' : 'px-5 pb-10 pt-8')}>
        <span
          aria-hidden
          className={cx('absolute -z-10 rounded-full bg-[#ff8466]', wide ? '-right-24 -top-48 h-[580px] w-[580px]' : '-right-32 -top-28 h-[320px] w-[320px]')}
        />
        <p className="text-sm font-bold">
          {CATEGORIES[store.category].label}｜{storeName(store)}
        </p>
        <div className={cx(wide ? 'mt-28 grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] items-end gap-14' : 'mt-14')}>
          <div className="min-w-0">
            {/* 1行ずつ白い箱で切り抜く。折り返した行にも箱が付くよう box-decoration-break: clone */}
            <h1 className={cx('font-extrabold', wide ? 'text-[clamp(30px,4.4cqw,46px)] leading-[1.9]' : 'text-[24px] leading-[1.95]')}>
              <span className="rounded-md bg-white px-3 py-1 [-webkit-box-decoration-break:clone] [box-decoration-break:clone]">
                <Phrases text={catchCopy(store)} />
              </span>
            </h1>
            {store.description && <p className="mt-8 max-w-[30em] text-[15px] font-medium leading-[1.9]">{store.description}</p>}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a href="#reserve" className={BTN}>{ctaLabel(store)}</a>
              <a href="#menu" className={cx('border-b-2 pb-0.5 text-sm font-bold', RULE)}>料金を見る</a>
            </div>
          </div>
          <LeadMenu {...props} />
        </div>
      </div>
    </section>
  )
}

function Features({ store, wide }: TemplateProps) {
  return (
    <section className={pad(wide)}>
      <H2 en="FEATURES" lead={`${storeName(store)}が`} text="選ばれる理由" wide={wide} />
      <ol className={cx('mx-auto mt-12 grid max-w-6xl', LINE, wide ? 'grid-cols-3' : 'border-b')}>
        {store.features.map((f, i) => (
          <li key={f.title} className={cx(LINE, wide ? 'border-l px-8 py-2 first:border-l-0 first:pl-0 last:pr-0' : 'border-t py-7')}>
            <p className={cx(ACCENT, 'text-[40px] font-extrabold leading-none tabular-nums')}>{num(i)}</p>
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
    <section id="menu" className={cx(CREAM, pad(wide))}>
      <H2 en="MENU" text="メニュー・料金" wide={wide} />
      <ul className={cx('mx-auto mt-12 max-w-3xl divide-y divide-[#1f2a37]/15 border-y-2', RULE)}>
        {items.map((m) => (
          <li key={m.name} className={cx('flex items-center justify-between gap-4', wide ? 'px-2 py-6' : 'py-5')}>
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
      <H2 en="VOICE" text="お客様の声" wide={wide} />
      <div className={cx('mx-auto mt-12 grid max-w-4xl', wide ? 'grid-cols-2 gap-12' : 'gap-10')}>
        {store.voices.map((v) => (
          <figure key={v.name} className={cx('border-t-2 pt-6', RULE)}>
            <span aria-hidden className={cx(ACCENT, 'block text-[44px] font-extrabold leading-[0.6]')}>“</span>
            <blockquote className="mt-3 text-[15px] font-medium leading-[1.9]">{v.text}</blockquote>
            <figcaption className={cx(MUTED, 'mt-4 text-xs font-extrabold')}>{v.name}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

function Access({ store, wide }: TemplateProps) {
  return (
    <section id="access" className={cx(CREAM, pad(wide))}>
      <H2 en="ACCESS" text="アクセス・受付時間" wide={wide} />
      <dl className={cx('mx-auto mt-12 max-w-2xl border-y-2 text-sm', RULE)}>
        {infoRows(store).map(([k, v]) => (
          <div key={k} className={cx(LINE, 'grid grid-cols-[6em_minmax(0,1fr)] gap-4 border-b py-4 last:border-b-0', wide && 'px-2')}>
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
      <div className={cx('rounded-lg text-center', CORAL, wide ? 'px-14 py-20' : 'px-5 py-14')}>
        <H2 en="RESERVE" text="まずはお気軽にご予約ください" wide={wide} onColor />
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
