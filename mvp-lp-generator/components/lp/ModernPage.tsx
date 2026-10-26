import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'
import type { SectionKey } from '@/lib/types'
import MobileBar, { HERO_CTA } from './MobileBar'
import Photo, { usePhotoLoaded } from './Photo'
import { areaOf, catchCopy, ctaLabel, featuresHavePhoto, galleryOf, hoursWord, infoRows, menuItems, menuTitle, num, ownerOf, Phrases, reserveLink, storeName, visibleSections, type TemplateProps } from './shared'

/*
 * モダン: 表参道あたりの小さな美容室のエディトリアルなサイト（STUDIO「muku」の「02 — ABOUT」番号付き見出し）を手本にした構成。
 * 「大きな見出し・罫線・左に番号列」で誌面のリズムを作り、写真は角を落とさず大きく置く。
 * 地は白、面の切り替えは生成りのグレージュ1色、差し色は焦げ茶の文字1色だけ（暗い地は使わない）。
 */
const INK = 'text-[#1c1b19]'
const MUTED = 'text-[#1c1b19]/70' // 白・グレージュ地で約 6:1 以上
const ACCENT = 'text-[#80603f]' // 白地で約 5.6:1、グレージュ地で約 4.8:1
const LINE = 'border-[#1c1b19]/12'
const BAND = 'bg-[#f1ede7]'
const BTN =
  'inline-flex items-center justify-center bg-[#1c1b19] px-8 py-4 text-sm font-semibold tracking-[0.06em] text-white transition-colors hover:bg-[#3a3833]'

function Nav({ store, wide }: TemplateProps) {
  return (
    <nav className={cx(LINE, 'sticky top-0 z-10 flex items-center justify-between border-b bg-white/95 backdrop-blur', wide ? 'px-14 py-5' : 'px-6 py-4')}>
      <span className="truncate text-[15px] font-semibold tracking-[0.06em]">{storeName(store)}</span>
      <div className="flex shrink-0 items-center gap-7 text-[13px]">
        {wide && (
          <>
            <a href="#menu" className={cx(MUTED, 'hover:text-[#1c1b19]')}>メニュー</a>
            <a href="#access" className={cx(MUTED, 'hover:text-[#1c1b19]')}>アクセス</a>
          </>
        )}
        <a href="#reserve" className="-my-2 inline-flex min-h-11 items-center font-semibold underline decoration-1 underline-offset-[6px]">予約する</a>
      </div>
    </nav>
  )
}

function Hero({ store, wide, headline: H }: TemplateProps) {
  const rows = [store.hours && `${hoursWord(store)} ${store.hours}`, store.closed && `定休 ${store.closed}`, store.address].filter(Boolean)
  return (
    <section className={wide ? 'px-14 pb-20 pt-24' : 'px-6 pb-14 pt-14'}>
      {areaOf(store) && <p className={cx(ACCENT, 'mb-8 text-xs font-semibold tracking-[0.12em]')}>{areaOf(store)}</p>}
      <H
        className={cx(
          // palt で「、」「。」の後ろの空きを詰め、大きな和文見出しの字間をそろえる
          'font-bold tracking-[-0.01em] [font-feature-settings:"palt"]',
          wide ? 'text-[clamp(44px,7cqw,88px)] leading-[1.16]' : 'text-[34px] leading-[1.35]',
        )}
      >
        <Phrases text={catchCopy(store)} />
      </H>
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
            <a {...reserveLink(store)} className={BTN} {...HERO_CTA}>{ctaLabel(store)}</a>
            <a href="#menu" className="inline-flex min-h-11 items-center text-sm underline decoration-[#1c1b19]/40 decoration-1 underline-offset-[6px] transition-colors hover:decoration-[#1c1b19]">{menuTitle(store)}</a>
          </div>
        </div>
      </div>
      {/*
        写真は本文・予約ボタンの下に横長で置く（最初の画面で見出しと予約ボタンが見えるように）。
        角は落とさず、文字も重ねない（雑誌の見開きのように、文字の段と写真の段を分ける）
      */}
      <Photo src={store.photo} alt={`${storeName(store)}の写真`} className={cx('block w-full', wide ? 'mt-16 aspect-[21/9]' : 'mt-12 aspect-[4/3]')} />
    </section>
  )
}

