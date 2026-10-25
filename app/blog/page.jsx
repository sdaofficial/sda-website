import { BlogPostsSection } from '@/components/blog-posts-section';
import { ContactSection } from '@/components/contact-section';
import { getBlogPosts, getSocialLinks } from '@/lib/content';

export const metadata = {
  title: 'Blog',
  description: 'Stories from Sustainable Development Advocates.',
};

export default async function BlogPage() {
  const [posts, socials] = await Promise.all([getBlogPosts(), getSocialLinks()]);

  return (
    <>
      <BlogPostsSection section={{ heading: 'Featured Post', subheading: 'More...', posts }} />
      <ContactSection
        section={{
          internalName: 'BLOG_CONTACT',
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
