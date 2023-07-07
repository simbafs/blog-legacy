---
title: Cache Layer
slug: cache-layer
date: '2023-07-07'
tags:
    - docker
    - accelerate
    - image
    - cache
categories:
    - linux
    - docker
---

# Cache Layer

Dockerfile 中總是有些步驟很耗時間，但是其實每次都在做一樣的事，例如 `npm i`、`go mod download` 等等，每次其實都下載一樣的檔案。
docker build 在按照 Dockerfile 建構 image 時，每一行都會有 cache layer，最後的 image 就是這一層一層疊起來的。如果之前的 cache layer 都在且這次檔案變動跟之前一樣，那就會直接跳過命令執行，用快取帶替，直接來看例子

## 沒有利用快取

```dockerfile
COPY . .
RUN go mod download
RUN go build -o main .
CMD ["./main"]
```

`COPY . .` 把所有檔案複製進來，然後 `RUN go mod download` 看到，source code 有變動耶！快取不能用，因此重新下載一份相依套件，然後再執行後續動作

## 利用快取

```dockerfile
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o main .

CMD ["./main"]
```

`COPY go.mod go.sum ./` 只會把 `go.mod` 和 `go.sum` 放進來，如果相依性沒有改變的話等於跟之前 `docker build` 時條件一樣，因此當 docker 執行到 `RUN go mod download` 時就可以直接找之前的 cache layer，跳過下載過程，然後再繼續後面的動作

## 加速編譯的原則

按照前面利用快取的例子歸納，只要我們把執行越慢、越不常改變的步驟往前移，就可以用之前的 cache layer。而在這裡需要注意的是，`COPY` 時只把下一個指令需要的檔案複製進來就好，盡量避免一次複製一整個目錄，這樣有助於減少檔案變動，更好的利用之前的 cache layer。

```
  +-------------------------------------+
1 |Big, slow, infrequently changes layer|
  +---+----------------------------+----+
2     |                            |
      +---+--------------------+---+
3         |                    |
          +---+------------+---+
4             |Small, quick|
              +------------+
```

## 其他猜想

我沒用過這個東西，所以以下描述只是猜想，可能跟實務上有出入。  
因為 docker 的 cache layer 是儲存在本機上，所以我換一台電腦執行 `docker build` 就無法用到之前的 cache layer，所以保持在同一臺電腦編譯是最好的，可能這個就是之前看過的 build server？說不定有這個好處。
