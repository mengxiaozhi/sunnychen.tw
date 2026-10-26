import type { Metadata } from 'next';
import Link from 'next/link';
import { chapters, storyPages } from '../../data/story';
import './story.css';

export const metadata: Metadata = {
  title: { absolute: "陳怡君的人生故事｜從大甲到中和，幸福怡起拚" },
  description: "閱讀中和市議員參選人陳怡君的人生故事：大甲農村的成長、棒球與辯論社的啟蒙、旅遊業 16 年，以及在中和扎根的歷程。",
  alternates: { canonical: "https://sunnychen.tw/story/" },
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: '陳怡君 Sunny Chen｜幸福怡起拚',
    title: "陳怡君的人生故事｜從大甲到中和，幸福怡起拚",
    description: "閱讀中和市議員參選人陳怡君的人生故事：大甲農村的成長、棒球與辯論社的啟蒙、旅遊業 16 年，以及在中和扎根的歷程。",
    url: "https://sunnychen.tw/story/",
    images: [{ url: 'https://sunnychen.tw/images/social-share.jpg', width: 1200, height: 630, alt: '陳怡君 Sunny Chen，中和幸福怡起拚' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '陳怡君的人生故事｜從大甲到中和，幸福怡起拚',
    description: '閱讀中和市議員參選人陳怡君的人生故事：大甲農村的成長、棒球與辯論社的啟蒙、旅遊業 16 年，以及在中和扎根的歷程。',
    images: ['https://sunnychen.tw/images/social-share.jpg'],
  },
};

const webpageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://sunnychen.tw/story/#webpage',
  name: '陳怡君的人生故事｜從大甲到中和，幸福怡起拚',
  url: 'https://sunnychen.tw/story/',
  description: '閱讀中和市議員參選人陳怡君的人生故事：大甲農村的成長、棒球與辯論社的啟蒙、旅遊業 16 年，以及在中和扎根的歷程。',
  inLanguage: 'zh-Hant-TW',
  isPartOf: { '@id': 'https://sunnychen.tw/#website' },
  about: { '@id': 'https://sunnychen.tw/#person' },
};

export default function StoryPage() {
  return (
  <main id="main" className="story-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema).replace(/</g, '\\u003c') }} />
    <div className="story-intro-band">
    <header className="story-intro container">
      <Link className="text-link back-home" href="/">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M19 12H5m7-7-7 7 7 7" /></svg>
        回到首頁
      </Link>
      <p className="section-label">THE STORY OF SUNNY CHEN</p>
      <h1>從大甲到中和，<br /><span>這是我的故事。</span></h1>
      <p className="intro-copy">這不只是一場選舉，<br />而是用一整段人生，寫下的回應。</p>
      <div className="intro-bottom">
        <span className="story-signature">陳怡君 <small>SUNNY CHEN</small></span>
        <span className="intro-note">每一段人生，都是走向你的路。</span>
      </div>
    </header>
    </div>

    <nav className="chapter-nav" aria-label="故事章節">
      <div className="container chapter-nav-inner">
        {chapters.map((chapter, index) => (
          <Link key={chapter.id} href={`#${chapter.id}`}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            {chapter.label}
          </Link>
        ))}
      </div>
    </nav>

    <div className="container chapter-list">
      {chapters.map((chapter, index) => (
        <article id={chapter.id} className={`story-chapter${index % 2 === 1 ? ' reverse' : ''}`} key={chapter.id}>
          <figure className="chapter-photo">
            <a href={chapter.image} target="_blank" rel="noopener" aria-label={`開啟原書頁圖片：${chapter.caption}（新分頁）`}>
              <img src={chapter.image} srcSet={`${chapter.image.replace(".webp", "-640.webp")} 640w, ${chapter.image} 1020w`} sizes="(max-width:620px) 90vw, 45vw" alt={chapter.alt} width="1020" height="1360" loading="lazy" decoding="async" />
            </a>
            <figcaption>{chapter.caption}</figcaption>
          </figure>
          <div className="chapter-copy">
            <div className="chapter-number"><span>{String(index + 1).padStart(2, '0')}</span><b>／{chapter.label}</b><i aria-hidden="true"></i></div>
            <p className="chapter-kicker">{chapter.kicker}</p>
            <h2>{chapter.title}</h2>
            <div className="chapter-paragraphs">
              {chapter.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
        </article>
      ))}
    </div>

    <section className="story-pause" aria-labelledby="pause-title">
      <div className="container pause-inner">
        <p className="section-label">故事，還在繼續。</p>
        <h2 id="pause-title">但人生的考驗，<br />從未預告。</h2>
        <p>更多怡君的故事與日常，<br className="mobile-break" />在 Facebook 繼續與你分享。</p>
        <a className="button" href="https://www.facebook.com/tppsunny" target="_blank" rel="noopener noreferrer">
          追蹤怡君的 Facebook
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
        </a>
      </div>
    </section>

    <section className="book-gallery container" aria-labelledby="gallery-title">
      <div className="gallery-heading">
        <div>
          <p className="section-label">THE ORIGINAL PAGES</p>
          <h2 id="gallery-title">一頁一頁，讀我的故事。</h2>
        </div>
        <p>點選書頁，在新分頁放大閱讀。</p>
      </div>
      <ol className="book-pages">
        {storyPages.map((page, index) => (
          <li key={page.image}>
            <a href={page.image} target="_blank" rel="noopener" aria-label={`${page.label}，在新分頁放大閱讀`}>
              <img src={page.image.replace(".webp", "-640.webp")} alt={page.label} width="1020" height="1360" loading="lazy" decoding="async" />
              <span><b>{String(index + 1).padStart(2, '0')}</b>{page.label}</span>
            </a>
          </li>
        ))}
      </ol>
      <p className="source-note">本頁文字整理自陳怡君故事書；書頁保留原始照片，保留提供書頁的文字與設計。</p>
    </section>
  </main>
  );
}
