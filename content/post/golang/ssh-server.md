---
title: SSH Server
slug: ssh-server
date: '2022-08-03'
tags:
  - ssh
  - tunnel
categories:
  - golang
---

# 步驟

1. 聆聽某個 tcp port/socket `net.Listen()`
2. 用 `for{}` 接受每個進來的 tcp 連線 `listener.Accept()`
3. 建立 ssh 連線 `ssh.NewServerConn`，使 tcp 連線升級成 ssh 連線
4.
