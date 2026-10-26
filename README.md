# 陳怡君 Sunny Chen｜幸福怡起拚

以青綠 `#28C8C8` 與暖珊瑚粉 `#F6B1AA` 撞色的競選形象網站，結合運動感大字、貼紙照片框、書籤導覽與真實人物故事。使用 Next.js 16 App Router 與 React 19，於建置時預先產生各頁 HTML，字型由本站提供，圖片使用 WebP。

正式網域為 [sunnychen.tw](https://sunnychen.tw)，Vercel 專案名稱為 `sunnychen-tw`，`www.sunnychen.tw` 以 308 轉址至主網域。

Next.js 版本已於 2026 年 10 月 26 日完成正式部署。青粉改版正式站手機 Lighthouse：效能 91、無障礙 100、最佳實務 100、SEO 100，CLS 0。量測會受網路與裝置環境影響。已驗證 320、360、390、430、768、1024、1536px 的四個頁面無水平溢出，以及 GSAP、章節導覽、Next.js 換頁返回、減少動態與載入失敗備援。

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
- `src/app/layout.tsx`：共用導覽、頁尾及 SEO 資料。
- `src/styles/global.css`：色彩、字型與共用樣式；各頁 CSS 有頁面範圍，避免換頁後樣式互相影響。
- `src/components/SiteHeader.tsx`：手機選單與共用導覽。
- `src/components/ChapterTabs.tsx`：React 章節狀態與鍵盤操作。
- `src/components/PageMotion.tsx`：Next.js 換頁後初始化 GSAP，離頁時清理。
- `src/scripts/motion.ts`：GSAP 首屏入場、捲動揭示、章節切換與桌面微互動。
- `src/app/privacy/page.tsx`：隱私權說明。
- `public/images/`：網站使用的照片與分享圖片。

社群動態是人工整理的靜態內容與外部連結，沒有自動同步 Facebook。電話、電子信箱及服務據點地址取自已查證的公開粉絲專頁，異動時請同步更新首頁。本網站未加入分析追蹤工具，也沒有收集資料的表單。

## 動畫

GSAP 與 ScrollTrigger 由 npm 安裝並由本站提供，首頁與故事頁採動態載入；路由切換與 React 卸載時清除舊動畫及事件。動畫包含標題與照片入場、太陽線條描繪、簽名揭示、閱讀區塊捲動淡入、黃色重點筆畫、故事章節切換，以及桌面照片輕微視差與按鈕箭頭互動。

遵循 `prefers-reduced-motion`，使用者在動畫途中變更偏好時也會立即清除動畫樣式。桌面視差僅用於滑鼠裝置；深連結與還原捲動位置會略過首屏入場。即使 JavaScript 關閉或動畫模組載入失敗，內容仍可閱讀；既有選單與章節功能不依賴 GSAP。

章節錨點使用瀏覽器即時定位。請勿直接恢復全域 `scroll-behavior: smooth`，圖片與字型載入時的 ScrollTrigger refresh 可能中止原生平滑捲動，導致深連結停在錯誤位置。

動畫驗證包含快速切換章節、鍵盤焦點、即時減少動態、手機選單、故事深連結與返回、五種螢幕寬度、動畫模組阻擋及無 JavaScript 情境。

## SEO

各頁提供可直接讀取的靜態 HTML、標題與描述，並設定 canonical、Open Graph、Twitter 分享資料及 JSON-LD 結構化資料。搜尋引擎入口為 `public/robots.txt` 與 `public/sitemap.xml`；新增或移除公開頁面時，請同步維護 sitemap。主要網域變更時，也須同步調整 `next.config.ts`、共用版型及各頁 Metadata 及上述搜尋設定。

## 圖片與文字來源

故事內容及原書頁來自委託提供的十張故事書照片；實際網站使用真實人物與活動照片。官方 Facebook 素材來源：

- [陳怡君正式肖像](https://www.facebook.com/photo/?fbid=122199235742906843&set=a.122095338446906843)
- [官方封面文宣](https://www.facebook.com/photo/?fbid=122199722582906843&set=a.122125307216906843)
- [市場走訪照片](https://www.facebook.com/photo/?fbid=122209076738906843&set=pcb.122209077224906843)
- [中和超拚 陳怡君 Sunny 粉絲專頁](https://www.facebook.com/tppsunny)

更新人物經歷、參選身分與聯絡資料時，請以本人或團隊確認的最新資料為準。

### 字型效能

繁中字型已依目前文案縮減為自架 WOFF2 子集（約 174 KB），簽名字型約數 KB。更新文案後，可安裝 `fonttools[woff]`，使用官方 Noto Sans TC 可變字型執行 `python scripts/subset-fonts.py /path/to/NotoSansTC-variable.ttf`。若替換字型檔，請一併更新檔名版本與 `src/app/layout.tsx` 預載路徑、`global.css` 路徑，避免長效快取。未包含的字元會使用系統字型。SIL OFL 授權保留在 `public/fonts/`。
