+++
title = "用 Github Action 編譯並發 Release"
slug = "github-action-release"
date = 2022-03-27T11:00:18+08:00
tags = ["GitHub", "CI/CD", "GitHub Action", 'cloud']
categories = ["go"]
+++

# 用 Github Action 編譯並發 Release

如果自己寫的小工具的 GitHub 頁面右邊 Release 那欄有個什麼東西，一定很酷對吧！如果裡面已經提供了不同作業系統編譯好的程式，一定更酷！  
想要建立 Release，你可以在新版本發布時自己手動 crose compile 再手動設定 Release，這個方法可行，但是聽起來全手動就很 low，我們要用一個全自動的方式發 Release！

## Github Actioin

既然我們程式碼都託管在 GitHub 了，直接用 Gtithub Action 是很合理的吧！

### 觸發條件

因為我們要做的是發布版本，不是每個 commit 都要觸發，因此觸發條件就設成

```yaml
on:
    push:
        tags:
            - 'v[0-9]+.[0-9]+.[0-9]+'
```

意思是只有像是 `v0.1.13` 這樣的標籤會觸發，也就是你建立新版本時。

### 編譯

在嘗試各種套件之後，我覺得 [goreleaser-action](https://github.com/marketplace/actions/goreleaser-action) 是我用起來最舒服的，不用太多設定，就直接都編譯好了（詳細設定可以去 [goreleaser 的網站看](https://goreleaser.com) )  
在 GitHub Action 中設定就下面幾行，第一個步驟是安裝 go，再來就是編譯了。

```yaml
- name: Set up Go
  uses: actions/setup-go@v3.0.0
  with:
      go-version: 1.17.x
- name: Run GoReleaser
  uses: goreleaser/goreleaser-action@v2.9.1
  with:
      version: latest
      args: release --rm-dist
  env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

注意，裡面有個 `secret.GITHUB_TOKEN`，這個東西你就照寫，不要抄錯，GitHub Action 會自動在 runtime 填入，所以你也不用特別去設定。

### 上傳編譯好的執行檔

goreleaser 的文件裡面有推薦一個上傳的套件，但是可能是我笨，那個都不成功。我用的是另一套 [upload-to-github-release](https://github.com/marketplace/actions/upload-to-github-release)，這個可以一次上傳多個檔案，設定一樣很簡單。

```yaml
- uses: little-core-labs/get-git-tag@v3.0.1
  id: tagName
- name: Upload To Github Release
  uses: xresloader/upload-to-github-release@v1.3.2
  env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
      file: 'dist/telegrary_*'
      draft: true
      tag_name: ${{ steps.tagName.outputs.tag }}
```

你會看到在上傳之前還有一個步驟，這個是用來取得 tag name 用的，他用來指定檔案要上傳到哪裡  
在 `with.file` 這欄，你可以指定要上傳的檔案，這個要設成什麼就要看你 goreleaser 編譯出來的檔案放在哪，叫什麼（這個都是可以設定的）  
`draft` 設成 `true` 有個好處，就是 Action 跑玩後不會立刻建立新 Release，而是你在去手動確認，而且包括 Release name、Change log 都設定好了，你只需要看有沒有什麼說明要加，就可以直接按發布了，非常方便。當然你如果沒有什麼想說的，就可以直接設定 `draft: true`，如此一來就真的是「全自動了」

## 完整 action 設定檔

以上是細部解說，下面就是完整設定檔，如果有更新的話請到 [https://github.com/simbafs/telegrary/blob/main/.github/workflows/release.yml](https://github.com/simbafs/telegrary/blob/main/.github/workflows/release.yml) 看最新版。

```yaml
name: Release

on:
    push:
        tags:
            - 'v[0-9]+.[0-9]+.[0-9]+'

jobs:
    goreleaser:
        runs-on: ubuntu-latest
        steps:
            - name: Checkout
              uses: actions/checkout@v2
            - name: Unshallow
              run: git fetch --prune --unshallow
            - name: Set up Go
              uses: actions/setup-go@v3.0.0
              with:
                  go-version: 1.17.x
            - name: Run GoReleaser
              uses: goreleaser/goreleaser-action@v2.9.1
              with:
                  version: latest
                  args: release --rm-dist
              env:
                  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
            - name: ls
              run: |
                  ls dist
            - uses: little-core-labs/get-git-tag@v3.0.1
              id: tagName
            - name: Upload To Github Release
              uses: xresloader/upload-to-github-release@v1.3.2
              env:
                  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
              with:
                  file: 'dist/telegrary_*'
                  draft: true
                  tag_name: ${{ steps.tagName.outputs.tag }}
```
