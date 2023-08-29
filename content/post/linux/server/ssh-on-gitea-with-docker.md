---
title: ssh on gitea with docker
slug: ssh-on-gitea-with-docker
date: '2021-07-13'
tags:
  - gitea
  - ssh
  - self-host
  - git
categories:
  - linux
  - server
image: /og/linux/server/ssh-on-gitea-with-docker.png
---

# Gitea

[Gitea](https://gitea.io) 是一個開源的 git 伺服器，他的界面幾乎和 [GitHub](https://github.com) 一模一樣，但是完全開源而且非常輕，甚至一片樹梅派就可以開伺服器了。Gitea 因為是使用 [Golang](https://golang.org/) 編寫的，所以提供各種平台的執行檔。我選擇透過 docker 裝 Gitea 伺服器，但是這樣有一個問題，gitea 伺服器開在 container 內，沒辦法使用標準的 22 port，所以 git clone 就必須加上一個醜醜的數字，像是這樣

```
git clone git@domain:10022:user/repo.git
```

這個問題 Gitea 官方已經有提供[完整的教學](https://docs.gitea.io/en-us/install-with-docker/#ssh-container-passthrough)了，但是是英文版，我這篇文章是我讀完消化過後的中文版教學

## 容器 ssh 穿透

因為 Gitea 的 ssh 是跑在容器裡，我沒辦法讓他和 host 共用 22 port，所以要透過 host 「轉發」連線。

## 1. 建立 git 使用者

先在 host 建立一個名叫 git 的使用者，因為這個帳號會被對應到容器內的 git 使用者，所以要有一樣的 UID, GID

```bash adduser
sudo adduser git
grep git /etc/passwd
```

記好 git 的 UID 和 GID

```passed /etc/passwd
git:x:1002:1002:,,,:/home/git:/bin/bash
------^^^^ ^^^^
------GID  UID
```

## 2. docker-compose

以下是我的 docker-compose，可以根據不同的需求再修改（像是加入 db）

```docker-compose docker-compose.yml
version: "3"
services:
    gitea:
        container_name: gitea
        image: gitea/gitea:latest
        ports:
          - "10022:22"
          - "10080:3000"
        volumes:
          - "/home/simba/website/gitea/data:/data"
          - "/home/git/.ssh:/data/git/.ssh"         # ssh 連線需要，這樣使用者新增 ssh key 時才會同步到 host 上，使用者才連的進來
        restart: 'unless-stopped'
        environment:
          - USER_UID=1002
          - USER_GID=1002
```

UID 和 GID 記得換成你的，我的和你的不一定一樣

## 3. 幫 git 帳號產生 ssh key

要有 ssh key 才能轉發（host 上的 git 要連線到 container 內）

```bash ssh-keygen
sudo -u git ssh-keygen -t rsa -b 4096 -C "Gitea Host Key"
```

## 4. ssh 轉發

這時候如果你開啟服務，為一個使用者新增 ssh key 你會發現在 host 上 `~git/.ssh/authorized_keys` 會多出一行，長的像這樣

```ssh example ssh key
command="/app/gitea/gitea --config=/data/gitea/conf/app.ini serv key-1",no-port-forwarding,no-X11-forwarding,no-agent-forwarding,no-pty ssh-rsa AAAA......(ssh key)
```

這行是 Gitea 新增的，功能是讓新的 ssh 連線(user -> host)進來時執行 `/app/gitea/gitea serv` 這個指令，但是我們希望他可以執行 ssh 轉發，所以我們可以在 host 的 `/app/gitea/` 下新增一個 `gitea` 執行檔幫我們做 ssh 轉發（這裡不會有 gitea 執行檔，因為是在 host，gitea 本體在 container 內）  
首先新增目錄 `sudo mkdir -p /app/gitea`  
再來建立檔案 `/app/gitea/gitea`，內容如下

```bash /app/gitea/gitea
#!/bin/sh
ssh -p 2222 -o StrictHostKeyChecking=no git@127.0.0.1 "SSH_ORIGINAL_COMMAND=\"$SSH_ORIGINAL_COMMAND\" $0 $@"
```

不要忘記給他執行權限 `sudo chmod 755 /app/gitea/gitea`

## 大功告成！

## 心得

一開始我沒找到官方的教學，一方面是我想自己試試看，二方面是因為官方文件中英文完全不一樣，看英文版才完整，中文只給兩條指令。

## 參考連結

[https://docs.gitea.io/en-us/install-with-docker/#ssh-container-passthrough](https://docs.gitea.io/en-us/install-with-docker/#ssh-container-passthrough)  
[https://asaba.sakuragawa.moe/2018/06/擺脫控制，用-docker-自建-gitea-gogs-線上代碼協作平臺/](https://asaba.sakuragawa.moe/2018/06/%E6%93%BA%E8%84%AB%E6%8E%A7%E5%88%B6%EF%BC%8C%E7%94%A8-docker-%E8%87%AA%E5%BB%BA-gitea-gogs-%E7%B7%9A%E4%B8%8A%E4%BB%A3%E7%A2%BC%E5%8D%94%E4%BD%9C%E5%B9%B3%E8%87%BA/)
