# 素材來源與權利範圍

盤點日期：2026 年 10 月 26 日。

本專案公開原始碼，不表示所有可見內容都已取得自由再利用授權。根目錄對原創程式碼、可授權的原創設計或文件所作的授權，**不包含下列照片、故事書、人物文宣、官方標誌及其衍生素材，也不包含參與者提交的觀點、Google 姓名與頭像**。這項區分依內容性質判斷，不因內容存放於圖片、資料檔、TSX、CSS、Metadata 或文件內而改變。

相關權利以各原權利人為準。本專案沒有查得下列競選素材另以 MIT、Creative Commons 或其他自由內容授權釋出的聲明，因此不替原權利人作出這類授權。公開瀏覽、提供網站製作素材、轉檔、縮圖或去背，均不是本文件宣稱素材已可任意再利用的依據。

## 故事書與文字

故事書照片由委託方提供。以下每組包含原尺寸 WebP 與 `-640.webp` 縮圖；原始上傳檔名用來辨識來源，原始 JPEG 未隨此表重新散布。

| 專案檔案 | 原始上傳檔名 | 內容 |
| --- | --- | --- |
| `public/images/story-01.webp`、`story-01-640.webp` | `1973648_0.jpg` | 故事書封面、幸福怡起拚 |
| `public/images/story-02.webp`、`story-02-640.webp` | `1973649_0.jpg` | 母親與童年照片、從大甲到中和 |
| `public/images/story-03.webp`、`story-03-640.webp` | `1973650_0.jpg` | 父親與童年照片、落地生根 |
| `public/images/story-04.webp`、`story-04-640.webp` | `1973651_0.jpg` | 成長、台中海線大甲 |
| `public/images/story-05.webp`、`story-05-640.webp` | `1973652_0.jpg` | 棒球與團結 |
| `public/images/story-06.webp`、`story-06-640.webp` | `1973653_0.jpg` | 高中辯論社與公共議題 |
| `public/images/story-07.webp`、`story-07-640.webp` | `1973654_0.jpg` | 中和烘爐地與家的記憶 |
| `public/images/story-08.webp`、`story-08-640.webp` | `1973655_0.jpg` | 家中紡織產業與父親的責任 |
| `public/images/story-09.webp`、`story-09-640.webp` | `1973656_0.jpg` | 旅遊業經歷與在中和扎根 |
| `public/images/story-10.webp`、`story-10-640.webp` | `1973657.jpg` | 故事的後續引言 |

上述檔案為上傳照片的網頁格式與尺寸衍生版本。網站中的裁切、旋轉、邊框與拼貼呈現不改變原素材的權利狀態。

`src/data/story.ts` 的故事段落由提供書頁轉錄並調整標點；首頁、故事頁與相關分享資料另使用人物姓名、競選口號及人物介紹。這些**內容文字**不隨程式碼的 MIT 授權或原創設計／文件的開放授權釋出。資料結構、元件邏輯與一般版面實作，則依專案對程式及設計所訂的授權處理。

## 官方 Facebook 照片、文宣與衍生 Logo

