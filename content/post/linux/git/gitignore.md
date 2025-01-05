---
title: Gitignore
slug: gitignore
date: '2025-01-05T06:38:56.000Z'
tags:
  - gitignore
  - git
categories:
  - linux
  - git
image: /og/linux/git/gitignore.png
---

# Gitignore

`.gitignore` 可以使用 `!` 來標示要保留下來的檔案，例如

```gitignore
ent/*
!ent/generate.go
!ent/schema
```

的意思是 `ent/` 資料夾下全部都忽略，除了 `ent/generate.go` 和 `ent/schema`。
