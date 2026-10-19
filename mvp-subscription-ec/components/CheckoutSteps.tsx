import { cn } from '@/lib/cn';

const STEPS = ['カート', 'ご購入手続き', '完了'] as const;

export function CheckoutSteps({ current }: { current: 0 | 1 | 2 }) {
  return (
    <ol className="mb-8 flex items-center gap-3 text-xs sm:gap-4" aria-label="購入までのステップ">
      {STEPS.map((step, i) => (
        <li key={step} className="flex items-center gap-3 sm:gap-4" aria-current={i === current ? 'step' : undefined}>
          <span className={cn('tnum', i === current ? 'font-semibold text-on-surface' : 'text-on-surface-variant')}>
            {i + 1}. {step}
          </span>
          {i < STEPS.length - 1 && <span aria-hidden className="h-px w-6 bg-outline-variant sm:w-10" />}
        </li>
      ))}
    </ol>
  );
}
