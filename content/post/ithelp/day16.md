+++
title = "Day 16：自動補全！coc.nvim"
date = "2021-09-16"
tags = [
  "cli",
  "terminal",
  "software development",
  "vim",
  "tmux",
  "zsh"
]
categories = [ "ithelp", "pure-CLI-IDE" ]
+++

一個好的自動補全工具可以讓你工作效率翻倍，你不用再去查文件了，自動補全不僅可以告訴你這裡有什麼函數可以用，還會告訴你參數的型態、函數功能的說明，可以說是把文件都寫在 vim 裡面了。  
以前我用的自動補全是 [You Complete Me(YCM)](https://github.com/ycm-core/YouCompleteMe)，現在我選擇使用 [coc.nvim](https://github.com/neoclide/coc.nvim) 原因是他提供更多的補全來源、外掛和設定，而且可以用 nodejs 自製外掛，據說所有純 JS 寫的 VS code 外掛都可以裝（這個我沒實驗過，只是傳聞）。關於這兩個自動補全外掛的比較礙於篇幅請自行 Google。

# 安裝

coc.nvim 和一般的 vim 外掛一樣，都是用 vim-plug 安裝就可以了，在 `~/.config/nvim/plugin.vim` 中新增以下設定

```vim
Plug 'neoclide/coc.nvim', {'branch': 'release'}
so ~/.config/nvim/coc-config.vim
```

因為 coc 有很多設定，為了避免檔案太雜亂我把 coc 相關的設定移到另一個檔案，就像我們在 [前天](../day14/#%E5%88%87%E5%88%86-vimrc) 做得一樣  
接下來建立 `~/.config/nvim/coc-config.vim`，不然等等載入設定檔 vim 會報錯

```vim
:!touch ~/.config/nvim/coc-config.vim
```

> `:! {cmd}` 可以執行外部命令

接下來存檔安裝

```vim
:w | PlugInstall
```

跑完後，重開 vim，coc 就裝好了

# lsp 語言伺服器協定

在講 coc 之前必須先講 Language Server Protocol，簡稱 lsp，中文是「語言伺服器協定」。lsp 做的事是提供自動補全和 go to def，能做到這兩個功能的原因是因為 lsp 懂程式碼，他知道你寫的每個字代表什麼。為什麼 lsp 這麼強呢？因為 lsp 什麼都不懂，他把所有事情丟給 language server 處理，所以只要你有裝 language server，那麼 lsp 什麼語言都懂。  
這麼神奇的 lsp 就是大名鼎鼎的 vs code 提出的（難怪是最多人用的編輯器），我們深耕 45 年的 vim 當然要跟上，所以 coc.nvim 出現了，他是一個 vim 的 language client，而重點是非常好用！

# 安裝 coc 擴充

剛剛說了 coc 的主要功能是把所有事情丟給別人做，那麼這個「人」設定聽起來就很麻煩，所以 coc 有個好主意，用擴充（ extension ）解決！你只要裝好擴充差不多就設定好 lsp 了  
coc.nvim 的自動補全選字來源除了目前所有的 buffer（開啟的檔案）之外，還有 coc 擴充。  
coc 擴充安裝很簡單，在 vim 裡面下指令 `:CocInstall {extension}`，那麼這個擴充的名字該去哪裡找呢？一個是 [coc.nvim 的 GitHub Wiki](https://github.com/neoclide/coc.nvim/wiki/Using-coc-extensions#implemented-coc-extensions)，另一個是去 [npm](https://npmjs.org) 搜尋 `coc`，稍微過濾一下大部分都是 coc.nvim 的擴充。

剛剛講的安裝方法有一個缺點，就是當你今天要搬電腦時你要全部手動再安裝一次，這時候就有點麻煩了。所以你可以在 `~/.config/nvim/coc-config.vim` 中寫下我們第一個 coc 設定

```vim
let g:coc_global_extensions = [
\ 'coc-extension-1',
\ 'coc-extension-2'
\ ]
```

這個變數儲存的是 coc 擴充的名字（就是你安裝時用的那個），coc 啟動如果沒安裝他就會自己去裝了，所以手動安裝好擴充後記得在這裡寫一下，為以後搬電腦做打算  
你也可以用 `:CocList extensions` 列出現在安裝的擴充  
至於要裝什麼擴充，這個就要看你要寫什麼程式語言了，自己去上面介紹的兩個地方找你需要的，我這裡就不多介紹

# 基本設定

因為 coc 可能是你在寫程式時最常用的外掛，所以為了避免有快捷鍵衝突，coc 預設不會有任何的按鍵綁定，所以你必須自己寫全部的 keymap，在 [coc.nvim 的 GitHub README.md](https://github.com/neoclide/coc.nvim#example-vim-configuration) 有範例，接下來的設定都是從這裡面挑出來的。  
以下是我覺得必須的設定，我會把註解翻成中文，有些在範例上標明「可能」、「某些情況」的設定我不會納進來，當你遇到奇怪問題時再去看看範例和 issue

```vim
" 太長的更新間隔會導致明顯的延遲並降低使用者體驗（預設是 4000 ms = 4s ）
set updatetime=300

" 永遠顯示 signcolumn（行號左邊那個，這我不知道怎麼翻），否則每當有診斷出來時整個程式碼就會被往右移
if has("nvim-0.5.0") || has("patch-8.1.1564")
  " 新的版本可以把 signcolumn 和行號合併（這個我版本不夠沒看過，有人知道會長怎樣可以下面留言嗎？）
  set signcolumn=number
else
  set signcolumn=yes
endif

" 用 tab 鍵觸發自動補全
" 注意：載入設定後記得用命令 `verbose imap <tab>` 確定這沒有被其他外掛覆蓋掉
inoremap <silent><expr> <TAB>
	\ pumvisible() ? "\<C-n>" :
	\ <SID>check_back_space() ? "\<TAB>" :
	\ coc#refresh()
inoremap <expr><S-TAB> pumvisible() ? "\<C-p>" : "\<C-h>"

function! s:check_back_space() abort
	let col = col('.') - 1
	return !col || getline('.')[col - 1]  =~# '\s'
endfunction

" 讓 enter 鍵自動完成第一個建議並讓 coc 進行格式化（不確定個格式化指的是什麼，我看不太出來）
" enter 可以被重複 keymap（看不懂就算了，意思是你亂搞不會出錯）
inoremap <silent><expr> <cr> pumvisible() ? coc#_select_confirm()
	\: "\<C-g>u\<CR>\<c-r>=coc#on_enter()\<CR>"

" 用 \rn 重新命名變數、函數（原文寫「符號」）
nmap <leader>rn <Plug>(coc-rename)

" 這個讓你可以捲動浮動視窗和跳出式框框（有時候自動補全給你的文件會太長超出螢幕，如果你想要看下面的內容必須設定這個）
if has('nvim-0.4.0') || has('patch-8.2.0750')
  nnoremap <silent><nowait><expr> <C-f> coc#float#has_scroll() ? coc#float#scroll(1) : "\<C-f>"
  nnoremap <silent><nowait><expr> <C-b> coc#float#has_scroll() ? coc#float#scroll(0) : "\<C-b>"
  inoremap <silent><nowait><expr> <C-f> coc#float#has_scroll() ? "\<c-r>=coc#float#scroll(1)\<cr>" : "\<Right>"
  inoremap <silent><nowait><expr> <C-b> coc#float#has_scroll() ? "\<c-r>=coc#float#scroll(0)\<cr>" : "\<Left>"
  vnoremap <silent><nowait><expr> <C-f> coc#float#has_scroll() ? coc#float#scroll(1) : "\<C-f>"
  vnoremap <silent><nowait><expr> <C-b> coc#float#has_scroll() ? coc#float#scroll(0) : "\<C-b>"
endif
```

# 結尾

coc.nvim 的設定真的很多，一眼看上去會覺得很煩，但是認真看完設定好後的 vim 真的會讓你過得非常舒服。  
明天是我今天沒有介紹到的部份，大部份是超難記的快捷鍵。一樣都會有全中文翻譯（但是有些我真的沒用過，只能硬著頭皮翻譯了）
