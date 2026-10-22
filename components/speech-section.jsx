import Image from 'next/image';

import { isVectorImage } from '@/lib/media';

function renderHeading(heading, highlightWords) {
  if (!highlightWords?.length) return heading;

  const pattern = highlightWords.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const regex = new RegExp(`(${pattern})`, 'g');

  return heading.split(regex).map((part, index) =>
    highlightWords.includes(part) ? (
      <span key={index} className="text-primary">
        {part}
      </span>
    ) : (
      part
    )
  );
}

function Message({ text }) {
  return text.split(/\n\n+/).map((paragraph, index) => (
    <p key={index} className="mt-4 text-sm leading-7 text-gray-300 first:mt-0 max-md:text-[13px] max-md:leading-6">
      {paragraph.split('\n').map((line, lineIndex) => (
        <span key={lineIndex}>
          {lineIndex > 0 ? <br /> : null}
          {line}
        </span>
      ))}
    </p>
  ));
}

export function SpeechSection({ section }) {
  const image = section?.images?.[0];
  const role = section?.subBlocks?.find((block) => block?.title?.trim())?.title?.trim();
  if (!section?.heading && !section?.body) return null;

  return (
    <section className="speech-section relative overflow-hidden bg-black px-6 py-24 text-gray-50 max-lg:py-20 max-md:px-4 max-md:py-16">
      <div className="relative z-[2] mx-auto max-w-[760px] text-center">
        {section?.eyebrow ? (
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.72em] text-primary">{section.eyebrow}</p>
        ) : null}
        {section?.heading ? (
          <h2 className="text-5xl font-bold leading-tight max-lg:text-4xl max-md:text-[32px]">
            {renderHeading(section.heading, section.headingHighlights)}
          </h2>
        ) : null}

        <div className="relative mx-auto mt-16 max-w-[680px] max-md:mt-12">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-[540px] w-full -translate-x-1/2 rounded-t-[340px] max-md:h-[460px] max-md:rounded-t-[220px] bg-primary-500/5"
            style={{
              borderStyle: 'solid',
              borderWidth: '1px 1px 0',
              borderColor: 'rgba(255, 255, 255, 0.35)',
              maskImage: 'linear-gradient(to bottom, #000 18%, transparent 82%)',
              WebkitMaskImage: 'linear-gradient(to bottom, #000 18%, transparent 82%)',
            }}
          />
          <div className="relative px-10 pb-4 pt-14 max-md:px-5 max-md:pt-10">
            {image?.url ? (
              <div className="relative mx-auto mb-6 h-[176px] w-[176px] max-md:mb-5 max-md:h-[140px] max-md:w-[140px]">
                <svg
                  aria-hidden
                  viewBox="0 0 100 100"
                  className="pointer-events-none absolute inset-0 h-full w-full"
                >
                  <defs>
                    <linearGradient id={`speech-ring-${section.id ?? 'portrait'}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#db5026" />
                      <stop offset="58%" stopColor="#db5026" stopOpacity="0.55" />
                      <stop offset="100%" stopColor="#db5026" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke={`url(#speech-ring-${section.id ?? 'portrait'})`}
                    strokeWidth="2.4"
                  />
                </svg>
                <div className="absolute inset-[3px] overflow-hidden rounded-full">
                  <Image
                    src={image.url}
                    alt={section?.subheading || ''}
                    fill
                    sizes="176px"
                    className="object-cover object-center"
                    unoptimized={isVectorImage(image)}
                  />
                </div>
              </div>
            ) : null}
            {section?.subheading ? (
              <p className="text-xl font-bold max-md:text-lg">{section.subheading}</p>
            ) : null}
            {role ? <p className="mt-1 text-sm font-medium text-gray-300 max-md:text-xs">{role}</p> : null}
            {section?.body ? (
              <div className="mx-auto mt-8 max-w-[520px] text-left">
                <Message text={section.body} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <Image
        src="/images/icons/zap-1.svg"
        alt=""
        width={108}
        height={10}
        unoptimized
        className="pointer-events-none absolute top-[10%] left-[2%] z-[1] h-auto w-28 -rotate-6 max-lg:w-20 max-md:left-3 max-md:w-16"
      />
      <Image
        src="/images/icons/zap-1.svg"
        alt=""
        width={131}
        height={63}
        unoptimized
        className="pointer-events-none absolute right-[4%] top-[36%] z-[1] h-auto w-28 -rotate-6 max-lg:w-20 max-md:right-2 max-md:w-10"
      />
    </section>
  );
}
