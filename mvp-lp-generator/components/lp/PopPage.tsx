import { CATEGORIES } from '@/lib/categories'
import { cx } from '@/lib/cx'
import { catchCopy, ctaLabel, hoursWord, infoRows, menuItems, menuTitle, Phrases, storeName, type TemplateProps } from './shared'

/*
 * ポップ: 街の整体院・教室のサイト（STUDIO「ぬくもり鍼灸・整骨院」の白い箱に載せた見出し・
 * ヘッダーの電話番号・角の小さいボタン、「SORA」の大きな色面）を手本にした構成。
 * 英字の小見出しと大きな通し番号は「AI 製 LP の型」に見えるため使わず、和文の見出しだけにする。
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

/**
 * 和文の見出しだけ。英字の小見出し（FEATURES 等）は「AI 製 LP の型」に見えるので置かない。
 * 下に珊瑚色の短い太線を敷いて、色面と同じ色で全体をつなぐ
 */
function H2({ text, lead, wide, onColor }: { text: string; lead?: string; wide: boolean; onColor?: boolean }) {
  return (
    <div className="text-center">
      <h2 className={cx('font-extrabold leading-snug', wide ? 'text-[32px]' : 'text-[24px]')}>
        <Phrases text={text} lead={lead} />
      </h2>
      <span aria-hidden className={cx('mx-auto mt-4 block h-1.5 w-12 rounded-full', onColor ? 'bg-[#1f2a37]' : CORAL)} />
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
            <p className="text-lg font-extrabold tabular-nums">電話 {store.phone}</p>
            {store.hours && <p className={cx(MUTED, 'text-[11px] font-bold')}>{hoursWord(store)} {store.hours}</p>}
          </div>
        )}
        <a href="#reserve" className="rounded-md bg-[#1f2a37] px-4 py-2 text-xs font-bold text-white hover:bg-[#33435a]">
          {wide ? 'WEB予約' : '予約'}
        </a>
      </div>
    </nav>
  )
}

/** 見出しの白い箱と同じ白い面に載せた価格（手本の「色面＋見出し箱＋価格」の組み） */
function LeadMenu({ store, wide }: TemplateProps) {
  const lead = menuItems(store)[0]
  if (!lead) return null
  return (
    <div className={cx('rounded-lg bg-white', wide ? 'px-7 py-8' : 'mt-10 px-6 py-6')}>
      <p className={cx(ACCENT, 'text-xs font-extrabold')}>おすすめメニュー</p>
      <p className="mt-3 text-lg font-extrabold">
        <Phrases text={lead.name} />
      </p>
      {lead.description && <p className={cx(MUTED, 'mt-1 text-xs font-medium')}>{lead.description}</p>}
      <p className={cx('mt-4 border-b-2 pb-5 font-extrabold leading-none tabular-nums', RULE, wide ? 'text-[clamp(32px,4.6cqw,60px)]' : 'text-[48px]')}>{lead.price}</p>
      {/* 項目ごとに改行を禁止し、項目の間でだけ折り返す（「定休 毎週火／曜日」のような語中改行を防ぐ） */}
      {(store.hours || store.closed) && (
        <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold">
          {store.hours && <span className="whitespace-nowrap">{hoursWord(store)} {store.hours}</span>}
          {store.closed && <span className="whitespace-nowrap">定休 {store.closed}</span>}
        </p>
      )}
    </div>
  )
}

function Hero(props: TemplateProps) {
  const { store, wide } = props
  return (
    <section className={wide ? 'px-6 pt-6' : 'px-3 pt-3'}>
      {/* 写真の代わりの大きな色面。装飾は置かず、白い見出し箱と白い価格の面だけで組む */}
      <div className={cx('rounded-lg', CORAL, wide ? 'px-14 pb-16 pt-12' : 'px-5 pb-10 pt-8')}>
        <p className="text-sm font-bold">
          {CATEGORIES[store.category].label}｜{storeName(store)}
        </p>
        <div className={cx(wide ? 'mt-16 grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] items-center gap-12' : 'mt-12')}>
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
      <H2 lead={`${storeName(store)}が`} text="選ばれる理由" wide={wide} />
      {/*
        「3列の特長カード」はテンプレートの型に見えるので使わない。PC では見出しと本文を横に組んだ段を
        左右交互にずらして置き、読む順に視線が蛇行するようにする（手本の整骨院サイトの「理由」の組み方）
      */}
      <ul className={cx('mx-auto mt-12 max-w-5xl', wide ? 'space-y-12' : 'border-b', LINE)}>
        {store.features.map((f, i) => (
          <li
            key={f.title}
            className={cx(
              wide
                ? cx('grid w-[78%] grid-cols-[minmax(0,15em)_minmax(0,1fr)] items-baseline gap-10 border-t-2 pt-6', RULE, i % 2 === 1 && 'ml-auto')
                : cx('border-t py-7', LINE),
            )}
          >
            <h3 className={cx(ACCENT, 'font-extrabold leading-snug', wide ? 'text-2xl' : 'text-xl')}><Phrases text={f.title} /></h3>
            <p className={cx(MUTED, 'text-[15px] leading-[1.9]', !wide && 'mt-2')}>{f.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Menu({ store, wide }: TemplateProps) {
  const items = menuItems(store)
  if (items.length === 0) return null
  return (
    <section id="menu" className={cx(CREAM, pad(wide))}>
      <H2 text={menuTitle(store)} wide={wide} />
      <ul className={cx('mx-auto mt-12 max-w-3xl divide-y divide-[#1f2a37]/15 border-y-2', RULE)}>
        {items.map((m) => (
          <li key={m.name} className={cx('flex items-center justify-between gap-4', wide ? 'px-2 py-6' : 'py-5')}>
            <div className="min-w-0">
              <h3 className="text-[17px] font-extrabold"><Phrases text={m.name} /></h3>
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
      <H2 text={`アクセス・${hoursWord(store)}時間`} wide={wide} />
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
        <H2 text="まずはお気軽にご予約ください" wide={wide} onColor />
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
