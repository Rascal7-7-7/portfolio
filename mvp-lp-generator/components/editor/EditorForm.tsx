import { CATEGORIES, CATEGORY_KEYS, SECTION_KEYS, SECTION_LABELS } from '@/lib/categories'
import { cx } from '@/lib/cx'
import { SAMPLES } from '@/lib/samples'
import type { CategoryKey, LPDoc, MenuItem, SectionKey, StoreInfo } from '@/lib/types'
import { Field, Group, TextArea, TextInput, inputCls } from './fields'

interface Props {
  doc: LPDoc
  onStore: (patch: Partial<StoreInfo>) => void
  onMenu: (index: number, patch: Partial<MenuItem>) => void
  onToggleSection: (key: SectionKey) => void
  onSample: (sample: LPDoc) => void
  onGenerate: () => void
}

function GenerateButton({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(className, 'w-full rounded-md bg-ed-ink py-3 text-sm font-semibold text-white transition-colors hover:bg-[#33333a]')}
    >
      LPを生成する
    </button>
  )
}

export default function EditorForm({ doc, onStore, onMenu, onToggleSection, onSample, onGenerate }: Props) {
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
            {SAMPLES.map((sample) => (
              <button
                key={sample.id}
                type="button"
                aria-pressed={doc.id === sample.id}
                onClick={() => onSample(sample)}
                className={cx(
                  'flex items-baseline justify-between gap-3 rounded-md border px-3 py-2 text-left text-sm transition-colors',
                  doc.id === sample.id ? 'border-accent bg-accent/[0.06]' : 'border-ed-line hover:border-[#c9c9c4]',
                )}
              >
                <span className="truncate font-medium">{sample.store.storeName}</span>
                <span className="shrink-0 text-xs text-ed-muted">{CATEGORIES[sample.store.category].label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <Group step="1" title="お店の基本情報（5項目）" open>
        <Field id="f-name" label="店舗名">
          <TextInput id="f-name" value={s.storeName} onChange={(e) => onStore({ storeName: e.target.value })} placeholder="例：木漏れ日珈琲" />
        </Field>
        <Field id="f-category" label="業種">
          <select id="f-category" value={s.category} onChange={(e) => onStore({ category: e.target.value as CategoryKey })} className={inputCls}>
            {CATEGORY_KEYS.map((k) => (
              <option key={k} value={k}>
                {CATEGORIES[k].label}
              </option>
            ))}
          </select>
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

      <Group step="2" title="営業情報・予約ボタン">
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

      <Group step="3" title="メニュー・料金">
        {s.menu.map((m, i) => (
          <div key={i} className="grid grid-cols-[1fr_96px] gap-2">
            <input aria-label={`メニュー${i + 1}の名前`} value={m.name} onChange={(e) => onMenu(i, { name: e.target.value })} className={inputCls} />
            <input aria-label={`メニュー${i + 1}の料金`} value={m.price} onChange={(e) => onMenu(i, { price: e.target.value })} className={inputCls} />
          </div>
        ))}
      </Group>

      <Group step="4" title="表示するセクション">
        <ul className="space-y-1">
          {SECTION_KEYS.map((k) => (
            <li key={k}>
              <label className="flex cursor-pointer items-center justify-between py-1.5 text-sm">
                {SECTION_LABELS[k]}
                <input type="checkbox" checked={doc.sections[k]} onChange={() => onToggleSection(k)} className="peer sr-only" />
                <span aria-hidden className="relative h-5 w-9 rounded-full bg-[#8f8f89] transition-colors peer-checked:bg-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-4" />
              </label>
            </li>
          ))}
        </ul>
      </Group>
    </div>
  )
}
