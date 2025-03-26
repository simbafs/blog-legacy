---
title: Ts to Jsdoc
slug: ts-to-jsdoc
date: '2023-09-02T00:00:00.000Z'
tags: []
categories:
  - js
  - ts-to-jsdoc
---

# Ts to Jsdoc

## Generics

https://medium.com/@antonkrinitsyn/jsdoc-generic-types-typescript-db213cf48640

```ts
type List<T> = []T
```

```js
/**
 * @template T
 * @typedef {[]T} List
 */
```

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
