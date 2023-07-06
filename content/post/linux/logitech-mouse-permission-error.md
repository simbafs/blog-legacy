---
categories:
- linux
date: "2021-03-15"
tags:
- ubuntu
- logitech
title: Logitech Mouse Permission Error
---

# Logitech Mouse Permission Error

## 前言

我的無線華和滑鼠和鍵盤都是羅技的，在我的 Ubuntu 筆電上一直都沒有問題。有一次我想改我的鍵盤被配置，但是因為 logitech unifying 沒有 Linux 版，所以我另一個軟體叫 solaar，功能是差不多的。
當我裝好軟體以後，鍵盤滑鼠操作都沒問題，只有插上滑鼠的接收器以後都對跳出一個 permission error 的錯誤視窗。雖然在 solaar 裡面就無法看到我的滑鼠就是了，但是完全不影響使用，所以我就擺在那邊放它爛，反正就是多按一個叉叉。

## 嘗試自己解

今天閒閒沒事做剛好來看看這個怎麼解。我一開始想說，把他的 permission 改成和鍵盤一樣就啦！於是我進行了下面的操作

```bash
$ ls /dev/hidraw*
```

拔下鍵盤的接收器，發現他是 `/dev/hidraw4` 和 `/dev/hidraw5`，再插上去。拔下滑鼠接收器，發現他是 `/dev/hidraw2`。  
並找到鍵盤的權限是 `rw-rw----`，滑鼠是 `rw-------`。

```bash
$ chmod 660 /dev/hidraw2
```

拔下滑鼠接收器，插上。  
沒用。

我猜這個方法會失敗應該是因為他在我改之前就已經先跳錯誤了，等我改完它右沒有偵測，我就得把它拔下來在插上去，我又會看到錯誤訊息...... (looping  
於是我上網找答案

## 網路上的解

我 Google `ubuntu logitech permission error` 第一個就是我要的！
