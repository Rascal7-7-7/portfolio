'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon, { type IconName } from '@/components/Icon';

export default function NavItem({
  href, icon, label, mobile = false,
}: {
  href: string; icon: IconName; label: string; mobile?: boolean;
}) {
  const pathname = usePathname();
  const isActive = href === '/reservations'
    ? pathname === '/reservations' || (pathname.startsWith('/reservations/') && !pathname.startsWith('/reservations/new'))
    : pathname.startsWith(href);

  if (mobile) {
    return (
      <Link
        href={href}
        aria-current={isActive ? 'page' : undefined}
        className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand ${
          isActive ? 'text-ink font-bold' : 'text-dim'
        }`}
      >
        <Icon name={icon} size={22} />
        <span className="text-[11px]">{label}</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm focus-visible:outline-2 focus-visible:outline-brand ${
        isActive ? 'bg-emphasis text-ink font-medium' : 'text-body hover:bg-subtle'
      }`}
    >
      <Icon name={icon} />
      <span>{label}</span>
    </Link>
  );
}
