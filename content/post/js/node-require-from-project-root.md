---
title: Node Require from Project Root
slug: node-require-from-project-root
date: '2020-09-02'
tags:
  - nodejs
categories:
  - js
image: /og/js/node-require-from-project-root.png
---

# Node Require from Project Root

## 問題

在寫一個專案的時候，有時候會有一些小程式重複在不同的檔案裡用到，這時候我們會把他打包成模組放在 `lib/`。但是如果資料夾結構有點點複雜的時候， `require()` 的路徑就會很複雜：

```
.
├── index.js
├── lib
│   └── random.js
└── routes
    └── page
        └── signup
            └── index.js
```

在 `index.js` 裡面如果要引入 `random.js` 就會變成這樣

```js
const random = require('../../lib/random.js');
```

## 爛解法

如果我們想要直接用 `require('lib/random')` 的話做簡單的方式是上傳 npm，但是這樣稍嫌麻煩，而且別的專案不一定用的到。每一次修改都要上傳 npm 很不方便。

## 好解法

在 linux 裡面要把執行檔做成指令有兩個方法

1. 放到 `/usr/bin` 之類的地方
2. 把這個路徑直接加到 `PATH` 裡面

在 node 裡面也有 path 設定，`module.paths`，在 require 時會去這個裡面的目路尋找檔案。所以如果要達成上述的功能的話就只要加這行就可以了

```js
module.paths.push(process.cwd());
```

這樣就可以直接用 `require('lib/random')` 引入了

## 參考資料

https://github.com/nodejs/node/issues/4223  
https://github.com/nodejs/node/issues/1979  
https://www.npmjs.com/package/rooty  
^^^  
這個是在 github issue 裡面看到的，沒試過，但是應該也可以用吧？只是我覺得沒有 `paths` 的解法來的優雅。