| 專案檔案 | 原始來源 | 本專案處理 |
| --- | --- | --- |
| `public/images/sunny-portrait.webp`、`sunny-portrait-640.webp` | [官方人物肖像](https://www.facebook.com/photo/?fbid=122199235742906843&set=a.122095338446906843) | 網頁格式轉換、縮圖 |
| `public/images/market-visit.webp`、`market-visit-640.webp` | [官方市場走訪照片](https://www.facebook.com/photo/?fbid=122209076738906843&set=pcb.122209077224906843) | 網頁格式轉換、縮圖 |
| `public/images/social-share.jpg` | [官方 Facebook 封面文宣](https://www.facebook.com/photo/?fbid=122199722582906843&set=a.122125307216906843) | 配置為 1200 × 630 分享圖片；保留原文宣中的姓名識別及政黨標誌 |
| `public/images/sunny-logo-v1.png` | 同上方官方封面中的姓名識別 | 使用內建 Image Gen 去背製作透明衍生稿；不是官方向量原檔 |
| `public/images/deliberation-share.png` | 本站公共議題分享圖，引用上述 `sunny-logo-v1.png` | 1200 × 630 通用 Open Graph 圖片，不含參與者姓名、頭像或表態；其中官方姓名 Logo 仍適用原素材的權利例外 |

上述素材來源帳號為 [中和超拚 陳怡君 Sunny](https://www.facebook.com/tppsunny)。攝影、文宣設計、姓名識別、政黨標誌及照片中人物的相關權利，仍以各原權利人為準；本專案不宣稱粉絲專頁就是每一項權利的唯一持有人。

Image Gen 處理沒有使官方識別自動轉為可自由再授權素材。`sunny-logo-v1.png` 與 `social-share.jpg` 同樣排除於本專案程式碼、原創設計及文件的開放授權之外。

`deliberation-share.png` 的可授權原創排版依原創設計授權處理，其中引用的官方姓名 Logo 不隨之取得 MIT 或 CC BY-SA 4.0 授權；不能將整張含有官方識別的圖片概括為自由內容素材。

## 參與者觀點與個人分享小卡

公共議題參與者提交的提案、觀點及其他內容，其相關權利仍以各原權利人為準。送出、通過審核或顯示於討論頁，不代表這些內容已改採本專案的 MIT、CC BY-SA 4.0，或成為可任意再利用的素材。本站不以程式碼的開放授權替參與者作出額外的內容授權。

使用者自選 Google 登入後取得的姓名、頭像與相關肖像權利，也不在本專案開放授權的範圍內；頭像照片可能另有原作者權利，不能僅因使用者提供 Google 頭像就推定本站擁有完整再授權權限。Google 登入介面中的標誌等材料仍保留其各自權利。

個人分享小卡由使用者主動在瀏覽器產生、下載或分享，本站不建立公開個人分享網址。小卡所用的原創程式與可授權原創版面依根目錄相應授權處理；其中的使用者姓名、頭像、觀點、人物照片或官方品牌元素仍適用各自例外，不能把整張含有這些材料的小卡概括為 MIT 或 CC BY-SA 4.0。個人分享不代表人物、團隊、平台或內容權利人為其他用途背書。

本專案沒有收錄或重播 Pocket Polis 上游 demo 資料，不將上游示範參與者或回應當作本站中和議題的結果。上游範例的個別授權也不能用來推定本站新投稿已採自由內容授權；詳見 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。

## 本站原創設計與識別

一般版面程式、CSS 形狀、`Arrow`／`Spark` 等自行繪製的簡單 SVG 與原創設計元素，依根目錄相應授權文件處理；其中引用的官方照片、Logo、文案等仍適用前述例外。設計參考圖中的排版概念，不能作為其中人物照片或品牌素材具有自由再利用授權的證明。

`public/favicon.svg` 是本站製作的 S 字形網站圖示，不是從官方姓名 Logo 擷取的向量原檔。其可授權的原創圖形表達依原創設計授權處理；圖形授權不代表授予人物、競選團隊或第三方的商標、姓名、肖像與背書權限。

主色 `#28C8C8` 由委託方指定；輔色 `#F6B1AA` 為官方封面速度線的取樣值，並非宣稱官方公布的品牌標準色碼。

## 程序建模棒球

首頁的 3D 棒球由本站 `src/scripts/baseball.ts` 以 Three.js 建立球面、曲線縫線與針腳，並以確定性的數值程序產生皮革凹凸細節。`src/components/BaseballToy.tsx` 包含互動介面與自行繪製的 SVG 備援圖。這項實作沒有載入外部照片貼圖、GLB 或其他下載的模型，也沒有將故事書或官方文宣中的棒球影像轉成模型。

本站原創的程序建模與互動程式適用根目錄 `LICENSE` 的 MIT 授權；可授權的原創圖形與版面表達依 `LICENSE-CONTENT.md` 的原創設計授權處理。使用的 Three.js 本身保留上游 MIT 條款及 notice，完整副本見 [three-MIT.txt](LICENSES/three-MIT.txt)。這項新增實作不改變前述人物、照片、故事書、官方 Logo 與品牌素材的授權例外，也不授予人物、團隊或第三方的姓名、商標與背書權限。

## 字型

字型不適用上述競選照片的權利說明，也不改授本專案的 MIT 或 Creative Commons 授權。本站自架的字型子集適用各自附帶的 **SIL Open Font License 1.1**：

| 字型檔案 | 隨附完整授權與原始 notice |
| --- | --- |
| `public/fonts/sunny-noto-tc-v2.woff2`（目前使用，包含新增 TSX 文案） | [OFL-NotoSansTC.txt](public/fonts/OFL-NotoSansTC.txt)：Copyright 2014-2021 Adobe，Reserved Font Name 為 `Source` |
| `public/fonts/sunny-noto-tc-extra-v1.woff2`（公共議題、隱私與分享小卡新增文字的補充子集） | 同上，適用相同 SIL Open Font License 1.1 與原始 notice；以 CSS `unicode-range` 搭配主字集載入 |
| `public/fonts/sunny-noto-tc-v1.woff2`（保留的舊版子集） | 同上，適用相同 SIL Open Font License 1.1 與原始 notice |
| `public/fonts/sunny-caveat-v1.woff2` | [OFL-Caveat.txt](public/fonts/OFL-Caveat.txt)：Copyright 2014 The Caveat Project Authors |

散布這些字型或其子集時，保留隨附的 copyright notice 與完整 OFL；字型修改版仍依 OFL 處理，並遵守其 Reserved Font Name 等條件。一般作業系統備援字型僅列於 CSS 字型名稱中，沒有隨本專案提供字型檔。

## 複用網站時

可依相應程式／設計授權複用具有授權範圍的實作。若用於另一個網站，請自行取得保留競選素材所需的授權，或替換相關照片、原書頁、Logo、姓名、人物文案及分享圖片。重用程式碼不代表陳怡君、競選團隊、原作者或素材權利人為新網站背書。

依賴套件與完整上游授權位置另見 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
