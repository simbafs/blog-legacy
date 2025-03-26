---
title: Mxlinux Boot with Systemd
slug: mxlinux-boot-with-systemd
date: '2020-09-05T00:00:00.000Z'
tags:
  - mxlinux
  - systemd
categories:
  - linux
  - mxlinux-boot-with-systemd
---

# Mxlinux Boot with Systemd

## 問題

在 mxlinux 裡面，預設的 init 不是 systmed，這導致如果想用 systemctl 的時候就會跳出錯誤說

```
System has not been booted with systemd as init system
```

像是在安裝 `mongodb-org` 的時候他就要用到 `systemctl` 然後就會出錯。

## 解法

其實 mxlinux 已經幫我們想好解法了，在開機選項時選 `Advence` > `Systemd` 就會以 systemd 開機
