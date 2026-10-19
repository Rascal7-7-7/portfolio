import type { Metadata } from 'next';
import ReservationsView from '@/components/views/ReservationsView';

export const metadata: Metadata = {
  title: '予約一覧 | 予約管理システム',
};

export default function ReservationsPage() {
  return <ReservationsView />;
}
