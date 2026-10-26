import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import PageMotion from '../components/PageMotion';
import '../styles/global.css';

const title = '陳怡君 Sunny Chen｜中和・幸福怡起拚｜新北市議員參選人';
const description = '認識中和陳怡君 Sunny Chen。從大甲的成長故事、16 年旅遊業經歷，到在中和扎根。閱讀怡君的人生故事、關注社群動態，與怡君一起為中和的幸福努力。';
const siteName = '陳怡君 Sunny Chen｜幸福怡起拚';

export const metadata: Metadata = {
  metadataBase: new URL('https://sunnychen.tw'),
  title: { default: title, template: '%s｜陳怡君 Sunny Chen' },
  description,
  alternates: { canonical: '/' },
  icons: { icon: { url: '/favicon.svg', type: 'image/svg+xml' } },
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName,
    title,
    description,
    url: '/',
    images: [{
      url: '/images/social-share.jpg',
      width: 1200,
      height: 630,
      alt: '陳怡君 Sunny Chen，中和幸福怡起拚',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [{ url: '/images/social-share.jpg', alt: '陳怡君 Sunny Chen，中和幸福怡起拚' }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#28C8C8',
};

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://sunnychen.tw/#website',
      url: 'https://sunnychen.tw/',
      name: siteName,
      inLanguage: 'zh-Hant-TW',
    },
    {
      '@type': 'Person',
      '@id': 'https://sunnychen.tw/#person',
      name: '陳怡君',
      alternateName: ['Sunny Chen', '中和超拚 陳怡君Sunny'],
      url: 'https://sunnychen.tw/',
      image: 'https://sunnychen.tw/images/sunny-portrait.webp',
      jobTitle: '新北市中和區市議員參選人',
      sameAs: ['https://www.facebook.com/tppsunny', 'https://www.instagram.com/sunnychentpp/'],
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-Hant-TW">
      <head>
        <link rel="preload" href="/fonts/sunny-noto-tc-v1.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      </head>
      <body>
        <a className="skip-link" href="#main">跳至主要內容</a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <PageMotion />
      </body>
    </html>
  );
}
