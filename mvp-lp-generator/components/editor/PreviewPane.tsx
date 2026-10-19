'use client'

import { useState } from 'react'
import { cx } from '@/lib/cx'
import { mockPublicUrl } from '@/lib/storage'
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

function TemplatePicker({ value, onChange }: { value: TemplateKey; onChange: (k: TemplateKey) => void }) {
  return (
    <div role="group" aria-label="テンプレート" className="flex gap-1.5 overflow-x-auto">
      {TEMPLATE_KEYS.map((k) => (
        <button
          key={k}
          type="button"
          aria-pressed={value === k}
          title={THEMES[k].note}
          onClick={() => onChange(k)}
          className={cx(
            'flex shrink-0 items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-xs font-medium transition',
            value === k ? 'border-accent bg-accent/15 text-white' : 'border-white/10 text-white/70 hover:border-white/30',
          )}
        >
          <span aria-hidden className="flex -space-x-1">
            {THEMES[k].swatch.map((c) => (
              <span key={c} className="h-4 w-4 rounded-full border border-black/40" style={{ backgroundColor: c }} />
            ))}
          </span>
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
    <div role="group" aria-label="表示サイズ" className="hidden rounded-full border border-white/10 p-0.5 sm:flex">
      {opts.map((o) => (
        <button
          key={o.key}
          type="button"
          aria-label={o.label}
          aria-pressed={value === o.key}
          onClick={() => onChange(o.key)}
          className={cx('rounded-full px-3 py-1.5 transition', value === o.key ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white')}
        >
          <Icon name={o.icon} />
        </button>
      ))}
    </div>
  )
}

export default function PreviewPane({ doc, generating, onTemplate }: Props) {
  const [device, setDevice] = useState<Device>('pc')
  const page = (
    <div key={`${doc.id}-${doc.template}`} className="min-h-full animate-fade-in">
      <LandingPage doc={doc} />
    </div>
  )

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 p-4 lg:p-6">
      <div className="flex items-center justify-between gap-3">
        <TemplatePicker value={doc.template} onChange={onTemplate} />
        <DeviceToggle value={device} onChange={setDevice} />
      </div>

      <div className="relative flex min-h-0 flex-1 justify-center">
        {device === 'pc' ? (
          <div className="flex h-[78vh] w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-ed-panel shadow-2xl lg:h-auto">
            <div className="flex items-center gap-3 border-b border-white/[0.08] px-4 py-2.5">
              <span aria-hidden className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </span>
              <span className="mx-auto truncate rounded-full bg-white/[0.06] px-4 py-1 text-[11px] text-ed-muted">{mockPublicUrl(doc.slug)}</span>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto bg-white">{page}</div>
          </div>
        ) : (
          <div className="h-[78vh] w-[390px] max-w-full overflow-hidden rounded-[2.75rem] border-[10px] border-[#1d1d1f] bg-black shadow-2xl [clip-path:inset(0_round_2.75rem)] lg:h-full lg:max-h-[800px]">
            <div className="h-full overflow-y-auto rounded-[2.1rem] bg-white [scrollbar-width:none]">{page}</div>
          </div>
        )}
        {generating && <GeneratingOverlay />}
      </div>
    </div>
  )
}
