import type { ReactNode } from 'react'
import { CATEGORIES } from '@/lib/categories'
import type { CategoryKey } from '@/lib/types'
import { cx } from '@/lib/cx'
import MobileBar, { HERO_CTA } from './MobileBar'
import { catchCopy, ctaLabel, hoursWord, infoRows, menuItems, menuTitle, ownerOf, Phrases, storeName, type TemplateProps } from './shared'

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

/**
 * 紹介文を「お店の考え（最後の一文）」と「それ以外（駅からの距離など）」に分ける。入力項目は増やさない。
 * 紹介文は「駅から徒歩○分。」で始まり、想いで締めることが多いので、最後の一文を見出し側に出す。
 * ponytail: 「。」で区切るだけの判定。順序が逆の紹介文では案内文が上に出る（その場合も文章は欠けない）
 */
const splitDescription = (text: string) => {
  const sentences = text.trim().split(/(?<=。)/).filter((s) => s.trim())
  return { concept: (sentences[sentences.length - 1] ?? '').trim(), rest: sentences.slice(0, -1).join('').trim() }
}

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
            <a href="#menu" className="hover:underline hover:underline-offset-4">メニュー</a>
            <a href="#access" className="hover:underline hover:underline-offset-4">店舗情報</a>
          </>
        )}
        <a href="#reserve" className="border-b border-[#2e2620] pb-0.5">ご予約</a>
      </div>
    </nav>
  )
}

function Hero({ store, wide, roomy, headline: H }: TemplateProps) {
  const rows = [store.hours && `${hoursWord(store)} ${store.hours}`, store.closed && `定休 ${store.closed}`, store.address].filter(Boolean)
  const { concept, rest } = splitDescription(store.description)
  return (
    <section className={cx('grid', wide
          ? cx('min-h-[600px] px-16 pb-24 pt-16', roomy ? 'grid-cols-[minmax(0,26em)_minmax(0,1fr)] gap-16' : 'grid-cols-[minmax(0,22em)_minmax(0,1fr)] gap-12')
           : 'gap-12 px-6 pb-16 pt-10')}>
      {/* 左上にお店の考えを一文、下に案内。縦書きの見出しと上端・下端をそろえる（GLITCH COFFEE の組み方） */}
      <div className={cx('flex flex-col justify-between gap-12', wide ? 'max-w-[30em] pt-3' : 'order-2')}>
        {concept && (
          <p className={cx('font-mincho leading-[2.1] tracking-[0.1em]', wide ? 'max-w-[20em] text-[17px]' : 'text-base')}>
            <Phrases text={concept} />
          </p>
        )}
        <div>
          <p className={cx(ACCENT, 'text-xs tracking-[0.2em]')}>{CATEGORIES[store.category].label}</p>
          {rest && <p className={cx(MUTED, 'mt-6 text-[15px] leading-[2.1] tracking-[0.06em]')}>{rest}</p>}
          {rows.length > 0 && (
            <ul className={cx(LINE, 'mt-8 space-y-1 border-y py-4 text-[13px] leading-relaxed tracking-[0.06em]')}>
              {rows.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          )}
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a href="#reserve" className={BTN} {...HERO_CTA}>{ctaLabel(store)}</a>
            <a href="#menu" className="border-b border-[#2e2620]/40 pb-0.5 text-sm tracking-[0.12em] hover:border-[#2e2620]">メニューを見る</a>
          </div>
        </div>
      </div>
      {/* 縦書きのキャッチコピー。句読点で列を改め、長すぎる列は max-height で文節単位に折り返す。PC では右側の中央に線画と並べる（線画は幅に余裕があるときだけ） */}
      <div className={cx(wide ? cx('flex items-center justify-center', roomy && 'gap-20') : 'order-1 flex justify-center')}>
        {roomy && (
          <svg aria-hidden viewBox="0 0 120 160" className="w-[150px] shrink-0 self-end" fill="none" stroke="#8a5526" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            {LINE_ART[store.category]}
          </svg>
        )}
        <H
          className={cx(
            'font-mincho font-semibold leading-[1.7] tracking-[0.2em] [writing-mode:vertical-rl]',
            // エディタのプレビュー枠（wide だが roomy でない幅）では一段小さくし、初期表示で列の下が切れないようにする
            wide ? cx('max-h-[10em]', roomy ? 'text-[56px]' : 'text-[44px]') : 'max-h-[10em] text-[32px]',
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
