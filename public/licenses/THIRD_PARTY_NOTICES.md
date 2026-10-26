# 第三方套件與字型聲明

本文件依 2026 年 10 月 26 日的 `package.json`、`package-lock.json`、已安裝套件的授權／notice 檔、隨附字型授權與下列 Pocket Polis 上游版本整理。它記錄套件來源與實際標示，不取代完整授權條款，也不是對所有依賴、平台建置產物或使用方式完成合規審查的聲明。

原創程式碼的 MIT 授權與可授權原創設計／文件的開放授權，不會將第三方套件或字型改授相同條款。競選照片、故事、文宣與品牌素材的例外另見 [ASSETS.md](ASSETS.md)。

## 直接執行期依賴

| 套件 | 鎖定版本 | 上游授權 | 實際 copyright／notice 與位置 |
| --- | --- | --- | --- |
| [Next.js](https://github.com/vercel/next.js) | 16.4.3 | MIT | `Copyright (c) 2025 Vercel, Inc.`；原檔 `node_modules/next/license.md`，原文副本：[next-MIT.txt](LICENSES/next-MIT.txt) |
| [React](https://github.com/facebook/react) | 19.3.1 | MIT | `Copyright (c) Meta Platforms, Inc. and affiliates.`；`node_modules/react/LICENSE`，原文副本：[react-MIT.txt](LICENSES/react-MIT.txt) |
| React DOM | 19.3.1 | MIT | 同上；`node_modules/react-dom/LICENSE` 與上述 React 授權原文相同 |
| [GSAP](https://github.com/greensock/GSAP) | 3.15.0 | GreenSock Standard “no charge” license | `Copyright 2008-2026, GreenSock. All rights reserved.`；使用 GSAP、ScrollTrigger；上游原始碼 banner 副本：[GSAP-NOTICE.txt](LICENSES/GSAP-NOTICE.txt) |
| [Three.js](https://github.com/mrdoob/three.js) | 0.186.1 | MIT | `Copyright © 2010-2026 three.js authors`；原檔 `node_modules/three/LICENSE`，完整原文副本：[three-MIT.txt](LICENSES/three-MIT.txt) |
| [Google Auth Library](https://github.com/googleapis/google-auth-library-nodejs) | 11.3.1 | Apache-2.0 | 原檔 `node_modules/google-auth-library/LICENSE`，完整原文副本：[google-auth-library-Apache-2.0.txt](LICENSES/google-auth-library-Apache-2.0.txt)；其 `build/src/index.js` 保留 `Copyright 2017 Google LLC` |
| [QRCode](https://github.com/soldair/node-qrcode) | 1.5.4 | MIT | `Copyright (c) 2012 Ryan Day`；原檔 `node_modules/qrcode/license`，完整原文副本：[qrcode-MIT.txt](LICENSES/qrcode-MIT.txt) |

**GSAP 不是 MIT。** 安裝套件的 `package.json` 標示為 `Standard 'no charge' license: https://gsap.com/standard-license.`，程式碼 banner 也指向 [GSAP 標準授權](https://gsap.com/standard-license)。本站保留的 `GSAP-NOTICE.txt` 是原始碼聲明副本，不是標準授權全文；使用及散布仍依上游條款，不能以本專案 MIT 取代。[GSAP 官方 README](https://github.com/greensock/GSAP/blob/master/README.md)亦明列該授權名稱及連結。

## Pocket Polis 審議服務與外部登入

本站審議服務以 [mashbean/pocket-polis](https://github.com/mashbean/pocket-polis) 為上游，套件名稱為 `@mashbean/pocket-polis`，上游 `package.json` 版本為 `0.1.0`。採用基準為 commit [`836ba19ffa93037555b22f2fd48645678255ab03`](https://github.com/mashbean/pocket-polis/tree/836ba19ffa93037555b22f2fd48645678255ab03)，原始 `LICENSE` 是 **MIT License**，實際 notice 為：

```text
Copyright (c) 2026 mashbean
```

完整原文副本：[pocket-polis-MIT.txt](LICENSES/pocket-polis-MIT.txt)。`services/polis/` 保留該上游授權全文；本專案的介接與部署調整不移除原作者聲明，也不將上游程式的著作權改記為本站原創。升級或替換上游時，應核對採用版本並保留其適用授權。

Pocket Polis 服務有自己的套件與建置依賴，應依 `services/polis/` 內的套件清單、鎖檔及安裝套件所附 LICENSE／NOTICE 保留相關條款。下列網站根目錄的依賴表，不是這項獨立服務的完整依賴授權盤點；Pocket Polis 採 MIT 也不表示它使用的所有套件、服務或模型都採 MIT。

本站只使用 REST，已從服務副本移除 MCP transport、相關測試及 `@modelcontextprotocol/server`、`agents`、`zod` 執行期依賴，並停用 `/mcp`。上游演算法與審核程式仍保留 MIT 授權；改動記錄見 `services/polis/UPSTREAM.md`。

服務目錄目前直接宣告的開發／建置依賴與鎖定版本如下。此表不包含其全部間接依賴，原文位置相對於專案根目錄：

| 套件 | 鎖定版本 | 授權標示 | 原文／標示位置 |
| --- | --- | --- | --- |
| `tsx` | 4.23.15 | MIT | `services/polis/node_modules/tsx/LICENSE` |
| TypeScript | 5.9.3 | Apache-2.0 | `services/polis/node_modules/typescript/LICENSE.txt`、`ThirdPartyNoticeText.txt` |
| Vitest | 5.0.5 | MIT | `services/polis/node_modules/vitest/LICENSE.md`；包含其他內含元件的 notice |
| Wrangler | 4.152.0 | MIT OR Apache-2.0 | `services/polis/package-lock.json`、`services/polis/node_modules/wrangler/package.json`；已安裝套件根目錄未附獨立 LICENSE，使用時須核對上游原文 |

實際 notice 包含 `Copyright (c) Hiroki Osame <hiroki.osame@gmail.com>`（tsx），以及 `Copyright (c) 2021-Present VoidZero Inc. and Vitest contributors`。摘要不取代上述完整檔案內的其他 notice。

`services/polis/worker-configuration.d.ts` 另包含由 Wrangler 產生的執行期型別，檔頭標記 `workerd@1.20261019.1`、相容日期 `2026-09-01`。其中的 runtime types 依原檔頭採 **Apache License 2.0**，不是 Pocket Polis 或本站 MIT 授權的一部分；原檔保留以下聲明及原有授權／免責段落：

```text
Copyright (c) Cloudflare. All rights reserved.
Copyright (c) Microsoft Corporation. All rights reserved.
```

Apache 2.0 條款全文可參閱已隨附的 [Apache License 2.0 原文副本](LICENSES/google-auth-library-Apache-2.0.txt)。此共用條款連結不改變 runtime types 的上述權利人，也不把它的著作權歸屬於 Google。重新產生型別時，須保留產物中適用的上游聲明。

本專案不收錄上游 demo 資料、GitHub workflows 或 agent-installation skill，也不重播示範參與者及回應。因此本文件不把上游 demo 的資料授權列作本站已收錄素材的授權。

Google Identity Services 用於自選登入，Cloudflare Workers、Durable Objects 與選用的 Workers AI 用於審議服務。這些外部服務、Google 標誌及服務供應商的其他材料不由本專案的 MIT 或 CC BY-SA 4.0 重新授權。Google 姓名、頭像與參與者提交內容的權利範圍另見 [ASSETS.md](ASSETS.md)。

## 開發與型別依賴

以下版本取自鎖檔；`@types/node` 的 `package.json` 範圍為 `^24`，此表列目前實際鎖定版本。

| 套件 | 鎖定版本 | 授權 | 安裝後的原文位置 |
| --- | --- | --- | --- |
| TypeScript | 5.9.3 | Apache-2.0 | `node_modules/typescript/LICENSE.txt`、`node_modules/typescript/ThirdPartyNoticeText.txt` |
| `@types/node` | 24.19.2 | MIT | `node_modules/@types/node/LICENSE` |
| `@types/react` | 19.3.0 | MIT | `node_modules/@types/react/LICENSE` |
| `@types/react-dom` | 19.3.0 | MIT | `node_modules/@types/react-dom/LICENSE` |
| `@types/three` | 0.186.0 | MIT | `node_modules/@types/three/LICENSE` |
| `@types/qrcode` | 1.5.6 | MIT | `node_modules/@types/qrcode/LICENSE` |
| `csstype` | 3.2.3 | MIT | `node_modules/csstype/LICENSE` |
| `undici-types` | 7.24.6 | MIT | `node_modules/undici-types/LICENSE` |

上述 `@types/node`、`@types/react`、`@types/react-dom`、`@types/three`、`@types/qrcode` 的授權檔均保留 `Copyright (c) Microsoft Corporation.`。TypeScript 的 `ThirdPartyNoticeText.txt` 另外列有 DefinitelyTyped 與 Unicode 等上游材料，不能用一段 Apache-2.0 摘要代替該檔。

### Three.js 型別套件帶入的開發依賴

`@types/three` 0.186.0 另帶入下列套件；目前鎖檔均標示為開發依賴。列入此表不表示首頁棒球在執行時使用 Rapier、Tween.js、WebXR 或模型解壓縮器。本站棒球的執行期模組只從 `three` 匯入所需功能，模型與皮革細節由本站程式產生。

| 套件 | 鎖定版本 | 授權 | 安裝後的原文位置 |
| --- | --- | --- | --- |
| `@dimforge/rapier3d-compat` | 0.12.0 | Apache-2.0 | `node_modules/@dimforge/rapier3d-compat/LICENSE` |
| `@tweenjs/tween.js` | 23.1.3 | MIT | `node_modules/@tweenjs/tween.js/LICENSE` |
| `@types/stats.js` | 0.17.4 | MIT | `node_modules/@types/stats.js/LICENSE` |
| `@types/webxr` | 0.5.24 | MIT | `node_modules/@types/webxr/LICENSE` |
| `fflate` | 0.8.3 | MIT | `node_modules/fflate/LICENSE` |
| `meshoptimizer` | 1.1.1 | MIT | `node_modules/meshoptimizer/LICENSE.md` |

其中 Tween.js 的原文保留 `Copyright (c) 2010-2012 Tween.js authors.` 與 `Easing equations Copyright (c) 2001 Robert Penner http://robertpenner.com/easing/`；`fflate` 保留 `Copyright (c) 2026 Arjun Barrett`；`meshoptimizer` 保留 `Copyright (c) 2016-2026 Arseny Kapoulkine`。兩個新增的間接 `@types/*` 套件同樣保留 Microsoft Corporation 的 copyright notice。上述路徑的完整授權仍應隨相關套件保留。

## 鎖檔中的其他依賴

這些是目前鎖檔記錄的間接依賴。下列 `node_modules/...` 是執行 `npm ci` 後的檔案位置，不表示本原始碼庫已內嵌這些套件。授權名稱保留鎖檔原有標示。

| 套件 | 鎖定版本 | 授權 | 原文／標示位置 |
| --- | --- | --- | --- |
| `@next/env` | 16.4.3 | MIT | `node_modules/@next/env/package.json`；Next.js 上游授權 |
| `@swc/helpers` | 0.5.23 | Apache-2.0 | `node_modules/@swc/helpers/LICENSE` |
| `baseline-browser-mapping` | 2.11.33 | Apache-2.0 | `node_modules/baseline-browser-mapping/LICENSE.txt` |
| `caniuse-lite` | 1.0.30001819 | CC-BY-4.0 | `node_modules/caniuse-lite/LICENSE`；資料來源：[caniuse-lite](https://github.com/browserslist/caniuse-lite) |
| `client-only` | 0.0.1 | MIT | `node_modules/client-only/package.json`；已安裝套件根目錄沒有獨立 LICENSE |
| `gaxios` | 8.3.2 | Apache-2.0 | `node_modules/gaxios/LICENSE` |
| `gcp-metadata` | 9.2.2 | Apache-2.0 | `node_modules/gcp-metadata/LICENSE` |
| `google-logging-utils` | 2.1.0 | Apache-2.0 | `node_modules/google-logging-utils/LICENSE` |
| `ecdsa-sig-formatter` | 1.0.11 | Apache-2.0 | `node_modules/ecdsa-sig-formatter/LICENSE` |
| `buffer-equal-constant-time` | 1.0.1 | BSD-3-Clause | `node_modules/buffer-equal-constant-time/LICENSE.txt` |
| `cliui` | 6.0.0 | ISC | `node_modules/cliui/LICENSE.txt` |
| `nanoid` | 3.3.20 | MIT | `node_modules/nanoid/LICENSE` |
| `postcss`（Next.js 依賴） | 8.5.23 | MIT | `node_modules/next/node_modules/postcss/LICENSE` |
| `picocolors` | 1.1.1 | ISC | `node_modules/picocolors/LICENSE` |
| `scheduler` | 0.28.0 | MIT | `node_modules/scheduler/LICENSE` |
| `source-map-js` | 1.2.2 | BSD-3-Clause | `node_modules/source-map-js/LICENSE` |
| `styled-jsx` | 5.1.6 | MIT | `node_modules/styled-jsx/license.md` |
| `tslib` | 2.8.1 | 0BSD | `node_modules/tslib/LICENSE.txt`、`node_modules/tslib/CopyrightNotice.txt` |

其中實際 notice 包含：

- `nanoid`：Copyright 2017 Andrey Sitnik。
- `picocolors`：Copyright (c) 2021-2024 Oleksii Raspopov, Kostiantyn Denysov, Anton Verinov。
- `scheduler`：Copyright (c) Meta Platforms, Inc. and affiliates.。
- `source-map-js`：Copyright (c) 2009-2011, Mozilla Foundation and contributors；保留原授權所列條件及免責聲明。
- `styled-jsx`：Copyright (c) 2016-present Vercel, Inc.。
- `tslib`：Copyright (c) Microsoft Corporation.。
- `csstype`：Copyright (c) 2017-2018 Fredrik Nicol。
- `undici-types`：Copyright (c) Matteo Collina and Undici contributors。

這些摘要方便定位原文；散布相關套件或其實質內容時，仍保留完整上游 notice 與適用授權。

## Optional 與原生平台依賴

鎖檔包含不同作業系統、CPU 與 WebAssembly 的替代套件；不是每個環境都會安裝全部項目。以下群組僅表示目前鎖檔內的項目，不推定未列版本或未來套件使用相同授權。

| 套件／目前鎖檔群組 | 版本 | 鎖檔授權標示 | 原文／核對位置 |
| --- | --- | --- | --- |
| `@next/swc-*`（8 個平台套件） | 16.4.3 | MIT | `package-lock.json`；實際平台套件的 `package.json` 與 Next.js 上游授權 |
| `sharp` | 0.35.5 | Apache-2.0 | `node_modules/sharp/LICENSE` |
| `@img/colour` | 1.1.0 | MIT | `node_modules/@img/colour/LICENSE.md`，其中有多個上游 copyright notice |
| `@emnapi/runtime` | 1.11.3 | MIT | `package-lock.json`；目前本機未安裝，其他目標平台安裝後核對套件隨附原文 |
| `detect-libc` | 2.1.2 | Apache-2.0 | `node_modules/detect-libc/LICENSE` |
| `semver` | 7.8.5 | ISC | `node_modules/semver/LICENSE`；Copyright (c) Isaac Z. Schlueter and Contributors |
| `@img/sharp-darwin-*`、`@img/sharp-linux-*`、`@img/sharp-linuxmusl-*`、`@img/sharp-freebsd-wasm32`、`@img/sharp-webcontainers-wasm32` | 0.35.5 | Apache-2.0 | `package-lock.json`；已安裝範例 `node_modules/@img/sharp-darwin-arm64/LICENSE`；其餘平台以實際套件原文為準 |
| `@img/sharp-libvips-*`（10 個平台套件） | 1.3.4 | LGPL-3.0-or-later | `package-lock.json`；實際套件的 `README.md`、`package.json` 與所列元件授權 |
| `@img/sharp-win32-*`（arm64、ia32、x64） | 0.35.5 | Apache-2.0 AND LGPL-3.0-or-later | `package-lock.json`；依實際 Windows 套件隨附原文核對 |
| `@img/sharp-wasm32` | 0.35.5 | Apache-2.0 AND LGPL-3.0-or-later AND MIT | `package-lock.json`；依實際 WebAssembly 套件隨附原文核對 |

`sharp-libvips` 的套件級授權標示不是其所有內含元件唯一的授權。已讀取的 `node_modules/@img/sharp-libvips-darwin-arm64/README.md` 另列 aom、cairo、FreeType、libpng、mozjpeg 等元件，涵蓋 BSD、MPL 1.1、MIT、LGPL、zlib、IJG 及專屬授權／專利條款；實際版本列在同目錄 `versions.json`。若另散布原生套件，應保留對應目標平台的完整上游材料，不能只以「Sharp 為 Apache-2.0」概括。

## 自架字型

| 字型與檔案 | 適用授權 | 必須隨檔保留的完整原文 |
| --- | --- | --- |
| Noto Sans TC 目前子集：`public/fonts/sunny-noto-tc-v2.woff2` | SIL Open Font License 1.1 | [OFL-NotoSansTC.txt](public/fonts/OFL-NotoSansTC.txt) |
| Noto Sans TC 補充子集：`public/fonts/sunny-noto-tc-extra-v1.woff2` | SIL Open Font License 1.1 | 同上，保留相同完整 OFL 與 copyright notice |
| Noto Sans TC 保留的舊版子集：`public/fonts/sunny-noto-tc-v1.woff2` | SIL Open Font License 1.1 | 同上，保留相同完整 OFL 與 copyright notice |
| Caveat 子集：`public/fonts/sunny-caveat-v1.woff2` | SIL Open Font License 1.1 | [OFL-Caveat.txt](public/fonts/OFL-Caveat.txt) |

隨附 notice 原文分別為：

```text
Copyright 2014-2021 Adobe (http://www.adobe.com/), with Reserved Font Name 'Source'
```

```text
Copyright 2014 The Caveat Project Authors (https://github.com/googlefonts/caveat)
```

字型子集屬修改版本，仍採 OFL；保留完整 copyright notice、OFL 及其 Reserved Font Name 等條件，不改授 MIT 或 Creative Commons。系統備援字型沒有隨專案提供檔案。

## 安裝、建置與再次散布

原始碼庫不 vendor `node_modules/` 或 `.next/`。`npm ci` 依鎖檔下載實際平台所需套件，套件的授權和 notice 應與套件保留；升級依賴或更換平台後，重新核對鎖檔與下載套件。

Next.js 自帶的 `node_modules/next/dist/compiled/` 還包含個別第三方元件授權。此文件沒有將該目錄全量複製，也不把上列表格宣稱為建置產物的全部授權清單。若散布依賴、編譯程式、原生二進位或修改後的第三方材料，保留上游要求的 license、copyright、NOTICE 與其他適用材料，並依實際散布內容處理。

`LICENSES/` 只保存上文明列的原文副本與 GSAP banner；字型完整 OFL 留在 `public/fonts/`。這些檔案本身保留上游條款，不因存入本專案而改變授權。
