import Image from 'next/image';
import Link from 'next/link';

import { imageAlt, isVectorImage } from '@/lib/media';
import { ImageSlot } from './image-slot';
import { SectionStatistics } from './section-statistics';
import { SectionVideoEmbed } from './section-video-embed';

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
  gray: 'bg-gray-50 text-gray-900',
};

const bottomFade = {
  light: 'from-white',
  dark: 'from-black',
  gray: 'from-gray-50',
};

function LandscapeShadowImage({ img, fadeClass }) {
  if (!img?.url) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-t-[2rem] max-md:rounded-t-2xl">
      <div className="relative aspect-[16/9] w-full">
        <Image
          src={img.url}
          alt={imageAlt(img)}
          fill
          className="object-cover object-center"
          sizes="(max-width: 1200px) 100vw, 1200px"
          priority
          unoptimized={isVectorImage(img)}
        />
      </div>
      <div
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t to-transparent',
          fadeClass
        )}
      />
    </div>
  );
}

const themeContent = {
  light: {
    heading: 'text-gray-900',
    body: 'text-gray-600',
    subBlockBody: 'text-gray-600',
    emptyImage: 'bg-gray-200/80 text-gray-500',
    imageRing: 'ring-black/5',
    skeleton: 'bg-gray-200/90',
  },
  dark: {
    heading: 'text-gray-50',
    body: 'text-gray-300',
    subBlockBody: 'text-gray-300',
    emptyImage: 'bg-gray-800 text-gray-400',
    imageRing: 'ring-white/10',
    skeleton: 'bg-gray-700/90',
  },
  gray: {
    heading: 'text-gray-900',
    body: 'text-gray-600',
    subBlockBody: 'text-gray-600',
    emptyImage: 'bg-gray-200/80 text-gray-500',
    imageRing: 'ring-black/5',
    skeleton: 'bg-gray-200/90',
  }
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

function CtaLink({ label, url, openInNewTab, className }) {
  if (!label) return null;
  const btn =
    className ??
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
      <Link href={url} className={btn} target={target} rel="noopener noreferrer" aria-label={label}>
        {label}
      </Link>
    );
  }
  return <span className={btn}>{label}</span>;
}

