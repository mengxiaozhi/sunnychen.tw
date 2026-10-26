import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Optional enhancement: HTML stays readable before JS and if this chunk fails. */
export function initPageMotion(main: HTMLElement) {
  if (!main || main.dataset.motionInitialized) return;

  main.dataset.motionInitialized = 'true';
  const media = gsap.matchMedia(main);
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const updateMode = () => {
    main.dataset.motion = preference.matches ? 'reduced' : 'gsap';
  };
  updateMode();
  preference.addEventListener('change', updateMode);

  try {
    media.add('(prefers-reduced-motion: no-preference)', (context) => {
      const reveals: Array<{
        element: HTMLElement;
        tween: gsap.core.Tween;
        trigger: ScrollTrigger;
      }> = [];
      let chapterTween: gsap.core.Tween | undefined;
      let refreshFrame = 0;
      let disposed = false;

      // A late-loading animation must never conceal already visible content or
      // move a page that was opened at a story anchor / restored scroll position.
      const playIntro = !location.hash && window.scrollY < 24 && performance.now() < 1800;
      if (playIntro) {
        const hero = main.querySelector('.hero');
        if (hero) {
          const intro = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.85 } });
          // Transform-only primary content keeps the first paint and LCP readable.
          intro.from('.hero-line', { y: 28, stagger: 0.09, clearProps: 'transform' }, 0)
            .from('.candidate-name, .hero-message, .hero-actions', {
              y: 18, stagger: 0.07, clearProps: 'transform',
            }, 0.12)
            .from('.hero-polaroid', {
              y: 32, rotation: -1, duration: 1.1, clearProps: 'transform',
            }, 0.05)
            .from('.signature', {
              clipPath: 'inset(0 100% 0 0)', duration: 0.9, clearProps: 'clipPath',
            }, 0.4)
            .from('.hero-spark', {
              scale: 0.55, rotation: -22, duration: 0.7, ease: 'back.out(1.7)', clearProps: 'transform',
            }, 0.35)
            .from('.hero-speed', {
              scaleX: 0, transformOrigin: 'left center', duration: 0.6, clearProps: 'transform,transformOrigin',
            }, 0.3);

          main.querySelectorAll<SVGPathElement>('.sun-doodle path').forEach((path, index) => {
            const length = path.getTotalLength();
            intro.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, {
              strokeDashoffset: 0,
              duration: index === 0 ? 0.65 : 0.5,
              clearProps: 'strokeDasharray,strokeDashoffset',
            }, 0.22 + index * 0.15);
          });
        } else if (main.querySelector('.story-intro')) {
          gsap.from('.story-intro h1, .intro-copy, .intro-bottom', {
            y: 22, duration: 0.8, stagger: 0.09, ease: 'power3.out', clearProps: 'transform',
          });
        }
      }

      function reveal(element: HTMLElement, delay = 0) {
        if (!element.getClientRects().length || element.getBoundingClientRect().top < innerHeight * 0.94) return;
        const tween = gsap.from(element, {
          y: 26, opacity: 0, duration: 0.72, delay, paused: true,
          ease: 'power3.out', clearProps: 'transform,opacity',
        });
        const trigger = ScrollTrigger.create({
          trigger: element, start: 'top 94%', once: true,
          onEnter: () => tween.play(),
        });
        reveals.push({ element, tween, trigger });
      }

      main.querySelectorAll<HTMLElement>([
        '.about-intro', '.about-detail', '.section-heading', '.chapter-tabs',
        '.chapter-panel:not([hidden]) .story-polaroid',
        '.chapter-panel:not([hidden]) .chapter-copy', '.quote-inner',
        '.contact-main > div', '.contact-details', '.story-chapter .chapter-photo',
        '.support-intro', '.support-account',
        '.story-chapter .chapter-copy', '.pause-inner', '.gallery-heading',
      ].join(',')).forEach(element => reveal(element));
      main.querySelectorAll<HTMLElement>('.update-item, .book-pages li').forEach((element, index) => {
        reveal(element, innerWidth > 700 ? (index % 3) * 0.07 : 0);
      });

      const aboutSpark = main.querySelector('.about-spark');
      if (aboutSpark) gsap.from(aboutSpark, {
        scale: 0.7, rotation: -18, duration: 0.65, ease: 'back.out(1.5)', clearProps: 'transform',
        scrollTrigger: { trigger: aboutSpark, start: 'top 92%', once: true },
      });

      // Reveal before a keyboard user interacts with an off-screen/fading link.
      function finishReveal(element: Element) {
        reveals.forEach(({ element: target, tween, trigger }) => {
          if (target.contains(element) || element.contains(target)) {
            tween.progress(1);
            trigger.kill();
          }
        });
      }
      const handleFocus = (event: FocusEvent) => {
        if (event.target instanceof Element) {
          finishReveal(event.target);
          chapterTween?.progress(1);
        }
      };
      main.addEventListener('focusin', handleFocus);

      // Register late event-created tweens with the matchMedia context so a live
      // preference change restores every inline style, including base rotations.
      context.add('changeChapter', (event: CustomEvent<{ panel: HTMLElement }>) => {
        main.querySelectorAll('.chapter-panel').forEach(finishReveal);
        chapterTween?.revert();
        const panel = event.detail.panel;
        chapterTween = gsap.from(panel.querySelectorAll('.story-polaroid, .chapter-copy > *'), {
          y: 18, opacity: 0, duration: 0.46, stagger: 0.035,
          ease: 'power2.out', clearProps: 'transform,opacity',
        });
        ScrollTrigger.refresh();
      });
      const handleChapter = context.changeChapter as EventListener;
      main.addEventListener('sunny:chapterchange', handleChapter);

      // Draw the existing yellow marker after its text enters the reading area.
      main.querySelectorAll<HTMLElement>('.highlight').forEach(element => {
        if (element.getBoundingClientRect().top < innerHeight || element.closest('[hidden]')) return;
        gsap.from(element, {
          '--marker-progress': '0%', duration: 0.7, ease: 'power2.out',
          clearProps: '--marker-progress',
          scrollTrigger: { trigger: element, start: 'top 90%', once: true },
        });
      });

      const refresh = () => {
        cancelAnimationFrame(refreshFrame);
        refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
      };
      const handlePageShow = (event: PageTransitionEvent) => { if (event.persisted) refresh(); };
      window.addEventListener('pageshow', handlePageShow);
      main.addEventListener('load', refresh, true);
      document.fonts.ready.then(() => { if (!disposed) refresh(); });

      return () => {
        disposed = true;
        cancelAnimationFrame(refreshFrame);
        main.removeEventListener('focusin', handleFocus);
        main.removeEventListener('sunny:chapterchange', handleChapter);
        main.removeEventListener('load', refresh, true);
        window.removeEventListener('pageshow', handlePageShow);
      };
    });

    media.add('(min-width: 901px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', (context) => {
      // The outer art layer owns parallax; inner photo/signature CSS angles stay intact.
      const art = main.querySelector('.hero-art');
      if (art) {
        gsap.to(art, {
          y: -24, ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.8 },
        });
      }
      const handlers: Array<() => void> = [];
      main.querySelectorAll<HTMLAnchorElement>('.button, .text-link').forEach((link, index) => {
        const arrow = link.querySelector('.arrow');
        if (!arrow) return;
        const enter = context.add(`enter${index}`, () => gsap.to(arrow, { x: 4, duration: 0.22, ease: 'power2.out', overwrite: true })) as EventListener;
        const leave = context.add(`leave${index}`, () => gsap.to(arrow, { x: 0, duration: 0.22, ease: 'power2.out', overwrite: true, clearProps: 'transform' })) as EventListener;
        link.addEventListener('pointerenter', enter);
        link.addEventListener('pointerleave', leave);
        handlers.push(() => {
          link.removeEventListener('pointerenter', enter);
          link.removeEventListener('pointerleave', leave);
        });
      });
      return () => handlers.forEach(remove => remove());
    });
  } catch (error) {
    media.revert();
    preference.removeEventListener('change', updateMode);
    delete main.dataset.motionInitialized;
    main.dataset.motion = 'static';
    throw error;
  }

  return () => {
    media.revert();
    preference.removeEventListener('change', updateMode);
    delete main.dataset.motionInitialized;
    delete main.dataset.motion;
  };
}
