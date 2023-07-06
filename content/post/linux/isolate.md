---
categories:
- linux
date: "2020-03-09"
tags:
- linux
- sandbox
- onlinejudge
title: isolate
---

# isolate

我有一個放了很久的計畫，就是自己寫一個 OJ，因為我覺得現在的那個太難用了。
我很快的建立 repo 但是卻完全沒有進展，我寫了一個 shell script 幫忙編譯執行程式之後我就在也沒有動過他了
我沒有繼續動工的原因是我不知道如何隔離使用者提交的程式碼
我想過 docker 可是據說還是不安全
還有 chroot 但是我不知道有沒有比 docker 安全而且設定好麻煩

昨天去考 TOI 　入營考（當然沒進）的時候，我終於看到大名鼎鼎的 CMS 了！
出來之後我發現他是用一個叫 isolate 的程式來做沙箱測試
而且這好像是 IOI 自己寫的，應該是蠻安全的（吧？）
今天成功編譯過後把心得寫下來

---

## 編譯

```
$ git clone https://github.com/ioi/isolate/
$ cd isolate
$ sudo apt install asciidoc libcap-dev
$ make
$ sudo make install
```

耶！編譯/安裝完成了

---

## 建立沙箱/執行程式

建立好之後切到 root 去
用

```
# isolate --init
/var/local/lib/isolate/0
```

建立一個新的沙箱
他會輸出沙箱所在的目錄

接下來把要執行的檔案放在 `/var/local/lib/isolate/0/box` 裡面（要給執行權）
hello.sh

```
#!/bin/bash
echo Hello World
```

然後

```
# isolate --run hello.sh
Hello World
OK (0.005 sec real, 0.020 sec wall)
```

他最後會輸出執行時間和執行成功的訊息
其他的內容等等再補
