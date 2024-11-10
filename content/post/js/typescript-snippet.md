---
title: TypeScript Snippet
slug: typescript-snippet
date: '2023-02-10T00:00:00.000Z'
tags:
  - ts
  - snippet
  - js
categories:
  - js
image: /og/js/typescript-snippet.png
---

# TypeScript Snippet

## keyof

```typescript
type SettingOptions = {
	fontSize: number
	lineHeight: number
	letterSpacing: number
	color: `#${string}`
	backgroundColor: `#${string}`
}

type OptionKey = keyof SettingOptions // 'fontSize' | 'lineHeight' | 'letterSpacing' ...
```

[docs: keyof](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)

## static method of class

```typescript
class A {
	declare propertyA: string
	declare propertyB: number

	static build() {
		let a = new A()
		a.propertyA = 'default'
		a.propertyB = '100'
		return a
	}
}
```

## valueof

```typescript
const key = {
	a: 'KEY_A',
	b: 'KEY_B',
} as const
type ValueOf<T> = T[keyof T]
type Key = ValueOf<typeof key>
// type Key = 'KEY_A' | 'KEY_B'
```
