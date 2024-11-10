---
title: Blessed 切換畫面
slug: blessed切換畫面
date: '2020-02-20T00:00:00.000Z'
tags:
  - blessed
  - js
  - cli
categories:
  - js
  - blessed
image: /og/js/blessed/blessed切換畫面.png
---

# Blessed 切換畫面

今天完成了新版本的 `treetify` [看這](/2020/02/18/blessed-contrib-tree/)
同時我設計好了右邊的 `edit`
但是我的問題是他要根據情況不同切換不同的頁面
來看看我的一些想法：

1. 從 `screen.children[2]` 把他會掉，可是會出錯不行
2. 有一個元件 `Carousel` 好像可以但是他其實是用方向鍵控制所以也不行
3. 終於我想了一個方法，接下來來介紹
   這是測試程式碼

```js
const blessed = require('blessed');
const contrib = require('blessed-contrib');

const screen = blessed.screen({
	title: 'JSON viewer',
	debug: true,
});
const grid = new contrib.grid({
	rows: 1,
	cols: 2,
	screen: screen,
});

const tree = grid.set(0, 0, 1, 1, blessed.box, {
	border: { type: 'line' },
	content: 'Tree',
	label: 'Tree',
});

const edit = grid.set(0, 1, 1, 1, blessed.box, {
	border: { type: 'line' },
	content: 'Edit',
	label: 'Edit',
});

const box2 = blessed.box({
	border: { type: 'line' },
	content: 'Box2',
	label: 'Box2',
});
const box3 = blessed.box({
	border: { type: 'line' },
	content: 'Box3',
	label: 'Box3',
});
const box4 = blessed.box({
	border: { type: 'line' },
	content: 'Box4',
	label: 'Box4',
});
const box5 = blessed.box({
	border: { type: 'line' },
	content: 'Box5',
	label: 'Box5',
});

edit.append(box2);
edit.append(box3);
edit.append(box4);
edit.append(box5);
edit.append(box2);
edit.append(box3);
console.log(Object.keys(edit.children));

screen.key(['escape', 'q', 'C-c'], () => {
	process.exit(0);
});

tree.focus();

screen.key(['tab', 't'], function (ch, key) {
	if (screen.focused == tree.rows) edit.focus();
	else tree.focus();
});

screen.render();
```

這裡建立三個 `box` 要顯示哪一個的時候就將他 append
實驗證實這樣不會建立新的圖層
而是把下面的那個搬到最上面
完美的解決了這個問題
