+++
title = "Day 15：vim 外掛大雜燴！"
date = "2021-09-15"
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


看到這裡，你可能還是很疑惑，到底 vim 好用在哪？嘿嘿，那是因為強大的外掛還沒裝啦！網路上會有一些配好一堆外掛的，像是 [spaceVim](spacevim.org)，他們的策略和 vs code 很像，先幫你裝好一對外掛，讓你隨開及用。這樣做好處是初學者比較愛，但是常常會裝了一堆用不到的功能，反而讓載入速度、記憶體用量大增。  
所以我們自己挑我們需要的外掛裝起來，效果完全不會輸 vs code 這些笨重的編輯器！  
今天要介紹很多模組，都是我選出來製作一個現代化 IDE 必備的模組，相當的精華，一起來看看吧！
記得修改後需要打指令 `:so % | PlugInstall`  

# 現代化 IDE 必裝模組
以下的內容直接貼到 `~/.config/nvim/plugin.vim` 裡面裝模組的地方就可以了，說明附在裡面了  
注意：我這裡沒有列出  Coc.nvim，因為我把他拉出來到另外一章了  

```vim
" 彩色的 status bar
Plug 'itchyny/lightline.vim'
"  有這個設定 lightline 在單個 vim 視窗中才會正常，沒錯！vim 也可以分割視窗，後天會講
set laststatus=2

" 在行號左側會顯示這行的 git 狀態，新增、刪除、修改，詳細請看 GitHub README
Plug 'airblade/vim-gitgutter'

" 按下 <F5> 可以開啟檔案樹，按 h 有說明，再一下關掉說明
Plug 'scrooloose/nerdtree'
nmap <F5> :NERDTreeToggle<CR>
" Exit Vim if NERDTree is the only window left.
autocmd BufEnter * if tabpagenr('$') == 1 && winnr('$') == 1 && exists('b:NERDTree') && b:NERDTree.isTabTree() |
			\ quit | endif

" 自動括號
Plug 'jiangmiao/auto-pairs'
" 這是自訂括號的寫法
au FileType ejs let b:AutoPairs = AutoPairsDefine({'<%': '%>', '<!--': '-->'})
au FileType html let b:AutoPairs = AutoPairsDefine({'<!--': '-->'})

" 之前講過了，這邊附上一些設定
Plug 'preservim/nerdcommenter'
filetype plugin on
" Add spaces after comment delimiters by default
let g:NERDSpaceDelims = 1
" Use compact syntax for prettified multi-line comments
let g:NERDCompactSexyComs = 1
" Align line-wise comment delimiters flush left instead of following code indentation
let g:NERDDefaultAlign = 'left'
" Set a language to use its alternate delimiters by default
let g:NERDAltDelims_java = 1
" Add your own custom formats or override the defaults
let g:NERDCustomDelimiters = { 'c': { 'left': '/**','right': '*/' } }
let g:NERDCustomDelimiters = { 'ejs': { 'left': '<!--','right': '-->' } }
" Allow commenting and inverting empty lines (useful when commenting a region)
let g:NERDCommentEmptyLines = 1
" Enable trimming of trailing whitespace when uncommenting
let g:NERDTrimTrailingWhitespace = 1
" Enable NERDCommenterToggle to check all selected lines is commented or not
let g:NERDToggleCheckAllLines = 1

" 按 <F6> 可以回朔到開啟檔案以來的任何歷史，還會標出修改的地方，很酷
Plug 'mbbill/undotree'
nnoremap <F6> :UndotreeToggle<CR>

" <F8> 看看你設定了哪些變數、函數，也可以快速跳轉
Plug 'majutsushi/tagbar'
nmap <F8> :TagbarToggle<CR>

" 用 <反斜線 f> 可以整理程式碼（要裝 python3 和 pynvim，詳細請看 GitHub ）
" $ python3 -m pip install pynvim
Plug 'Chiel92/vim-autoformat'
" 這裡指定成你的 python3 路徑
let g:python3_host_prog="/usr/bin/python3"
nmap <leader>f :Autoformat<CR>

" 在你開啟 markdown 文件時會開啟網頁預覽你的 markdown，有雙螢幕或是把畫面讓一半給瀏覽器比較好用（需要裝 nodejs）
" $ npm -g install instant-markdown-d
Plug 'suan/vim-instant-markdown', {'for': 'markdown'}

" 快速整理程式碼，這個外掛的功能超多，但是因為有 autoformat 所以我只用排 md 表格的功能，他可以幫你把垂直線對齊，舒舒服服，要深入使用請看 GitHub README
" 先用選取模式把表格選起來，按兩下反斜線就可以得到一個漂亮的表格
Plug 'junegunn/vim-easy-align'
" Align GitHub-flavored Markdown tables
au FileType markdown vmap <Leader><Bslash> :EasyAlign*<Bar><Enter>

" 快速建立 html tag，用法非常靈活，明天會專門講他的用法
Plug 'mattn/emmet-vim'
```

如果對某個模組好奇，最快的方式就是去 GitHub 頁面看看，通常作者都會有很詳細的說明。

# 語法外掛
有些時候 vim 對於某些程式語言的支援不是那麼好，常會有語法突顯有問題或是 vim 根本沒有支援這個語言的語法突顯。這時候裝一個語法外掛就可以讓 vim 立刻學會這門新語言（真好，我學了十年英文還是學不好）  
語法外掛做得事其實就是修正在 [第 12 天](../day12) 提過的 highlight group，讓 vim 可以正確的分析你的程式碼  
nvim 0.5 版有個新功能叫做 treesitter，他的功能好像和這個有關，但我沒還用過，我也不清楚  
以下是我用過得語法外掛，除非你也剛好需要不然其實不用安裝，如果你想要的某個語法外掛不在這裡面，你可以 Google 搜尋 `vim + 程式語言名稱 + syntax` 通常都會查到  

```vim
" docker file
Plug 'ekalinin/Dockerfile.vim'

" js / jsx / ts
Plug 'pangloss/vim-javascript'

Plug 'isruslan/vim-es6'

Plug 'maxmellon/vim-jsx-pretty'
" fix jsx tag color for vim-jsx-pretty
hi link jsxPunct Directory
hi link jsxCloseString Directory

Plug 'HerringtonDarkholme/yats.vim'

" css
" 這個外掛很酷，他會把表示顏色的字串，像是 `black`、`#991122` 標上他們的顏色，雖然因為終端機顏色數量的問題可能不會很準，但是可以讓你一眼就看出 `#fbcd48` 是橘黃色
Plug 'ap/vim-css-color'

" c / cpp
Plug 'bfrg/vim-cpp-modern'

" toml
Plug 'cespare/vim-toml'
```

