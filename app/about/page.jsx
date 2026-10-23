import { CmsSections } from '@/components/cms-sections';
import { getPageBySlug } from '@/lib/pages';

export async function generateMetadata() {
  const page = await getPageBySlug('about');

  return {
    title: page?.seo?.metaTitle || 'About us',
    description:
      page?.seo?.metaDescription || 'About Sustainable Development Advocates at the University of Lagos.',
  };
}

export default function AboutPage() {
  return <CmsSections slug="about" />;
}
