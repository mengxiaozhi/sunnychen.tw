import type { Metadata } from 'next';
import Link from 'next/link';
import './not-found.css';

export const metadata: Metadata = {
  title: { absolute: "找不到這一頁｜陳怡君 Sunny Chen" },
  description: "這一頁暫時找不到，回到首頁繼續認識陳怡君的人生故事。",
  alternates: { canonical: "https://sunnychen.tw/404/" },
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: '陳怡君 Sunny Chen｜幸福怡起拚',
    title: "找不到這一頁｜陳怡君 Sunny Chen",
    description: "這一頁暫時找不到，回到首頁繼續認識陳怡君的人生故事。",
    url: "https://sunnychen.tw/404/",
    images: [{ url: 'https://sunnychen.tw/images/social-share.jpg', width: 1200, height: 630, alt: '陳怡君 Sunny Chen，中和幸福怡起拚' }],
  },
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main id="main" className="container not-found-page"><span className="error-number" aria-hidden="true">404</span><p className="section-label">404 · PAGE NOT FOUND</p><h1>這一頁，還沒寫下。</h1><p>回到首頁，繼續翻開怡君的故事。</p><Link className="button" href="/">回到首頁</Link></main>
  );
}
