<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# 🍲 東方靈飢荒百科 (Dong-Ting Don't Starve Together Encyclopedia)

本專案是一個專為《Don't Starve Together》(飢荒聯機版) 玩家設計的 Crock Pot 砂鍋食譜模擬器、技能天賦樹與升級晶片規劃工具。玩家可以透過直覺的介面勾選現有食材、篩選食譜，或是直接在模擬器中放入食材進行「虛擬烹飪」，計算出最終的料理結果與其生命值、飢餓值和精神值恢復數據。此外，系統還整合了機器人 WX-78 的技能樹與電路板升級系統，提供高精度模擬與快捷預設載入。

---

## ✨ 核心功能

*   **🔍 智能食譜檢索庫**：可依據手頭上現有的食材自動篩選出所有可製作的料理。
*   **🔥 烹飪真實模擬器**：手動挑選 4 種食材放入砂鍋，點擊「開火烹飪！」模擬遊戲內的配方優先級計算，精準呈現料理結果。
*   **⚡ WX-78 天賦樹與晶片升級系統**：包含 WX-78 官方繁中技能天賦樹與插槽規劃，支援一鍵裝載多套主流晶片預設方案，並能動態追蹤與呈現當前機體狀態加成。
*   **📊 完整屬性分析**：每項料理皆提供詳細的生命值 (HP ❤️)、飢餓值 (Hunger 🍖)、精神值 (Sanity 🌀) 恢復係數，以及烹飪時間與腐爛天數。
*   **⚙️ 靈活排序與篩選**：支援以生命值、飢餓值、精神值進行排序，並可快速篩選「神級回血」、「大力補腹」、「養腦提神」或「副作用料理」。

---

## 🛠️ 開發與本地運行

### 1. 前置需求 (Prerequisites)
*   **Node.js** (建議 v18.0.0 以上)
*   **npm** (或 yarn / pnpm)

### 2. 安裝步驟
Clone 專案至本地後，執行以下命令安裝依賴套件：
```bash
npm install
```

### 3. 本地運行開發伺服器
```bash
npm run dev
```
啟動後可在瀏覽器打開 [http://localhost:3000](http://localhost:3000) 進行預覽與開發。

### 4. 專案腳本 (Scripts)
*   `npm run dev`：啟動本地 Vite 開發伺服器。
*   `npm run build`：將專案編譯包裝為靜態網頁（輸出至 `/dist`）。
*   `npm run preview`：預覽已編譯完成的靜態網頁。
*   `npm run lint`：執行 TypeScript 靜態語法檢查。
*   `npm run clean`：清理快取與編譯目錄。

---

## 🚀 GitHub Actions 自動化部署上線

本專案已設定好 GitHub Actions 自動化部署工作流（[deploy.yml](.github/workflows/deploy.yml)），只要將程式碼推送到 GitHub 的 `main` 分支，即可自動打包並部署至 **GitHub Pages**！

### 🔔 GitHub 設定步驟（首次部署需設定）：

1.  將專案 Push 到你的 GitHub 儲存庫（如：`dong052627/Dong-Ting-Dont-Starve-Together-Wiki`）。
2.  前往該專案的 GitHub 頁面，點擊 **Settings** (設定) -> **Pages**。
3.  在 **Build and deployment** -> **Source** 選擇 **GitHub Actions**（而非 Deploy from a branch）。
4.  當你推送程式碼至 `main` 分支後，GitHub Actions 將會自動執行並部署，稍等片刻即可透過 `https://dong052627.github.io/Dong-Ting-Dont-Starve-Together-Wiki/` 存取你的模擬器！

> [!TIP]
> 部署的路由基礎路徑已在 `vite.config.ts` 中配置為 `base: process.env.GITHUB_ACTIONS ? '/Dong-Ting-Dont-Starve-Together-Wiki/' : '/'`。如果您更換了 GitHub 儲存庫名稱，請記得調整該路徑，以避免部署後靜態資源加載失敗 (404)。

---

## 📁 檔案結構

```text
├── .github/workflows/
│   └── deploy.yml          # GitHub Actions 自動部署工作流
├── assets/                 # 靜態資源目錄
├── src/
│   ├── App.tsx             # 模擬器主要邏輯與 UI 元件
│   ├── recipesData.ts      # 飢荒食材與食譜數據、優先級演算法
│   ├── index.css           # 全域樣式與 Tailwind CSS v4 配置
│   └── main.tsx            # React 進入點
├── index.html              # HTML 範本
├── package.json            # 專案依賴與腳本配置
├── tsconfig.json           # TypeScript 設定檔
├── vite.config.ts          # Vite 建置與伺服器設定
└── .gitignore              # Git 忽略檔案配置
```
