---
title: ddos
slug: ddos
date: '2020-02-13'
tags:
  - ddos
  - bash
categories:
  - linux
  - server
---

# DDOS

## 伺服器被 DDoS 惹

今天早上把社團的 reverse proxy server 換成 nginx  
下午心血來潮看看 log 檔
因為沒有寫好的工具  
首先把 log 檔 cp 到我的電腦再來處理

---

先寫了一個 script 來計算重複的行數

```bash
#!/bin/bash
# count.sh
declare -A cnt
while read id extre
do
        let cnt[$id]++
done
for id in "${!cnt[@]}"
do
        echo $id ${cnt[$id]}
done
```

---

再來用 `awk` 把 `status code` 是 404 的 ip 挑出來
然後丟給 `count.sh` 計算每個 ip 有幾個 404
最後再存到 `404-ip.txt`

```bash
awk '$9 == 404 {print $1}' access.log | ./count.sh > 404-ip.txt
```

---

再來用 `sort` 來排序剛剛的 `404-ip.txt`，存到 `404-ip-sorted.txt`
`sort` 加上 `-n` 選項讓他以數字順數排序，預設是以 ascii 順序排序
`-r` 讓他由大到小
`-k2` 指定以第二欄排序，預設以空白分開，可以用 `-t` 改變分隔符號

```bash
sort -n 404-ip.txt -k2 -r > 404-ip-sorted.txt
```

---

這時候來看看 `404-ip-sorted.txt`

```
$ head 404-ip-sorted.txt
91.199.118.175 1329180
91.199.118.212 259477
163.172.12.108 145050
195.154.161.234 142920
195.154.102.22 142450
195.154.102.191 137800
163.172.12.148 132650
62.210.220.48 129248
195.154.102.159 11353
62.210.85.48 11206
```

哇賽！第一名的 ip 送了一百三十多萬個請求  
這份 log 檔是在早上十點多才開始紀錄的  
平均每秒 41 個請求
這麼多鐵定是 ddos
我們來看看完整的檔案看看有多少人在 DDoS 我們的 server
嗯，總共十九個破千的  
這些通通有問題（其實應該以平均請求數來看，但太複雜了所以以後再補
接下來就接把這幾個 ip ban 掉

```bash
$ sudo su
$ cd /etc/nginx/sites-enabled/
$ vi banned-ip.conf
```

將 ip 貼到文件裡面
在一般模式下執行

```
[esc] :%s/^/deny /
[esc] :%s/&/;/
```

```bash
$ cd ../sites-enabled
$ ln -s ../sites-available
```

`$ nginx -t` 確認設定檔沒問題
`$ systemctl restart nginx` 來重啟伺服器
然後就大公告成了～～
明天再來看看有沒有問題
