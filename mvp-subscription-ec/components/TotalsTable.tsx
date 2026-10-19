import type { ReactNode } from 'react';
import type { Totals } from '@/lib/types';
import { taxLines, yen } from '@/lib/pricing';

export function TotalsTable({ totals }: { totals: Totals }) {
  const taxes = taxLines(totals.taxByRate);
  return (
    <dl className="tnum space-y-2 text-sm">
      <Row label="小計（通常価格）" value={yen(totals.listSubtotal)} />
      {totals.discount > 0 && <Row label="定期便割引" value={`−${yen(totals.discount)}`} />}
      <Row label="送料" value={totals.shipping === 0 ? '無料' : yen(totals.shipping)} />
      <div className="flex items-baseline justify-between border-t border-outline-variant/60 pt-3">
        <dt className="font-medium text-on-surface">合計（税込）</dt>
        <dd className="font-headline text-xl font-semibold text-on-surface">{yen(totals.total)}</dd>
      </div>
      {taxes.length === 1 && <TaxRow label={`うち消費税（${taxes[0].rate}%）`}>{yen(taxes[0].amount)}</TaxRow>}
      {taxes.length > 1 && (
        <TaxRow label="うち消費税">
          {taxes.map((t, i) => (
            <span key={t.rate} className="whitespace-nowrap">
              {i > 0 && ' / '}
              {t.rate}% {yen(t.amount)}
            </span>
          ))}
        </TaxRow>
      )}
    </dl>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-on-surface-variant">{label}</dt>
      <dd className="text-on-surface">{value}</dd>
    </div>
  );
}

function TaxRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex justify-between gap-4 text-xs text-on-surface-variant">
      <dt className="flex-shrink-0">{label}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  );
}
