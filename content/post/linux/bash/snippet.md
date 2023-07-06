---
categories:
- linux
- bash
date: "2023-02-25T15:40:41+08:00"
image: null
tags:
- bash
- snippet
- command
- cli
title: Bash Snippet
---

# Bash Snippet

## Clear broken symlinks

```
 $ find . -type l ! -exec test -e {} \; -exec sudo rm {}  \;
```

> [stackoverflow](https://unix.stackexchange.com/questions/34248/how-can-i-find-broken-symlinks)
