---
title: 編譯時期產生縮圖
slug: og
date: '2023-08-30T00:00:00.000Z'
tags:
  - og
  - svg
  - png
categories:
  - js
image: /og/js/og.png
---

# OG

這裡的目的是要編譯時期靜態產生 OG image，也就是封面圖，為什麼不用 `@vercel/og` 在需要的時候在 edge runtime 上產生呢？我就喜歡弄成靜態的

## selenium

我想要程式化的產生圖片，根據提供的資訊替換標題、附標題、標籤等資訊，首先想到的就是 react 產出網頁截圖，當然不是人工截圖，是用 selenium 這樣的自動化工具，之前看過保哥一篇文章介紹這樣的操作，但是有個問題是我只是想產一張圖片還開一個瀏覽器是不是太癰腫了，無論是時間上或是記憶體開銷上。

## Satori

[satori](https://github.com/vercel/satori/) 是 `@vercel/og` 背後使用的函式庫，把 jsx 輸出成 svg，vercel 為什麼選擇 svg 當作輸出目標其實不難想像，畢竟 svg 和 html 其實都是標籤形式，比起直接輸出成 png，svg 看起來有機會多了，於是我開始從 satori 開始。首先是 GitHub 上的範例：

```js
// api.jsx
import satori from 'satori'

const svg = await satori(<div style={{ color: 'black' }}>hello, world</div>, {
	width: 600,
	height: 400,
	fonts: [
		{
			name: 'Roboto',
			// Use `fs` (Node.js only) or `fetch` to read the font as Buffer/ArrayBuffer and provide `data` here.
			data: robotoArrayBuffer,
			weight: 400,
			style: 'normal',
		},
	],
})
```

看起來使用很簡單，就是把 jsx 丟進去，設定長寬跟至少一個字體就行了，注意！問題來了，我沒有從頭搞過 jsx，直接拿 `$ nodejs api.jsx` 一定會噴錯誤，有沒有可能我丟 HTML 字串進去也行呢？並且根據我的需求 **直接執行 node og.js 就會產生圖片** 進行一些修改：

```jsx
const satori = require('satori')
const fs = require('fs')

const font = fs.readFileSync(
	'/home/simba/.local/share/fonts/jf-openhuninn-1.1.ttf'
)

satori
	.default(`<div style={{ color: 'black' }}>hello, world</div>`, {
		width: 600,
		height: 400,
		fonts: [
			{
				name: 'jf-openhuninn-1.1',
				// Use `fs` (Node.js only) or `fetch` to read the font as Buffer/ArrayBuffer and provide `data` here.
				data: font,
				weight: 400,
				style: 'normal',
			},
		],
	})
	.then(console.log)
```

執行後看似很順利的產生了 svg

```svg
<svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg"><text x="0" y="12.502665651180502" width="40.78125" height="16">&lt;</text><text x="40.78125" y="12.502665651180502" width="99.140625" height="16">div</text><text x="139.921875" y="12.502665651180502" width="21.09375" height="16"> </text><text x="0" y="28.5026656511805" width="155.390625" height="16">style</text><text x="155.390625" y="28.5026656511805" width="50.0625" height="16">=</text><text x="205.453125" y="28.5026656511805" width="24.1875" height="16">{</text><text x="229.640625" y="28.5026656511805" width="24.1875" height="16">{</text><text x="253.828125" y="28.5026656511805" width="21.09375" height="16"> </text><text x="274.921875" y="28.5026656511805" width="167.1328125" height="16">color</text><text x="442.0546875" y="28.5026656511805" width="18.28125" height="16">:</text><text x="460.3359375" y="28.5026656511805" width="21.09375" height="16"> </text><text x="0" y="44.5026656511805" width="15.609375" height="16">&#39;</text><text x="15.609375" y="44.5026656511805" width="177.1875" height="16">black</text><text x="192.796875" y="44.5026656511805" width="15.609375" height="16">&#39;</text><text x="208.40625" y="44.5026656511805" width="21.09375" height="16"> </text><text x="229.5" y="44.5026656511805" width="24.1875" height="16">}</text><text x="253.6875" y="44.5026656511805" width="24.1875" height="16">}</text><text x="277.875" y="44.5026656511805" width="40.78125" height="16">&gt;</text><text x="318.65625" y="44.5026656511805" width="160.3828125" height="16">hello</text><text x="479.0390625" y="44.5026656511805" width="18.28125" height="16">,</text><text x="497.3203125" y="44.5026656511805" width="21.09375" height="16"> </text><text x="0" y="60.5026656511805" width="187.2421875" height="16">world</text><text x="187.2421875" y="60.5026656511805" width="40.78125" height="16">&lt;</text><text x="228.0234375" y="60.5026656511805" width="31.1484375" height="16">/</text><text x="259.171875" y="60.5026656511805" width="99.140625" height="16">div</text><text x="358.3125" y="60.5026656511805" width="40.78125" height="16">&gt;</text></svg>
```

把他打開看看  
![1.png](/images/og/1.png)  
這是一張透明背景，有黑色字印著散落的程式碼的圖片，我不知道 satori 內部是怎麼想的，反正這樣鐵定不行，那我們還是只能丟 jsx 進去了

## satori-html

[satori-html](https://github.com/natemoo-re/satori-html) 是個函式庫專門用來填補 HTML 到 satori 之間間隔，他會吃 HTML 字串，然後吐一個 `react-elements-like object`，可以簡單的理解成 jsx 編譯後的輸出。來試試看：

```js
const { html } = require('satori-html')

console.log(html`<div style={{ color: 'black' }}>hello, world</div>`)
```

執行！哇，他會吐一個 `Error [ERR_REQUIRE_ESM]: require() of ES Module satori-html@0.3.2/node_modules/satori-html/dist/index.js from index.js not supported.` 這樣的錯誤，不過還好，後面有給方法（讚啦）：`Instead change the require of index.js in index.js to a dynamic import() which is available in all CommonJS modules.`。好的，修改後長這樣：

```js
;(async () => {
	const { html } = await import('satori-html')

	console.log(
		JSON.stringify(
			html`<div style={{ color: 'black' }}>hello, world</div>`,
			null,
			2
		)
	)
})()
```

輸出長這樣

```js
{
  "type": "div",
  "props": {
    "style": {
      "display": "flex",
      "flexDirection": "column",
      "width": "100%",
      "height": "100%"
    },
    "children": [
      {
        "type": "div",
        "props": {
          "color:": "",
          "style": {},
          "children": "hello, world"
        }
      }
    ]
  }
}
```

看起來可以塞進 satori 試試看了

## 合體！

把上面兩個湊起來長這樣

```js
const satori = require('satori')
const fs = require('fs')

const font = fs.readFileSync(
	'/home/simba/.local/share/fonts/jf-openhuninn-1.1.ttf'
)

async function getOg() {
	const { html } = await import('satori-html')

	const markup = html`<div style={{ color: 'black' }}>hello, world</div>`

	satori
		.default(markup, {
			width: 600,
			height: 400,
			fonts: [
				{
					name: 'jf-openhuninn-1.1',
					data: font,
					weight: 400,
					style: 'normal',
				},
			],
		})
		.then(console.log)
}

getOg()
```

吐出來的 svg 長這樣  
![2.svg](/images/og/2.svg)  
看起來合理多了，那麼接下來的問題就是輸出成 png 了

## svg to png

根據谷歌大神神諭，用 `@resvg/resvg-js` 可以把 svg 轉成 png，看範例：

```js
const { promises } = require('fs')
const { join } = require('path')
const { Resvg } = require('@resvg/resvg-js')

async function main() {
	const svg = await promises.readFile(join(__dirname, './text.svg'))
	const opts = {
		background: 'rgba(238, 235, 230, .9)',
		fitTo: {
			mode: 'width',
			value: 1200,
		},
		font: {
			fontFiles: ['./example/SourceHanSerifCN-Light-subset.ttf'], // Load custom fonts.
			loadSystemFonts: false, // It will be faster to disable loading system fonts.
			defaultFontFamily: 'Source Han Serif CN Light',
		},
	}
	const resvg = new Resvg(svg, opts)
	const pngData = resvg.render()
	const pngBuffer = pngData.asPng()

	console.info('Original SVG Size:', `${resvg.width} x ${resvg.height}`)
	console.info('Output PNG Size  :', `${pngData.width} x ${pngData.height}`)

	await promises.writeFile(join(__dirname, './text-out.png'), pngBuffer)
}

main()
```

看來是丟 svg 和 `opt` 進去就可以了，來驗證看看吧！：  

```js
const satori = require('satori')
const fs = require('fs')
const { Resvg } = require('@resvg/resvg-js')

const font = fs.readFileSync(
    '/home/simba/.local/share/fonts/jf-openhuninn-1.1.ttf'
)

async function getOg() {
    const { html } = await import('satori-html')

    const markup = html`<div style={{ color: 'black' }}>hello, world</div>`

    return satori
        .default(markup, {
            width: 600,
            height: 400,
            fonts: [
                {
                    name: 'jf-openhuninn-1.1',
                    data: font,
                    weight: 400,
                    style: 'normal',
                },
            ],
        })
        .then(svg => {
            const png = new Resvg(svg, {
                background: 'rgba(238, 235, 230, 0)',
                fitTo: {
                    mode: 'width',
                    value: 600,
                },
            }).render().asPng()
            return { svg, png }
        })
}

getOg().then(({ png }) => fs.writeFileSync('og.png', png))
```

輸出結果長這樣  

![3.png](/images/og/3.png)

嗯，很棒

## 打包
核心程式碼都有了，接著我們只需要寫好範本、加上一些細節，躂啦！就完成了
![](/images/og/drawAnOwl.jpg)
附上完成後的連結 [https://github.com/simbafs/og](https://github.com/simbafs/og)
