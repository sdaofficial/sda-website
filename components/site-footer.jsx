import Image from 'next/image';
import Link from 'next/link';
import { getSiteFooter, getSocialLinks } from '@/lib/pages';

const SOCIAL_ICONS = {
  instagram: '/images/icons/instagram.svg',
  x: '/images/icons/twitter.svg',
  linkedin: '/images/icons/linkedin.svg',
  youtube: '/images/icons/youtube.svg',
};

function FooterLink({ href, className, children }) {
  if (href.startsWith('/')) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export async function SiteFooter() {
  const [footer, socials] = await Promise.all([getSiteFooter(), getSocialLinks()]);
  const links = socials.filter((link) => SOCIAL_ICONS[link.platform] && link.url);
  const navClass =
    'text-base font-medium text-gray-100 no-underline transition-colors visited:text-gray-100 hover:text-primary max-md:text-sm';

  return (
    <footer className="footer relative overflow-hidden bg-gray-900 px-20 pb-8 pt-16 text-gray-50 max-lg:px-10 max-lg:pt-12 max-md:px-6 max-md:pb-6 max-md:pt-10">
      <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(140px,0.7fr)_minmax(0,1.15fr)] items-stretch gap-x-16 gap-y-12 max-lg:gap-x-10 max-md:grid-cols-1 max-md:gap-10">
        <div className="flex h-full flex-col">
          <Link href="/" className="flex items-center gap-4 no-underline">
            <Image
              src="/sda-logo.svg"
              alt="SDA Logo"
              width={112}
              height={112}
              unoptimized
              className="h-24 w-24 shrink-0 max-md:h-20 max-md:w-20"
            />
            <span className="text-base font-medium uppercase leading-5 tracking-wide text-gray-50 max-md:text-sm">
              Sustainable
              <br />
              Development
              <br />
              Advocates
            </span>
          </Link>

          <p className="mt-8 max-w-[340px] text-sm font-medium leading-6 text-gray-300 max-md:max-w-none">{footer.blurb}</p>

          <div className="mt-auto flex items-center gap-6 pt-10">
            {links.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                className="social-link h-6 w-6 invert transition-opacity hover:opacity-80"
                aria-label={link.label || link.platform}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={SOCIAL_ICONS[link.platform]}
                  alt=""
                  width={24}
                  height={24}
                  unoptimized
                  className="h-full w-full object-contain"
                />
              </a>
            ))}
          </div>
        </div>

        <nav className="flex flex-col justify-between gap-6 py-1 max-md:gap-4">
          {footer.links.map((link) => (
            <FooterLink key={`${link.label}-${link.url}`} href={link.url} className={navClass}>
              {link.label}
            </FooterLink>
          ))}
        </nav>

        <div className="flex flex-col justify-between gap-6 max-md:gap-5">
          {footer.details.map((detail) => (
            <div key={`${detail.label}-${detail.body}`}>
              <h2 className="text-sm font-bold text-primary">{detail.label}</h2>
              <p className="mt-1 whitespace-pre-line text-sm font-medium leading-6 text-gray-100">{detail.body}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-14 text-center text-sm text-gray-400 max-md:mt-10 max-md:text-xs">{footer.copyright}</p>

      <Image
        src="/images/icons/curly-arrow.svg"
        alt=""
        width={111}
        height={55}
        unoptimized
        className="pointer-events-none absolute -left-14 bottom-1 h-auto w-[120px] rotate-[140deg] max-md:hidden"
      />
    </footer>
  );
}
