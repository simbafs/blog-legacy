---
title: docker commit
slug: docker-commit
date: '2020-11-27'
tags:
  - docker
  - linux
categories:
  - linux
  - docker
---

# Docker Commit

## 前言

上次提到可以用 Dockerfile 建立 docker image，但我們還有令一個方法可以建立 docker image，那就是 `docker commit` 指令

### 和 Dockerfile 差別

`docker commit` 有點像是手動版的 Dockerfile，在用 Dockerfile 建構 docker image 的時候，docker build 的工作就像是自動根據 Dockerfile 操作 `docker commit`。
Dockerfile 比較適合用在自動化交付和部屬，例如說你有一份程式碼，要將他包成 Docker 就很適合用 Dockerfile 自動化操作，因為程式碼會改變，但是包裝的流程基本上都是一樣的。
`docker commit` 適合用在建構環境，因為會有比較麻煩的操作，如果寫成 Dockerfile 會比較麻煩，當然如果可以的話還是寫成 Dockerfile 會比較好，因為更新的時候會比較方便。
在建構 image 的時候要用哪個方法就看個人取捨了。

### `docker commit` 指令

`docker commit` 可以把運行中的 comtainer 轉成 images，有點類似令存新檔的概念。先來看看參數吧！

#### 參數

```bash
$ docker commit --help
Usage:	docker commit [OPTIONS] CONTAINER [REPOSITORY[:TAG]]

Create a new image from a container's changes

Options:
  -a, --author string    Author (e.g., "John Hannibal Smith <hannibal@a-team.com>")
  -c, --change list      Apply Dockerfile instruction to the created image
  -m, --message string   Commit message
  -p, --pause            Pause container during commit (default true)
```

| 選項 | 說明                   |
| :--- | :--------------------- |
| -a   | 作者的名字             |
| -c   | 我還沒研究出來有什麼用 |
| -m   | 訊息                   |
| -p   | 建構時停容器           |
