'use client';

import { Carousel } from '@/components/carousel';
import TestimonialCard from '@/components/testimonial-card';

function renderHeading({ heading, highlightWords, highlightClassName }) {
  const words = highlightWords ?? [];
  if (!heading) {
    return null;
  }
  if (words.length === 0) {
    return heading;
  }
  const regex = new RegExp(`(${words.join('|')})`, 'g');
  return heading.split(regex).map((part, index) =>
    words.includes(part) ? (
      <span key={index} className={highlightClassName}>
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export function TestimonialsSection({ section }) {
  const items = (section?.testimonials ?? []).filter(Boolean);

  const heading = section?.heading?.trim();
  const highlights = section?.headingHighlights;

  const headingId =
    section?.internalName != null && String(section.internalName).trim()
      ? `testimonials-heading-${String(section.internalName).replace(/\s+/g, '-')}`
      : 'testimonials-heading';

  return (
    <section
      className="relative overflow-hidden bg-black text-white !px-0"
      aria-labelledby={heading ? headingId : undefined}
      data-section="testimonials"
      data-motion="testimonials"
    >
      <div className="section relative z-[2] !px-0">
        <header data-anim="drop" className="mx-auto mb-4 max-w-3xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-primary max-md:mb-2">
            {section?.eyebrow}
          </p>
          {heading ? (
            <h2
              id={headingId}
              className="mb-4 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl md:leading-[1.12]"
            >
              {renderHeading({
                heading,
                highlightWords: highlights,
                highlightClassName: 'text-primary',
              })}
            </h2>
          ) : null}
          <p className="text-base font-normal leading-7 text-white/90 md:text-lg">
            {section?.subheading}
          </p>
        </header>

        {items.length > 0 ? (
          <div data-anim="rise" style={{ '--d': '160ms' }}>
          <Carousel
            visibleItemsCount={3}
            withIndicator
            isInfinite
            dualReverseRow
          >
            {items.map((testimonial, k) => (
              <TestimonialCard key={k} testimonial={testimonial} />
            ))}
          </Carousel>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default TestimonialsSection;
