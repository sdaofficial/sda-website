import Image from 'next/image';

const SOCIAL_ICONS = {
  instagram: '/images/icons/instagram.svg',
  x: '/images/icons/twitter.svg',
  linkedin: '/images/icons/linkedin.svg',
  youtube: '/images/icons/youtube.svg',
};

const inputClass =
  'form-input mt-1 w-full appearance-none rounded-xl border border-solid border-gray-200 bg-white px-4 py-3.5 font-sans text-base text-gray-900 transition-colors placeholder:text-gray-400 focus:border-primary focus:outline-none max-lg:px-3 max-lg:py-3 max-lg:text-[15px] max-md:text-sm';

export function ContactSection({ section, socials = [] }) {
  const links = socials.filter((link) => SOCIAL_ICONS[link.platform] && link.url);

  return (
    <section
      className="contact-section grid grid-cols-2 items-stretch gap-[120px] border-b border-gray-200 bg-gray-50 px-20 py-[100px] text-gray-900 max-lg:gap-20 max-lg:px-[50px] max-lg:py-20 max-md:grid-cols-1 max-md:items-start max-md:gap-5 max-md:px-6 max-md:pb-6 max-md:pt-10"
      id="contact"
      aria-labelledby={section.internalName || undefined}
      data-layout="form"
      data-theme={section.theme || 'gray'}
    >
      <div className="contact-info flex h-full flex-col justify-between max-md:gap-10 max-md:border-b max-md:border-primary max-md:pb-5">
        <div className="contact-header">
          {section.eyebrow ? (
            <p className="contact-subheading mb-1 text-base font-medium text-gray-600">{section.eyebrow}</p>
          ) : null}
          {section.heading ? (
            <h2 className="contact-heading mb-3 text-5xl font-bold leading-tight max-lg:text-4xl max-md:text-[32px]">
              {section.heading}
            </h2>
          ) : null}
          {section.body ? (
            <p className="contact-description max-w-[530px] text-lg font-medium leading-7 text-gray-600 max-lg:text-[17px] max-lg:leading-[26px] max-md:max-w-none max-md:text-sm max-md:leading-6">
              {section.body}
            </p>
          ) : null}
        </div>

        {links.length > 0 ? (
          <div className="contact-social mt-auto">
            <h3 className="contact-social-heading mb-3 text-base font-bold max-md:text-lg">Follow us on</h3>
            <div className="contact-social-links flex items-center gap-8 max-md:gap-6">
              {links.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  className="social-link h-8 w-8 transition-opacity hover:opacity-80 max-md:h-6 max-md:w-6"
                  aria-label={link.label || link.platform}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={SOCIAL_ICONS[link.platform]}
                    alt=""
                    width={32}
                    height={32}
                    unoptimized
                    className="h-full w-full object-contain"
                  />
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="contact-form-wrapper w-full">
        <form className="contact-form flex flex-col gap-5 max-md:gap-3" id="contactForm">
          <div className="form-group">
            <label htmlFor="fullName" className="form-label text-base font-medium max-md:text-sm">
              Full Name
            </label>
            <input type="text" id="fullName" name="fullName" className={inputClass} placeholder="John doe" required />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label text-base font-medium max-md:text-sm">
              Email address
            </label>
            <input type="email" id="email" name="email" className={inputClass} placeholder="example@gmail.com" required />
          </div>

          <div className="form-group">
            <label htmlFor="message" className="form-label text-base font-medium max-md:text-sm">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              className={`${inputClass} form-textarea min-h-[200px] resize-none`}
              placeholder="Abimbola"
              rows={6}
              required
            />
          </div>

          <button
            type="submit"
            className="form-submit-btn w-full cursor-pointer rounded-full border-0 bg-primary px-8 py-4 font-sans text-lg font-medium text-white transition-colors hover:bg-primary-400 max-lg:px-7 max-lg:py-3.5 max-lg:text-[17px] max-md:text-base"
          >
            Send message
          </button>
        </form>
      </div>
    </section>
  );
}
