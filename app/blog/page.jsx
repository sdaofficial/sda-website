import { CmsSections } from '@/components/cms-sections';
import { getPageBySlug } from '@/lib/pages';

export async function generateMetadata() {
  const page = await getPageBySlug('blog');

  return {
    title: page?.seo?.metaTitle || 'Blog',
    description: page?.seo?.metaDescription || 'Stories from Sustainable Development Advocates.',
  };
}

export default function BlogPage() {
  return <CmsSections slug="blog" />;
}
