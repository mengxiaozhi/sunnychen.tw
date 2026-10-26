import Link from 'next/link';
import BrandMark from './BrandMark';

export default function SiteFooter() {
  const year = new Intl.DateTimeFormat('en', { year: 'numeric', timeZone: 'Asia/Taipei' }).format(new Date());

  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <Link className="brand" href="/" aria-label="陳怡君 Sunny Chen 首頁">
          <BrandMark />
        </Link>
        <p>中和的日常，<br />幸福怡起拚。</p>
        <a className="text-link" href="https://www.facebook.com/tppsunny" target="_blank" rel="noopener noreferrer">
          Facebook <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className="container footer-bottom">
        <span>© {year} 陳怡君 Sunny Chen</span>
        <span>sunnychen.tw</span>
        <nav className="footer-links" aria-label="網站資訊">
          <a href="https://github.com/mengxiaozhi/sunnychen.tw" target="_blank" rel="noopener noreferrer">GitHub 開放原始碼 <span aria-hidden="true">↗</span></a>
          <Link href="/license/">開源與授權書</Link>
          <Link href="/privacy/">隱私權說明</Link>
        </nav>
      </div>
    </footer>
  );
}
