import { ContactSection } from '@/components/contact-section';
import { GoalsSection } from '@/components/goals-section';
import { HistorySection } from '@/components/history-section';
import { PageSectionBlock } from '@/components/page-section-block';
import { QuoteSection } from '@/components/quote-section';
import { SpeechSection } from '@/components/speech-section';
import { TeamSection } from '@/components/team-section';
import { getLinks, getSectionImageMap, getSocialLinks, getSpeeches, getTeamMembers, linkCta } from '@/lib/content';

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

  return (
    <>
      <PageSectionBlock
        section={{
          internalName: 'ABOUT_HERO',
          layout: 'hero',
          theme: 'dark',
          eyebrow: 'About SDA',
          heading: 'Making a Positive Impact on the Environment',
          headingHighlights: ['Impact'],
          images: images.ABOUT_HERO ?? [],
          ctas: [linkCta(links, 'ABOUT_HERO_0', 'Become a member', 'Rounded Filled')],
        }}
      />
      <HistorySection
        section={{
          internalName: 'ABOUT_HISTORY',
          eyebrow: 'Our history',
          heading: 'Uniting Youth for Sustainable Development with SDA.',
          body: 'We are an organization dedicated to raising awareness for the Sustainable Development Goals (SDGs). While we leverage global expertise to shape our organizational framework, our projects are implemented with a local focus, emphasizing direct engagement with both rural and urban communities. As a dynamic force dedicated to driving positive impact, SDA proudly leads the charge in youth-led initiatives, placing the banner of sustainable development at the forefront of our endeavors.',
          images: images.ABOUT_HISTORY ?? [],
        }}
      />
      <QuoteSection
        section={{
          body: "At our core lies a mission that pulses with purpose — to illuminate the path towards Sustainable Development Goals (SDGs) and actively contribute to their realization. We champion the potency of youth inclusiveness, capacity building, and the cultivation of job innovators poised to steer progress across the 5 P's of SDGs: People, Planet, Prosperity, Peace, and Partnership.",
        }}
      />
      <GoalsSection
        section={{
          heading: 'SDA Goals',
          body: "To create awareness about the Sustainable Development Goals. Advancing the SDGs through youth inclusivity, sensitization and implementation of social projects. To ensure that no one is left behind on the 5 P's of SDGs: People, Planet, Prosperity, Peace and Partnership.",
          images: images.ABOUT_GOALS ?? [],
        }}
      />
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
      <PageSectionBlock
        section={{
          eyebrow: 'Our Community',
          heading: 'Ready to Become a Part of our Vibrant Community?',
          headingHighlights: ['Community'],
          body: 'Are you inspired and would like to join the changemakers at SDA to make a positive impact and build a sustainable future for your community?',
          layout: 'imageBottomShadow',
          theme: 'dark',
          internalName: 'ABOUT_JOIN_US',
          images: images.ABOUT_JOIN_US ?? [],
          ctas: [linkCta(links, 'ABOUT_JOIN_US_0', 'Join now', 'Rounded Filled')],
        }}
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
