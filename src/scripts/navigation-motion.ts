import { gsap } from 'gsap';

/** Optional enhancement: the menu works even when this chunk cannot load. */
export function createNavigationMotion(panel: HTMLElement) {
  const items = panel.querySelectorAll<HTMLElement>('[data-menu-item]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let open = false;
  let onClosed: (() => void) | undefined;
  const context = gsap.context(() => {}, panel);
  let timeline: gsap.core.Timeline;

  context.add(() => {
    timeline = gsap.timeline({ paused: true })
      .fromTo(panel, { clipPath: 'inset(0 0 100% 0 round 0 0 36px 36px)' }, {
        clipPath: 'inset(0 0 0% 0 round 0 0 0px 0px)',
        duration: 0.48, ease: 'power3.inOut',
      })
      .fromTo(items, { y: 24, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.38, stagger: 0.045,
        ease: 'power3.out',
      }, 0.13);
  });

  const clearStyles = () => {
    panel.style.removeProperty('clip-path');
    items.forEach(item => {
      item.style.removeProperty('transform');
      item.style.removeProperty('opacity');
    });
  };
  const finish = () => {
    timeline.progress(open ? 1 : 0, true).pause();
    if (!open) onClosed?.();
  };
  const handlePreference = () => finish();
  reduced.addEventListener('change', handlePreference);

  return {
    setOpen(nextOpen: boolean, closed?: () => void, immediate = false) {
      open = nextOpen;
      onClosed = closed;
      timeline.eventCallback('onReverseComplete', () => {
        if (!open) {
          onClosed?.();
        }
      });
      if (reduced.matches || immediate) finish();
      else if (open) timeline.timeScale(1).play();
      else if (timeline.progress() === 0) finish();
      else timeline.timeScale(1.7).reverse();
    },
    dispose() {
      reduced.removeEventListener('change', handlePreference);
      context.revert();
      clearStyles();
    },
  };
}
