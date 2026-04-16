import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { JoinUsEvents } from '@/components/join-us-events';

export const metadata: Metadata = {
  title: 'Join Us',
  description: 'Become a member of SDA and explore our events at the University of Lagos.',
};

export default function JoinUsPage() {
  const sectionShell =
    'my-[100px] px-20 py-10 max-lg:my-20 max-lg:px-[50px] max-lg:py-[30px] max-md:my-[60px] max-md:px-6 max-md:py-3';

  return (
    <div>
      <section className="relative flex h-[650px] items-center justify-center bg-[url('/images/join-us--hero.png')] bg-cover bg-center bg-no-repeat max-lg:h-[500px]">
        <div className="pointer-events-none absolute inset-0 bg-gray-800-alpha" aria-hidden />
        <div className="relative z-[1] max-w-[768px] px-4 text-center text-white">
          <h1 className="text-[62px] font-bold leading-[1.2] max-lg:text-5xl max-md:text-[2rem]">
            Creating a Difference, <br />
            Experience Change
          </h1>
        </div>
      </section>

      <section className={sectionShell}>
        <div className="grid grid-cols-2 gap-[100px] max-lg:gap-10 max-md:grid-cols-1 max-md:gap-8">
          <div>
            <p className="mb-2 text-lg font-medium text-gray-600">Join us</p>
            <h2 className="mb-2 text-5xl font-bold leading-tight max-lg:text-[40px] max-md:text-[32px]">
              Become a Member of SDA
            </h2>
            <p className="mb-10 max-w-[580px] text-lg leading-7 text-gray-700 max-lg:text-[17px] max-lg:leading-[26px] max-md:mb-10 max-md:text-base max-md:leading-6">
              To join the Sustainable Development Advocate University of Lagos, applicants must demonstrate a commitment
              to sustainable development principles. Basic requirements include being a student of the University of
              Lagos , and completion of the online application form. Applicants are expected to undergo an interim class
              which upon completion would submit essays on various topics outlining their passion for sustainable
              development and their goals within the field. Successful candidates will be selected based on their
              participation during the classes and alignment with the SDA&apos;s mission as communicated in their
              submitted essays.
            </p>
            <a
              href="#"
              className="mt-2 inline-block w-fit rounded-md bg-primary px-10 py-4 text-lg font-bold text-white no-underline transition-colors hover:bg-primary-400 visited:text-white max-md:mx-auto max-md:block max-md:text-center"
            >
              Become a member
            </a>
          </div>
          <div className="relative w-full overflow-hidden aspect-[6/5] max-lg:aspect-square max-md:aspect-[5/3]">
            <Image
              src="/images/home--sda-goals-1.png"
              alt="SDA Community"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      <JoinUsEvents />

      <section className={sectionShell}>
        <div className="grid grid-cols-2 items-center gap-[60px] overflow-hidden rounded-3xl bg-primary-600 text-gray-50 max-lg:grid-cols-1 max-lg:gap-10 max-lg:p-[50px] max-md:grid-cols-1 max-md:gap-8 max-md:p-6">
          <div className="px-[60px] py-5 max-lg:p-0 max-md:p-0">
            <p className="mb-2 text-lg font-medium">Be in contact</p>
            <h2 className="mb-2 text-5xl font-bold leading-tight max-lg:text-[40px] max-md:text-[32px]">
              Creating a Cleaner Environment for All
            </h2>
            <p className="text-lg leading-7 max-lg:text-[17px] max-lg:leading-[26px] max-md:text-base max-md:leading-6">
              Have an question, collaborate or speak further, we are just one click away. Let&apos;s create an healthy
              environment together!!!
            </p>
            <Link
              href="/#contact"
              className="mt-10 inline-block w-fit rounded-lg bg-white px-10 py-4 text-lg font-bold text-primary-600 no-underline transition-colors hover:bg-gray-100 visited:text-primary-600 max-md:mx-auto max-md:mt-4 max-md:block max-md:w-full max-md:px-8 max-md:py-3.5 max-md:text-center max-md:text-base"
            >
              Contact us
            </Link>
          </div>
          <div className="relative h-[600px] max-h-[600px] w-full overflow-hidden max-lg:h-[400px] max-lg:max-h-[400px] max-lg:rounded-lg max-md:h-[300px] max-md:max-h-[300px] max-md:rounded-lg">
            <Image
              src="/images/home--sda-goals-1.png"
              alt="SDA Community"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
