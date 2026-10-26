'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { SHARE_CARD_OPEN_EVENT } from '../data/share-card';
import './share-card-drawer.css';

const HASH = '#share-card';
const HISTORY_KEY = '__sunnyShareCard';

export default function ShareCardDrawer({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [present, setPresent] = useState(false);
  const [closing, setClosing] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const desiredOpen = useRef(false);
  const animationRef = useRef<Animation | null>(null);
  const releaseRef = useRef<(() => void) | null>(null);
  const sessionRef = useRef('');
  const outsidePointer = useRef(false);

  const finishClose = useCallback((restoreFocus = true) => {
    desiredOpen.current = false;
    animationRef.current?.cancel();
    animationRef.current = null;
    dialogRef.current?.close();
    releaseRef.current?.();
    releaseRef.current = null;
    setPresent(false);
    setClosing(false);
    if (restoreFocus) {
      const opener = openerRef.current;
      const visible = opener?.isConnected && !opener.closest('[inert]') && opener.getClientRects().length && getComputedStyle(opener).visibility !== 'hidden';
      const fallback = document.querySelector<HTMLElement>('.menu-toggle');
      const target = visible ? opener : fallback?.getClientRects().length ? fallback : document.querySelector<HTMLElement>('.site-header .brand');
      target?.focus({ preventScroll: true });
    }
  }, []);

  const animate = useCallback((opening: boolean, initial = false) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const from = initial ? 'translateY(100%)' : getComputedStyle(dialog).transform;
    animationRef.current?.cancel();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !dialog.animate) {
      if (!opening) finishClose();
      return;
    }
    const animation = dialog.animate([
      { transform: from },
      { transform: opening ? 'translateY(0)' : 'translateY(100%)' },
    ], { duration: opening ? 440 : 250, easing: opening ? 'cubic-bezier(.22, 1, .36, 1)' : 'cubic-bezier(.4, 0, 1, 1)', fill: 'forwards' });
    animationRef.current = animation;
    animation.onfinish = () => {
      if (opening) { animation.cancel(); animationRef.current = null; }
      else finishClose();
    };
  }, [finishClose]);

  const openDrawer = useCallback(() => {
    if (desiredOpen.current) return;
    desiredOpen.current = true;
    setClosing(false);
    if (dialogRef.current?.open) animate(true);
    else setPresent(true);
  }, [animate]);

  const closeDrawer = useCallback((updateHistory = true) => {
    if (!desiredOpen.current) return;
    desiredOpen.current = false;
    if (updateHistory && window.location.hash === HASH) {
      if (window.history.state?.[HISTORY_KEY] === sessionRef.current) window.history.back();
      else window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
    }
    setClosing(true);
    animate(false);
  }, [animate]);

  useEffect(() => {
    sessionRef.current = crypto.randomUUID();
    const handleOpen = (event: Event) => {
      event.preventDefault();
      const trigger = (event as CustomEvent<{ trigger?: HTMLElement }>).detail?.trigger;
      openerRef.current = trigger instanceof HTMLElement ? trigger : null;
      if (window.location.hash !== HASH) {
        window.history.pushState({ ...window.history.state, [HISTORY_KEY]: sessionRef.current }, '', HASH);
      }
      openDrawer();
    };
    const syncLocation = () => {
      if (window.location.hash === HASH) openDrawer();
      else closeDrawer(false);
    };
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotion = () => { if (motion.matches) animationRef.current?.finish(); };
    window.addEventListener(SHARE_CARD_OPEN_EVENT, handleOpen);
    window.addEventListener('popstate', syncLocation);
    window.addEventListener('hashchange', syncLocation);
    motion.addEventListener('change', handleMotion);
    syncLocation();
    return () => {
      window.removeEventListener(SHARE_CARD_OPEN_EVENT, handleOpen);
      window.removeEventListener('popstate', syncLocation);
      window.removeEventListener('hashchange', syncLocation);
      motion.removeEventListener('change', handleMotion);
      animationRef.current?.cancel();
      releaseRef.current?.();
      releaseRef.current = null;
      dialogRef.current?.close();
    };
  }, [openDrawer, closeDrawer]);

  useEffect(() => {
    if (window.location.hash === HASH) openDrawer();
    else if (dialogRef.current?.open) finishClose(false);
  }, [pathname, openDrawer, finishClose]);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!present || !dialog || !desiredOpen.current) return;
    const root = document.documentElement;
    const body = document.body;
    const overflow = root.style.overflow;
    const padding = body.style.paddingRight;
    const overscroll = body.style.overscrollBehavior;
    const gap = window.innerWidth - root.clientWidth;
    if (gap > 0) body.style.paddingRight = `${(parseFloat(getComputedStyle(body).paddingRight) || 0) + gap}px`;
    root.style.overflow = 'hidden';
    body.style.overscrollBehavior = 'none';
    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      root.style.overflow = overflow;
      body.style.paddingRight = padding;
      body.style.overscrollBehavior = overscroll;
    };
    releaseRef.current = release;
    dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });
    animate(true, true);
    return release;
  }, [present, animate]);

  const outside = (x: number, y: number) => {
    const rect = dialogRef.current?.getBoundingClientRect();
    return Boolean(rect && (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom));
  };

  return <dialog
    ref={dialogRef}
    id="share-card-drawer"
    className="share-card-drawer"
    aria-labelledby="share-card-drawer-title"
    data-closing={closing || undefined}
    onCancel={event => { event.preventDefault(); closeDrawer(); }}
    onKeyDown={event => {
      if (event.key !== 'Tab') return;
      const controls = [...event.currentTarget.querySelectorAll<HTMLElement>('a[href], button, input, select, textarea, [tabindex]')]
        .filter(node => !node.matches(':disabled, [tabindex="-1"]') && !node.closest('[inert]') && node.getClientRects().length && getComputedStyle(node).visibility !== 'hidden');
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }}
    onPointerDown={event => { outsidePointer.current = event.target === event.currentTarget && outside(event.clientX, event.clientY); }}
    onClick={event => {
      if (outsidePointer.current && event.target === event.currentTarget && outside(event.clientX, event.clientY)) closeDrawer();
      outsidePointer.current = false;
    }}
    onClickCapture={event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!link || link.hasAttribute('download') || link.target === '_blank') return;
      const target = new URL(link.href, window.location.href);
      if (target.origin === window.location.origin && (target.pathname !== window.location.pathname || target.hash !== HASH)) finishClose(false);
    }}
  >
    <div className="share-card-drawer-header">
      <div><h2 id="share-card-drawer-title">中和小卡</h2><p>把你的日常，做成一張小卡。</p></div>
      <button ref={closeRef} type="button" className="share-card-drawer-close" aria-label="關閉中和小卡" onClick={() => closeDrawer()}>
        <span>關閉</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
      </button>
    </div>
    <div className="share-card-drawer-body">{present ? children : null}</div>
  </dialog>;
}
