import Link from 'next/link';
import BrandMark from './BrandMark';
import Arrow from './Arrow';

const socialLinks = [
  { name: 'Facebook', href: 'https://www.facebook.com/share/19dWyQKa3o/' },
  { name: 'Instagram', href: 'https://www.instagram.com/sunnychentpp' },
  { name: 'Threads', href: 'https://www.threads.com/@sunnychentpp' },
  { name: 'YouTube', href: 'https://youtube.com/channel/UClPZECXX3FfZWvuThCpoGaA' },
];

export default function SiteFooter() {
  const year = new Intl.DateTimeFormat('en', { year: 'numeric', timeZone: 'Asia/Taipei' }).format(new Date());

  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <Link className="brand" href="/" aria-label="陳怡君 Sunny Chen 首頁">
          <BrandMark />
        </Link>
        <p>中和的日常，<br />幸福怡起拚。</p>
        <nav className="footer-socials" aria-label="社群連結">
          {socialLinks.map(({ name, href }) => (
            <a className="text-link" href={href} key={name} target="_blank" rel="noopener noreferrer" aria-label={`${name}（另開新視窗）`}>
              {name}<Arrow diagonal />
            </a>
          ))}
        </nav>
      </div>
      <div className="container footer-bottom">
        <span>© {year} 陳怡君 Sunny Chen</span>
        <span>sunnychen.tw</span>
        <nav className="footer-links" aria-label="網站資訊">
          <a href="https://github.com/mengxiaozhi/sunnychen.tw" target="_blank" rel="noopener noreferrer">GitHub 開放原始碼 <span aria-hidden="true">↗</span></a>
          <Link href="/license/">開源與授權書</Link>
          <Link href="/privacy/">隱私權說明</Link>
          <Link href="/deliberation/">公共議題</Link>
        </nav>
      </div>
    </footer>
  );
}
