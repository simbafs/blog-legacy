---
title: beginning of kotlin
slug: beginning-of-kotlin
date: '2021-05-04'
tags:
  - kotlin
categories:
  - kotlin
---

# val vs var

| kotlin | JS    |
| :----- | :---- |
| val    | const |
| var    | let   |

# a..b

| kotlin | JS                                   |
| :----- | :----------------------------------- |
| a..b   | Array(b-a+1).fill(0).map(i => i + a) |

# when

## kotlin

```kotlin
fun main (){
	val luckyNum = 4
	val yourNum = (1..6).random()
	val result = when(yourNum){
		luckyNum -> "You get the lucky num ${luckyNum}"
		1 -> "Sorry, you get 1"
		2 -> "Sorry, you get 2"
		3 -> "Sorry, you get 3"
		4 -> "Sorry, you get 4"
		5 -> "Sorry, you get 5"
		6 -> "Sorry, you get 6"
		else -> "Sorry, you get a number out of 1..6"
	}
	println(result)
}
```
