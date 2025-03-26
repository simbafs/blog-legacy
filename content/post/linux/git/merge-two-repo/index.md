---
title: Merge Two Repo
slug: merge-two-repo
date: '2022-10-18T00:00:00.000Z'
tags:
  - git
  - merge
categories:
  - linux
  - git
  - merge-two-repo
---

# Merge Two Repo

這學期修了幾個資工系的課，都需要寫程式作業，原本我是一個作業開一個 repo，但是我發現這樣好像會開超級多 repo，於是我決定要想辦法合併他們。

## 找資料

首先去 Google 搜尋「git merge two repo」，第一條結果是是一個 13 年前的 stack overflow https://stackoverflow.com/questions/1425892/how-do-you-merge-two-git-repositories，裡面第一個回答提到的方法是把待合併 repo A 指到目標 repo B 的 branch A，然後就把 branch A 當作一般分支合併，但是要加上 `--allow-unrelated-histories` 選項

## filter-repo

現在有個問題，原本的目錄結構是長這樣

```
.
├── HW1
│   ├── .git
│   ├── go.mod
│   └── main.go
├── HW2
│   ├── .git
│   ├── go.mod
│   └── main.go
└── HW3
    ├── .git
    ├── go.mod
    └── main.go
```

如果直接合併會變成這樣

```
.
├── .git
├── go.mod
└── main.go
```

因為檔名一樣，就被合併了，但是我想要的是這樣

```
.
├── .git
├── HW1
│   ├── go.mod
│   └── main.go
├── HW2
│   ├── go.mod
│   └── main.go
└── HW3
    ├── go.mod
    └── main.go
```

當然可以把檔案移好再合併，但是這樣提交紀錄（commit history）上不好看，所以我們需要其他工具

## git filter-repo

[git-filter-repo] 是個可以批次處理提交紀錄的工具，例如我們這次要的，將全部檔案移到子目錄裡面，從第一個 commit 開始。看網路教 git 似乎內建 `filter-branch` 命令，但 filter-repo 的效能和功能都比較多。

### 安裝

`apt install git-filter-repo`

https://github.com/newren/git-filter-repo/blob/main/INSTALL.md

### 使用

`git filter-repo`

### 移動檔案到子目錄

```
$ git filter-repo --to-subdirectory-filter hw1 --force
Parsed 11 commits
New history written in 0.03 seconds; now repacking/cleaning...
Repacking your repo and cleaning out old unneeded objects
HEAD is now at 57fd6a0 update example
Enumerating objects: 52, done.
Counting objects: 100% (52/52), done.
Delta compression using up to 8 threads
Compressing objects: 100% (21/21), done.
Writing objects: 100% (52/52), done.
Total 52 (delta 17), reused 30 (delta 17), pack-reused 0
Completely finished after 0.08 seconds.
```

## 合併 Repo

```
$ cd A
$ git remote add -f a ../a
$ git merge --allow-unrelated-histories a/main
$ git remote remove a
```

合併完的提交紀錄長這樣（還沒移除 remote ）

```
*   097b986 (HEAD -> main) Merge remote-tracking branch 'hw4/multithread'
|\
| * 2d0bc2d (hw4/multithread) finish
| * 462ec18 try to use goroutine
| *   89915f1 Merge branch 'main' into multithread
| |\
| * | b4e5879 README.md
| * | 96b5d3a try to use goroutine to speed up, but failed
* | |   ebb41bb Merge remote-tracking branch 'hw4/main'
|\ \ \
| | |/
| |/|
| * | faabcb5 (hw4/main) finish
| * | f715b3c index++
| * | 1c16b06 README.md
| |/
| * a0594d2 finish first version
| * 475fa62 finish dec/enc functions
| * 69cfeb3 Initial commit
*   9f10a17 Merge remote-tracking branch 'hw2/main'
|\
| * f6d6ffe (hw2/main) out.pdf
| * a07ee96 README.md
| * c22c4aa finish version 1
| * acebb48 basic concept
| * 9b3c351 init
| * d949263 Initial commit
*   1e6a89d Merge remote-tracking branch 'hw1/main'
|\
| * 57fd6a0 (hw1/main) update example
| * 016ed74 add tex
| * 0c5cf72 finish out.pdf
| * 24a2474 fix a little bug
| * 9b9bdce README.md
| * 1aa184e remove unused code and add comments
| * 47ca969 finish first version
| * 9f30ca4 README.md
| * 683c59b WIP, not tested
| * 48bcefd README.md
| * b7603e8 Initial commit
* cdca739 (origin/main, origin/HEAD) Initial commit
```

## 參考資料

-   https://stackoverflow.com/questions/1425892/how-do-you-merge-two-git-repositories
-   https://gist.github.com/x-yuri/6161d90d1af8ebac6e560bcef548c1c3
-   https://github.com/newren/git-filter-repo
