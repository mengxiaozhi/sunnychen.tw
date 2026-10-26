export const ELECTION_DAY_ISO = '2026-11-28T00:00:00+08:00';
export const ELECTION_DAY_END_ISO = '2026-11-29T00:00:00+08:00';

export const ELECTION_DAY_START = Date.parse(ELECTION_DAY_ISO);
export const ELECTION_DAY_END = Date.parse(ELECTION_DAY_END_ISO);

export type ElectionCountdownValue = {
  status: 'upcoming' | 'election-day' | 'ended';
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

/** Count down to the Taiwan calendar date, independently of the browser's timezone. */
export function getElectionCountdown(now: number): ElectionCountdownValue {
  if (!Number.isFinite(now)) throw new RangeError('Expected a finite Unix timestamp in milliseconds.');

  if (now >= ELECTION_DAY_START) {
    return {
      status: now < ELECTION_DAY_END ? 'election-day' : 'ended',
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const remainingSeconds = Math.ceil((ELECTION_DAY_START - now) / 1000);
  return {
    status: 'upcoming',
    days: Math.floor(remainingSeconds / 86400),
    hours: Math.floor((remainingSeconds % 86400) / 3600),
    minutes: Math.floor((remainingSeconds % 3600) / 60),
    seconds: remainingSeconds % 60,
  };
}
