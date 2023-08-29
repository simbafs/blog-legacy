---
title: Unix Socket
slug: unix-socket
date: '2020-02-23'
tags:
  - unix socket
  - node
  - nginx
  - js
categories:
  - js
image: /og/js/unix-socket.png
---

# Unix Socket

今天心血來潮在看 unix socket
突然想到 node 可不可以把 服務監聽在一個 socket file
這樣在設定的時候就不用記哪個服務是幾 port

## node 部份

## 監聽在 unix socket

查完資料後發現其實只要把原本填 port 的地方改成 socket file 的路徑就好了
像這樣

```js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
	res.send('Hello World\n');
});

app.listen('/tmp/express.sock');
```

## 刪除 socket file

因為每次的 listen 都會新增一個 socket file
相當於佔用一個 port
如果不刪除的話就相當於 port 被佔用了
會噴錯
所以每次程式結束的時候要把這個 socket file 刪掉
然後在 `/tmp` 下的檔案會在開機後自動刪掉
所以如果部屬後發什麼問題重開機就對了！
修改完的 code 長這樣

```js
const fs = require('fs');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
	res.send('Hello World\n');
});
app.listen('/tmp/express.sock', console.log);
process.on('SIGINT', () => {
	fs.unlinkSync('/tmp/express.sock');
	process.exit(0);
});
```

## 測試

弄完了伺服器
要怎麼測試呢？
這時候可以用 `curl` 來測試

```
$ curl --unix-socket /tmp/express.sock http://localhost
Hello World
```

## nginx reverse proxy

現在我們把伺服器開好了
但是 unix socket 只能在本機瀏覽啊！
所以我們要透過 nginx 來幫忙做 reverse proxy
先新增一個 `/etc/nginx/sites-available/test.conf`

```
server{
  listen 80;
  server_name t.localhost;
  location / {
    proxy_pass http://unix:/tmp/express.sock:/;

  }
}
```

然後在 `/etc/hosts` 新增一條

```
127.0.0.1	t.localhost
```

最後就可以打開瀏覽器 http://t.localhost
應該會出現 502 Getway Error
為什麼呢？
因為 socket file 的權限設定
其他使用者 (nginx) 無法開啟
所以要

```
$ chmod 777 /tmp/express.sock
```

這樣就可以啦！
