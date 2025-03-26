---
title: kdeconnect
slug: kdeconnect
date: '2022-04-07T00:00:00.000Z'
tags:
  - linux
  - kde
  - kdeconnect
  - android
categories:
  - linux
  - kdeconnect
---

# kdeconnect

kdeconnect 顧名思義是 kde 出的一款 connect 軟體，功能非常多而且方便。電腦和手機都安裝好軟體後，只要在同一個網域就可以配對連接

## 功能介紹

1. 基本訊息 - 在電腦和手機上可以互相看到電池、網路等基本訊息
2. 通知 - 可以設定電腦顯示手機通知或手機顯示電腦通知，或是兩者都開啟，我通常只開前者
3. 媒體控制 - 無論是 VLC、YouTube、Nefflix 或任何網頁，都可以控制進度、音量、暫停，而且雙方都可以控制。這個是我最愛的功能之一
4. 命令控制 - kdeconnect 可以讓你在手機上執行電腦上預先設定好的指令，像是關機、鎖定等等，下面會推薦幾個我設定的命令
5. 傳檔案和資料夾共用 - kdeconnect 可以讓你連接電腦和手機上特定的資料夾，或是傳送單一檔案
6. 共用剪貼簿 - 如其名，這是一個非常實用的功能，但是有時候觸發條件怪怪的
7. 輸入 - 不論是滑鼠、鍵盤，兩邊都可以互相當對方的輸入裝置，這個功能非常好用
   還有像是讓手機大叫（找手機用）、簡報控制、傳簡訊、手機有電話的時候自動暫停音樂等等奇奇怪怪的功能

## 推薦命令

|       Description       | Command                                                                                                                                                 |
| :---------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 鎖定螢幕並暫停 VLC 播放 | `loginctl lock-session; dbus-send --type=method_call --dest=org.mpris.MediaPlayer2.vlc /org/mpris/MediaPlayer2 org.mpris.MediaPlayer2.Player.PlayPause` |
| 解除鎖定螢幕（免密碼）  | `loginctl unlock-session`                                                                                                                               |
