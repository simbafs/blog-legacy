---
categories:
- nodejs
- nextjs
date: "2022-08-04T22:16:42+08:00"
slug: fs
tags:
- fs
- filesystem
- js
- nextjs
title: File System
---

# File System

## getStaticProps

不知道為什麼，`getStaticProps` 裡面的 `fs` 時有時無。[這裡](https://github.com/vercel/next.js/discussions/12124) 似乎有關於這個問題的回答，但無效

## 正常一

這個版本，就可以正常運作，證明 `getStaticProps` 裡可以用 `fs`

```javascript
// pages/index.js
import fs from 'fs/promises';

export async function getStaticProps() {
	console.log(await fs.stat('./content/index.md'));
	const posts = ['index.md'];
	console.log({ posts });
	return {
		props: { posts },
	};
}
```

## 正常二

在這個版本，將 `fs` 相關程式碼移到 `util/fsTest.js`，也就是測試如果是引用另一個模組中 `fs` 相關的函數。經過證明，也是可以的

```javascript
// util/fsTest.js
import fs from 'fs/promises';

export default async function dirs() {
	return await fs.readdir(`${process.cwd()}/content`);
}
```

```javascript
// pages/index.js
import fsTest from '../util/fsTest';

export async function getStaticProps() {
	const posts = ['index.md'];
	console.log({ posts, fsTest: await fsTest() });
	return { props: { posts } };
}
```

## 有問題的

這個版本，`util/tree.js` 的程式碼是經過測試，是沒問題的。但是卻會回報錯誤，找不到 `fs`

```javascript
// util/tree.js
import fs from 'fs/promises';

async function tree(root, opt) {
	// some verified code
}

function tree2list(tree, opt) {
	// some verified code
}

export { tree, tree2list };
```

```javascript
// pages/index.js
import { tree, tree2list } from '../util/tree';

export async function getStaticProps() {
	const tree = await tree('./content', { extensions: ['.md'] });
	const posts = tree2list(tree, { sliceHead: 1 });
	return {
		props: { posts },
	};
}
```
