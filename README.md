# 每日多益模擬測驗（目標 650 分）

每天 40 分鐘的多益模擬測驗，含聽力與閱讀，交卷後提供答案與繁中詳解，題目每日更新。

## 功能

- 每日 45 題：聽力 20 題（Part 2/3/4）＋閱讀 25 題（Part 5/6/7）
- 40 分鐘倒數計時，時間到自動交卷
- 交卷後即時計分、預估多益分數、逐題詳解與聽力逐字稿
- 聽力音檔：微軟神經語音（建置時預產 → 線上即時生成 → 瀏覽器語音，三層備援）
- 成績紀錄：Supabase 雲端同步（未設定時存瀏覽器）

## 架構

| 檔案 | 用途 |
|---|---|
| `index.html` | 測驗介面（單頁應用） |
| `config.js` | Supabase 連線設定 |
| `data/index.json` | 可用題庫日期清單 |
| `data/<日期>.json` | 每日題目（含答案與詳解） |
| `api/tts.js` | Vercel Serverless：即時產生聽力音檔 |
| `scripts/gen-audio.js` | 建置時預產音檔到 `audio/` |
| `supabase-setup.sql` | Supabase 資料表初始化 SQL |

## 部署

1. Supabase：新建專案 → SQL Editor 執行 `supabase-setup.sql` → 把 Project URL 與 anon key 填入 `config.js`
2. Vercel：連結此 repo 部署即可（`npm run build` 會自動預產音檔）

## 題庫更新

每週由排程自動產生新的 7 天題庫（新增 `data/<日期>.json` 並更新 `index.json`）後重新部署。
