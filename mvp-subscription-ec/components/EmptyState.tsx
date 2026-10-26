import Link from 'next/link';

type Props = { title: string; body: string; href?: string; cta?: string };

/** カート・購入手続き・注文完了で中身がないときの共通表示（見出し＋一文＋主ボタン） */
export function EmptyState({ title, body, href = '/products', cta = '商品を見る' }: Props) {
  return (
    <main className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-headline text-2xl font-light text-on-surface">{title}</h1>
      <p className="mt-2 text-sm text-on-surface-variant">{body}</p>
      <Link href={href} className="btn-primary mt-8 inline-flex items-center px-6 py-3 text-sm">
        {cta}
      </Link>
    </main>
  );
}
