'use client';

import { usePathname } from 'next/navigation';

import { MotionRoot } from '@/components/motion-root';
import { SiteHeader } from '@/components/site-header';

export function SiteFrame({ children, footer }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) {
    return <div className="min-h-screen bg-[#f4f5f7] text-gray-900">{children}</div>;
  }

  return (
    <>
      <SiteHeader />
      <MotionRoot>{children}</MotionRoot>
      {footer}
    </>
  );
}
