import Image from 'next/image';
import Link from 'next/link';

import { CommunityBand } from '@/components/community-band';
import { ContactSection } from '@/components/contact-section';
import { SpeechSection } from '@/components/speech-section';
import { TeamSection } from '@/components/team-section';
import { getLinks, getSectionImageMap, getSocialLinks, getSpeeches, getTeamMembers } from '@/lib/content';
import { imageAlt, isVectorImage } from '@/lib/media';

export const metadata = {
  title: 'About us',
  description: 'About Sustainable Development Advocates at the University of Lagos.',
};

function speechSection(chrome, speech) {
  return {
    ...chrome,
    subheading: speech?.name,
    body: speech?.body,
    subBlocks: speech?.roleLabel ? [{ title: speech.roleLabel }] : [],
    images: speech?.image ? [speech.image] : [],
  };
}

export default async function AboutPage() {
  const [links, images, speeches, teamMembers, socials] = await Promise.all([
    getLinks(),
    getSectionImageMap(),
    getSpeeches(),
    getTeamMembers(),
    getSocialLinks(),
  ]);
  const heroImage = (images.ABOUT_HERO ?? []).find((image) => image?.url);
  const heroLink = links.ABOUT_HERO_0;
  const historyImage = (images.ABOUT_HISTORY ?? []).find((image) => image?.url);
  const goalImages = (images.ABOUT_GOALS ?? []).filter((image) => image?.url);

  return (
    <>
      <section
        className="relative isolate flex min-h-[480px] items-center overflow-hidden bg-black text-white lg:min-h-[560px]"
        aria-labelledby="ABOUT_HERO"
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
            id="ABOUT_HERO"
            data-anim="rise"
            style={{ '--d': '120ms' }}
            className="max-w-[11em] text-[56px] font-bold leading-[1.05] tracking-tight text-white max-lg:text-5xl max-md:max-w-none max-md:text-[34px]"
          >
            Making a Positive <span className="text-primary">Impact</span> on the Environment
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

      <section id="ABOUT_HISTORY" data-motion="history" className="section history-section mt-[100px] max-lg:mt-20 max-md:mt-[60px]">
        <div className="history-ctn grid grid-cols-2 items-start gap-8 max-lg:gap-7 max-md:grid-cols-1 max-md:gap-5">
          <div data-anim="left" className="history-header">
            <p className="history-subheading mb-2 text-lg font-medium text-gray-600">Our history</p>
            <h2 className="history-heading text-5xl font-bold leading-tight max-lg:text-4xl max-md:text-[2rem]">
              Uniting Youth for Sustainable Development with SDA.
            </h2>
          </div>
          <div data-anim="right" style={{ '--d': '120ms' }} className="history-content ml-auto max-w-[580px] max-md:ml-0">
            <p className="text-lg leading-6 text-gray-700 max-lg:text-base max-lg:leading-[22px]">
              We are an organization dedicated to raising awareness for the Sustainable Development Goals (SDGs). While
              we leverage global expertise to shape our organizational framework, our projects are implemented with a
              local focus, emphasizing direct engagement with both rural and urban communities. As a dynamic force
              dedicated to driving positive impact, SDA proudly leads the charge in youth-led initiatives, placing the
              banner of sustainable development at the forefront of our endeavors.
            </p>
          </div>
          {historyImage?.url ? (
            <div
              data-anim="zoom"
              style={{ '--d': '180ms' }}
              className="history-image relative col-span-2 mt-5 h-[450px] w-full overflow-hidden rounded-[3rem] max-md:col-span-1 max-lg:h-[380px] max-md:h-[300px] max-md:rounded-2xl"
            >
              <Image
                src={historyImage.url}
                alt={imageAlt(historyImage, 'Uniting Youth for Sustainable Development with SDA.')}
                fill
                sizes="100vw"
                className="object-cover object-center"
                unoptimized={isVectorImage(historyImage)}
              />
            </div>
          ) : null}
        </div>
      </section>

      <section data-motion="quote" className="quote-section my-5">
        <div className="quote-ctn relative mx-auto max-w-[700px] px-4 py-3 text-center max-lg:max-w-[600px] max-lg:px-10 max-md:px-3">
          <span data-anim="pop" className="pointer-events-none absolute left-[-32px] top-[26px] max-md:left-[-10px] max-md:top-4">
            <span className="quote-mark quote-mark-top block text-[124px] font-bold leading-none text-gray-800-alpha select-none max-md:text-[100px]">
              &ldquo;
            </span>
          </span>
          <blockquote data-anim="rise" style={{ '--d': '120ms' }} className="quote-text">
            <p className="text-lg font-medium leading-7 max-lg:text-base max-lg:leading-[26px] max-md:text-sm max-md:leading-5">
              At our core lies a mission that pulses with purpose — to illuminate the path towards Sustainable
              Development Goals (SDGs) and actively contribute to their realization. We champion the potency of youth
              inclusiveness, capacity building, and the cultivation of job innovators poised to steer progress across
              the 5 P&apos;s of SDGs: People, Planet, Prosperity, Peace, and Partnership.
            </p>
          </blockquote>
          <span
            data-anim="pop"
            style={{ '--d': '180ms' }}
            className="pointer-events-none absolute bottom-3 right-10 max-md:bottom-2.5 max-md:right-5"
          >
            <span className="quote-mark quote-mark-bottom block rotate-180 text-[124px] font-bold leading-none text-gray-800-alpha select-none max-md:text-[100px]">
              &ldquo;
            </span>
          </span>
        </div>
      </section>

      <section data-motion="goals" className="section goals-section my-[60px] max-lg:my-[50px] max-md:my-10">
        <div className="goals-ctn grid grid-cols-2 items-center gap-x-6 gap-y-[60px] max-lg:gap-x-5 max-lg:gap-y-[50px] max-md:grid-cols-1 max-md:gap-6">
          <div data-anim="left" className="goals-header col-start-1 max-md:col-span-1">
            <h2 className="goals-heading text-[120px] font-bold leading-none text-gray-800-alpha max-lg:text-[100px] max-md:mb-2.5 max-md:text-[56px]">
              SDA Goals
            </h2>
          </div>
          <div data-anim="right" style={{ '--d': '140ms' }} className="goals-content col-start-2 max-md:col-span-1 max-md:col-start-1">
            <p className="text-lg font-medium leading-6 text-gray-600 max-lg:text-base max-lg:leading-[22px]">
              To create awareness about the Sustainable Development Goals. Advancing the SDGs through youth inclusivity,
              sensitization and implementation of social projects. To ensure that no one is left behind on the 5
              P&apos;s of SDGs: People, Planet, Prosperity, Peace and Partnership.
            </p>
          </div>
          {goalImages.map((image, index) => (
            <div
              key={image.url + index}
              data-anim={index % 2 === 0 ? 'left' : 'right'}
              style={{ '--d': `${200 + index * 120}ms` }}
              className="goals-image relative aspect-[5/3] h-full overflow-hidden rounded-[2rem] max-md:col-span-1 max-md:h-auto max-md:max-w-full max-md:rounded-2xl"
            >
              <Image
                src={image.url}
                alt={imageAlt(image, 'SDA Goals')}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center"
                unoptimized={isVectorImage(image)}
              />
            </div>
          ))}
        </div>
      </section>
      <SpeechSection
        section={speechSection(
          { eyebrow: 'SPEECH', heading: 'From the table of our President', headingHighlights: ['President'] },
          speeches.president
        )}
      />
      <TeamSection
        section={{
          eyebrow: 'Our team',
          heading: 'Meet the Incredible SDA Team',
          body: 'Our team is the driving force, the heartbeat, and the soul of our mission. Each member is a unique piece of the puzzle, contributing their talents, experiences, and passions to create a harmonious symphony of purpose.',
          teamMembers,
        }}
      />
      <SpeechSection
        section={speechSection(
          { eyebrow: 'Speech', heading: 'A Message from our Staff Adviser', headingHighlights: ['Staff', 'Adviser'] },
          speeches.staff_adviser
        )}
      />
      <CommunityBand
        id="ABOUT_JOIN_US"
        images={images.ABOUT_JOIN_US ?? []}
        href={links.ABOUT_JOIN_US_0?.url}
        openInNewTab={links.ABOUT_JOIN_US_0?.openInNewTab}
      />
      <ContactSection
        section={{
          internalName: 'ABOUT_CONTACT',
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
