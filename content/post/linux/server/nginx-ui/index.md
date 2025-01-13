---
title: Nginx UI
slug: nginx-ui
date: '2020-06-23T00:00:00.000Z'
tags:
  - nginx linux
categories:
  - linux
  - server
image: /og/linux/server/nginx-ui.png
---

# Nginx UI

前幾天發現一個專案 nginx ui
他是一個可以讓你在網頁上更改 nginx config 的專案

## 安裝

```
docker pull schenkd/nginx-ui
```

## 啟動

```
docker run -p 8080:8080 -v /etc/nginx:/etc/nginx schenkd/nginx-ui
```

然後打開瀏覽器 http://localhost:8080 就可以看到管理頁面了
很陽春，就是不用 ssh 進 server，沒什麼特點
我應該是不會用這套
