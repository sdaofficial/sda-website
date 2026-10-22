import Image from 'next/image';
import { imageAlt, isVectorImage } from '@/lib/media';

function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}

const themeShell = {
  light: 'bg-white text-gray-900',
  dark: 'bg-gray-900 text-gray-50',
  gray: 'bg-gray-50 text-gray-900',
};

const cardShell = {
  light: 'bg-gray-50',
  dark: 'bg-gray-800',
  gray: 'bg-white',
};

const labelClass = {
  light: 'text-gray-900',
  dark: 'text-gray-100',
  gray: 'text-gray-900',
};

const textOnlyClass = {
  light: 'text-gray-900',
  dark: 'text-gray-200',
  gray: 'text-gray-900',
};

function PartnerLogoCard({ item, theme, delay = 0 }) {
  return (
    <div data-anim="pop" style={{ '--d': `${delay}ms` }} className="flex min-w-[150px] flex-col items-center gap-2.5">
      <div
        className={cn(
          'flex flex-col w-full h-full gap-2 items-center justify-center rounded-xl px-3 py-4 max-md:h-[88px]',
          cardShell[theme] ?? cardShell.light,
        )}
      >
        <div className="flex w-full flex-1 items-center justify-center">
          <Image
            src={item.image.url}
            alt={imageAlt(item.image, item?.name)}
            width={140}
            height={72}
            className="max-h-[52px] w-auto max-w-full object-contain max-md:max-h-[44px]"
            sizes="(max-width: 768px) 140px, 160px"
            unoptimized={isVectorImage(item.image)}
          />
        </div>

        <p
          className={cn(
            'w-full text-center text-xs font-medium leading-snug max-md:text-[11px]',
            labelClass[theme] ?? labelClass.light,
          )}
        >
          {item?.name}
        </p>
      </div>
    </div>
  );
}

export function PartnershipsSection({ section }) {
  const raw = (section?.partnerships ?? []).filter(Boolean);
  const withImage = raw.filter((item) => Boolean(item?.image?.url));
  const textOnly = raw.filter((item) => !item?.image?.url && item?.name?.trim());

  const theme = section?.theme === 'dark' || section?.theme === 'gray' ? section.theme : 'light';
  const heading = section?.heading?.trim() ?? 'Partnerships';
  const headingId =
    section?.internalName != null && String(section.internalName).trim()
      ? `partnerships-heading-${String(section.internalName).replace(/\s+/g, '-')}`
      : 'partnerships-heading';

  if (raw.length === 0) {
    return null;
  }

  return (
    <section
      className={cn(
        'section partnerships-section border-b border-gray-200 py-16 max-lg:py-14 max-md:py-12',
        themeShell[theme] ?? themeShell.light,
      )}
      aria-labelledby={headingId}
      data-section="partnerships"
      data-motion="partnerships"
    >
      <div className="mx-auto w-full max-w-[1100px]">
        <header data-anim="rise" className="mb-12 text-center max-md:mb-10">
          <h2
            id={headingId}
            className={cn(
              'relative mx-auto inline-block text-3xl font-bold tracking-tight max-md:text-2xl md:text-4xl',
              theme === 'dark' ? 'text-gray-50' : 'text-gray-900',
            )}
          >
            {heading}
          </h2>
        </header>

        {withImage.length > 0 && (
          <div className="mx-auto flex w-full max-w-[1000px] flex-wrap justify-center gap-x-3 gap-y-8">
            {withImage.map((item, i) => (
              <PartnerLogoCard
                key={i}
                item={item}
                theme={theme}
                delay={80 + i * 70}
              />
            ))}
          </div>
        )}

        {textOnly.length > 0 ? (
          <ul
            className={cn(
              'mx-auto mt-10 flex max-w-[720px] list-none flex-col gap-4 border-t border-gray-200/80 pt-10 text-center text-sm font-semibold uppercase leading-snug tracking-wide max-md:mt-8 max-md:gap-3 max-md:pt-8 max-md:text-xs',
              theme === 'dark' && 'border-gray-600/80',
            )}
          >
            {textOnly.map((item, i) => (
              <li
                key={`${item.name}-${i}`}
                data-anim="rise"
                style={{ '--d': `${i * 80}ms` }}
                className={textOnlyClass[theme] ?? textOnlyClass.light}
              >
                {item.name.trim()}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

export default PartnershipsSection;
