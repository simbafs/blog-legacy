---
title: Crop and Resize PDF
slug: crop-and-resize-pdf
date: '2024-01-09T00:00:00.000Z'
tags:
  - pdf
  - cmd
  - cli
categories:
  - linux
  - crop-and-resize-pdf
---

# Crop and Resize PDF
我下載了一堆研究所考古題，不過有些檔案的白邊太多了，我希望能夠裁掉，然後又因為列印時需要，所以希望能再縮放成 A4。

首先是查到[這篇](https://www.baeldung.com/linux/pdf-files-crop-cli)文章有教怎麼縮放 pdf

```
$ pdfjam --keepinfo --trim "20mm 48mm 55mm 25mm" --fitpaper true single-page.pdf --outfile single-page-manualcropped.pdf
```

不過這時候大小是裁切過的大小，所以需要縮放成 A4。又查到[這篇](https://superuser.com/questions/676013/scaling-pdf-content-and-page-dimensions-from-command-line)，把他跟上面裁切的指令結合，就變成


```
$ pdfjam --keepinfo --trim "124px 247px 124px 117px" --papersize '{21cm, 29.7cm}' --outfile out.pdf EC24_110_1.pdf
```

`pdfjam` 提供一個 `--batch` 指令，所以如果全部要切的邊都一樣，就可以用

```
pdfjam --keepinfo --trim "124px 247px 124px 117px" --papersize '{21cm, 29.7cm}' --batch *.pdf
```

一次切完

# Reference 
* https://www.baeldung.com/linux/pdf-files-crop-cli
* https://superuser.com/questions/676013/scaling-pdf-content-and-page-dimensions-from-command-line
