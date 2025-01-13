---
title: Linux 安裝跑跑卡丁車（nexon launcher）
slug: nexon
date: '2023-02-16T00:00:00.000Z'
tags:
  - nexon
  - steam
  - wine
  - proton
categories:
  - game
image: /og/game/nexon.png
---

# 如何在 Linux 安裝跑跑卡丁車

1. 去官網下載 Nexon 啟動器設定 exe
2. 去 Steam 左下角新增遊戲 > 非 steam 遊戲，找到你的 exe，可能要注意一下 filetype
3. 在 steam 遊戲頁面右上角齒輪 > 內容 > 相容性 > 打勾勾 > Proton
4. 啟動遊戲！按照步驟裝完啟動器、關掉他
5. steam 遊戲頁面右上角齒輪 > 內容 > 捷徑 > 開始位置 > 瀏覽，改成 `~/.local/share/Steam/steamapps/compatdata/${steam game id}/pfx/drive_c/Program Files (x86)/Nexon/Nexon Launcher/nexon_launcher.exe `
   好了
