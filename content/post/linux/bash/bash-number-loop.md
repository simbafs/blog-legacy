+++
title = "bash number loop"
tags = [ "bash", "loop", "seq", "tips" ]
categories = [ "bash" ]
date = "2020-11-15"
+++

今天在某的地方剛好看到一個 bash 的小技巧，當我們要從 1 數到 100 時，通常會用 `seq` 指令來做，但是如果我們的需求剛剛好是每次遞增（遞減）1 的話，就可以使用 `{start..end}` 縮寫，下面兩個範例的效果是一樣的：
```bash
# for 迴圈 + seq 的寫法
for i in $(seq 1 1 100); do
	echo $i
done
```
```bash
# 用 {start..end}
echo {1..100}
```

這個技巧也可以用在建立檔案，像這樣：
```bash
touch user{1..100}
```
