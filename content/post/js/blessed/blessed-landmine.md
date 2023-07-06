---
categories:
- nodejs
- blessed
date: "2020-02-26"
tags:
- blessed
- js
- cli
title: Blessed Landmine
---

# Blessed Landmine

這是一篇我在用 blessed 時踩的一些雷

## 1. 記得 render

今天在寫 API 時踩到兩次
更新了資料卻沒有 render
例如 `textarea.setValue()` 這個函式設定完之後他畫面不會更新
要自己 render

## 2. `textarea.setValue()` 只接受字串當參數

我個人覺得 blessed 缺少一個像是 jquery 的函式庫
沒有一個很好的 API 包裝
例如說這個函式 `textarea.setValue()` 就只吃字串
因為他用了 String.prototype.replace 這個函數
而且他沒有一個很好的防呆機制例如參數型別檢查
幸好是他的程式碼沒有做 uglify
還算簡單易懂
而且 node 的錯誤訊息的 stack 可以引導到真正出錯的地方
