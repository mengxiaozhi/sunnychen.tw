import { Fragment } from 'react';
import Link from 'next/link';
import Arrow from '../components/Arrow';
import ChapterTabs from '../components/ChapterTabs';
import Spark from '../components/Spark';
import { chapters } from '../data/story';
import './home.css';

const facebook = 'https://www.facebook.com/tppsunny';
const socialPost = 'https://www.facebook.com/tppsunny/posts/pfbid08bRweq7izojATemqG2o6mi5eQUJabMqSgYt6hjuB2PAjBKvkjnHDHP5JibqhisU7l';
const schema = {
  '@context': 'https://schema.org', '@type': 'WebPage',
  '@id': 'https://sunnychen.tw/#webpage', url: 'https://sunnychen.tw/',
  name: '陳怡君 Sunny Chen｜中和・幸福怡起拚｜新北市議員參選人',
  description: '認識中和陳怡君 Sunny Chen。從大甲的成長故事、16 年旅遊業經歷，到在中和扎根。',
  inLanguage: 'zh-Hant-TW', isPartOf: { '@id': 'https://sunnychen.tw/#website' },
  about: { '@id': 'https://sunnychen.tw/#person' },
};

export default function HomePage() {
  return (
    <main id="main" className="home-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero-inner">
        <div className="hero-copy">
          <h1 id="hero-title"><span className="hero-line"><span className="teal-word">幸福</span>，</span><span className="hero-line">怡起<span className="teal-word">拚</span>。</span><span className="candidate-name"><strong>陳怡君</strong><span>新北市議員參選人・中和</span></span></h1>
          <p className="hero-message">這不只是一場選舉，<br />而是用一整段人生，<span className="highlight">寫下的回應。</span></p>
          <div className="hero-actions"><Link className="button" href="#story">翻開我的故事 <Arrow /></Link><a className="social-link" href={facebook} target="_blank" rel="noopener noreferrer"><span className="fb-icon" aria-hidden="true">f</span> 追蹤 Facebook <Arrow diagonal /></a></div>
          <span className="hero-speed" aria-hidden="true"><i /><i /></span>
        </div>
        <div className="hero-art">
          <Spark className="hero-spark" />
          <svg className="sun-doodle" viewBox="0 0 110 110" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"><path d="M76 53c-1 15-11 26-25 26S28 65 29 52s10-25 25-25 23 12 22 26Z"/><path d="m55 5-1 10m33 3-8 9m25 23-12 1m-7 36-9-9M53 104l1-13m-37-7 10-8M5 53l12-1m2-34 9 9"/></g></svg>
          <figure className="hero-polaroid"><div className="tape" aria-hidden="true"></div><img src="/images/sunny-portrait.webp" srcSet="/images/sunny-portrait-640.webp 640w, /images/sunny-portrait.webp 960w" sizes="(max-width:700px) 90vw, 45vw" alt="中和市議員參選人陳怡君，穿著白色球衣微笑比讚" width="960" height="960" fetchPriority="high" /><figcaption><span>把每一天，走成更好的明天。</span><span className="photo-number">01 — SUNNY</span></figcaption></figure>
          <span className="signature" aria-hidden="true">Sunny<br /><span>Chen ♡</span></span>
          <span className="photo-caption">中和超拚 · 陳怡君</span>
        </div>
      </div>
      <div className="hero-bottom"><div className="container hero-bottom-inner"><span>從大甲到中和，從生活走向服務。</span><Link href="#about" aria-label="往下閱讀關於怡君"><svg className="arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v17m-6-6 6 6 6-6" /></svg></Link></div></div>
    </section>

    <section id="about" className="about-section">
      <div className="container about-layout">
        <div className="about-intro"><p className="section-label">HELLO, I'M SUNNY</p><h2><span className="about-name">我是陳怡君。</span><br /><span className="about-life">把生活的歷練，</span><br />化成<span className="highlight">服務的力量。</span></h2><Spark className="about-spark" /><span className="about-speed" aria-hidden="true"><i /><i /><i /></span></div>
        <div className="about-detail"><p>從台中大甲出發，走過家業的起落，也在旅遊業打拚了 16 年。走遍世界之後，我選擇在中和扎根。</p><p>一路走來，學會照顧人、傾聽不同的聲音，也懂得每一個為生活努力的人，都有自己的故事。</p><ol className="experience"><li><span className="experience-index" aria-hidden="true">01</span><div><span>現在</span><p>新北市中和區市議員參選人</p></div></li><li><span className="experience-index" aria-hidden="true">02</span><div><span>現在</span><p>立法委員黃國昌中和永和區主任</p></div></li><li><span className="experience-index" aria-hidden="true">03</span><div><span>曾任</span><p>陳世軒議員服務處秘書</p></div></li></ol><Link className="text-link about-link" href="/story/">更多關於我的故事 <Arrow /></Link></div>
      </div>
    </section>

    <section id="story" className="story-section">
      <div className="container">
        <div className="section-heading"><div><p className="section-label">THE CHAPTERS OF MY LIFE</p><h2>每一段人生，<br />都是<span className="highlight">走向你的路。</span></h2></div><p className="side-note">翻開故事，<br />認識每一個階段的怡君。</p></div>
        <ChapterTabs chapters={chapters.map(({ id, label }) => ({ id, label }))} panels={chapters.map((chapter, index) => (
          <Fragment key={chapter.id}>
          <figure className="story-polaroid"><div className="tape" aria-hidden="true"></div><div className="story-image"><img src={chapter.image} srcSet={`${chapter.image.replace(".webp", "-640.webp")} 640w, ${chapter.image} 1020w`} sizes="(max-width:700px) 90vw, 45vw" alt={chapter.alt} width="1020" height="1360" loading="lazy" /></div><figcaption>{chapter.caption}</figcaption></figure>
          <div className="chapter-copy"><p className="chapter-index"><span>0{index + 1}</span><span> / {chapter.kicker}</span><i></i></p><h3>{chapter.title.split("，").map((line, lineIndex, lines) => <span className="chapter-title-line" key={lineIndex}>{line}{lineIndex < lines.length - 1 ? "，" : ""}</span>)}</h3>{chapter.paragraphs.slice(0,2).map(paragraph=><p key={paragraph}>{paragraph}</p>)}<Link className="button button-outline" href={`/story/#${chapter.id}`}>閱讀完整故事 <Arrow /></Link><p className="chapter-page">CHAPTER 0{index+1} <span>／ 04</span></p></div>
          </Fragment>
        ))} />
      </div>
    </section>

    <section className="quote-section" aria-label="怡君的生活信念"><div className="container quote-inner"><span className="quote-mark" aria-hidden="true">“</span><blockquote>走遍世界、看盡社會，<br />最後在中和扎根，<br className="mobile-break" /><span className="highlight">我的漂泊終於有了歸屬。</span></blockquote><p>—— 陳怡君的人生故事</p></div></section>

    <section id="updates" className="updates-section"><div className="container">
      <div className="section-heading"><div><p className="section-label">SUNNY'S EVERYDAY</p><h2>日常裡，<span className="highlight">繼續向前。</span></h2></div><a className="text-link" href={facebook} target="_blank" rel="noopener noreferrer">前往 Facebook <Arrow diagonal /></a></div>
      <div className="updates-grid">
        <a className="update-item" href={socialPost} target="_blank" rel="noopener noreferrer"><div className="update-image"><img src="/images/market-visit-640.webp" srcSet="/images/market-visit-640.webp 640w, /images/market-visit.webp 1080w" sizes="(max-width:700px) 95vw, 33vw" alt="陳怡君在中和市場與居民打招呼" width="1080" height="810" loading="lazy" /></div><span className="update-category">中和日常 · FACEBOOK</span><h3>在中和，與你相遇 <Arrow diagonal /></h3><p>從市場、公園到夜市，把每一次相遇，放在心上。</p></a>
        <Link className="update-item" href="/story/"><div className="update-image book-image"><img src="/images/story-01-640.webp" srcSet="/images/story-01-640.webp 640w, /images/story-01.webp 1108w" sizes="(max-width:700px) 95vw, 33vw" alt="陳怡君人生故事書封面，幸福怡起拚" width="1108" height="1477" loading="lazy" /></div><span className="update-category">關於怡君 · 人生故事</span><h3>翻開怡君的故事書 <Arrow /></h3><p>從大甲到中和，那些讓我成為現在的我的片刻。</p></Link>
        <Link className="update-item" href="/story/#roots"><div className="update-image temple-image"><img src="/images/story-07-640.webp" srcSet="/images/story-07-640.webp 640w, /images/story-07.webp 1020w" sizes="(max-width:700px) 95vw, 33vw" alt="故事書記錄陳怡君在中和烘爐地的回憶" width="1020" height="1360" loading="lazy" /></div><span className="update-category">在地記憶 · 中和</span><h3>把中和，放在心上 <Arrow /></h3><p>烘爐地的燈火，讓漂泊的心有了一個可以安放的角落。</p></Link>
      </div>
    </div></section>

    <section id="contact" className="contact-section"><div className="container">
      <div className="contact-main"><div><p className="section-label">LET'S KEEP IN TOUCH</p><h2>你的聲音，<br />我想<span className="highlight">聽見。</span></h2></div><div className="contact-action"><p>生活裡的大小事，<br />歡迎與怡君聯繫。</p><a className="button" href="https://m.me/tppsunny" target="_blank" rel="noopener noreferrer">傳訊息給怡君 <Arrow diagonal /></a><a className="contact-fb" href={facebook} target="_blank" rel="noopener noreferrer">追蹤 Facebook <Arrow diagonal /></a></div></div>
      <div className="contact-details"><a href="tel:+886266090916"><span>電話聯絡</span><strong>02 6609 0916</strong><Arrow diagonal /></a><a href="https://www.google.com/maps/search/?api=1&query=%E6%96%B0%E5%8C%97%E5%B8%82%E4%B8%AD%E5%92%8C%E5%8D%80%E6%B0%91%E5%BE%B7%E8%B7%AF155%E4%B9%8B2%E8%99%9F1%E6%A8%93" target="_blank" rel="noopener noreferrer"><span>服務據點</span><strong>新北市中和區民德路155之2號1樓</strong><Arrow diagonal /></a><a href="mailto:sunnychentpp@gmail.com"><span>電子信箱</span><strong>sunnychentpp@gmail.com</strong><Arrow diagonal /></a></div>
    </div></section>
    </main>
  );
}
