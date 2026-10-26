import type { Metadata } from 'next';
import Link from 'next/link';
import './privacy.css';

export const metadata: Metadata = {
  title: { absolute: "隱私權說明｜陳怡君 Sunny Chen" },
  description: "了解陳怡君 Sunny Chen 網站的資料處理方式、外部社群連結與隱私聯絡管道。",
  alternates: { canonical: "https://sunnychen.tw/privacy/" },
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: '陳怡君 Sunny Chen｜幸福怡起拚',
    title: "隱私權說明｜陳怡君 Sunny Chen",
    description: "了解陳怡君 Sunny Chen 網站的資料處理方式、外部社群連結與隱私聯絡管道。",
    url: "https://sunnychen.tw/privacy/",
    images: [{ url: 'https://sunnychen.tw/images/social-share.jpg', width: 1200, height: 630, alt: '陳怡君 Sunny Chen，中和幸福怡起拚' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '隱私權說明｜陳怡君 Sunny Chen',
    description: '了解陳怡君 Sunny Chen 網站的資料處理方式、外部社群連結與隱私聯絡管道。',
    images: ['https://sunnychen.tw/images/social-share.jpg'],
  },
};

const webpageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://sunnychen.tw/privacy/#webpage',
  name: '隱私權說明｜陳怡君 Sunny Chen',
  url: 'https://sunnychen.tw/privacy/',
  description: '了解陳怡君 Sunny Chen 網站的資料處理方式、外部社群連結與隱私聯絡管道。',
  inLanguage: 'zh-Hant-TW',
  isPartOf: { '@id': 'https://sunnychen.tw/#website' },
  about: { '@id': 'https://sunnychen.tw/#person' },
};

export default function PrivacyPage() {
  return (
    <main id="main" className="container privacy-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema).replace(/</g, '\\u003c') }} />
    <Link className="text-link" href="/">返回首頁</Link>
    <h1>隱私權說明</h1><p className="date">更新日期：2026 年 10 月 26 日</p>
    <h2>瀏覽本網站</h2><p>本網站提供陳怡君的個人介紹、人生故事與公開社群連結，沒有會員註冊、捐款、留言或個人資料表單，也未使用廣告追蹤像素或第三方流量分析工具。</p>
    <h2>網站運作資料</h2><p>本網站由 Vercel 提供代管服務。為提供網頁、維護安全與處理連線，代管服務可能處理 IP 位址、瀏覽器資訊、請求時間及技術紀錄。相關資料處理以代管服務供應商的隱私政策為準。</p>
    <h2>外部網站與聯絡</h2><p>Facebook、Messenger、Google 地圖等連結會開啟第三方網站，其資料處理適用各自的隱私政策。透過電話、電子郵件或社群訊息提供的內容，將由該聯絡管道接收；請避免在公開社群留言中揭露身分證字號、醫療紀錄等敏感資料。</p>
    <h2>聯繫我們</h2><p>若對本網站的內容或資料處理有疑問，請來信 <a href="mailto:sunnychentpp@gmail.com">sunnychentpp@gmail.com</a>。</p>
  </main>
  );
}
