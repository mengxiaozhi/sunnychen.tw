export type PolisInfo = {
  title: string; description: string; status: 'open' | 'closed'; allowSubmissions: boolean; autoApprove: boolean; openData: boolean;
  counts: { statements: number; participants: number; votes: number };
};
export type NextOpinion = { statement: { sid: number; text: string } | null; progress: { voted: number; total: number } };
export type PolisResults = {
  nParticipantsTotal: number; nParticipantsClustered: number; nVotes: number; nStatements: number; inclusionThreshold: number; k: number;
  points: { x: number; y: number; group: number }[];
  groups: { id: number; label: string; size: number; statsRedacted?: boolean; representative: { sid: number; direction: 'agree' | 'disagree'; nSuccess: number; nSeen: number }[] }[];
  consensus: { agree: { sid: number; prob: number }[]; disagree: { sid: number; prob: number }[] };
};

export async function polisRequest<T>(base: string, conversation: string, path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${base.replace(/\/$/, '')}/api/conversations/${conversation}${path}`, {
    ...options, credentials: 'omit', cache: 'no-store',
    signal: options.signal ? AbortSignal.any([options.signal, AbortSignal.timeout(15000)]) : AbortSignal.timeout(15000),
    headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 429) throw new Error('操作有點頻繁，請稍後再試。');
    if (response.status === 503) throw new Error('討論服務暫時忙碌，請稍後再試。');
    throw new Error('這次操作沒有完成，請稍後重試。');
  }
  return body as T;
}

/** Each discussion has its own pseudonym; this key never contains Google identity. */
export function getParticipantId(conversation: string): { pid: string; persistent: boolean } {
  const key = `sunny.polis.participant.v1.${conversation}`;
  try {
    const existing = localStorage.getItem(key);
    if (existing && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(existing)) return { pid: existing, persistent: true };
    const pid = crypto.randomUUID(); localStorage.setItem(key, pid);
    return { pid, persistent: true };
  } catch { return { pid: crypto.randomUUID(), persistent: false }; }
}
