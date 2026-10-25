'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

function revealIfVisible(node) {
  const rect = node.getBoundingClientRect();
  const height = window.innerHeight || document.documentElement.clientHeight;
  const inView = rect.width > 0 && rect.bottom > 0 && rect.top < height * 0.92;
  if (inView) node.classList.add('is-in');
}

export function MotionRoot({ children }) {
  const ref = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const root = ref.current ?? document;
    document.documentElement.classList.add('motion-on');

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let observer;
    let timer = 0;

    const watch = (node) => {
      if (reduce) {
        node.classList.add('is-in');
        return;
      }
      revealIfVisible(node);
      if (!node.classList.contains('is-in')) observer?.observe(node);
    };

    const scan = () => {
      root.querySelectorAll('[data-motion]').forEach(watch);
    };

    const start = () => {
      if (!reduce) {
        observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (!entry.isIntersecting) continue;
              entry.target.classList.add('is-in');
              observer.unobserve(entry.target);
            }
          },
          { threshold: 0.01, rootMargin: '0px 0px -8% 0px' }
        );
      }
      scan();
    };

    // Anything already on screen is revealed immediately. The observer below
    // only covers sections that scroll in later.
    root.querySelectorAll('[data-motion]').forEach((node) => {
      if (reduce) node.classList.add('is-in');
      else revealIfVisible(node);
    });

    // Observe on a later turn. React Strict Mode sets up and tears down this
    // effect in one turn, and Chrome drops the intersection notice for an
    // observer that was disconnected before that notice arrived. Sections
    // already on screen would otherwise stay at opacity 0.
    timer = window.setTimeout(start, 0);

    const mutations = new MutationObserver(() => {
      if (!observer && !reduce) return;
      scan();
    });
    mutations.observe(root, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(timer);
      mutations.disconnect();
      observer?.disconnect();
    };
  }, [pathname]);

  return (
    // A real box is required. `display: contents` leaves this ref null, so the
    // effect never runs and every [data-anim] section stays invisible.
    <div ref={ref}>
      {children}
    </div>
  );
}
