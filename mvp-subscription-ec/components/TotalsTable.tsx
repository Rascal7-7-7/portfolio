import type { Totals } from '@/lib/types';
import { yen } from '@/lib/pricing';

export function TotalsTable({ totals }: { totals: Totals }) {
  return (
    <dl className="tnum space-y-2 text-sm">
      <Row label="小計（通常価格）" value={yen(totals.listSubtotal)} />
      {totals.discount > 0 && <Row label="定期便割引" value={`−${yen(totals.discount)}`} accent />}
      <Row label="送料" value={totals.shipping === 0 ? '無料' : yen(totals.shipping)} accent={totals.shipping === 0} />
      <div className="flex items-baseline justify-between border-t border-outline-variant/60 pt-3">
        <dt className="font-medium text-on-surface">合計（税込）</dt>
        <dd className="font-headline text-2xl font-semibold text-on-surface">{yen(totals.total)}</dd>
      </div>
      <div className="flex justify-between text-xs text-on-surface-variant">
        <dt>うち消費税</dt>
        <dd>
          消費税（8%）{yen(totals.taxByRate[8])} / 消費税（10%）{yen(totals.taxByRate[10])}
        </dd>
      </div>
    </dl>
  );
}

function Row({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-on-surface-variant">{label}</dt>
      <dd className={accent ? 'font-medium text-primary' : 'text-on-surface'}>{value}</dd>
    </div>
  );
}
