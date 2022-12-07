+++
title = "Yubikey"
slug = ""
date = 2022-04-19T15:22:55+08:00
lastmod = 2022-12-07
+++

感謝煥杰賣我一個 1200，撿到寶啦！我買的是 [Yubikey 5C NFC](https://www.yubico.com/tw/product/yubikey-5c-nfc/)，看起來幾乎所有功能都有

# login

如果開啟這個，登入、解除鎖定等等動作都需要 Yubikey，聽起還很安全，但是因為我的筆電只有一個 type C，所以必須把 USB hub 拔掉，挺麻煩，我就把他關掉了。  
在密碼輸入框的地方，先插入 yubikey，輸入密碼、按 enter，然後轉圈圈的時候按 yubikey 上金色按鈕（這個似乎是指紋辨識），就可以登入了。

> [Yubico Yubikey 5C NFC setup on Ubuntu 21.04](https://oscfr.com/blog/tech/yubico-yubikey-5c-nfc-setup-on-ubuntu-2104/)

# ssh gpg

~~研究中...~~
在這裡 [GPG with SSH](/posts/linux/gpg-with-ssh)

> [如何在 Mac 上，把 YubiKey 與 GPG、SSH 搭配在一起](https://medium.com/@SSWilsonKao/%E5%A6%82%E4%BD%95%E5%9C%A8-mac-%E4%B8%8A-%E6%8A%8A-yubikey-%E8%88%87-gpg-ssh-%E6%90%AD%E9%85%8D%E5%9C%A8%E4%B8%80%E8%B5%B7-5f842d20ad6a) > [OpenPGP SSH access with Yubikey and GnuPG](https://gist.github.com/artizirk/d09ce3570021b0f65469cb450bee5e29)

# 2FA

按照各個網站的說明設定，下面是我找到可以設定 Yubikey 的網站/APP

- Google（我買這個 yubikey 最主要目的）
- Github
- twitter
- facebook
- heroku

twitter 在手機登入好像怪怪的，試了 5 分鐘才成功登入了

---


# 2022/12/07 更

過了一陣子，系統也重裝過，然後 yubikey 就讀不到了，但是平常用網站都可以，只是 CLI 和 Yubikey personalization tool 都讀不到。
插上後輸入以下指令都會失敗


```
$ ykpersonalize
Yubikey core error: no yubikey present

$ ykman list --serials

WARNING: PC/SC not available. Smart card (CCID) protocols will not function.
ERROR: Unable to list devices for connection
15421961
```

但是用 `lsusb` 看起來卻很正常
```
$ lsusb

Bus 001 Device 010: ID 1050:0406 Yubico.com Yubikey 4/5 U2F+CCID
```

目前根據 [這個 GitHub Issue 的回覆](https://github.com/Yubico/yubioath-flutter/issues/786#issuecomment-1063656957)，輸入 `sudo systemctl start pcscd` 後，變成這樣

```
$ ykman list --serials
15421961
```

我剛剛發現，輸入指令 `ykman info` (yubikey manager) 竟然有回應，也找得到
```
$ ykman info
Device type: YubiKey 5C NFC
Serial number: 15421961
Firmware version: 5.2.7
Form factor: Keychain (USB-C)
Enabled USB interfaces: FIDO, CCID
NFC transport is enabled.

Applications    USB             NFC          
OTP             Disabled        Enabled      
FIDO U2F        Enabled         Enabled      
FIDO2           Enabled         Enabled      
OATH            Enabled         Enabled      
PIV             Enabled         Enabled      
OpenPGP         Enabled         Enabled      
YubiHSM Auth    Not available   Not available
```

但是 ykpersonalize 還是找不到我的 yubikey，後來我直接跳過這步，說不定現在 gpg 已經可以讀到了，所以我直接執行 `gpg --edit-card`，結果他說  
```
gpg: error getting version from 'scdaemon': No SmartCard daemon                                                          
gpg: OpenPGP card not available: No SmartCard daemon     
```

根據 [這篇 reddit](https://www.reddit.com/r/yubikey/comments/lbl4nn/having_some_trouble_with_gpg_and_yubikey/)，是少了套件 `scdaemon`，用 apt 裝了之後 gpg 的回應看起來就正常多了

然後就跟著 [官方 blog 的說明](https://support.yubico.com/hc/en-us/articles/360013790259-Using-Your-YubiKey-with-OpenPGP#Generating_Keys_externally_from_the_YubiKey_(Recommended%29ui6vup)  把主密鑰（？好像是簽章用子密鑰）移到 yubikey 上了

接下來我亂七八糟試了一堆東西，發現 [一篇文章](https://developer.okta.com/blog/2021/07/07/developers-guide-to-gpg) 把上面的東西幾乎都包括進去了，非常推薦可以去看看。

剛剛搞了一陣後，把簽章、加密、驗證和主金鑰（應該有）的密鑰通通丟上 yubikey 了。但是現在有個問題，所有需要 gpg key 的時候，像是簽 git commit 和 ssh 驗證都需要插上 yubikey，好像安全過頭了。我研究看看能不能把某些再拉回本地，如果不行的話就只能把一開始備份的密鑰再導入一次，暴力解決！
