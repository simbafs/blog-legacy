+++
title = "youtube-dl"
date = "2020-03-04"
tags = [ "youtube-dl", "bash" ]
categories = [ "linux" ]
+++

# Youtube DL

最近在下載 youtube 音樂，每次下載都要把檔案重新改名，很麻煩。所以就想要寫一個 shell script 來幫我解決。
首先改名字我相信 youtube-dl 一定有提供這個選項，於是開始查文件。
看到 `-o` ，接下來講遇到的坑

## `-o` 坑

`-o` 後面接的是一個 template string ，不是檔名，而且就算指定副檔名是 .mp3 了還是要寫成 `%(ext)s`
