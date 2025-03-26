---
title: Day 04：金魚記憶力太短暫，交給外掛記吧！autosuggestions 與 sugstring-search
slug: day04
date: '2021-09-04T00:00:00.000Z'
tags:
  - cli
  - terminal
  - software development
  - vim
  - tmux
  - zsh
categories:
  - ithelp
  - day04
---

今天的內容會比平常多，但是非常紮實！

有時候我們在 CLI 操作時遇到很多**重複**的指令，像是 `git add`、`git commit -m 'ba la ba la'` 等等，這些指令可能又長又複雜，一直都是自己打也不是辦法，這時候就該請出 [autosuggestions](https://github.com/zsh-users/zsh-autosuggestions) 了

# 安裝 autosuggestions

老樣子，安裝外掛只須要修改 `~/.zshrc` 就可以了

```diff
# plugins
zplug 'romkatv/powerlevel10k', as:theme, depth:1
+ zplug 'zsh-users/zsh-autosuggestions'
```

因為 `autosuggestions` 是外掛，不需要特別寫 tag 了

## [問題]好像有奇怪的字跑出來？

寫好之後重開終端機，按下 <kbd>enter</kbd> 你可能會發現跳出了一堆東西，這是因為你開啟了 p10k 的 Instant Prompt Mode，這個雖然會讓你的終端機跑起來比較順（官方說的，我感覺不出來），但是在 zsh 載入完成之前就不能有任何字輸出。  
可是你看看，如果我們新增了一個外掛，zplug 會跳出來問我們是否要安裝，這時後 Instant Prompt Mode 就出來抱怨了。  
這個問題的解決方法直覺上有兩個，一是關掉 Instant Prompt Mode，二是讓 zplug 先不要吵

### 關掉 Instant Prompt Mode

關掉 Instant Prompt Mode 很簡單，重新設定一次 p10k 就好了，在設定程式問你是否要開啟 p10k 時選擇 `(3) Off`，這樣下次安裝外掛就不會有奇怪的警告訊息跳出來了。

### 讓 zplug 先閉嘴

如果你覺得 Instant Prompt Mode 很重要，需要保留，那你可能會想到這個方法  
在 `~/.zshrc` 中有一行 `zplug load`，這行會讓 zplug 在 `~/.zshrc` 載入時偵測是否要安裝新外掛，把這行拿掉再重新開啟終端機，以後他就不會自動檢查了  
這時候如果你要安裝新外掛，一樣是修改 `~/.zshrc` 之後重開終端機，**手動**下指令 `zplug load`，zplug 就會開始檢查更新。

### 有沒有兼得的方法呢？

以上兩種方法都是治標不治本，其實 `~/.zshrc` 裡面已經有寫解決辦法了，看看 `~/.zshrc` 最上面的註解，這是設定 p10k 時如果你有開啟 Instant Prompt Mode 他幫你加的

```shell
# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.zshrc.
# Initialization code that may require console input (password prompts, [y/n]
# confirmations, etc.) must go above this block; everything else may go below.
```

他說如果載入過程中會有輸出，像是問 y/N 之類的，要放到這段前面  
所以我們只需要把 zplug 搬到最前面就可以了，現在 `~/.zshrc` 長這樣

```
source ~/.zplug/init.zsh

# plugins
zplug 'romkatv/powerlevel10k', as:theme, depth:1
zplug 'zsh-users/zsh-autosuggestions'

if ! zplug check --verbose; then
	printf "Install? [y/N]: "
	if read -q; then
		echo; zplug install
	fi
fi

zplug load

# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.zshrc.
# Initialization code that may require console input (password prompts, [y/n]
# confirmations, etc.) must go above this block; everything else may go below.
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi
# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh
```

# [問題]為什麼按 <kbd>方向鍵上</kbd> 時會出現和現在指令開頭不同的字

假設你現在打過以下指令

```
$ ls /home/purecli
$ cat ~/.zshrc
$ ls /
```

這時候你先打 `ls`，想找到之前 `ls` 開頭的指令按，按 <kbd>方向鍵上</kbd> 會出現 `cat ~/.zshrc` 呢？這是因為現在的 <kbd>方向鍵上</kbd> 是 zsh 本身的「上一個指令」。  
這個問題需要裝另一個外掛來解決：[zsh-users/zsh-history-substring-search](https://github.com/zsh-users/zsh-history-substring-search)  
在 `~/.zshrc` 新增一行

```diff
# plugins
zplug 'romkatv/powerlevel10k', as:theme, depth:1
zplug 'zsh-users/zsh-autosuggestions'
+ zplug 'zsh-users/zsh-history-substring-search'
```

然後要綁定按鍵，一樣是放在 `~/.zshrc`，位置隨便

```zsh
bindkey "$terminfo[kcuu1]" history-substring-search-up
bindkey "$terminfo[kcud1]" history-substring-search-down
```

**重開終端機**後就可以搜尋同樣開頭的指令紀錄了

# [問題]為什麼開新的終端機 autosuggestions 讀不到以前下過得指令？

這是因為我們的 `~/.zshrc` 中沒有設定把 history 存下來，所以 autosuggestions 只能拿到**目前這個終端機**的紀錄，一關掉紀錄就不見了，autosuggestions 自然找不到。  
要解決也很簡單，讓他把 history **寫進檔案**就好了，在 `~/.zshrc` 中任意地方新增這兩行

```zsh
SAVEHIST=1000
export HISTFILE=~/.zsh_history
setopt share_history
```

這樣 autosuggestions 就可以讀到以前下過的指指令了

# 結尾

今天介紹了好用的 autosuggestions 和 zplug 與 p10k 設定衝突的解決方法。  
不的不說 autosuggestions 真是懶人福音，打過的指令不用再打第二次  
明天再介紹兩個外掛後就 zsh 的部份就差不多完結了，緊接著會進入精彩的 tmux
