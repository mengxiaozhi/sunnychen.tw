import type { Metadata } from 'next';
import Link from 'next/link';
import Arrow from '../../components/Arrow';
import './license.css';

const title = '開源與授權書｜陳怡君 Sunny Chen';
const description = '查看 sunnychen.tw 的 GitHub 原始碼、MIT 程式碼授權、CC BY-SA 4.0 原創設計與文件授權，以及網站使用授權書與素材權利說明。';
const repository = 'https://github.com/mengxiaozhi/sunnychen.tw';
const documents = [
  { name: 'MIT 程式碼授權', file: 'LICENSE', download: 'LICENSE.txt', description: '本專案有權授權的原創程式實作。' },
  { name: '原創設計與文件授權', file: 'LICENSE-CONTENT.md', download: 'LICENSE-CONTENT.md', description: 'CC BY-SA 4.0 的適用範圍與姓名標示方式。' },
  { name: '網站使用授權書', file: 'RIGHTS-GRANT.md', download: 'RIGHTS-GRANT.md', description: '授予陳怡君及其授權團隊的公開使用授權聲明。' },
  { name: '素材權利說明', file: 'ASSETS.md', download: 'ASSETS.md', description: '照片、人物故事、Logo 與其他素材的來源和權利範圍。' },
  { name: '第三方授權聲明', file: 'THIRD_PARTY_NOTICES.md', download: 'THIRD_PARTY_NOTICES.md', description: '套件、字型與第三方元件適用的原有條款。' },
];

export const metadata: Metadata = {
  title: { absolute: title }, description,
  alternates: { canonical: 'https://sunnychen.tw/license/' },
  openGraph: { title, description, url: 'https://sunnychen.tw/license/', type: 'website', locale: 'zh_TW', siteName: '陳怡君 Sunny Chen｜幸福怡起拚', images: [{ url: '/images/social-share.jpg', width: 1200, height: 630, alt: '陳怡君 Sunny Chen，中和幸福怡起拚' }] },
  twitter: { card: 'summary_large_image', title, description, images: ['/images/social-share.jpg'] },
};

const schema = { '@context': 'https://schema.org', '@type': 'WebPage', '@id': 'https://sunnychen.tw/license/#webpage', url: 'https://sunnychen.tw/license/', name: title, description, inLanguage: 'zh-Hant-TW', isPartOf: { '@id': 'https://sunnychen.tw/#website' } };

export default function LicensePage() {
  return (
    <main id="main" className="container license-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <Link className="text-link" href="/">返回首頁 <Arrow /></Link>
      <h1>開源與授權書</h1>
      <p className="license-intro">讓網站的原始碼、使用方式與權利範圍，都能清楚查閱。</p>
      <a className="button" href={repository} target="_blank" rel="noopener noreferrer">GitHub 開放原始碼 <Arrow diagonal /></a>

      <section aria-labelledby="license-code-title">
        <h2 id="license-code-title">程式碼：MIT License</h2>
        <p>本專案由劉訊志享有或有權授權的原創程式實作採 MIT License。你可以依該條款使用、複製、修改及散布程式碼，並保留著作權與授權聲明。第三方套件仍適用各自的條款。</p>
      </section>
      <section aria-labelledby="license-content-title">
        <h2 id="license-content-title">原創版面與文件：CC BY-SA 4.0</h2>
        <p>有權授權的原創版面設計與說明文件採姓名標示—相同方式分享 4.0 國際授權。再利用時應標示劉訊志、來源與授權連結，指出修改，並依適用條件分享改作內容。</p>
      </section>
      <section aria-labelledby="license-grant-title">
        <h2 id="license-grant-title">陳怡君及其授權團隊的使用權</h2>
        <p>就授權人有權授權的原創程式實作、版面與說明文件，提供無償、非專屬、全球性的網站使用權，可為網站維運、公共溝通與活動宣傳進行部署、備份、修改與委託維護。著作財產權不因此移轉，著作人格權仍依法保留。</p>
        <p>網站使用授權書是公開授權聲明，沒有代替當事人簽署契約；如作為採購、委任或其他契約的正式附件，仍應由當事人另行確認及簽署。</p>
        <a className="text-link" href="/licenses/RIGHTS-GRANT.md" download="sunnychen.tw-RIGHTS-GRANT.md">下載網站使用授權書 <Arrow /></a>
      </section>
      <section aria-labelledby="license-assets-title">
        <h2 id="license-assets-title">人物、品牌與第三方素材</h2>
        <p>人物故事、競選文宣、故事書、照片、影音、Logo、姓名識別、肖像與商標，不因出現在網站或原始碼中就取得 MIT 或 CC BY-SA 4.0 授權。相關權利以原權利人及個別標示為準；程式碼授權不代表人物或團隊背書。</p>
        <p>字型保留 SIL Open Font License；Next.js、React、GSAP 等套件也保留原有授權。完整範圍請查看下列文件。</p>
      </section>

      <section aria-labelledby="license-documents-title">
        <h2 id="license-documents-title">完整文件</h2>
        <ul className="license-documents">
          {documents.map(document => (
            <li key={document.file}>
              <div><h3>{document.name}</h3><p>{document.description}</p></div>
              <div className="license-document-links">
                <a href={`${repository}/blob/main/${document.file}`} target="_blank" rel="noopener noreferrer">GitHub 原文 <span aria-hidden="true">↗</span></a>
                <a href={`/licenses/${document.download}`} download>下載文件 <span className="sr-only">：{document.name}</span><span aria-hidden="true">↓</span></a>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <p className="license-note">本頁為閱讀摘要，完整條款與適用範圍以各授權文件及上游授權原文為準。</p>
    </main>
  );
}
