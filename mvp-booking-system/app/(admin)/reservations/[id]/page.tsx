import type { Metadata } from 'next';
import ReservationDetailView from '@/components/views/ReservationDetailView';

export const metadata: Metadata = {
  title: '予約詳細 | 予約管理システム',
};

export default async function ReservationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReservationDetailView id={Number(id)} />;
}
