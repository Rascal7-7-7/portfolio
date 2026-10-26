import type { ReactNode } from 'react'
import type { CategoryKey } from '@/lib/types'
import { cx } from '@/lib/cx'
import MobileBar, { HERO_CTA } from './MobileBar'
import Photo, { usePhotoLoaded } from './Photo'
import { areaOf, catchCopy, ctaLabel, hoursWord, infoRows, menuItems, menuTitle, ownerOf, Phrases, reserveLink, storeName, type TemplateProps } from './shared'

/*
 * ナチュラル: 個人経営のカフェ・和の店のサイト（STUDIO「Cafe Flat」の細い額縁線、
 * 「鍼灸整体サロン SORA」の縦書きコピー）を手本にした、写真が無くても成立する紙もの風の構成（写真があればヒーローに縦長で置く）。
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

const LEAF = (
  <>
    <path d="M60 30 C18 56 18 112 60 132 C102 112 102 56 60 30 Z" />
    <path d="M60 46 V152" />
    <path d="M60 74 L44 62 M60 74 L76 62 M60 100 L40 86 M60 100 L80 86" />
  </>
)

/** 写真の代わりに置く業種ごとの線画（1本の細い線だけ。塗り・影は使わない） */
const LINE_ART: Record<CategoryKey, ReactNode> = {
  // ドリッパーとカップ
  cafe: (
    <>
      <path d="M28 36 H92 L72 78 H48 Z" />
      <path d="M22 36 H98" />
      <path d="M60 84 V92" />
      <path d="M34 98 H86 V118 Q86 138 66 138 H54 Q34 138 34 118 Z" />
      <path d="M86 104 Q100 104 100 114 Q100 124 86 124" />
      <path d="M22 150 H98" />
    </>
  ),
  // はさみ
  salon: (
    <>
      <circle cx="40" cy="128" r="14" />
      <circle cx="80" cy="128" r="14" />
      <path d="M47 116 L88 18" />
      <path d="M73 116 L32 18" />
      <circle cx="60" cy="85" r="2" />
    </>
  ),
  // 葉（整体・その他）
  seitai: LEAF,
  other: LEAF,
}

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
    <nav className={cx('sticky top-0 z-10 flex items-center justify-between bg-[#f7f3ec]', wide ? 'px-16 py-6' : 'px-6 py-4')}>
      <span className="truncate font-mincho text-lg font-semibold tracking-[0.14em]">{storeName(store)}</span>
      <div className="flex shrink-0 items-center gap-8 text-[13px] tracking-[0.12em]">
        {wide && (
          <>
            <a href="#menu" className="decoration-1 underline-offset-[6px] hover:underline">メニュー</a>
            <a href="#access" className="decoration-1 underline-offset-[6px] hover:underline">店舗情報</a>
          </>
        )}
        {/* 文字リンクも 44px のタップ領域を持たせる。下線は text-decoration にして文字の直下に残す */}
        <a href="#reserve" className="-my-2 inline-flex min-h-11 items-center underline decoration-1 underline-offset-[6px]">ご予約</a>
      </div>
    </nav>
  )
}

