import Link from 'next/link';

import { ImageSlot } from './image-slot';
import { SectionStatistics } from './section-statistics';

function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}

const renderHeading = ({ heading, highlightWords, highlightClassName }) => {
  const regex = new RegExp(`(${highlightWords.join("|")})`, "g");

  return heading.split(regex).map((part, index) =>
    highlightWords.includes(part) ? (
      <span key={index} className={highlightClassName}>
        {part}
      </span>
    ) : (
      part
    )
  );
};

const themeShell = {
  light: 'bg-white text-black',
  dark: 'bg-black text-white',
};

const themeContent = {
  light: {
    heading: 'text-gray-900',
    body: 'text-gray-600',
    emptyImage: 'bg-gray-200/80 text-gray-500',
    imageRing: 'ring-black/5',
    skeleton: 'bg-gray-200/90',
  },
  dark: {
    heading: 'text-gray-50',
    body: 'text-gray-300',
    emptyImage: 'bg-gray-800 text-gray-400',
    imageRing: 'ring-white/10',
    skeleton: 'bg-gray-700/90',
  },
};

function SectionSkeleton() {
  const pulse = "animate-pulse rounded-md bg-gray-200/90";

  return (
    <section
      className="section page-section-block"
      aria-busy="true"
      aria-label="Loading section content"
    >
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1">
          <div className={cn('mb-4 h-4 w-36', pulse)} />
          <div className={cn('h-9 w-full max-w-xl max-md:h-8 mb-6 space-y-3', pulse)} />
          <div className="mb-8 space-y-2.5">
            <div className={cn('h-4 w-full max-w-xl', pulse)} />
            <div className={cn('h-4 w-[72%] max-w-lg', pulse)} />
          </div>
          <div className={cn('mb-10 inline-block h-12 w-44 rounded-full', pulse)} />
        </div>
        <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
          <div className="relative mx-auto h-[min(440px,72vw)] w-full max-w-[420px] max-md:mb-4">
            <div
              className={cn(
                'absolute right-0 w-[82%] max-w-[300px] overflow-hidden rounded-2xl shadow-md max-md:w-[88%] aspect-[4/5]',
                pulse
              )}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function CtaLink({ label, url, openInNewTab }) {
  if (!label) return null;
  const btn =
    'inline-block rounded-full bg-primary px-8 py-3.5 text-base font-bold text-white no-underline transition-colors hover:bg-primary-400';
  if (url) {
    const target = openInNewTab ? '_blank' : '_self';

    if (url.startsWith('/')) {
      return (
        <Link href={url} className={btn}>
          {label}
        </Link>
      );
    }
    return (
      <a href={url} className={btn} target={target} rel="noopener noreferrer">
        {label}
      </a>
    );
  }
  return <span className={btn}>{label}</span>;
}

export function PageSectionBlock({ section }) {
  if (!section) {
    return <SectionSkeleton theme="light" />;
  }

  const layout = section?.layout;
  const theme = section?.theme;
  const themeStyle = themeContent[theme];
  const highlightWords = section?.headingHighlights;
  const stats = section?.statisticsCollection?.items ?? [];
  const images = (section?.imagesCollection?.items ?? []).filter((img) => Boolean(img?.imageAsset?.url));
  const primaryCta = section?.ctAsCollection?.items?.[0];

  const contentBlock = (
    <div
      className={cn(
        layout === 'noImage' && 'mx-auto max-w-3xl',
        layout === 'imageBottomShadow' && 'max-w-3xl',
        (layout === 'imageLeft' || layout === 'imageRight') &&
          'lg:max-w-none lg:justify-self-start',
        layout === 'imageTop' && 'max-w-3xl lg:mx-auto'
      )}
    >

      {section?.eyebrow ? (
        <p className="text-sm font-bold tracking-[0.12em] text-primary">
          {section?.eyebrow}
        </p>
      ) : null}

      <h2
        id={section?.internalName}
        className={cn(
          'mb-4 text-4xl font-bold leading-[1.12] tracking-tight max-md:text-[2rem] max-md:leading-tight lg:text-[2.75rem]',
          themeStyle.heading
        )}
      >
        {renderHeading({
          heading: section?.heading,
          highlightWords: highlightWords ?? [],
          highlightClassName: 'text-primary'
        })}
      </h2>

      {section?.body ? (
        <p className={cn('mb-8 max-w-xl text-lg leading-7 max-md:text-base max-md:leading-6 font-light', themeStyle.body)}>
          {section?.body}
        </p>
      ) : null}

      {primaryCta?.label ? (
        <div className="mb-10">
          <CtaLink label={primaryCta?.label} url={primaryCta?.url} openInNewTab={primaryCta?.openInNewTab} />
        </div>
      ) : null}

      {stats.length > 0 ? <SectionStatistics stats={stats} /> : null}
    </div>
  );

  const mediaBlock = (
    <div
      className={cn(
        'flex justify-center',
        layout === 'imageRight' && 'lg:justify-end',
        layout === 'imageLeft' && 'lg:justify-start',
        layout === 'imageTop' && 'w-full',
        layout === 'imageBottomShadow' && 'w-full justify-center'
      )}
    >
      <ImageSlot images={images} theme={theme} layout={layout} priority />
    </div>
  );

  let sectionInner;

  if (layout === 'noImage') {
    sectionInner = <div className="mx-auto w-full max-w-[1200px]">{contentBlock}</div>;
  } else if (layout === 'imageTop') {
    sectionInner = (
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-12">
        {mediaBlock}
        {contentBlock}
      </div>
    );
  } else if (layout === 'imageBottomShadow') {
    sectionInner = (
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-10 lg:gap-14">
        {contentBlock}
        {mediaBlock}
      </div>
    );
  } else {
    const contentCol = (
      <div
        className={cn(
          'order-2 w-full min-w-0 lg:order-none',
          layout === 'imageRight' && 'lg:col-start-1 lg:row-start-1',
          layout === 'imageLeft' && 'lg:col-start-2 lg:row-start-1'
        )}
      >
        {contentBlock}
      </div>
    );

    const mediaCol = (
      <div
        className={cn(
          'order-1 w-full min-w-0 lg:order-none',
          layout === 'imageRight' && 'lg:col-start-2 lg:row-start-1',
          layout === 'imageLeft' && 'lg:col-start-1 lg:row-start-1'
        )}
      >
        {mediaBlock}
      </div>
    );

    sectionInner = (
      <div className="w-full grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {mediaCol}
        {contentCol}
      </div>
    );
  }

  return (
    <section
      className={cn('border-b border-gray-200 section page-section-block', themeShell[theme])}
      aria-labelledby={section?.internalName}
      data-layout={layout}
      data-theme={theme}
    >
      {sectionInner}
    </section>
  );
}
