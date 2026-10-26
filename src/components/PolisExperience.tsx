'use client';

import Link from 'next/link';
import { type FormEvent, useEffect, useRef, useState } from 'react';
import Arrow from './Arrow';
import { getParticipantId, polisRequest, type NextOpinion, type PolisInfo, type PolisResults } from '../lib/polis';

type Props = { apiBase: string; conversationId: string };

export default function PolisExperience({ apiBase, conversationId }: Props) {
  const configured = /^https?:\/\//.test(apiBase) && /^[a-z0-9]{10}$/.test(conversationId);
  const [info, setInfo] = useState<PolisInfo | null>(null);
  const [next, setNext] = useState<NextOpinion | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [text, setText] = useState('');
  const [proposalMessage, setProposalMessage] = useState('');
  const [proposalError, setProposalError] = useState('');
  const [persistent, setPersistent] = useState(true);
  const participant = useRef('');
  const pending = useRef(false);
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);

  async function start() {
    if (pending.current || !configured) return;
    pending.current = true; setBusy(true); setError(''); setNotice('');
    request.current = new AbortController();
    try {
      const data = await polisRequest<PolisInfo>(apiBase, conversationId, '', { signal: request.current.signal });
      setInfo(data);
      if (data.status !== 'open') return;
      if (!participant.current) {
        const identity = getParticipantId(conversationId);
        participant.current = identity.pid; setPersistent(identity.persistent);
      }
      const opinion = await polisRequest<NextOpinion>(apiBase, conversationId, `/next?pid=${participant.current}`, { signal: request.current.signal });
      setNext(opinion);
    } catch (e) { if (!(e instanceof Error && e.name === 'AbortError')) setError(e instanceof Error ? e.message : '暫時無法連線，請再試一次。'); }
    finally { pending.current = false; setBusy(false); }
  }

  async function vote(value: -1 | 0 | 1) {
    if (pending.current || !next?.statement || !participant.current) return;
    pending.current = true; setBusy(true); setError(''); setNotice('');
    request.current = new AbortController();
    try {
      const result = await polisRequest<{ next: NextOpinion['statement']; progress: NextOpinion['progress'] }>(apiBase, conversationId, '/votes', {
        method: 'POST', body: JSON.stringify({ pid: participant.current, sid: next.statement.sid, value }), signal: request.current.signal,
      });
      setNext({ statement: result.next, progress: result.progress });
      setNotice('已記錄你的回應。');
    } catch (e) { if (!(e instanceof Error && e.name === 'AbortError')) setError(e instanceof Error ? e.message : '回應未送出，請再試一次。'); }
    finally { pending.current = false; setBusy(false); }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current || !text.trim() || !participant.current) return;
    pending.current = true; setBusy(true); setProposalError(''); setProposalMessage('');
    request.current = new AbortController();
    try {
      const result = await polisRequest<{ status: 'pending' | 'approved' }>(apiBase, conversationId, '/statements', {
        method: 'POST', body: JSON.stringify({ pid: participant.current, text: text.trim() }), signal: request.current.signal,
      });
      setText('');
      setProposalMessage(result.status === 'pending' ? '觀點已送出，待主持人審核。通過後才會公開。' : '觀點已公開。');
    } catch (e) { if (!(e instanceof Error && e.name === 'AbortError')) setProposalError(e instanceof Error ? e.message : '觀點未送出，請再試一次。'); }
    finally { pending.current = false; setBusy(false); }
  }

  return (
    <>
      <section className="polis-participation" id="participate" aria-labelledby="participation-title">
        <div className="polis-participation-heading"><span className="section-label">LET'S TALK</span><h2 id="participation-title">讓想法，<span className="highlight">彼此相遇。</span></h2><p>閱讀一個觀點，選擇認同、不認同或略過。三種回應都同樣重要，沒有標準答案。</p></div>
        <div className="polis-ballot" aria-busy={busy}>
          {!next && info?.status !== 'closed' && <>
            <p className="polis-ballot-kicker">中和生活改善的優先順序</p><h3>從你的日常，<br />開始這場討論。</h3>
            <p>不用 Google 登入，也能不具名參與。開始後會在這個瀏覽器保存隨機代號，讓你接續回應。</p>
            <button className="button" type="button" disabled={!configured || busy} onClick={start}>{busy ? '連線中…' : '開始不具名參與'} <Arrow /></button>
            {!configured && <p className="polis-connection-note" role="status">討論服務尚在接通。議題背景與參與方式已可閱讀。</p>}
          </>}
          {info?.status === 'closed' && <><h3>這場討論已結束。</h3><p>你仍可查看已公開的共同看法與分歧。</p></>}
          {next && <>
            <p className="polis-progress">已回應 <strong>{next.progress.voted}</strong> ／ {next.progress.total} 個觀點</p>
            <progress value={next.progress.voted} max={Math.max(1, next.progress.total)} aria-label="觀點回應進度" />
            {next.statement ? <>
              <blockquote className="polis-opinion" aria-live="polite" aria-atomic="true">{next.statement.text}</blockquote>
              <div className="polis-vote-actions" role="group" aria-label="你對這個觀點的看法">
                <button type="button" disabled={busy} onClick={() => vote(1)}>認同</button>
                <button type="button" disabled={busy} onClick={() => vote(-1)}>不認同</button>
                <button type="button" disabled={busy} onClick={() => vote(0)}>略過</button>
              </div>
            </> : <div className="polis-complete"><h3>謝謝你，讓中和的聲音更完整。</h3><p>目前的觀點已回應完畢。你可以補充自己的觀點，或看看大家目前的共同看法。</p><button type="button" className="text-link" onClick={start} disabled={busy}>再看看有沒有新觀點 <Arrow /></button></div>}
          </>}
          {!persistent && <p className="polis-connection-note">這個瀏覽器無法保存代號，重新整理後可能無法接續進度。</p>}
          {error && <p className="polis-error" role="alert">{error}</p>}
          {notice && <p className="polis-notice" role="status">{notice}</p>}
          <p className="polis-privacy-note">代號不驗證一人一票。請勿提交姓名、電話或精確住址。<Link href="/privacy/#deliberation">了解審議資料如何使用</Link></p>
        </div>
      </section>

      {next && info?.allowSubmissions && info.status === 'open' && <section className="polis-proposal" aria-labelledby="proposal-title">
        <div><h2 id="proposal-title">還有一個，<br /><span className="highlight">我想說的觀點。</span></h2><p>一句一個想法，說清楚你希望討論的事。新觀點會先經過審核；通過審核不代表主持方認同內容。</p></div>
        <form onSubmit={submit}><label htmlFor="new-opinion">補充一個中和生活觀點</label><textarea id="new-opinion" value={text} onChange={e => setText(e.target.value)} maxLength={280} required rows={4} placeholder="例如：我希望先改善……，因為……" /><div className="polis-form-bottom"><span>{text.length} / 280</span><button className="button" type="submit" disabled={busy || !text.trim()}>{busy ? '傳送中…' : '送出觀點，等待審核'} <Arrow /></button></div>{proposalMessage && <p className="polis-notice" role="status">{proposalMessage}</p>}{proposalError && <p className="polis-error" role="alert">{proposalError}</p>}</form>
      </section>}
      <PolisResultsPanel apiBase={apiBase} conversationId={conversationId} configured={configured} />
    </>
  );
}

