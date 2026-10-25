'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [{ href: '/admin/general', label: 'General' }];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-[240px] shrink-0 flex-col border-r border-solid border-gray-200 bg-white">
      <Link href="/admin/general" className="flex items-center gap-3 px-5 py-5 no-underline">
        <Image src="/sda-logo.png" alt="" width={56} height={56} className="h-14 w-14 object-contain" />
        <span className="text-[11px] font-semibold leading-4 text-primary-400">
          SUSTAINABLE
          <br />
          DEVELOPMENT ADVOCATES
        </span>
      </Link>
      <nav className="flex flex-col gap-1 px-3">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname === '/admin';
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium no-underline ${
                active ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-50'
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
