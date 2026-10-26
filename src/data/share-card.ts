/** Keep the on-screen QR and downloaded card pointed at the same public site. */
export const SHARE_CARD_SITE_URL = 'https://sunnychen.tw/';
export const SHARE_CARD_SITE_LABEL = new URL(SHARE_CARD_SITE_URL).hostname;
export const SHARE_CARD_QR_LABEL = '掃描，前往網站';
export const SHARE_CARD_ENTRY = '/#share-card';

/** Shared decoration keeps the demo and downloaded PNG visually consistent. */
export const SHARE_CARD_BASEBALL_ART = '/images/share-card-baseball-v1.svg';

export const SHARE_CARD_OPEN_EVENT = 'sunny:open-share-card';
