import { RefreshCw } from 'lucide-react';
import type { OrderLine } from '@/lib/types';
import { INTERVAL_LABEL, findProduct } from '@/lib/catalog';
import { formatJa, nextAfter } from '@/lib/date';
import { yen } from '@/lib/pricing';

type Props = {
  lines: ReadonlyArray<OrderLine>;
  /** 初回お届け日（YYYY-MM-DD）。2回目はここから間隔ぶん先 */
  firstDelivery: string;
};

/** 申込確認・完了画面で「2回目以降に何がいつ・いくらで届くか」を見せる */
export function RecurringSummary({ lines, firstDelivery }: Props) {
  const subs = lines.flatMap((l) => {
    const product = findProduct(l.productId);
    return l.interval !== 'once' && product ? [{ ...l, interval: l.interval, product }] : [];
  });
  if (subs.length === 0) return null;

  return (
    <div className="rounded-md bg-primary/5 p-3 ring-1 ring-primary/15">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-primary">
        <RefreshCw className="h-3.5 w-3.5" aria-hidden />
        2回目以降のお届け（定期便）
      </p>
      <ul className="mt-2 space-y-2">
        {subs.map((s) => (
          <li key={`${s.productId}-${s.interval}`} className="tnum flex items-start justify-between gap-3 text-xs">
            <span className="min-w-0">
              <span className="block text-on-surface">
                {s.product.name} × {s.quantity}
              </span>
              <span className="block text-on-surface-variant">
                {INTERVAL_LABEL[s.interval]} · 2回目 {formatJa(nextAfter(firstDelivery, s.interval))}
              </span>
            </span>
            <span className="flex-shrink-0 font-semibold text-on-surface">
              {yen(s.unitPrice * s.quantity)}
              <span className="font-normal text-on-surface-variant"> / 回</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[11px] leading-relaxed text-on-surface-variant">
        毎回この金額（税込・送料無料）。スキップ・お休み・解約はマイページからいつでも。
      </p>
    </div>
  );
}
