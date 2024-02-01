# WEMO Homework

面試作業 - Scooter Rent System

---

## 目錄

- 系統架構
- 租借流程
- 環境參數
- 開發環境
- 部署方式

## 系統架構

架構圖詳見：`docs/architecture.puml`

模組/服務說明：

- ScootersModule: Scooter table的ORM模組，僅負責CRUD，幾乎沒有商業邏輯
- UsersModule: User table的ORM模組，僅負責CRUD，幾乎沒有商業邏輯
- RentsModule: 負責整個租車流程的模組，功能包括租借狀況的狀態控制、Rent table的CRUD
- RedisModule: 簡易包裝的Redis Dynamic Module，用以提供可操作的redis client

## 租借流程

純CRUD的部份省略不計，此章節會著重說明租借功能的具體流程。

時序圖詳見：`docs/rent-scooter-seq.puml`, `docs/return-scooter-seq.puml`

功能流程解說：

- 租借(rent): 租借時會利用redis single thread的特性，對其嘗試寫入租借資料，再透過回傳的狀態決定此次租借是否成功。成功時會將租借資料留存在redis裡面並落地到database，失敗時則會刪除所有租借資料。
- 歸還(return): 歸還時會先將歸還時間記錄到postgres中，再將redis裡的租借鎖定資料刪除。

## 環境參數

| env               | value      |
| ----------------- | ---------- |
| POSTGRES_HOST     | db ip      |
| POSTGRES_PORT     | db port    |
| POSTGRES_DATABASE | db name    |
| POSTGRES_USERNAME | user       |
| POSTGRES_PASSWORD | pwd        |
| REDIS_HOST        | redis ip   |
| REDIS_PORT        | redis port |

## 開發環境

### 建立方式

```bash
npm install
```

### 測試方式

```bash
npm test # all unit tests
npm test:e2e # end to end test
```

### 專案結構

```
.
└── WEMO-Homework/
    ├── migrations
    ├── docs
    ├── src/
    │   ├── entities
    │   ├── rents
    │   ├── scooters
    │   └── users
    ├── test
    ├── docker-compose.example.yaml
    └── .env.example
```

- migrations: 開發用的typeorm migration設定
- src: 所有source code，將個Module以同名folder分類
- test: 測試
- \*.example.\*: runtime所需的設定參考

### 部署方式

所有相依服務、環境變數細節都可以參考docker-compose.example.yaml設定

```bash
cp docekr-compose.example.yaml docekr-compose.yaml

vim docekr-compose.yaml # edit all the envs into yours

docker compose up -d # docker-compose v2

#------ migrations ------

cp .env.example .env
vim .env # update connect information of target DB

npm run migration:schema # sync db schema
npm run typeorm -- migration:run -d ./migrations/datasource.ts # dump default datas
```
