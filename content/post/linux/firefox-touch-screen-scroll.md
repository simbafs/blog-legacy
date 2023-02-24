+++
title = "Firefox Touch Screen Scroll"
date = "2021-05-08"
tags = [ "firefox", "ubuntu", 'gnome', 'desktop' ]
categories = [ "linux" ]
+++

# Firefox Touch Screen Scroll

再換了觸控筆電後，在 firefox 一直有個問題：觸控往下滑會被當成選取，要卷動一定要用右邊的 scroll bar

## 解決方案

按照 [https://askubuntu.com/questions/853910/ubuntu-16-and-touchscreen-scrolling-in-firefox](https://askubuntu.com/questions/853910/ubuntu-16-and-touchscreen-scrolling-in-firefox) 的最佳解法，真的加上 `MOZ_USE_XINPUT2=1` 的環境變數就可以了。  
另外在設定 `~/.local/share/applications/firefox.desktop` 的時候要注意有不只一個 Exec，改完如果沒有生效可以重開機看看。
