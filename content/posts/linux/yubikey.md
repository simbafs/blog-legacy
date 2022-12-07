+++
title = "Yubikey"
slug = ""
date = 2022-04-19T15:22:55+08:00
+++

感謝煥杰賣我一個 1200，撿到寶啦！我買的是 [Yubikey 5C NFC](https://www.yubico.com/tw/product/yubikey-5c-nfc/)，看起來幾乎所有功能都有

# login
如果開啟這個，登入、解除鎖定等等動作都需要 Yubikey，聽起還很安全，但是因為我的筆電只有一個 type C，所以必須把 USB hub 拔掉，挺麻煩，我就把他關掉了。  
在密碼輸入框的地方，先插入 yubikey，輸入密碼、按 enter，然後轉圈圈的時候按 yubikey 上金色按鈕（這個似乎是指紋辨識），就可以登入了。  

> [Yubico Yubikey 5C NFC setup on Ubuntu 21.04](https://oscfr.com/blog/tech/yubico-yubikey-5c-nfc-setup-on-ubuntu-2104/)

# ssh gpg 
研究中...

> [如何在 Mac 上，把 YubiKey 與 GPG、SSH 搭配在一起](https://medium.com/@SSWilsonKao/%E5%A6%82%E4%BD%95%E5%9C%A8-mac-%E4%B8%8A-%E6%8A%8A-yubikey-%E8%88%87-gpg-ssh-%E6%90%AD%E9%85%8D%E5%9C%A8%E4%B8%80%E8%B5%B7-5f842d20ad6a)
> [OpenPGP SSH access with Yubikey and GnuPG](https://gist.github.com/artizirk/d09ce3570021b0f65469cb450bee5e29)

# 2FA
按照各個網站的說明設定，下面是我找到可以設定 Yubikey 的網站/APP  
* Google（我買這個 yubikey 最主要目的）
* Github
* twitter
* facebook
* heroku

twitter 在手機登入好像怪怪的，試了 5 分鐘才成功登入了
