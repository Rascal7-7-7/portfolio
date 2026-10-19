'use client';
import { useState } from 'react';
import { Pause, Play, SkipForward, X } from 'lucide-react';
import type { Subscription, SubscriptionStatus } from '@/lib/types';
import { INTERVAL_LABEL, findProduct } from '@/lib/catalog';
import { formatJa, formatJaLong } from '@/lib/date';
import { yen } from '@/lib/pricing';
import { ProductVisual } from '@/components/ProductVisual';
import { cn } from '@/lib/cn';

export type SubscriptionCommand = 'skip' | 'pause' | 'resume' | 'cancel';

const STATUS: Record<SubscriptionStatus, { label: string; className: string }> = {
  active: { label: '配送中', className: 'bg-primary/10 text-primary' },
  paused: { label: 'お休み中', className: 'bg-tertiary/10 text-tertiary' },
  canceled: { label: '解約済み', className: 'bg-surface-container text-on-surface-variant' },
};

type Props = {
  subscription: Subscription;
  onCommand: (command: SubscriptionCommand, productName: string) => void;
};

export function SubscriptionCard({ subscription: sub, onCommand }: Props) {
  const [confirming, setConfirming] = useState(false);
  const product = findProduct(sub.productId);
  if (!product) return null;

  const status = STATUS[sub.status];
  const canceled = sub.status === 'canceled';
  const run = (cmd: SubscriptionCommand) => {
    setConfirming(false);
    onCommand(cmd, product.name);
  };

  return (
    <article
      className={cn(
        'rounded-lg bg-surface-container-lowest p-4 shadow-elevation-1 ring-1 ring-outline-variant/40 sm:p-5',
        canceled && 'opacity-60',
      )}
      aria-label={`${product.name}の定期便`}
    >
      <div className="flex gap-4">
        <ProductVisual product={product} decorative className="h-24 w-20 flex-shrink-0 rounded-md" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-medium text-on-surface">{product.name}</h3>
            <span className={cn('rounded px-2 py-0.5 text-[11px] font-semibold', status.className)}>{status.label}</span>
          </div>
          <p className="tnum mt-1 text-xs text-on-surface-variant">
            {INTERVAL_LABEL[sub.interval]} · {sub.quantity}点 · 1回 {yen(sub.unitPrice * sub.quantity)}（税込・送料無料）
          </p>
          <p className="tnum mt-0.5 text-[11px] text-on-surface-variant">
            {sub.id} · {formatJaLong(sub.startedAt)}開始 · お届け済み {sub.deliveredCount}回
          </p>

          <div className="mt-3">
            {sub.status === 'active' && sub.nextDelivery && (
              <p className="text-sm">
                <span className="text-on-surface-variant">次回お届け </span>
                <span className="tnum font-headline text-lg font-semibold text-on-surface">{formatJa(sub.nextDelivery)}</span>
              </p>
            )}
            {sub.status === 'paused' && <p className="text-sm text-tertiary">お休み中です。再開すると3日後にお届けします。</p>}
            {canceled && <p className="text-sm text-on-surface-variant">この定期便は解約済みです。</p>}
          </div>
        </div>
      </div>

      {!canceled && (
        <div className="mt-4 border-t border-outline-variant/50 pt-4">
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
            <div className="flex flex-wrap gap-2">
              {sub.status === 'active' ? (
                <>
                  <ActionButton onClick={() => run('skip')} tone="primary">
                    <SkipForward className="h-4 w-4" aria-hidden />
                    次回をスキップ
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
              <ActionButton onClick={() => setConfirming(true)} className="sm:ml-auto">
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
};

function ActionButton({ onClick, children, tone = 'neutral', className }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        tone === 'primary' && 'bg-primary text-on-primary hover:opacity-90',
        tone === 'danger' && 'bg-error text-on-error hover:opacity-90',
        tone === 'neutral' && 'text-on-surface-variant ring-1 ring-outline-variant hover:bg-surface-container',
        className,
      )}
    >
      {children}
    </button>
  );
}
