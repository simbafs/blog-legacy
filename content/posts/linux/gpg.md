+++
title = "gpg"
tags = [ "git", "linux", "gpg" ]
categories = [ "linux" ]
date = "2020-03-28"
+++

# sign git commit with gpg
我按照他的作法弄完後就是沒辦法 commit
他說 GPG 無法簽章
後來我發現是我的 name 填錯（應該啦，我猜的）
總而言之就重新產生 GPG key 就好了
name 和 git 設定的一樣

# 常見指令
```
$ gpg --full-gen-key
$ gpg --list-secret-keys
$ gpg --armor --export <secret key>
```

# 刪除金鑰
在刪除的時候分成兩步驟，刪除私鑰、刪除公鑰。在刪除之前要先知道要刪除的金鑰的 ID
```bash
gpg --list-keys
```

找到那串很長的文字，那就是 ID，複製起來，他起來也許會像這樣
```
JFDKSA8FEWHE29HFVC92UHFPA93WOHFVDOPA39U2
```

再來用兩個指令就可以刪除了，注意一定要先刪私鑰。
```bash
gpg --delete-secret-key <ID>
gpg --delete-key <ID>
```

# 指紋 Fingerprint
根據 [GNOME help](https://help.gnome.org/users/seahorse/stable/misc-key-fingerprint.html.en) 的說明，不同金鑰的指紋必然不同，因此如果要驗證、查詢的話，與其用其他參數，不如用指紋，例如我的 GPG key 指紋是 `6236 A070 8FCD 894C 7AD1  A5FC DB13 A5C2 042E AEA4`，看到這串就代表是我。  

# Grip
根據 [gnupg 的這封郵件](https://lists.gnupg.org/pipermail/gcrypt-devel/2013-June/002205.html)，grip 似乎是金鑰參數的 SHA-1 hash，看不太懂哪些參數會被納入計算。

