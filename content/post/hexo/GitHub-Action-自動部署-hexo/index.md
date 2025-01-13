---
title: GitHub Action 自動部署 hexo
slug: GitHub-Action-自動部署-hexo
date: '2020-08-16T00:00:00.000Z'
tags:
  - hexo
  - github
  - github-action
  - CI/Cl
categories:
  - hexo
image: /og/hexo/GitHub-Action-自動部署-hexo.png
---

# 前言

本來部署 hexo 都是手動下指令，但是這樣在手機上因為沒辦法裝 hexo ,所以一直不能在手機上寫文章。剛好想到 GitHub Action 可以滿足我的需求，上網查了一下資料發現蠻多人有和我一樣的需求，這次參考的是 [owlran 大大的文章](https://owlran.github.io/2020/04/26/hexo-blog-github-action/)。

# ssh key

因為要部署到 GitHub repo，最方便的方法當然是 ssh key 啦。

## ssh-keygen

首先隨便找個資料夾產生一組 ssh key

```
ssh-keygen -f deploy-key
```

## GitHub

再來要讓 GitHub 知道你的 ssh key（public/secret 都要）

### public key

public key 是要放在你的 `<username>.github.io` 的 repo 下

> <username>.ggithub.io -> settings -> Deploy keys -> add deploy key

新增一個 ssh key，名字叫 `DEPLOY_KEY_PUB`  
把 `depoly-key.pub` 的內容貼上，記得下面的勾勾（Allow write access ）要選起來

### secret key

secret key 要放在你存放部落格檔案的 repo，owlran 大大是放在同一個 [repo](https://github.com/owlran/owlran.github.io) 不同 branch，我是放在兩個不同 repo，其中放部落格檔案的 repo 我設成 private repo（因為我放了一些 gitalk 要用的 clientSecret，這個不能公開）。  
總之到你要放部落格檔案的那個 repo，新增一個 secret，等等要再 GitHub Action 裡面調用。

> 你放部落格檔案的那個 repo -> reposettings -> Secrets -> add a new secret

名字是 `DEPLOY_KEY`，內容是 `deploy-key` 裡面的東西  
接下來就可以進入到 Action 了

# Action

我的 Action 內容基本上是複製 owlran 大大的，但是因為 repo 結構有小小不同所以我了一些修改，如果你要改的話應該是不難才對，GitHub Action 的設定檔我覺得還好懂的。  
這個設定是放在你放部落格檔案的那個 repo

> 注意：第 27, 28 行的 `username` 和 `email` 記得改成你的，不然 git commit message 會有問題

> 你放部落格檔案的那個 repo -> Action -> New workflow -> set up a workflow yourself

```yaml
name: Hexo
on:
    push:
        branches:
            - master
jobs:
    build:
        runs-on: ubuntu-latest

        steps:
            - uses: actions/checkout@v1
            - name: Use Node.js ${{ matrix.node_version }}
              uses: actions/setup-node@v1
              with:
                  node_version: ${{ matrix.node_version }}
            - name: Configuration environment
              env:
                  DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
              run: |
                  mkdir -p ~/.ssh/
                  echo "$DEPLOY_KEY" | tr -d '\r' > ~/.ssh/id_rsa
                  echo "$DEPLOY_KEY"
                  chmod 600 ~/.ssh/id_rsa
                  ssh-keyscan github.com >> ~/.ssh/known_hosts
            - name: git config
              env:
                  username:
                  email:
              run: |
                  git config --global user.name "$username"
                  git config --global user.email "$email"
                  git config --global commit.gpgsign true
            - name: Imoport GPG key
              id: import_gpg
              uses: crazy-max/ghaction-import-gpg@v2
              with:
                  git_user_signingkey: true
                  git_commit_gpgsign: true
              env:
                  GPG_PRIVATE_KEY: ${{ secrets.GPG_PRIVATE_KEY }}
                  PASSPHRASE: ${{ secrets.PASSPHRASE }}
            - name: Update themes
              run: |
                  git submodule init
                  git submodule update
            - name: Install dependencies
              run: |
                  npm i -g hexo-cli
                  npm i
            - name: Clean file
              run: |
                  hexo clean
            - name: Generate hexo
              run: |
                  hexo generate
            - name: list posts
              run: |
                  hexo list post
            - name: Deploy hexo
              run: |
                  hexo deploy
```
