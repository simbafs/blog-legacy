---
categories:
- linux
date: "2021-06-14"
tags:
- android
- linux
- adb
- wireless
- usb debug
title: Cast Phone Screen to Computer
---

# Cast Phone Screen to Computer

有沒有一種經驗是某的應用程式手機板操作勉強算順暢，但是一電腦上就炸開，反應慢到靠北、界面又很難用（沒錯 messenger 我正在看著你）。這個時候相信你會和我一樣想把手機畫面投影到電腦上的一個視窗裡面，最好可以互動、可以打字。有人第一個想法是在手機開 VNC 伺服器，但是這個方法有點麻煩，這篇文章介紹的是目前我覺得最佳解決方案。

## SCRCPY

這個軟體支援有線（ USB debug ）、無線（ WIFI ）的連接，還支援螢幕錄影和傳檔案。最重要的是，開在電腦上的視窗可以調整大小，不需要侷限在一個小小的視窗內，你最大可以放大到全螢幕！在某種意義上你獲得了一台和電腦一樣大的手機。

## Installation

安裝流程意外的簡單，只需要用 `apt` 就可以安裝了，或是你可以自己 build，稍微看了一下 [說明](https://github.com/Genymobile/scrcpy/blob/master/BUILD.md) ，看起來不困難，但是既然 `apt` 就可以安裝了我們就省一點時間

```
$ sudo apt install scrcpy
```

## USB debug

首先無論是有線無線都要先打開手機的 `USB debug` 選項，在開發人員選項裡面，詳細步驟請看 [官方文件](https://developer.android.com/studio/debug/dev-options#enable)。

## USB

如果不介意有一條線插著~~（順便充電）~~的話，投影畫面非常簡單，只有兩個步驟：

1. 插上 USB 並且無論跳出什麼都按「同意」「OK」
2. 打開終端機，執行 `scrcpy`
   然後就會有一個視窗跳出來，你現在就可以在電腦上滑手機了！

## Wireless

無線的話比較麻煩，首先是必須要可以連線，看是在同一個區域網路或是 VPN、ssh tunnel 都可以。再來是因為連線設定頗麻煩，所以我把相關的步驟寫成一個 [script](https://gist.github.com/simbafs/9132289f63368ad325d6a2ef62be7a20)，下載後給予執行權限就可以執行了（當然要安裝 scrcpy ）。有線的方式一樣很簡單，不用加任何選項就可以連接了。  
如果要啟用無線，只需要加上 `-w` 選項（用預設的 ip `192.168.43.1`)  
如果 ip 不是預設的話，可以加上 `-i IP` 來指定其他的 ip  
加上 `-f` 可以開啟全螢幕

## 參連連結

[https://github.com/Genymobile/scrcpy](https://github.com/Genymobile/scrcpy)
[https://developer.android.com/studio/debug/dev-options](https://developer.android.com/studio/debug/dev-options)
[https://gist.github.com/simbafs/9132289f63368ad325d6a2ef62be7a20](https://gist.github.com/simbafs/9132289f63368ad325d6a2ef62be7a20)
