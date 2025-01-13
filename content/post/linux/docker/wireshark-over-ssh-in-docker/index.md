---
title: Wireshark Over SSH in Docker
slug: wireshark-over-ssh-in-docker
date: '2023-07-09T00:00:00.000Z'
tags:
  - wireshark
  - docker
  - ssh
  - remote
  - package
categories:
  - linux
  - docker
image: /og/linux/docker/wireshark-over-ssh-in-docker.png
---

# Wireshark Over SSH in Docker

分成兩個部份，一個是把封包從 docker container 裡面弄出來，再來是在本地的 [wireshark](https://zh.wikipedia.org/zh-tw/Wireshark) 抓到遠端的封包

## 把封包弄出 docker container
使用 [nicolaka/netshoot](https://github.com/nicolaka/netshoot) 這個 docker image，把他跟目標 container 放在同一個 network 下，例如以下會把封包全部丟進 /data/nginx.pcap 這個檔案裡
```yaml
version: "3.6"
services:
  tcpdump:
    image: nicolaka/netshoot
    depends_on:
      - nginx
    command: tcpdump -i eth0 -w /data/nginx.pcap
    network_mode: service:nginx
    volumes:
      - $PWD/data:/data

  nginx:
    image: nginx:alpine
    ports:
      - 80:80
```

## 本地的 wireshark 抓到遠端的封包
我們有了 /data/nginx.pcap 之後，就可以用 ssh 把檔案印出來，然後吐給 wireshark
```
ssh ssh_host "cat path/to/nginx.pcap" | wireshark -k -i -
```

## 參考資料
* https://s905060.gitbooks.io/site-reliability-engineer-handbook/content/howto_use_wireshark_over_ssh.html
* https://github.com/nicolaka/netshoot
