import Image from 'next/image';
import Link from 'next/link';

import { ContactSection } from '@/components/contact-section';
import { RichText } from '@/components/rich-text';
import { getBlogPosts, getSocialLinks } from '@/lib/content';
import { isVectorImage } from '@/lib/media';

export const metadata = {
  title: 'Blog',
  description: 'Stories from Sustainable Development Advocates.',
};

function linkProps(url) {
  if (url?.startsWith('http') || url?.startsWith('mailto:')) {
    return { target: '_blank', rel: 'noopener noreferrer' };
  }
  return {};
}

function PostImage({ image, title, className }) {
  if (!image?.url) return null;

  return (
    <div className={`relative overflow-hidden rounded-3xl ${className}`}>
      <Image
        src={image.url}
        alt={image.alt || title || ''}
        fill
        sizes="(max-width: 768px) 100vw, 480px"
        className="object-cover object-center"
        unoptimized={isVectorImage(image)}
      />
    </div>
  );
}

function PostButton({ label, url, filled }) {
  if (!label) return null;

  const className = filled
    ? 'mt-6 inline-flex w-fit items-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-primary-400'
    : 'mt-6 inline-flex w-fit items-center rounded-full border border-solid border-primary bg-transparent px-6 py-2.5 text-sm font-semibold text-primary no-underline transition-colors hover:bg-primary hover:text-white';

  if (!url) return <span className={className}>{label}</span>;

  return (
    <Link href={url} className={className} {...linkProps(url)}>
      {label}
    </Link>
  );
}

export default async function BlogPage() {
  const [posts, socials] = await Promise.all([getBlogPosts(), getSocialLinks()]);
  const visible = (posts ?? []).filter((post) => post?.title?.trim() || post?.body?.trim());
  const featured = visible.find((post) => post.featured) ?? null;
  const others = visible.filter((post) => post !== featured);

  return (
    <>
      <section
        data-motion="posts"
        className="my-[100px] px-20 py-10 max-lg:my-20 max-lg:px-[50px] max-lg:py-[30px] max-md:my-[60px] max-md:px-6 max-md:py-3"
      >
        {featured ? (
          <div data-anim="rise">
            <div className="mb-8">
              <span className="block select-none text-[72px] font-bold leading-none text-gray-300 max-md:text-6xl" aria-hidden>
                &ldquo;
              </span>
              <h2 className="-mt-3 text-5xl font-bold leading-tight text-gray-900 max-lg:text-4xl max-md:text-[32px]">
                Featured Post
              </h2>
            </div>
            <article className="grid items-center gap-8 rounded-[2rem] bg-gray-50 p-5 md:grid-cols-2 md:gap-10 md:p-8">
              <PostImage image={featured.image} title={featured.title} className="aspect-[5/4]" />
              <div>
                {featured.title ? (
                  <h3 className="text-4xl font-bold leading-tight text-gray-900 max-md:text-3xl">{featured.title}</h3>
                ) : null}
                {featured.body ? (
                  <div className="mt-4 flex flex-col gap-3">
                    <RichText text={featured.body} className="text-sm leading-6 text-gray-600" />
                  </div>
                ) : null}
                <PostButton label={featured.ctaLabel} url={featured.ctaUrl} filled />
              </div>
            </article>
          </div>
        ) : null}

        {others.length > 0 ? (
          <div className={featured ? 'mt-16 max-md:mt-12' : ''}>
            <h2 data-anim="rise" className="mb-8 text-4xl font-bold leading-tight text-gray-900 max-md:text-3xl">
              More...
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {others.map((post, index) => (
                <article
                  key={`${post.title}-${index}`}
                  data-anim="rise"
                  style={{ '--d': `${index * 100}ms` }}
                  className="flex flex-col rounded-[2rem] bg-gray-50 p-5 md:p-6"
                >
                  <PostImage image={post.image} title={post.title} className="aspect-[4/3]" />
                  {post.title ? (
                    <h3 className="mt-6 text-2xl font-bold leading-tight text-gray-900">{post.title}</h3>
                  ) : null}
                  {post.body ? (
                    <div className="mt-3 flex flex-col gap-3">
                      <RichText text={post.body} className="text-sm leading-6 text-gray-500" />
                    </div>
                  ) : null}
                  <PostButton label={post.ctaLabel} url={post.ctaUrl} />
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </section>
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
