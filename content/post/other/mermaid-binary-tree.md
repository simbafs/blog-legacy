---
title: Mermaid Binary Tree
slug: mermaid-binary-tree
date: '2024-01-31'
tags:
  - mermaid
  - graph theorey
  - tree
categories:
  - other
image: /og/other/mermaid-binary-tree.png
mermaid: true
---

# Mermaid Binary Tree

今天寫筆記遇到一個需求，我想要用 mermaid 畫出下面這顆二元樹，其中 `B` 沒有左節點，我希望能夠明確的標示出 `D` 是 `B` 的右節點

{{< mermaid >}}
graph
    A --- B & C
    B ~~~ 1:::hidden
    B --- D

classDef hidden display: none;
{{</mermaid>}}


## mermaid
如果無腦用一般 [mermaid](https://mermaid.js.org) 的寫法會像這樣

{{< mermaid source="yes">}}
graph
    A --- B & C
    B --- D
{{< /mermaid >}}

`D` 就直直的放在 `B` 的下面，網路上找了一圈都沒看到可以把 `D` 往右靠的方法。最後，我想出來的方法是在 `D` 的左邊畫一個隱形的節點，用一條隱形的邊連起來，這樣 mermaid 就會自然的把 `D` 往右邊擺了。  

### 隱形的邊
首先，根據 [官方文件](https://mermaid.js.org/syntax/flowchart.html#an-invisible-link) 我們可以用 `~~~` 畫一條隱形的邊

{{< mermaid source="yes" >}}
graph
    A --- B & C
    B ~~~ E[hidden node]
    B --- D

{{</ mermaid >}}

### 隱形的節點
再來，要把 `E` 隱藏，[這篇問答](https://stackoverflow.com/questions/50268757/draw-arrow-from-node-to-nothing) 提供了很多方法，不過我最喜歡的是定義一個 class 的方式

{{< mermaid source="yes" >}}
graph
    A --- B & C
    B ~~~ 1:::hidden
    B --- D

classDef hidden display: none;
{{</ mermaid >}}

這樣我們就得到一張有明確左右節點的二元樹了！

## GoAT

寫這篇的時候發現 hugo 原生支援 [GoAT](https://github.com/bep/goat)，於是就拿來畫畫看，

```goat
   .---.
   | A |
   '-+-'
    / \
   /   \
.-+-. .-+-.
| B | | C |
'-+-' '---'
   \
    \
   .-+-.
   | D |
   '---'
```

效果不錯，不過原始碼就...

```text
   .---.
   | A |
   '-+-'
    / \
   /   \
.-+-. .-+-.
| B | | C |
'-+-' '---'
   \
    \
   .-+-.
   | D |
   '---'
```

光是對齊那謝角角跟線就花了十分鐘，有夠麻煩。這東西畫出來的圖確實好看，而且就算是純文字也很輕易看得懂（不像 mermaid 還有隱藏線跟隱藏節點要忽略），但是畫起來太累了，如果沒有工具，我絕對不會畫第二遍。我是有找到 [https://textik.com](https://textik.com) 勉強可以用，不過也不適合拿來畫 binary tree，而且他的格式沒有跟 GoAT 完全兼容，需要再自己修改一些眉眉角角，所以還是放棄 GoAT 了。
