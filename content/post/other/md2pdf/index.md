+++
title = "Markdown to PDF"
date = 2023-02-21T22:07:38+08:00
tags = ['markdown', 'pdf', 'pandoc', 'latex']
categories = ['other']
# image =
+++

# Markdown to PDF

## 安裝環境

[pandoc](https://pandoc.org/) 你想得到的文件之間轉擋 [官方精美的圖](https://pandoc.org/diagram.svgz?v=20230203095535)

如果說你沒有中文的需求，現在就可以用 `pandoc index.md -o out.pdf` 產生 PDF 檔了

## 中文

> **Warning**
> ~~我後來不知道搞砸了什麼，反正目前中文是壞的，找到一個用網頁排版再用瀏覽器內建列印功能輸出成 PDF 的網頁：https://github.com/realdennis/md2pdf~~
> 已解決

### 安裝字型

```
 $ sudo apt-get install texlive-fonts-recommended texlive-fonts-extra texlive-lang-chinese
```

### 字型設定

#### 檔案內

在 md 開頭設定一個包含中文的字型

```
---
CJKmainfont: 'Noto Serif TC'
---
```

#### 參數

```
 $ pandoc index.md -o out.pdf -V CJKmainfont='Noto Serif TC' --pdf-engine xelatex
```

> 2023/02/24 新增：要加上 `--pdf-engine xelatex` 才能正確輸出中文，原因是下面用的範本，他只有在使用 xelatex 和 lualatex 時才會把 `CJKmainfont` 傳遞下去

## 範本

pandoc 有預設的 LaTeX 範本，但是不怎麼好看，可以用網路上開源的範本，或是花時間自己刻出最適合自己的

### Eisvogel

[GitHub 頁面](https://github.com/Wandmalfarbe/pandoc-latex-template)
去 [Release](https://github.com/Wandmalfarbe/pandoc-latex-template/releases/latest) 下載，解壓縮到 `~/.local/share/pandoc/templates`。在編譯時加上 `--template eisvogel` 就可以套用模板了。

## 範例

以下是一段測試的 markdown 產生出來的 pdf，你可以用 [這個連結](./out.pdf) 下載來看

````markdown
---
title: Test pandoc convert md to pdf
author: SimbaFs
---

# 測試

這是一段中文的測試，這句話很長，用來測試斷行。 這是一段中文的測試，這句話很長，用來測試斷行。 這是一段中文的測試，這句話很長，用來測試斷行。 這是一段中文的測試，這句話很長，用來測試斷行。 這是一段中文的測試，這句話很長，用來測試斷行。 這是一段中文的測試，這句話很長，用來測試斷行。 這是一段中文的測試，這句話很長，用來測試斷行。 這是一段中文的測試，這句話很長，用來測試斷行。 這是一段中文的測試，這句話很長，用來測試斷行。 這是一段中文的測試，這句話很長，用來測試斷行。 這是一段中文的測試，這句話很長，用來測試斷行。 這是一段中文的測試，這句話很長，用來測試斷行。

---

## list

-   a
-   b
-   c
    -   d
    -   e
        -   f
            -   g

1. apple
2. book
3. cookie

---

## link

[SimbaFs' Blog](https://blog.simbafs.cc)

---

## check list

-   [ ] check 1
-   [x] check 2

## code block

```go
package main

import (
	"fmt"
)

func main(){
	fmt.Println("hello world!")
	return
}
```

## image

![](./blog.png)
````

> **Info**
> 關於如何在 codeblock 中印出反單引號：[stackoverflow](https://stackoverflow.com/questions/55586867/how-to-put-in-markdown-an-inline-code-block-that-only-contains-a-backtick-char)
> 簡單來說如果裡面要印 `n` 個反單引號，外面就要用 `n+1` 個反單引號括起來

然後這是截圖：
{{< figure src="./out-1.png" title="page 1 of out.pdf" >}}
{{< figure src="./out-2.png" title="page 2 of out.pdf" >}}

可以看到大部分的語法都可以轉換，甚至是程式碼區塊都有語法提示（syntax highlight）

## 其他

### 列出安裝的中文字型

```
 $ fc-list :lang=zh
```

## 參考連結

-   https://sam.webspace.tw/2020/01/13/%E4%BD%BF%E7%94%A8%20Pandoc%20%E5%B0%87%20Markdown%20%E8%BD%89%E7%82%BA%20PDF%20%E6%96%87%E4%BB%B6/
-   https://github.com/jgm/pandoc/wiki/Pandoc-with-Chinese
-   https://github.com/Wandmalfarbe/pandoc-latex-template
-   https://tex.stackexchange.com/questions/341809/pandoc-does-not-recognize-chinese-characters
-   https://tex.stackexchange.com/questions/179778/xelatex-under-ubuntu
-   https://pandoc.org/
