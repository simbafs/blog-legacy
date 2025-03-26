---
title: express 重複 send
slug: express-重複-send
date: '2020-08-19T00:00:00.000Z'
tags:
  - express
  - js
  - backend
categories:
  - js
  - express-重複-send
---

# express 重複 send

## 問題

在 express route 裡面，我通常會在 `res.send()` 之類的函式前面都會加一個 `return` 防止因為程式邏輯漏洞造成重複送出然後噴 error。像是這樣

```js
route.get('/', (req, res, next) => {
	return res.send('Hello world');
});
```

但是如果我們用到 `Promise` 的時候 `return` 並不會跳出整個 route，所以我們需要另一個方法，我的想法是一個變數儲存是否送出，然後在每次送出前都判斷，送出候更改變數值

```
+--------------------------+
| is sent( flag === false) |
+-+------------------------+
  |no
  |
+-+----+
| send |
+-+----+
  |
+-+-----------+
| change flag |
+-------------+
```

```js
route.get('/', (req, res, next) => {
	let flag = false;
	doSomePromise().then(() => {
		// do something
		if (!flag) {
			res.send('Hello world');
			flag = true;
		}
	});
});
```

這樣就不會噴一堆 error 啦！

## 改進版

用了之後發現這樣有點麻煩，express 應該有內建變數儲存是否已送出才對，如果沒有，我應該也有更好的方法可以直接從 `req` 或 `res` 的狀態判斷是否已送出。找了一下，真的被我找到了 [res.headersSent](https://expressjs.com/en/4x/api.html#res.headersSent) 這個內建變數，他的行為就和上面的 `flag` 一模一樣，但是我們不用自己去維護他的狀態。所以上面的範例就可以改寫成這樣

```js
route.get('/', (req, res, next) => {
	doSomePromise().then(() => {
		// do something
		res.headersSent || res.send('Hello world');
	});
});
```
