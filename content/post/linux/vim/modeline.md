---
title: Modeline
slug: modeline
date: '2022-04-07'
tags:
  - modeline
  - vim
  - config
  - file
  - editor
categories:
  - linux
  - vim
image: /og/linux/vim/modeline.png
---

# Modeline

`modeline` 是一個可以將 vim 設定嵌入檔案的方式，這樣就可以讓某些檔案有自己的設定，像是折疊、不要行數、tab 等於多少空白等等。

## 簡單的條件

簡單的 `modeline` 需要滿足幾個條件：

1. 開頭（不必是行首）至少有一個空白/tab
2. 用 `vim`、`vi` 等字開頭，這裡還可以設定哪個版本才要載入

## 基本的範例

```
 vim: wrap
```

## 參考資料

[https://stackoverflow.com/questions/3958416/embed-vim-settings-in-file](https://stackoverflow.com/questions/3958416/embed-vim-settings-in-file)  
help page in `:help modeline`
