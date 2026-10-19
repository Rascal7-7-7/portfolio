'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { findConflict } from '@/lib/slots';
import { useStore } from '@/lib/store';
import { STAFF, type ReservationInput } from '@/lib/types';
import LoadingState from '@/components/LoadingState';
import ReservationForm from '@/components/ReservationForm';
import { PageHeader, btn } from '@/components/ui';

const FORM_ID = 'new-reservation';

const STEPS = [
  { label: 'LINE・電話の内容を入力', desc: '受付経路も記録します' },
  { label: '日時とメニューを選ぶ',   desc: '所要時間・料金も表示' },
  { label: '登録する',               desc: '一覧と予定表にすぐ反映' },
  { label: '確認通知を送る',         desc: '詳細画面からワンクリック' },
];

export default function NewReservationView() {
  const { reservations, today, create, notify } = useStore();
  const router = useRouter();
  if (!reservations) return <LoadingState />;

  const defaults: ReservationInput = {
    customer_name: '', customer_email: '', customer_phone: '',
    reservation_date: today, reservation_time: '15:00',
    service_name: '', note: '', channel: 'line', staff: STAFF[0],
  };

  const handleSubmit = (input: ReservationInput) => {
    const id = create(input);
    notify(`${input.customer_name} 様の予約を登録しました。次は確認通知を送りましょう`);
    router.push(`/reservations/${id}`);
  };

  return (
    <div className="px-4 md:px-10 py-6 md:py-10 max-w-5xl">
      <PageHeader title="新規予約の登録" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div className="md:col-span-2">
          <ReservationForm id={FORM_ID} defaults={defaults} minDate={today}
            findConflict={input => findConflict(reservations, input)} onSubmit={handleSubmit} />
          <div className="flex gap-3 mt-5 md:hidden">
            <Link href="/reservations" className={`${btn('secondary', 'lg')} flex-1`}>キャンセル</Link>
            <button type="submit" form={FORM_ID} className={`${btn('primary', 'lg')} flex-1`}>予約を登録する</button>
          </div>
        </div>

        <aside className="hidden md:block">
          <div className="sticky top-10">
            <h2 className="text-sm font-medium text-ink mb-3">登録の流れ</h2>
            <ol className="space-y-3 text-sm">
              {STEPS.map(({ label, desc }, i) => (
                <li key={label} className="flex gap-3">
                  <span className="w-4 shrink-0 text-dim tabular-nums">{i + 1}.</span>
                  <div>
                    <p className="text-ink">{label}</p>
                    <p className="text-xs text-dim mt-0.5">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-6 pt-5 border-t border-line flex flex-col gap-2">
              <button type="submit" form={FORM_ID} className={`${btn('primary', 'lg')} w-full`}>予約を登録する</button>
              <Link href="/reservations" className={`${btn('secondary', 'lg')} w-full`}>キャンセル</Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
