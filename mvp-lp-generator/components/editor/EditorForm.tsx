import { CATEGORIES, CATEGORY_KEYS, SECTION_KEYS, SECTION_LABELS } from '@/lib/categories'
import { cx } from '@/lib/cx'
import { PHOTO_MAX_MB } from '@/lib/photo'
import { SAMPLES } from '@/lib/samples'
import { THEMES } from '@/lib/themes'
import type { CategoryKey, LPDoc, MenuItem, SectionKey, StoreInfo } from '@/lib/types'
import { Field, Group, Select, TextArea, TextInput, inputCls } from './fields'

interface Props {
  doc: LPDoc
  onStore: (patch: Partial<StoreInfo>) => void
  onMenu: (index: number, patch: Partial<MenuItem>) => void
  onToggleSection: (key: SectionKey) => void
  onSample: (sample: LPDoc) => void
  onGenerate: () => void
  /** 選んだ写真のファイル名（プレビューにだけ使い、保存しない） */
  photoName: string | null
  photoError: string
  onPhoto: (file: File) => void
  onClearPhoto: () => void
}

/** 写真の欄。選んだ画像はこのブラウザの中だけで読み、サーバーにも下書きにも入れない */
function PhotoField({ photoName, photoError, onPhoto, onClearPhoto }: Pick<Props, 'photoName' | 'photoError' | 'onPhoto' | 'onClearPhoto'>) {
  return (
    <div className="space-y-2">
      <p className="flex items-baseline justify-between text-[13px] font-medium">
        お店の写真（任意）
        <span className="text-xs font-normal text-ed-muted">JPEG・PNG・WebP／{PHOTO_MAX_MB}MBまで</span>
      </p>
      {/* ブラウザ標準の「ファイルを選択／選択されていません」は選択後の表示と食い違うので隠し、ボタン風のラベルから開く */}
      <input
        id="f-photo"
        type="file"
        accept="image/*"
        aria-label="お店の写真を選ぶ"
        aria-describedby="f-photo-note"
        aria-invalid={photoError ? true : undefined}
        onChange={(e) => {
          const file = e.target.files?.[0]
          // 同じファイルを選び直しても change が届くよう、値は毎回空に戻す
          e.target.value = ''
          if (file) onPhoto(file)
        }}
        className="peer sr-only"
      />
      <label
        htmlFor="f-photo"
        className="flex cursor-pointer items-center justify-center rounded-md border border-dashed border-[#c9c9c4] bg-white px-3 py-3 text-sm font-medium transition-colors hover:border-ed-ink peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2"
      >
        {photoName ? '別の写真に変える' : '写真を選ぶ'}
      </label>
      {photoError && (
        <p role="alert" className="text-xs font-medium text-[#b42318]">{photoError}</p>
      )}
      {photoName && (
        <p className="flex items-center justify-between gap-3 text-xs">
          <span className="truncate">選択中：{photoName}</span>
          <button type="button" onClick={onClearPhoto} className="inline-flex min-h-11 shrink-0 items-center underline underline-offset-2 hover:text-ed-ink lg:min-h-0">写真を外す</button>
        </p>
      )}
      <p id="f-photo-note" className="text-xs leading-relaxed text-ed-muted">
        写真は保存されません（デモ）。プレビューにだけ使い、サーバーにも送りません。再読み込みや公開ページでは、選んだ写真は表示されません。
      </p>
    </div>
  )
}

/** 内容（店舗情報・テンプレート・表示セクション）がサンプルから変わったか */
export const isEdited = (doc: LPDoc, sample: LPDoc) =>
  JSON.stringify([doc.store, doc.template, doc.sections]) !== JSON.stringify([sample.store, sample.template, sample.sections])

function GenerateButton({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(className, 'min-h-12 w-full rounded-md bg-ed-ink text-sm font-semibold text-white transition-[background-color,transform] duration-150 hover:bg-[#33333a] active:scale-[0.99]')}
    >
      LPを生成する
    </button>
  )
}

