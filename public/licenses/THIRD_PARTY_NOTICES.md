# 第三方套件與字型聲明

本文件依 2026 年 10 月 26 日的 `package.json`、`package-lock.json`、已安裝套件的授權／notice 檔與隨附字型授權整理。它記錄套件來源與實際標示，不取代完整授權條款，也不是對所有依賴、平台建置產物或使用方式完成合規審查的聲明。

原創程式碼的 MIT 授權與可授權原創設計／文件的開放授權，不會將第三方套件或字型改授相同條款。競選照片、故事、文宣與品牌素材的例外另見 [ASSETS.md](ASSETS.md)。

## 直接執行期依賴

| 套件 | 鎖定版本 | 上游授權 | 實際 copyright／notice 與位置 |
| --- | --- | --- | --- |
| [Next.js](https://github.com/vercel/next.js) | 16.4.3 | MIT | `Copyright (c) 2025 Vercel, Inc.`；原檔 `node_modules/next/license.md`，原文副本：[next-MIT.txt](LICENSES/next-MIT.txt) |
| [React](https://github.com/facebook/react) | 19.3.1 | MIT | `Copyright (c) Meta Platforms, Inc. and affiliates.`；`node_modules/react/LICENSE`，原文副本：[react-MIT.txt](LICENSES/react-MIT.txt) |
| React DOM | 19.3.1 | MIT | 同上；`node_modules/react-dom/LICENSE` 與上述 React 授權原文相同 |
| [GSAP](https://github.com/greensock/GSAP) | 3.15.0 | GreenSock Standard “no charge” license | `Copyright 2008-2026, GreenSock. All rights reserved.`；使用 GSAP、ScrollTrigger；上游原始碼 banner 副本：[GSAP-NOTICE.txt](LICENSES/GSAP-NOTICE.txt) |

**GSAP 不是 MIT。** 安裝套件的 `package.json` 標示為 `Standard 'no charge' license: https://gsap.com/standard-license.`，程式碼 banner 也指向 [GSAP 標準授權](https://gsap.com/standard-license)。本站保留的 `GSAP-NOTICE.txt` 是原始碼聲明副本，不是標準授權全文；使用及散布仍依上游條款，不能以本專案 MIT 取代。[GSAP 官方 README](https://github.com/greensock/GSAP/blob/master/README.md)亦明列該授權名稱及連結。

## 開發與型別依賴

以下版本取自鎖檔；`@types/node` 的 `package.json` 範圍為 `^24`，此表列目前實際鎖定版本。

| 套件 | 鎖定版本 | 授權 | 安裝後的原文位置 |
| --- | --- | --- | --- |
| TypeScript | 5.9.3 | Apache-2.0 | `node_modules/typescript/LICENSE.txt`、`node_modules/typescript/ThirdPartyNoticeText.txt` |
| `@types/node` | 24.19.2 | MIT | `node_modules/@types/node/LICENSE` |
| `@types/react` | 19.3.0 | MIT | `node_modules/@types/react/LICENSE` |
| `@types/react-dom` | 19.3.0 | MIT | `node_modules/@types/react-dom/LICENSE` |
| `csstype` | 3.2.3 | MIT | `node_modules/csstype/LICENSE` |
| `undici-types` | 7.24.6 | MIT | `node_modules/undici-types/LICENSE` |

已安裝的三個 `@types/*` 授權檔均保留 `Copyright (c) Microsoft Corporation.`。TypeScript 的 `ThirdPartyNoticeText.txt` 另外列有 DefinitelyTyped 與 Unicode 等上游材料，不能用一段 Apache-2.0 摘要代替該檔。

## 鎖檔中的其他依賴

這些是目前鎖檔記錄的間接依賴。下列 `node_modules/...` 是執行 `npm ci` 後的檔案位置，不表示本原始碼庫已內嵌這些套件。授權名稱保留鎖檔原有標示。

| 套件 | 鎖定版本 | 授權 | 原文／標示位置 |
| --- | --- | --- | --- |
| `@next/env` | 16.4.3 | MIT | `node_modules/@next/env/package.json`；Next.js 上游授權 |
| `@swc/helpers` | 0.5.23 | Apache-2.0 | `node_modules/@swc/helpers/LICENSE` |
| `baseline-browser-mapping` | 2.11.33 | Apache-2.0 | `node_modules/baseline-browser-mapping/LICENSE.txt` |
| `caniuse-lite` | 1.0.30001819 | CC-BY-4.0 | `node_modules/caniuse-lite/LICENSE`；資料來源：[caniuse-lite](https://github.com/browserslist/caniuse-lite) |
| `client-only` | 0.0.1 | MIT | `node_modules/client-only/package.json`；已安裝套件根目錄沒有獨立 LICENSE |
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
| Noto Sans TC 子集：`public/fonts/sunny-noto-tc-v1.woff2` | SIL Open Font License 1.1 | [OFL-NotoSansTC.txt](public/fonts/OFL-NotoSansTC.txt) |
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
