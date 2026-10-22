import { ContactSection } from '@/components/contact-section';
import { PageSectionBlock } from '@/components/page-section-block';
import { PartnershipsSection } from '@/components/partnerships-section';
import { TestimonialsSection } from '@/components/testimonials-section';
import { UpcomingEventsSection } from '@/components/upcoming-events-section';
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
    return <PageSectionBlock key={key} section={section} />;
  });
}
