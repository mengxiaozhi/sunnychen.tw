'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/** GSAP is optional and loads independently from navigation and chapter tabs. */
export default function PageMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const main = document.querySelector<HTMLElement>('main');
    if (!main || (!main.querySelector('.hero') && !main.querySelector('.story-intro'))) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;

    void import('../scripts/motion').then(({ initPageMotion }) => {
      if (!cancelled) dispose = initPageMotion(main);
    }).catch(() => {
      // Content and React interactions remain usable when the optional chunk fails.
    });

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [pathname]);

  return null;
}
