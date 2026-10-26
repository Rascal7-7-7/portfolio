'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { useStore } from '@/components/StoreProvider';
import { DEMO_USER, INTERVAL_LABEL } from '@/lib/catalog';
import { formatJa, nextAfter, todayIso } from '@/lib/date';
import { monthlyEquivalent, yen } from '@/lib/pricing';
import type { Subscription, SubscriptionInterval } from '@/lib/types';
import { notBefore, withInterval } from '@/lib/store';
import { Phrases } from '@/components/Phrases';
import { SubscriptionCard, type SubscriptionCommand } from './_components/SubscriptionCard';

export default function MyPage() {
  const { state, loaded, dispatch } = useStore();
  // 文節の配列で持ち、Phrases で日付の途中では改行させない。
  // seq は同じ定期便を続けて操作しても、ハイライトとトーストをやり直すための通し番号
  const [notice, setNotice] = useState<Notice | null>(null);
  const setMessage = (parts: ReadonlyArray<string>, subId?: string) =>
    setNotice((prev) => ({ parts, subId, seq: (prev?.seq ?? 0) + 1 }));

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), TOAST_MS);
    return () => clearTimeout(t);
  }, [notice]);

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
        ? ['次回のお届けを', '変更しました：', `${formatJa(sub.nextDelivery)} → ${formatJa(nextAfter(sub.nextDelivery, sub.interval))}`]
        : command === 'unskip' && sub.nextDelivery && sub.skippedFrom
          ? ['スキップを', '取り消しました：', `${formatJa(sub.nextDelivery)} → ${formatJa(notBefore(sub.skippedFrom, today))}`]
        : command === 'pause'
          ? [`${name}の定期便を`, 'お休みにしました']
          : command === 'resume'
            ? [`${name}の定期便を`, '再開しました']
            : [`${name}の定期便を`, '解約しました'];
    dispatch(command === 'resume' || command === 'unskip' ? { type: command, id: sub.id, today } : { type: command, id: sub.id });
    setMessage(after, sub.id);
  };

  const changeInterval = (sub: Subscription, interval: SubscriptionInterval, name: string) => {
    const today = todayIso();
    const next = withInterval(sub, interval, today).nextDelivery;
    const dates = sub.nextDelivery && next && next !== sub.nextDelivery ? ['、次回', `${formatJa(sub.nextDelivery)} → ${formatJa(next)}`] : [];
    dispatch({ type: 'changeInterval', id: sub.id, interval, today });
    setMessage([`${name}の`, 'お届け間隔を', '変更しました：', `${INTERVAL_LABEL[sub.interval]} → ${INTERVAL_LABEL[interval]}`, ...dates, ...(sub.skippedFrom ? ['（スキップは解除されました）'] : [])], sub.id);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="max-w-3xl">
        <div>
          <p className="text-xs text-on-surface-variant">マイページ（デモユーザー）</p>
          <h1 className="mt-1 font-headline text-2xl font-light text-on-background sm:text-3xl">{DEMO_USER.name} 様</h1>
        </div>

        <dl className="mt-6 grid grid-cols-3 divide-x divide-outline-variant/60 border-y border-outline-variant/60 py-4">
          <Stat label="契約中の定期便" value={`${active.length}件`} />
          <Stat label="次回お届け" value={nextDates[0] ? formatJa(nextDates[0]) : '—'} />
          <Stat label="月あたりの目安" value={yen(monthlySpend)} />
        </dl>

        <div className="mb-3 mt-8 flex flex-wrap items-baseline justify-between gap-x-4">
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
                <SubscriptionCard
                  subscription={sub}
                  flashKey={notice?.subId === sub.id ? notice.seq : undefined}
                  onCommand={(cmd, name) => run(sub, cmd, name)}
                  onChangeInterval={(interval, name) => changeInterval(sub, interval, name)}
                />
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 text-right">
          <button
            type="button"
            onClick={() => {
              dispatch({ type: 'reset', today: todayIso() });
              setMessage(['デモデータを', '初期状態に', '戻しました']);
            }}
            className="inline-flex min-h-11 items-center gap-1.5 text-xs text-on-surface-variant hover:text-on-surface"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            デモデータをリセット
          </button>
        </div>
      </div>

      {/* 操作結果は画面下のトーストで返す（操作したカードの近くで目に入るように）。読み上げ用に枠は常に置く */}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        {notice && (
          <p
            key={notice.seq}
            className="max-w-md animate-fade-up rounded-md bg-inverse-surface px-4 py-3 text-sm text-inverse-on-surface shadow-lg"
          >
            <Phrases parts={notice.parts} />
          </p>
        )}
      </div>
    </main>
  );
}

const TOAST_MS = 4000;

type Notice = { parts: ReadonlyArray<string>; subId?: string; seq: number };

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3 text-center">
      <dt className="text-xs text-on-surface-variant">{label}</dt>
      <dd className="tnum mt-1 whitespace-nowrap font-headline text-sm font-semibold text-on-surface sm:text-lg">{value}</dd>
    </div>
  );
}
