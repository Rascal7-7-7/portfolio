import type { Staff } from '@/lib/types';

/** 画面間で共通の見た目。Cal.com の Button / ページ見出しに合わせている */

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand';

/** 担当ごとのごく淡い色分け。スケジュールの担当タブと列見出しで使う */
export const STAFF_TONE: Record<Staff, { dot: string }> = {
  山本: { dot: 'bg-staff1' },
  石井: { dot: 'bg-staff2' },
};

const VARIANT = {
  /** お客様の予約ページの主操作だけに使う（サロンのアクセント色） */
  accent:    'bg-accent text-white font-medium hover:bg-accent-hover',
  primary:   'bg-brand text-white font-medium hover:bg-brand-hover disabled:bg-subtle disabled:text-dim disabled:cursor-not-allowed',
  secondary: 'border border-line-strong bg-canvas text-ink font-medium hover:bg-muted',
  ghost:     'text-body hover:bg-muted',
} as const;

const SIZE = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-9 px-4 text-sm',
  lg: 'h-10 px-4 text-sm',
} as const;

/** ボタン（とボタン風リンク）のクラス。Tailwind のクラス衝突を避けるため寸法は size でだけ決める */
export function btn(variant: keyof typeof VARIANT, size: keyof typeof SIZE = 'md'): string {
  return `inline-flex items-center justify-center gap-1.5 rounded-md whitespace-nowrap ${SIZE[size]} ${VARIANT[variant]} ${FOCUS}`;
}

export function PageHeader({ title, description, action }: {
  title: string; description?: React.ReactNode; action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 md:mb-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-ink text-balance">{title}</h1>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {description && <p className="text-sm text-dim mt-1 text-pretty max-w-2xl">{description}</p>}
    </div>
  );
}

/** 3つの数字を1枚の枠に並べる。alert のときだけ attention 色にし、文字でも「要対応」と書く */
export function StatStrip({ items }: {
  /** value が文字列のとき（「本日の受付は終了」など）は数字ではないので小さめに出し、単位を付けない */
  items: { label: string; value: number | string; unit?: string; note?: string; alert?: boolean }[];
}) {
  return (
    <dl className="grid grid-cols-3 border border-line rounded-lg divide-x divide-line mb-8">
      {items.map(({ label, value, unit = '件', note, alert }) => (
        <div key={label} className="px-3 py-3 md:px-5 md:py-4 min-w-0">
          <dt className="text-xs text-dim">{label}</dt>
          {typeof value === 'string' ? (
            <dd className="mt-1 min-h-8 flex items-center text-sm font-bold text-ink text-pretty">{value}</dd>
          ) : (
            <dd className={`mt-1 text-2xl font-bold tabular-nums ${alert ? 'text-attn' : 'text-ink'}`}>
              {value}<span className="text-xs font-normal text-dim ml-0.5">{unit}</span>
            </dd>
          )}
          {note && <dd className={`hidden sm:block text-xs mt-1 ${alert ? 'text-attn font-medium' : 'text-dim'}`}>{note}</dd>}
        </div>
      ))}
    </dl>
  );
}