function PolisResultsPanel({ apiBase, conversationId, configured }: Props & { configured: boolean }) {
  const [results, setResults] = useState<PolisResults | null>(null);
  const [statements, setStatements] = useState<{ sid: number; text: string }[]>([]);
  const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  const controller = useRef<AbortController | null>(null); const pending = useRef(false);
  useEffect(() => () => controller.current?.abort(), []);
  async function load() {
    if (!configured || pending.current) return;
    pending.current = true; setBusy(true); setError(''); controller.current = new AbortController();
    try {
      const [math, opinions] = await Promise.all([
        polisRequest<{ result: PolisResults }>(apiBase, conversationId, '/results', { signal: controller.current.signal }),
        polisRequest<{ statements: { sid: number; text: string }[] }>(apiBase, conversationId, '/statements-public', { signal: controller.current.signal }),
      ]);
      setResults(math.result); setStatements(opinions.statements);
    } catch (e) { if (!(e instanceof Error && e.name === 'AbortError')) setError('目前的統計暫時無法載入，請稍後再試。'); }
    finally { pending.current = false; setBusy(false); }
  }
  const statement = (sid: number) => statements.find(s => s.sid === sid)?.text ?? `觀點 ${sid}`;
  const points = results?.points ?? [];
  const extent = Math.max(0.1, ...points.flatMap(p => [Math.abs(p.x), Math.abs(p.y)]));
  const colors = ['#087879', '#C14E70', '#7458A6', '#9B6716', '#315E85'];
  return <section className="polis-results" id="results" aria-labelledby="results-title">
    <div className="polis-results-heading"><div><p className="section-label">FIND COMMON GROUND</p><h2 id="results-title">看見不同，<br />也找到<span className="highlight">共同的方向。</span></h2></div><button className="button button-outline" type="button" disabled={!configured || busy} onClick={load}>{busy ? '讀取中…' : results ? '更新目前討論' : '看看目前討論'} <Arrow /></button></div>
    <p>以下只整理自願參與者的回應。匿名代號不等於實際人數，分群也不代表政黨、身分或中和全體居民的立場。</p>
    {error && <p className="polis-error" role="alert">{error}</p>}
    {!results ? <p className="polis-results-empty">點選「看看目前討論」，讀取實際回應與意見地圖。不會預先填入參與數字。</p> : <>
      <dl className="polis-statistics"><div><dt>回應代號</dt><dd>{results.nParticipantsTotal}</dd></div><div><dt>表態筆數</dt><dd>{results.nVotes}</dd></div><div><dt>公開觀點</dt><dd>{results.nStatements}</dd></div></dl>
      <div className="polis-results-layout"><div className="polis-map-area">
        <h3>意見地圖</h3>
        {results.k < 2 || !points.length ? <p className="polis-map-empty">目前資料還不足以呈現穩定分群。至少需要 4 個代號各完成 {results.inclusionThreshold} 個觀點，系統才會嘗試分群。</p> : <>
          <svg className="polis-map" viewBox="0 0 500 340" role="img" aria-label="依回應相似度排列的意見地圖，距離相近表示回應較相似"><path d="M250 20v300M20 170h460" stroke="#153f3b33" strokeDasharray="4 6" />{points.map((p, i) => <circle key={i} cx={250 + p.x / extent * 210} cy={170 - p.y / extent * 130} r="5" fill={colors[p.group % colors.length]} opacity=".8" />)}</svg>
          <ul className="polis-map-legend">{results.groups.map(g => <li key={g.id}><i style={{ background: colors[g.id % colors.length] }} aria-hidden="true" />觀點群 {String.fromCharCode(65 + g.id)}：{g.size} 個代號{g.statsRedacted ? '（細節未達公開門檻）' : ''}</li>)}</ul>
        </>}
      </div><div className="polis-common-ground"><h3>目前的共同看法</h3>
        {results.k < 2 ? <p>等到足夠的回應形成分群，才會整理跨群的共同看法。</p> : !results.consensus.agree.length ? <p>目前尚未找到足夠明確的跨群共同看法。</p> : <ol>{results.consensus.agree.slice(0, 5).map(s => <li key={s.sid}>{statement(s.sid)}</li>)}</ol>}
        {configured && <a className="text-link" href={`${apiBase.replace(/\/$/, '')}/r/${conversationId}`} target="_blank" rel="noopener noreferrer">閱讀完整審議報告 <Arrow diagonal /></a>}
      </div></div>
    </>}
  </section>;
}
