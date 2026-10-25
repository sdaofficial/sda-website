import Image from 'next/image';
import Link from 'next/link';

import { ClubActivitiesSection } from '@/components/club-activities-section';
import { ContactSection } from '@/components/contact-section';
import { DifferenceSection } from '@/components/difference-section';
import { PageSectionBlock } from '@/components/page-section-block';
import { VolunteerOpportunitiesSection } from '@/components/volunteer-opportunities-section';
import {
  getClubActivities,
  getLinks,
  getSectionImageMap,
  getSocialLinks,
  getVolunteerOpportunities,
  linkCta,
} from '@/lib/content';

export const metadata = {
  title: 'Join Us',
  description: 'Become a member of SDA and explore our events at the University of Lagos.',
};

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

export default async function JoinUsPage() {
  const [links, images, opportunities, activities, socials] = await Promise.all([
    getLinks(),
    getSectionImageMap(),
    getVolunteerOpportunities(),
    getClubActivities(),
    getSocialLinks(),
  ]);
  const memberImage = images.JOIN_US_MEMBER?.[0];
  const memberCta = linkCta(links, 'JOIN_US_MEMBER_0', 'Become a member', 'Rounded Filled');
  const sectionShell =
    'my-[100px] px-20 py-10 max-lg:my-20 max-lg:px-[50px] max-lg:py-[30px] max-md:my-[60px] max-md:px-6 max-md:py-3';

  return (
    <div>
      <PageSectionBlock
        section={{
          internalName: 'JOIN_US_HERO',
          layout: 'hero',
          theme: 'dark',
          eyebrow: 'About SDA',
          heading: 'Creating a Difference,\nExperiencing Change',
          headingHighlights: ['Difference', 'Change'],
          images: images.JOIN_US_HERO ?? [],
          ctas: [linkCta(links, 'JOIN_US_HERO_0', 'Become a member', 'Rounded Filled')],
        }}
      />

      <section id="become-a-member" data-motion="imageRight" className={`scroll-mt-24 ${sectionShell}`}>
        <div className="grid grid-cols-2 items-center gap-[100px] max-lg:gap-10 max-md:grid-cols-1 max-md:gap-8">
          <div data-anim="left">
            <p className="mb-2 text-lg font-medium text-gray-600">Join us</p>
            <h2 className="mb-2 text-5xl font-bold leading-tight max-lg:text-[40px] max-md:text-[32px]">
              {renderHeading('Become a Member of SDA', ['Member'])}
            </h2>
            <p className="mb-10 max-w-[580px] text-lg leading-7 text-gray-700 max-lg:text-[17px] max-lg:leading-[26px] max-md:mb-10 max-md:text-base max-md:leading-6">
              To join the Sustainable Development Advocates University of Lagos, applicants must demonstrate a
              commitment to sustainable development principles. Basic requirements include being a student of the
              University of Lagos , and completion of the online application form. Applicants are expected to undergo
              an interim class which upon completion would submit essays on various topics outlining their passion for
              sustainable development and their goals within the field. Successful candidates will be selected based on
              their participation during the classes and alignment with the SDA&apos;s mission as communicated in their
              submitted essays.
            </p>
            <Link
              href={memberCta.url}
              target={memberCta.openInNewTab ? '_blank' : undefined}
              rel={memberCta.openInNewTab ? 'noopener noreferrer' : undefined}
              className="mt-2 inline-block w-fit rounded-full bg-primary px-10 py-4 text-lg font-bold text-white no-underline transition-colors hover:bg-primary-400 visited:text-white max-md:mx-auto max-md:block max-md:text-center"
            >
              {memberCta.label}
            </Link>
          </div>
          {memberImage ? (
            <div
              data-anim="zoom"
              style={{ '--d': '140ms' }}
              className="relative w-full overflow-hidden rounded-[4rem] aspect-[6/5] max-lg:aspect-square max-md:aspect-[5/3] max-md:rounded-2xl"
            >
              <Image
                src={memberImage.url}
                alt={memberImage.alt || 'Become a Member of SDA'}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          ) : null}
        </div>
      </section>

      <VolunteerOpportunitiesSection section={{ heading: 'Volunteer Opportunities', opportunities }} />
      <ClubActivitiesSection section={{ heading: 'Club Activities', activities }} />
      <DifferenceSection
        section={{
          heading: 'Make a Difference With Us!',
          headingHighlights: ['Difference'],
          body: "We are committed to empowering lives, making sure no one is left out on the 5 P's of the SDGs. We aim to impact up to at least **1 million lives** before the Agenda 2030 runs out and thus, require your help in executing this vision. Take a step today and join the cause by supporting us.",
          ctas: [
            linkCta(links, 'donate', 'Give to the Cause', 'Rounded Filled'),
            linkCta(links, 'get_involved', 'Get Involved', 'Rounded Outline'),
            linkCta(links, 'newsletter', 'Learn how you make a change in lives through our newsletters.', 'Link'),
          ],
        }}
      />
      <ContactSection
        section={{
          internalName: 'JOIN_US_CONTACT',
          eyebrow: 'Be in contact',
          heading: 'Reach Out',
          body: 'Have any questions, want to collaborate, or speak further? We are just one click away. Let’s create a healthy environment together!!!',
          theme: 'gray',
        }}
        socials={socials}
      />
    </div>
  );
}
