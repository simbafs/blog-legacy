+++
title = "Docker 基礎指令"
slug = 'docker command'
date = "2020-09-10"
tags = [ "docker", "linux" ]
categories = [ 'linux', "docker" ]
+++

# Docker 指令
## Install
```bash
apt install docker docker.io docker-compose
```
## What is docker
Docker 是一個容器化的技術，基本上使用的時候可以把他當成虛擬機，雖然他們的使用的技術完全不一樣。對新手來說，在 Docker 裡面有四個重要的名詞：dockerfile, docker image, docker container, docker-compose。  
1. dockerfile  
	純文字檔，定義建立 docker image 的步驟，有點像是一個 bash shell。通常命名成 `Dockerfile` ，在 build 的時候會預設用這個，也可以用 `-f` 來指定其他的檔案。
2. docker image  
	這是透過 `docker build` 編譯出來的東西。可以想成 docker container 的藍圖，在 `docker pull` 的時候也是下載 docker image 而不是 dockerfile。基本上 image 裡面已經包括了編譯好的執行檔和基本的環境設定，所以在 docker 外面是不用做他設定的，這也是 docker 的魅力所在。
3. docker container  
	每個 docker image 可以產生很多個 container，也就是執行中的程式。在這裡你已經可以用 docker 來建立各種服務了。這裡也可以想像成虛擬機，用 `docker exec -it container_name bash` 可以進到 container 裡面(如果裡面有 bash 的話)  
4. docker-compose  
	一個服務不是一個 container 就可以架起來的，通常需要好幾個 container。這時候如果透過指令啟動也許會有忘記啟動和設定複雜的問題，所以有了這個工具。他透過 yml 設定來啟動服務。值得注意的是在同一個 `docker-compose.yml` 啟動的 container 會在同一個網路內而和外面隔開，所以如果是 containers 之間的通訊不用把 port 暴露出來，只有開給外面的要 expose。

