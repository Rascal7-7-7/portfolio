'use client';
import { useState } from 'react';
import { Pause, Play, SkipForward, X } from 'lucide-react';
import type { Subscription, SubscriptionStatus } from '@/lib/types';
import { INTERVAL_LABEL, findProduct } from '@/lib/catalog';
import { formatJa, formatJaLong } from '@/lib/date';
import { yen } from '@/lib/pricing';
import { ProductVisual } from '@/components/ProductVisual';
import { Phrases } from '@/components/Phrases';
import { cn } from '@/lib/cn';
import { canSkip } from '@/lib/store';

export type SubscriptionCommand = 'skip' | 'pause' | 'resume' | 'cancel';

const STATUS_LABEL: Record<SubscriptionStatus, string> = {
  active: '継続中',
  paused: 'お休み中',
  canceled: '解約済み',
};

type Props = {
  subscription: Subscription;
  onCommand: (command: SubscriptionCommand, productName: string) => void;
};

export function SubscriptionCard({ subscription: sub, onCommand }: Props) {
  const [confirming, setConfirming] = useState(false);
  const product = findProduct(sub.productId);
  if (!product) return null;

  const canceled = sub.status === 'canceled';
  const firstPending = sub.status === 'active' && !canSkip(sub);
  const run = (cmd: SubscriptionCommand) => {
    setConfirming(false);
    onCommand(cmd, product.name);
  };

  return (
    <article
      className={cn(
        'py-5',
        canceled && 'opacity-60',
      )}
      aria-label={`${product.name}の定期便`}
    >
      <div className="flex gap-4">
        <ProductVisual product={product} decorative className="h-24 w-20 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="min-w-0 font-medium text-on-surface">
              <Phrases parts={product.nameParts} />
            </h3>
            <span className="flex-shrink-0 text-xs text-on-surface-variant">{STATUS_LABEL[sub.status]}</span>
          </div>
          <p className="tnum mt-1 text-xs text-on-surface-variant">
            {INTERVAL_LABEL[sub.interval]} · {sub.quantity}点 · 1回 {yen(sub.unitPrice * sub.quantity)}（税込・送料無料）
          </p>
          <p className="tnum mt-0.5 text-xs text-on-surface-variant">
            {sub.id} · {formatJaLong(sub.startedAt)}開始 · お届け済み {sub.deliveredCount}回
          </p>

          <div className="mt-3">
            {sub.status === 'active' && sub.nextDelivery && (
              <p className="text-sm">
                <span className="text-on-surface-variant">{firstPending ? '初回お届け ' : '次回お届け '}</span>
                <span className="tnum font-headline text-lg font-semibold text-on-surface">{formatJa(sub.nextDelivery)}</span>
              </p>
            )}
            {sub.status === 'paused' && <p className="text-sm text-on-surface-variant">お休み中です。再開すると3日後にお届けします。</p>}
            {canceled && <p className="text-sm text-on-surface-variant">この定期便は解約済みです。</p>}
          </div>
        </div>
      </div>

      {!canceled && (
        <div className="mt-4">
          {confirming ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between" role="alertdialog" aria-label="解約の確認">
              <p className="text-sm text-on-surface">本当に解約しますか？ スキップやお休みもできます。</p>
              <div className="flex gap-2">
                <ActionButton onClick={() => setConfirming(false)}>やめる</ActionButton>
                <ActionButton onClick={() => run('cancel')} tone="danger">
                  解約を確定
                </ActionButton>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:flex">
              {sub.status === 'active' ? (
                <>
                  <ActionButton onClick={() => run('skip')} tone="primary" disabled={firstPending}>
                    <SkipForward className="h-4 w-4" aria-hidden />
                    {firstPending ? '初回発送準備中' : '次回をスキップ'}
                  </ActionButton>
                  <ActionButton onClick={() => run('pause')}>
                    <Pause className="h-4 w-4" aria-hidden />
                    お休みする
                  </ActionButton>
                </>
              ) : (
                <ActionButton onClick={() => run('resume')} tone="primary">
                  <Play className="h-4 w-4" aria-hidden />
                  再開する
                </ActionButton>
              )}
              <ActionButton onClick={() => setConfirming(true)} className="col-start-3 sm:ml-auto">
                <X className="h-4 w-4" aria-hidden />
                解約
              </ActionButton>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

type ActionButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  tone?: 'neutral' | 'primary' | 'danger';
  className?: string;
  disabled?: boolean;
};

function ActionButton({ onClick, children, tone = 'neutral', className, disabled = false }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        // スマホは3列グリッドに収めるため、アイコンを上に積む
        'inline-flex flex-col items-center justify-center gap-1 whitespace-nowrap rounded-sm px-1 py-2 text-xs font-medium transition-colors sm:flex-row sm:gap-1.5 sm:px-3 sm:text-sm',
        disabled && 'cursor-not-allowed bg-surface-container text-on-surface-variant',
        !disabled && tone === 'primary' && 'bg-primary text-on-primary hover:opacity-90',
        tone === 'danger' && 'bg-error text-on-error hover:opacity-90',
        tone === 'neutral' && 'text-on-surface ring-1 ring-outline-variant hover:ring-on-surface',
        className,
      )}
    >
      {children}
    </button>
  );
}
