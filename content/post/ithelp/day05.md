---
categories:
- ithelp
- pure-CLI-IDE
date: "2021-09-05"
tags:
- cli
- terminal
- software development
- vim
- tmux
- zsh
title: Day 05：是說，這個選項可以接什麼東西？autocomplete 與 auto-pair
---

今天會介紹兩個**開箱即用**（ out of box ）的外掛和簡化指令的 alias

# zsh-autocomplete

在 CLI 下指令時，有時候會**忘記選項**叫什麼、檔名中的 `k` 到底是大寫還是小寫，這時候 autocomplete 就很好用，他會幫我們選出**接下來可以填的字**，像是**選項**、**子命令**、**檔名**等等。
| ❓ > autocomplete 和 autosuggestion 有什麼不同？會同衝突嗎？ |
| :--- |
| 前者是從 completion function 中找建議，後者是從以前下過的指令中找建議，兩者不會衝突 |

## 安裝 autocomplete

托 [zplug](./day02.md#zplug) 的福，我們只需要修改 `~/.zshrc` 就可以安裝外掛了。在 `~/.zshrc` 中新增以下設定

```diff
+ zplug 'marlonrichert/zsh-autocomplete'
```

然後重新開啟終端機並安裝新增的外掛就可以了  
你會發現你現在打指令，下面都會出現一些可能可以選的選項，例如同樣開頭的指令、檔名。

> 在 [https://github.com/marlonrichert/zsh-autocomplete](https://github.com/marlonrichert/zsh-autocomplete) 有快捷鍵教學

## 設定

> 這段是我在寫完第一版後新增了，所以在 [純‧ CLI 整合開發環境](https://ithelp.ithome.com.tw/users/20130473/ironman/3975) 是沒有的

為了可以爽爽的用 autocomplete，我新增了一些設定，這些放到 `~/.zshrc` 裡面隨便一個地方就可以了

```zsh
# case sensitive
zstyle ':completion:*' matcher-list '' 'm:{a-zA-Z}={A-Za-z}' 'r:|[._-]=* r:|=*' 'l:|=* r:|=*'

# zsh-autocomplete configure
# Down arrow:
bindkey '\e[B' down-line-or-select
bindkey '\eOB' down-line-or-select
# down-line-or-select:  Open completion menu.
# down-line-or-history: Cycle to next history line.
```

這裡新增了「區分大小寫」和「方向鍵選建議」兩個功能

# zsh-autopair

這個簡單但是貼心的功能在這個 IDE 中很常見，我們的當然也不能漏掉他  
一樣修改 `~/.zshrc` 就可以安裝了

```diff
+ zplug 'hlissner/zsh-autopair'
```

重新開啟安裝後就可以享受**自動括號了**！

# alias

alias 的語法很簡單，[day02](../day02) 有提到過，我們再複習一次

```
alias a=b
```

關於 alias 有兩點要注意

-   等號 `=` **左右不能有空白**
-   如果右邊有空白，要用引號 `'`、`"` 括起來

```zsh
alias a=b    # O
alias c = d  # X
```

接下來會有我精鍊出來必備的 alias，上面的註解是關於這個 alias 解釋

```zsh
# 加上 -r 在刪除/複製目錄時才不會跳警告
alias rm='rm -r'
alias cp='cp -r'

# -h 可以把檔案大小加上適當的單位，比較好讀
# -l 印出除了檔名其他的資訊，ex：權限、大小
# -F、--color 純粹是好看
alias ls='ls -hlF --color=auto'

# 大推，這個 alias 非常好用（zsh 有類似功能的外掛可以裝，但是我覺得可以用 alias 就用 alias
alias ..='cd ../'

# 把當前目錄下的檔案/目錄以樹狀結構印出來，會把不重要的（.git, node_modules）忽略，後面可以接路徑
alias tree="tree -alI 'node_modules|.git'"

# 加上顏色
alias grep='grep --color=always'

# 超好用，在當前目錄中所有檔案中找指定字串，用法：grepFind 'console.log'，會印出檔案行號，還會把目標字串上色
alias grepFind='grep --exclude-dir=node_modules -nr . -e'

# 建立巢狀目錄時會一並建立上層目錄，下面解釋
alias mkdir='mkdir -p'
```

## mkdir -p

假設你現在在一個空目錄裡，下以下指令（沒有 alias）

```zsh
mkdir src/user
```

你會得到 `mkdir: 無法建立 「src/user」 目錄: 沒有此一檔案或目錄`，這是因為 `mkdir` **找不到** `user` 的**上層目錄** `src`，這時候加上 `-p` 就不一樣了，因為 `-p` 會讓 `mkdir` 在上層目錄不存在時**自動建立**，因此 `mkdir src/user` 就會成功，不會再跳錯誤

# 預告

到今天關於 zsh 的介紹就結束了，明天開始會來講講終端機管理神器 tmux
