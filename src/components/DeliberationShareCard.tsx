'use client';

import Link from 'next/link';
import NextImage from 'next/image';
import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { SHARE_CARD_QR_LABEL, SHARE_CARD_SITE_LABEL, SHARE_CARD_SITE_URL } from '../data/share-card';
import './deliberation-share-card.css';

const DISCUSSION_URL = 'https://sunnychen.tw/deliberation/';
const GOOGLE_SCRIPT = 'https://accounts.google.com/gsi/client';
const CARD_FONT = '"Noto Sans TC Variable", "PingFang TC", "Microsoft JhengHei", sans-serif';
const INK = '#153F3B';
const TEAL = '#28C8C8';
const PINK = '#F6B1AA';
const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

type Profile = { name: string; avatar: string | null };
type Phase = 'idle' | 'loading-google' | 'google-ready' | 'verifying' | 'rendering' | 'ready' | 'error';
type GoogleIdentity = {
  initialize: (options: {
    client_id: string; nonce: string; callback: (response: { credential?: string }) => void;
    auto_select: false; button_auto_select: false; ux_mode: 'popup';
  }) => void;
  renderButton: (parent: HTMLElement, options: {
    type: 'standard'; theme: 'outline'; size: 'large'; text: 'continue_with';
    shape: 'pill'; locale: string; width: string;
  }) => void;
  disableAutoSelect: () => void;
};

// Only the script-loading promise is shared. No profile or credential is stored here.
let googleScriptPromise: Promise<GoogleIdentity> | null = null;
const googleIdentity = () => (window as unknown as { google?: { accounts?: { id?: GoogleIdentity } } }).google?.accounts?.id;
const aborted = () => new DOMException('Cancelled', 'AbortError');

function loadGoogleScript(): Promise<GoogleIdentity> {
  const loaded = googleIdentity();
  if (loaded) return Promise.resolve(loaded);
  if (googleScriptPromise) return googleScriptPromise;
  googleScriptPromise = new Promise<GoogleIdentity>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = GOOGLE_SCRIPT;
    script.async = true;
    script.defer = true;
    const timeout = window.setTimeout(() => fail(), 15000);
    const clean = () => { window.clearTimeout(timeout); script.onload = null; script.onerror = null; };
    const fail = () => { clean(); script.remove(); reject(new Error('Google 登入暫時無法載入。')); };
    script.onload = () => {
      const identity = googleIdentity();
      if (!identity) { fail(); return; }
      clean(); resolve(identity);
    };
    script.onerror = fail;
    document.head.appendChild(script);
  }).catch(error => { googleScriptPromise = null; throw error; });
  return googleScriptPromise;
}

function awaitActive<T>(promise: PromiseLike<T>, signal: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) { reject(aborted()); return; }
    const cancel = () => { clean(); reject(aborted()); };
    const timeout = window.setTimeout(() => { clean(); reject(new Error('製作小卡逾時。')); }, 15000);
    const clean = () => { window.clearTimeout(timeout); signal.removeEventListener('abort', cancel); };
    signal.addEventListener('abort', cancel, { once: true });
    Promise.resolve(promise).then(value => { clean(); resolve(value); }, error => { clean(); reject(error); });
  });
}

function loadImage(source: string, signal: AbortSignal): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) { reject(aborted()); return; }
    const image = new Image();
    const clean = () => {
      window.clearTimeout(timeout);
      signal.removeEventListener('abort', cancel);
      image.onload = null; image.onerror = null;
    };
    const cancel = () => { clean(); image.removeAttribute('src'); reject(aborted()); };
    const fail = () => { clean(); image.removeAttribute('src'); reject(new Error('小卡圖片無法載入。')); };
    const timeout = window.setTimeout(fail, 12000);
    image.onload = () => {
      if (!image.naturalWidth || !image.naturalHeight) { fail(); return; }
      clean(); resolve(image);
    };
    image.onerror = fail;
    signal.addEventListener('abort', cancel, { once: true });
    image.src = source;
  });
}

