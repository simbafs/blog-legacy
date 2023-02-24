+++
title = "SSH Server"
slug = ""
date = 2022-08-03T14:15:31+08:00
draft = true
tags = ['ssh', 'tunnel']
categories = ['go']
+++

# 步驟

1. 聆聽某個 tcp port/socket `net.Listen()`
2. 用 `for{}` 接受每個進來的 tcp 連線 `listener.Accept()`
3. 建立 ssh 連線 `ssh.NewServerConn`，使 tcp 連線升級成 ssh 連線
4.
