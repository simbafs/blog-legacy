+++
title = "GPG with SSH"
date = 2022-12-06T22:59:17+08:00
tags = ['GPG', 'SSH', 'encryption', 'cryptography']
categories = ['linux']
+++

# GPG with SSH
接續前一篇 [gpg 的文章](/posts/linux/gpg/) 

## 指紋 Fingerprint
根據 [GNOME help](https://help.gnome.org/users/seahorse/stable/misc-key-fingerprint.html.en) 的說明，不同金鑰的指紋必然不同，因此如果要驗證、查詢的話，與其用其他參數，不如用指紋，例如我的 GPG key 指紋是 `6236 A070 8FCD 894C 7AD1  A5FC DB13 A5C2 042E AEA4`，看到這串就代表是我。  

## Grip
根據 [gnupg 的這封郵件](https://lists.gnupg.org/pipermail/gcrypt-devel/2013-June/002205.html)，grip 似乎是金鑰參數的 SHA-1 hash，看不太懂哪些參數會被納入計算。

## ssh authorize with gpg
以下步驟來自下面三個參考網址
* https://blog.theerrorlog.com/using-gpg-zh.html (這裡有一些關於 gpg 的設定操做，不一定要像他說的那樣主密鑰分離，只是給一個操作說明)  
* https://blog.theerrorlog.com/using-gpg-keys-for-ssh-authentication-zh.html  
* https://gist.github.com/mcattarinussi/834fc4b641ff4572018d0c665e5a94d3 (gpg-agent 設定看這篇，這前面有非常詳細的 gpg ket 設定教學)  

1. 根據第二個參考資料的說明產生可以用於 ssh 驗證的 gpg subkey（有`[A]`）
2. 取得 ssh 格式的公鑰 `gpg2 --export-ssh-key you@example.com`
3. 取得要用於驗證的 subkey 的 keygrip  

```
$ gpg2 --list-keys --with-keygrip
/home/you/.gnupg/pubring.kbx
------------------------------
pub   rsa4096 2022-12-06 [C]
      AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
      Keygrip = BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
uid           [ultimate] you <you@example.com>
sub   rsa4096 2022-12-06 [S]
      Keygrip = CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
sub   rsa4096 2022-12-06 [E]
      Keygrip = DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD
sub   ed25519 2022-12-06 [A] <- 可用於驗證的子金鑰
      Keygrip = EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE <- 我們要的 keygrip
```  

4. 將 keygrip 寫入 `.gnupg/sshcontrol` -> `echo EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE >> .gnupg/sshcontrol`
5. 根據第三個參考網址 [setup-the-gpg-agent-for-ssh-authentication](https://gist.github.com/mcattarinussi/834fc4b641ff4572018d0c665e5a94d3#setup-the-gpg-agent-for-ssh-authentication) 章節設定 gpg-agent   

這時後重新開啟終端機就可以用 gpg 取代原本的 ssh key 了，確認移除 ssh key 真的還可以登入後就可以把舊的 ssh key 收起來了。