function Hero({ store, wide, roomy, headline: H }: TemplateProps) {
  const rows = [store.hours && `${hoursWord(store)} ${store.hours}`, store.closed && `定休 ${store.closed}`, store.address].filter(Boolean)
  const area = areaOf(store)
  const hasPhoto = usePhotoLoaded(store.photo)
  return (
    <section className={cx('grid', wide
          ? cx('min-h-[600px] px-16 pb-24 pt-16', roomy ? 'grid-cols-[minmax(0,26em)_minmax(0,1fr)] gap-16' : 'grid-cols-[minmax(0,22em)_minmax(0,1fr)] gap-12')
           : 'gap-12 px-6 pb-16 pt-10')}>
      {/* 上にエリア・ジャンルと紹介文（入力どおり 1 段落）、下に営業時間・住所と予約。縦書きの見出しと上端・下端をそろえる（GLITCH COFFEE の組み方） */}
      <div className={cx('flex flex-col justify-between gap-12', wide ? 'max-w-[30em] pt-3' : 'order-2')}>
        <div>
          {area && <p className={cx(ACCENT, 'mb-6 text-xs tracking-[0.2em]')}>{area}</p>}
          {store.description && (
            <p className={cx('font-mincho leading-[2.1] tracking-[0.08em]', wide ? 'text-[17px]' : 'text-base')}>{store.description}</p>
          )}
        </div>
        <div>
          {rows.length > 0 && (
            <ul className={cx(LINE, 'space-y-1 border-y py-4 text-[13px] leading-relaxed tracking-[0.06em]')}>
              {rows.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          )}
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a {...reserveLink(store)} className={BTN} {...HERO_CTA}>{ctaLabel(store)}</a>
            <a href="#menu" className="inline-flex min-h-11 items-center underline decoration-1 underline-offset-[6px] text-sm tracking-[0.12em] decoration-[#2e2620]/40 transition-colors hover:decoration-[#2e2620]">メニューを見る</a>
          </div>
        </div>
      </div>
      {/*
        縦書きのキャッチコピー。句読点で列を改め、長すぎる列は max-height で文節単位に折り返す。
        写真があれば、角を落とさない縦長の写真の右に見出しを並べる（文字を写真に重ねず、紙の余白に組む）。
        写真が無ければ、幅に余裕があるときだけ線画と並べる
      */}
      <div className={cx(wide ? cx('flex items-center justify-center', hasPhoto ? 'gap-10' : roomy && 'gap-20') : cx('order-1 flex justify-center', hasPhoto && 'items-start gap-5'))}>
        {hasPhoto ? (
          <Photo src={store.photo} alt={`${storeName(store)}の写真`} className={cx('aspect-[4/5] min-w-0 flex-1', wide && (roomy ? 'max-w-[400px]' : 'max-w-[320px]'))} />
        ) : (
          roomy && (
            <svg aria-hidden viewBox="0 0 120 160" className="w-[150px] shrink-0 self-end" fill="none" stroke="#8a5526" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              {LINE_ART[store.category]}
            </svg>
          )
        )}
        <H
          className={cx(
            'shrink-0 font-mincho font-semibold leading-[1.7] tracking-[0.2em] [writing-mode:vertical-rl]',
            // エディタのプレビュー枠（wide だが roomy でない幅）では一段小さくし、初期表示で列の下が切れないようにする
            wide ? cx('max-h-[10em]', roomy ? 'text-[56px]' : 'text-[44px]') : cx('max-h-[10em]', hasPhoto ? 'text-[28px]' : 'text-[32px]'),
          )}
        >
          {toLines(catchCopy(store)).map((line, i) => (
            <span key={i} className="block">
              <Phrases text={line} />
            </span>
          ))}
        </H>
      </div>
    </section>
  )
}

function Features({ store, wide }: TemplateProps) {
  return (
    <section className={cx('bg-[#efe8dc]', pad(wide))}>
      <H2 lead={`${storeName(store)}の`} text="こだわり" wide={wide} />
      <ol className={cx('mx-auto mt-14 grid max-w-5xl', wide ? 'grid-cols-3 divide-x' : 'divide-y', 'divide-[#2e2620]/15')}>
        {store.features.map((f, i) => (
          <li key={f.title} className={wide ? 'px-8 first:pl-0 last:pr-0' : 'py-8 first:pt-0 last:pb-0'}>
            <p aria-hidden className={cx(ACCENT, 'font-mincho text-2xl')}>{KANJI_NUM[i] ?? i + 1}</p>
            <h3 className="mt-4 font-mincho text-lg font-semibold tracking-[0.08em]"><Phrases text={f.title} /></h3>
            <p className={cx(MUTED, 'mt-3 text-sm leading-[2] tracking-[0.04em]')}>{f.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

/**
 * 店主のひと言。紙ものの「店主より」の添え書きのように、明朝の短い文と署名だけで組む（頭文字の飾りも置かない）
 */
function Greeting({ store, wide }: TemplateProps) {
  const owner = ownerOf(store)
  if (!owner) return null
  return (
    <section className={pad(wide)}>
      <div className="mx-auto max-w-2xl">
        <H2 text={`${owner.role}より`} wide={wide} />
        {/* 写真があるときだけ、縦長の写真を添える（無ければ今までどおり文と署名だけ） */}
        <Photo src={owner.photo} alt={`${owner.role} ${owner.name}`} className="mx-auto mt-12 block aspect-[3/4] w-40" />
        <p className={cx('mt-12 font-mincho leading-[2.2] tracking-[0.08em]', wide ? 'text-[17px]' : 'text-base')}>{owner.message}</p>
        <p className="mt-8 text-right font-mincho text-sm tracking-[0.14em]">
          <span className={cx(MUTED, 'mr-3 text-xs')}>{owner.role}</span>
          {owner.name}
        </p>
      </div>
    </section>
  )
}

function Menu({ store, wide }: TemplateProps) {
  const items = menuItems(store)
  if (items.length === 0) return null
  return (
    <section id="menu" className={pad(wide)}>
      <H2 text={menuTitle(store)} wide={wide} />
      <ul className="mx-auto mt-12 max-w-2xl">
        {items.map((m) => (
          <li key={m.name} className={cx(LINE, 'border-b py-6')}>
            <div className="flex items-baseline gap-4">
              <h3 className="font-mincho text-[17px] font-semibold tracking-[0.08em]"><Phrases text={m.name} /></h3>
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
      <a {...reserveLink(store)} className={cx(BTN, 'mt-10')}>{ctaLabel(store)}</a>
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
        {sections.greeting && <Greeting {...props} />}
        {sections.menu && <Menu {...props} />}
        {sections.voices && <Voices {...props} />}
        {sections.access && <Access {...props} />}
        {sections.cta && <Cta {...props} />}
        <footer className={cx(LINE, MUTED, 'border-t px-6 py-10 text-center text-xs tracking-[0.12em]')}>
          © {storeName(store)}
        </footer>
        {!wide && (
          <MobileBar
            store={store}
            tone={{ bar: 'border-[#2e2620]/15 bg-[#f7f3ec]', tel: 'border-[#2e2620] text-[#2e2620]', web: 'bg-[#2e2620] text-[#f7f3ec]' }}
          />
        )}
      </div>
    </div>
  )
}
