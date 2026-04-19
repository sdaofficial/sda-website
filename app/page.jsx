import Image from 'next/image';
import { PageSectionBlock } from '@/components/page-section-block';
import { TeamSection } from '@/components/team-section';
import { getPageById } from '@/lib/contentful';

const HOME_PAGE_ENTRY_ID = '617p1qDzJLE2ZQt4KkQeYd';

export default async function HomePage() {
  const pageById = await getPageById(HOME_PAGE_ENTRY_ID);
  const sectionItems = pageById?.pageSectionsCollection?.items?.filter(Boolean) ?? [];
  const heroSection =
    sectionItems.find((s) =>
      /hero|split|intro|imageright|imageleft|imagetop|imagebottom|noimage/i.test(s.sectionLayout ?? '')
    ) ?? sectionItems[0];

  return (
    <>
      <PageSectionBlock section={heroSection} />

      <section className="section history-section mt-[100px] max-lg:mt-20 max-md:mt-[60px]">
        <div className="history-ctn grid grid-cols-2 items-start gap-8 max-lg:gap-7 max-md:grid-cols-1 max-md:gap-5">
          <div className="history-header">
            <p className="history-subheading mb-2 text-lg font-medium text-gray-600">Our history</p>
            <h2 className="history-heading text-5xl font-bold leading-tight max-lg:text-4xl max-md:text-[2rem]">
              Uniting Youth for Sustainable Development with SDA.
            </h2>
          </div>
          <div className="history-content ml-auto max-w-[580px] max-md:ml-0">
            <p className="text-lg leading-6 text-gray-700 max-lg:text-base max-lg:leading-[22px]">
              We are an organization dedicated to raising awareness for the Sustainable Development Goals (SDGs). While
              we leverage global expertise to shape our organizational framework, our projects are implemented with a local
              focus, emphasizing direct engagement with both rural and urban communities. As a dynamic force dedicated to
              driving positive impact, SDA proudly leads the charge in youth-led initiatives, placing the banner of
              sustainable development at the forefront of our endeavors.
            </p>
          </div>
          <div className="history-image relative col-span-2 mt-5 h-[450px] w-full overflow-hidden max-md:col-span-1 max-lg:h-[380px] max-md:h-[300px]">
            <Image
              src="/images/home--history.png"
              alt="SDA History"
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      <section className="section quote-section my-[60px] max-lg:my-[60px] max-md:my-10">
        <div className="quote-ctn relative mx-auto max-w-[700px] px-4 py-3 text-center max-lg:max-w-[600px] max-lg:px-10 max-md:px-3">
          <span className="quote-mark quote-mark-top pointer-events-none absolute left-[-32px] top-[26px] text-[124px] font-bold text-gray-800-alpha select-none max-md:left-[-10px] max-md:top-4 max-md:text-[100px]">
            &ldquo;
          </span>
          <blockquote className="quote-text">
            <p className="text-lg font-medium leading-7 max-lg:text-base max-lg:leading-[26px] max-md:text-sm max-md:leading-5">
              At our core lies a mission that pulses with purpose — to illuminate the path towards Sustainable
              Development Goals (SDGs) and actively contribute to their realization. We champion the potency of youth
              inclusiveness, capacity building, and the cultivation of job innovators poised to steer progress across the
              5 P&apos;s of SDGs: People, Planet, Prosperity, Peace, and Partnership.
            </p>
          </blockquote>
          <span className="quote-mark quote-mark-bottom pointer-events-none absolute bottom-3 right-10 rotate-180 text-[124px] font-bold text-gray-800-alpha select-none max-md:bottom-2.5 max-md:right-5 max-md:text-[100px]">
            &ldquo;
          </span>
        </div>
      </section>

      <section className="section goals-section my-[60px] max-lg:my-[50px] max-md:my-10">
        <div className="goals-ctn grid grid-cols-2 items-center gap-x-6 gap-y-[60px] max-lg:gap-x-5 max-lg:gap-y-[50px] max-md:grid-cols-1 max-md:gap-6">
          <div className="goals-header col-start-1 max-md:col-span-1">
            <h2 className="goals-heading text-[120px] font-bold leading-none text-gray-800-alpha max-lg:text-[100px] max-md:mb-2.5 max-md:text-[56px]">
              SDA Goals
            </h2>
          </div>
          <div className="goals-content col-start-2 max-md:col-span-1 max-md:col-start-1">
            <p className="text-lg font-medium leading-6 text-gray-600 max-lg:text-base max-lg:leading-[22px]">
              To create awareness about the Sustainable Development Goals. Advancing the SDGs through youth inclusivity,
              sensitization and implementation of social projects. To ensure that no one is left behind on the 5 P&apos;s
              of SDGs: People, Planet, Prosperity, Peace and Partnership.
            </p>
          </div>
          <div className="goals-image goals-image-left relative col-start-1 aspect-[5/3] h-full overflow-hidden max-md:col-span-1 max-md:h-auto max-md:max-w-full">
            <Image
              src="/images/home--sda-goals-1.png"
              alt="SDA Goals"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
          <div className="goals-image goals-image-right relative col-start-2 aspect-[5/3] h-full overflow-hidden max-md:col-span-1">
            <Image
              src="/images/home--sda-goals-1.png"
              alt="SDA Goals"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      <section className="staff-adviser-section relative bg-gray-900 px-10 pb-0 pt-[100px] text-center text-gray-50 max-lg:px-10 max-lg:pt-20 max-md:px-6 max-md:pt-[60px]">
        <div className="staff-adviser-ctn relative z-[2] mx-auto max-w-[860px]">
          <h2 className="staff-adviser-heading mb-10 text-5xl font-bold max-lg:mb-8 max-lg:text-4xl max-md:mb-6 max-md:text-[32px] max-md:leading-[130%]">
            A Message From the Staff Adviser
          </h2>
          <div className="staff-adviser-image relative mx-auto mb-8 h-[200px] w-[200px] overflow-hidden rounded-full border-2 border-gray-50 max-lg:mb-7 max-lg:h-[180px] max-lg:w-[180px] max-md:mb-5 max-md:h-[150px] max-md:w-[150px]">
            <Image
              src="/images/people/prof-james-akanmu.jpg"
              alt="Prof James Akanmu"
              fill
              sizes="200px"
              className="object-cover object-center"
            />
          </div>
          <p className="staff-adviser-name mb-2 text-2xl font-bold max-md:mb-0.5 max-md:text-lg">Prof James Akanmu, PhD, FNSE</p>
          <p className="staff-adviser-title text-lg font-medium max-md:text-sm">Staff Adviser Sustainable Development Advocates</p>
          <div className="staff-adviser-banner mt-10 rounded-t-[42px] border-2 border-b-0 border-gray-400 bg-gray-300-alpha px-6 pb-10 pt-[60px] max-lg:mt-8 max-lg:px-5 max-lg:pb-8 max-lg:pt-[50px] max-md:mt-[30px] max-md:rounded-t-[20px] max-md:px-3 max-md:py-8">
            <p className="text-xl leading-8 max-lg:text-lg max-lg:leading-7 max-md:text-sm max-md:leading-5">
              My Dear Sustainable Development Advocates, <br />
              I am Professor James Akanmu, PhD, FNSE, and I am honored to serve as the Staff Adviser to this esteemed
              organization. SDA plays a vital role in our university community, aligning itself with the United
              Nations&apos; Sustainable Development Goals (SDGs) to drive positive change both on campus and beyond. SDA
              offers its members a way to contribute to society, our diverse teams tackle various SDGs through impactful
              projects- (a link to the club activities section). These projects inspire and empower individuals and
              communities to make informed decisions that contribute to tangible progress towards achieving the SDGs. I
              encourage each member to actively participate in the organization and not waste the opportunities provided
              so we can all work to the shared vision of a more sustainable world.
            </p>
            <p className="mt-8 text-xl leading-8 max-lg:mt-8 max-lg:text-lg max-lg:leading-7 max-md:mt-0 max-md:text-sm max-md:leading-5">
              This webpage serves as a central hub for information, resources, and updates on our activities. Here, you will
              find opportunities to get involved, learn more about sustainability issues, and connect with like-minded
              individuals who share your passion for creating a better world. <br />
              Explore our webpage, engage with our content, and join us in our mission to champion sustainability in all
              its forms. Remember, active participation can be balanced with your academic pursuits. Together, we can make
              a real difference on both the University campus and beyond.
            </p>
          </div>
        </div>
        <Image
          src="/images/icons/zap-1.svg"
          alt=""
          width={100}
          height={100}
          unoptimized
          className="zap-icon zap-icon-left pointer-events-none absolute bottom-[25%] left-[5%] z-[1] w-[100px] -translate-y-1/2 max-lg:w-20 max-md:bottom-auto max-md:left-4 max-md:top-[300px] max-md:h-10 max-md:w-[60px] max-md:translate-y-0"
        />
        <Image
          src="/images/icons/zap-1.svg"
          alt=""
          width={100}
          height={100}
          unoptimized
          className="zap-icon zap-icon-right pointer-events-none absolute right-[5%] top-1/2 z-[1] w-[100px] -translate-y-1/2 max-lg:w-20 max-md:right-4 max-md:top-[150px] max-md:h-10 max-md:w-[60px]"
        />
      </section>

      <TeamSection />

      <section className="community-section bg-gray-900 px-10 pb-10 pt-[100px] text-center text-gray-100 max-lg:px-[50px] max-lg:pb-10 max-lg:pt-20 max-md:px-6 max-md:pb-5 max-md:pt-[60px]">
        <div className="community-content mx-auto max-w-[810px]">
          <p className="community-subheading mb-2 text-base font-medium">Our community</p>
          <h2 className="community-heading mb-3 text-5xl font-bold leading-[1.15] text-gray-50 max-lg:text-4xl max-md:text-[32px]">
            Ready to Become a Part of <br />
            our Vibrant Community?
          </h2>
          <p className="community-description mx-auto text-lg leading-7 text-gray-100 max-lg:text-[17px] max-lg:leading-[26px] max-md:text-sm max-md:leading-5">
            Join our passionate cleaning community today and together let&apos;s make the world cleaner and brighter, one
            step at a time. Your enthusiasm and insights are welcome here. Let&apos;s make the world shine together.
          </p>

          <div className="community-cta relative my-8 max-md:my-8 max-md:flex max-md:flex-col max-md:gap-3">
            <Image
              src="/images/icons/curly-arrow.svg"
              alt=""
              width={100}
              height={80}
              unoptimized
              className="community-arrow pointer-events-none absolute -top-8 left-[65%] h-auto w-[100px] max-md:-top-4 max-md:left-[70%] max-md:w-[60px]"
            />
            <a
              className="community-btn inline-block rounded-md bg-primary px-10 py-4 text-lg font-bold text-white no-underline transition-colors visited:text-white hover:bg-primary-400 max-lg:px-9 max-lg:py-3.5 max-lg:text-base max-md:px-8 max-md:py-3.5 max-md:text-sm"
              href="#"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Now
            </a>
          </div>
        </div>

        <div className="community-image-wrapper relative mx-auto max-w-[1200px] overflow-hidden after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[150px] after:bg-gradient-to-t after:from-gray-900 after:to-transparent max-md:after:h-[120px]">
          <Image
            src="/images/home--community.png"
            alt="SDA Community"
            width={1200}
            height={675}
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="community-image block h-auto w-full object-cover object-center"
          />
        </div>
      </section>

      <section className="contact-section grid grid-cols-2 items-start gap-[120px] px-20 py-[100px] text-gray-900 max-lg:gap-20 max-lg:px-[50px] max-lg:py-20 max-md:grid-cols-1 max-md:gap-5 max-md:px-6 max-md:pb-6 max-md:pt-10">
        <div className="contact-info flex h-full flex-col justify-between max-md:gap-10 max-md:border-b max-md:border-primary max-md:pb-5">
          <div className="contact-header mb-auto">
            <p className="contact-subheading mb-1 text-base font-medium text-gray-600">Be in contact</p>
            <h2 className="contact-heading mb-3 text-5xl font-bold leading-tight max-lg:text-4xl max-md:text-[32px]">Reach Out</h2>
            <p className="contact-description max-w-[530px] text-lg font-medium leading-7 text-gray-600 max-lg:text-[17px] max-lg:leading-[26px] max-md:max-w-none max-md:text-sm max-md:leading-6">
              Have an question, collaborate or speak further, we are just one click away. Let&apos;s create an healthy
              environment together!!!
            </p>
          </div>

          <div className="contact-social my-auto mb-20 max-md:mb-0">
            <h3 className="contact-social-heading mb-3 text-base font-bold max-md:text-lg">Follow us on</h3>
            <div className="contact-social-links flex items-center gap-8 max-md:gap-6">
              <a
                href="https://instagram.com/sdaunilag"
                className="social-link h-8 w-8 transition-[filter] hover:opacity-80 max-md:h-6 max-md:w-6"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src="/images/icons/instagram.svg" alt="" width={32} height={32} unoptimized className="h-full w-full object-cover object-center" />
              </a>
              <a
                href="https://twitter.com/sdaunilag"
                className="social-link h-8 w-8 transition-[filter] hover:opacity-80 max-md:h-6 max-md:w-6"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src="/images/icons/twitter.svg" alt="" width={32} height={32} unoptimized className="h-full w-full object-cover object-center" />
              </a>
              <a
                href="https://www.linkedin.com/company/sdaunilag"
                className="social-link h-8 w-8 transition-[filter] hover:opacity-80 max-md:h-6 max-md:w-6"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src="/images/icons/linkedin.svg" alt="" width={32} height={32} unoptimized className="h-full w-full object-cover object-center" />
              </a>
              <a
                href="https://www.youtube.com/@sustainabledevelopmentadvo7259"
                className="social-link h-8 w-8 transition-[filter] hover:opacity-80 max-md:h-6 max-md:w-6"
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src="/images/icons/youtube.svg" alt="" width={32} height={32} unoptimized className="h-full w-full object-cover object-center" />
              </a>
            </div>
          </div>
        </div>

        <div className="contact-form-wrapper w-full">
          <form className="contact-form flex flex-col gap-5 max-md:gap-3" id="contactForm">
            <div className="form-group">
              <label htmlFor="fullName" className="form-label text-base font-medium max-md:text-sm">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="form-input mt-1 w-full rounded border border-gray-200 px-3 py-3.5 font-sans text-base text-gray-900 transition-colors placeholder:text-gray-400 focus:border-primary-400 focus:outline-none max-lg:px-3 max-lg:py-3 max-lg:text-[15px] max-md:text-sm"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label text-base font-medium max-md:text-sm">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input mt-1 w-full rounded border border-gray-200 px-3 py-3.5 font-sans text-base text-gray-900 transition-colors placeholder:text-gray-400 focus:border-primary-400 focus:outline-none max-lg:px-3 max-lg:py-3 max-lg:text-[15px] max-md:text-sm"
                placeholder="example@gmail.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message" className="form-label text-base font-medium max-md:text-sm">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                className="form-textarea mt-1 min-h-[200px] w-full resize-none rounded border border-gray-200 px-3 py-3.5 font-sans text-base text-gray-900 transition-colors placeholder:text-gray-400 focus:border-primary-400 focus:outline-none max-lg:px-3 max-lg:py-3 max-lg:text-[15px] max-md:text-sm"
                placeholder="Abimbola"
                rows={6}
                required
              />
            </div>

            <button
              type="submit"
              className="form-submit-btn w-full cursor-pointer rounded-lg border-0 bg-primary px-8 py-4 font-sans text-lg font-medium text-gray-50 transition-colors hover:bg-primary-400 max-lg:px-7 max-lg:py-3.5 max-lg:text-[17px] max-md:text-base"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
