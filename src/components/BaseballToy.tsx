'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { BaseballController } from '../scripts/baseball';
import Arrow from './Arrow';
import './baseball.css';

/** The small React shell stays server-rendered; Three.js loads near the viewport. */
export default function BaseballToy() {
  const viewport = useRef<HTMLDivElement>(null);
  const controller = useRef<BaseballController | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'unavailable'>('idle');
  const [rolling, setRolling] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const hintId = useId();

  useEffect(() => {
    const host = viewport.current;
    if (!host) return;
    let cancelled = false;
    let started = false;

    const load = async () => {
      if (started || cancelled) return;
      started = true;
      setStatus('loading');
      try {
        const { createBaseball } = await import('../scripts/baseball');
        if (cancelled) return;
        controller.current = createBaseball(host, {
          ready: () => { if (!cancelled) setStatus('ready'); },
          unavailable: () => { if (!cancelled) setStatus('unavailable'); },
          playbackChanged: state => { if (!cancelled) { setRolling(state.rolling); setReducedMotion(state.reducedMotion); } },
        });
      } catch {
        if (!cancelled) setStatus('unavailable');
      }
    };

    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        observer.disconnect();
        void load();
      }
    }, { rootMargin: '160px' });
    observer.observe(host);

    return () => {
      cancelled = true;
      observer.disconnect();
      controller.current?.dispose();
      controller.current = null;
    };
  }, []);

  const ready = status === 'ready';
  return (
    <div className="baseball-toy" data-baseball-state={status} data-baseball-rolling={rolling}>
      <div
        ref={viewport}
        className="baseball-viewport"
        role="group"
        aria-label="棒球 3D 互動模型"
        aria-describedby={hintId}
        aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown Home Space"
        tabIndex={ready ? 0 : -1}
      >
        <svg className="baseball-fallback" viewBox="0 0 180 180" aria-hidden="true">
          <circle cx="90" cy="90" r="65" fill="#fffdf7" stroke="#153f3b" strokeWidth="2" />
          <g fill="none" stroke="#c34558" strokeWidth="2.5" strokeLinecap="round">
            <path d="M52 37c36 24 36 82 0 106M128 37c-36 24-36 82 0 106" />
            <path d="m53 48 12-5m-5 17 12-5m-8 18 12-4m-10 18 12-2m-12 16 12 1m-15 14 12 4m-17 8 11 6m48-80-12-5m5 17-12-5m8 18-12-4m10 18-12-2m12 16-12 1m15 14-12 4m17 8-11 6" />
          </g>
        </svg>
      </div>
      <div className="baseball-copy">
        <h3>怡起，<br />轉個好球。</h3>
        <p id={hintId} className="baseball-hint" aria-live="polite">
          {status === 'loading' ? '棒球準備中…' : status === 'unavailable' ? '目前顯示靜態棒球。' : ready ? reducedMotion ? '已減少動態效果，仍可拖曳或用方向鍵轉動。' : rolling ? '拖曳或方向鍵可轉動，空白鍵可暫停。' : '已暫停，按空白鍵繼續滾動。' : '一顆小棒球，和你怡起玩。'}
        </p>
        <div className="baseball-actions">
          <button type="button" className="baseball-spin" disabled={!ready} onClick={() => controller.current?.spin()}>轉個好球 <Arrow diagonal /></button>
        </div>
      </div>
    </div>
  );
}
