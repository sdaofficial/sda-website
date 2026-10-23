export function QuoteSection({ section }) {
  if (!section?.body) return null;

  return (
    <section data-motion="quote" className="section quote-section my-[60px] max-lg:my-[60px] max-md:my-10">
      <div className="quote-ctn relative mx-auto max-w-[700px] px-4 py-3 text-center max-lg:max-w-[600px] max-lg:px-10 max-md:px-3">
        <span data-anim="pop" className="pointer-events-none absolute left-[-32px] top-[26px] max-md:left-[-10px] max-md:top-4">
          <span className="quote-mark quote-mark-top block text-[124px] font-bold leading-none text-gray-800-alpha select-none max-md:text-[100px]">
            &ldquo;
          </span>
        </span>
        <blockquote data-anim="rise" style={{ '--d': '120ms' }} className="quote-text">
          <p className="text-lg font-medium leading-7 max-lg:text-base max-lg:leading-[26px] max-md:text-sm max-md:leading-5">
            {section.body}
          </p>
        </blockquote>
        <span
          data-anim="pop"
          style={{ '--d': '180ms' }}
          className="pointer-events-none absolute bottom-3 right-10 max-md:bottom-2.5 max-md:right-5"
        >
          <span className="quote-mark quote-mark-bottom block rotate-180 text-[124px] font-bold leading-none text-gray-800-alpha select-none max-md:text-[100px]">
            &ldquo;
          </span>
        </span>
      </div>
    </section>
  );
}
