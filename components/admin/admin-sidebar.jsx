'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/admin/general', label: 'General' },
  { href: '/admin/media', label: 'Media' },
  { href: '/admin/sections', label: 'Section images' },
  { href: '/admin/events', label: 'Events' },
  { href: '/admin/impact', label: 'Partnerships and impact' },
  { href: '/admin/speeches', label: 'Speeches' },
  { href: '/admin/team', label: 'Team' },
  { href: '/admin/testimonials', label: 'Testimonials' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex h-screen w-64 flex-col overflow-y-auto border-r border-solid border-gray-200 bg-white">
      <div className="px-6 py-5">
        <Image src="/sda-logo.png" alt="SDA" width={96} height={42} className="h-auto w-24" />
        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-gray-400">Admin</p>
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {NAV.map((item) => {
          const active = pathname === item.href || (pathname === '/admin' && item.href === '/admin/general');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm no-underline ${
                active ? 'bg-primary/10 font-semibold text-primary' : 'font-medium text-gray-700'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
