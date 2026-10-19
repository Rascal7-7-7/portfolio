import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'

export const inputCls =
  'w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30'

export function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-baseline justify-between text-xs font-medium text-white/80">
        {label}
        {hint && <span className="text-[11px] font-normal text-ed-muted">{hint}</span>}
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

export function Group({ step, title, open, children }: { step: string; title: string; open?: boolean; children: ReactNode }) {
  return (
    <details open={open} className="group rounded-2xl border border-white/[0.08] bg-ed-panel">
      <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[11px] font-bold">{step}</span>
        <span className="flex-1 text-sm font-semibold">{title}</span>
        <span aria-hidden className="text-ed-muted transition group-open:rotate-180">⌄</span>
      </summary>
      <div className="space-y-4 px-5 pb-5">{children}</div>
    </details>
  )
}
