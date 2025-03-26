---
title: Yubikey
slug: yubikey
date: '2022-04-19T00:00:00.000Z'
tags:
  - yubikey
  - ssh
  - gpg
  - security
categories:
  - linux
  - yubikey
---

# Yubikey

感謝煥杰賣我一個 1200，撿到寶啦！我買的是 [Yubikey 5C NFC](https://www.yubico.com/tw/product/yubikey-5c-nfc/)，看起來幾乎所有功能都有

## login

如果開啟這個，登入、解除鎖定等等動作都需要 Yubikey，聽起還很安全，但是因為我的筆電只有一個 type C，所以必須把 USB hub 拔掉，挺麻煩，我就把他關掉了。  
在密碼輸入框的地方，先插入 yubikey，輸入密碼、按 enter，然後轉圈圈的時候按 yubikey 上金色按鈕（這個似乎是指紋辨識），就可以登入了。

> [Yubico Yubikey 5C NFC setup on Ubuntu 21.04](https://oscfr.com/blog/tech/yubico-yubikey-5c-nfc-setup-on-ubuntu-2104/)

## ssh gpg

~~研究中...~~
在這裡 [GPG with SSH](/posts/linux/gpg-with-ssh)

> [如何在 Mac 上，把 YubiKey 與 GPG、SSH 搭配在一起](https://medium.com/@SSWilsonKao/%E5%A6%82%E4%BD%95%E5%9C%A8-mac-%E4%B8%8A-%E6%8A%8A-yubikey-%E8%88%87-gpg-ssh-%E6%90%AD%E9%85%8D%E5%9C%A8%E4%B8%80%E8%B5%B7-5f842d20ad6a) > [OpenPGP SSH access with Yubikey and GnuPG](https://gist.github.com/artizirk/d09ce3570021b0f65469cb450bee5e29)

## 2FA

按照各個網站的說明設定，下面是我找到可以設定 Yubikey 的網站/APP

-   Google（我買這個 yubikey 最主要目的）
-   Github
-   twitter
-   facebook
-   heroku

twitter 在手機登入好像怪怪的，試了 5 分鐘才成功登入了

---

## 2022/12/07 更

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

然後就跟著 [官方 blog 的說明](https://support.yubico.com/hc/en-us/articles/360013790259-Using-Your-YubiKey-with-OpenPGP#Generating_Keys_externally_from_the_YubiKey_(Recommended%29ui6vup) 把主密鑰（？好像是簽章用子密鑰）移到 yubikey 上了

接下來我亂七八糟試了一堆東西，發現 [一篇文章](https://developer.okta.com/blog/2021/07/07/developers-guide-to-gpg) 把上面的東西幾乎都包括進去了，非常推薦可以去看看。

剛剛搞了一陣後，把簽章、加密、驗證和主金鑰（應該有）的密鑰通通丟上 yubikey 了。但是現在有個問題，所有需要 gpg key 的時候，像是簽 git commit 和 ssh 驗證都需要插上 yubikey，好像安全過頭了。我研究看看能不能把某些再拉回本地，如果不行的話就只能把一開始備份的密鑰再導入一次，暴力解決！

## 密碼們

yubikey 的設定中有好幾份不同功能的密碼，用法和出現時機都不一樣，這邊是我研究好幾份文件的總整理。首先要先有個關念，yubikey 的設計是公司裡有個人專門管一大堆的 yubikey，所以會有一個密碼是只有管理人知道，使用者不知道。那為了驗證是使用者本人，也會有密碼是只有使用者知道但是其他人不知道。

## PIN

這個 "PIN" 是 **"Personal Identification Number"** 的縮寫，顧名思義，這個就是只有使用者知道但是其他人不知道的 PIN，你會在動用 gpg、ssh 密鑰時用到他。預設是 123456

### 使用情境

-   驗證 PIN
-   改變 PIN
-   改變嘗試次數限制（還需要 management key）
-   簽章
-   解密
-   key agreement
-   取得資料

## PUK

"PUK" 是 "PIN Unblocking Key" 的縮寫，他的功能是當你輸入錯誤的 PIN 太多次時，用這個密碼解鎖。如果很不幸的你 PUK 也輸入錯誤太多次，整個 yubikey 會被鎖起來，所有的功能都不能用，根據 [官方文件](https://support.yubico.com/hc/en-us/articles/360015654100-YubiKey-PIN-and-PUK-User-Management-on-Windows)，你只能回復出廠設定

> By default, the user PIN is blocked when three consecutive incorrect PINs have been entered. The PIN Unblock Code (PUK) is used for unblocking the User PIN. If both the PIN and the PUK are blocked, the YubiKey must be reset, which deletes any loaded certificates and returns the YubiKey to a factory default state.

### 使用情境

-   修改 PUK
-   解鎖 PIN

## Admin PIN

很明顯這是管理員專用的密碼，反正在需要比較高權限的操作的時候他會跳出來，密碼輸入框上面會寫 "Admin PIN"，所以應該是不太會看錯啦。預設是 12345678  
`gpg --edit-card` 在 `passwd` 裡修改 Admin PIN 後的訊息會是 `PIN changed.`，應該是誤植吧

## management key

這是一個比較特別的密碼，他預設是 3DES，你也可以改成 AES，目前來說 3DES 還是「安全的加密標準」，所以針對這個密碼 yubikey 沒有設定嘗試上限（PIN 和 PUK 有），因為就算攻擊者想要破解也很難（[3DES 的安全性](https://zh.wikipedia.org/wiki/3DES#%E5%AE%89%E5%85%A8%E6%80%A7)）

### 使用情境

-   修改 management key
-   修改資料
-   產生新金鑰對
-   匯入密鑰
-   產生憑證
-   修改嘗試次數限制

以上內容是根據 [這篇文件](https://docs.yubico.com/yesdk/users-manual/application-piv/pin-puk-mgmt-key.html) 整理出來的

> 根據 [這篇文章](https://developers.yubico.com/yubikey-piv-manager/PIN_and_Management_Key.html)，似乎還有其他密碼們，上面介紹的都是屬於 PIV（Personal Identity Verification），還有 OpenPGP、FIDO2 的 PIN
