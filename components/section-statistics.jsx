'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useId, useState } from 'react';

function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}

function grantImageUrl(grant) {
  const wrap = grant?.imageAsset;
  if (!wrap) return null;
  return wrap.imageAsset?.url ?? wrap.url ?? null;
}

function grantImageAlt(grant) {
  const wrap = grant?.imageAsset;
  return wrap?.altText || wrap?.caption || grant?.name || '';
}

function statModalTitle(stat) {
  const h = stat?.heading?.trim();
  if (h) return h;
  const parts = [stat?.value, stat?.label].filter(Boolean);
  return parts.join(' ').trim() || 'Statistic';
}

function StatCta({ text, url }) {
  if (!text?.trim()) return null;
  return (
    <Link
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      className="text-base font-medium text-white underline decoration-white/60 underline-offset-4 transition-colors hover:text-primary-400"
    >
      {text}
    </Link>
  );
}

export function SectionStatistics({ stats }) {
  const [active, setActive] = useState(null);
  const titleId = useId();
  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    if (!active) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);

  useEffect(() => {
    if (!active) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active, close]);

  if (!stats?.length) return null;

  const grants = active?.grantsCollection?.items?.filter(Boolean) ?? [];

  return (
    <>
      <div className="flex flex-wrap gap-2 max-md:gap-4">
        {stats.map((stat, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActive(stat)}
            className='border-none flex flex-col items-center gap-1 rounded-xl px-8 py-8 text-center focus:outline-none bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors'
          >
            <span className="text-2xl font-bold leading-none max-md:text-2xl font-sans">{stat?.value}</span>
            <span className="text-sm font-sans">{stat?.label}</span>
          </button>
        ))}
      </div>

      {active ? (
        <div className="fixed inset-0 z-50" role="presentation">
          <button
            type="button"
            className="absolute inset-0 z-0 border-0 bg-[#0a0a0a] p-0"
            onClick={close}
            aria-label="Close dialog"
          />
          <div
            className="pointer-events-none absolute inset-0 z-10 flex min-h-0 flex-col items-stretch justify-center px-8 py-10 max-md:px-5 max-md:py-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <div className="pointer-events-auto relative mx-auto flex max-h-[calc(100dvh-5rem)] w-full max-w-3xl flex-col overflow-hidden rounded-none">
              <button
                type="button"
                onClick={close}
                className="fixed left-40 top-24 z-20 items-center justify-center rounded-full border-none bg-transparent cursor-pointer max-md:left-0 max-md:h-9"
                aria-label="Close"
              >
                <Image
                  src="/images/icons/close-gray.svg"
                  alt=""
                  width={20}
                  height={20}
                  unoptimized
                  className="h-5 w-5 hover:brightness-150 transition-all"
                />
              </button>

              <div className="mt-12 flex max-h-[calc(100dvh-8rem)] flex-col overflow-y-auto overscroll-contain pr-1 max-md:mt-10">
                <div className="flex min-h-min flex-col">
                  <h2 id={titleId} className="mb-6 pr-10 text-4xl font-bold leading-tight tracking-tight text-white max-md:text-[1.75rem]">
                    {statModalTitle(active)}
                  </h2>
                  {active.body ? (
                    <p className="mb-8 max-w-2xl text-lg font-light leading-7 text-gray-200 max-md:text-base max-md:leading-6">{active.body}</p>
                  ) : null}
                  {active.ctaText?.trim() ? (
                    <div className="mb-10">
                      <StatCta text={active.ctaText} url={active.ctaUrl} />
                    </div>
                  ) : null}

                  {grants.length > 0 ? (
                    <ul className="mt-4 flex list-none flex-col gap-12 p-0 max-md:gap-10">
                      {grants.map((grant, gi) => {
                        const src = grantImageUrl(grant);
                        const linkUrl = grant?.url?.url?.trim();
                        const linkLabel = grant?.url?.label?.trim();
                        return (
                          <li key={gi} className="flex gap-6 max-md:gap-4">
                            <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-white/10 max-md:h-[72px] max-md:w-[72px]">
                              {src ? (
                                <Image src={src} alt={grantImageAlt(grant)} fill className="object-cover object-center" sizes="88px" />
                              ) : (
                                <span className="flex h-full w-full items-center justify-center text-xs font-medium text-gray-500">—</span>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="mb-2 text-xl font-bold text-white max-md:text-lg">{grant?.name}</h3>
                              {grant?.body ? (
                                <p className="text-base font-light leading-7 text-gray-400 max-md:text-sm max-md:leading-6">{grant.body}</p>
                              ) : null}
                              {linkUrl ? (
                                <Link
                                  href={linkUrl}
                                  className="mt-3 inline-block text-sm font-medium text-white underline decoration-white/50 underline-offset-4 transition-colors hover:text-primary"
                                  rel="noopener noreferrer"
                                >
                                  {linkLabel || 'Learn more'}
                                </Link>
                              ) : null}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