function graphemes(text: string): string[] {
  return typeof Intl.Segmenter === 'function'
    ? Array.from(new Intl.Segmenter('zh-Hant', { granularity: 'grapheme' }).segment(text), part => part.segment)
    : Array.from(text);
}

async function localAvatar(file: File, signal: AbortSignal): Promise<string> {
  if (!PHOTO_TYPES.includes(file.type) || !file.size || file.size > MAX_PHOTO_BYTES) throw new Error('請選擇 10 MB 以內的 JPG、PNG 或 WebP 照片。');
  const header = new Uint8Array(await awaitActive(file.slice(0, 12).arrayBuffer(), signal));
  const matchesType = file.type === 'image/jpeg' ? header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff
    : file.type === 'image/png' ? [137,80,78,71,13,10,26,10].every((byte, index) => header[index] === byte)
    : String.fromCharCode(...header.slice(0, 4)) === 'RIFF' && String.fromCharCode(...header.slice(8, 12)) === 'WEBP';
  if (!matchesType) throw new Error('照片無法讀取，請改選 JPG、PNG 或 WebP 照片。');
  const source = URL.createObjectURL(file);
  let image: HTMLImageElement | null = null;
  const canvas = document.createElement('canvas');
  try {
    image = await loadImage(source, signal);
    if (signal.aborted) throw aborted();
    if (image.naturalWidth * image.naturalHeight > 50_000_000) throw new Error('照片尺寸太大，請選擇較小的照片。');
    canvas.width = 256; canvas.height = 256;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('這個瀏覽器無法處理照片。');
    const side = Math.min(image.naturalWidth, image.naturalHeight);
    context.fillStyle = '#FFFFFF'; context.fillRect(0, 0, 256, 256);
    context.drawImage(image, (image.naturalWidth - side) / 2, (image.naturalHeight - side) / 2, side, side, 0, 0, 256, 256);
    return canvas.toDataURL('image/jpeg', .9);
  } catch (error) {
    if (signal.aborted) throw aborted();
    if (error instanceof Error && error.message === '照片尺寸太大，請選擇較小的照片。') throw error;
    throw new Error('照片無法讀取，請改選 JPG、PNG 或 WebP 照片。');
  } finally {
    image?.removeAttribute('src'); URL.revokeObjectURL(source);
    canvas.width = 0; canvas.height = 0;
  }
}

function wrapText(context: CanvasRenderingContext2D, text: string, width: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const character of graphemes(text)) {
    if (line && context.measureText(line + character).width > width) { lines.push(line); line = character; }
    else line += character;
  }
  if (line) lines.push(line);
  return lines;
}

function drawName(context: CanvasRenderingContext2D, name: string) {
  let size = 54;
  let lines: string[] = [];
  for (; size >= 28; size -= 2) {
    context.font = `800 ${size}px ${CARD_FONT}`;
    lines = wrapText(context, name, 620);
    if (lines.length <= 3 && lines.length * size * 1.28 <= 150) break;
  }
  size = Math.max(size, 28);
  context.font = `800 ${size}px ${CARD_FONT}`;
  lines = wrapText(context, name, 620);
  if (lines.length > 3) {
    lines = lines.slice(0, 3);
    let last = graphemes(lines[2]);
    while (last.length && context.measureText(last.join('') + '…').width > 620) last.pop();
    lines[2] = last.join('') + '…';
  }
  const height = lines.length * size * 1.28;
  context.fillStyle = INK;
  context.textBaseline = 'top';
  lines.forEach((line, index) => context.fillText(line, 300, 585 - height / 2 + index * size * 1.28));
}

function star(context: CanvasRenderingContext2D, x: number, y: number, radius: number) {
  context.beginPath();
  for (let index = 0; index < 8; index++) {
    const angle = index * Math.PI / 4 - Math.PI / 2;
    const distance = index % 2 ? radius * 0.27 : radius;
    const px = x + Math.cos(angle) * distance, py = y + Math.sin(angle) * distance;
    if (index === 0) context.moveTo(px, py); else context.lineTo(px, py);
  }
  context.closePath(); context.fill();
}

