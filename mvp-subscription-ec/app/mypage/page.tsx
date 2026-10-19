'use client';
import Link from 'next/link';
import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { useStore } from '@/components/StoreProvider';
import { DEMO_USER } from '@/lib/catalog';
import { formatJa, nextAfter, todayIso } from '@/lib/date';
import { monthlyEquivalent, yen } from '@/lib/pricing';
import type { Subscription } from '@/lib/types';
import { SubscriptionCard, type SubscriptionCommand } from './_components/SubscriptionCard';

export default function MyPage() {
  const { state, loaded, dispatch } = useStore();
  const [message, setMessage] = useState('');
  if (!loaded) return <main className="min-h-[60vh]" aria-busy="true" />;

  // 並べ替えない：操作したカードが動くと、デモ中に目で追えなくなる
  const subs = state.subscriptions;
  const active = subs.filter((s) => s.status === 'active');
  const nextDates = active.flatMap((s) => (s.nextDelivery ? [s.nextDelivery] : [])).sort();
  const monthlySpend = monthlyEquivalent(active);

  const run = (sub: Subscription, command: SubscriptionCommand, name: string) => {
    const today = todayIso();
    const after =
      command === 'skip' && sub.nextDelivery
        ? `次回のお届けを${formatJa(nextAfter(sub.nextDelivery, sub.interval))}に変更しました`
        : command === 'pause'
          ? `${name}の定期便をお休みにしました`
          : command === 'resume'
            ? `${name}の定期便を再開しました`
            : `${name}の定期便を解約しました`;
    dispatch(command === 'resume' ? { type: 'resume', id: sub.id, today } : { type: command, id: sub.id });
    setMessage(after);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div>
        <p className="text-xs text-on-surface-variant">マイページ（デモユーザー）</p>
        <h1 className="mt-1 font-headline text-2xl font-light text-on-background sm:text-3xl">{DEMO_USER.name} 様</h1>
      </div>

      <dl className="mt-6 grid grid-cols-3 divide-x divide-outline-variant/60 border-y border-outline-variant/60 py-4">
        <Stat label="契約中の定期便" value={`${active.length}件`} />
        <Stat label="次回お届け" value={nextDates[0] ? formatJa(nextDates[0]) : '—'} />
        <Stat label="月あたりの目安" value={yen(monthlySpend)} />
      </dl>

      <p role="status" aria-live="polite" className="mt-4 min-h-[1.25rem] text-sm font-medium text-primary">
        {message}
      </p>

      <div className="mb-3 mt-2 flex flex-wrap items-baseline justify-between gap-x-4">
        <h2 className="text-sm font-semibold text-on-surface">定期便の管理</h2>
        <p className="text-xs text-on-surface-variant">金額は税込・送料無料</p>
      </div>
      {subs.length === 0 ? (
        <p className="border-y border-outline-variant/60 py-6 text-center text-sm text-on-surface-variant">
          定期便はまだありません。
          <Link href="/products" className="ml-1 text-primary hover:underline">
            商品を見る
          </Link>
        </p>
      ) : (
        <ul className="divide-y divide-outline-variant/60 border-y border-outline-variant/60">
          {subs.map((sub) => (
            <li key={sub.id}>
              <SubscriptionCard subscription={sub} onCommand={(cmd, name) => run(sub, cmd, name)} />
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 text-right">
        <button
          type="button"
          onClick={() => {
            dispatch({ type: 'reset', today: todayIso() });
            setMessage('デモデータを初期状態に戻しました');
          }}
          className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-on-surface"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          デモデータをリセット
        </button>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3 text-center">
      <dt className="text-xs text-on-surface-variant">{label}</dt>
      <dd className="tnum mt-1 whitespace-nowrap font-headline text-sm font-semibold text-on-surface sm:text-lg">{value}</dd>
    </div>
  );
}
