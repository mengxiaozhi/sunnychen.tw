'use client';

import { useEffect, useState } from 'react';
import { ELECTION_DAY_ISO, getElectionCountdown, type ElectionCountdownValue } from '../data/election';
import './election-countdown.css';

const units = [
  { key: 'days', label: '天' },
  { key: 'hours', label: '時' },
  { key: 'minutes', label: '分' },
  { key: 'seconds', label: '秒' },
] as const;

export default function ElectionCountdown() {
  // Stable server/client markup until the effect reads the current clock.
  const [countdown, setCountdown] = useState<ElectionCountdownValue | null>(null);

  useEffect(() => {
    let timer: number | undefined;
    const update = () => setCountdown(getElectionCountdown(Date.now()));
    const stop = () => {
      if (timer !== undefined) window.clearInterval(timer);
      timer = undefined;
    };
    const resume = () => {
      stop();
      update();
      if (!document.hidden) timer = window.setInterval(update, 1000);
    };
    const visibilityChanged = () => {
      if (document.hidden) stop();
      else resume();
    };

    resume();
    document.addEventListener('visibilitychange', visibilityChanged);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', visibilityChanged);
    };
  }, []);

  const upcoming = !countdown || countdown.status === 'upcoming';

  return (
    <div className="election-countdown" data-election-state={countdown?.status ?? 'pending'}>
      <div className="election-countdown-label">
        <span className="election-countdown-title">{upcoming ? '投票日倒數' : '投票日資訊'}</span>
        <time dateTime={ELECTION_DAY_ISO}>2026.11.28 投票日</time>
      </div>
      {upcoming ? (
        <div className="election-countdown-digits" role="timer" aria-live="off" aria-label="距離台灣時間 2026 年 11 月 28 日的倒數">
          {units.map(({ key, label }) => (
            <span className="election-countdown-unit" key={key}>
              <strong className="election-countdown-number">{countdown ? String(countdown[key]).padStart(2, '0') : '--'}</strong>
              <span className="election-countdown-unit-label">{label}</span>
            </span>
          ))}
        </div>
      ) : (
        <p className="election-countdown-message" role="status">
          {countdown.status === 'election-day' ? '今天是投票日' : '投票日已結束'}
        </p>
      )}
    </div>
  );
}
