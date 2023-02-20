+++
title = "Strapi Quick Start"
tags = [
  "node",
  "nodejs",
  "headless api",
  "api",
  "strapi",
  "database",
  "selfhost"
]
categories = [ "nodejs" ]
date = "2021-02-28"
+++


strapi 是一個 headless CMS (content management system)，透過 web 介面就可以建立一個 api server

## strapi
## 什麼是 headless CMS
headless CMS 顧名思義是「無頭的 內容管理系統」，意思是沒有前端、只有後端，它就是一個 DB 的 web 界面 + api server。headless CMS 專注於處理 api 的部份，前端的部份一律不關心。這對於前後端分離有很大的幫助，基本上 headless CMS 已經解決了後端 80% 的工作，剩下的就是一些客製化的邏輯，像是登入、特殊的計算等等。

## strapi 的優點
1. 他的界面完善
2. 支援多種 DB  
> MySQL >= 5.6  
> MariaDB >= 10.1  
> PostgreSQL >= 10  
> SQLite >= 3  
> MongoDB >= 3.6  
3. 存取權限控制
4. 外掛

## quickstart
以下步驟是補充 [官網的 quick start](https://strapi.io/documentation/developer-docs/latest/getting-started/quick-start.html)
1. 安裝  
`$ npx create-strapi-app my-project --quickstart; cd my-project`  
這是候應該會爆出一個關於 `knex` 的 dependency 的錯誤，先暫時跳過不理它  
2. 解決 dependency 的錯誤  
把 `package.json` 裡面 `dependencies` 裡面 `knex` 的版本中 `<` 拿掉，然後下 `npm update` 再 `npm start` 就可以了
3. build  
這時候如果你按照官網的教學 `npm start` 一定會出錯，你要先 `npm run build` 然後它才不會一直說找不到檔案
4. 建立第一個 user  
接著它應該會自動幫你開啟一個頁面，如果沒有的話可以按[這個連結](http://localhost:1337/admin)。再來我們要建立使用者，他的密碼要求特別機掰，一定要英數大小寫混合才給過，太短也不行。
5. 建立 `collection type`  
如果你按照官網的說法，這裡又會讓你很困惑，`+ Create new collection type` 按鈕到底它ㄇ的在哪？其實只要在開啟伺服器時用 develop mode 開就可以了，這個重要要的東西它又沒寫了，把你的 server 關掉，下 `npm run develop` 然後再去剛剛的頁面，重新整理就可以看到那個調皮的按鈕了。

再來的內容基本上沒有太多錯誤，希望官方趕快更新文件吧，這個真的害人不淺阿。