async function createCard(profile: Profile, signal: AbortSignal): Promise<Blob> {
  const avatarSource = profile.avatar && /^data:image\/(?:png|jpeg|webp|gif);base64,/i.test(profile.avatar) ? profile.avatar : null;
  const [qrCode, logo, avatar] = await Promise.all([
    awaitActive(import('qrcode'), signal),
    loadImage('/images/sunny-logo-v1.png', signal),
    avatarSource ? loadImage(avatarSource, signal).catch(error => { if (signal.aborted) throw error; return null; }) : Promise.resolve(null),
    awaitActive(document.fonts.ready, signal),
  ]);
  if (signal.aborted) throw aborted();

  const canvas = document.createElement('canvas');
  canvas.width = 1080; canvas.height = 1350;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('這個瀏覽器無法製作圖片。');
  const erase = () => { context.clearRect(0, 0, canvas.width, canvas.height); canvas.width = 0; canvas.height = 0; };
  signal.addEventListener('abort', erase, { once: true });
  try {
    context.fillStyle = TEAL; context.fillRect(0, 0, 1080, 1350);
    context.textBaseline = 'top'; context.fillStyle = INK;
    context.font = `800 28px ${CARD_FONT}`; context.fillText('中和公共議題', 76, 64);
    context.fillStyle = PINK; star(context, 947, 103, 45);
    context.save(); context.translate(93, 394); context.rotate(-0.025);
    context.fillRect(0, 0, 855, 35); context.restore();
    context.font = `italic 900 116px ${CARD_FONT}`; context.lineWidth = 13;
    context.strokeStyle = '#FFFFFF'; context.lineJoin = 'round'; context.fillStyle = INK;
    for (const [text, y] of [['我關心', 155], ['中和的日常', 285]] as const) {
      context.strokeText(text, 80, y); context.fillText(text, 80, y);
    }

    context.fillStyle = PINK; context.fillRect(84, 484, 930, 230);
    context.fillStyle = '#FFFFFF'; context.fillRect(70, 470, 930, 230);
    context.strokeStyle = INK; context.lineWidth = 3; context.strokeRect(70, 470, 930, 230);
    context.save(); context.beginPath(); context.arc(175, 585, 74, 0, Math.PI * 2); context.clip();
    context.fillStyle = PINK; context.fillRect(101, 511, 148, 148);
    if (avatar) {
      const side = Math.min(avatar.naturalWidth, avatar.naturalHeight);
      context.drawImage(avatar, (avatar.naturalWidth - side) / 2, (avatar.naturalHeight - side) / 2, side, side, 101, 511, 148, 148);
    } else {
      const initial = graphemes(profile.name.trim())[0] || '我';
      context.fillStyle = INK; context.font = `800 64px ${CARD_FONT}`;
      context.textAlign = 'center'; context.textBaseline = 'middle'; context.fillText(initial, 175, 585, 118);
    }
    context.restore(); context.strokeStyle = INK; context.lineWidth = 3;
    context.beginPath(); context.arc(175, 585, 74, 0, Math.PI * 2); context.stroke();
    drawName(context, profile.name);

    context.textBaseline = 'top'; context.fillStyle = INK;
    context.font = `900 64px ${CARD_FONT}`;
    context.fillText('中和的下一步，', 80, 776);
    context.fillText('怡起聊聊。', 80, 867);
    context.fillStyle = PINK; star(context, 910, 868, 65);
    context.fillStyle = INK; context.fillRect(0, 993, 1080, 4);
    context.fillStyle = '#FFFFFF'; context.fillRect(0, 997, 1080, 353);
    const logoScale = Math.min(440 / logo.naturalWidth, 144 / logo.naturalHeight);
    context.drawImage(logo, 72, 1080, logo.naturalWidth * logoScale, logo.naturalHeight * logoScale);
    context.fillStyle = INK; context.font = `700 26px ${CARD_FONT}`;
    context.fillText(SHARE_CARD_SITE_LABEL, 76, 1260);
    const qr = document.createElement('canvas');
    await qrCode.toCanvas(qr, SHARE_CARD_SITE_URL, { width: 264, margin: 4, errorCorrectionLevel: 'M', color: { dark: INK, light: '#FFFFFF' } });
    if (signal.aborted) throw aborted();
    context.drawImage(qr, 738, 1039, 264, 264);
    context.font = `700 22px ${CARD_FONT}`; context.textAlign = 'center';
    context.fillText(SHARE_CARD_QR_LABEL, 870, 1312);
    const blob = await awaitActive(new Promise<Blob>((resolve, reject) => canvas.toBlob(result => result ? resolve(result) : reject(new Error('無法產生 PNG。')), 'image/png')), signal);
    if (signal.aborted) throw aborted();
    return blob;
  } finally {
    signal.removeEventListener('abort', erase);
    erase();
    avatar?.removeAttribute('src');
  }
}

