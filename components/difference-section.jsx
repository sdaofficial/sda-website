import Image from 'next/image';
import Link from 'next/link';

import { RichText } from '@/components/rich-text';

function renderHeading(heading, highlightWords) {
  const words = (highlightWords ?? []).filter(Boolean);
  if (!words.length) return heading;

  const pattern = words.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const regex = new RegExp(`(${pattern})`, 'g');

  return heading.split(regex).map((part, index) =>
    words.includes(part) ? (
      <span key={index} className="text-primary">
        {part}
      </span>
    ) : (
      part
    )
  );
}

function linkProps(url, openInNewTab) {
  if (openInNewTab || url?.startsWith('http') || url?.startsWith('mailto:')) {
    return { target: '_blank', rel: 'noopener noreferrer' };
  }
  return {};
}

function CtaButton({ cta, outline }) {
  const className = outline
    ? 'inline-flex items-center justify-center rounded-full border border-solid border-white/80 bg-transparent px-8 py-3 text-base font-semibold text-white no-underline transition-colors hover:bg-white hover:text-gray-900'
    : 'inline-flex items-center justify-center rounded-full border border-solid border-primary bg-primary px-8 py-3 text-base font-semibold text-white no-underline transition-colors hover:border-primary-400 hover:bg-primary-400';

  if (!cta?.url) return <span className={className}>{cta.label}</span>;

  return (
    <Link href={cta.url} className={className} {...linkProps(cta.url, cta.openInNewTab)}>
      {cta.label}
    </Link>
  );
}

export function DifferenceSection({ section }) {
  if (!section?.heading && !section?.body) return null;

  const ctas = section.ctas ?? [];
  const textLink = ctas.find((cta) => /link/i.test(cta.style || ''));
  const buttons = ctas.filter((cta) => cta !== textLink);

  return (
    <section
      data-motion="difference"
      className="relative my-[100px] overflow-hidden bg-gray-900 px-20 py-20 text-white max-lg:my-20 max-lg:px-[50px] max-lg:py-16 max-md:my-[60px] max-md:px-6 max-md:py-12"
    >
      <span data-anim="left" className="pointer-events-none absolute left-8 top-10 max-md:left-3 max-md:top-4">
        <svg width="34" height="68" viewBox="0 0 34 68" fill="none" aria-hidden className="h-16 w-auto max-md:h-12">
          <path d="M4 4L26 64" stroke="#F1582A" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M14 2L32 54" stroke="#F1582A" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
      </span>
      <span data-anim="right" style={{ '--d': '120ms' }} className="pointer-events-none absolute bottom-10 right-8 max-md:bottom-4 max-md:right-3">
        <Image
          src="/images/icons/zap-1.svg"
          alt=""
          width={131}
          height={63}
          unoptimized
          className="h-auto w-24 max-md:w-16"
        />
      </span>

      <div
        data-anim="rise"
        className="relative mx-auto max-w-[920px] rounded-[2.5rem] border border-solid border-primary-500/20 px-8 py-14 text-center max-md:rounded-3xl max-md:px-5 max-md:py-10 "
        style={{
          background:
            'linear-gradient(rgb(219 80 38 / 0.05), rgb(219 80 38 / 0.05)) padding-box',
        }}
      >
        <div className="mb-6 flex justify-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary-400/5">
            <Image src="/images/icons/donate-heart.png" alt="" width={96} height={96} className="h-12 w-12" />
          </div>
        </div>
        {section.heading ? (
          <h2 className="text-[42px] font-bold leading-tight text-white max-lg:text-4xl max-md:text-[32px]">
            {renderHeading(section.heading, section.headingHighlights)}
          </h2>
        ) : null}
        <div className="mx-auto mt-5 h-px w-32 bg-gradient-to-r from-white to-white/0" />
        {section.body ? (
          <div className="mx-auto mt-6 max-w-[640px]">
            <RichText text={section.body} className="text-[15px] leading-7 text-gray-300 max-md:text-sm max-md:leading-6" />
          </div>
        ) : null}
        {buttons.length > 0 ? (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {buttons.map((cta, index) => (
              <CtaButton key={`${cta.label}-${index}`} cta={cta} outline={/outline/i.test(cta.style || '')} />
            ))}
          </div>
        ) : null}
        {textLink?.label ? (
          <Link
            href={textLink.url || '#'}
            className="mt-8 inline-block text-sm font-medium text-primary underline decoration-primary underline-offset-4"
            {...linkProps(textLink.url, textLink.openInNewTab)}
          >
            {textLink.label}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
