'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import teamData from '@/data/team-members.json';

const TABS = ['founding', 'executives', 'active'];

export function TeamSection() {
  const [currentTab, setCurrentTab] = useState('executives');
  const [indices, setIndices] = useState({
    founding: 0,
    executives: 0,
    active: 0,
  });
  const [isNarrow, setIsNarrow] = useState(false);
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const apply = () => setIsNarrow(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const applyTransform = useCallback(() => {
    const root = containerRef.current;
    if (!root) return;
    const carousel = root.querySelector(`.team-carousel[data-tab="${currentTab}"]`);
    if (!carousel) return;

    const members = carousel.querySelectorAll('.team-member');
    const itemsPerView = isNarrow ? 2 : 4;
    const gap = isNarrow ? 16 : 24;

    if (members.length === 0) return;

    if (members.length <= itemsPerView) {
      carousel.classList.add('justify-center');
      carousel.style.transform = 'translateX(0)';
      return;
    }

    carousel.classList.remove('justify-center');
    const maxIndex = Math.max(0, members.length - itemsPerView);
    const idx = Math.min(indices[currentTab], maxIndex);
    const first = members[0];
    const memberWidth = first.offsetWidth + gap;
    carousel.style.transform = `translateX(${-idx * memberWidth}px)`;
  }, [currentTab, indices, isNarrow]);

  useLayoutEffect(() => {
    applyTransform();
  }, [applyTransform]);

  useLayoutEffect(() => {
    let t;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        setIndices((prev) => ({ ...prev, [currentTab]: 0 }));
        requestAnimationFrame(applyTransform);
      }, 250);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(t);
    };
  }, [currentTab, applyTransform]);

  const members = teamData[currentTab];
  const itemsPerView = isNarrow ? 2 : 4;
  const maxIndex = Math.max(0, members.length - itemsPerView);
  const currentIdx = Math.min(indices[currentTab], maxIndex);
  const prevDisabled = currentIdx === 0 || members.length <= itemsPerView;
  const nextDisabled = currentIdx >= maxIndex || members.length <= itemsPerView;

  const goPrev = () => {
    if (currentIdx > 0) {
      setIndices((prev) => ({ ...prev, [currentTab]: prev[currentTab] - 1 }));
    }
  };

  const goNext = () => {
    if (currentIdx < maxIndex) {
      setIndices((prev) => ({ ...prev, [currentTab]: prev[currentTab] + 1 }));
    }
  };

  const selectTab = (tab) => {
    setCurrentTab(tab);
  };

  return (
    <section className="section team-section my-20 mb-[100px] mt-20 max-lg:my-[70px] max-lg:mb-20 max-md:my-10 max-md:mb-10">
      <div className="team-header mb-12 text-center max-md:mb-7">
        <p className="team-subheading mb-2 text-lg font-medium text-gray-600">Our team</p>
        <div className="team-heading-ctn relative inline-block">
          <h2 className="team-heading relative mb-2.5 inline-block text-5xl font-bold leading-tight max-lg:text-4xl max-md:mt-4 max-md:text-[32px]">
            Meet the Incredible SDA Team
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
        <p className="team-description mx-auto mt-0 max-w-[670px] text-lg font-medium leading-6 text-gray-600 max-md:mt-4 max-md:text-base max-md:leading-6">
          Our team is the driving force, the heartbeat, and the soul of our mission. Each member is a unique piece of the
          puzzle, contributing their talents, experiences, and passions to create a harmonious symphony of purpose.
        </p>
      </div>

      <div className="team-tabs mx-auto mb-12 flex w-fit overflow-hidden rounded-[32px] bg-gray-100 max-md:mb-7">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={[
              'team-tab cursor-pointer rounded-[32px] border-0 bg-transparent px-8 py-4 font-sans text-base font-medium text-gray-500 transition-all max-lg:px-6 max-lg:py-3 max-lg:text-sm max-md:px-[18px] max-md:py-2.5 max-md:text-xs',
              currentTab === tab
                ? 'active bg-primary font-medium text-white'
                : 'hover:text-primary-400',
            ].join(' ')}
            data-tab={tab}
            onClick={() => selectTab(tab)}
          >
            {tab === 'founding' && 'Founding members'}
            {tab === 'executives' && 'Executives'}
            {tab === 'active' && 'Active members'}
          </button>
        ))}
      </div>

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
          {TABS.map((tab) => (
            <div
              key={tab}
              className="team-carousel flex w-full gap-6 transition-transform duration-500 ease-in-out max-md:gap-4"
              data-tab={tab}
              style={{ display: tab === currentTab ? 'flex' : 'none' }}
            >
              {teamData[tab].map((member) => (
                <div
                  key={member.name + member.title}
                  className="team-member shrink-0 basis-[calc(25%-18px)] max-md:basis-[calc(50%-8px)]"
                >
                  <div className="team-member-image relative mb-2.5 aspect-[11/10] w-full overflow-hidden max-md:aspect-[11/10]">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover object-center"
                    />
                  </div>
                  <h3 className="team-member-name text-[21px] font-bold text-gray-900 max-lg:text-xl max-md:text-lg">
                    {member.name}
                  </h3>
                  <p className="team-member-title mb-1 line-clamp-1 text-base font-medium text-gray-600 max-lg:text-[15px] max-md:text-sm">
                    {member.title}
                  </p>
                  <Link
                    href={member.linkedin}
                    className="team-member-linkedin inline-block transition-[filter] hover:opacity-80"
                    aria-label="LinkedIn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image src="/images/icons/linkedin.svg" alt="" width={24} height={24} unoptimized className="h-6 w-6" />
                  </Link>
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
    </section>
  );
}