export default function DeliberationShareCard({ googleClientId, googleEnabled = false, siteQrDataUrl }: { googleClientId: string; googleEnabled?: boolean; siteQrDataUrl: string }) {
  const titleId = useId();
  const nameId = useId();
  const photoId = useId();
  const [name, setName] = useState('');
  const [photoName, setPhotoName] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [preview, setPreview] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [manualCopy, setManualCopy] = useState(false);
  const [sharing, setSharing] = useState(false);
  const alive = useRef(false);
  const generation = useRef(0);
  const request = useRef<AbortController | null>(null);
  const profile = useRef<Profile | null>(null);
  const imageBlob = useRef<Blob | null>(null);
  const imageUrl = useRef<string | null>(null);
  const identity = useRef<GoogleIdentity | null>(null);
  const googleButton = useRef<HTMLDivElement>(null);
  const photoInput = useRef<HTMLInputElement>(null);
  const photo = useRef<File | null>(null);
  const verifying = useRef(false);
  const configured = googleEnabled && Boolean(googleClientId.trim());
  const busy = phase === 'loading-google' || phase === 'verifying' || phase === 'rendering';
  const current = (attempt: number) => alive.current && generation.current === attempt;
  const releaseImage = () => {
    if (imageUrl.current) URL.revokeObjectURL(imageUrl.current);
    imageUrl.current = null; imageBlob.current = null;
  };

  useEffect(() => {
    alive.current = true;
    const clearOnPageHide = () => { reset(); };
    window.addEventListener('pagehide', clearOnPageHide);
    return () => {
      window.removeEventListener('pagehide', clearOnPageHide);
      alive.current = false; generation.current++;
      request.current?.abort(); request.current = null;
      identity.current?.disableAutoSelect(); identity.current = null;
      profile.current = null; photo.current = null; verifying.current = false;
      releaseImage();
    };
  }, []);

  useEffect(() => {
    const host = googleButton.current;
    if (!host) return;
    host.replaceChildren();
    if (phase !== 'google-ready' || !identity.current) return;
    let previousWidth = 0;
    const render = () => {
      const width = Math.max(200, Math.min(320, Math.floor(host.clientWidth)));
      if (width === previousWidth) return;
      previousWidth = width; host.replaceChildren();
      identity.current?.renderButton(host, { type: 'standard', theme: 'outline', size: 'large', text: 'continue_with', shape: 'pill', locale: 'zh_TW', width: String(width) });
    };
    render();
    const observer = new ResizeObserver(render); observer.observe(host);
    return () => { observer.disconnect(); host.replaceChildren(); };
  }, [phase]);

  const build = async (person: Profile, attempt: number, signal: AbortSignal) => {
    const blob = await createCard(person, signal);
    if (!current(attempt)) return;
    releaseImage(); imageBlob.current = blob; imageUrl.current = URL.createObjectURL(blob);
    setPreview(imageUrl.current); setPhase('ready');
    setFeedback('小卡已做好。你可以先看預覽，再下載或分享。');
  };

  const receiveCredential = async (credential: string | undefined, attempt: number, controller: AbortController) => {
    if (!current(attempt) || verifying.current) return;
    if (!credential) { setPhase('error'); setFeedback('沒有收到 Google 登入資料，請重新準備登入。'); return; }
    verifying.current = true; setPhase('verifying'); setFeedback('正在驗證 Google 登入…');
    try {
      const response = await fetch('/api/share-card/google', {
        method: 'POST', credentials: 'same-origin', cache: 'no-store', signal: controller.signal,
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ credential }),
      });
      if (!response.ok) throw new Error('驗證未完成。');
      const data: { profile?: { name?: unknown; avatar?: unknown } } = await response.json();
      if (!current(attempt)) return;
      if (typeof data.profile?.name !== 'string' || !data.profile.name.trim()) throw new Error('登入資料不完整。');
      const person = {
        name: data.profile.name.replace(/[\u0000-\u001f\u007f-\u009f]/g, '').replace(/\s+/g, ' ').trim(),
        avatar: typeof data.profile.avatar === 'string' ? data.profile.avatar : null,
      };
      if (!person.name) throw new Error('登入資料不完整。');
      profile.current = person; setPhase('rendering'); setFeedback('正在製作你的分享小卡…');
      await build(person, attempt, controller.signal);
    } catch {
      if (!current(attempt) || controller.signal.aborted) return;
      setPhase('error'); setFeedback(profile.current ? '小卡製作暫時未完成，請再試一次。' : 'Google 登入驗證未完成或已逾時，請重新準備登入。');
    } finally { if (current(attempt)) verifying.current = false; }
  };

  const start = async () => {
    if (!configured || busy) return;
    const attempt = ++generation.current;
    request.current?.abort();
    const controller = new AbortController(); request.current = controller;
    verifying.current = false; setFeedback(''); setManualCopy(false);
    profile.current = null; releaseImage(); setPreview(null);
    setPhase('loading-google'); setFeedback('正在準備 Google 登入…');
    try {
      const [google, response] = await Promise.all([
        loadGoogleScript(),
        fetch('/api/share-card/google/nonce', { credentials: 'same-origin', cache: 'no-store', signal: controller.signal }),
      ]);
      if (!response.ok) throw new Error('Google 登入尚未就緒。');
      const data: { nonce?: unknown; clientId?: unknown } = await response.json();
      if (!current(attempt)) return;
      if (typeof data.nonce !== 'string' || !data.nonce || data.clientId !== googleClientId.trim()) throw new Error('Google 登入設定不一致。');
      identity.current = google;
      google.initialize({ client_id: googleClientId.trim(), nonce: data.nonce, auto_select: false, button_auto_select: false, ux_mode: 'popup', callback: result => { void receiveCredential(result.credential, attempt, controller); } });
      setPhase('google-ready'); setFeedback('請使用下方 Google 官方按鈕，選擇製卡使用的帳號。');
    } catch {
      if (!current(attempt) || controller.signal.aborted) return;
      setPhase('error'); setFeedback('Google 登入暫時無法使用，請稍後重試。');
    }
  };

  const invalidateDraft = () => {
    generation.current++; request.current?.abort(); request.current = null;
    identity.current?.disableAutoSelect(); identity.current = null;
    googleButton.current?.replaceChildren(); profile.current = null; verifying.current = false;
    releaseImage(); setPreview(null); setPhase('idle'); setSharing(false); setManualCopy(false); setFeedback('');
  };

  const choosePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    invalidateDraft(); photo.current = null; setPhotoName(''); setPhotoError('');
    if (!PHOTO_TYPES.includes(file.type) || !file.size || file.size > MAX_PHOTO_BYTES) {
      event.currentTarget.value = ''; setPhotoError('請選擇 10 MB 以內的 JPG、PNG 或 WebP 照片。'); return;
    }
    photo.current = file; setPhotoName(file.name);
  };

  const createLocalCard = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy || sharing || photoError) return;
    const cleanName = name.replace(/[\u0000-\u001f\u007f-\u009f]/g, '').replace(/\s+/g, ' ').trim();
    if (!cleanName) { setFeedback('請先填寫你想顯示的稱呼。'); return; }
    const attempt = ++generation.current;
    request.current?.abort(); const controller = new AbortController(); request.current = controller;
    identity.current?.disableAutoSelect(); identity.current = null; googleButton.current?.replaceChildren();
    profile.current = null; verifying.current = false; releaseImage(); setPreview(null); setManualCopy(false);
    setPhase('rendering'); setFeedback('正在製作你的中和小卡…');
    try {
      const avatar = photo.current ? await localAvatar(photo.current, controller.signal) : null;
      if (!current(attempt) || controller.signal.aborted) return;
      const person = { name: cleanName, avatar }; profile.current = person;
      await build(person, attempt, controller.signal);
    } catch (error) {
      if (!current(attempt) || controller.signal.aborted) return;
      setPhase('error'); setFeedback(error instanceof Error && error.message.startsWith('照片') ? error.message : '小卡製作暫時未完成，請再試一次。');
    }
  };

  const reset = () => {
    invalidateDraft(); photo.current = null; setName(''); setPhotoName(''); setPhotoError('');
    if (photoInput.current) photoInput.current.value = '';
    setFeedback('已清除此頁的小卡與個人資料。');
  };

  const copyDiscussion = async (attempt: number, prefix: string) => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(DISCUSSION_URL);
      if (current(attempt)) { setManualCopy(false); setFeedback(`${prefix}已複製討論網址，尚未發布任何內容。`); }
    } catch {
      if (current(attempt)) { setManualCopy(true); setFeedback(`${prefix}無法自動複製，請手動複製下方討論網址。`); }
    }
  };

  const share = async () => {
    if (!imageBlob.current || sharing) return;
    const attempt = generation.current;
    setSharing(true);
    try {
      const file = typeof File === 'function' ? new File([imageBlob.current], 'zhonghe-share-card.png', { type: 'image/png' }) : null;
      let canShareFile = false;
      try { canShareFile = Boolean(file && navigator.canShare?.({ files: [file] })); } catch { /* Use the URL fallback. */ }
      if (file && navigator.share && canShareFile) {
        try {
          await navigator.share({ files: [file], title: '我關心中和的日常', text: '中和的下一步，怡起聊聊。', url: DISCUSSION_URL });
          if (current(attempt)) setFeedback('已交給你選擇的分享工具；是否發布依該工具中的操作為準。');
        } catch (error) {
          if (!current(attempt)) return;
          if (error instanceof DOMException && error.name === 'AbortError') setFeedback('已取消分享。');
          else await copyDiscussion(attempt, '圖片分享未完成。');
        }
      } else await copyDiscussion(attempt, '這個瀏覽器不支援圖片分享。');
    } finally { if (current(attempt)) setSharing(false); }
  };

  return (
    <section id="share-card" className="deliberation-share-card" aria-labelledby={titleId}>
      <div className="container share-card-layout">
        <div className="share-card-copy">
          <p className="share-card-eyebrow">一張小卡，連結中和日常</p>
          <h2 id={titleId} className="share-card-title">你的中和小卡，<br />分享日常的關心。</h2>
          <p className="share-card-intro">填上稱呼、選一張照片，就能製作你的中和小卡。不必登入，小卡也附有本站 QR Code。</p>
          <p className="share-card-privacy">稱呼與照片只在你的瀏覽器內製卡，不會上傳，也不會連結議題表態。下載與分享由你決定。<Link href="/privacy/#local-share">了解資料處理方式</Link></p>
          <div className="share-card-controls" aria-busy={busy}>
            <form className="share-card-form" onSubmit={event => { void createLocalCard(event); }}>
              <fieldset disabled={busy || sharing}>
                <legend className="sr-only">你的製卡資料</legend>
                <label htmlFor={nameId}>你想顯示的稱呼</label>
                <input id={nameId} type="text" value={name} required maxLength={40} autoComplete="off" placeholder="例如：中和好鄰居" onChange={event => { invalidateDraft(); setName(event.currentTarget.value); }} />
                <label htmlFor={photoId}>選擇照片 <span>（選填）</span></label>
                <input ref={photoInput} id={photoId} type="file" accept="image/jpeg,image/png,image/webp" aria-describedby={`${photoId}-help${photoError ? ` ${photoId}-error` : ''}`} aria-invalid={Boolean(photoError)} onChange={choosePhoto} />
                <p id={`${photoId}-help`} className="share-card-photo-help">JPG、PNG 或 WebP，10 MB 以內。照片會置中裁成圓形；不選照片也能製作。</p>
                {photoError && <p id={`${photoId}-error`} className="share-card-photo-error" role="alert">{photoError}</p>}
                {(photoName || photoError) && <button className="share-card-remove-photo" type="button" onClick={() => { invalidateDraft(); photo.current = null; setPhotoName(''); setPhotoError(''); if (photoInput.current) photoInput.current.value = ''; }}>不使用照片</button>}
                <button type="submit" className="share-card-start" disabled={busy || sharing || Boolean(photoError)}>{busy ? '正在準備…' : preview ? '重新製作小卡' : '製作我的小卡'} <span aria-hidden="true">↗</span></button>
              </fieldset>
            </form>
            {configured ? (phase !== 'google-ready' && <button type="button" className="share-card-google-start" onClick={() => { void start(); }} disabled={busy || sharing}>用 Google 帶入姓名與頭像</button>) : <p className="share-card-unconfigured">Google 帶入功能維護中，填寫上方資料就能製卡。</p>}
            <div ref={googleButton} className="share-card-google" hidden={phase !== 'google-ready'} />
            {preview && phase === 'ready' && (
              <div className="share-card-actions">
                <a className="share-card-download" href={preview} download="zhonghe-share-card.png" onClick={() => setFeedback('已交給瀏覽器下載，請查看裝置的下載項目。')}>下載 PNG <span aria-hidden="true">↓</span></a>
                <button type="button" className="share-card-share" onClick={() => { void share(); }} disabled={sharing}>{sharing ? '開啟分享中…' : '分享小卡'} <span aria-hidden="true">↗</span></button>
              </div>
            )}
            {(phase !== 'idle' || name || photoName || photoError) && <button type="button" className="share-card-reset" onClick={reset}>清除小卡資料</button>}
          </div>
          <p className="share-card-feedback" role="status" aria-live="polite">{feedback}</p>
          {manualCopy && <label className="share-card-manual-copy">討論網址<input type="text" value={DISCUSSION_URL} readOnly onFocus={event => event.currentTarget.select()} /></label>}
          <p className="share-card-note">小卡不包含你的表態選擇，也沒有公開個人網址。清除資料或離開此頁後，不會保留稱呼與照片。</p>
          <noscript><p className="share-card-note">製作小卡需要 JavaScript；你仍可閱讀議題與資料處理說明。</p></noscript>
        </div>
        <figure className="share-card-preview">
          {preview ? <img src={preview} width="1080" height="1350" alt="你的個人分享小卡：我關心中和的日常。中和的下一步，怡起聊聊。包含你的稱呼、頭像與本站首頁 QR Code。" /> : (
            <div className="share-card-demo" aria-label="分享小卡版型示意，尚未加入個人姓名與頭像">
              <span className="share-card-demo-kicker">中和公共議題</span>
              <p className="share-card-demo-title">我關心<br />中和的日常</p>
              <p className="share-card-demo-person">填上稱呼，加入<br />你的生活日常</p>
              <p className="share-card-demo-message">中和的下一步，<br />怡起聊聊。</p>
              <div className="share-card-demo-footer"><div className="share-card-demo-brand"><NextImage src="/images/sunny-logo-v1.png" alt="陳怡君 Sunny Chen" width={2172} height={724} sizes="(max-width:700px) 160px, 195px" loading="lazy" /><span>{SHARE_CARD_SITE_LABEL}</span></div><div className="share-card-demo-qr"><img src={siteQrDataUrl} width="264" height="264" alt={`本站首頁 QR Code：${SHARE_CARD_SITE_URL}`} /><span>{SHARE_CARD_QR_LABEL}</span></div></div>
            </div>
          )}
          <figcaption>{preview ? '個人小卡預覽 · PNG 1080 × 1350' : '製卡示意 · 尚未加入個人資料'}</figcaption>
        </figure>
      </div>
    </section>
  );
}
