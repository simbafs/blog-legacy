---
title: bash completion
slug: bash-completion
date: '2020-11-14'
tags:
  - bash
  - completion
categories:
  - linux
  - bash
image: /og/linux/bash/bash-completion.png
---

# Bash Completion

## 需求

今天寫了一個 bash script 幫我管理 mongodb docker，在使用的時候一些子命令，像是 `up`、`down`、`clean`。我希望可以讓 bash 當我自動補齊這些選項。

## `bash_completion`

`bash_completion` 是一個可以幫我們做程式化補齊的工具，像是 git 就有使用到這個工具，在 commit、push 的時候按 tab 都會顯示出當下我們可以用的東西，像是 `git push<tab><tab>` 就會自動補齊 `origin` 而不是給我們看檔案（bash 預設只會補齊檔案和命令）。我們這次只須要用基本的 `complete` 就可以了

## `complete`

`complete` 可以幫命令加上簡單的自動完成，其實 `bash_completion` 也是去呼叫這個命令來達成自動補齊。`complete` 傻用非常簡單，像下面這樣就可以幫 `mongodb` 這個命令加上自動補齊

```bash
complete -W "up down clean" mongodb
```

`-W` 選項代表後面是字詞列表，用 `-F` 後面可以接一個函數，但是這個我沒研究，也許下一個專案就是研究 `complete` 也說不定。
