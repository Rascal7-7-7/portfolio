'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import type { ReservationInput } from '@/lib/types';
import LoadingState from '@/components/LoadingState';
import ReservationForm from '@/components/ReservationForm';

const FORM_ID = 'new-reservation';

const STEPS = [
  { icon: 'chat',         label: 'LINE・電話の内容を入力', desc: '受付経路も記録します' },
  { icon: 'event',        label: '日時とメニューを選ぶ',   desc: '所要時間・料金も表示' },
  { icon: 'check_circle', label: '登録する',               desc: '一覧と予定表にすぐ反映' },
  { icon: 'send',         label: '確認通知を送る',         desc: '詳細画面からワンクリック' },
];

const submitStyle = { background: 'linear-gradient(135deg, #00288e, #1e40af)' };

export default function NewReservationView() {
  const { reservations, today, create, notify } = useStore();
  const router = useRouter();
  if (!reservations) return <LoadingState />;

  const defaults: ReservationInput = {
    customer_name: '', customer_email: '', customer_phone: '',
    reservation_date: today, reservation_time: '15:00',
    service_name: '', note: '', channel: 'line',
  };

  const handleSubmit = (input: ReservationInput) => {
    const id = create(input);
    notify(`${input.customer_name} 様の予約を登録しました。次は確認通知を送りましょう`);
    router.push(`/reservations/${id}`);
  };

  return (
    <div className="px-4 md:px-10 py-6 md:py-8 max-w-5xl">
      <div className="mb-8">
        <p className="text-[11px] font-bold text-[#00288e] tracking-widest mb-1">NEW RESERVATION</p>
        <h1 className="text-xl md:text-2xl font-black text-[#1a3844]">新規予約の登録</h1>
        <p className="text-sm text-[#444653] mt-2">
          LINEや電話で受けた予約を、その場で入力します。メモ帳や台帳への転記は不要です。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
        <div className="md:col-span-2">
          <ReservationForm id={FORM_ID} defaults={defaults} minDate={today} onSubmit={handleSubmit} />
          <div className="flex gap-3 mt-6 md:hidden">
            <Link href="/reservations" className="flex-1 py-3 text-center text-sm text-[#191c1d] bg-[#e1e3e4] rounded-lg font-bold">
              キャンセル
            </Link>
            <button type="submit" form={FORM_ID} style={submitStyle}
              className="flex-1 py-3 text-white text-sm font-black rounded-lg shadow-md">
              予約を登録する
            </button>
          </div>
        </div>

        <aside className="hidden md:block">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/10 sticky top-8">
            <h2 className="text-xs font-bold text-[#00288e] mb-5">登録の流れ</h2>
            <ol className="space-y-4">
              {STEPS.map(({ icon, label, desc }, i) => (
                <li key={label} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#dde1ff] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[#00288e]" style={{ fontSize: '16px' }} aria-hidden="true">{icon}</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#00288e] tracking-widest">STEP {i + 1}</p>
                    <p className="text-xs font-bold text-[#1a3844] mt-0.5">{label}</p>
                    <p className="text-[11px] text-[#444653] mt-0.5">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-6 pt-5 border-t border-[#f3f4f5]">
              <button type="submit" form={FORM_ID} style={submitStyle}
                className="w-full py-4 text-white font-black rounded-xl shadow-lg text-sm transition-all hover:opacity-90 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00288e]">
                予約を登録する
              </button>
              <Link href="/reservations"
                className="block w-full mt-3 py-2.5 text-center text-sm text-[#444653] hover:text-[#191c1d] rounded-lg hover:bg-[#f3f4f5] transition-colors font-medium">
                キャンセル
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
