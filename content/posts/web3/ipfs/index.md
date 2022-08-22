+++
title = "IPFS"
slug = ""
date = 2022-08-22T16:44:06+08:00
+++

IPFS 是一個去中心化的檔案儲存方案，為什麼說是方案，因為他包括了通訊協議、軟體、檔案系統、名稱系統、閘道器。這個概念其實不新鮮但是 ipfs 整合過去去中心化方案的優點，而且他整合很很棒，可以開箱即用（out of box）。在 [ipfs 的 GitHub README.md 中](https://github.com/ipfs/kubo/#what-is-ipfs) 中的介紹：「It is like a single BitTorrent swarm, exchanging git objects」。他傳檔案的方式就像 BT 一樣是透過 p2p，定位檔案的方式像 Git，將檔案內容雜湊。

# 安裝
截稿當下，ipfs 還沒有被 Ubuntu 收錄，所以你沒辦法用 `apt install` 安裝。ipfs 的執行擋是用 Go 寫的，因此可以輕易跨平台執行，去 [ipfs 在 GitHub 的 Release 頁面](https://github.com/ipfs/kubo/releases/latest) 下載對應的版本，然後解壓縮，你可以把 `ipfs` 這個檔案自己搬到你的 `$PATH` 下，或是用 `./install.sh` 讓他的安裝腳本幫你選擇目錄

## Android
在 Google play 可以找到一堆號稱是 ipfs 的 App，但功能都不齊全，如果你想在在 Android 手機上執行 ipfs，最好的方式是用 [termux](https://termux.dev/en/) 這套終端機模擬器，現在 Google Play 上已經沒有更新，要最新版的要去 [F-Droid](https://github.com/termux/termux-app#f-droid) 或是 [GitHub Release](https://github.com/termux/termux-app/releases/latest) 下載。安裝後一樣按照上面的步驟，檔案選 `linux-arm64` 那個就可以了。經過測試所有功能都和電腦一樣，包括 webui。

# 基本功能
## IPFS 上傳檔案
在節點 A 上執行 `ipfs add <file>`、`cat <file> | ipfs add`，這個命令會回傳一串 hash，稱為 `CID`，通常是 `Qm` 開頭，所以也被稱為 Qm hash

## 下載檔案
如果另一個節點有任何方式可以連線到節點 A（不論是直接的 peer 或是透過全球、區域的網路連接）都可以用 `ipfs cat <CID>` 將內容印到 stdout。如果要直接存起來，也可以用 `ipfs get [-o file] <CID>`，如果不指定 `-o` 檔名會是 CID

## 查看自己的 id
`ipfs id | jq .ID`

## 查看 peers
這個指令會列出所有直接連線節點的 id，如果找不到不代表拿不到檔案，透過間接的方式還是拿得到，只是第一次要找比較久
`ipfs swarm peers`

## wrap
如果一次有多個檔案要分享，例如一個網站，可以用 `-w` **保留目錄結構**，例如以下目錄
```
.
├── favicon.ico
├── index.html
└── script.js
```
用指令 `ipfs add -w *`，可以將這些檔案包在一個 CID 下（當然每個檔案也都有各自的 CID），以下是執行後的輸出
```
added QmTkhTu5EmX4qzPX4epFZr99WuWfPf8KTcCqySqf7tyH3z favicon.ico
added QmeBWHaefLwKkn7TgGdzyxgtaTTRkPeM3X4RbUY4xr736c index.html
added QmchNhX1C1SgWJK4eZHar1v92ck4BsoVmVriBHN1r4KWRs script.js
added QmS1byYBM16thyGbJtjnMYz32E9eMxfXdzbA4VAKR8nTch 
```
最下面那個就是包起來的 CID。原本要取得 `index.html` 需要用 `ipfs cat QmeBWHaefLwKkn7TgGdzyxgtaTTRkPeM3X4RbUY4xr736c`，但如果用 wrap 就可以改成 `ipfs cat QmS1byYBM16thyGbJtjnMYz32E9eMxfXdzbA4VAKR8nTch/index.html`。這樣做的好處是即使有多個檔案，也只需要記一個 CID，像是我們可以用同一個 CID 取得 `script.js` `ipfs cat QmS1byYBM16thyGbJtjnMYz32E9eMxfXdzbA4VAKR8nTch/script.js`

> **Notice**   
> `QmS1byYBM16thyGbJtjnMYz32E9eMxfXdzbA4VAKR8nTch` 這個 CID 代表的是一個「目錄」，所以他不能用 `ipfs cat <CID>`，這時候要改用 `ipfs ls <CID>`

> **Warning**  
> 這個範例都是檔案，如果有目錄的話要加上選項 `-r`

> **Warning**  
> 因為目錄也是根據內容雜湊，所以你不能修改目錄內的檔案而不變動目錄的 CID，就和檔案一樣

# 固定位址

## IPNS
ipfs 有個介紹到這裡，有個小問題，一個檔案只要一更改，位址（CID）就會改變，這對於網路存取很不友善，誰知道那一大串 hash 要去哪裡找？因此 ipfs 提供了一個方案：IPNS

### publish
首先，我們先準備一個CID `QmZLRFWaz9Kypt2ACNMDzA5uzACDRiCqwdkNSP1UZsu56D`，他的內容就一個字「hi」。一樣 add 之後，就要來使用 ipns 了
```
ipfs name publish QmZLRFWaz9Kypt2ACNMDzA5uzACDRiCqwdkNSP1UZsu56D
```
等個大概 30 秒之後，他會回傳類似這個
```
Published to k51qzi5uqu5djj5l4icq7jgwc06bzhxjxpwo0ghpyf9h5pah5hr5i4se7sosnm: /ipfs/QmZLRFWaz9Kypt2ACNMDzA5uzACDRiCqwdkNSP1
```
第一個 hash `k51......snm` 那個我們稱之為 `key`，現在就可以用 `/ipns/k51qzi5uqu5djj5l4icq7jgwc06bzhxjxpwo0ghpyf9h5pah5hr5i4se7sosnm` 來存取原本的 `/ipfs/QmZLRFWaz9Kypt2ACNMDzA5uzACDRiCqwdkNSP1` 了
> **Notice**  
> `/ipfs/CID` 或是 `/ipns/<key>` 都可以想成 path，放在 `ipfs cat`、`ipfs ls` 後面當參數。或是可以透過公開的閘道器，例如 [ipfs.io](ipfs.io) 存取。`https://ipfs.io/ipfs/<CID>`、`https://ipfs.io/ipns/<key>`

### republish
我們還沒示範到 ipns 的重要功能：固定位址。現在準備另一個 CID `QmermPSVVcmcutmQ1woTAtUcByUvoS2F3ZcKdkdbuAdEi5`，內容是「hihi」
```
ipfs name publish -k k51qzi5uqu5djj5l4icq7jgwc06bzhxjxpwo0ghpyf9h5pah5hr5i4se7sosnm QmermPSVVcmcutmQ1woTAtUcByUvoS2F3ZcKdkdbuAdEi5
```
一樣等個 30 秒左右，原本 key 就指向新的內容「hihi」了  

> **Notice**  
> 你不用擔心有其他人會擅自幫你更新 key 的指向，因為那個 key 其實是一對非對稱金鑰的公鑰，私鑰存在你的電腦，只有有私鑰的人才能更新。

## DNSLink
如果你覺得用非對稱金鑰產生的 key 很醜，還是記不住，你可以透過傳統的 DNS 來當作 key（意味著這部份其實是中心化的，要付錢）  
DNSLink 的用法很簡單，假設你想要把 ipfs.simbafs.cc 當作 key 指向 CID `QmZLRFWaz9Kypt2ACNMDzA5uzACDRiCqwdkNSP1UZsu56D`，那就在 `_dnslink.ipfs.simbafs.cc` 新增一條 TXT DNS 紀錄 `dnslink=/ipfs/QmZLRFWaz9Kypt2ACNMDzA5uzACDRiCqwdkNSP1UZsu56D`，這時候你就可以用 `/ipns/ipfs.simbafs.cc` 來代替 `/ipfs/QmZLRFWaz9Kypt2ACNMDzA5uzACDRiCqwdkNSP1UZsu56D` 了

# 瀏覽器
施工中......

# 參考資料
[ipfs docs](https://docs.ipfs.tech)
