+++
title = "Bluetooth 突然卡住都不動"
slug = "bluwtooth-error"
date = 2022-03-02T23:31:59+08:00
tag = ["bluetooth", 'ubuntu-20.04', 'linux']
categories = ['linux']
+++

# Bluetooth 突然卡住都不動
裝了 Ubuntu 20.04 之後不知道為什麼藍芽用一用就會卡住，所有設備都連不上，也關不掉。一開始的解決方式是重開機（這時候關機會跳一個奇怪的錯誤訊息），但是覺得太沒效率了，上網查了一下。

## 原因
根據 [這個網頁](https://bugs.launchpad.net/ubuntu/+source/linux/+bug/1859592)，這個似乎是 linux 核心的藍芽驅動有問題（我沒有認真看，但好像是升級到最新的 linux kernel 就可以解決了）。  
雖然升級 linux  kernel 應該可以一勞永逸解決這個問題，但是這個 bug 其實不常出現，為了他編譯核心有點大題小做，所以我們需要一個簡單的方法解決。  

## 輕便解法
根據 [這篇問答](https://askubuntu.com/questions/1231074/ubuntu-20-04-bluetooth-not-working)，經過我的測試，第一個答案就可以解決了，當藍芽又掛掉時，執行  

```bash
sudo rmmod btusb
sudo modprobe btusb
```

這樣藍芽就回來了。這兩個指令簡單來說就是重新載入藍芽模組，這就是為什麼重開機可以解決（重開機就是重新載入所有模組）  
