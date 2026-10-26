# 陳怡君 Sunny Chen｜幸福怡起拚

以青綠 `#28C8C8` 與暖珊瑚粉 `#F6B1AA` 撞色的競選形象網站，結合運動感大字、貼紙照片框、書籤導覽與真實人物故事。使用 Next.js 16 App Router 與 React 19，於建置時預先產生各頁 HTML，字型由本站提供，圖片使用 WebP。

正式網域為 [sunnychen.tw](https://sunnychen.tw)，Vercel 專案名稱為 `sunnychen-tw`，`www.sunnychen.tw` 以 308 轉址至主網域。

Next.js 版本已於 2026 年 10 月 26 日完成正式部署。青粉改版正式站手機 Lighthouse（加入 Three.js 棒球前）：效能 91、無障礙 100、最佳實務 100、SEO 100，CLS 0。量測會受網路與裝置環境影響。已驗證 320、360、390、430、768、1024、1536px 的四個頁面無水平溢出，以及 GSAP、章節導覽、Next.js 換頁返回、減少動態與載入失敗備援。

## 開源與授權

- 公開原始碼：[mengxiaozhi/sunnychen.tw](https://github.com/mengxiaozhi/sunnychen.tw)
- 網站授權說明：[sunnychen.tw/license/](https://sunnychen.tw/license/)
- 原創程式實作：[MIT License](./LICENSE)，Copyright (c) 2026 劉訊志。
- 有權授權的原創版面與說明文件：[CC BY-SA 4.0](./LICENSE-CONTENT.md)。
- 陳怡君及其授權團隊的網站使用權：[RIGHTS-GRANT.md](./RIGHTS-GRANT.md)，為公開聲明，非已由雙方簽署的契約。
- 人物、故事、文宣、照片及品牌素材不因開源而自動取得再利用權；詳見 [ASSETS.md](./ASSETS.md)。第三方程式與字型保留原授權，詳見 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。

重新部署或改作網站時，請先確認素材、名稱、肖像與第三方元件的必要許可。更新根目錄授權文件後，應同步 `public/licenses/` 中的下載版本。

## 視覺系統

- 主色 `#28C8C8`、輔色 `#F6B1AA`、墨色 `#153F3B`、白色 `#FFFFFF`，以深色文字與框線維持可讀性。粉色取自官方封面速度線的圖片取樣，並非官方公布的標準色碼。
- 大字粗斜體、2px 描邊、實色錯位陰影、四角星與速度線延伸官方運動視覺。
- `public/images/sunny-logo-v1.png` 是以官方 Facebook 封面姓名識別為來源、使用內建 Image Gen 去背的透明衍生稿；不是官方向量原檔。透過 `next/image` 輸出適合顯示尺寸的版本。
- 設計概念提示採「青綠與珊瑚粉撞色、運動貼紙風、大字描邊、白框真實照片、開放式排版」；圖像概念只作排版參考，正式人物與故事照片維持原始素材，正文與聯絡資訊使用原有內容。

## 本機開發

使用 Node.js 24 與 npm：

```sh
npm ci
npm run dev
```

開發網址為 `http://localhost:3000`。如需關閉 Next.js 使用情況回報，可使用 `NEXT_TELEMETRY_DISABLED=1 npm run dev`。可加上 `-- --port 4321` 指定其他連接埠。

```sh
npm run build
npm run start
```

建置輸出位於 `.next/`；Vercel 使用 Next.js preset 自動辨識輸出。正式設定見 `next.config.ts` 與 `vercel.json`，TypeScript 檢查可執行 `npm run typecheck`。

## 內容維護

- `src/app/page.tsx`：首頁文案、社群連結、經歷與聯絡資訊。
- `src/data/story.ts`：四章人生故事及原書頁索引。
- `src/app/story/page.tsx`：完整故事與書頁圖庫。
- `src/app/deliberation/page.tsx`：中和公共議題的說明、參與入口與該頁 SEO 資料。
- `src/data/deliberation.ts`：議題文案、主持人準備的起始觀點與公開部署設定；`src/lib/polis.ts` 負責 REST 介接及每場討論的匿名識別碼。
- `src/components/ShareCardSection.tsx`：首頁製卡區的 Server Component，產生示意 QR 並傳入 Google 製卡旗標與公開 Client ID。
- `src/components/DeliberationShareCard.tsx`：免登入填寫稱呼、選取本機照片、瀏覽器製卡、下載與分享；保留可另行啟用的 Google 製卡。`src/app/api/share-card/google/` 與 `src/lib/google-share.server.ts` 負責一次性 nonce 與 Google 官方憑證驗證。
- `services/polis/`：Pocket Polis 審議服務與 Cloudflare 部署設定；保留上游授權及服務本身的依賴文件。
- `src/app/layout.tsx`：共用導覽、頁尾及 SEO 資料。
- `src/styles/global.css`：色彩、字型與共用樣式；各頁 CSS 有頁面範圍，避免換頁後樣式互相影響。
- `src/components/SiteHeader.tsx`：手機選單與共用導覽，包含「支持怡君」入口。
- `src/components/SupportSection.tsx`：首頁聯絡區前的支持專區；線上捐款網址與六項政治獻金專戶資料統一在此維護。
- `src/components/ChapterTabs.tsx`：React 章節狀態與鍵盤操作。
- `src/components/PageMotion.tsx`：Next.js 換頁後初始化 GSAP，離頁時清理。
- `src/scripts/motion.ts`：GSAP 首屏入場、捲動揭示、章節切換與桌面微互動。
- `src/components/BaseballToy.tsx`、`src/scripts/baseball.ts`：首頁棒球互動介面、延後載入與 Three.js 程序模型；樣式位於 `src/components/baseball.css`。
- `src/components/ElectionCountdown.tsx`、`src/data/election.ts`：首頁投票日倒數與台灣時間的日期邊界。
- `src/app/privacy/page.tsx`：隱私權說明。
- `public/images/`：網站使用的照片與分享圖片。

社群動態是人工整理的靜態內容與外部連結，沒有自動同步 Facebook。電話、電子信箱及服務據點地址取自已查證的公開粉絲專頁，異動時請同步更新首頁。本網站未加入廣告追蹤或第三方流量分析工具；公共議題的表態、提案與分享小卡另依下方資料邊界及隱私權說明處理。

支持專區的線上捐款網址與六項帳戶資料依委託方提供內容設定。捐款按鈕另開外部網站，本站沒有付款表單；更新時修改 `src/components/SupportSection.tsx`，不在本文件重複維護銀行資料。

## 公共議題與分享小卡

`/deliberation/` 的第一場議題為「中和生活改善的優先順序」，採用 [Pocket Polis](https://github.com/mashbean/pocket-polis) 的審議服務。參與是自願的公共意見交流，並非正式投票，也不是具代表性的民調。頁面的人數、回應數、統計與分群應只取自實際服務回傳資料；沒有資料或載入失敗時，不以示範數字或虛構結果代替。

`seedStatements` 是主持人準備的起始觀點，不是參與者投稿或表態統計。本專案沒有收錄或重播上游 demo 資料，也不以示範回應或參與者填入這場中和討論。

公開環境設定由 `src/data/deliberation.ts` 讀取：

| 設定鍵 | 用途 |
| --- | --- |
| `NEXT_PUBLIC_POLIS_API_URL` | 本站專用 Pocket Polis Worker API 網址 |
| `NEXT_PUBLIC_POLIS_CONVERSATION_ID` | 本場討論的識別碼 |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google Identity Services Web 用戶端 ID |
| `NEXT_PUBLIC_GOOGLE_SHARE_ENABLED` | 預設停用 Google 入口；僅明確設為 `true` 且已提供 Client ID 時才開放 |

這些值會提供給瀏覽器，不得放入管理 token 或私密憑證。審議 Worker 的允許來源必須包含實際前端來源；建置時更換公開設定後，需重新建置網站。

瀏覽器產生的隨機 UUID 存在 `localStorage`，只用於匿名表態與提案。Cloudflare Durable Objects 儲存參與識別碼（`pid`）、觀點識別碼（`sid`）、表態值（`value`）、時間與提案等紀錄。`autoApprove=false` 讓新觀點先經審核才公開；`openData=false` 不公開逐筆表態，頁面讀取公開統計與分群。不要將不具名參與描述為完全匿名，也不要把匿名識別數直接稱為經身分驗證的人數。

製作分享小卡不需要登入。使用者可以手動填寫稱呼，並自選 10 MB 以內的 JPEG、PNG 或 WebP 本機照片；瀏覽器將照片置中裁成 256 × 256 像素縮圖，再以圓形頭像合成小卡；超過 5,000 萬像素的照片會提示改選較小圖片。稱呼、原始照片及處理後的頭像只保留於頁面記憶體，不上傳至本站伺服器或審議服務、不寫入 `localStorage`，也不與匿名 `pid` 或表態紀錄綁定。初始畫面是中性版型示意，不放入假姓名或假頭像，不表示已取得個人資料。

Google 製卡目前維護中，原 Google Identity Services 流程及驗證 API 保留，但預設不顯示 Google 入口。來源設定修復並完成真實登入驗收後，才將 `NEXT_PUBLIC_GOOGLE_SHARE_ENABLED=true`，同時提供有效的 `NEXT_PUBLIC_GOOGLE_CLIENT_ID` 並重新建置；單獨填入 Client ID 不會開放入口。Google 用戶端與允許來源須依實際部署網域設定；更換用戶端時，同步核對前端設定與伺服器憑證驗證設定。維護完成時也要同步更新隱私頁的功能狀態。Google 登入日後仍是自選製卡方式，不是製卡或參與議題的必要條件。

Google 入口啟用後，只有點擊「用 Google 帶入姓名與頭像」才載入 GIS 並取得 nonce，以 Google 官方按鈕開始登入，不啟動 One Tap。nonce Cookie 最長 10 分鐘、HttpOnly、SameSite=Strict；伺服器使用 `google-auth-library` 驗證簽章、`aud`／`iss`／`exp` 及 nonce，驗證處理後清除 Cookie，不建立個人資料 session。API 僅回傳姓名及已驗證頭像的 data URL，不回傳 `sub`、email 或 token。姓名與頭像只保留於頁面記憶體，不寫入 `localStorage` 或匿名表態資料庫，不與 `pid` 綁定。

完整製卡區只設於首頁，位在 Hero 之後、關於怡君（about）之前。主要製卡入口 `SHARE_CARD_ENTRY` 統一為 `/#share-card`；首頁仍保留故事與 Facebook 入口。`/deliberation/` 專注於議題背景與參與討論，該路由的頁首主按鈕為「參與討論」，其他頁面則保留「中和小卡」入口。

小卡為 1080 × 1350 PNG，不包含表態選擇或虛構參與結果。畫面示意與下載卡皆以 `qrcode` 產生指向本站首頁 `https://sunnychen.tw/` 的 QR Code，並顯示同一首頁網域；網址、標籤與製卡入口統一維護於 `src/data/share-card.ts`。首頁的 `ShareCardSection` 在伺服器產生示意 QR 並隨 HTML 顯示，不必登入或等候瀏覽器製卡；實際製卡、Google 旗標與資料清理由 `DeliberationShareCard` 處理，下載卡在瀏覽器使用相同網址常數產生 QR。分享按鈕與複製備援仍可帶入公開討論網址，與圖片上的首頁 QR 用途分開。

選擇「清除小卡資料」或離開頁面時會清理手動輸入／Google 提供的個人資料、未完成請求、製卡資源及 Blob URL；這不會刪除已下載或分享的副本，也不會登出使用者原有的 Google 帳號。小卡在瀏覽器產生，由使用者主動下載或分享，沒有公開個人分享網址。支援時使用 Web Share Files，否則改為複製討論網址；自動複製失敗時顯示可手動複製的網址，不宣稱已發文。

Cloudflare AI 摘要若啟用，只處理已核准公開的觀點與統計，依服務程式設定的配額限制執行，不傳送製卡稱呼、照片、Google 姓名、頭像或登入身分。變更審核、開放資料、AI 或資料保存行為時，應同步更新 `src/app/privacy/page.tsx`；不要將 token、個人資料、管理憑證或審議原始資料提交至原始碼庫。Next.js 網站與 Cloudflare 審議服務是分開的部署邊界，前端建置成功不代表後端服務、Google 設定或 AI 已可用。

Pocket Polis 上游基準為 `836ba19ffa93037555b22f2fd48645678255ab03`，其 MIT 原文與 notice 見 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。參與者觀點、使用者填寫的稱呼與自選照片、Google 姓名與頭像不因網站開源而取得 MIT 或 CC BY-SA 4.0 再利用授權，素材權利邊界另見 [ASSETS.md](./ASSETS.md)。

## 動畫

GSAP 與 ScrollTrigger 由 npm 安裝並由本站提供，首頁與故事頁採動態載入；路由切換與 React 卸載時清除舊動畫及事件。動畫包含標題與照片入場、太陽線條描繪、簽名揭示、閱讀區塊捲動淡入、黃色重點筆畫、故事章節切換，以及桌面照片輕微視差與按鈕箭頭互動。

遵循 `prefers-reduced-motion`，使用者在動畫途中變更偏好時也會立即清除動畫樣式。桌面視差僅用於滑鼠裝置；深連結與還原捲動位置會略過首屏入場。即使 JavaScript 關閉或動畫模組載入失敗，內容仍可閱讀；既有選單與章節功能不依賴 GSAP。

章節錨點使用瀏覽器即時定位。請勿直接恢復全域 `scroll-behavior: smooth`，圖片與字型載入時的 ScrollTrigger refresh 可能中止原生平滑捲動，導致深連結停在錯誤位置。

動畫驗證包含快速切換章節、鍵盤焦點、即時減少動態、手機選單、故事深連結與返回、五種螢幕寬度、動畫模組阻擋及無 JavaScript 情境。

### 互動棒球

首頁人物介紹區加入 Three.js 0.186.1 棒球，接近可視區域時才載入 3D 模組。球面、縫線、針腳與皮革細節皆由程式產生，沒有外部貼圖或 GLB 模型請求。

棒球在可視區域內、分頁位於前景且未啟用減少動態時，預設持續自轉。聚焦球體後可按空白鍵暫停或繼續滾動；拖曳時暫停自轉，放開後恢復原本的滾動狀態。離開可視區域或分頁進入背景時停止動畫，回到前景可視區域後依原狀態恢復。

畫面只保留「轉個好球」按鈕，播放約一秒的轉圈與小幅跳動。可拖曳旋轉，或聚焦球體後使用方向鍵操作，按 `Home` 回到初始角度。啟用減少動態時不持續自轉，「轉個好球」改為直接轉換角度。離頁會釋放事件、觀察器與 WebGL 資源；JavaScript 關閉、3D 模組載入失敗或 WebGL 不可用時保留 SVG 棒球備援。

### 投票日倒數

投票日為 2026 年 11 月 28 日，日期與[中選會公告](https://www.cec.gov.tw/central/article/61722)一致。倒數目標是台灣時間當日 00:00，代表進入投票日，不表示投票所開放時間。當天顯示「今天是投票日」，台灣時間 11 月 29 日起顯示「投票日已結束」。

每秒以目前時間重新計算天、時、分、秒；背景分頁暫停計時器，回到前景時重新校正。數字不向輔助工具每秒播報。靜態 HTML 保留日期，掛載後才顯示即時數值，避免伺服器與瀏覽器時間不同造成 hydration 錯誤。

原創程序建模與互動程式適用本專案 MIT；Three.js 保留自己的 MIT notice，詳見 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。人物、照片與官方識別素材的授權例外維持不變。

## SEO

各頁提供可直接讀取的靜態 HTML、標題與描述，並設定 canonical、Open Graph、Twitter 分享資料及 JSON-LD 結構化資料。搜尋引擎入口為 `public/robots.txt` 與 `public/sitemap.xml`；新增或移除公開頁面時，請同步維護 sitemap。主要網域變更時，也須同步調整 `next.config.ts`、共用版型及各頁 Metadata 及上述搜尋設定。

公共議題頁使用正式網址 `https://sunnychen.tw/deliberation/`，已列入 sitemap；公開社群預覽使用 `public/images/deliberation-share.png`（1200 × 630）。維護該頁的議題標題與背景時，同步更新其 title、description、canonical、Open Graph、Twitter 與 `WebPage` JSON-LD，避免沿用首頁標題。手動填寫的稱呼、自選照片、Google 姓名與頭像、匿名 `pid` 與個人小卡不得放入公開分享網址、分享 Metadata、JSON-LD 或 sitemap；本機產生的小卡沒有可索引的個人頁面。個人小卡與公開議題的社群預覽圖是不同用途。

## 圖片與文字來源

故事內容及原書頁來自委託提供的十張故事書照片；實際網站使用真實人物與活動照片。官方 Facebook 素材來源：

- [陳怡君正式肖像](https://www.facebook.com/photo/?fbid=122199235742906843&set=a.122095338446906843)
- [官方封面文宣](https://www.facebook.com/photo/?fbid=122199722582906843&set=a.122125307216906843)
- [市場走訪照片](https://www.facebook.com/photo/?fbid=122209076738906843&set=pcb.122209077224906843)
- [中和超拚 陳怡君 Sunny 粉絲專頁](https://www.facebook.com/tppsunny)

更新人物經歷、參選身分與聯絡資料時，請以本人或團隊確認的最新資料為準。

### 字型效能

目前主字集使用 `public/fonts/sunny-noto-tc-v2.woff2`，大小為 209448 bytes（約 205 KiB）；公共議題、隱私與分享小卡的新增文字使用 `sunny-noto-tc-extra-v1.woff2` 補充子集，大小為 58872 bytes（約 57.5 KiB），透過 CSS `unicode-range` 分開載入。簽名字型約數 KB。字型產生腳本會讀取 `src/` 下的 `.astro`、`.ts`、`.tsx` 與 `.css` 文案。

更新文案後，可安裝 `fonttools[woff]`，使用官方 Noto Sans TC 可變字型執行：

```sh
python scripts/subset-fonts.py /path/to/NotoSansTC-variable.ttf
```

預設輸出檔名為 `sunny-noto-tc-v2.woff2`。也可用第二個參數指定下一版檔名，輸出位置仍在 `public/fonts/`：

```sh
python scripts/subset-fonts.py /path/to/NotoSansTC-variable.ttf sunny-noto-tc-v3.woff2
```

新增版本後，請同步更新 `src/app/layout.tsx` 的主字集預載路徑與 `src/styles/global.css` 的字型路徑；目前主字集為 v2，CSS 另載入 extra-v1。已發布的字型請使用新檔名版本，不覆寫長效快取中的舊檔。未包含的字元會使用系統字型。保留的 v1、目前 v2 與 extra-v1 補充子集均適用 `public/fonts/` 隨附的 SIL OFL 授權。

審議頁與新增文字使用 `sunny-noto-tc-extra-v1.woff2` 補充字形；原有 v2 字型的網址與內容保持固定，避免 immutable 快取衝突。審議頁專用社群預覽圖為 `/images/deliberation-share.png`（1200×630），不含個人資料。

SEO 回歸檢查：啟動網站後執行 `node scripts/check-seo.mjs http://localhost:4321`；部署後改用 `https://sunnychen.tw`。檢查五個公開頁面的原始 HTML、標準網址、JSON-LD、分享圖、sitemap、robots、API 不索引及 404。通過技術檢查不保證 Google 收錄時間或排名。
