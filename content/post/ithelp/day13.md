---
categories:
- ithelp
- pure-CLI-IDE
date: "2021-09-13"
tags:
- cli
- terminal
- software development
- vim
- tmux
- zsh
title: Day 13：vim 設定檔
---

vim 在啟動時，都會去**執行你的設定檔**，這個檔案**根據你的 vim 軟體不同而改變**，如果是一般的 vim，那他會去讀 `~/.vimrc`，如果是 neovim(nvim)，他會去找 `~/.config/nvim/init.vim`。在接下來的文章中都以 `vimrc` 代指。  
`vimrc` 內容是 vimscript，也就是所有的冒號命令**去掉冒號之後的內容**，例如有個命令是 `:set nu`，這個命令可以開啟行號顯示，如果要寫在 `vimrc` 裡面，就要寫成 `set nu`。

# vimrc

通常我們會在 `vimrc` 中設定關於 vim 的**外觀**、**行為**、**載入外掛**等等，接下來是我用多年的 vimrc 的內容，我會一個一個用註解解說他們的用處(雙引號 `"` 開頭是 vimscript 的註解)

```vim
" 打開語法突顯
syntax on

" load plguin
" install vim-plug:
" sh -c 'curl -fLo "${XDG_DATA_HOME:-$HOME/.local/share}"/nvim/site/autoload/plug.vim --create-dirs \
"        https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim'
" 這個是明天的東西，先註解掉，才不會出錯
" so ~/.config/nvim/plugin.vim

" 256 色
set t_Co=256
" 解決和 tmux 衝突，https://vi.stackexchange.com/questions/238/tmux-is-changing-part-of-the-background-in-vim
set t_ut=
" 選一個你喜歡的 colorschema
" available color schema
" blue darkblue default delek desert elflord evening industry koehler
" morning  murphy pablo peachpuff ron shine slate torte zellner
colorscheme koehler

" 雜項設定，詳細解說請用 `:help <opeion>`，例如 `:help showcmd`
set showcmd
set nu
set tabstop=4
set shiftwidth=4
set autoindent
set nowrap
set incsearch
set autoindent
set cindent
set smartindent
set cursorline
" make lightline work in single screen
" https://github.com/itchyny/lightline.vim/issues/71#issuecomment-47859569
set laststatus=2
" 開啟滑鼠功能，對初學者來說非常好用
set mouse=a

" markdown
" 如果是檔案類型是 markdown 或 text，打開文字折疊（超出螢幕寬度會折到下一行）
" au 的語法等等會講
au FileType markdown set wrap
au FileType text set wrap

" ejs
" 不加這個的話 ejs 的語法突顯會很奇怪，順便附帶一個 ft, filetype 的坑
" https://vi.stackexchange.com/questions/16341/what-is-the-difference-between-set-ft-and-setfiletype
au BufNew,BufNewFile,BufRead *.ejs :set filetype=ejs
au FileType ejs set syntax=html

" ts
" 這只是因為我比較喜歡 vim 對 javascript 的配色，typesript 的我覺得很醜，所以強制 vim 用 javascript 的配色
" au 就是 autocmd 的縮寫啦！（vim 幾乎每個超過三個字的命令、選項都有縮寫，寫程式的人都很懶XD）
autocmd BufNewFile,BufRead *.ts set syntax=javascript

" yaml
" yaml 機車的空格限制，這樣在寫 yaml 檔時比較方便
autocmd FileType yaml setlocal ts=2 sts=2 sw=2 expandtab

" hotkey
" 這邊是自訂快捷鍵，語法等等會講，這邊只說明用法
" 在命令模式按 <tab> 會把整行字向右移一個 tab。<S-tab> 會移回來
map <tab> :s/^/\t<CR>
map <S-tab> :s/^\t/<CR>
"  如果要從系統剪貼簿貼上多行程式碼，建議這樣用，才不會被 vim 的自動縮排雷到（你試試就知道是什麼問題，很討厭）
nmap <F3> :r! cat<CR>
" 切換行號，在複製到系統鍵貼簿時很好用，這樣就不會複製到行號
nmap <F7> :set invnumber<CR>
" 清除搜尋結果的語法突顯
nmap cs :noh<CR>

" alias
" 冒號命令的別名，語法等等會講
" 常用就知道為什麼要設這個（按冒號時要按 <shift>，然後下一個字就很常變大寫，簡稱手殘）
command W w
command Q q
command Wq wq
command WQ wq

" fix bg color error in Pmenu
" 這個只是顯示問題，有時候背景色和前景色一樣你就看不到字了，所以要自己把他換掉，語法等等會講
" https://vi.stackexchange.com/questions/23328/change-color-of-coc-suggestion-box
hi Pmenu ctermbg=black ctermfg=white
hi Ignore ctermbg=black ctermfg=lightblue
```

