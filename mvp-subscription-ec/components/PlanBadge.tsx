import { RefreshCw } from 'lucide-react';
import type { Interval } from '@/lib/types';
import { INTERVAL_LABEL } from '@/lib/catalog';

export function PlanBadge({ interval }: { interval: Interval }) {
  if (interval === 'once') {
    return <span className="rounded bg-surface-container px-1.5 py-0.5 text-[11px] text-on-surface-variant">単品</span>;
  }
  return (
    <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 text-[11px] font-medium text-primary">
      <RefreshCw className="h-3 w-3" aria-hidden />
      定期便・{INTERVAL_LABEL[interval]}
    </span>
  );
}
