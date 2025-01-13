---
title: Blessed
slug: blessed
date: '2020-02-17T00:00:00.000Z'
tags:
  - blessed
  - js
  - cli
categories:
  - js
  - blessed
image: /og/js/blessed/blessed.png
---

# Blessed

某天我有一個問題
gtop 的圖畫界面是怎麼做的，我知道他是用 node 寫的，對他別有興趣
我上 github 看他的 package.json
發現他的 depandence 只有三個

```json
...
	"dependencies": {
		"blessed": "^0.1.81",
		"blessed-contrib": "^4.8.16",
		"systeminformation": "^4.14.4"
	},
...
```

其中 `systeminformation` 很顯然是取得系統資訊
那 GUI 的 library 應該就是 `blessed` 和 `blessed-contrib` 了
去 `blessed` 的 github 看看
沒想到這是一個超強大的函式庫
可是網路上的教學卻很少
只好自己看 docs 啦

接下來是我測試的一些程式碼和截圖
