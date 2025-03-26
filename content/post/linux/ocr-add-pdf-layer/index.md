---
title: OCR Add PDF Text Layer
slug: ocr-add-pdf-layer
date: '2023-05-19T00:00:00.000Z'
tags:
  - pdf
  - ocr
categories:
  - linux
  - ocr-add-pdf-layer
---

# OCR Add PDF Text Layer

眾所周知大學課本又厚又重，而且還不便宜，所以這時候如果有電子書就可以很大程度解決這個問題。但是有時候拿到的電子書是掃描的圖片（來源就......咳咳），不能複製、按右鍵翻譯。這時候就可以出動光學字元辨識，幫我們把圖片轉成文字，而且順便把字放在 PDF 的文字圖層上，這樣就可以看著掃描的書，又可以選取到原本不能選取的文字。

## tesseract

我之前試過幾個線上 OCR，但都是付費功能，但這個東西不是什麼前沿技術，理論上應該不需要太強的電腦效能，於是我就想試著自己跑在我的電腦上。我首先找到的是 https://github.com/tesseract-ocr/tesseract ，按照他的說明，這套是 1985 年由 HP 開發，之後開源、Google 接手繼續開發的軟體（有夠古老）、支援超過 100 種語言。既然是大公司開發，又過了這麼久（而且看起來上星期還有 commit，就算有 bug 應該也找得到人修），想必應該很不錯。這個透過 `apt` 就可以安裝了

```
sudo apt install tesseract-ocr
sudo apt install libtesseract-dev
```

不過當我直接把 pdf 丟進去的時候他好像不能直接吃 PDF

## OCRmyPDF

接著我在搜尋關鍵字加上 `pdf`，第一個看起來就是一個很棒的 repo https://github.com/ocrmypdf/OCRmyPDF ，有 8.9k 個星星，他號稱可以把 PDF 丟進 OCR 後把結果再塞進 text layer 裡，完美符合需求，而且他是基於 tesseract 這個看起來也超級棒的軟體。這個安裝也是用 `apt` 就可以了

```
apt install ocrmypdf
```

安裝好後給來源路徑、輸出路徑，然後等一會就好了，我用我的力學課本第 12 章做測試，44 頁的文字 46 秒完成，打開後內容幾乎沒錯，超棒！

等等就把整本課本都丟進去 ><