function HeroSection({ section }) {
  const image = (section?.images ?? []).find((img) => img?.url);
  const cta = section?.ctas?.[0];
  const highlights = section?.headingHighlights ?? [];

  return (
    <section
      className="relative isolate flex min-h-[480px] items-center overflow-hidden bg-black text-white lg:min-h-[560px]"
      aria-labelledby={section?.internalName || undefined}
      data-layout="hero"
      data-motion="hero"
      data-theme={section?.theme || 'dark'}
    >
      {image?.url ? (
        <div data-anim="zoom" className="absolute inset-0">
          <Image
            src={image.url}
            alt={imageAlt(image)}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            unoptimized={isVectorImage(image)}
          />
        </div>
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-black/65" aria-hidden />
      <span data-anim="right" style={{ '--d': '180ms' }} className="pointer-events-none absolute -right-8 top-10 z-[1] max-md:right-4 max-md:top-4">
        <Image
          src="/images/icons/zap-1.svg"
          alt=""
          width={131}
          height={63}
          unoptimized
          className="h-auto w-20 rotate-90 max-md:w-14"
        />
      </span>
      <span data-anim="left" style={{ '--d': '260ms' }} className="pointer-events-none absolute bottom-8 -left-5 z-[1] max-md:bottom-5 max-md:left-5">
        <Image
          src="/images/icons/zap-2.svg"
          alt=""
          width={108}
          height={10}
          unoptimized
          className="h-auto w-24 -rotate-[20deg] max-md:w-16"
        />
      </span>
      <div className="relative z-[1] w-full px-20 py-20 max-lg:px-[50px] max-md:px-6 max-md:py-16">
        {section?.eyebrow ? (
          <p data-anim="drop" className="mb-3 text-sm font-medium text-white">
            {section.eyebrow}
          </p>
        ) : null}
        {section?.heading ? (
          <h1
            id={section?.internalName}
            data-anim="rise"
            style={{ '--d': '120ms' }}
            className="max-w-[11em] text-[56px] font-bold leading-[1.05] tracking-tight text-white max-lg:text-5xl max-md:max-w-none max-md:text-[34px]"
          >
            {renderHeading({
              heading: section.heading,
              highlightWords: highlights,
              highlightClassName: 'text-primary',
            })}
          </h1>
        ) : null}
        {cta?.label ? (
          <div data-anim="rise" style={{ '--d': '240ms' }} className="mt-8">
            <CtaLink
              label={cta.label}
              url={cta.url}
              openInNewTab={cta.openInNewTab}
              className="inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-primary-400"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function PageSectionBlock({ section }) {
  if (!section) {
    return <SectionSkeleton theme="light" />;
  }

  if (section.layout === 'hero') {
    return <HeroSection section={section} />;
  }

  const layout =
    section?.layout === 'videoEmbedLeft' ? 'imageLeft' : section?.layout === 'form' ? 'noImage' : section?.layout;
  const theme = section?.theme;
  const themeStyle = themeContent[theme] ?? themeContent.light;
  const highlightWords = section?.headingHighlights;
  const stats = section?.statistics ?? [];
  const subBlocks = (section?.subBlocks ?? []).filter((b) => b?.title?.trim() || b?.body?.trim());
  const images = (section?.images ?? []).filter((img) => Boolean(img?.url));
  const primaryCta = section?.ctas?.[0];
  const videoUrlRaw = section?.videoUrl;
  const videoUrl = typeof videoUrlRaw === 'string' ? videoUrlRaw.trim() : '';
  const hasVideo = Boolean(videoUrl);
  const videoCover = images[0];

  const contentMotion =
    layout === 'imageRight'
      ? ['left', 140]
      : layout === 'imageLeft'
        ? ['right', 140]
        : layout === 'imageTop'
          ? ['rise', 160]
          : ['rise', 0];
  const mediaMotion =
    layout === 'imageRight'
      ? ['right', 0]
      : layout === 'imageLeft'
        ? ['left', 0]
        : layout === 'imageTop' || layout === 'noImage'
          ? ['zoom', 0]
          : layout === 'imageBottomShadow'
            ? ['rise', 200]
            : ['rise', 0];

  const contentBlock = (
    <div
      data-anim={contentMotion[0]}
      style={{ '--d': `${contentMotion[1]}ms` }}
      className={cn(
        layout === 'noImage' && 'mx-auto max-w-3xl',
        layout === 'imageBottomShadow' && 'mx-auto w-full max-w-3xl text-center',
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
        <p className={cn('mb-8 max-w-xl text-lg leading-7 max-md:text-base max-md:leading-6 font-light', layout === 'imageBottomShadow' && 'mx-auto', themeStyle.body)}>
          {section?.body}
        </p>
      ) : null}

      {subBlocks.length > 0 ? (
        <div
          className={cn(
            'mb-10 flex max-w-2xl flex-col gap-10 max-md:gap-8',
            layout === 'imageBottomShadow' && 'mx-auto',
            !section?.body && 'mt-6'
          )}
        >
          {subBlocks.map((block, index) => (
            <div key={index}>
              {block.title?.trim() ? (
                <h3 className="mb-3 text-4xl font-semibold tracking-tight text-primary max-md:text-lg">{block.title.trim()}</h3>
              ) : null}
              {block.body?.trim() ? (
                <p
                  className={cn(
                    'text-xl leading-[1.75] max-md:text-base max-md:leading-7',
                    themeStyle.subBlockBody
                  )}
                >
                  {block.body.trim()}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {primaryCta?.label ? (
        <div className={cn('mb-10', layout === 'imageBottomShadow' && 'relative inline-block')}>
          <CtaLink label={primaryCta?.label} url={primaryCta?.url} openInNewTab={primaryCta?.openInNewTab} />
          {layout === 'imageBottomShadow' ? (
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
          ) : null}
        </div>
      ) : null}

      {stats.length > 0 ? <SectionStatistics stats={stats} /> : null}
    </div>
  );

  const mediaBlock = (
    <div
      data-anim={mediaMotion[0]}
      style={{ '--d': `${mediaMotion[1]}ms` }}
      className={cn(
        'flex justify-center',
        layout === 'imageRight' && 'lg:justify-end',
        layout === 'imageLeft' && 'lg:justify-start',
        layout === 'imageTop' && 'w-full',
        layout === 'imageBottomShadow' && 'w-full justify-center'
      )}
    >
      {hasVideo ? (
        <SectionVideoEmbed
          videoUrl={videoUrl}
          videoCaption={section?.videoCaption}
          videoSubcaption={section?.videoSubcaption}
          coverImageUrl={videoCover?.url}
          coverAlt={videoCover?.alt ?? videoCover?.caption ?? ''}
          priority
        />
      ) : layout === 'imageBottomShadow' ? (
        <LandscapeShadowImage img={images[0]} fadeClass={bottomFade[theme] ?? bottomFade.dark} />
      ) : (
        <ImageSlot images={images} priority />
      )}
    </div>
  );

  let sectionInner;

  if (layout === 'noImage') {
    sectionInner =
      hasVideo ? (
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-12">
          {mediaBlock}
          {contentBlock}
        </div>
      ) : (
        <div className="mx-auto w-full max-w-[1200px]">{contentBlock}</div>
      );
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
      className={cn(
        'border-b border-gray-200 section page-section-block',
        themeShell[theme],
        subBlocks.length > 0 && 'relative'
      )}
      aria-labelledby={section?.internalName}
      data-layout={section?.layout}
      data-motion={layout}
      data-theme={theme}
    >
      <div className={cn(subBlocks.length > 0 && 'relative z-[1]')}>{sectionInner}</div>
    </section>
  );
}
