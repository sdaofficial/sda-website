export function QuoteSection({ section }) {
  if (!section?.body) return null;

  return (
    <section className="section quote-section my-[60px] max-lg:my-[60px] max-md:my-10">
      <div className="quote-ctn relative mx-auto max-w-[700px] px-4 py-3 text-center max-lg:max-w-[600px] max-lg:px-10 max-md:px-3">
        <span className="quote-mark quote-mark-top pointer-events-none absolute left-[-32px] top-[26px] text-[124px] font-bold text-gray-800-alpha select-none max-md:left-[-10px] max-md:top-4 max-md:text-[100px]">
          &ldquo;
        </span>
        <blockquote className="quote-text">
          <p className="text-lg font-medium leading-7 max-lg:text-base max-lg:leading-[26px] max-md:text-sm max-md:leading-5">
            {section.body}
          </p>
        </blockquote>
        <span className="quote-mark quote-mark-bottom pointer-events-none absolute bottom-3 right-10 rotate-180 text-[124px] font-bold text-gray-800-alpha select-none max-md:bottom-2.5 max-md:right-5 max-md:text-[100px]">
          &ldquo;
        </span>
      </div>
    </section>
  );
}
