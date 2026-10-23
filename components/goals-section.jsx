import Image from 'next/image';

import { imageAlt, isVectorImage } from '@/lib/media';

export function GoalsSection({ section }) {
  const images = (section?.images ?? []).filter((image) => image?.url);
  if (!section?.heading && !section?.body && images.length === 0) return null;

  return (
    <section data-motion="goals" className="section goals-section my-[60px] max-lg:my-[50px] max-md:my-10">
      <div className="goals-ctn grid grid-cols-2 items-center gap-x-6 gap-y-[60px] max-lg:gap-x-5 max-lg:gap-y-[50px] max-md:grid-cols-1 max-md:gap-6">
        {section?.heading ? (
          <div data-anim="left" className="goals-header col-start-1 max-md:col-span-1">
            <h2 className="goals-heading text-[120px] font-bold leading-none text-gray-800-alpha max-lg:text-[100px] max-md:mb-2.5 max-md:text-[56px]">
              {section.heading}
            </h2>
          </div>
        ) : null}
        {section?.body ? (
          <div data-anim="right" style={{ '--d': '140ms' }} className="goals-content col-start-2 max-md:col-span-1 max-md:col-start-1">
            <p className="text-lg font-medium leading-6 text-gray-600 max-lg:text-base max-lg:leading-[22px]">
              {section.body}
            </p>
          </div>
        ) : null}
        {images.map((image, index) => (
          <div
            key={image.url + index}
            data-anim={index % 2 === 0 ? 'left' : 'right'}
            style={{ '--d': `${200 + index * 120}ms` }}
            className="goals-image relative aspect-[5/3] h-full overflow-hidden rounded-[2rem] max-md:col-span-1 max-md:h-auto max-md:max-w-full max-md:rounded-2xl"
          >
            <Image
              src={image.url}
              alt={imageAlt(image, section?.heading)}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
              unoptimized={isVectorImage(image)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
