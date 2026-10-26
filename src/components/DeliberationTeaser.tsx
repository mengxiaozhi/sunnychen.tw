import Link from 'next/link';
import Arrow from './Arrow';
import './deliberation-teaser.css';

export default function DeliberationTeaser() {
  return <section className="deliberation-teaser" id="deliberation" aria-labelledby="deliberation-teaser-title"><div className="container deliberation-teaser-inner">
    <div><p className="section-label">ZHONGHE, LET'S TALK</p><h2 id="deliberation-teaser-title">中和日常，<br /><span className="highlight">從你開始。</span></h2></div>
    <div><p>走路、通勤、公園、街區環境。<br />你希望中和，先把哪裡變得更好？</p><Link className="button" href="/deliberation/">參與中和公共議題 <Arrow /></Link><p className="deliberation-teaser-note">自願參與的意見交流，並非正式投票或代表性民調。</p></div>
  </div></section>;
}
