import Image from 'next/image';
import { imageAlt, isVectorImage } from '@/lib/media';

function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}

const descLinkStyles =
  '[&_a]:font-semibold [&_a]:text-primary-400 [&_a]:no-underline [&_a]:transition-colors [&_a:hover]:text-primary-500 [&_a:hover]:underline';

function ordinalDay(n) {
  const abs = Math.abs(n);
  const cent = abs % 100;
  if (cent >= 11 && cent <= 13) return `${n}th`;
  switch (abs % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

function formatEventDateTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  const day = ordinalDay(d.getDate());
  const month = d.toLocaleDateString('en-GB', { month: 'long' });
  const year = d.getFullYear();
  const time = d
    .toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true })
    .replace(/\s/g, '')
    .toLowerCase();
  return `${day} ${month}, ${year} | ${time}`;
}

function eventImageAlt(event) {
  return imageAlt(event?.image, event?.title?.trim() || 'Event');
}

function EventDescription({ text }) {
  if (!text?.trim()) return null;
  if (text.includes('<')) {
    return (
      <div
        className={cn(
          'mt-3 text-base font-normal leading-relaxed text-gray-600 max-md:text-sm max-md:leading-6',
          descLinkStyles
        )}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    );
  }
  return (
    <p className="mt-3 whitespace-pre-line text-base font-normal leading-relaxed text-gray-600 max-md:text-sm max-md:leading-6">
      {text.trim()}
    </p>
  );
}

function UpcomingEventCard({ event, reversed }) {
  const src = event?.image?.url ?? null;
  const title = event?.title?.trim() ?? 'Event';
  const dateLine = formatEventDateTime(event?.dateTime);

  return (
    <article
      className={cn(
        'flex flex-col gap-6 rounded-[2rem] bg-gray-50 p-6 md:flex-row md:items-stretch md:gap-10 md:p-10',
        reversed ? 'flex-col-reverse md:flex-row-reverse' : 'flex-col md:flex-row'
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col justify-center md:w-1/2">
        <h3 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 max-md:text-xl">{title}</h3>
        {dateLine ? (
          <p className="mt-2 text-base font-semibold text-gray-700 max-md:text-[15px]">{dateLine}</p>
        ) : null}
        <EventDescription text={event?.description} />
      </div>
      <div className="relative aspect-[3/2] w-full shrink-0 overflow-hidden rounded-2xl bg-gray-200 md:aspect-auto md:min-h-[220px] md:w-1/2">
        {src ? (
          <Image
            src={src}
            alt={eventImageAlt(event)}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 480px"
            unoptimized={isVectorImage(event?.image)}
          />
        ) : (
          <div className="flex h-full min-h-[180px] items-center justify-center text-sm font-medium text-gray-500 md:min-h-[220px]">
            Image coming soon
          </div>
        )}
      </div>
    </article>
  );
}

export function UpcomingEventsSection({ section }) {
  const events = (section?.events ?? []).filter((e) => e?.title?.trim() || e?.description?.trim());
  if (events.length === 0) return null;

  return (
    <section
      id="events"
      className="section upcoming-events-section border-b border-gray-200 bg-white py-16 max-lg:py-14 max-md:py-12"
      aria-labelledby={section?.internalName ?? 'upcoming-events-heading'}
    >
      <div className="mx-auto w-full max-w-[920px]">
        <h2
          id={section?.internalName ?? 'upcoming-events-heading'}
          className="text-4xl font-bold tracking-tight text-gray-900 max-md:text-3xl mb-14 text-center max-md:mb-10"
        >
          {section?.heading?.trim() ?? 'Upcoming Events'}
        </h2>

        <ul className="m-0 flex list-none flex-col gap-12 p-0 max-md:gap-10">
          {events.map((event, index) => (
            <li key={`${event?.title ?? 'event'}-${index}`}>
              <UpcomingEventCard event={event} reversed={index % 2 === 1} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
