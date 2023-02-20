+++
title = "Server Tool"
date = "2020-02-16"
tags = [ "bash", "RegEx" ]
categories = [ "linux", "server" ]
+++

# Server Tool
## 用 bash 寫 log 分析工具
因為我們的 server 不知道是為什麼一直受到 DDoS 攻擊  
我想知道是什麼時段容易受到攻擊和每次多久、來自那個 ip  
於是我花了一點時間寫了幾個簡單的 script

---
### 先來講我遇到的坑好了

#### sh
過程中遇到一個最大的坑是在 ubuntu 預設的 sh 不是 bash
是 dash
據說比較情輕薄  
我在試 bash 中數字的運算比較時踩到這個坑
```bash
a=10
b=6
if (( a > b ));
then
	echo yes
else
	echo no
fi
```
因為我在試語法是否正確
開了一個新的檔案
我懶的 `chmod` 直接 `sh tt.sh` 
結果 `sh` 是 dash
dash 沒有支援這個語法
然後抓了快 20 分鐘的 bug
還是乖乖寫 `#!/bin/bash` 吧

#### floating point number
我的 script 中有用浮點數的除法
但是 bash 只支援整數
所以除出來都是 0
這個坑沒有很大
很容易解決
只要使用 `bc` 這個指令就可以了
```bash
$ bc -l <<< '100/3'
33.33333333333333333333
```

#### Associate array
在有一個地方本來要用關聯式陣列來存一些資料
在定義關聯是陣列要把 `-a` 改成 `-A`
這邊遇到什麼問題有點忘記了
想到再補起來
反正最後沒有用關聯式陣列

---

### 其他
#### 程式碼
https://github.com/simba-fs/server-tool
介紹：
#### bar.sh
Draw a bar from data
#### count.sh
Count how many times does each line appear in file
#### ip.sh
Count how many times does each ip send a request
#### time.sh
Count how many request in each secend/minute/hour/day
#### 好站連結
https://www.regextester.com/
這個網站可以測試 RegEx
蠻不錯的
