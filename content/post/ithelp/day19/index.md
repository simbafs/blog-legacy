---
title: Day 19：該是時候升級你的噴射引擎囉！vim-emmet 重複與迭代
slug: day19
date: '2021-09-19T00:00:00.000Z'
tags:
  - cli
  - terminal
  - software development
  - vim
  - tmux
  - zsh
categories:
  - ithelp
image: /og/ithelp/day19.png
---

## 重複

如果想讓某個標籤/群組重複，只要用乘號 `*` 加上數字就可以讓他重複了

```html
h1.title*5 ->

<h1 class="title"></h1>
<h1 class="title"></h1>
<h1 class="title"></h1>
<h1 class="title"></h1>
<h1 class="title"></h1>

------------ (p.artical+br)*3 ->

<p class="artical"></p>
<br />
<p class="artical"></p>
<br />
<p class="artical"></p>
<br />
```

## 迭代

在重複的時候，你可能會有某些地方是要要變化的，例如從 id 從 1 開始遞增，你可以使用錢號 `$` 代表要遞增的位數  
如果你不是要從 1 開始迭代，可以使用小老鼠 `@` 指定開始的數字  
如果要反著數，用 `@-` 可以倒數到 0，當然也可以指定倒數到多少

```html
h1#title$$*12 ->

<h1 id="title01"></h1>
<h1 id="title02"></h1>
<h1 id="title03"></h1>
<h1 id="title04"></h1>
<h1 id="title05"></h1>
<h1 id="title06"></h1>
<h1 id="title07"></h1>
<h1 id="title08"></h1>
<h1 id="title09"></h1>
<h1 id="title10"></h1>
<h1 id="title11"></h1>
<h1 id="title12"></h1>

------------ h1#$@10*3 ->

<h1 id="10"></h1>
<h1 id="11"></h1>
<h1 id="12"></h1>

------------ h1#$@-*3 ->

<h1 id="2"></h1>
<h1 id="1"></h1>
<h1 id="0"></h1>

------------ h1#$@-6*3 ->

<h1 id="8"></h1>
<h1 id="7"></h1>
<h1 id="6"></h1>

------------ h$*6 ->

<h1></h1>
<h2></h2>
<h3></h3>
<h4></h4>
<h5></h5>
<h6></h6>
```

## 範本包圍

> 我不確定這個叫什麼，反正就這樣啦

剛剛講的功能都只有產生空白標籤，不能批次產生內容，現在這個東西可以快速把內容和你的 HTML 標籤結合，產生程式碼！  
先假設我們有四行內容

```
Apple
Book
Cat
Dog
```

我們要先用選取模式把他們匡起來（要完整的匡喔，沒匡到的地方不會被處理到）  
然後按下快捷鍵 `<C-y>,`，vim 底下會出現一行 `Tag: `，這時候你可以輸入 emmet 程式碼了

```
div>h1.alphaBet*>a
```

被你匡起來的文字就會以行為單位放進 HTML 標籤裡了，就像這樣

```
<div>
	<h1 class="alphabet">
		<a href="">Apple</a>
	</h1>
	<h1 class="alphabet">
		<a href="">Book</a>
	</h1>
	<h1 class="alphabet">
		<a href="">Cat</a>
	</h1>
	<h1 class="alphabet">
		<a href="">Dog</a>
	</h1>
</div>
```

這裡要注意一點，在 emmet 中諦一個出現星號 `*` 的地方代表這下面（包括這層）的標籤要重複  
在剛剛的例子裡，星號打在 `h1` 這個標籤上，所以 `h1` 之後的標籤（`h1`、`a`）都會重複 N 次（ N 取決於你匡了幾行），並且要填充的內容會放在最後一層標籤（`a`）中

# 結論

這兩天我自己打的內容大概只有 1/10 吧，剩餘的都是 emmet 產生的，emmet 真的太好用了！  
有沒有感覺 emmet 比你想像的複雜多了，還有很多語法沒講到，像是 css 的拓展等等，更多用法可以去 emmet 的 [官網 https://docs.emmet.io/cheat-sheet/](https://docs.emmet.io/cheat-sheet/) 看看喔（很容易看到頭暈，別說我沒警告你）
