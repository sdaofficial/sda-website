import Image from 'next/image';
import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="footer bg-gray-900 px-20 pb-6 pt-[60px] text-gray-50 max-lg:px-6 max-lg:pb-5 max-lg:pt-10">
      <div className="footer-main mb-0 grid grid-cols-[1fr_3fr_1fr] items-center gap-10 max-lg:mb-8 max-lg:grid-cols-1 max-lg:gap-8">
        <div className="footer-logo flex max-lg:justify-start">
          <Link
            href="/"
            className="flex flex-col items-start gap-2 no-underline transition-[filter] hover:brightness-105"
          >
            <Image
              src="/sda-logo.svg"
              alt="SDA Logo"
              width={200}
              height={100}
              unoptimized
              className="h-[100px] w-auto rounded-full max-lg:h-20"
            />
            <span className="logo-text text-xl font-medium leading-6 text-gray-50 max-lg:text-base">
              SUSTAINABLE <br />
              DEVELOPMENT ADVOCATE
            </span>
          </Link>
        </div>

        <nav className="footer-nav-links flex flex-wrap items-center justify-center gap-10 max-lg:flex-col max-lg:items-start max-lg:gap-3">
          <Link
            href="/join-us"
            className="text-lg font-medium text-gray-50 no-underline transition-colors visited:text-gray-50 hover:text-primary-300 max-lg:font-normal"
          >
            Get involved
          </Link>
          <Link
            href="/#contact"
            className="text-lg font-medium text-gray-50 no-underline transition-colors visited:text-gray-50 hover:text-primary-300 max-lg:font-normal"
          >
            Contact Us
          </Link>
        </nav>

        <div className="footer-social relative flex flex-col items-start gap-4">
          <div className="footer-social-cta relative flex flex-col gap-4 max-lg:flex-row max-lg:items-center max-lg:gap-2">
            <Image
              src="/images/icons/curly-arrow.svg"
              alt=""
              width={80}
              height={64}
              unoptimized
              className="footer-arrow pointer-events-none absolute -right-[30px] top-[150%] h-auto w-20 rotate-45 max-lg:left-[150px] max-lg:top-[-20px] max-lg:right-auto max-lg:w-[70px] max-lg:-rotate-45"
            />
            <h3 className="footer-social-heading text-base font-semibold">Follow us on</h3>
          </div>
          <div className="footer-social-links flex items-center gap-6">
            <a
              href="https://instagram.com/sdaunilag"
              className="social-link h-8 w-8 invert transition-[filter] hover:opacity-80"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/images/icons/instagram.svg" alt="" width={32} height={32} unoptimized className="h-full w-full object-cover object-center" />
            </a>
            <a
              href="https://twitter.com/sdaunilag"
              className="social-link h-8 w-8 invert transition-[filter] hover:opacity-80"
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/images/icons/twitter.svg" alt="" width={32} height={32} unoptimized className="h-full w-full object-cover object-center" />
            </a>
            <a
              href="https://www.linkedin.com/company/sdaunilag"
              className="social-link h-8 w-8 invert transition-[filter] hover:opacity-80"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/images/icons/linkedin.svg" alt="" width={32} height={32} unoptimized className="h-full w-full object-cover object-center" />
            </a>
            <a
              href="https://www.youtube.com/@sustainabledevelopmentadvo7259"
              className="social-link h-8 w-8 invert transition-[filter] hover:opacity-80"
              aria-label="YouTube"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/images/icons/youtube.svg" alt="" width={32} height={32} unoptimized className="h-full w-full object-cover object-center" />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-copyright pt-6 text-center max-lg:border-t max-lg:border-primary max-lg:pt-5">
        <p className="text-sm font-medium text-gray-300 max-lg:text-xs">Copyright. 2023</p>
      </div>
    </footer>
  );
}
