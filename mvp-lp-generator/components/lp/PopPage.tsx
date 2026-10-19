import { CATEGORIES } from '@/lib/categories'
import { cx } from '@/lib/cx'
import MobileBar, { HERO_CTA } from './MobileBar'
import { catchCopy, ctaLabel, hoursWord, infoRows, initialOf, menuItems, menuTitle, ownerOf, Phrases, storeName, type TemplateProps } from './shared'

/*
 * ポップ: 街の整体院・教室のサイト（STUDIO「ぬくもり鍼灸・整骨院」の白い箱に載せた見出し・
 * ヘッダーの電話番号・角の小さいボタン、「SORA」の大きな色面）を手本にした構成。
 * 英字の小見出しと大きな通し番号は「AI 製 LP の型」に見えるため使わず、和文の見出しだけにする。
 * 写真の代わりに珊瑚色の大きな色面を置き、見出しだけを白い箱で切り抜く。差し色は珊瑚色の面の1色だけ。
 * カードは使わず、線と色面（白／クリーム）の切り替えで区切る。影・グラデーションは使わない。
 * 見出しは左揃え・飾りなし（中央寄せ＋短い下線はテンプレートの型に見える）。締めの色面だけ中央に組む。
 */
const NAVY = 'text-[#1f2a37]'
const MUTED = 'text-[#1f2a37]/75' // 白・クリーム地で約 5:1 以上
// 差し色は珊瑚色の面だけにする（文字の差し色を別に持つと2色になる）。見出し・価格は紺のまま太さで立てる
const LINE = 'border-[#1f2a37]/15'
const RULE = 'border-[#1f2a37]' // 区切りの太線
const CORAL = 'bg-[#ff6b4a]' // 紺 #1f2a37 の文字で約 5.1:1（珊瑚色の上の文字は不透明の紺だけ）
const CREAM = 'bg-[#fff4ea]'
const BTN =
  'inline-flex items-center justify-center rounded-lg bg-[#1f2a37] px-7 py-4 text-sm font-bold text-white transition-colors hover:bg-[#33435a]'

const pad = (wide: boolean) => (wide ? 'px-14 py-24' : 'px-5 py-16')
/** 見出しと本文の左端をそろえる共通の幅 */
const WRAP = 'mx-auto max-w-4xl'

