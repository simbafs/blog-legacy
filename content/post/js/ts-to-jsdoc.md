---
title: Ts to Jsdoc
slug: ts-to-jsdoc
date: 2023-09-02T12:49:39+08:00
tags:
categories:
draft: true
image:
---

# Ts to Jsdoc

## Generics

https://medium.com/@antonkrinitsyn/jsdoc-generic-types-typescript-db213cf48640

## reducer

```ts
const reducer = (state: number[], action: number) => [...state, action]
```

is equivalent to

```js
const reducer = (
	/** @type {number[]} */ state,
	/** @type {number} */ action
) => [...state, action]
```
