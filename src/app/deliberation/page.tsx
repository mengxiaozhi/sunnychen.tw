import type { Metadata } from 'next';
import Link from 'next/link';
import Arrow from '../../components/Arrow';
import PolisExperience from '../../components/PolisExperience';
import { deliberation, deliberationConfig } from '../../data/deliberation';
import './deliberation.css';

const title = '中和公共議題｜生活改善的優先順序｜陳怡君';
const description = '一起討論中和生活改善的優先順序。透過 Pocket Polis 口袋審議，不具名回應行人安全、通勤、公園與街區環境的觀點，了解共同看法與分歧。';
export const metadata: Metadata = {
  title: { absolute: title }, description,
  alternates: { canonical: deliberation.canonical },
  openGraph: { title, description, url: deliberation.canonical, type: 'website', locale: 'zh_TW', siteName: '陳怡君 Sunny Chen｜幸福怡起拚', images: [{ url: '/images/deliberation-share.png', width: 1200, height: 630, alt: '中和公共議題：中和日常，從你開始' }] },
  twitter: { card: 'summary_large_image', title, description, images: ['/images/deliberation-share.png'] },
};
const schema = [
  { '@context': 'https://schema.org', '@type': 'WebPage', '@id': `${deliberation.canonical}#webpage`, url: deliberation.canonical, name: title, description, inLanguage: 'zh-Hant-TW', isPartOf: { '@id': 'https://sunnychen.tw/#website' }, about: { '@type': 'Thing', name: deliberation.title } },
  { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: '首頁', item: 'https://sunnychen.tw/' }, { '@type': 'ListItem', position: 2, name: '中和公共議題', item: deliberation.canonical }] },
];

export default function DeliberationPage() {
  return <main id="main" className="deliberation-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <section className="deliberation-intro"><div className="container">
      <Link className="text-link" href="/">返回首頁 <Arrow /></Link>
      <p className="section-label">ZHONGHE, LET'S TALK</p><h1>中和日常，<br /><span className="highlight">從你開始。</span></h1>
      <div className="deliberation-intro-bottom"><p>{deliberation.description}</p><div className="deliberation-intro-actions"><a className="button" href="#participate">參與討論 <Arrow /></a><a className="text-link" href="#results">查看目前討論 <Arrow /></a></div></div>
      <p className="deliberation-purpose">這是自願參與的公共議題意見交流，不是正式投票，也不是具代表性的民調。</p>
    </div></section>

    <div className="container deliberation-content">
      <section className="deliberation-topic" aria-labelledby="topic-title"><div><p className="section-label">OUR FIRST CONVERSATION</p><h2 id="topic-title">{deliberation.title}</h2></div><div><p>每個人走的路、搭的車、使用的公園都不一樣。這場討論想先聽見不同的生活經驗，再找出可以一起往前的方向。</p><p>起始觀點由主持方整理，作為討論起點；你也能補充新觀點，審核通過後加入討論。所有回應都由實際參與者提供，不會預先填入模擬結果。</p></div></section>
      <ol className="deliberation-steps"><li><span>01</span><h3>讀一個觀點</h3><p>先理解別人的想法，不急著替任何人貼標籤。</p></li><li><span>02</span><h3>表達你的看法</h3><p>認同、不認同或略過，也可以補充一個新觀點。</p></li><li><span>03</span><h3>找出共同方向</h3><p>資料足夠時，看看意見分布與跨群的共同看法。</p></li></ol>
      <PolisExperience apiBase={deliberationConfig.apiBase} conversationId={deliberationConfig.conversationId} />
      <noscript><p className="polis-connection-note">參與討論需要 JavaScript。你仍可閱讀議題背景、參與方式與隱私權說明。</p></noscript>
    </div>
    <section className="container deliberation-method" aria-labelledby="method-title"><h2 id="method-title">關於這場審議</h2><div><p>本站整合開源專案 <a href={deliberation.upstream} target="_blank" rel="noopener noreferrer">Pocket Polis（口袋審議）</a>，依回應相似度整理意見地圖，並非依姓名、Google 帳號、政黨或身分分群。</p><p>隨機代號不能驗證一人一票；更換瀏覽器或清除儲存空間，可能產生新的代號。結果用於理解這場討論的參與者，不代表中和全體居民。</p><p>新觀點先審核，請避免個資、人身攻擊、仇恨或與議題無關的內容。<Link href="/privacy/#moderation">查看審核與資料使用說明</Link>。</p></div></section>
  </main>;
}
