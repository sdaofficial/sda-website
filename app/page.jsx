import Image from 'next/image';
import Link from 'next/link';

import { CommunityBand } from '@/components/community-band';
import { ContactSection } from '@/components/contact-section';
import { ImageSlot } from '@/components/image-slot';
import { SectionStatistics } from '@/components/section-statistics';
import { SectionVideoEmbed } from '@/components/section-video-embed';
import { TestimonialsSection } from '@/components/testimonials-section';
import {
  getEvents,
  getImpactMetrics,
  getLinks,
  getPartnerships,
  getSectionImageMap,
  getSocialLinks,
  getTestimonials,
} from '@/lib/content';
import { imageAlt, isVectorImage } from '@/lib/media';

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

export default async function HomePage() {
  const [links, images, metrics, events, testimonials, partnerships, socials] = await Promise.all([
    getLinks(),
    getSectionImageMap(),
    getImpactMetrics(),
    getEvents(),
    getTestimonials(),
    getPartnerships(),
    getSocialLinks(),
  ]);
  const member = links.become_a_member;
  const journeyCover = (images.JOURNEY ?? []).find((img) => img?.url);
  const journeyUrl = typeof links.youtube_story?.url === 'string' ? links.youtube_story.url.trim() : '';
  const journey = links.JOURNEY_0;
  const join = links.JOIN_US_0;
  const upcoming = (events ?? []).filter((event) => event?.title?.trim() || event?.description?.trim());
  const partnerLogos = (partnerships ?? []).filter((item) => item?.image?.url);
  const partnerNames = (partnerships ?? []).filter((item) => !item?.image?.url && item?.name?.trim());

  return (
    <>
      <section
        className="section page-section-block border-b border-gray-200 bg-white text-black"
        aria-labelledby="HOME_HERO"
        data-layout="imageRight"
        data-motion="imageRight"
        data-theme="light"
      >
        <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div data-anim="right" className="order-1 flex w-full min-w-0 justify-center lg:order-none lg:col-start-2 lg:row-start-1 lg:justify-end">
            <ImageSlot images={images.HOME_HERO ?? []} priority />
          </div>
          <div data-anim="left" style={{ '--d': '140ms' }} className="order-2 w-full min-w-0 lg:order-none lg:col-start-1 lg:row-start-1 lg:justify-self-start">
            <p className="text-sm font-bold tracking-[0.12em] text-primary">SDA UNILAG</p>
            <h2
              id="HOME_HERO"
              className="mb-4 text-4xl font-bold leading-[1.12] tracking-tight text-gray-900 max-md:text-[2rem] max-md:leading-tight lg:text-[2.75rem]"
            >
              Empowering <span className="text-primary">Communities</span> <br /> and Reshaping the{' '}
              <span className="text-primary">Future</span>.
            </h2>
            <p className="mb-8 max-w-xl text-lg font-light leading-7 text-gray-600 max-md:text-base max-md:leading-6">
              Sustainable Development Advocates (SDA) is a community of committed student-changemakers, with oneness,
              empathy, transparency, and accountability, forming the foundation of our shared vision.
            </p>
            <div className="mb-10">
              <Link
                href={member?.url || '#'}
                target={member?.openInNewTab ? '_blank' : undefined}
                rel={member?.openInNewTab ? 'noopener noreferrer' : undefined}
                className="inline-block rounded-full bg-primary px-8 py-3.5 text-base font-bold text-white no-underline transition-colors hover:bg-primary-400"
              >
                Become a member
              </Link>
            </div>
            {metrics.length > 0 ? <SectionStatistics stats={metrics} /> : null}
          </div>
        </div>
      </section>

      <section
        className="section page-section-block relative border-b border-gray-200 bg-black text-white"
        aria-labelledby="ROOTED_COMMUNITY"
        data-layout="imageLeft"
        data-motion="imageLeft"
        data-theme="dark"
      >
        <div className="relative z-[1]">
          <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div data-anim="left" className="order-1 flex w-full min-w-0 justify-center lg:order-none lg:col-start-1 lg:row-start-1 lg:justify-start">
              <ImageSlot images={images.ROOTED_COMMUNITY ?? []} priority />
            </div>
            <div
              data-anim="right"
              style={{ '--d': '140ms' }}
              className="order-2 w-full min-w-0 lg:order-none lg:col-start-2 lg:row-start-1 lg:max-w-none lg:justify-self-start"
            >
              <h2
                id="ROOTED_COMMUNITY"
                className="mb-4 text-4xl font-bold leading-[1.12] tracking-tight text-gray-50 max-md:text-[2rem] max-md:leading-tight lg:text-[2.75rem]"
              >
                {'Rooted in '}
                <span className="text-primary">Community</span>.
                <br />
                {'Focused on '}
                <span className="text-primary">Growth</span>.
              </h2>
              <div className="mb-10 mt-6 flex max-w-2xl flex-col gap-10 max-md:gap-8">
                <div>
                  <h3 className="mb-3 text-4xl font-semibold tracking-tight text-primary max-md:text-lg">Our Mission</h3>
                  <p className="text-xl leading-[1.75] text-gray-300 max-md:text-base max-md:leading-7">
                    Harnessing the power of youths in Nigeria and beyond in creating a better world, through advocacy and
                    implementation of the SDGs.
                  </p>
                </div>
                <div>
                  <h3 className="mb-3 text-4xl font-semibold tracking-tight text-primary max-md:text-lg">Our Vision</h3>
                  <p className="text-xl leading-[1.75] text-gray-300 max-md:text-base max-md:leading-7">
                    To leave no one behind on the 5 P’s (People, Planet, Prosperity, Peace and Partnership) of the SDGs by
                    signing up at least 1 million youths for the global advocacy and implementations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="section page-section-block border-b border-gray-200 bg-gray-50 text-gray-900"
        aria-labelledby="JOURNEY"
        data-layout="videoEmbedLeft"
        data-motion="imageLeft"
        data-theme="gray"
      >
        <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div data-anim="left" className="order-1 flex w-full min-w-0 justify-center lg:order-none lg:col-start-1 lg:row-start-1 lg:justify-start">
            {journeyUrl ? (
              <SectionVideoEmbed
                videoUrl={journeyUrl}
                videoCaption="Our Journey so far!"
                videoSubcaption="From humble beginnings to where we are now"
                coverImageUrl={journeyCover?.url}
                coverAlt={journeyCover?.alt ?? journeyCover?.caption ?? ''}
                priority
              />
            ) : (
              <ImageSlot images={images.JOURNEY ?? []} priority />
            )}
          </div>
          <div
            data-anim="right"
            style={{ '--d': '140ms' }}
            className="order-2 w-full min-w-0 lg:order-none lg:col-start-2 lg:row-start-1 lg:max-w-none lg:justify-self-start"
          >
            <h2
              id="JOURNEY"
              className="mb-4 text-4xl font-bold leading-[1.12] tracking-tight text-gray-900 max-md:text-[2rem] max-md:leading-tight lg:text-[2.75rem]"
            >
              {'Witness our '}
              <span className="text-primary">Journey</span>
              {' of '}
              <span className="text-primary">Transformation</span>
            </h2>
            <p className="mb-8 max-w-xl text-lg font-light leading-7 text-gray-600 max-md:text-base max-md:leading-6">
              A chronicle of resilience and growth, tracing our steps from our earliest days to the present. Discover the
              pivotal moments and dedicated people that have shaped who we are today.
            </p>
            <div className="mb-10">
              <Link
                href={journey?.url || '#'}
                target={journey?.openInNewTab ? '_blank' : undefined}
                rel={journey?.openInNewTab ? 'noopener noreferrer' : undefined}
                className="inline-block rounded-full bg-primary px-8 py-3.5 text-base font-bold text-white no-underline transition-colors hover:bg-primary-400"
              >
                Watch our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {upcoming.length > 0 ? (
        <section
          id="events"
          className="section upcoming-events-section border-b border-gray-200 bg-white py-16 max-lg:py-14 max-md:py-12"
          aria-labelledby="EVENTS"
          data-motion="events"
        >
          <div className="mx-auto w-full max-w-[920px]">
            <h2
              id="EVENTS"
              data-anim="rise"
              className="mb-14 text-center text-4xl font-bold tracking-tight text-gray-900 max-md:mb-10 max-md:text-3xl"
            >
              Upcoming Events
            </h2>
            <ul className="m-0 flex list-none flex-col gap-12 p-0 max-md:gap-10">
              {upcoming.map((event, index) => {
                const reversed = index % 2 === 1;
                const title = event?.title?.trim() ?? 'Event';
                const dateLine = formatEventDateTime(event?.dateTime);
                const description = event?.description;
                return (
                  <li key={`${event?.title ?? 'event'}-${index}`}>
                    <article
                      data-anim={reversed ? 'right' : 'left'}
                      style={{ '--d': `${index * 120}ms` }}
                      className={`flex gap-6 rounded-[2rem] bg-gray-50 p-6 md:items-stretch md:gap-10 md:p-10 ${
                        reversed ? 'flex-col-reverse md:flex-row-reverse' : 'flex-col md:flex-row'
                      }`}
                    >
                      <div className="flex min-h-0 flex-1 flex-col justify-center md:w-1/2">
                        <h3 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 max-md:text-xl">{title}</h3>
                        {dateLine ? (
                          <p className="mt-2 text-base font-semibold text-gray-700 max-md:text-[15px]">{dateLine}</p>
                        ) : null}
                        {description?.trim() ? (
                          description.includes('<') ? (
                            <div
                              className="mt-3 text-base font-normal leading-relaxed text-gray-600 max-md:text-sm max-md:leading-6 [&_a]:font-semibold [&_a]:text-primary-400 [&_a]:no-underline [&_a]:transition-colors [&_a:hover]:text-primary-500 [&_a:hover]:underline"
                              dangerouslySetInnerHTML={{ __html: description }}
                            />
                          ) : (
                            <p className="mt-3 whitespace-pre-line text-base font-normal leading-relaxed text-gray-600 max-md:text-sm max-md:leading-6">
                              {description.trim()}
                            </p>
                          )
                        ) : null}
                      </div>
                      <div className="relative aspect-[3/2] w-full shrink-0 overflow-hidden rounded-2xl bg-gray-200 md:aspect-auto md:min-h-[220px] md:w-1/2">
                        {event?.image?.url ? (
                          <Image
                            src={event.image.url}
                            alt={imageAlt(event.image, title)}
                            fill
                            className="object-cover object-center"
                            sizes="(max-width: 768px) 100vw, 480px"
                            unoptimized={isVectorImage(event.image)}
                          />
                        ) : (
                          <div className="flex h-full min-h-[180px] items-center justify-center text-sm font-medium text-gray-500 md:min-h-[220px]">
                            Image coming soon
                          </div>
                        )}
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}

      <TestimonialsSection
        section={{
          internalName: 'TESTIMONIALS',
          eyebrow: 'TESTIMONIALS',
          heading: 'Real Stories, Real Impact.',
          headingHighlights: ['Stories', 'Impact'],
          subheading: 'See what everyone is saying!',
          testimonials,
        }}
      />

      {partnerships?.length ? (
        <section
          className="section partnerships-section border-b border-gray-200 bg-white py-16 text-gray-900 max-lg:py-14 max-md:py-12"
          aria-labelledby="partnerships-heading-PARTNERSHIPS"
          data-section="partnerships"
          data-motion="partnerships"
        >
          <div className="mx-auto w-full max-w-[1100px]">
            <header data-anim="rise" className="mb-12 text-center max-md:mb-10">
              <h2
                id="partnerships-heading-PARTNERSHIPS"
                className="relative mx-auto inline-block text-3xl font-bold tracking-tight text-gray-900 max-md:text-2xl md:text-4xl"
              >
                Partnerships Secured
              </h2>
            </header>
            {partnerLogos.length > 0 ? (
              <div className="mx-auto flex w-full max-w-[1000px] flex-wrap justify-center gap-x-3 gap-y-8">
                {partnerLogos.map((item, index) => (
                  <div
                    key={`${item.name ?? 'partner'}-${index}`}
                    data-anim="pop"
                    style={{ '--d': `${80 + index * 70}ms` }}
                    className="flex min-w-[150px] flex-col items-center gap-2.5"
                  >
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl bg-gray-50 px-3 py-4 max-md:h-[88px]">
                      <div className="flex w-full flex-1 items-center justify-center">
                        <Image
                          src={item.image.url}
                          alt={imageAlt(item.image, item.name)}
                          width={140}
                          height={72}
                          className="max-h-[52px] w-auto max-w-full object-contain max-md:max-h-[44px]"
                          sizes="(max-width: 768px) 140px, 160px"
                          unoptimized={isVectorImage(item.image)}
                        />
                      </div>
                      <p className="w-full text-center text-xs font-medium leading-snug text-gray-900 max-md:text-[11px]">
                        {item.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
            {partnerNames.length > 0 ? (
              <ul className="mx-auto mt-10 flex max-w-[720px] list-none flex-col gap-4 border-t border-gray-200/80 pt-10 text-center text-sm font-semibold uppercase leading-snug tracking-wide text-gray-900 max-md:mt-8 max-md:gap-3 max-md:pt-8 max-md:text-xs">
                {partnerNames.map((item, index) => (
                  <li key={`${item.name}-${index}`} data-anim="rise" style={{ '--d': `${index * 80}ms` }}>
                    {item.name.trim()}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      ) : null}

      <CommunityBand
        id="JOIN_US"
        images={images.JOIN_US ?? []}
        href={join?.url}
        openInNewTab={join?.openInNewTab}
      />

      <ContactSection
        section={{
          internalName: 'CONTACT',
          eyebrow: 'Be in contact',
          heading: 'Reach Out',
          body: 'Have any questions, want to collaborate, or speak further? We are just one click away. Let’s create a healthy environment together!!!',
          theme: 'gray',
        }}
        socials={socials}
      />
    </>
  );
}
