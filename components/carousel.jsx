'use client';

import Image from 'next/image';
import {
  Children,
  cloneElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}

const carouselNavButtonClass =
  'z-10 border border-gray-300 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-transparent transition-all hover:bg-primary-500-alpha focus:outline-none disabled:cursor-not-allowed disabled:opacity-50';

const trackBase =
  'flex w-full flex-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden *:w-[calc(100%/2)] *:shrink-0 *:grow';

export function Carousel({
  children,
  visibleItemsCount = 1,
  isInfinite,
  withIndicator,
  /** Second row: same slides as the top in reverse order; translates opposite when navigating. */
  dualReverseRow = false,
}) {
  const indicatorContainerRef = useRef(null);
  const [timeoutInProgress, setTimeoutInProgress] = useState(false);

  const originalItemsLength = useMemo(
    () => Children.count(children),
    [children],
  );

  const isRepeating = useMemo(
    () => isInfinite && Children.count(children) > visibleItemsCount,
    [children, isInfinite, visibleItemsCount],
  );

  const [currentIndex, setCurrentIndex] = useState(
    isRepeating ? visibleItemsCount : 0,
  );
  const [isTransitionEnabled, setTransitionEnabled] = useState(true);
  const [touchPosition, setTouchPosition] = useState(null);

  useEffect(() => {
    if (isRepeating) {
      if (
        currentIndex === visibleItemsCount ||
        currentIndex === originalItemsLength
      ) {
        setTransitionEnabled(true);
      }
    }
  }, [currentIndex, isRepeating, visibleItemsCount, originalItemsLength]);

  useEffect(() => {
    if (withIndicator) {
      const active = indicatorContainerRef.current?.querySelector(
        '[data-carousel-active]',
      );
      if (active) {
        const index = active.getAttribute('data-index');
        if (index !== null && indicatorContainerRef.current?.scrollTo) {
          indicatorContainerRef.current.scrollTo({
            left: ((Number(index) - 2) / 5) * 50,
            behavior: 'smooth',
          });
        }
      }
    }
  }, [withIndicator, currentIndex]);

  const nextItem = () => {
    if (currentIndex > originalItemsLength) {
      setTimeoutInProgress(true);
    }
    if (
      isRepeating ||
      currentIndex < originalItemsLength - visibleItemsCount
    ) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const previousItem = () => {
    const isOnEdgeBack = isRepeating
      ? currentIndex <= visibleItemsCount
      : currentIndex === 0;

    if (isOnEdgeBack) {
      setTimeoutInProgress(true);
    }

    if (isRepeating || currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleTouchStart = (e) => {
    setTouchPosition(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    const touchDown = touchPosition;
    if (touchDown === null) {
      return;
    }
    const currentTouch = e.touches[0].clientX;
    const diff = touchDown - currentTouch;

    if (diff > 5) {
      nextItem();
    } else if (diff < -5) {
      previousItem();
    }
    setTouchPosition(null);
  };

  const handleTransitionEnd = () => {
    if (isRepeating) {
      if (currentIndex === 0) {
        setTransitionEnabled(false);
        setCurrentIndex(originalItemsLength);
      } else if (currentIndex === originalItemsLength + visibleItemsCount) {
        setTransitionEnabled(false);
        setCurrentIndex(visibleItemsCount);
      }
    }
    setTimeoutInProgress(false);
  };

  const extraPreviousItems = useMemo(() => {
    const output = [];
    for (let i = 0; i < visibleItemsCount; i += 1) {
      output.push(Children.toArray(children)[originalItemsLength - 1 - i]);
    }
    return output.reverse();
  }, [children, originalItemsLength, visibleItemsCount]);

  const extraNextItems = useMemo(() => {
    const output = [];
    for (let i = 0; i < visibleItemsCount; i += 1) {
      output.push(Children.toArray(children)[i]);
    }
    return output;
  }, [children, visibleItemsCount]);

  const bottomReversedTrack = useMemo(() => {
    if (!dualReverseRow) {
      return null;
    }
    const seq = [];
    if (isRepeating) {
      seq.push(...extraPreviousItems);
    }
    seq.push(...Children.toArray(children));
    if (isRepeating) {
      seq.push(...extraNextItems);
    }
    return [...seq]
      .reverse()
      .map((el, i) => cloneElement(el, { key: `dual-row-${i}` }));
  }, [
    dualReverseRow,
    children,
    isRepeating,
    extraPreviousItems,
    extraNextItems,
  ]);

  /** Must match the number of slides on the top track (including infinite clones). */
  const totalSlides = useMemo(() => {
    let n = originalItemsLength;
    if (isRepeating) {
      n += 2 * visibleItemsCount;
    }
    return n;
  }, [originalItemsLength, isRepeating, visibleItemsCount]);

  const slideStepPercent = 100 / visibleItemsCount;

  const renderDots = useMemo(() => {
    const localShow = isRepeating ? visibleItemsCount : 0;
    const localLength = isRepeating
      ? originalItemsLength
      : Math.ceil(originalItemsLength / visibleItemsCount);
    const calculatedActiveIndex =
      currentIndex - localShow < 0
        ? originalItemsLength + (currentIndex - localShow)
        : currentIndex - localShow;

    const out = [];
    for (let index = 0; index < localLength; index += 1) {
      let variant;
      if (calculatedActiveIndex === index) {
        variant = 'active';
      } else if (calculatedActiveIndex === 0) {
        variant = calculatedActiveIndex + index <= 2 ? 'close' : 'far';
      } else if (calculatedActiveIndex === localLength - 1) {
        variant = Math.abs(calculatedActiveIndex - index) <= 2 ? 'close' : 'far';
      } else {
        variant =
          Math.abs(calculatedActiveIndex - index) === 1 ? 'close' : 'far';
      }
      out.push(
        <div
          key={index}
          data-index={index}
          data-carousel-active={variant === 'active' ? '' : undefined}
          className={cn(
            'ml-1.5 first:ml-0 rounded-xl transition-all duration-[250ms] ease-linear',
            variant === 'active' && 'h-1.5 w-3 shrink-0 grow bg-black/60',
            variant === 'close' && 'h-1.5 w-1.5 shrink-0 grow bg-black/20',
            variant === 'far' && 'mb-0.5 mt-0.5 h-1 w-1 shrink-0 grow bg-black/20',
          )}
        />,
      );
    }
    return out;
  }, [currentIndex, isRepeating, originalItemsLength, visibleItemsCount]);

  const topTransform = `translateX(-${currentIndex * slideStepPercent}%)`;
  /**
   * Reversed row: use negative translate like the top (percent of track width).
   * A mirrored index makes the bottom move opposite to the top when currentIndex changes.
   * Positive translateX(%) moved the strip by its own width and hid the row (esp. with infinite start index).
   */
  const bottomMirroredIndex = dualReverseRow
    ? totalSlides - visibleItemsCount - currentIndex
    : 0;
  const bottomTransform = dualReverseRow
    ? `translateX(${-bottomMirroredIndex * slideStepPercent}%)`
    : null;

  const trackClass = cn(
    trackBase,
    isTransitionEnabled
      ? 'transition-transform duration-[250ms] ease-linear'
      : 'transition-none',
  );

  return (
    <div
      className={cn(
        'flex w-full flex-col pt-4 pb-20',
        dualReverseRow && 'pb-28 max-md:pb-24',
      )}
    >
      <div className="relative flex w-full flex-col">
        {dualReverseRow ? (
          <div className="flex w-full flex-col gap-8">
            <div
              className="w-full min-h-0 overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
            >
              <div
                className={trackClass}
                style={{ transform: topTransform }}
                onTransitionEnd={handleTransitionEnd}
              >
                {isRepeating && extraPreviousItems}
                {children}
                {isRepeating && extraNextItems}
              </div>
            </div>
            <div
              className="w-full min-h-0 overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
            >
              <div className={trackClass} style={{ transform: bottomTransform }}>
                {bottomReversedTrack}
              </div>
            </div>
          </div>
        ) : (
          <div
            className="h-full w-full overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            <div
              className={trackClass}
              style={{ transform: topTransform }}
              onTransitionEnd={handleTransitionEnd}
            >
              {isRepeating && extraPreviousItems}
              {children}
              {isRepeating && extraNextItems}
            </div>
          </div>
        )}

        <div className="absolute -bottom-20 left-0 flex h-10 w-full items-center justify-center gap-8">
          <button
            type="button"
            disabled={timeoutInProgress}
            onClick={previousItem}
            aria-label="Previous slide"
            className={cn('left-4 sm:left-6', carouselNavButtonClass)}
          >
            <Image
              src="/images/icons/arrow.svg"
              alt=""
              width={16}
              height={16}
              unoptimized
              className="h-4 w-4 invert"
            />
          </button>

          <button
            type="button"
            disabled={timeoutInProgress}
            onClick={nextItem}
            aria-label="Next slide"
            className={cn('right-4 sm:right-6', carouselNavButtonClass)}
          >
            <Image
              src="/images/icons/arrow.svg"
              alt=""
              width={16}
              height={16}
              unoptimized
              className="h-4 w-4 rotate-180 invert"
            />
          </button>
        </div>
      </div>
      {withIndicator ? (
        <div
          ref={indicatorContainerRef}
          className="mx-auto flex max-w-[56px] flex-row items-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {renderDots}
        </div>
      ) : null}
    </div>
  );
}

export default Carousel;
