---
title: Webpack Reactjs
slug: webpack-react
date: '2020-06-28'
tags:
  - webpack
  - reactjs
  - frontend
  - js
categories:
  - js
  - reactjs
image: /og/js/reactjs/webpack-react.png
---

# Webpack Reactjs

## 前言

最近開始想學 react
在這之前當然要先把開發環境搞好
其中 react 最重要的就是 webpack 和 babel 了
babel 負責編譯
webpack 負責串街所有工作

## 安裝套件

## 建立一個專案並初始化

```
mkdir react-test
cd react-test
npm init -y
git init -y
```

## 安裝開發用套件

```
npm i -D \
	@babel/core \
	@babel/cli \
	@babel/preset-env \
	@babel/preset-react \
	babel-loader \
	react \
	react-dom \
	webpack
```

## package.json

加入以下的 script

```json
{
	"dev": "webpack --mode development",
	"watch": "webpack --mode development --watch",
	"depoly": "webpack --mode production"
}
```

## webpack.config.js

建立 webpack.config.js
這是最小的版本了
沒有任何的擴充

```js
module.exports = {
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
		],
	},
};
```

## src/dist

```
mkdir src dist
接下來可以把所有的 js 原始碼放在 src/ 下
html template 放在 dist/ 下

## 範例
https://github.com/simbafs/react-template

```
