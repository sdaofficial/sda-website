import Image from 'next/image';
import Link from 'next/link';

import { RichText } from '@/components/rich-text';
import { isVectorImage } from '@/lib/media';

const bodyClass = 'text-sm leading-6 text-gray-600 max-md:text-[13px] max-md:leading-5';

function externalLinkProps(href) {
  if (!href) return {};
  if (href.startsWith('http') || href.startsWith('mailto:')) {
    return { target: '_blank', rel: 'noopener noreferrer' };
  }
  return {};
}

function ActivityCard({ activity, imageFirst }) {
  const image = activity.image?.url ? (
    <div className="relative h-full overflow-hidden rounded-3xl">
      <Image
        src={activity.image.url}
        alt={activity.image.alt || activity.title || ''}
        fill
        sizes="(max-width: 768px) 100vw, 460px"
        className="object-cover object-center"
        unoptimized={isVectorImage(activity.image)}
      />
    </div>
  ) : null;

  const copy = (
    <div className="flex flex-col gap-5">
      {activity.title ? (
        <h3 className="text-4xl font-bold leading-tight text-gray-900 max-md:text-3xl">{activity.title}</h3>
      ) : null}
      <div className="flex flex-col gap-4">
        <RichText text={activity.body} className={bodyClass} listClassName="list-disc space-y-1 pl-5" />
      </div>
      {activity.involvementBody || activity.perksBody ? (
        <div className="grid gap-8 sm:grid-cols-2">
          {activity.involvementBody ? (
            <div>
              {activity.involvementTitle ? (
                <h4 className="mb-2 text-sm font-bold text-gray-900">{activity.involvementTitle}</h4>
              ) : null}
              <RichText text={activity.involvementBody} className={bodyClass} listClassName="list-disc space-y-1.5 pl-4" />
            </div>
          ) : null}
          {activity.perksBody ? (
            <div>
              {activity.perksTitle ? (
                <h4 className="mb-2 text-sm font-bold text-gray-900">{activity.perksTitle}</h4>
              ) : null}
              <RichText text={activity.perksBody} className={bodyClass} />
            </div>
          ) : null}
        </div>
      ) : null}
      {activity.ctaLabel ? (
        <Link
          href={activity.ctaUrl || '#'}
          className="mt-2 inline-block w-fit rounded-full border border-solid border-primary px-8 py-3 text-base font-semibold text-primary no-underline transition-colors hover:bg-primary hover:text-white"
          {...externalLinkProps(activity.ctaUrl)}
        >
          {activity.ctaLabel}
        </Link>
      ) : null}
    </div>
  );

  return (
    <article className="grid items-center gap-8 rounded-[2rem] bg-gray-50 p-6 md:grid-cols-2 md:gap-12 md:p-10 max-md:rounded-3xl">
      {imageFirst ? image : null}
      {copy}
      {imageFirst ? null : image}
    </article>
  );
}

export function ClubActivitiesSection({ section }) {
  const activities = (section?.activities ?? []).filter((item) => item?.title?.trim() || item?.body?.trim());
  if (!section?.heading && activities.length === 0) return null;

  return (
    <section
      data-motion="activities"
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
        {activities.map((activity, index) => (
          <div key={`${activity.title}-${index}`} data-anim="rise" style={{ '--d': `${index * 120}ms` }}>
            <ActivityCard activity={activity} imageFirst={index % 2 === 1} />
          </div>
        ))}
      </div>
    </section>
  );
}
