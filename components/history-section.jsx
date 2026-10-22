import Image from 'next/image';

import { imageAlt, isVectorImage } from '@/lib/media';

export function HistorySection({ section }) {
  const image = section?.images?.[0];
  if (!section?.heading && !section?.body) return null;

  return (
    <section id={section?.internalName} className="section history-section mt-[100px] max-lg:mt-20 max-md:mt-[60px]">
      <div className="history-ctn grid grid-cols-2 items-start gap-8 max-lg:gap-7 max-md:grid-cols-1 max-md:gap-5">
        <div className="history-header">
          {section?.eyebrow ? (
            <p className="history-subheading mb-2 text-lg font-medium text-gray-600">{section.eyebrow}</p>
          ) : null}
          {section?.heading ? (
            <h2 className="history-heading text-5xl font-bold leading-tight max-lg:text-4xl max-md:text-[2rem]">
              {section.heading}
            </h2>
          ) : null}
        </div>
        {section?.body ? (
          <div className="history-content ml-auto max-w-[580px] max-md:ml-0">
            <p className="text-lg leading-6 text-gray-700 max-lg:text-base max-lg:leading-[22px]">{section.body}</p>
          </div>
        ) : null}
        {image?.url ? (
          <div className="history-image relative col-span-2 mt-5 h-[450px] w-full overflow-hidden rounded-[3rem] max-md:col-span-1 max-lg:h-[380px] max-md:h-[300px] max-md:rounded-2xl">
            <Image
              src={image.url}
              alt={imageAlt(image, section?.heading)}
              fill
              sizes="100vw"
              className="object-cover object-center"
              unoptimized={isVectorImage(image)}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
