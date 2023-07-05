+++
title = "hCaptcha"
date = "2021-01-05"
tags = [ "captcha", "hCaptcha", "node", "express", 'js' ]
categories = [ "nodejs" ]
+++

# hCaptcha

## 前情提要

我們社團的短網址服務裡面常常出現一些奇怪的網址，我猜可能是有機器人在刷，所以我想加入 captcha 減少這類問題。我選擇的是 [hCaptcha](https://hcaptcha.com/) 這套，能不依賴 Google 就盡量不要。

## 安裝步驟

## 申請帳號

先到 [hCaptcha](https://hcaptcha.com/) 註冊、新增一個網站，複製 sitekey (`Sites` > `site setting`) 和 secret key (`Settings`)，我們等等會用到

## 前端

1. 首先引入 script ，在 `<head>` 加入

```html
<script src="https://hcaptcha.com/1/api.js" async defer></script>
```

2. 接著在你的 `<form>` 裡面加入，這邊的 `your_site_key` 就是剛剛複製的那個。記得 `<form>` 的 method 要設成 `post`

```html
<div class="h-captcha" data-sitekey="your_site_key"></div>
```

## 後端（node express）

1. SECRET  
   首先，你要把剛剛的 `SECRET` 給 server 知道，我用的是 dotenv，當然其他的套件也是可以。  
   簡而言之，剛剛複製下來的 `SECRET` 就是用在這裡。

2. 驗證
   後端我選用的套件是 [express-hcaptcha](https://github.com/vastus/express-hcaptcha) ，它提供一個 middleware 驗證 hcaptcha 的 token。
   按照 README.md 的說明，應該是像這樣就可以了，當驗證通過時就會執行第二個 middleware

```js
const router = require('express').Router();
const captcha = require('express-hcaptcha');

const SECRET = process.env.HCAPTCHA_SECRET_KEY;

if (SECRET) {
	// 這個 route 就是本來接收/處理 form 傳遞資料進來來的 route，只是加一個 captcha.middleware.validate(SECRET)
	router.post('/', captcha.middleware.validate(SECRET), (req, res, next) => {
		res.json({
			message: 'verified!',
			hcaptcha: req.hcaptcha,
		});
	});
}
module.exports = router;
```

> 很不幸的，你會發現不管怎麼試，都驗證都不會通過，因為有一個 README.md 沒寫的 bug

3. 解 bug
   閱讀 [express-hcaptcha](https://github.com/vastus/express-hcaptcha) 的 source code，你會在 [這行](https://github.com/vastus/express-hcaptcha/blob/694265a005cbb15306c9d65623c6a365be79b8fc/index.js#L9) 發現它用的是 `req.body.token` ，但是 hCaptcha 的回傳是在 `req.body.h-captcha-token` 裡面 ......  
   有夠蠢的 bug  
   所以剛剛的程式碼就需要修改一下
   在驗證之前先把 `req.body.h-captcha-token` 的內容塞進 `req.body.token` 裡面

```js
const router = require('express').Router();
const captcha = require('express-hcaptcha');

const SECRET = process.env.HCAPTCHA_SECRET_KEY;

if (SECRET) {
	router.post(
		'/',
		(req, res, next) => {
			req.body.token = req.body['h-captcha-response'];
			next();
		},
		captcha.middleware.validate(SECRET),
		(req, res, next) => {
			res.json({
				message: 'verified!',
				hcaptcha: req.hcaptcha,
			});
		}
	);
}

module.exports = router;
```

## 結論

看原始碼很重要