/** 左に番号と見出し、右に本文の2列（スマホでは縦積み） */
function Block({ id, index, title, wide, band, children }: { id?: string; index: number; title: ReactNode; wide: boolean; band?: boolean; children: ReactNode }) {
  return (
    <section id={id} className={cx(band ? BAND : cx(LINE, 'border-t'), wide ? 'grid grid-cols-[240px_minmax(0,1fr)] gap-12 px-14 py-24' : 'px-6 py-16')}>
      <header className={wide ? '' : 'mb-10'}>
        <p className={cx(ACCENT, 'text-xs font-semibold tabular-nums tracking-[0.1em]')}>{num(index)}</p>
        <h2 className="mt-3 text-2xl font-bold [font-feature-settings:'palt']">{title}</h2>
      </header>
      <div>{children}</div>
    </section>
  )
}

/** 選ばれる理由。写真があれば左に横長の写真、右に見出しと本文の段を積む */
function Features({ store, wide }: TemplateProps) {
  const withPhoto = featuresHavePhoto(store)
  return (
    <ol className="divide-y divide-[#1c1b19]/12">
      {store.features.map((f) => (
        <li
          key={f.title}
          className={cx(
            'py-8 first:pt-0 last:pb-0',
            wide && (withPhoto ? 'grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] items-center gap-10' : 'grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-10'),
          )}
        >
          {withPhoto && <Photo src={f.photo} alt={f.title} className={cx('block w-full aspect-[3/2]', !wide && 'mb-6')} />}
          <div className={cx(!withPhoto && wide && 'contents')}>
            <h3 className="text-lg font-semibold"><Phrases text={f.title} /></h3>
            <p className={cx(MUTED, 'text-sm leading-[1.95]', (withPhoto || !wide) && 'mt-3')}>{f.text}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

/** 写真だけの帯。2枚を同じ高さで並べる（スマホは縦長2枚を横に） */
function Gallery({ store, wide }: TemplateProps) {
  const photos = galleryOf(store).slice(0, 2)
  if (photos.length === 0) return null
  return (
    <div className={cx('grid grid-cols-2', wide ? 'gap-6 px-14 pb-24' : 'gap-3 px-6 pb-16')}>
      {photos.map((src) => (
        <Photo key={src} src={src} alt="" className={cx('block w-full', wide ? 'aspect-[4/3]' : 'aspect-[3/4]')} />
      ))}
    </div>
  )
}

export default function ModernPage(props: TemplateProps) {
  const { store, sections, wide } = props
  const order = visibleSections(sections, store)
  const idx = (k: SectionKey) => order.indexOf(k)
  const items = menuItems(store)
  const owner = ownerOf(store)
  const ownerPhoto = usePhotoLoaded(owner?.photo)
  return (
    <div className={cx('min-h-full bg-white', INK)}>
      <Nav {...props} />
      <Hero {...props} />

      {sections.features && (
        <Block index={idx('features')} title="選ばれる理由" wide={wide}>
          <Features {...props} />
        </Block>
      )}

      {sections.greeting && owner && (
        <Block index={idx('greeting')} title={<Phrases text={`${owner.role}からのご挨拶`} />} wide={wide} band>
          <div className={cx(wide && 'grid grid-cols-[auto_minmax(0,1fr)] gap-10')}>
            {/* 写真があれば縦長の写真、無ければ役職と名前をそのまま組む（頭文字1字だけでは誰か分からないため） */}
            {ownerPhoto ? (
              <Photo src={owner.photo} alt={`${owner.role} ${owner.name}`} className={cx('block aspect-[3/4]', wide ? 'w-[180px]' : 'w-32')} />
            ) : (
              <p className={cx(wide && 'w-[180px]')}>
                <span className={cx(MUTED, 'block text-xs')}>{owner.role}</span>
                <span className={cx('mt-2 block font-mincho font-semibold leading-tight', wide ? 'text-[34px]' : 'text-[28px]')}>{owner.name}</span>
              </p>
            )}
            <div className={cx(!wide && 'mt-6')}>
              <p className={cx('font-mincho leading-[2]', wide ? 'text-[20px]' : 'text-[17px]')}>{owner.message}</p>
              {ownerPhoto && (
                <p className="mt-6 text-sm">
                  <span className={cx(MUTED, 'mr-3 text-xs')}>{owner.role}</span>
                  {owner.name}
                </p>
              )}
            </div>
          </div>
        </Block>
      )}

      {sections.menu && items.length > 0 && (
        <Block id="menu" index={idx('menu')} title={menuTitle(store)} wide={wide}>
          <ul className={cx(LINE, 'border-t')}>
            {items.map((m) => (
              <li key={m.name} className={cx(LINE, 'flex items-baseline justify-between gap-6 border-b', wide ? 'py-7' : 'py-5')}>
                <div className="min-w-0">
                  <h3 className={cx('font-semibold', wide ? 'text-xl' : 'text-[17px]')}><Phrases text={m.name} /></h3>
                  {m.description && <p className={cx(MUTED, 'mt-1.5 text-[13px]')}>{m.description}</p>}
                </div>
                <p className={cx('shrink-0 font-light tabular-nums tracking-[-0.01em]', wide ? 'text-[32px]' : 'text-2xl')}>{m.price}</p>
              </li>
            ))}
          </ul>
        </Block>
      )}
      {sections.menu && items.length > 0 && <Gallery {...props} />}

      {sections.voices && (
        <Block index={idx('voices')} title="お客様の声" wide={wide} band>
          <div className={cx('grid', wide ? 'grid-cols-2 gap-12' : 'gap-10')}>
            {store.voices.map((v) => (
              <figure key={v.name} className={cx(LINE, 'border-t pt-7')}>
                <blockquote className={cx('font-mincho leading-[1.95]', wide ? 'text-[19px]' : 'text-[17px]')}>{v.text}</blockquote>
                <figcaption className={cx(MUTED, 'mt-5 text-xs')}>{v.name}</figcaption>
              </figure>
            ))}
          </div>
        </Block>
      )}

      {sections.access && (
        <Block id="access" index={idx('access')} title="アクセス" wide={wide}>
          <dl className={cx(LINE, 'border-t text-sm')}>
            {infoRows(store).map(([k, v]) => (
              <div key={k} className={cx(LINE, 'grid grid-cols-[6.5em_minmax(0,1fr)] gap-4 border-b py-5')}>
                <dt className={MUTED}>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </Block>
      )}

      {sections.cta && (
        <section id="reserve" className={cx(BAND, wide ? 'flex items-end justify-between gap-12 px-14 py-28' : 'px-6 py-16')}>
          <h2 className={cx('font-bold [font-feature-settings:"palt"]', wide ? 'text-[clamp(30px,4.6cqw,52px)] leading-[1.25]' : 'text-[28px] leading-[1.4]')}>
            <Phrases text="まずはお気軽にご予約ください" />
          </h2>
          <div className={cx('shrink-0', wide ? 'text-right' : 'mt-8')}>
            <a {...reserveLink(store)} className={BTN}>{ctaLabel(store)}</a>
            {store.phone && <p className={cx(MUTED, 'mt-4 text-sm')}>Tel. {store.phone}</p>}
          </div>
        </section>
      )}

      <footer className={cx(MUTED, 'flex flex-wrap items-baseline justify-between gap-4 text-xs', wide ? 'px-14 py-10' : 'px-6 py-8')}>
        <span className="text-sm font-semibold text-[#1c1b19]">{storeName(store)}</span>
        <span>© {storeName(store)}</span>
      </footer>
      {!wide && (
        <MobileBar
          store={store}
          tone={{ bar: 'border-[#1c1b19]/12 bg-white', tel: 'border-[#1c1b19] text-[#1c1b19]', web: 'bg-[#1c1b19] text-white' }}
        />
      )}
    </div>
  )
}
