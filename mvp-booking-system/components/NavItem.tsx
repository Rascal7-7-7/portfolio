'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavItem({
  href, icon, label, mobile = false,
}: {
  href: string; icon: string; label: string; mobile?: boolean;
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
        className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#00288e] ${
          isActive ? 'text-[#00288e]' : 'text-[#757684]'
        }`}
      >
        <span
          className="material-symbols-outlined"
        aria-hidden="true"
          style={{
            fontSize: '22px',
            fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          {icon}
        </span>
        <span className="text-[11px] font-bold">{label}</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium focus-visible:outline-2 focus-visible:outline-[#00288e] ${
        isActive
          ? 'bg-white shadow-sm text-[#00288e] font-bold'
          : 'text-[#444653] hover:bg-white/60 hover:translate-x-0.5'
      }`}
    >
      <span
        className="material-symbols-outlined"
        aria-hidden="true"
        style={{
          fontSize: '20px',
          fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
        }}
      >
        {icon}
      </span>
      <span>{label}</span>
      {isActive && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00288e]" aria-hidden="true" />
      )}
    </Link>
  );
}
