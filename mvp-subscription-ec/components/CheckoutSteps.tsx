import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';

const STEPS = ['カート', 'ご購入手続き', '完了'] as const;

export function CheckoutSteps({ current }: { current: 0 | 1 | 2 }) {
  return (
    <ol className="mb-8 flex items-center justify-center gap-2 text-xs sm:gap-3" aria-label="購入までのステップ">
      {STEPS.map((step, i) => (
        <li key={step} className="flex items-center gap-2 sm:gap-3" aria-current={i === current ? 'step' : undefined}>
          <span
            className={cn(
              'tnum flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold',
              i < current && 'bg-primary/15 text-primary',
              i === current && 'bg-primary text-on-primary',
              i > current && 'bg-surface-container text-on-surface-variant',
            )}
          >
            {i < current ? <Check className="h-3.5 w-3.5" aria-hidden /> : i + 1}
          </span>
          <span className={cn(i === current ? 'font-semibold text-on-surface' : 'text-on-surface-variant')}>{step}</span>
          {i < STEPS.length - 1 && <span aria-hidden className="h-px w-6 bg-outline-variant sm:w-12" />}
        </li>
      ))}
    </ol>
  );
}
