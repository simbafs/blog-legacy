---
title: Libreoffice Code Format Plugin Installation
slug: libreoffice-code-format-plugin-install
date: '2021-03-13T00:00:00.000Z'
tags:
  - libreoffice
  - code format
categories:
  - linux
  - libreoffice-code-format-plugin-install
---

# 安裝

1. 去 [https://extensions.libreoffice.org/en/extensions/show/code-highlighter](https://extensions.libreoffice.org/en/extensions/show/code-highlighter) 下載最新的外掛
2. 把檔名前面的前綴刪掉，
    > 例如：`ea4db15f_codehighlighter.oxt` -> `codehighlighter.oxt`
3. 安裝相依性套件

```bash
sudo apt install libreoffice-script-provider-python python3-pip
sudo pip3 install pygments
```

4. 安裝外掛
    > 工具 > 擴充套件管理員 > 加入 > 選擇你的檔案

# 使用

1. 插入文字方塊
    > 插入 > 文字方塊
2. 貼上程式碼
3. 選擇文字方塊，不是文字（按文字方塊的邊邊）
4. format
    > 工具 > highlight code > 選得語言、style

# 參考資料

[Libreoffice extensions](https://extensions.libreoffice.org/en/extensions/show/code-highlighter)
[issue](https://github.com/slgobinath/libreoffice-code-highlighter/issues/29#issuecomment-635216707)
