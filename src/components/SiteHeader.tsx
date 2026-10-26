'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Arrow from './Arrow';
import BrandMark from './BrandMark';

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigationRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const closeForNavigation = () => setOpen(false);
    const mobile = window.matchMedia('(max-width: 700px)');
    const handleBreakpoint = (event: MediaQueryListEvent) => {
      const focused = document.activeElement;
      setOpen(false);
      if (event.matches && focused && navigationRef.current?.contains(focused)) {
        buttonRef.current?.focus();
      } else if (!event.matches && focused === buttonRef.current) {
        navigationRef.current?.querySelector<HTMLAnchorElement>('a')?.focus();
      }
    };

    mobile.addEventListener('change', handleBreakpoint);
    window.addEventListener('hashchange', closeForNavigation);
    window.addEventListener('popstate', closeForNavigation);
    return () => {
      mobile.removeEventListener('change', handleBreakpoint);
      window.removeEventListener('hashchange', closeForNavigation);
      window.removeEventListener('popstate', closeForNavigation);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
    };
    const handleOutsideClick = (event: MouseEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <header className="site-header" ref={headerRef}>
      <div className="container header-inner">
        <Link className="brand" href="/" aria-label="陳怡君 Sunny Chen 首頁" onClick={closeMenu}>
          <BrandMark priority />
        </Link>
        <button
          ref={buttonRef}
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="main-navigation"
          aria-label={open ? '關閉導覽選單' : '開啟導覽選單'}
          onClick={() => setOpen(current => !current)}
        >
          <span /><span />
        </button>
        <nav
          ref={navigationRef}
          id="main-navigation"
          aria-label="主要導覽"
          className={open ? 'is-open' : undefined}
        >
          <Link href="/#about" onClick={closeMenu}>關於怡君</Link>
          <Link href="/#story" onClick={closeMenu}>人生故事</Link>
          <Link href="/deliberation/" onClick={closeMenu}>公共議題</Link>
          <Link href="/#updates" onClick={closeMenu}>社群動態</Link>
          <Link href="/#support" onClick={closeMenu}>支持怡君</Link>
          <Link className="button button-small" href="/#contact" onClick={closeMenu}>
            聯絡怡君 <Arrow />
          </Link>
        </nav>
      </div>
    </header>
  );
}
