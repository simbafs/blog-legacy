---
title: Homemade CI/CD Workflow
slug: homemade-CICD-workflow
date: '2023-08-07'
tags:
  - CICD
  - devops
  - docker
  - webhook
categories:
  - devops
image: /og/devops/homemade-CICD-workflow.png
---

# Homemade CI/CD Workflow

先說為什麼要自幹，~~我爽~~，因為其他的都太複雜，我想要乾淨清爽 <-- 官腔說法  
自幹 CI/CD 有幾個步驟要克服

1. build image
2. 通知伺服器 image 有更新
3. 重開伺服器
   第一點也是最重要的，既然都在 GitHub 上代管原始碼了，當然先選 GitHub Action 囉，第二點有兩個選擇一個是由伺服器每隔一段時間去檢查 image 有沒有更新，可以用 [這個套件](https://github.com/containrrr/watchtower)，但是我不太喜歡這樣，因為我覺得他沒有「持續交付」的感覺。我想到了 webhook，所以我要找一個可以開 webhook 伺服器的 docker image。
   技術都選好了，就來慢慢~~填坑~~完成囉！

<!--more-->

## Build Image

先假設我們的 Dockerfile 已經寫好了，可以參考 [這裡](/p/linux/docker/dockerfile-collection/#nextjs-with-pnpm)，那麼 build 這個動作就是這樣定義，另外既然都在 GitHub 上 build image 了，就順便用 [ghcr](https://ghcr.io) 吧。

```yaml
- name: build image
  run: |
      docker build . -t ghcr.io/simbafs/coscup-attendance:latest -t ghcr.io/simbafs/coscup-attendance:${{ steps.vars.outputs.tag }}
```

裡面有個奇怪的東西 `${{ steps.vars.outputs.tag }}`，這是代表 GitHub Action 某個步驟的產出變數 `tag`，這是為了幫 build 出來的 image 加上 tag，所以開支線任務:「找出 tag」

### 支線任務：「找出 tag」

tag 不會憑空生出來，所以我們需要一個來源，我選擇 git tag。那麼根據谷歌大神的開示，用 `${GITHUB_REF#refs/*/}` 可以找出這次觸發 Action 的 tag（或是 reference），那麼我們就在 `build image` 前面新增一個步驟，之後就都可以用 `${{ steps.vars.outputs.tag }}` 取得 tag

```yaml
- name: Set env
  id: var
  run: echo "tag=${GITHUB_REF#refs/*/}" >> $GITHUB_OUTPUT
```

## Push Image

### 登入 GHCR

我們已經決定要推上 GHCR 了，首先一定要先登入才能推送的。

```yaml
- name: 'Login to GitHub Container Registry'
  uses: docker/login-action@v1
  with:
      registry: ghcr.io
      username: ${{ github.actor }}
      password: ${{ secrets.GITHUB_TOKEN }}
```

注意這裡 `${{ github.actor }}` 和 `${{ secrets.GITHUB_TOKEN }}` 是不需要設定的，他會自己代入該代的值，不過要去設定裡面設定調整，讓 Action 可以寫入 package，位置在 `settings > actions > general > Workflow permissions > read and write permissions`

### Push Image

push 就很簡單，一條指令，不過我不確定怎麼把兩個 tag 都推上去，就分成兩條，如果第一條不寫只推 `:latest` 的話，新的 iamge 推上去舊的就會失去 tag 變成 untagged iamge，比較醜

```yaml
- name: push image
  run: |
      docker push ghcr.io/simbafs/coscup-attendance:${{ steps.vars.outputs.tag }}
      docker push ghcr.io/simbafs/coscup-attendance:latest
```

> GitHub Action 還沒完喔！

## Webhook

webhook 說穿了就是設定收到 http request 後要做什麼，~~用 bash 硬幹也不是不行~~，我找了一個用 go 寫的程式 [webhook](https://github.com/adnanh/webhook)，定義一個 JSON 檔，除了最基本的觸發外，還可以 [設定條件](https://github.com/adnanh/webhook/blob/master/docs/Hook-Rules.md) ，基本的值要相符、regex， 還有 HMAC 驗證，進階一點含有 and or not 等邏輯可以用。官方推薦了三個 docker image，[第一個](https://github.com/almir/docker-webhook) 最多人用，但是他沒有 shell 可以 debug，所以我選擇了 [第二個](https://github.com/Roxedus/docker-webhook)。

### docker-compose.yml

首先是 docker-compose.yml

```yaml
version: '3.3'
services:
    webhook:
        image: roxedus/webhook
        container_name: webhook
        environment:
            - PUID=0
            - PGID=0
            - TZ=Asiz/Taipei
            - EXTRA_PARAM=-hotreload -verbose #optional
        volumes:
            - ./hooks.json:/config/hooks/hooks.json
            - ./script/:/var/webhook/
            - /volume1/docker/:/var/webhook/docker/
            - /var/run/docker.sock:/var/run/docker.sock
            - /usr/local/bin/docker:/usr/local/bin/docker
            - /usr/local/bin/docker-compose:/usr/local/bin/docker-compose
        ports:
            - 5748:9000
```

這裡 volume 掛了一堆東西，第一個是設定檔，第二個是方便放 script 和 log，第三個是為了到要更新的 docker 專案目錄執行 `docker-compose`，後面三個都是為了可以執行 host 上的 docker 指令。

### hooks.json

接著是 `hooks.json`

```json
[
	{
		"id": "coscup-attendance",
		"execute-command": "/var/webhook/docker/coscup/update.sh",
		"command-working-directory": "/var/webhook/docker/coscup/",
		"trigger-rule": {
			"match": {
				"type": "value",
				"value": "random key",
				"parameter": {
					"source": "payload",
					"name": "key"
				}
			}
		}
	}
]
```

`id` 就是 webhook 裡的 id `https://localhost:9000/hooks/{id}`，然後是要執行的命令和工作目錄，命令建議寫絕對路徑，不過路徑要是掛載到 docker container 裡面後的路徑，不是在外面的路徑。接著 `trigger-rule` 描述了要在 payload（就是 http body）中 `key` 欄位要是 `"random key` 才會執行命令，詳細設定可以去 [這裡](https://github.com/adnanh/webhook/blob/master/docs/Hook-Rules.md) 看。以這裡的設定為例，要成功執行的話就要用以下方式呼叫才會執行 `update.sh`

```bash
$ curl -XPOST --header 'Content-Type: application/json'  -d'{"key": "random key"}' http://localhost:9000/hooks/coscup-attendance
```

### update.sh

接著就是當 webhook 執行時要執行的 update.sh，只有三個步驟，down、pull、up

```bash
#!/bin/sh
cd /var/webhook/docker/coscup
/usr/local/bin/docker-compose down
/usr/local/bin/docker-compose pull
/usr/local/bin/docker-compose up -d
```

## GitHub Action 觸發 webhook

最後一步，設定讓 Action build 完 image 後就發 request 觸發 webhook

```yaml
- name: trigger webhook
  run: |
      curl -XPOST --header 'Content-Type: application/json'  -d'{"key": "${{ secrets.WEBHOOK_KEY }}"}' "https://webhook.simbafs.cc/hooks/coscup-attendance"
```

這裡把 `"random key` 拉出來放到 secrets 裡面是因為我不希望隨便一個人都能重啟 docker container，雖然不會怎樣但是服務會被中斷，所以才設計這個密碼，至於為什麼不用 hmac 驗證呢？如果是 `hooks.json` 洩漏，那麼有沒有驗證都沒差了，如果是封包內容被抓到，也是沒差了，因為我的 payload 每次都一樣，如果 **webhook** 能驗證時間之類的才會有用，所以單純驗 value 就可以了，而且我都是走 https，要洩漏也沒那麼容易。

## 完整 GitHub Action

說了這麼多 GitHub Action 都還是零碎的片段，下面就是完整的設定檔，我把 build, push 和 webhook 分成兩個 jobs 是因為我光是測試 webhook 就好幾次，每次重跑 build 真的好久（抹汗。另外希望以後有機會能把 `build-and-push` 拆分的更細。然後開頭我有設定只有當 git tag 符合 `v*.*.*` 才會觸發這個 Action，主要是希望 `${{ steps.vars.outputs.tag }}` 抓到的都是可以用的版本邊號，不會是沒有上標籤的 main，而且可以控制什麼時候要發新版本。

```yaml
name: Deploy Images to GHCR

on:
    push:
        tags:
            - 'v*.*.*'

jobs:
    build-and-push:
        runs-on: ubuntu-latest
        steps:
            - name: 'Checkout GitHub Action'
              uses: actions/checkout@main

            - name: 'Login to GitHub Container Registry'
              uses: docker/login-action@v1
              with:
                  registry: ghcr.io
                  username: ${{ github.actor }}
                  password: ${{ secrets.GITHUB_TOKEN }}

            - name: Set env
              id: vars
              run: echo "tag=${GITHUB_REF#refs/*/}" >> $GITHUB_OUTPUT

            - name: echo
              run: echo ${{ steps.vars.outputs.tag }}

            - name: build image
              run: |
                  docker build . -t ghcr.io/simbafs/coscup-attendance:latest -t ghcr.io/simbafs/coscup-attendance:${{ steps.vars.outputs.tag }}

            - name: push image
              run: |
                  docker push ghcr.io/simbafs/coscup-attendance:${{ steps.vars.outputs.tag }}
                  docker push ghcr.io/simbafs/coscup-attendance:latest

    cd:
        runs-on: ubuntu-latest
        needs: [build-and-push]
        steps:
            - name: trigger webhook
              run: |
                  curl -XPOST --header 'Content-Type: application/json'  -d'{"key": "${{ secrets.WEBHOOK_KEY }}"}' "https://webhook.simbafs.cc/hooks/coscup-attendance"
```
