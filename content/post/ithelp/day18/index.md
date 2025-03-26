---
title: Day 18：幫你的 HTML 開發裝上噴射引擎！vim-emmet
slug: day18
date: '2021-09-18T00:00:00.000Z'
tags:
  - cli
  - terminal
  - software development
  - vim
  - tmux
  - zsh
categories:
  - ithelp
  - day18
---

emmet-vim 是 emmet 的 vim 版本（這句好像是廢話

> 注意：emmet-vim 用的是自己寫的而不是用 emmet.io 官方的解析引擎

emmet-vim 是一套外掛程式，他可以解析一段字串，然後根據規則變成 html，例如下面的例子

```html
.tab>(tr#col$>td*3)*4 會被解析成

<div class="tab">
	<tr id="col1">
		<td></td>
		<td></td>
		<td></td>
	</tr>
	<tr id="col2">
		<td></td>
		<td></td>
		<td></td>
	</tr>
	<tr id="col3">
		<td></td>
		<td></td>
		<td></td>
	</tr>
	<tr id="col4">
		<td></td>
		<td></td>
		<td></td>
	</tr>
</div>
```

是不是很方便，用一行的指令可以變成 22 行的 HTML，而且還會幫你排版好喔，有沒有香！

# 安裝

在 `~/.config/nvim/plugin.vim` 加入一行

```diff
+ Plug 'mattn/emmet-vim'
```

然後記得修改後需要打指令 `:so % | PlugInstall` 安裝

## coc-emmet

coc-emmet 是個可選可不選的 coc 擴充，可以讓你不用按 emmet-vim 的快捷鍵。雖然這個擴充幾乎可以代替 emmet-vim，但是因為他依靠 coc.nvim，所以有時候他會跳不出建議，例如右括號結尾：`(p>div.title$)`，你還是只能按 emmet-vim 的快捷鍵  
這個擴充還有個問題，像是這樣的 emmet 程式碼 `(p>div.title$)*6` 用 coc.nvim 展開後用 `u` 退回，`*6` 就神奇的消失了！（也許是我設定的問題，但不是什麼大問題）  
總而言之這個擴充相當不錯，可以裝一下

## 產生標籤

emmet 最基本功能是幫你寫角括號，像是這樣  
`->` 左邊是 emmet 程式碼，右邊是根據左邊產生出來的 HTML

```html
div ->

<div></div>
```

## 內容

在標籤後面加上大括號 `{}`，大括號內的文字就會被放進標籤裡面

```html
p{hello world} ->

<p>hello world</p>
```

## 屬性

你可以幫標籤加上屬性，在標籤後面加上 `[key=value]` 就可以指定屬性。  
其中 `id` 和 `class` 因為太常用了，所以有自己專屬的縮寫，在井字號 `#` 後面的是 `id`，在點 `.` 後面的是 `class`  
而 `div` 這個標籤因為很常用，所以如果直接用井字號或是點可以不用寫 div（第三個範例）

```html
h1[hidden="hidden"] ->
<h1 hidden="hidden"></h1>

h1.title -> <hi class="title"></hi>

#username ->
<div id="username"></div>

button.bg-blue.round#login -> <button id="login" class="bg-blue round"></button>
```

## 並排

你可以用加號 `+` 讓兩個標籤並排

```html
h1+h2 ->

<h1></h1>
<h2></h2>
```

## 巢狀標籤

大於符號 `>` 代表右側的標籤在左側標籤的裡面，而且你可以一層套一層

```html
div>span ->

<div>
	<span></span>
</div>

------------ div>spam>h1>a ->

<div>
	<spam>
		<h1><a href=""></a></h1>
	</spam>
</div>

------------ div.main>h1.bg-green.bold>a ->

<div class="main">
	<h1 class="bg-green bold"><a href=""></a></h1>
</div>
```

## 群組

在建立巢狀標籤時，你也可以用小括號 `()` 來建立群組，打破原本運算子的優先度

```html
div>(h1+h2) ->

<div>
	<h1></h1>
	<h2></h2>
</div>
```

## 假內容產生

有一個運算子名稱特別奇怪，他可以幫你產生假內容，還可以加數字指定假內容要有幾個單字

```html
lorem -> Sit elit consectetur ullam eius aliquam repellat! Illo quaerat quisquam minima laboriosam fugit sunt Ex
voluptas modi laboriosam commodi optio, sapiente. Quasi perferendis aliquam reprehenderit in praesentium Deserunt
inventore natus. ------------ p>lorem4 ->

<p>Lorem sunt esse odio?</p>
```

# 結尾

今天的內容差不多就到這裡，但是 emmet 精華的部份還沒出來呢！明天今天的程式碼一行可以產生五六行，加上明天的重複、迭代後四五百行都是小 case（呃，這麼長有點誇張）
