import Image from 'next/image';

export default function TestimonialCard({ testimonial }) {

  return (
    <>
      <div className="relative w-[calc(100vw)] aspect-[2/0.85] mx-8 flex items-center justify-center overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-white/50 via-white/15 to-white/5 text-white">
        <article
          className="w-[calc(100%-2px)] h-[calc(100%-2px)] px-8 flex flex-col items-center justify-center gap-3 overflow-hidden rounded-[2.5rem] bg-primary-900 text-white shadow-lg md:flex-row"
          data-component="testimonial-card"
        >
          <div
            className="relative aspect-[6/5] h-[200px] border-2 border-primary-400 overflow-hidden rounded-3xl"
          >
            <Image
              src={testimonial?.imageAsset?.imageAsset?.url}
              alt={testimonial?.imageAsset?.caption}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 44vw"
              priority={false}
            />
          </div>

          <div className="flex flex-1 flex-col justify-center gap-1 -mt-8">
            <span
              className="font-sans text-7xl font-bold text-primary-400 rotate-180 w-fit"
              aria-hidden
            >
              &ldquo;
            </span>
            <blockquote className="m-0">
              <p className="text-pretty font-sans text-xs font-light leading-relaxed text-gray-100 line-clamp-6">
                {testimonial?.body}
              </p>
              <footer className="mt-2 font-sans text-base font-bold text-white">
                {testimonial?.author}
              </footer>
            </blockquote>
          </div>
        </article>
      </div>
    </>
  );
}
