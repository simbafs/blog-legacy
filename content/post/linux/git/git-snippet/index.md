---
title: Git Snippet
slug: git-snippet
date: '2023-02-20T00:00:00.000Z'
tags:
  - git
categories:
  - linux
  - git
image: /og/linux/git/git-snippet.png
---

# Git Snippet

## move branch to another commit (not recommand)

```
 git branch --force <branch name> <commit id>
```

## list changed filename

```
 git diff --name-only HEAD
```

[ref: stackoverflow](https://stackoverflow.com/questions/1552340/how-to-list-only-the-names-of-files-that-changed-between-two-commits)