export default function EditorForm({ doc, onStore, onMenu, onToggleSection, onSample, onGenerate, ...photo }: Props) {
  const s = doc.store
  return (
    <div className="pb-6">
      <div className="space-y-5 px-5 py-6 lg:px-6">
        <div>
          <h1 className="text-lg font-semibold">お店の情報を入れるだけ。</h1>
          <p className="mt-1 text-sm leading-relaxed text-ed-muted">5項目でLPが完成します。入力はプレビューにその場で反映されます。</p>
        </div>

        {/* スマホでは入力欄が長いので、上部にも生成ボタンを置く */}
        <GenerateButton onClick={onGenerate} className="lg:hidden" />

        <div>
          <p className="mb-2 text-xs font-medium text-ed-muted">サンプルから始める</p>
          <div className="grid gap-1.5">
            {SAMPLES.map((sample) => {
              const current = doc.id === sample.id
              // 編集した後は選択中に見せない。押すとサンプルの内容に戻る
              const selected = current && !isEdited(doc, sample)
              return (
                <button
                  key={sample.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    // 1クリックで編集内容が消えないよう、元に戻す前に確かめる
                    if (current && !selected && !window.confirm('編集した内容を破棄して、サンプルの内容に戻しますか？')) return
                    onSample(sample)
                  }}
                  className={cx(
                    'flex min-h-14 items-center gap-3 rounded-lg border p-2 pr-3 text-left text-sm transition-[border-color,background-color,box-shadow] duration-150',
                    selected ? 'border-accent bg-accent/[0.05] ring-[3px] ring-accent/10' : 'border-ed-line hover:border-[#c9c9c4] hover:bg-ed-bg/60',
                  )}
                >
                  {/* サンプルのヒーロー写真を小さく見せ、どんな LP になるかを押す前に分かるようにする */}
                  {sample.store.photo && (
                    // eslint-disable-next-line @next/next/no-img-element -- 小さな静的サンプル画像
                    <img src={sample.store.photo} alt="" className="h-10 w-10 shrink-0 rounded object-cover" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{sample.store.storeName}</span>
                    <span className="block truncate text-xs text-ed-muted">
                      {current && !selected ? '編集中・押すと元に戻す' : `${CATEGORIES[sample.store.category].label}・${THEMES[sample.template].label}`}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <Group step="1" title="お店の基本情報（5項目）" open>
        <Field id="f-name" label="店舗名">
          <TextInput id="f-name" value={s.storeName} onChange={(e) => onStore({ storeName: e.target.value })} placeholder="例：木漏れ日珈琲" />
        </Field>
        <Field id="f-category" label="業種" hint="LPには出ず、見出しの言い回しに使います">
          <Select id="f-category" value={s.category} onChange={(e) => onStore({ category: e.target.value as CategoryKey })}>
            {CATEGORY_KEYS.map((k) => (
              <option key={k} value={k}>
                {CATEGORIES[k].label}
              </option>
            ))}
          </Select>
        </Field>
        <Field id="f-catch" label="キャッチコピー" hint={`${s.catchCopy.length} / 24字`}>
          <TextInput id="f-catch" maxLength={24} value={s.catchCopy} onChange={(e) => onStore({ catchCopy: e.target.value })} placeholder="例：朝の光と、一杯の深煎りを。" />
        </Field>
        <Field id="f-desc" label="紹介文">
          <TextArea id="f-desc" rows={4} maxLength={120} value={s.description} onChange={(e) => onStore({ description: e.target.value })} />
        </Field>
        <Field id="f-address" label="住所">
          <TextInput id="f-address" value={s.address} onChange={(e) => onStore({ address: e.target.value })} />
        </Field>
        <GenerateButton onClick={onGenerate} />
      </Group>

      <Group step="2" title="写真" open>
        <PhotoField {...photo} />
      </Group>

      <Group step="3" title="エリア・営業情報・予約ボタン">
        <Field id="f-area" label="エリア・ジャンル（任意）" hint="LPの見出しの上に出ます">
          <TextInput id="f-area" maxLength={20} value={s.area ?? ''} onChange={(e) => onStore({ area: e.target.value })} placeholder="例：鎌倉の自家焙煎珈琲" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field id="f-hours" label="営業時間">
            <TextInput id="f-hours" value={s.hours} onChange={(e) => onStore({ hours: e.target.value })} />
          </Field>
          <Field id="f-closed" label="定休日">
            <TextInput id="f-closed" value={s.closed} onChange={(e) => onStore({ closed: e.target.value })} />
          </Field>
        </div>
        <Field id="f-phone" label="電話番号">
          <TextInput id="f-phone" type="tel" value={s.phone} onChange={(e) => onStore({ phone: e.target.value })} />
        </Field>
        <Field id="f-cta" label="予約ボタンの文言">
          <TextInput id="f-cta" value={s.ctaLabel} onChange={(e) => onStore({ ctaLabel: e.target.value })} />
        </Field>
      </Group>

      <Group step="4" title="メニュー・料金">
        {s.menu.map((m, i) => (
          <div key={i} className="grid grid-cols-[1fr_96px] gap-2">
            <input aria-label={`メニュー${i + 1}の名前`} value={m.name} onChange={(e) => onMenu(i, { name: e.target.value })} className={inputCls} />
            <input aria-label={`メニュー${i + 1}の料金`} value={m.price} onChange={(e) => onMenu(i, { price: e.target.value })} className={inputCls} />
          </div>
        ))}
      </Group>

      <Group step="5" title="表示するセクション">
        <ul>
          {SECTION_KEYS.map((k) => (
            <li key={k}>
              <label className="flex min-h-11 cursor-pointer items-center justify-between text-sm lg:min-h-10">
                {SECTION_LABELS[k]}
                <input type="checkbox" checked={doc.sections[k]} onChange={() => onToggleSection(k)} className="peer sr-only" />
                <span aria-hidden className="relative h-5 w-9 rounded-full bg-[#8f8f89] transition-colors peer-checked:bg-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition-transform after:duration-200 peer-checked:after:translate-x-4 motion-reduce:after:transition-none" />
              </label>
            </li>
          ))}
        </ul>
      </Group>
    </div>
  )
}
