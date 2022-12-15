+++
title = "GPG and Yubikey"
slug = ""
date = 2022-12-12T23:26:53+08:00
draft = true
+++

# GPG

GPG 是由 由 PGP、OpenPGP 演化而來，屬於 GNU 計畫之一，主要功能是在不安全通道建立安全可信的通訊。為了建立安全可信，需要解決幾個問題：加密明文、驗證發送方、驗證接收方，以及為了解決前面三個問題而產生的新問題信任鍊。  
為了驗證發送方，發送方需要產生只有發送方能產生的簽章併附在內容後面。為了驗證接收方，要把內容用只有接收方才能解開的方式把內容保護起來，這同時可以做到加密明文。

GPG 中每個人都有一個鑰匙圈（keyring），就像你包包裡的鑰匙圈，GPG 的 keyring 也可以有不只一把金鑰。通常來說會是一把主金鑰和若干把的子金鑰，每一把都是非對稱金鑰對，也就是會有公鑰和私鑰（密鑰）。公鑰是需要公佈給其他人知道的（還要像辦法讓其他人「信任」），而私鑰是必須保護好，後面提到的 Yubikey 就是為了保護我們的私鑰，盡量讓他暴露的風險越低越好。

## 主金鑰和子金鑰的關係

一組 GPG keyring 中會有一個主金鑰和若干個子金鑰，主金鑰的功能是身份證明和金鑰管理，而子密鑰就是一般的操作。之所以需要有這個設計，是為了盡可能保護主密鑰不洩漏。在日常的 GPG 使用中，我們不可避免需要密鑰（解密、簽章等等），如果全部都使用主密鑰操作，也不是說不行，但是萬一主密鑰洩漏，就要重新產生了。但如果將日常功能移到和主密鑰相關連的子密鑰，主密鑰僅保留重要的「身份證明」功能，如此一來就可以將 [主密鑰分離](https://blog.theerrorlog.com/using-gpg-zh.html)（這算是高階操作），把不常用到但是非常重要的主金鑰藏好（像是離線儲存，或是最極端的在離線的機器產生、匯出然後刪除）。如果主密鑰洩漏或是遺失，那就要重新產生，等於是一個全新的身份，所有信任關係必須從頭建立。

因為主金鑰和子金鑰是不同金鑰對，所以如果你用 A 子公鑰加密，是不能用 B 子密鑰甚至是主密鑰解密的，簽章和證明也是如此。

### 如何連結子密鑰和主密鑰

子金鑰和主金鑰是不同的金鑰，甚至可以用不同的演算法產生，那是什麼東西決定他們的地位差異呢？根據我對 [這篇問答](https://superuser.com/questions/1113308/what-is-the-relationship-between-an-openpgp-key-and-its-subkey) 的理解（很可能是錯的，網路上這方面的資料有夠少），在用主金鑰產生子金鑰的時候，會用主密鑰幫子金鑰「簽章」，這個稱之為「Binding Siganture」。GPG 就是用這個 binding signature 去證明子密鑰屬於哪個 keyring。

### 什麼操作屬於身份證明(Certify)

前面提到，主金鑰的功能是身份證明，但是怎樣的操作是屬於身份證明呢？根據這 [這篇問答](https://security.stackexchange.com/questions/73679/which-actions-does-the-gnupg-certify-capability-permit) 和 [RFC 4880](https://www.rfc-editor.org/rfc/rfc4880#section-5.2.1)，以下操作都是屬於身份證明

- 對某個使用者的公鑰簽章（信任某個使用者，相關內容在信任鍊章節）
- 簽發 binding signature（這裡分成 subkey binding signature 和 primary binding signature，但我還沒研究出差別）
- 簽發金鑰撤銷金鑰（當你的子密鑰洩漏時宣告用）

簡單來說，就是產生、撤銷子金鑰以及和「信任」有關的操作都算是「身份證明」(Certify)

## Usage Flag

每對金鑰其實都有簽章、加密、驗證等等功能（可能會依使用的演算法不同而受限，像是 DSA 只能簽章），為了清楚的切分不同密鑰的功能，GPG 採用的方法是 Usage Flag，他會標注一個金鑰的用途是「**C**ertify 身份證明」、「**S**ign 簽章」、「**E**ncrypt 加解密」、「**A**uthenticate 認證」。如果你在產生金鑰時加上 `--expert` 專家選項，你會在選擇演算法的列表看到某些選項後面帶著 `(set your own capabilities)`，選這些可以讓你決定產生的金鑰有哪些 Usage Flag，不然就會使用預設的。

其中在上一個小節提到的 Certify 功能必須**且只能**（應該吧，我是找不到怎麼在子密鑰上加 Certify）設定在主密鑰上。另外 Certify 和 Authenticate 的中文翻譯都很像，但是功能卻大大不同，Certify 剛剛上面提過，就是「信任」，Authenticate 則是像是 ssh 登入的操作（下面會提到）

## uid 
每個 keyring 都對應到一個人，但通常一個人有不只一個的 email address，因此 GPG 也支援對應多個 email address，這個在 GPG 終就稱之為 uid，裡面會包含這個人的名字和 email address


## key fingerprint(id) and keygrip
fingerprint 和 keygrip 都是要對於金鑰對識別，他們都是把要識別的公鑰對拿去 hash，功能是可以快速比較兩把 key 是否相同，例如你從網路上找到某個人的公鑰，可以用 fingerprint 和那個人比對是不是同一把 key（fingerprint 40 個字元，完整的 key 可能有上千個字元）。看到這裡你會覺得 fingerprint 和 keygrip 很像，的確，他們的差異只差在包含的資訊不一樣

* fingerprint
	* 公鑰
	* 建立日期
	* 演算法
	* 公鑰 packet 版本（儲存公鑰的資料結構）
* keygrip
	* 公鑰

你會發現，keygrip 只包含公鑰，而 fingerprint 則是包含了一堆 gpg 內部資訊，因此我們可以說 keygrip 是「和 GPG 無關」的識別。  

雖然兩者都能識別主金鑰和子金鑰，但是在我自己的使用中，通常 fingerprint 會用來識別主金鑰（整個 keyring），keygrip 會拿來特別指定要用哪一個子金鑰。  

## 信任鍊


## 範例

### 產生金鑰對

### GPG with SSH

## 發佈公鑰

# Yubikey
