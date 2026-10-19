import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'

export const inputCls =
  'w-full rounded-md border border-ed-line bg-white px-3 py-2.5 text-sm text-ed-ink placeholder:text-[#767671] outline-none transition-colors hover:border-[#c9c9c4] focus:border-accent focus:ring-2 focus:ring-accent/20'

export function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-baseline justify-between text-[13px] font-medium">
        {label}
        {hint && <span className="text-xs font-normal tabular-nums text-ed-muted">{hint}</span>}
      </label>
      {children}
    </div>
  )
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={inputCls} />
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputCls} resize-none leading-relaxed`} />
}

/** 入力のまとまり。カードで囲まず、区切り線だけで並べる（Squarespace / Wix の設定パネルと同じ組み方） */
export function Group({ step, title, open, children }: { step: string; title: string; open?: boolean; children: ReactNode }) {
  return (
    <details open={open} className="group border-t border-ed-line">
      <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 hover:bg-ed-bg/60 lg:px-6 [&::-webkit-details-marker]:hidden">
        <span className="w-4 text-sm tabular-nums text-ed-muted">{step}</span>
        <span className="flex-1 text-sm font-semibold">{title}</span>
        <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4 text-ed-muted transition-transform group-open:rotate-180">
          <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </summary>
      <div className="space-y-4 px-5 pb-6 lg:px-6">{children}</div>
    </details>
  )
}
