import type { Interval } from '@/lib/types';
import { INTERVAL_LABEL } from '@/lib/catalog';

/** 購入方法を本文と同じ調子の小さな文字で示す（ピルにしない） */
export function PlanBadge({ interval }: { interval: Interval }) {
  return (
    <span className="text-xs text-on-surface-variant">
      {interval === 'once' ? '単品' : `定期便・${INTERVAL_LABEL[interval]}`}
    </span>
  );
}
