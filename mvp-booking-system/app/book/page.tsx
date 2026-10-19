import type { Metadata } from 'next';
import BookingView from '@/components/views/BookingView';

export const metadata: Metadata = {
  title: 'ご予約 | Hair Salon Lien 表参道店',
};

export default function BookPage() {
  return <BookingView />;
}
