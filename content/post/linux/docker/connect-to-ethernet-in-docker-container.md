---
title: Connect to Ethernet in Docker Container
slug: connect-to-ethernet-in-docker-container
date: '2020-11-28'
tags:
  - docker
  - linux
categories:
  - linux
  - docker
---

# Connect to Ethernet in Docker Container

## 如何在 docker container 裡連接 ethernet

今天突然有個需求是在一個已經開啟的 container 弄東西，需要網路，但是不知道為什麼一直不上，後來發現是 docker 沒有設定 DNS 的問題，只要在外面輸入兩行指令就可以了

```bash
DOCKER_OPTS="--dns 8.8.8.8"
systemctl restart docker
```

然後重新啟動 docker
