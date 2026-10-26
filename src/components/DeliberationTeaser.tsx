import Link from 'next/link';
import Arrow from './Arrow';
import { SHARE_CARD_ENTRY } from '../data/share-card';
import './deliberation-teaser.css';

export default function DeliberationTeaser() {
  return <section className="deliberation-teaser" id="deliberation" aria-labelledby="deliberation-teaser-title"><div className="container deliberation-teaser-inner">
    <div><p className="section-label">ZHONGHE, LET'S TALK</p><h2 id="deliberation-teaser-title">中和日常，<br /><span className="highlight">從你開始。</span></h2></div>
    <div><p>把你對中和的關心，做成一張小卡。<br />也來看看公共議題的不同觀點。</p><div className="deliberation-teaser-actions"><Link className="button" href={SHARE_CARD_ENTRY}>製作中和小卡 <Arrow /></Link><Link className="text-link" href="/deliberation/#participate">參與中和公共議題 <Arrow /></Link></div><p className="deliberation-teaser-note">自願參與的意見交流，並非正式投票或代表性民調。</p></div>
  </div></section>;
}
