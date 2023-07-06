---
categories:
- ithelp
- pure-CLI-IDE
date: "2021-09-14"
tags:
- cli
- terminal
- software development
- vim
- tmux
- zsh
title: Day 14：vim-plug
---

前面講過了 zsh、tmux 的 plugin manager，vim 一樣有 plguin manager。跟前面幾個 plguin manager 很像，要安裝新的外掛只需要在某個地方加一行設定就好，這樣作的好處是哪天要再建立新的環境時只需要把設定檔帶走，而且集中式的管理可以一目了然。

# 安裝 vim-plug

記得昨天的 vimrc 最上面有一個備註解起來的區塊嗎？這就是載入 vim-plug 的地方，裡面就有安裝 vim-plug 的指令了。要注意你用的是 neovim 還是 vim，這兩個路徑不一樣

```zsh
# neovim
sh -c 'curl -fLo "${XDG_DATA_HOME:-$HOME/.local/share}"/nvim/site/autoload/plug.vim --create-dirs \
        https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim'
# vim
sh -c 'curl -fLo "${XDG_DATA_HOME:-$HOME/.local/share}"/nvim/site/autoload/plug.vim --create-dirs \
       https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim'
```

挑選你的 vim 版本，執行完就安裝好了！

# 安裝第一個 plugin

我們透過一個範例來說明如何安裝外掛，我們要來裝的第一個外掛是 `preservim/nerdcommenter`，這個外掛可以快速註解一行/一整段程式碼，這是我覺得比自動補全、語法突顯都還要好用的功能。現在我們來安裝吧！

## 1. 編輯 vimrc

打開你的 vimrc，把以下內容加在最下面

```
call plug#begin('~/.vim/plugged')

call plug#end()
```

以後所有 plugin 的安裝設定就要放在這兩行裡面

## 加上 `preservim/nerdcommenter`

現在在兩個 `call` 中間插入以下這行

```
Plug 'preservim/nerdcommenter'
```

然後存檔，這樣就算設定好了

## 安裝套件

現在在 vim 裡面下以下命令

```vimscript
:so %
:PlugInstall
```

第一個是讓 vim 載入新增的外掛列表，或是你重開 vim 也可以。其中 `so` 是 `source` 的縮寫  
這個命令會讓 vim-plug 檢查有沒有新增的外掛，然後安裝。等左邊的視窗都跑完了就可以按 `q` 關掉，這時候重開 vim 就安裝好外掛了！

# 使用 `preservim/nerdcommenter`

這裡簡單教一下怎麼使用這個方便的外掛
用 <kbd>\\</kbd><kbd>c</kbd><kbd>space</kbd> 可以註解/取消註解游標所在這這行。
如果用 <kbd>v</kbd> 選取的話，只要有選到的行（不論是否完整框起），<kbd>\\</kbd><kbd>c</kbd><kbd>space</kbd> 就可以一次註解/取消註解多行  
再按的時候要注意，如果手滑沒按到反斜線會讓 vim 以為你要執行 `c` 指令，<kbd>c</kbd><kbd>space</kbd> 會把一個字刪掉並進入編輯模式，這時候你可以選擇手動把字加回去或是用 `u` undo 指令來回復，回復好了之後再重新按一次 <kbd>\\</kbd><kbd>c</kbd><kbd>space</kbd> 就可以了。

在 `preservim/nerdcommenter` 的 [github 頁面](https://github.com/preservim/nerdcommenter#default-mappings) 有更多的快捷鍵說明，這邊就介紹我最常用也是唯一有在用的，其他如果你覺得不錯再自己記就好了，vim 的快捷鍵/命令貴在精不在多，多了反而容易忘

# 關於外掛的設定

在 `preservim/nerdcommenter` 的 README.md 中提到，要加一條設定 `filetype plugin on` 才能確保在不同程式語言中正常運作，那這行要加在哪裡比較好呢？以 vim 的觀點來看，vimrc 中任何地方都可以，但是外掛一多你就會發現亂放的話會不好管理。我推薦一個地方——安裝外掛的下面一行開始，這樣不同的外掛的設定就會都分開，萬一哪一天要修改或是移除都很清楚。

# 切分 vimrc

外掛裝多了 vimrc 就會變得很長，一堆不重要不常用的外掛設定會全部塞在同一個檔案裡面。我們可以根據功用的不同分開放在不同的檔案，如此一來就會比較好找相關的設定在哪裡  
我們先把

```
call plug#begin('~/.vim/plugged')

Plug 'preservim/nerdcommenter'
filetype plugin on

call plug#end()
```

這段剪下，放到另一個檔案裡面，然後在 vimrc 最下面加上一行 `so ~/.config/nvim/plugin.vim` 或是 `so ~/.vim/plugin.vim`（根據你的 vim 不同路徑不同，前面 nvim 後面 vim）
，以下是 vim 的按鍵操作，角括號中的是特殊按鍵  
先用 `S-v` 把要剪下的段落選起來

```
doso ~/.config/nvim/plguin.vim<esc>:w<enter>
// 這裡 vimrc 的操作就結束了，`d` 是剪下，`o` 是「在新增一行並進入編輯模式」，之後到 <esc> 之前的就是新增的內容，最後再儲存

:e ~/.config/nvim/plugin.vim<enter>p:w<enter>
在這裡用 `:e` 開啟檔案，`p` 貼上剛剛剪下的內容，`:w` 存檔
```

之後你要外掛相關的設定就不是在 vimrc 了，而是在 plugin.nvim 裡面，記得如果要備份的話要把這個檔案也備份到喔

# 結尾

今天的內容穿插了一些 vim 的指令，如果很難理解的話建議你要一個字母一個字母拆開看，為什麼呢？例如 `ddo` 這個指令，你以為可能是要「做（do）」什麼事，其實這是 `dd` 和 `o` 一起寫，意思是「剪下一行」再「新增一行並進入編輯模式」。
