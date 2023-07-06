---
title: Reactjs Update State on Props Change
slug: React-update-state-on-props-change
date: '2020-07-12'
tags:
  - reactjs
  - state
  - js
  - frontend
categories:
  - js
  - reactjs
---

# React Update State on Props Change

## 問題

今天在研究 React
遇到一個問題
當我從外面更新 props 的時候 component 內的 state 不會更新

```jsx
function Input(props){
	const [text, setText] = React.useState(props.text);

	return (
		<input type="text" value={text}>
	)
}
```

如同上面程式，第二行的 `useState` 不會隨著 props 更新而更新

## 解法

後來找到解法，加上一個 `useEffect` 監聽 `props.text` 然後更新 state 就好了

```jsx
function Input(props){
	const [text, setText] = React.useState(props.text);
	React.useEffect(() => {
		setText(props.text);
	}, [props.text]);
	return (
		<input type="text" value={text}>
	)
}
```

如此一來 `state` 就會和 `props` 同步了

## 參考資料

https://stackoverflow.com/questions/54865764/react-usestate-does-not-reload-state-from-props
https://zh-hant.reactjs.org/docs/hooks-effect.html
