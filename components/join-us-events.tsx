'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import eventsFile from '@/data/events.json';

type EventItem = (typeof eventsFile.events)[number];

function sortEvents(events: EventItem[], sortBy: string) {
  const sorted = [...events];
  switch (sortBy) {
    case 'recent':
      sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      break;
    case 'alphabetical':
      sorted.sort((a, b) => a.heading.localeCompare(b.heading));
      break;
    default:
      break;
  }
  return sorted;
}

const sectionShell =
  'my-[100px] px-20 py-10 max-lg:my-20 max-lg:px-[50px] max-lg:py-[30px] max-md:my-[60px] max-md:px-6 max-md:py-3';

const descLinkStyles =
  '[&_a]:font-semibold [&_a]:text-primary-400 [&_a]:no-underline [&_a]:transition-colors [&_a:hover]:text-primary-500 [&_a:hover]:underline';

const modalDescExtras =
  "[&_span.event-description-list-item]:flex [&_span.event-description-list-item]:items-start [&_span.event-description-list-item]:gap-2.5 [&_span.event-description-list-item]:pl-2.5 [&_span.event-description-list-item]:before:content-['•']";

export function JoinUsEvents() {
  const [events, setEvents] = useState<EventItem[]>(() => sortEvents(eventsFile.events, 'recent'));
  const [modalEvent, setModalEvent] = useState<EventItem | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'alphabetical'>('recent');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const closeModal = useCallback(() => {
    setModalEvent(null);
  }, []);

  const openModal = useCallback((event: EventItem) => {
    setModalEvent(event);
    requestAnimationFrame(() => {
      modalContentRef.current?.scrollTo({ top: 0 });
    });
  }, []);

  useEffect(() => {
    if (!modalEvent) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [modalEvent]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
        setDropdownOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeModal]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const onSortChange = (value: 'recent' | 'alphabetical') => {
    setSortBy(value);
    setEvents(sortEvents(eventsFile.events, value));
    setDropdownOpen(false);
  };

  return (
    <>
      <section className={sectionShell}>
        <div className="mb-12 flex flex-col items-center gap-6 max-md:mb-8 max-md:gap-[30px]">
          <div className="relative">
            <h2 className="text-center text-5xl font-bold leading-tight max-lg:text-4xl max-md:text-[32px]">Our Events</h2>
            <Image
              src="/images/icons/zap-2.svg"
              alt=""
              width={120}
              height={120}
              unoptimized
              className="absolute top-full right-[-15px] w-[120px] max-lg:right-[-8px] max-lg:w-[70px] max-md:left-1/2 max-md:right-auto max-md:w-20 max-md:-translate-x-1/2"
            />
          </div>
          <div className="flex items-center gap-3 self-end max-md:w-auto max-md:justify-center max-md:self-center">
            <label htmlFor="events-sort-select" className="text-base font-medium text-gray-600 max-md:text-sm">
              Sort by:
            </label>
            <div className="relative inline-block">
              <select
                id="events-sort-select"
                className="hidden"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as 'recent' | 'alphabetical')}
              >
                <option value="recent">Recent</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
              <div ref={dropdownRef} className="relative inline-block min-w-[165px] max-md:min-w-[130px]">
                <button
                  type="button"
                  className="flex w-full cursor-pointer items-center justify-between rounded border border-gray-600 bg-gray-50 px-[18px] py-2.5 text-left font-sans text-base font-medium text-gray-600 transition-colors hover:bg-primary-500-alpha focus:outline-none max-md:px-3 max-md:py-2 max-md:text-sm"
                  aria-haspopup="listbox"
                  aria-expanded={dropdownOpen}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen((o) => !o);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setDropdownOpen((o) => !o);
                    } else if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setDropdownOpen(true);
                      const first = dropdownRef.current?.querySelector<HTMLElement>('[data-dropdown-option]');
                      first?.focus();
                    }
                  }}
                >
                  <span className="flex-1">{sortBy === 'recent' ? 'Recent' : 'Alphabetical'}</span>
                  <Image
                    src="/images/icons/chevron-down.svg"
                    alt=""
                    width={20}
                    height={20}
                    unoptimized
                    className={`h-5 w-5 shrink-0 transition-transform max-md:h-[18px] max-md:w-[18px] ${dropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <ul
                  className={`absolute top-[calc(100%+4px)] right-0 left-0 z-10 max-h-[200px] list-none overflow-y-auto rounded border border-gray-800-alpha bg-white py-1 shadow-[0_4px_12px_rgba(19,19,19,0.1)] ${dropdownOpen ? 'block' : 'hidden'}`}
                  role="listbox"
                >
                  <li
                    data-dropdown-option
                    className={`cursor-pointer px-4 py-2.5 text-base transition-colors hover:text-primary-300 max-md:text-sm ${sortBy === 'recent' ? 'font-medium text-primary' : ''}`}
                    role="option"
                    aria-selected={sortBy === 'recent'}
                    tabIndex={0}
                    onClick={() => onSortChange('recent')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSortChange('recent');
                      } else if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        (e.currentTarget.nextElementSibling as HTMLElement | null)?.focus();
                      } else if (e.key === 'Escape') {
                        setDropdownOpen(false);
                        dropdownRef.current?.querySelector('button')?.focus();
                      }
                    }}
                  >
                    Recent
                  </li>
                  <li
                    data-dropdown-option
                    className={`cursor-pointer px-4 py-2.5 text-base transition-colors hover:text-primary-300 max-md:text-sm ${sortBy === 'alphabetical' ? 'font-medium text-primary' : ''}`}
                    role="option"
                    aria-selected={sortBy === 'alphabetical'}
                    tabIndex={0}
                    onClick={() => onSortChange('alphabetical')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSortChange('alphabetical');
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        (e.currentTarget.previousElementSibling as HTMLElement | null)?.focus();
                      } else if (e.key === 'Escape') {
                        setDropdownOpen(false);
                        dropdownRef.current?.querySelector('button')?.focus();
                      }
                    }}
                  >
                    Alphabetical
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-x-8 gap-y-[72px] max-lg:grid-cols-2 max-lg:gap-8 max-md:grid-cols-1 max-md:gap-10">
          {events.map((event, index) => (
            <EventCard key={event.heading + event.date} event={event} index={index} onOpen={() => openModal(event)} />
          ))}
        </div>
      </section>

      <div
        className={`fixed inset-0 z-30 items-center justify-center p-6 ${modalEvent ? 'flex' : 'hidden'}`}
        id="eventModal"
        role="presentation"
      >
        <div className="absolute inset-0 bg-gray-800-alpha backdrop-blur-sm" onClick={closeModal} aria-hidden />
        <div
          className="relative max-h-[90vh] w-full max-w-[1200px] overflow-hidden rounded-[20px] bg-white max-md:max-h-[95vh] max-md:rounded-3xl"
          ref={modalContentRef}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute top-8 right-8 z-10 flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full border-[1.5px] border-primary bg-white transition-colors hover:bg-primary-500-alpha max-md:top-[18px] max-md:right-[18px] max-md:h-6 max-md:w-6"
            onClick={closeModal}
            aria-label="Close modal"
          >
            <Image
              src="/images/icons/close.svg"
              alt=""
              width={20}
              height={20}
              unoptimized
              className="h-5 w-5 max-md:h-4 max-md:w-4"
            />
          </button>
          {modalEvent && (
            <div className="flex max-h-[90vh] gap-8 overflow-hidden pt-[100px] pr-[60px] pb-[100px] pl-10 max-lg:max-h-[95vh] max-lg:flex-col max-lg:gap-7 max-lg:px-[50px] max-lg:py-20 max-md:max-h-[95vh] max-md:flex-col max-md:gap-4 max-md:px-6 max-md:py-[60px]">
              <div className="relative h-[400px] w-[400px] shrink-0 select-none overflow-hidden rounded-[10px] bg-gray-100 max-lg:h-[350px] max-lg:w-[350px] max-md:aspect-[5/3] max-md:h-auto max-md:min-h-[200px] max-md:w-full">
                <Image
                  src={modalEvent.image}
                  alt={modalEvent.heading}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                  className="object-cover object-center"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-hidden pt-10 max-md:gap-3 max-md:pt-0">
                <h2 className="shrink-0 text-[32px] font-bold leading-tight text-gray-800 max-lg:text-[28px] max-md:text-2xl">
                  {modalEvent.heading}
                </h2>
                <p
                  className={`max-h-[700px] flex-1 overflow-y-auto overflow-x-hidden text-lg font-medium leading-7 text-gray-600 [scrollbar-color:#c3c3c3_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 max-lg:max-h-[600px] max-lg:text-[17px] max-lg:leading-[26px] max-md:max-h-[400px] max-md:text-base max-md:leading-6 ${descLinkStyles} ${modalDescExtras}`}
                  dangerouslySetInnerHTML={{ __html: modalEvent.description }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function EventCard({ event, index, onOpen }: { event: EventItem; index: number; onOpen: () => void }) {
  const descRef = useRef<HTMLParagraphElement>(null);
  const [showReadMore, setShowReadMore] = useState(false);

  useEffect(() => {
    const el = descRef.current;
    if (!el) return;
    const id = requestAnimationFrame(() => {
      if (el.scrollHeight > el.clientHeight) setShowReadMore(true);
    });
    return () => cancelAnimationFrame(id);
  }, [event.description]);

  return (
    <div
      className="max-w-[400px] overflow-hidden transition-colors hover:bg-primary-300-alpha max-md:mx-auto"
      data-event-index={index}
      role="button"
      tabIndex={0}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('a')) return;
        onOpen();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
    >
      <div className="relative aspect-[11/10] w-full overflow-hidden bg-gray-100 max-lg:h-[220px] max-md:h-[250px]">
        <Image
          src={event.image}
          alt={event.heading}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center"
        />
      </div>
      <div className="flex-1 pt-6 max-md:pt-5">
        <h3 className="mb-2.5 line-clamp-1 text-xl font-bold max-lg:text-[22px] max-md:text-xl">{event.heading}</h3>
        <p
          ref={descRef}
          className={`line-clamp-2 text-base font-medium leading-[22px] text-gray-700 max-lg:text-[15px] max-md:text-sm max-md:leading-5 ${descLinkStyles}`}
          dangerouslySetInnerHTML={{ __html: event.description }}
        />
        <span
          className={`mt-1 w-fit cursor-pointer text-base font-medium text-primary-400 no-underline max-md:text-sm ${showReadMore ? 'block' : 'hidden'}`}
        >
          Read more
        </span>
      </div>
    </div>
  );
}
