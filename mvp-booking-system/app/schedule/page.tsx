import type { Metadata } from 'next';
import ScheduleView from '@/components/views/ScheduleView';

export const metadata: Metadata = {
  title: 'スケジュール | 予約管理システム',
};

export default function SchedulePage() {
  return <ScheduleView />;
}
