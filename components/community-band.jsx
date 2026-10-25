import Image from 'next/image';
import Link from 'next/link';

import { imageAlt, isVectorImage } from '@/lib/media';

export function CommunityBand({ id, images, href, openInNewTab }) {
  const image = (images ?? []).find((img) => img?.url);

  return (
    <section
      className="section page-section-block border-b border-gray-200 bg-black text-white"
      aria-labelledby={id}
      data-layout="imageBottomShadow"
      data-motion="imageBottomShadow"
      data-theme="dark"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-10 lg:gap-14">
        <div data-anim="rise" className="mx-auto w-full max-w-3xl text-center">
          <p className="text-sm font-bold tracking-[0.12em] text-primary">Our Community</p>
          <h2
            id={id}
            className="mb-4 text-4xl font-bold leading-[1.12] tracking-tight text-gray-50 max-md:text-[2rem] max-md:leading-tight lg:text-[2.75rem]"
          >
            {'Ready to Become a Part of our Vibrant '}
            <span className="text-primary">Community</span>?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-lg font-light leading-7 text-gray-300 max-md:text-base max-md:leading-6">
            Are you inspired and would like to join the changemakers at SDA to make a positive impact and build a
            sustainable future for your community?
          </p>
          <div className="relative mb-10 inline-block">
            <Link
              href={href || '#'}
              target={openInNewTab ? '_blank' : undefined}
              rel={openInNewTab ? 'noopener noreferrer' : undefined}
              className="inline-block rounded-full bg-primary px-8 py-3.5 text-base font-bold text-white no-underline transition-colors hover:bg-primary-400"
            >
              Join now
            </Link>
              <span
                data-anim="pop"
                style={{ '--d': '320ms' }}
                className="pointer-events-none absolute left-[calc(100%+0.75rem)] top-1/2"
              >
                <Image
                  src="/images/icons/curly-arrow.svg"
                  alt=""
                  width={111}
                  height={55}
                  unoptimized
                  className="h-auto w-[92px] -translate-y-[85%] max-md:w-16"
                />
              </span>
          </div>
        </div>
        {image?.url ? (
          <div data-anim="rise" style={{ '--d': '200ms' }} className="flex w-full justify-center">
            <div className="relative w-full overflow-hidden rounded-t-[2rem] max-md:rounded-t-2xl">
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={image.url}
                  alt={imageAlt(image)}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority
                  unoptimized={isVectorImage(image)}
                />
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black to-transparent" />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
