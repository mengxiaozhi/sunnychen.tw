import type { Metadata } from 'next';
import Link from 'next/link';
import './privacy.css';

const title = '隱私權說明｜陳怡君 Sunny Chen';
const description = '了解 sunnychen.tw 公共議題的不具名參與、提案審核、Google 登入分享小卡、外部捐款與資料處理方式。';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "https://sunnychen.tw/privacy/" },
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: '陳怡君 Sunny Chen｜幸福怡起拚',
    title,
    description,
    url: "https://sunnychen.tw/privacy/",
    images: [{ url: 'https://sunnychen.tw/images/social-share.jpg', width: 1200, height: 630, alt: '陳怡君 Sunny Chen，中和幸福怡起拚' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://sunnychen.tw/images/social-share.jpg'],
  },
};

const webpageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://sunnychen.tw/privacy/#webpage',
  name: title,
  url: 'https://sunnychen.tw/privacy/',
  description,
  inLanguage: 'zh-Hant-TW',
  isPartOf: { '@id': 'https://sunnychen.tw/#website' },
  about: { '@id': 'https://sunnychen.tw/#person' },
};

export default function PrivacyPage() {
  return (
    <main id="main" className="container privacy-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema).replace(/</g, '\\u003c') }} />
      <Link className="text-link" href="/">返回首頁</Link>
      <h1>隱私權說明</h1>
      <p className="date">更新日期：2026 年 10 月 26 日</p>

      <h2>瀏覽本網站</h2>
      <p>本網站提供陳怡君的個人介紹、人生故事、公開社群連結與<Link href="/deliberation/">中和公共議題討論</Link>。一般瀏覽與議題參與不要求 Google 登入；Google 登入是製作個人分享小卡的自選功能。本站未加入廣告追蹤像素或第三方流量分析工具。</p>

      <h2 id="deliberation">公共議題與不具名參與</h2>
      <p>你可以不填姓名參與議題表態與提交觀點。瀏覽器會為每場討論產生隨機參與識別碼，存放於本站的 localStorage，用來辨識同一瀏覽器在該場討論中的匿名參與紀錄。識別碼、觀點識別碼、表態選擇與時間會傳送至審議服務，並由 Cloudflare Durable Objects 儲存；提案文字及相關處理紀錄也會由服務保存。</p>
      <p>不具名不代表完全無法辨識或不留下紀錄。相同識別碼的回應可以彼此關聯；清除瀏覽器資料或更換裝置可能產生新的識別碼，也不會自動刪除已送出的伺服器紀錄。Google 姓名、頭像與登入身分不會與這個匿名識別碼或表態紀錄綁定。</p>

      <h2 id="moderation">提案審核與公開資訊</h2>
      <p>新提交的觀點會先由管理者審核，通過後才公開。請不要在文字中填入自己或他人的身分證字號、電話、精確住址或其他不適合公開的個人資料。管理者為審核、維護討論及處理問題，可能接觸已提交的內容與相關紀錄。</p>
      <p>公開頁面呈現核准的觀點、彙整統計與分群資訊，逐筆表態不作為開放資料提供。這些內容來自自願參與者，是公共議題交流，並非正式投票，也不是代表中和全體居民的民意調查。</p>

      <h2 id="ai-summary">選用的 AI 摘要</h2>
      <p>審議服務若啟用 Cloudflare AI 協助整理摘要，只會使用已核准公開的觀點與統計，不會將 Google 姓名、頭像或登入身分送入摘要處理。AI 摘要可能有誤，閱讀時仍應參照原始觀點與統計。</p>

      <h2 id="google-share">Google 登入與個人分享小卡</h2>
      <p>如果你選擇使用 Google 登入製作小卡，Google 登入憑證會交由本站驗證 API 處理，驗證過程會處理憑證所含的身分資訊。本站僅將製卡所需的姓名與頭像提供給頁面，保留在瀏覽器記憶體中，不存為本站會員資料、不寫入 localStorage 或匿名表態資料庫，也不與表態紀錄連結。</p>
      <p>開始登入時，本站會設定最長 10 分鐘的驗證 Cookie，使用 HttpOnly 與 SameSite=Strict 保護。它只保存本次登入的隨機驗證值（nonce），用來防止重放登入憑證，不是會員或投票識別碼。伺服器會核對 Google 憑證的簽章、用戶端、發行者、有效期限與 nonce；完成這次驗證處理後，不論成功或失敗，都會清除該 Cookie。本站不建立保存 Google 個人資料的登入 session Cookie。</p>
      <p>小卡在你的瀏覽器產生，只有在你主動選擇下載或分享時才交由裝置或選定的分享服務處理。本站不為個人小卡建立公開個人網址，也不將其放入 sitemap 或搜尋索引。若你將小卡發布到其他平台，該平台的公開範圍與資料處理適用其自身設定及政策。</p>
      <p>Google 登入與頭像載入會連線至 Google 服務，Google 會依其政策處理相關請求。你不使用這項功能，仍可不具名參與公共議題。</p>

      <h2>網站運作資料</h2>
      <p>網站由 Vercel 提供代管服務，審議服務使用 Cloudflare。為提供網頁、處理連線與維護安全，這些服務可能處理 IP 位址、瀏覽器資訊、請求時間及技術紀錄。這些連線紀錄與頁面上的不具名參與是不同的資料處理範圍；相關供應商亦依各自的隱私政策處理服務資料。</p>

      <h2 id="external-services">外部捐款、網站與聯絡</h2>
      <p>支持專區的捐款按鈕會前往外部捐款網站，本站沒有付款表單，也不接收你的信用卡或其他付款資料。捐款過程所提供的資料由外部捐款服務接收，其資料處理適用該服務的說明與政策。</p>
      <p>Facebook、Instagram、Threads、YouTube、Messenger、Google 地圖等連結會開啟第三方網站，其資料處理適用各自的隱私政策。透過電話、電子郵件或社群訊息提供的內容，將由該聯絡管道接收；請避免在公開留言中揭露敏感資料。</p>

      <h2 id="data-requests">資料處理與聯繫我們</h2>
      <p>若對資料處理有疑問，或希望查詢、更正或請求刪除你提交的內容，請來信 <a href="mailto:sunnychentpp@gmail.com">sunnychentpp@gmail.com</a>，說明所涉議題、提交時間或可辨識的內容。因參與紀錄採不具名識別，可能無法僅憑姓名找到特定紀錄；清除本機資料也不等於撤回伺服器上的既有內容。</p>
  </main>
  );
}