/** 和文の見出しだけ。英字の小見出し（FEATURES 等）・下線などの飾りは置かず、左揃えの太字で組む */
function H2({ text, lead, wide }: { text: string; lead?: string; wide: boolean }) {
  return (
    <h2 className={cx('font-extrabold leading-snug', wide ? 'text-[32px]' : 'text-[24px]')}>
      <Phrases text={text} lead={lead} />
    </h2>
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

/** 珊瑚色の面に直接載せた価格。白い箱で囲むと面の中に面が入るので、上の太線と大きな数字だけで区切る */
function LeadMenu({ store, wide }: TemplateProps) {
  const lead = menuItems(store)[0]
  if (!lead) return null
  return (
    <div className={cx('border-t-4 border-[#1f2a37] pt-5', !wide && 'mt-10')}>
      <p className="text-xs font-extrabold">おすすめメニュー</p>
      <p className="mt-3 text-lg font-extrabold">
        <Phrases text={lead.name} />
      </p>
      {/* 珊瑚色の上の文字は不透明の紺だけ（半透明にすると 4.5:1 を割る） */}
      {lead.description && <p className="mt-1 text-xs font-medium">{lead.description}</p>}
      <p className={cx('mt-4 border-b-2 pb-5 font-extrabold leading-none tabular-nums', RULE, wide ? 'text-[clamp(40px,5.6cqw,72px)]' : 'text-[56px]')}>{lead.price}</p>
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
      {/* 写真の代わりの大きな色面。装飾は置かず、白い見出し箱と太線で区切った価格だけで組む */}
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
              <a href="#reserve" className={BTN} {...HERO_CTA}>{ctaLabel(store)}</a>
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
      <div className={WRAP}>
      <H2 lead={`${storeName(store)}が`} text="選ばれる理由" wide={wide} />
      {/*
        「3列の特長カード」はテンプレートの型に見えるので使わない。PC では見出しと本文を横に組んだ段を
        左端をそろえて縦に積む（左右交互のずらしは配置のずれに見えるのでやめた）
      */}
      {/* 下端の線は置かない（直後のあいさつの太線と二重になる） */}
      <ul className={cx('mt-12', wide && 'space-y-12')}>
        {store.features.map((f) => (
          <li
            key={f.title}
            className={cx(
              wide
                ? cx('grid grid-cols-[minmax(0,15em)_minmax(0,1fr)] items-baseline gap-10 border-t-2 pt-6', RULE)
                : cx('border-t py-7', LINE),
            )}
          >
            <h3 className={cx('font-extrabold leading-snug', wide ? 'text-2xl' : 'text-xl')}><Phrases text={f.title} /></h3>
            <p className={cx(MUTED, 'text-[15px] leading-[1.9]', !wide && 'mt-2')}>{f.text}</p>
          </li>
        ))}
      </ul>
      </div>
    </section>
  )
}

/**
 * 院長のあいさつ。写真の代わりに姓の1文字目をクリームの角の面に大きく組む（丸い枠のアイコンにはしない）
 */
function Greeting({ store, wide }: TemplateProps) {
  const owner = ownerOf(store)
  if (!owner) return null
  return (
    <section className={cx(pad(wide), '!pt-0')}>
      <div className={WRAP}>
      <div className={cx('border-t-2 pt-12', RULE, wide && 'grid grid-cols-[180px_minmax(0,1fr)] gap-12')}>
        <p aria-hidden className={cx(CREAM, 'flex aspect-square items-center justify-center rounded-lg font-extrabold leading-none', wide ? 'text-[88px]' : 'w-24 text-[48px]')}>
          {initialOf(owner.name)}
        </p>
        <div className={cx(!wide && 'mt-8')}>
          <H2 text={`${owner.role}からのご挨拶`} wide={wide} />
          <p className="mt-6 max-w-[36em] text-[15px] font-medium leading-[1.95]">{owner.message}</p>
          <p className="mt-6 text-sm font-extrabold">
            <span className={cx(MUTED, 'mr-3')}>{owner.role}</span>
            {owner.name}
          </p>
        </div>
      </div>
      </div>
    </section>
  )
}

function Menu({ store, wide }: TemplateProps) {
  const items = menuItems(store)
  if (items.length === 0) return null
  return (
    <section id="menu" className={cx(CREAM, pad(wide))}>
      <div className={WRAP}>
      <H2 text={menuTitle(store)} wide={wide} />
      <ul className={cx('mt-10 divide-y divide-[#1f2a37]/15 border-y-2', RULE)}>
        {items.map((m) => (
          <li key={m.name} className={cx('flex items-center justify-between gap-4', wide ? 'px-2 py-6' : 'py-5')}>
            <div className="min-w-0">
              <h3 className="text-[17px] font-extrabold"><Phrases text={m.name} /></h3>
              {m.description && <p className={cx(MUTED, 'mt-1 text-xs')}>{m.description}</p>}
            </div>
            <p className={cx('shrink-0 font-extrabold tabular-nums', wide ? 'text-2xl' : 'text-xl')}>{m.price}</p>
          </li>
        ))}
      </ul>
      </div>
    </section>
  )
}

function Voices({ store, wide }: TemplateProps) {
  return (
    <section className={pad(wide)}>
      <div className={WRAP}>
      <H2 text="お客様の声" wide={wide} />
      <div className={cx('mt-12 grid', wide ? 'grid-cols-2 gap-12' : 'gap-10')}>
        {store.voices.map((v) => (
          <figure key={v.name} className={cx('border-t-2 pt-6', RULE)}>
            <span aria-hidden className={cx(MUTED, 'block text-[44px] font-extrabold leading-[0.6]')}>“</span>
            <blockquote className="mt-3 text-[15px] font-medium leading-[1.9]">{v.text}</blockquote>
            <figcaption className={cx(MUTED, 'mt-4 text-xs font-extrabold')}>{v.name}</figcaption>
          </figure>
        ))}
      </div>
      </div>
    </section>
  )
}

/** 紹介文の「吉祥寺駅から徒歩5分」から駅名と徒歩分数を拾う（入力項目は増やさない）。無ければ null */
const stationOf = (text: string) => {
  const m = text.match(/([^\s、。]+?駅)\S*?から徒歩(\d+)分/)
  return m ? { name: m[1], walk: `徒歩${m[2]}分` } : null
}

/**
 * 駅から店までの略図（線1本と2つの点）。住所の表が正なので、図は aria-hidden の補助にとどめる。
 * ponytail: 道順ではなく位置関係の目安。実際の地図が要るなら埋め込み地図に差し替える
 */
function RouteMap({ store }: { store: TemplateProps['store'] }) {
  const station = stationOf(store.description)
  return (
    <div aria-hidden className="mt-10 text-xs font-extrabold">
      <svg viewBox="0 0 240 120" className="w-full max-w-[280px]" fill="none" stroke="#1f2a37">
        <line x1="0" y1="96" x2="240" y2="96" strokeWidth="1" strokeOpacity="0.3" />
        <line x1="70" y1="0" x2="70" y2="120" strokeWidth="1" strokeOpacity="0.3" />
        <path d="M24 96 H70 V28 H206" strokeWidth="3" strokeDasharray="1 7" strokeLinecap="round" />
        <rect x="14" y="88" width="20" height="16" fill="#1f2a37" stroke="none" />
        <circle cx="206" cy="28" r="9" fill="#ff6b4a" strokeWidth="3" />
      </svg>
      <div className="mt-3 flex max-w-[280px] justify-between gap-4">
        <span>{station ? `${station.name}（${station.walk}）` : '最寄り駅'}</span>
        <span className="text-right">{storeName(store)}</span>
      </div>
    </div>
  )
}

function Access({ store, wide }: TemplateProps) {
  return (
    <section id="access" className={cx(CREAM, pad(wide))}>
      <div className={cx(WRAP, wide && 'grid grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] items-start gap-12')}>
      {/* アクセスは見出しと略図を左の列に置き、表を右に組む */}
      <div>
        <H2 text={`アクセス・${hoursWord(store)}時間`} wide={wide} />
        {wide && <RouteMap store={store} />}
      </div>
      <dl className={cx('border-y-2 text-sm', RULE, !wide && 'mt-10')}>
        {infoRows(store).map(([k, v]) => (
          <div key={k} className={cx(LINE, 'grid grid-cols-[6em_minmax(0,1fr)] gap-4 border-b py-4 last:border-b-0', wide && 'px-2')}>
            <dt className="font-extrabold">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      </div>
    </section>
  )
}

function Cta({ store, wide }: TemplateProps) {
  return (
    <section id="reserve" className={wide ? 'p-6' : 'p-3'}>
      <div className={cx('rounded-lg text-center', CORAL, wide ? 'px-14 py-20' : 'px-5 py-14')}>
        <h2 className={cx('font-extrabold leading-snug', wide ? 'text-[36px]' : 'text-[26px]')}>
          <Phrases text="まずはお気軽にご予約ください" />
        </h2>
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
      {sections.greeting && <Greeting {...props} />}
      {sections.menu && <Menu {...props} />}
      {sections.voices && <Voices {...props} />}
      {sections.access && <Access {...props} />}
      {sections.cta && <Cta {...props} />}
      <footer className={cx(MUTED, 'px-6 py-10 text-center text-xs font-bold')}>© {storeName(store)}</footer>
      {!props.wide && (
        <MobileBar
          store={store}
          tone={{ bar: 'border-[#1f2a37]/15 bg-white', tel: 'border-[#1f2a37] bg-white text-[#1f2a37]', web: cx(CORAL, 'text-[#1f2a37]') }}
        />
      )}
    </div>
  )
}
