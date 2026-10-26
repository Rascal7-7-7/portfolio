'use client'

import { useState } from 'react'
import { cx } from '@/lib/cx'
import { mockPublicUrl, slugFor } from '@/lib/storage'
import { TEMPLATE_KEYS, THEMES } from '@/lib/themes'
import type { LPDoc, TemplateKey } from '@/lib/types'
import Icon from '../Icon'
import LandingPage from '../lp/LandingPage'
import GeneratingOverlay from './GeneratingOverlay'

type Device = 'pc' | 'sp'

interface Props {
  doc: LPDoc
  generating: boolean
  onTemplate: (key: TemplateKey) => void
}

// タッチ操作の幅では高さを 44px 以上にする
const SEGMENT = 'flex min-h-11 shrink-0 items-center gap-2 rounded px-3 py-1.5 text-[13px] lg:min-h-0 font-medium transition-colors duration-150'
const segmentState = (on: boolean) => (on ? 'bg-ed-ink text-white' : 'text-ed-muted hover:text-ed-ink')

function TemplatePicker({ value, onChange }: { value: TemplateKey; onChange: (k: TemplateKey) => void }) {
  return (
    <div role="group" aria-label="テンプレート" className="flex gap-0.5 overflow-x-auto rounded-md border border-ed-line bg-ed-panel p-0.5">
      {TEMPLATE_KEYS.map((k) => (
        <button key={k} type="button" aria-pressed={value === k} title={THEMES[k].note} onClick={() => onChange(k)} className={cx(SEGMENT, segmentState(value === k))}>
          <span aria-hidden className="h-3 w-3 rounded-sm border border-black/20" style={{ backgroundColor: THEMES[k].swatch }} />
          {THEMES[k].label}
        </button>
      ))}
    </div>
  )
}

function DeviceToggle({ value, onChange }: { value: Device; onChange: (d: Device) => void }) {
  const opts = [
    { key: 'pc', icon: 'monitor', label: 'PC表示' },
    { key: 'sp', icon: 'phone', label: 'スマホ表示' },
  ] as const
  return (
    <div role="group" aria-label="表示サイズ" className="hidden gap-0.5 rounded-md border border-ed-line bg-ed-panel p-0.5 sm:flex">
      {opts.map((o) => (
        <button key={o.key} type="button" aria-label={o.label} aria-pressed={value === o.key} onClick={() => onChange(o.key)} className={cx(SEGMENT, segmentState(value === o.key))}>
          <Icon name={o.icon} />
        </button>
      ))}
    </div>
  )
}

export default function PreviewPane({ doc, generating, onTemplate }: Props) {
  const [device, setDevice] = useState<Device>('pc')
  // テンプレートを切り替えたときだけ、新しい LP を短くフェードで出す（入力中の再描画では動かさない）
  const page = (
    <div key={`${doc.id}-${doc.template}`} className="motion-safe:animate-fade-in">
      <LandingPage doc={doc} headline="h2" />
    </div>
  )

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 lg:p-6">
      <div className="flex items-center justify-between gap-3 px-4 pt-4 lg:p-0">
        <TemplatePicker value={doc.template} onChange={onTemplate} />
        <DeviceToggle value={device} onChange={setDevice} />
      </div>

      <div className="relative flex min-h-0 flex-1 justify-center">
        {device === 'pc' ? (
          // 1024px 未満は枠を外し、LP を画面幅でそのまま見せる。枠の上端には公開後の URL だけを出す
          <div className="flex w-full flex-col lg:overflow-hidden lg:rounded-lg lg:border lg:border-ed-line lg:bg-ed-panel lg:shadow-sm">
            <div className="hidden border-b border-ed-line px-4 py-2 lg:block">
              {/* アドレス欄だけを模す（窓の丸ボタンなどの飾りは描かない） */}
              <p className="mx-auto flex max-w-md items-center justify-center gap-1.5 truncate rounded bg-ed-bg px-3 py-1 text-xs text-ed-muted">
                <Icon name="lock" className="h-3 w-3 shrink-0" />
                <span className="truncate">{mockPublicUrl(slugFor(doc)).replace('https://', '')}</span>
              </p>
            </div>
            <div className="bg-white lg:min-h-0 lg:flex-1 lg:overflow-y-auto">{page}</div>
          </div>
        ) : (
          // 端末の枠は描かず、390px 幅のキャンバスだけを見せる（Wix / Squarespace のモバイル表示と同じ考え方）
          <div data-phone className="h-[78vh] w-[390px] max-w-full overflow-hidden rounded-lg border border-ed-line bg-white shadow-sm lg:h-full lg:max-h-[844px]">
            <div className="h-full overflow-y-auto">{page}</div>
          </div>
        )}
        {generating && <GeneratingOverlay />}
      </div>
    </div>
  )
}
