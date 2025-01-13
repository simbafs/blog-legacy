---
title: Bash Snippet
slug: snippet
date: '2023-02-25T00:00:00.000Z'
tags:
  - bash
  - snippet
  - command
  - cli
categories:
  - linux
  - bash
image: /og/linux/bash/snippet.png
---

# Bash Snippet

## Clear broken symlinks

```
 $ find . -type l ! -exec test -e {} \; -exec sudo rm {}  \;
```

> [stackoverflow](https://unix.stackexchange.com/questions/34248/how-can-i-find-broken-symlinks)

## Random String

```
$ cat /dev/random | head | md5sum | head -c 32
```
