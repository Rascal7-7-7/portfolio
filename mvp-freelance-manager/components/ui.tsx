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
    <Link href={href} className="hit rounded text-xs text-warm-500 hover:text-ink hover:underline">
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

/** 本文幅は全ページ共通。ページごとに幅を変えると移動のたびに左端が揺れる */
export function Page({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-8 sm:py-8">
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
        // 3項目はスマホで横に詰めると補足が切れるため、縦積みにする
        items.length === 3 ? "grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0" : "grid-cols-2 divide-x",
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
        "hit shrink-0 rounded-md px-2.5 py-1.5 text-xs transition-colors",
        active ? "bg-black/[0.07] font-semibold text-ink" : "text-warm-500 hover:bg-black/[0.04] hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

/** 押した瞬間だけわずかに沈める。動きを減らす設定では色の変化だけにする */
const PRESS = "transition-[background-color,transform] duration-100 motion-safe:active:scale-[0.98]";

export const buttonStyles = {
  primary: `inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md bg-blue px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-active active:bg-blue-active disabled:opacity-50 disabled:active:scale-100 sm:min-h-0 ${PRESS}`,
  secondary: `inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md border border-line bg-canvas px-3.5 py-2 text-sm font-medium text-ink hover:bg-warm-100 active:bg-warm-200 sm:min-h-0 ${PRESS}`,
  /** 一覧の行の中に置く小さなボタン（入金済にする 等）。スマホでは高さ 44px にする */
  rowAction: `min-h-11 w-24 shrink-0 rounded-md border border-line bg-canvas px-2 py-1.5 text-xs font-medium text-ink hover:bg-warm-100 active:bg-warm-200 sm:min-h-0 ${PRESS}`,
  rowActionQuiet: `min-h-11 w-24 shrink-0 rounded-md px-2 py-1.5 text-xs text-warm-500 hover:bg-black/[0.04] hover:text-ink active:bg-black/[0.07] sm:min-h-0 ${PRESS}`,
  input:
    "min-h-11 sm:min-h-0 w-full rounded-md border border-[#d9d7d4] bg-canvas px-3 py-2 text-sm text-ink placeholder:text-warm-300 focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue-tint",
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
