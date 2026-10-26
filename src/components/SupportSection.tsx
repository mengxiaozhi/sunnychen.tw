import Arrow from './Arrow';
import './support.css';

const accountDetails = [
  { label: '專戶名稱', value: '115年新北市議員擬參選人陳怡君政治獻金帳戶' },
  { label: '行庫名稱', value: '中華郵政' },
  { label: '機構代碼', value: '700', numeric: true },
  { label: '機構分行', value: '中和泰和街郵局' },
  { label: '分行代碼', value: '031172-3', numeric: true },
  { label: '專戶帳號', value: '50485919', numeric: true },
];

export default function SupportSection() {
  return (
    <section id="support" className="support-section" aria-labelledby="support-title">
      <div className="container support-layout">
        <div className="support-intro">
          <p className="section-label">SUPPORT SUNNY</p>
          <h2 id="support-title">怡起<span className="highlight">支持，</span><br />幸福怡起拚。</h2>
          <a
            className="button support-donate"
            href="https://donate.tpp.org.tw/support/bGBmZetb"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="前往線上捐款（另開新視窗）"
          >
            前往線上捐款 <Arrow diagonal />
          </a>
        </div>
        <div className="support-account">
          <h3>政治獻金專戶</h3>
          <dl>
            {accountDetails.map(({ label, value, numeric }) => (
              <div className="support-account-row" key={label}>
                <dt>{label}</dt>
                <dd className={numeric ? 'support-account-number' : undefined}>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
