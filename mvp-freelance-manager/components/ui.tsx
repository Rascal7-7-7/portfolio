import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  title?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** 1px の罫線だけで区切るパネル。影やアイコンで飾らない（Linear / Stripe のリスト面と同じ扱い） */
export function Card({ title, action, className, children }: CardProps) {
  return (
    <section className={cn("min-w-0 rounded-lg border border-line bg-canvas", className)} aria-label={title}>
      {title && (
        <header className="flex min-h-11 items-center justify-between gap-2 border-b border-line px-4 py-2.5 sm:px-5">
          <h2 className="text-[13px] font-semibold text-ink">{title}</h2>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function MoreLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="rounded text-xs text-warm-500 hover:text-ink hover:underline">
      {children}
    </Link>
  );
}

interface PageHeaderProps {
  /** 日付など、見出しの上に添える補足。英字の飾り見出しには使わない */
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        {eyebrow && <p className="num mb-1 text-xs text-warm-500">{eyebrow}</p>}
        <h1 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-warm-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Page({ children, narrow }: { children: ReactNode; narrow?: boolean }) {
  return (
    <main className={cn("mx-auto w-full px-4 py-6 sm:px-8 sm:py-8", narrow ? "max-w-4xl" : "max-w-6xl")}>
      {children}
    </main>
  );
}

export interface Metric {
  label: string;
  value: string;
  sub?: ReactNode;
  href?: string;
}

/** 集計値の横並び。タイルを並べず、1枚のパネルを縦罫で区切る（Stripe の概要表示に倣う） */
export function MetricStrip({ items, className }: { items: readonly Metric[]; className?: string }) {
  return (
    <dl
      className={cn(
        "grid divide-line overflow-hidden rounded-lg border border-line bg-canvas",
        items.length === 3 ? "grid-cols-3 divide-x" : "grid-cols-2 divide-x",
        className,
      )}
    >
      {items.map((m) => {
        const body = (
          <>
            <dt className="truncate text-xs text-warm-500">{m.label}</dt>
            <dd className="num mt-1 truncate text-base font-semibold text-ink sm:text-xl">{m.value}</dd>
            {m.sub && (
              <dd className="num mt-0.5 truncate text-xs text-warm-500">
                {m.sub}
              </dd>
            )}
          </>
        );
        return m.href ? (
          <Link key={m.label} href={m.href} className="block min-w-0 px-3 py-3 hover:bg-warm-50 sm:px-5 sm:py-4">
            {body}
          </Link>
        ) : (
          <div key={m.label} className="min-w-0 px-3 py-3 sm:px-5 sm:py-4">
            {body}
          </div>
        );
      })}
    </dl>
  );
}

/** 絞り込みの切り替え。サイドバーの選択状態と同じ見た目にそろえる */
export function SegmentButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-md px-2.5 py-1.5 text-xs transition-colors",
        active ? "bg-black/[0.07] font-semibold text-ink" : "text-warm-500 hover:bg-black/[0.04] hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

export const buttonStyles = {
  primary:
    "inline-flex items-center justify-center gap-1.5 rounded-md bg-blue px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-active disabled:opacity-50",
  secondary:
    "inline-flex items-center justify-center gap-1.5 rounded-md border border-line bg-canvas px-3.5 py-2 text-sm font-medium text-ink transition-colors hover:bg-warm-100",
  input:
    "w-full rounded-md border border-[#d9d7d4] bg-canvas px-3 py-2 text-sm text-ink placeholder:text-warm-300 focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue-tint",
} as const;

export function PageSkeleton() {
  return (
    <Page>
      <div className="animate-pulse space-y-4" aria-busy="true" aria-label="読み込み中">
        <div className="h-8 w-48 rounded bg-warm-200" />
        <div className="h-20 rounded-lg bg-warm-100" />
        <div className="h-64 rounded-lg bg-warm-100" />
      </div>
    </Page>
  );
}
