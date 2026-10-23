import Image from 'next/image';

import { isVectorImage } from '@/lib/media';
import { RichText } from '@/components/rich-text';

export function VolunteerOpportunitiesSection({ section }) {
  const cards = (section?.opportunities ?? []).filter((card) => card?.title?.trim() || card?.body?.trim());
  if (!section?.heading && cards.length === 0) return null;

  return (
    <section
      data-motion="opportunities"
      className="my-[100px] px-20 py-10 max-lg:my-20 max-lg:px-[50px] max-lg:py-[30px] max-md:my-[60px] max-md:px-6 max-md:py-3"
    >
      {section?.heading ? (
        <div data-anim="rise" className="mb-14 text-center max-md:mb-10">
          <h2 className="text-5xl font-bold leading-tight text-gray-900 max-lg:text-4xl max-md:text-[32px]">
            {section.heading}
          </h2>
          <Image
            src="/images/icons/zap-2.svg"
            alt=""
            width={108}
            height={10}
            unoptimized
            className="mx-auto mt-2 h-auto w-24"
          />
        </div>
      ) : null}

      <div className="mx-auto flex max-w-[1100px] flex-col gap-8">
        {cards.map((card, index) => (
          <article
            key={`${card.title}-${index}`}
            data-anim="rise"
            style={{ '--d': `${index * 120}ms` }}
            className="grid items-center gap-8 rounded-[2.5rem] bg-black p-6 text-white md:grid-cols-[minmax(220px,340px)_1fr] md:gap-10 md:p-8 max-md:rounded-3xl"
          >
            {card.image?.url ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src={card.image.url}
                  alt={card.image.alt || card.title || ''}
                  fill
                  sizes="(max-width: 768px) 100vw, 340px"
                  className="object-cover object-center"
                  unoptimized={isVectorImage(card.image)}
                />
              </div>
            ) : null}
            <div className="flex flex-col gap-4">
              {card.title ? <h3 className="text-3xl font-bold leading-tight max-md:text-2xl">{card.title}</h3> : null}
              <div className="flex flex-col gap-4">
                <RichText
                  text={card.body}
                  className="text-base leading-7 text-gray-300 max-md:text-sm max-md:leading-6"
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
