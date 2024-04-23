---
title: KDE Touchpad Gesture
slug: kde-touchpad-gesture
date: '2024-04-23'
tags:
  - kde
  - gesture
  - touchpad
  - linux
  - laptop
categories:
  - linux
image: /og/linux/kde-touchpad-gesture.png
---

# KDE Touchpad Gesture
目前我的筆電作業系統是 KDE neon，他一直有個地方讓我覺得很不方便，就是沒有觸控版手勢操作，這個 [repo](https://github.com/NayamAmarshe/ToucheggKDE) 就是透過 touchegg 補齊了這方面的缺陷，他安裝超級簡單只有兩個步驟

## 1. 安裝 touchegg
```
$ apt install touchegg
```

## 2. 把設定檔放進去
```
$ mkdir -p  ~/.config/touchegg
$ cd ~/.config/touchegg/
$ wget https://raw.githubusercontent.com/NayamAmarshe/ToucheggKDE/main/touchegg.conf
```

## 3. 重開機
我猜重新登入圖形界面應該就有效了，不果反正重開機也沒多慢，就重開機，開機完就可以用手勢切換工作區囉。
