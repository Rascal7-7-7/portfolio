import type { Metadata } from 'next';

// page.tsx がクライアントコンポーネントのため、タイトルはここで付ける
export const metadata: Metadata = { title: 'ご注文完了' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
