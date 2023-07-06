---
categories:
- hexo
date: "2020-02-11"
tags:
- hexo
- github action
- cloud
title: Audo Depoly by Github Action
---

# GitHub Action 自動部署 Hexo

## 自動部屬部落格

參考網址：[https://op30132.github.io/2020/02/05/github-action/](https://op30132.github.io/2020/02/05/github-action/)
生成公私鑰時不用在部落格根目錄，記的不要加入 git，要刪掉

```yaml
name: HEXO CI

on:
    push:
        branches:
            - master

jobs:
    build:
        runs-on: ubuntu-latest
        strategy:
            matrix:
                node-version: [12.x]

        steps:
            - uses: actions/checkout@v1

            - name: Use Node.js ${{ matrix.node-version }}
              uses: actions/setup-node@v1
              with:
                  node-version: ${{ matrix.node-version }}

            - name: Configuration environment
              env:
                  HEXO_DEPLOY_PRI: ${{secrets.HEXO_DEPLOY_PRI}}
              run: |
                  mkdir -p ~/.ssh/
                  echo "$HEXO_DEPLOY_PRI" | tr -d '\r' > ~/.ssh/id_rsa
                  chmod 600 ~/.ssh/id_rsa
                  ssh-keyscan github.com >> ~/.ssh/known_hosts
                  git config --global user.name "simbafs"
                  git config --global user.email "simbafsgmail.com"
            - name: Install dependencies
              run: |
                  npm i -g hexo-cli
                  npm i -S hexo 
                  npm i
            - name: hexo
              run: |
                  git checkout hexo
            - name: config
              run: |
                  hexo config
            - name: test hexo
              run: |
                  hexo new post telsst
            - name: list
              run: |
                  ls source/_posts
                  PWD=$(pwd) hexo list post
            - name: clean
              run: |
                  hexo clean
            - name: generate
              run: |
                  hexo g
            - name: deploy
              run: |
                  hexo d
```
