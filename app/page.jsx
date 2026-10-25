import Link from 'next/link';

import { ContactSection } from '@/components/contact-section';
import { PageSectionBlock } from '@/components/page-section-block';
import { PartnershipsSection } from '@/components/partnerships-section';
import { TestimonialsSection } from '@/components/testimonials-section';
import { UpcomingEventsSection } from '@/components/upcoming-events-section';
import { ImageSlot } from '@/components/image-slot';
import { SectionStatistics } from '@/components/section-statistics';
import {
  getEvents,
  getImpactMetrics,
  getLinks,
  getPartnerships,
  getSectionImageMap,
  getSocialLinks,
  getTestimonials,
  linkCta,
} from '@/lib/content';

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
              Empowering <span className="text-primary">Communities</span> and Reshaping the{' '}
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

      <PageSectionBlock
        section={{
          internalName: 'ROOTED_COMMUNITY',
          layout: 'imageLeft',
          theme: 'dark',
          heading: 'Rooted in Community.\n\nFocused on Growth.',
          headingHighlights: ['Community', 'Growth'],
          subBlocks: [
            {
              title: 'Our Mission',
              body: 'Harnessing the power of youths in Nigeria and beyond in creating a better world, through advocacy and implementation of the SDGs.',
            },
            {
              title: 'Our Vision',
              body: 'To leave no one behind on the 5 P’s (People, Planet, Prosperity, Peace and Partnership) of the SDGs by signing up at least 1 million youths for the global advocacy and implementations.',
            },
          ],
          images: images.ROOTED_COMMUNITY ?? [],
        }}
      />
      <PageSectionBlock
        section={{
          internalName: 'JOURNEY',
          layout: 'videoEmbedLeft',
          theme: 'gray',
          heading: 'Witness our Journey of Transformation',
          headingHighlights: ['Journey', 'Transformation'],
          body: 'A chronicle of resilience and growth, tracing our steps from our earliest days to the present. Discover the pivotal moments and dedicated people that have shaped who we are today.',
          videoCaption: 'Our Journey so far!',
          videoSubcaption: 'From humble beginnings to where we are now',
          images: images.JOURNEY ?? [],
          videoUrl: links.youtube_story?.url,
          ctas: [linkCta(links, 'JOURNEY_0', 'Watch our Story', 'Rounded Filled')],
        }}
      />
      <UpcomingEventsSection section={{ internalName: 'EVENTS', heading: 'Upcoming Events', events }} />
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
      <PartnershipsSection
        section={{ internalName: 'PARTNERSHIPS', heading: 'Partnerships Secured', theme: 'light', partnerships }}
      />
      <PageSectionBlock
        section={{
          eyebrow: 'Our Community',
          heading: 'Ready to Become a Part of our Vibrant Community?',
          headingHighlights: ['Community'],
          body: 'Are you inspired and would like to join the changemakers at SDA to make a positive impact and build a sustainable future for your community?',
          layout: 'imageBottomShadow',
          theme: 'dark',
          internalName: 'JOIN_US',
          images: images.JOIN_US ?? [],
          ctas: [linkCta(links, 'JOIN_US_0', 'Join now', 'Rounded Filled')],
        }}
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
