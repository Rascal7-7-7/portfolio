import type { Metadata } from 'next';
import NewReservationView from '@/components/views/NewReservationView';

export const metadata: Metadata = {
  title: '新規予約の登録 | 予約管理システム',
};

export default function NewReservationPage() {
  return <NewReservationView />;
}
