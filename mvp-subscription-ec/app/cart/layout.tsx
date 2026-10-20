import type { Metadata } from 'next';

// page.tsx がクライアントコンポーネントのため、タイトルはここで付ける
export const metadata: Metadata = { title: 'カート' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
