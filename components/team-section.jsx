'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { isVectorImage } from '@/lib/media';

function groupsFromSection(section) {
  const groups = [];
  for (const member of section?.teamMembers ?? []) {
    if (!member?.name) continue;
    let group = groups.find((item) => item.key === member.groupKey);
    if (!group) {
      group = { key: member.groupKey, label: member.groupLabel, members: [] };
      groups.push(group);
    }
    group.members.push(member);
  }
  return groups;
}

export function TeamSection({ section }) {
  const groups = useMemo(() => groupsFromSection(section), [section]);
  const [currentTab, setCurrentTab] = useState(
    () => groups.find((group) => group.key === 'executives')?.key ?? groups[0]?.key ?? ''
  );
  const [indices, setIndices] = useState({});
  const [isNarrow, setIsNarrow] = useState(false);
  const containerRef = useRef(null);
  const activeGroup = groups.find((group) => group.key === currentTab) ?? groups[0];
  const members = activeGroup?.members ?? [];

  useLayoutEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const apply = () => setIsNarrow(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const applyTransform = useCallback(() => {
    const root = containerRef.current;
    if (!root || !activeGroup) return;
    const carousel = root.querySelector(`.team-carousel[data-tab="${activeGroup.key}"]`);
    if (!carousel) return;

    const cards = carousel.querySelectorAll('.team-member');
    const itemsPerView = isNarrow ? 2 : 4;
    const gap = isNarrow ? 16 : 24;

    if (cards.length === 0) return;

    if (cards.length <= itemsPerView) {
      carousel.classList.add('justify-center');
      carousel.style.transform = 'translateX(0)';
      return;
    }

    carousel.classList.remove('justify-center');
    const maxIndex = Math.max(0, cards.length - itemsPerView);
    const idx = Math.min(indices[activeGroup.key] ?? 0, maxIndex);
    const first = cards[0];
    const memberWidth = first.offsetWidth + gap;
    carousel.style.transform = `translateX(${-idx * memberWidth}px)`;
  }, [activeGroup, indices, isNarrow]);

  useLayoutEffect(() => {
    applyTransform();
  }, [applyTransform]);

  useLayoutEffect(() => {
    let t;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        if (!activeGroup) return;
        setIndices((prev) => ({ ...prev, [activeGroup.key]: 0 }));
        requestAnimationFrame(applyTransform);
      }, 250);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(t);
    };
  }, [activeGroup, applyTransform]);

  if (!section?.heading && !section?.body && groups.length === 0) return null;

  const itemsPerView = isNarrow ? 2 : 4;
  const maxIndex = Math.max(0, members.length - itemsPerView);
  const currentIdx = Math.min(indices[activeGroup?.key] ?? 0, maxIndex);
  const prevDisabled = currentIdx === 0 || members.length <= itemsPerView;
  const nextDisabled = currentIdx >= maxIndex || members.length <= itemsPerView;

  const goPrev = () => {
    if (!activeGroup || currentIdx <= 0) return;
    setIndices((prev) => ({ ...prev, [activeGroup.key]: currentIdx - 1 }));
  };

  const goNext = () => {
    if (!activeGroup || currentIdx >= maxIndex) return;
    setIndices((prev) => ({ ...prev, [activeGroup.key]: currentIdx + 1 }));
  };

  return (
    <section className="section team-section my-20 mb-[100px] mt-20 max-lg:my-[70px] max-lg:mb-20 max-md:my-10 max-md:mb-10">
      <div className="team-header mb-12 text-center max-md:mb-7">
        {section?.eyebrow ? (
          <p className="team-subheading mb-2 text-lg font-medium text-gray-600">{section.eyebrow}</p>
        ) : null}
        {section?.heading ? (
          <div className="team-heading-ctn relative inline-block">
            <h2 className="team-heading relative mb-2.5 inline-block text-5xl font-bold leading-tight max-lg:text-4xl max-md:mt-4 max-md:text-[32px]">
              {section.heading}
            </h2>
            <Image
              src="/images/icons/zap-2.svg"
              alt=""
              width={100}
              height={100}
              unoptimized
              className="zap-icon absolute top-[80%] -right-2.5 z-[5] w-[100px] max-md:left-1/2 max-md:right-auto max-md:top-[90%] max-md:w-[100px] max-md:-translate-x-1/2"
            />
          </div>
        ) : null}
        {section?.body ? (
          <p className="team-description mx-auto mt-0 max-w-[670px] text-lg font-medium leading-6 text-gray-600 max-md:mt-4 max-md:text-base max-md:leading-6">
            {section.body}
          </p>
        ) : null}
      </div>

      {groups.length > 0 ? (
        <div className="team-tabs mx-auto mb-12 flex w-fit overflow-hidden rounded-[32px] bg-gray-100 max-md:mb-7">
          {groups.map((group) => (
            <button
              key={group.key}
              type="button"
              className={[
                'team-tab cursor-pointer rounded-[32px] border-0 px-8 py-4 font-sans text-base font-medium transition-colors duration-300 ease-in-out max-lg:px-6 max-lg:py-3 max-lg:text-sm max-md:px-[18px] max-md:py-2.5 max-md:text-xs',
                activeGroup?.key === group.key
                  ? 'active bg-primary font-medium text-white'
                  : 'bg-transparent font-medium text-gray-500 hover:text-primary-400',
              ].join(' ')}
              data-tab={group.key}
              onClick={() => setCurrentTab(group.key)}
            >
              {group.label}
            </button>
          ))}
        </div>
      ) : null}

      {groups.length > 0 ? (
        <div className="team-carousel-wrapper relative flex items-center gap-4 max-md:gap-2">
          <button
            type="button"
            className="carousel-btn carousel-btn-prev flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-600 bg-white transition-all hover:bg-primary-500-alpha disabled:cursor-not-allowed disabled:opacity-50 max-md:h-8 max-md:w-8"
            aria-label="Previous"
            onClick={goPrev}
            disabled={prevDisabled}
          >
            <Image src="/images/icons/arrow.svg" alt="" width={16} height={16} unoptimized className="h-4 w-4 max-md:h-4 max-md:w-4" />
          </button>

          <div className="team-carousel-ctn relative flex-1 overflow-hidden" ref={containerRef}>
            {groups.map((group) => (
              <div
                key={group.key}
                className="team-carousel flex w-full gap-6 transition-transform duration-500 ease-in-out max-md:gap-4"
                data-tab={group.key}
                style={{ display: group.key === activeGroup?.key ? 'flex' : 'none' }}
              >
                {group.members.map((member) => (
                  <div
                    key={`${group.key}-${member.name}-${member.title}`}
                    className="team-member shrink-0 basis-[calc(25%-18px)] max-md:basis-[calc(50%-8px)]"
                  >
                    {member.image?.url ? (
                      <div className="team-member-image relative mb-2.5 aspect-[11/10] w-full overflow-hidden max-md:aspect-[11/10]">
                        <Image
                          src={member.image.url}
                          alt={member.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover object-center"
                          unoptimized={isVectorImage(member.image)}
                        />
                      </div>
                    ) : null}
                    <h3 className="team-member-name text-[21px] font-bold text-gray-900 max-lg:text-xl max-md:text-lg">
                      {member.name}
                    </h3>
                    {member.title ? (
                      <p className="team-member-title mb-1 line-clamp-1 text-base font-medium text-gray-600 max-lg:text-[15px] max-md:text-sm">
                        {member.title}
                      </p>
                    ) : null}
                    {member.profileUrl ? (
                      <Link
                        href={member.profileUrl}
                        className="team-member-linkedin inline-block transition-[filter] hover:opacity-80"
                        aria-label={member.name}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image src="/images/icons/linkedin.svg" alt="" width={24} height={24} unoptimized className="h-6 w-6" />
                      </Link>
                    ) : null}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <button
            type="button"
            className="carousel-btn carousel-btn-next flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-600 bg-white transition-all hover:bg-primary-500-alpha disabled:cursor-not-allowed disabled:opacity-50 max-md:h-8 max-md:w-8"
            aria-label="Next"
            onClick={goNext}
            disabled={nextDisabled}
          >
            <Image
              src="/images/icons/arrow.svg"
              alt=""
              width={16}
              height={16}
              unoptimized
              className="h-4 w-4 rotate-180 max-md:h-4 max-md:w-4"
            />
          </button>
        </div>
      ) : null}
    </section>
  );
}
