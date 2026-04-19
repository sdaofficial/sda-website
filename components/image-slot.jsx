import Image from 'next/image';

const CARD_FAN = [
  { rotate: -5, z: 30 },
  { rotate: -21, z: 20 },
  { rotate: 12, z: 10 },
];

function SingleImage({ img, priority }) {
  return (
    <div className="relative mx-auto w-full max-w-[300px] overflow-hidden rounded-2xl shadow-lg ring-1 max-md:max-w-[88%] aspect-[4/5]">
      <Image
        src={img?.url}
        alt={img?.description}
        fill
        className="object-cover object-center"
        sizes="(max-width: 1024px) 88vw, 300px"
        priority={priority}
      />
    </div>
  );
}

function FanImages({ images }) {
  return (
    <div className="relative mx-auto h-[min(440px,72vw)] w-full max-w-[420px] max-md:mb-4 flex items-center justify-center">
      {images.map((img, index) => {
        const fan = CARD_FAN[index % CARD_FAN?.length];

        return (
          <div
            key={`${img?.url}-${index}`}
            className="absolute right-[50px] top-0 w-[82%] max-w-[300px] overflow-hidden rounded-2xl shadow-lg ring-1 max-md:w-[88%] aspect-[4/5] -translate-x-[50%]"
            style={{
              zIndex: fan.z,
              transform: `rotate(${fan.rotate}deg)`,
            }}
          >
            <Image
              src={img?.url}
              alt={img?.description}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 72vw, 300px"
              priority={index === 0}
            />
          </div>
        );
      })}
    </div>
  );
}

// This has not been tested yet
function GalleryGrid({ images }) {
  return (
    <div className="mx-auto grid w-full max-w-[520px] grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3 max-md:mb-4">
      {images.map((img, index) => (
        <div
          key={`${img?.url}-${index}`}
          className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white shadow-md ring-1"
        >
          <Image
            src={img?.url}
            alt={img?.description}
            fill
            className="object-cover object-center"
            sizes="(max-width: 640px) 45vw, 180px"
            priority={index < 3}
          />
        </div>
      ))}
    </div>
  );
}

// layout is also a prop, and it can be noImage, singleImage, fanImages, or galleryGrid
export function ImageSlot({ images, priority }) {
  const imgArray = Array.isArray(images)
    ? images?.filter((img) => Boolean(img?.url))
    : [];

  switch (imgArray?.length) {
    case 0:
      return null;
    case 1:
      return <SingleImage img={imgArray[0]} priority={priority} />;
    case 2:
    case 3:
      return <FanImages images={imgArray} />;
    default:
      return <GalleryGrid images={imgArray} />;
  }
}
