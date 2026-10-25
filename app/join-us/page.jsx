import Image from 'next/image';
import Link from 'next/link';

import { ClubActivitiesSection } from '@/components/club-activities-section';
import { ContactSection } from '@/components/contact-section';
import { RichText } from '@/components/rich-text';
import { VolunteerOpportunitiesSection } from '@/components/volunteer-opportunities-section';
import {
  getClubActivities,
  getLinks,
  getSectionImageMap,
  getSocialLinks,
  getVolunteerOpportunities,
} from '@/lib/content';
import { imageAlt, isVectorImage } from '@/lib/media';

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
  const heroImage = (images.JOIN_US_HERO ?? []).find((image) => image?.url);
  const heroLink = links.JOIN_US_HERO_0;
  const memberImage = images.JOIN_US_MEMBER?.[0];
  const memberLink = links.JOIN_US_MEMBER_0;
  const donate = links.donate;
  const involved = links.get_involved;
  const newsletter = links.newsletter;
  const sectionShell =
    'my-[100px] px-20 py-10 max-lg:my-20 max-lg:px-[50px] max-lg:py-[30px] max-md:my-[60px] max-md:px-6 max-md:py-3';

  return (
    <div>
      <section
        className="relative isolate flex min-h-[480px] items-center overflow-hidden bg-black text-white lg:min-h-[560px]"
        aria-labelledby="JOIN_US_HERO"
        data-layout="hero"
        data-motion="hero"
        data-theme="dark"
      >
        {heroImage?.url ? (
          <div data-anim="zoom" className="absolute inset-0">
            <Image
              src={heroImage.url}
              alt={imageAlt(heroImage)}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
              unoptimized={isVectorImage(heroImage)}
            />
          </div>
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-black/65" aria-hidden />
        <span data-anim="right" style={{ '--d': '180ms' }} className="pointer-events-none absolute -right-8 top-10 z-[1] max-md:right-4 max-md:top-4">
          <Image
            src="/images/icons/zap-1.svg"
            alt=""
            width={131}
            height={63}
            unoptimized
            className="h-auto w-20 rotate-90 max-md:w-14"
          />
        </span>
        <span data-anim="left" style={{ '--d': '260ms' }} className="pointer-events-none absolute bottom-8 -left-5 z-[1] max-md:bottom-5 max-md:left-5">
          <Image
            src="/images/icons/zap-2.svg"
            alt=""
            width={108}
            height={10}
            unoptimized
            className="h-auto w-24 -rotate-[20deg] max-md:w-16"
          />
        </span>
        <div className="relative z-[1] w-full px-20 py-20 max-lg:px-[50px] max-md:px-6 max-md:py-16">
          <p data-anim="drop" className="mb-3 text-sm font-medium text-white">
            About SDA
          </p>
          <h1
            id="JOIN_US_HERO"
            data-anim="rise"
            style={{ '--d': '120ms' }}
            className="max-w-[18em] whitespace-pre-line text-[56px] font-bold leading-[1.05] tracking-tight text-white max-lg:text-5xl max-md:max-w-none max-md:text-[34px]"
          >
            {'Creating a '}
            <span className="text-primary">Difference</span>
            {',\nExperiencing '}
            <span className="text-primary">Change</span>
          </h1>
          <div data-anim="rise" style={{ '--d': '240ms' }} className="mt-8">
            <Link
              href={heroLink?.url || '#'}
              target={heroLink?.openInNewTab ? '_blank' : undefined}
              rel={heroLink?.openInNewTab ? 'noopener noreferrer' : undefined}
              className="inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-primary-400"
            >
              Become a member
            </Link>
          </div>
        </div>
      </section>

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
              href={memberLink?.url || '#'}
              target={memberLink?.openInNewTab ? '_blank' : undefined}
              rel={memberLink?.openInNewTab ? 'noopener noreferrer' : undefined}
              className="mt-2 inline-block w-fit rounded-full bg-primary px-10 py-4 text-lg font-bold text-white no-underline transition-colors hover:bg-primary-400 visited:text-white max-md:mx-auto max-md:block max-md:text-center"
            >
              Become a member
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
      <section
        data-motion="difference"
        className="relative my-[100px] overflow-hidden bg-gray-900 px-20 py-20 text-white max-lg:my-20 max-lg:px-[50px] max-lg:py-16 max-md:my-[60px] max-md:px-6 max-md:py-12"
      >
        <span data-anim="left" className="pointer-events-none absolute left-8 top-10 max-md:left-3 max-md:top-4">
          <svg width="34" height="68" viewBox="0 0 34 68" fill="none" aria-hidden className="h-16 w-auto max-md:h-12">
            <path d="M4 4L26 64" stroke="#F1582A" strokeWidth="2.6" strokeLinecap="round" />
            <path d="M14 2L32 54" stroke="#F1582A" strokeWidth="2.6" strokeLinecap="round" />
          </svg>
        </span>
        <span data-anim="right" style={{ '--d': '120ms' }} className="pointer-events-none absolute bottom-10 right-8 max-md:bottom-4 max-md:right-3">
          <Image
            src="/images/icons/zap-1.svg"
            alt=""
            width={131}
            height={63}
            unoptimized
            className="h-auto w-24 max-md:w-16"
          />
        </span>
        <div
          data-anim="rise"
          className="relative mx-auto max-w-[920px] rounded-[2.5rem] border border-solid border-primary-500/20 px-8 py-14 text-center max-md:rounded-3xl max-md:px-5 max-md:py-10"
          style={{
            background: 'linear-gradient(rgb(219 80 38 / 0.05), rgb(219 80 38 / 0.05)) padding-box',
          }}
        >
          <div className="mb-6 flex justify-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary-400/5">
              <Image src="/images/icons/donate-heart.png" alt="" width={96} height={96} className="h-12 w-12" />
            </div>
          </div>
          <h2 className="text-[42px] font-bold leading-tight text-white max-lg:text-4xl max-md:text-[32px]">
            Make a <span className="text-primary">Difference</span> With Us!
          </h2>
          <div className="mx-auto mt-5 h-px w-32 bg-gradient-to-r from-white to-white/0" />
          <div className="mx-auto mt-6 max-w-[640px]">
            <RichText
              text="We are committed to empowering lives, making sure no one is left out on the 5 P's of the SDGs. We aim to impact up to at least **1 million lives** before the Agenda 2030 runs out and thus, require your help in executing this vision. Take a step today and join the cause by supporting us."
              className="text-[15px] leading-7 text-gray-300 max-md:text-sm max-md:leading-6"
            />
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={donate?.url || '#'}
              target={donate?.openInNewTab || donate?.url?.startsWith('http') ? '_blank' : undefined}
              rel={donate?.openInNewTab || donate?.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center justify-center rounded-full border border-solid border-primary bg-primary px-8 py-3 text-base font-semibold text-white no-underline transition-colors hover:border-primary-400 hover:bg-primary-400"
            >
              Give to the Cause
            </Link>
            <Link
              href={involved?.url || '#'}
              target={involved?.openInNewTab || involved?.url?.startsWith('http') ? '_blank' : undefined}
              rel={involved?.openInNewTab || involved?.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center justify-center rounded-full border border-solid border-white/80 bg-transparent px-8 py-3 text-base font-semibold text-white no-underline transition-colors hover:bg-white hover:text-gray-900"
            >
              Get Involved
            </Link>
          </div>
          <Link
            href={newsletter?.url || '#'}
            target={newsletter?.openInNewTab || newsletter?.url?.startsWith('http') ? '_blank' : undefined}
            rel={newsletter?.openInNewTab || newsletter?.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="mt-8 inline-block text-sm font-medium text-primary underline decoration-primary underline-offset-4"
          >
            Learn how you make a change in lives through our newsletters.
          </Link>
        </div>
      </section>
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
