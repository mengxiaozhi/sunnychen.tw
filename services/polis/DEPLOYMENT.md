# sunnychen.tw 審議服務

此整合副本以 REST API 搭配 Next.js 原生介面。請先閱讀 UPSTREAM.md；勿直接沿用上游預設 Worker、Queue 或既有討論金鑰。

部署帳號固定為 `36ff5e232bfe09f5a2de48a444d9f547`（公開 account ID）。Queue 與 Worker 命令都使用本目錄固定的 wrangler.jsonc 與相同環境；正式 CORS 只允許 `https://sunnychen.tw`，localhost 僅留在本機設定。部署前先以 `wrangler whoami` 核對此帳號確實在 OAuth 授權範圍內。

1. 本目錄執行 `npm ci` 與 `npm run check`。
2. 執行 `npx wrangler login --scopes account:read user:read workers:write workers_scripts:write queues:write ai:write`，由帳號本人在 Cloudflare 完成 OAuth。
3. 使用 `npm run deploy:production`，建立獨立的 `sunnychen-polis` 與 `sunnychen-polis-sensemaking`。設定中沒有自訂網域，不需要修改 sunnychen.tw DNS。
4. 透過 `wrangler secret put SUNNY_SETUP_TOKEN --env production` 輸入新產生的隨機值；不要將值放在命令列、文件或公開變數中。
5. 驗證 `/api/health`，再以管理者 Bearer setup token 建立首場討論。標題與 12 個主持方起始觀點取自根目錄 `src/data/deliberation.ts`，設定保持 `autoApprove:false`、`allowSubmissions:true`、`openData:false`。
6. 回應中的 `adminToken` 與管理網址只儲存於根目錄忽略的 `.local/` 私人檔，權限 600。不要列印或提交到 Git。主持人以私人管理網址審核提案、結束議題、匯出及處理資料請求。
7. Next.js 的 `NEXT_PUBLIC_POLIS_API_URL` 與 `NEXT_PUBLIC_POLIS_CONVERSATION_ID` 是公開識別碼；它們不含管理 token。設定後重新建置網站。Google 製卡另需自己的 Web OAuth Client ID，與審議資料分開。

正式討論不得灌入模擬參與者、表態或結果。本機 QA 使用 Wrangler local 的獨立 SQLite 與 Queue；Cloudflare AI 在本機不啟用。本機測試結果不表示正式討論已開通。

此服務使用 Durable Object SQLite 作為資料層。之後部署應保持相同 Worker 名稱與 migration 歷史，避免切換資料空間。不要覆蓋帳號上其他名為 polis-serverless 的服務。
