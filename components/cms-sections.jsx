import { ContactSection } from '@/components/contact-section';
import { GoalsSection } from '@/components/goals-section';
import { HistorySection } from '@/components/history-section';
import { PageSectionBlock } from '@/components/page-section-block';
import { PartnershipsSection } from '@/components/partnerships-section';
import { QuoteSection } from '@/components/quote-section';
import { SpeechSection } from '@/components/speech-section';
import { TeamSection } from '@/components/team-section';
import { TestimonialsSection } from '@/components/testimonials-section';
import { UpcomingEventsSection } from '@/components/upcoming-events-section';
import { BlogPostsSection } from '@/components/blog-posts-section';
import { ClubActivitiesSection } from '@/components/club-activities-section';
import { DifferenceSection } from '@/components/difference-section';
import { VolunteerOpportunitiesSection } from '@/components/volunteer-opportunities-section';
import { PagePreview } from '@/components/page-preview';
import { getPageBySlug, getSocialLinks } from '@/lib/pages';

export async function CmsSections({ slug }) {
  const page = await getPageBySlug(slug);
  const sections = page?.sections?.filter(Boolean) ?? [];

  if (!sections.length) {
    return <PagePreview slug={slug} />;
  }

  const socials = await getSocialLinks();

  return sections.map((section) => {
    const key = section.id ?? section.internalName ?? section.type;

    if (section.type === 'events') {
      return <UpcomingEventsSection key={key} section={section} />;
    }
    if (section.type === 'testimonials') {
      return <TestimonialsSection key={key} section={section} />;
    }
    if (section.type === 'partnerships') {
      return <PartnershipsSection key={key} section={section} />;
    }
    if (section.layout === 'form') {
      return <ContactSection key={key} section={section} socials={socials} />;
    }
    if (section.layout === 'history') {
      return <HistorySection key={key} section={section} />;
    }
    if (section.layout === 'quote') {
      return <QuoteSection key={key} section={section} />;
    }
    if (section.layout === 'goals') {
      return <GoalsSection key={key} section={section} />;
    }
    if (section.layout === 'speech' || section.layout === 'staffMessage') {
      return <SpeechSection key={key} section={section} />;
    }
    if (section.layout === 'team') {
      return <TeamSection key={key} section={section} />;
    }
    if (section.layout === 'opportunities') {
      return <VolunteerOpportunitiesSection key={key} section={section} />;
    }
    if (section.layout === 'activities') {
      return <ClubActivitiesSection key={key} section={section} />;
    }
    if (section.layout === 'difference') {
      return <DifferenceSection key={key} section={section} />;
    }
    if (section.layout === 'posts') {
      return <BlogPostsSection key={key} section={section} />;
    }
    return <PageSectionBlock key={key} section={section} />;
  });
}
