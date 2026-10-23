import Image from 'next/image';
import Link from 'next/link';
import { PageSectionBlock } from '@/components/page-section-block';
import { ClubActivitiesSection } from '@/components/club-activities-section';
import { ContactSection } from '@/components/contact-section';
import { DifferenceSection } from '@/components/difference-section';
import { VolunteerOpportunitiesSection } from '@/components/volunteer-opportunities-section';
import { getPageBySlug, getSocialLinks } from '@/lib/pages';

function renderHeading(heading, highlightWords) {
  const words = (highlightWords ?? []).filter(Boolean);
  if (!words.length) return heading;

  const pattern = words.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const regex = new RegExp(`(${pattern})`, 'g');

  return heading.split(regex).map((part, index) =>
    words.includes(part) ? (
      <span key={index} className="text-primary">
        {part}
      </span>
    ) : (
      part
    )
  );
}

export async function generateMetadata() {
  const page = await getPageBySlug('join-us');

  return {
    title: page?.seo?.metaTitle || 'Join Us',
    description:
      page?.seo?.metaDescription ||
      'Become a member of SDA and explore our events at the University of Lagos.',
  };
}

export default async function JoinUsPage() {
  const [page, socials] = await Promise.all([getPageBySlug('join-us'), getSocialLinks()]);
  const hero = page?.sections?.find((section) => section.layout === 'hero');
  const member = page?.sections?.find((section) => section.internalName === 'JOIN_US_MEMBER');
  const memberImage = member?.images?.find((image) => image?.url);
  const memberCta = member?.ctas?.[0];
  const opportunities = page?.sections?.find((section) => section.internalName === 'JOIN_US_OPPORTUNITIES');
  const activities = page?.sections?.find((section) => section.internalName === 'JOIN_US_ACTIVITIES');
  const difference = page?.sections?.find((section) => section.internalName === 'JOIN_US_DIFFERENCE');
  const contact = page?.sections?.find((section) => section.internalName === 'JOIN_US_CONTACT');
  const sectionShell =
    'my-[100px] px-20 py-10 max-lg:my-20 max-lg:px-[50px] max-lg:py-[30px] max-md:my-[60px] max-md:px-6 max-md:py-3';

  return (
    <div>
      {hero ? <PageSectionBlock section={hero} /> : null}

      {member ? (
        <section id="become-a-member" data-motion="imageRight" className={`scroll-mt-24 ${sectionShell}`}>
          <div className="grid grid-cols-2 items-center gap-[100px] max-lg:gap-10 max-md:grid-cols-1 max-md:gap-8">
            <div data-anim="left">
              {member.eyebrow ? <p className="mb-2 text-lg font-medium text-gray-600">{member.eyebrow}</p> : null}
              {member.heading ? (
                <h2 className="mb-2 text-5xl font-bold leading-tight max-lg:text-[40px] max-md:text-[32px]">
                  {renderHeading(member.heading, member.headingHighlights)}
                </h2>
              ) : null}
              {member.body ? (
                <p className="mb-10 max-w-[580px] text-lg leading-7 text-gray-700 max-lg:text-[17px] max-lg:leading-[26px] max-md:mb-10 max-md:text-base max-md:leading-6">
                  {member.body}
                </p>
              ) : null}
              {memberCta?.label ? (
                <Link
                  href={memberCta.url || '#'}
                  target={memberCta.openInNewTab ? '_blank' : undefined}
                  rel={memberCta.openInNewTab ? 'noopener noreferrer' : undefined}
                  className="mt-2 inline-block w-fit rounded-full bg-primary px-10 py-4 text-lg font-bold text-white no-underline transition-colors hover:bg-primary-400 visited:text-white max-md:mx-auto max-md:block max-md:text-center"
                >
                  {memberCta.label}
                </Link>
              ) : null}
            </div>
            {memberImage ? (
              <div
                data-anim="zoom"
                style={{ '--d': '140ms' }}
                className="relative w-full overflow-hidden rounded-[4rem] aspect-[6/5] max-lg:aspect-square max-md:aspect-[5/3] max-md:rounded-2xl"
              >
                <Image
                  src={memberImage.url}
                  alt={memberImage.alt || member.heading || ''}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {opportunities ? <VolunteerOpportunitiesSection section={opportunities} /> : null}

      {activities ? <ClubActivitiesSection section={activities} /> : null}

      {difference ? <DifferenceSection section={difference} /> : null}

      {contact ? <ContactSection section={contact} socials={socials} /> : null}
    </div>
  );
}
