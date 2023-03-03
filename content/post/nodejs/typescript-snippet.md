+++
title = "TypeScript Snippet"
slug = ""
date = 2023-02-10T23:28:41+08:00
tags = ["ts", 'snippet', 'js']
categories = ['nodejs']
+++

# TypeScript Snippet

## keyof

```typescript
type SettingOptions = {
	fontSize: number;
	lineHeight: number;
	letterSpacing: number;
	color: `#${string}`;
	backgroundColor: `#${string}`;
};

type OptionKey = keyof SettingOptions; // 'fontSize' | 'lineHeight' | 'letterSpacing' ...
```

[docs: keyof](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)

## static method of class
```typescript
class A {
	declare propertyA: string
	declare propertyB: number

	static build(){
		let a = new A()
		a.propertyA = 'default'
		a.propertyB = '100'
		return a
	}
}
```