## command

我們從最簡單的命令別名講起，這個命令可以縮寫成 `com`  
這個命令可以定義 **「使用者自訂命令」**  
使用者自訂命令一定要是**大寫**開頭

### 列出命令

`:verbose com [cmd]`
這個可以列出符合 `[cmd]` 的使用者自訂命令，還有**最後定義的位置**

### 定義新的使用者自訂命令

`:commmand {cmd} {rep}`
這個會設定 `{cmd}` 的別名 `{rep}`

## autocmd

autocmd 是在某種類型的檔案載入時自動執行命令用的，可以縮寫成 `au`  
au 的使用場景通常是某個類型的語法突顯會出問題、想要根據檔案類型套用不同設定，簡單的語法如下  
`au [條件] [...命令]`  
條件通常長這樣， `FileType javascript`  
命令就是冒號命令除了冒號的部份

## map

map 的功能是定義不是冒號開頭的命令（像是 `dd` 這種，在前幾篇文章中稱為快捷鍵），map 又根據作用的模式分為 `nmap`、`vmap`、`imap` 等等非常多種（`:help map` 會列出所有 map ）。其中最常用的是 `map`、`nmap`、`imap`，這三個分別代表在「除了編輯模式中作用」、「命令模式（ n ）作用」、「在編輯模式作用（ i ）」。  
各種 map **用法都一樣，差別只在作用模式不同**

### 列出 map

```vim
:map
:nmap
:imap
```

### 定義 map

`map {快捷鍵} {命令}`  
{快捷鍵} 是 vim 的按鍵組合，其中 `imap` 用的大多都要加 <Ctrl> 或是 <leader>，否則會沒用
{命令} 是 vim 的命令，注意這裡講的是「廣義的命令」，也就是包括冒號和非冒號命令，所以如果是冒號命令你必須加上冒號和 enter 鍵才會執行  
ps: map 給我的感覺有點像「當你按下 {快捷鍵} 時，vim 會自動幫你打 {命令}

#### 快捷鍵

快捷鍵可以是不只一個按鍵，可以像是以下幾個範例

```
<leader>f
<C-y>k
ggk
```

如果一個按鍵可以打出來，像是`a`、`b`、`c`、`0`、`1`、`2`、`+`、`=`，就不用角括號 `<>`  
如果是控制按鍵或是和控制按鍵一起按，就要加上括號，例如 `<C-y>`、`<leader>`，其中是指 <leader> 是反斜線
更多這種按鍵的說明可以參考 `:help key-notation`

#### 命令

這邊的命令因為是廣義的命令，所以如果你想要幫某個快捷鍵加上別名也是可以的

```vim
nmap copy yy
nmap paste p
```

嗯......這可能只在快捷鍵很常出現但是複雜時比較好用  
扯遠了，回到正題。如果你的命令是冒號命令的話，你必須要加上冒號和 enter，不然你在打完快捷鍵之後還要自己按 enter，所以記的在命令最後面加上 `<CR>` ，這個代表的是 enter 鍵，<Enter> 也可以
