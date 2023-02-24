+++
title = "Solarized"
slug = ""
date = 2022-06-15T17:09:18+08:00
tags = ['vim', 'colorscheme']
categories = ['linux', 'vim']
+++

# Solarized

[solarized](https://ethanschoonover.com/solarized/) 是一個文字界面常見的配色方案，不僅是用在 vim，大多數 terminal 和 editor 也都支援

## install

加入 ```vim
Plug 'ericbn/vim-solarized'

````
然後安裝

## transparent background
因為設定關係，所以如果你的終端機有設定透明背景，在 vim 中會全部變不透明，載入[這個設定](https://gist.github.com/fuadnafiz98/d91e468c9bc4689868eb0984a29fef66)就可以解決，你也可以放在另外檔案再引入
```vim
" https://gist.github.com/fuadnafiz98/d91e468c9bc4689868eb0984a29fef66
" for transparent background
function! AdaptColorscheme()
	highlight clear CursorLine
	highlight Normal ctermbg=none
	highlight LineNr ctermbg=none
	highlight Folded ctermbg=none
	highlight NonText ctermbg=none
	highlight SpecialKey ctermbg=none
	highlight VertSplit ctermbg=none
	highlight SignColumn ctermbg=none
endfunction
autocmd ColorScheme * call AdaptColorscheme()

highlight Normal guibg=NONE ctermbg=NONE
highlight CursorColumn cterm=NONE ctermbg=NONE ctermfg=NONE
highlight CursorLine cterm=NONE ctermbg=NONE ctermfg=NONE
highlight CursorLineNr cterm=NONE ctermbg=NONE ctermfg=NONE
highlight clear LineNr
highlight clear SignColumn
highlight clear StatusLine


" Change Color when entering Insert Mode
autocmd InsertEnter * set nocursorline

" Revert Color to default when leaving Insert Mode
autocmd InsertLeave * set nocursorline

"" extra settings, uncomment them if necessary :)
"set cursorline
"set noshowmode
"set nocursorline

" trasparent end
````
