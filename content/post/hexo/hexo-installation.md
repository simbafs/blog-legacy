---
title: hexo-installation
slug: hexo-installation
date: '2020-02-10'
tags:
  - hexo
categories:
  - hexo
image: /og/hexo/hexo-installation.png
---

# 把 hexo 部屬到 gh-page

執行

```
$ npm i hexo -g
$ hexo init blog
$ cd blog
```

修改 `_config.yml` 刪除最後兩行，改成

```
deploy:
  type: git
  repo: git@github.com:<username>/<repo>
  branch: master
```

執行

```
$ npm i hexo-deployer-git
$ hexo depoly
```

在 repo 設定中 `GitHub Pages` 隨便選一個 Jekyll theme，這樣才不會 404

> 地雷：在之後都部屬要加上 `-g`

```
$ hexo d -g
```

不然不會生效

完成!

# 將原始碼保存

執行

```
$ git checkout -b hexo
$ git add .
$ git commit -m init
$ git push -u origin hexo
```

完成
