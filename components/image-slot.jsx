'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { imageAlt, isVectorImage } from '@/lib/media';

const CARD_FAN = [
  { rotate: -5, z: 30 },
  { rotate: -21, z: 20 },
  { rotate: 12, z: 10 },
];

const SHUFFLE_INTERVAL_MS = 2000;

function SingleImage({ img, priority }) {
  return (
    <div className="relative mx-auto w-full max-w-[300px] overflow-hidden rounded-2xl shadow-lg ring-1 max-md:max-w-[88%] aspect-[4/5]">
      <Image
        src={img.url}
        alt={imageAlt(img)}
        fill
        className="object-cover object-center"
        sizes="(max-width: 1024px) 88vw, 300px"
        priority={priority}
        unoptimized={isVectorImage(img)}
      />
    </div>
  );
}

function FanImages({ images }) {
  const [zStackShift, setZStackShift] = useState(0);

  const n = images.length;

  useEffect(() => {
    if (n < 2) return undefined;

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return undefined;

    const intervalId = window.setInterval(() => {
      setZStackShift((s) => (s + 1) % n);
    }, SHUFFLE_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [n]);

  return (
    <div className="relative lg:ms-auto h-[min(440px,72vw)] w-full max-w-[420px] max-md:mb-4 flex items-center justify-center">
      {images.map((img, slotIndex) => {
        const fan = CARD_FAN[slotIndex % CARD_FAN.length];
        const zTier = CARD_FAN[(slotIndex + zStackShift) % n];

        return (
          <div
            key={slotIndex}
            className="absolute right-[50px] top-0 w-[82%] max-w-[300px] overflow-hidden rounded-2xl shadow-lg shadow-gray-800/50 max-md:w-[88%] aspect-[4/5]"
            style={{
              zIndex: zTier.z,
              transform: `rotate(${fan.rotate}deg)`,
            }}
          >
            <Image
              src={img.url}
              alt={imageAlt(img)}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 72vw, 300px"
              priority={slotIndex === 0}
              unoptimized={isVectorImage(img)}
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
            src={img.url}
            alt={imageAlt(img)}
            fill
            className="object-cover object-center"
            sizes="(max-width: 640px) 45vw, 180px"
            priority={index < 3}
            unoptimized={isVectorImage(img)}
          />
        </div>
      ))}
    </div>
  );
}

// layout is also a prop, and it can be noImage, singleImage, fanImages, or galleryGrid
export function ImageSlot({ images, priority }) {
  const imgArray = Array.isArray(images) ? images.filter((img) => Boolean(img?.url)) : [];

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
