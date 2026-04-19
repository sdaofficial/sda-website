'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

/** Page ids, labels, and routes — single source for header nav + active state */
const HEADER_PAGES = {
  home: { label: 'Home', path: '/' },
  joinUs: { label: 'Get involved', path: '/join-us' },
  contact: { label: 'Contact Us', path: '/#contact' },
};

const HEADER_NAV_ORDER = ['home', 'joinUs', 'contact'];

function getActivePageId(pathname) {
  const current = pathname || '/';
  for (const id of HEADER_NAV_ORDER) {
    const { path } = HEADER_PAGES[id];
    if (path.includes('#')) continue;
    const routePath = path.split('#')[0];
    if (current === routePath) return id;
  }
  return null;
}

export function SiteHeader() {
  const pathname = usePathname();
  const activePageId = getActivePageId(pathname || '/');
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((o) => !o), []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    if (menuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = prev || '';
    return () => {
      document.body.style.overflow = prev || '';
    };
  }, [menuOpen]);

  const navLinkClass = (pageId, variant) => {
    const active = activePageId === pageId;
    if (variant === 'desktop') {
      return [
        'font-medium no-underline transition-colors max-lg:text-[15px]',
        active ? 'active text-primary-400 font-semibold' : 'text-gray-800 hover:text-primary-300',
      ].join(' ');
    }
    return [
      'py-2 font-medium no-underline transition-colors',
      active ? 'active font-semibold text-primary-500' : 'text-gray-800 hover:text-primary-500',
    ].join(' ');
  };

  return (
    <>
      <header className="header sticky top-0 z-50 bg-white px-20 py-4 shadow-[0_2px_10px_rgba(19,19,19,0.1)] max-lg:px-10 max-md:px-6">
        <div className="header-ctn mx-auto flex max-w-full items-center justify-between">
          <div className="logo">
            <Link
              href="/"
              className="inline-flex items-center gap-3 no-underline transition-[filter] hover:brightness-105"
            >
              <Image
                src="/sda-logo.png"
                alt="SDA Logo"
                width={200}
                height={56}
                priority
                className="h-14 w-auto max-lg:h-12"
              />
              <span className="logo-text text-[12px] font-semibold leading-4 text-primary-400 max-lg:text-[11px]">
                SUSTAINABLE <br />
                DEVELOPMENT ADVOCATE
              </span>
            </Link>
          </div>

          <button
            type="button"
            className={`menu-toggle flex cursor-pointer items-center justify-center border-0 bg-transparent p-2 transition-[filter] hover:brightness-110 md:hidden ${menuOpen ? 'active' : ''}`}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={toggleMenu}
          >
            {menuOpen ? (
              <Image src="/images/icons/close.svg" alt="" width={24} height={24} unoptimized className="close-icon h-6 w-6" />
            ) : (
              <Image src="/images/icons/menu.svg" alt="" width={24} height={24} unoptimized className="menu-icon h-6 w-6" />
            )}
          </button>

          <nav className="nav-links hidden items-center gap-8 md:flex max-lg:gap-6">
            {HEADER_NAV_ORDER.map((pageId) => {
              const { path, label } = HEADER_PAGES[pageId];
              if (pageId === 'contact') {
                return (
                  <Link
                    key={pageId}
                    href={path}
                    className="contact-btn rounded-md border border-primary-400 px-6 py-2.5 font-medium text-primary-400 no-underline transition-colors hover:bg-primary-400 hover:text-white max-lg:px-5 max-lg:py-2 max-lg:text-[15px]"
                  >
                    {label}
                  </Link>
                );
              }
              return (
                <Link key={pageId} href={path} className={navLinkClass(pageId, 'desktop')}>
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <div
        className={`mobile-menu-overlay fixed inset-0 z-[12] flex-col overflow-y-auto bg-white px-6 py-4 md:hidden ${menuOpen ? 'flex' : 'hidden'}`}
        role="presentation"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeMenu();
        }}
      >
        <div className="mobile-menu-header mb-8 flex items-center justify-between border-b border-primary-400 pb-4">
          <div className="logo flex-1">
            <Link
              href="/"
              onClick={closeMenu}
              className="inline-flex items-center gap-3 no-underline transition-[filter] hover:brightness-105"
            >
              <Image
                src="/sda-logo.png"
                alt="SDA Logo"
                width={200}
                height={56}
                priority
                className="h-14 w-auto"
              />
              <span className="logo-text text-[12px] font-semibold leading-4 text-primary-400">
                SUSTAINABLE <br />
                DEVELOPMENT ADVOCATE
              </span>
            </Link>
          </div>
          <button
            type="button"
            className="menu-toggle mobile-close flex cursor-pointer border-0 bg-transparent p-2 md:hidden"
            aria-label="Close menu"
            onClick={closeMenu}
          >
            <Image src="/images/icons/close.svg" alt="" width={24} height={24} unoptimized className="h-6 w-6" />
          </button>
        </div>
        <nav className="mobile-nav-links flex flex-col">
          {HEADER_NAV_ORDER.map((pageId) => {
            const { path, label } = HEADER_PAGES[pageId];
            if (pageId === 'contact') {
              return (
                <Link
                  key={pageId}
                  href={path}
                  className="contact-btn py-2 font-medium text-gray-800 no-underline transition-colors hover:text-primary-500"
                  onClick={closeMenu}
                >
                  {label}
                </Link>
              );
            }
            return (
              <Link key={pageId} href={path} className={navLinkClass(pageId, 'mobile')} onClick={closeMenu}>
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
