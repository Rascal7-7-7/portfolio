'use client';
import Link from 'next/link';
import { useState } from 'react';
import { RotateCcw, UserRound } from 'lucide-react';
import { useStore } from '@/components/StoreProvider';
import { DEMO_USER } from '@/lib/catalog';
import { formatJa, nextAfter, todayIso } from '@/lib/date';
import { yen } from '@/lib/pricing';
import type { Subscription } from '@/lib/types';
import { SubscriptionCard, type SubscriptionCommand } from './_components/SubscriptionCard';

const STATUS_ORDER: Record<Subscription['status'], number> = { active: 0, paused: 1, canceled: 2 };

export default function MyPage() {
  const { state, loaded, dispatch } = useStore();
  const [message, setMessage] = useState('');
  if (!loaded) return <main className="min-h-[60vh]" aria-busy="true" />;

  const subs = [...state.subscriptions].sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
  const active = subs.filter((s) => s.status === 'active');
  const nextDates = active.flatMap((s) => (s.nextDelivery ? [s.nextDelivery] : [])).sort();
  const monthlySpend = active.reduce((sum, s) => sum + (s.interval === 'monthly' ? s.unitPrice * s.quantity : 0), 0);

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
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <UserRound className="h-6 w-6" aria-hidden />
        </span>
        <div>
          <p className="text-xs text-on-surface-variant">マイページ（デモユーザー）</p>
          <h1 className="font-headline text-2xl font-light text-on-background">{DEMO_USER.name} 様</h1>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-3 divide-x divide-outline-variant/50 rounded-lg bg-surface-container-lowest py-4 shadow-elevation-1 ring-1 ring-outline-variant/40">
        <Stat label="契約中の定期便" value={`${active.length}件`} />
        <Stat label="次回お届け" value={nextDates[0] ? formatJa(nextDates[0]) : '—'} />
        <Stat label="毎月便の合計" value={yen(monthlySpend)} />
      </dl>

      <p role="status" aria-live="polite" className="mt-4 min-h-[1.25rem] text-sm font-medium text-primary">
        {message}
      </p>

      <h2 className="mb-3 mt-2 text-sm font-semibold text-on-surface">定期便の管理</h2>
      {subs.length === 0 ? (
        <p className="rounded-lg bg-surface-container p-6 text-center text-sm text-on-surface-variant">
          定期便はまだありません。
          <Link href="/products" className="ml-1 text-primary hover:underline">
            商品を見る
          </Link>
        </p>
      ) : (
        <ul className="space-y-3">
          {subs.map((sub) => (
            <li key={sub.id}>
              <SubscriptionCard subscription={sub} onCommand={(cmd, name) => run(sub, cmd, name)} />
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10 border-t border-outline-variant/50 pt-4 text-right">
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
      <dt className="text-[11px] text-on-surface-variant">{label}</dt>
      <dd className="tnum mt-1 whitespace-nowrap font-headline text-sm font-semibold text-on-surface sm:text-lg">{value}</dd>
    </div>
  );
}
