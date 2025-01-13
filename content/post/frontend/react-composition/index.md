---
title: React 解決中文輸入法
slug: react-composition-event
date: '2022-02-05T00:00:00.000Z'
tags:
  - react
  - js
  - frontend
categories:
  - frontend
image: /og/frontend/react-composition.png
---

今天在開發[晶晶體產生器](https://github.com/simbafs/JingJing)的時候，發現中文輸入總是有問題，這時候我想起以前看過 Hackmd 官方的[一篇 blog](https://hackmd.io/@hackmd/CompositionEvent)，提到中文輸入法如果有問題，可能和組字事件有關。於是就開始研究。首先我將以下設定加入 `textarea` 裡觀察組字事件的行為

```jsx
onCompositionStart={(e) => console.log('compositionStart', e.data)}
onCompositionEnd={(e) => console.log('compositionEnd', e.data)}
onCompositionUpdate={(e) => console.log('compositionUpdate', e.data)}
```

當我打「今天我想要吃蛋餅」的時候，console 長這樣

```
compositionStart <empty string>
compositionUpdate ㄐ
compositionUpdate ㄐㄧ
compositionUpdate ㄐㄧㄣ
compositionUpdate 今
compositionUpdate 今ㄊ
compositionUpdate 今ㄊㄧ
compositionUpdate 今ㄊㄧㄢ
compositionUpdate 今天
compositionUpdate 今天ㄨ
compositionUpdate 今天ㄨㄛ
compositionUpdate 今天ㄒㄨㄛ
compositionUpdate 今天ㄒㄨ
compositionUpdate 今天ㄒ
compositionUpdate 今天
compositionUpdate 今天ㄨ
compositionUpdate 今天ㄨㄛ
compositionUpdate 今天我
compositionUpdate 今天我ㄒ
compositionUpdate 今天我ㄒㄧ
compositionUpdate 今天我ㄒㄧㄤ
compositionUpdate 今天我想
compositionUpdate 今天我想ㄧ
compositionUpdate 今天我想ㄧㄠ
compositionUpdate 今天我想要
compositionUpdate 今天我想要ㄔ
compositionUpdate 今天我想要吃
compositionUpdate 今天我想要吃ㄉ
compositionUpdate 今天我想要吃ㄉㄢ
compositionUpdate 今天我想要吃但
compositionUpdate 今天我想要吃但ㄅ
compositionUpdate 今天我想要吃但ㄅㄧ
compositionUpdate 今天我想要吃但ㄅㄧㄥ
compositionUpdate 今天我想要吃蛋餅
compositionUpdate <empty string>
compositionEnd <empty string>
```

根據實驗結果，我猜我們可以用 `onCompositionUpdate` 事件來修正，於是現在 `textarea` 變成這樣

```jsx
<textarea
	className={style.input}
	value={t}
	onChange={e => setInput(() => e.target.value)}
	onCompositionUpdate={e => setInput(() => e.data)}
	onContextMenu={handleContext}
/>
```

如此一來就解決中文輸入的問題了！但是目前這個版本只能解決「一次」的中文輸入，也就是說如果中斷的話，之前的將會被清空。這個問題可以修改 `onCompositionUpdate` 的處理函式解決（有待研究）

---

> Update: 2022/02/08

目前部份解決接續輸入的問題，但是只能從最後面繼續，不能從中間插入。目前的 `textarea` 長這樣

```jsx
const [previousInput, setPreviousInput] = useState('');

<textarea
	className={style.input}
	value={t}
	onChange={e => setInput(() => e.target.value)}
	onCompositionUpdate={e => setInput(() => previousInput + e.data)}
	onCompositionStart={() => setPreviousInput(() => input)}
	onContextMenu={handleContext}
/>;
```
