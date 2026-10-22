import Image from 'next/image';
import { CmsSections } from '@/components/cms-sections';
import { TeamSection } from '@/components/team-section';

export default function HomePage() {
  return (
    <>
      <CmsSections slug="home" />

      <section id="about" className="section history-section mt-[100px] max-lg:mt-20 max-md:mt-[60px]">
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
    </>
  );
}
