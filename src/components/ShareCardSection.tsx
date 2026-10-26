import QRCode from 'qrcode';
import { deliberationConfig } from '../data/deliberation';
import { SHARE_CARD_SITE_URL } from '../data/share-card';
import DeliberationShareCard from './DeliberationShareCard';

export default async function ShareCardSection() {
  const siteQrDataUrl = await QRCode.toDataURL(SHARE_CARD_SITE_URL, {
    width: 264,
    margin: 4,
    errorCorrectionLevel: 'M',
    color: { dark: '#153F3B', light: '#FFFFFF' },
  });

  return (
    <DeliberationShareCard
      googleClientId={deliberationConfig.googleClientId}
      googleEnabled={deliberationConfig.googleShareEnabled}
      siteQrDataUrl={siteQrDataUrl}
    />
  );
}
