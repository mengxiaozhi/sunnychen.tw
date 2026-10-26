'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { createNavigationMotion } from '../scripts/navigation-motion';
import Arrow from './Arrow';
import BrandMark from './BrandMark';
import ShareCardLink from './ShareCardLink';
import { SHARE_CARD_ENTRY } from '../data/share-card';

const links = [
  { href: '/#about', label: '關於怡君' },
  { href: '/#story', label: '人生故事' },
  { href: '/deliberation/', label: '公共議題' },
  { href: '/#updates', label: '社群動態' },
  { href: '/#support', label: '支持怡君' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const primaryAction = pathname === '/deliberation' || pathname === '/deliberation/'
    ? { href: '/deliberation/#participate', label: '參與討論' }
    : { href: SHARE_CARD_ENTRY, label: '中和小卡' };
  const [open, setOpen] = useState(false);
  const [present, setPresent] = useState(false);
  const [mobile, setMobile] = useState(false);
  const openRef = useRef(false);
  const breakpointFocusRef = useRef<'toggle' | 'navigation' | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigationRef = useRef<HTMLElement>(null);
  const motionRef = useRef<ReturnType<typeof createNavigationMotion> | null>(null);
  const releaseRef = useRef<(() => void) | null>(null);

  const closeMenu = useCallback((restoreFocus = false) => {
    openRef.current = false;
    // Release before Next Link handles its anchor/route. No delayed scroll restoration.
    releaseRef.current?.();
    if (restoreFocus) buttonRef.current?.focus({ preventScroll: true });
    setOpen(false);
  }, []);

  useEffect(() => closeMenu(), [pathname, closeMenu]);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 700px)');
    setMobile(query.matches);
    const handleBreakpoint = (event: MediaQueryListEvent) => {
      const focused = document.activeElement;
      closeMenu();
      setMobile(event.matches);
      setPresent(false);
      if (event.matches && focused && navigationRef.current?.contains(focused)) {
        breakpointFocusRef.current = 'toggle';
      } else if (!event.matches && focused === buttonRef.current) {
        breakpointFocusRef.current = 'navigation';
      }
    };
    const closeForNavigation = () => closeMenu();
    query.addEventListener('change', handleBreakpoint);
    window.addEventListener('hashchange', closeForNavigation);
    window.addEventListener('popstate', closeForNavigation);
    return () => {
      query.removeEventListener('change', handleBreakpoint);
      window.removeEventListener('hashchange', closeForNavigation);
      window.removeEventListener('popstate', closeForNavigation);
    };
  }, [closeMenu]);

  useLayoutEffect(() => {
    // Wait for React to remove inert before transferring focus to desktop links.
    const target = breakpointFocusRef.current;
    breakpointFocusRef.current = null;
    if (target === 'toggle') buttonRef.current?.focus({ preventScroll: true });
    if (target === 'navigation') {
      navigationRef.current?.querySelector<HTMLAnchorElement>('a')?.focus({ preventScroll: true });
    }
  }, [mobile]);

  useEffect(() => {
    if (!mobile) return;
    let cancelled = false;
    let motion: ReturnType<typeof createNavigationMotion> | undefined;
    void import('../scripts/navigation-motion').then(({ createNavigationMotion }) => {
      if (cancelled || !navigationRef.current) return;
      motion = createNavigationMotion(navigationRef.current);
      motionRef.current = motion;
      // A slow chunk must not hide or replay a menu the visitor is already using.
      motion.setOpen(openRef.current, undefined, true);
    }).catch(() => {
      // CSS visibility and React interactions do not depend on animation loading.
    });
    return () => {
      cancelled = true;
      motion?.dispose();
      motionRef.current = null;
    };
  }, [mobile]);

  useLayoutEffect(() => {
    if (!mobile) return;
    if (open) setPresent(true);
    const finishClose = () => {
      if (!openRef.current) setPresent(false);
    };
    if (motionRef.current) motionRef.current.setOpen(open, finishClose);
    else if (!open) finishClose();
  }, [open, mobile]);

  useEffect(() => {
    const header = headerRef.current;
    if (!open || !mobile || !header) return;
    const root = document.documentElement;
    const body = document.body;
    const originalOverflow = root.style.overflow;
    const originalPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    const bodyPaddingRight = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
    const originalOverscroll = body.style.overscrollBehavior;
    const background = [...body.children]
      .filter((node): node is HTMLElement => node instanceof HTMLElement && node !== header)
      .map(node => ({ node, inert: node.inert }));
    // Lock the root only: body overflow would change the sticky header's scroll container.
    if (scrollbarWidth > 0) body.style.paddingRight = `${bodyPaddingRight + scrollbarWidth}px`;
    root.style.overflow = 'hidden';
    body.style.overscrollBehavior = 'none';
    background.forEach(({ node }) => { node.inert = true; });

    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      root.style.overflow = originalOverflow;
      body.style.paddingRight = originalPaddingRight;
      body.style.overscrollBehavior = originalOverscroll;
      background.forEach(({ node, inert }) => { node.inert = inert; });
    };
    releaseRef.current = release;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!openRef.current) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu(true);
      } else if (event.key === 'Tab') {
        const controls = [...header.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')];
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && (document.activeElement === first || !header.contains(document.activeElement))) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    const handleFocus = (event: FocusEvent) => {
      if (openRef.current && event.target instanceof Node && !header.contains(event.target)) {
        buttonRef.current?.focus({ preventScroll: true });
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocus);
    return () => {
      release();
      releaseRef.current = null;
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocus);
    };
  }, [open, mobile, closeMenu]);

  const toggleMenu = () => {
    if (openRef.current) closeMenu(true);
    else {
      openRef.current = true;
      setOpen(true);
    }
  };

  return (
    <header
      className="site-header"
      ref={headerRef}
      data-menu-open={open || undefined}
      role={mobile && open ? 'dialog' : undefined}
      aria-modal={mobile && open ? true : undefined}
      aria-label={mobile && open ? '網站導覽' : undefined}
    >
      <div className="container header-inner">
        <Link className="brand" href="/" aria-label="陳怡君 Sunny Chen 首頁" onClick={() => closeMenu()}>
          <BrandMark priority />
        </Link>
        <button
          ref={buttonRef}
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="main-navigation"
          aria-label={open ? '關閉導覽選單' : '開啟導覽選單'}
          onClick={toggleMenu}
        >
          <span /><span />
        </button>
        <nav
          ref={navigationRef}
          id="main-navigation"
          aria-label="主要導覽"
          inert={mobile && !open}
          className={present ? 'is-present' : undefined}
        >
          <div className="mobile-menu-caption" data-menu-item aria-hidden="true">選單 <span>MENU</span></div>
          {links.map((link, index) => (
            <Link key={link.href} href={link.href} onClick={() => closeMenu()} data-menu-item>
              <span className="mobile-menu-number" aria-hidden="true">0{index + 1}</span>
              <span>{link.label}</span>
              <Arrow className="arrow mobile-menu-arrow" diagonal />
            </Link>
          ))}
          {primaryAction.href === SHARE_CARD_ENTRY ? (
            <ShareCardLink className="button button-small" onClick={() => closeMenu()} data-menu-item>
              {primaryAction.label} <Arrow />
            </ShareCardLink>
          ) : (
            <Link className="button button-small" href={primaryAction.href} onClick={() => closeMenu()} data-menu-item>
              {primaryAction.label} <Arrow />
            </Link>
          )}
          <div className="mobile-menu-signature" data-menu-item aria-hidden="true">SUNNY CHEN <span>中和・幸福怡起拚</span></div>
        </nav>
      </div>
    </header>
  );
}
