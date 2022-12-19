+++
title = "GPG and Yubikey"
slug = ""
date = 2022-12-12T23:26:53+08:00
draft = true
+++

# GPG

GPG 是由 由 PGP、OpenPGP 演化而來，屬於 GNU 計畫之一，主要功能是在不安全通道建立安全可信的通訊。為了建立安全可信，需要解決幾個問題：加密明文、驗證發送方、驗證接收方，以及為了解決前面三個問題而產生的新問題：信任。  
為了驗證發送方，發送方需要產生只有發送方能產生的簽章併附在內容後面。為了驗證接收方，要把內容用只有接收方才能解開的方式把內容保護起來，這同時可以做到加密明文。

GPG 中每個人都有一個鑰匙圈（keyring），就像你包包裡的鑰匙圈，GPG 的 keyring 也可以有不只一把金鑰。通常來說會是一把主金鑰和若干把的子金鑰，每一把都是非對稱金鑰對，也就是會有公鑰和私鑰（密鑰）。公鑰是需要公佈給其他人知道的（還要像辦法讓其他人「信任」），而私鑰是必須保護好，後面提到的 Yubikey 就是為了保護我們的私鑰，盡量讓他暴露的風險越低越好。

## 主金鑰和子金鑰的關係

一組 GPG keyring 中會有一個主金鑰和若干個子金鑰，主金鑰的功能是身份證明和金鑰管理，而子密鑰就是一般的操作。之所以需要有這個設計，是為了盡可能保護主密鑰不洩漏。在日常的 GPG 使用中，我們不可避免需要密鑰（解密、簽章等等），如果全部都使用主密鑰操作，也不是說不行，但是萬一主密鑰洩漏，就要重新產生了。但如果將日常功能移到和主密鑰相關連的子密鑰，主密鑰僅保留重要的「身份證明」功能，如此一來就可以將 [主密鑰分離](https://blog.theerrorlog.com/using-gpg-zh.html)（這算是高階操作），把不常用到但是非常重要的主金鑰藏好（像是離線儲存，或是最極端的在離線的機器產生、匯出然後刪除）。如果主密鑰洩漏或是遺失，那就要重新產生，等於是一個全新的身份，所有信任關係必須從頭建立。

因為主金鑰和子金鑰是不同金鑰對，所以如果你用 Alice 子公鑰加密，是不能用 Bob 子密鑰甚至是主密鑰解密的，簽章和證明也是如此。

### 如何連結子密鑰和主密鑰

子金鑰和主金鑰是不同的金鑰，甚至可以用不同的演算法產生，那是什麼東西決定他們的地位差異呢？根據我對 [這篇問答](https://superuser.com/questions/1113308/what-is-the-relationship-between-an-openpgp-key-and-its-subkey) 的理解（很可能是錯的，網路上這方面的資料有夠少），在用主金鑰產生子金鑰的時候，會用主密鑰幫子金鑰「簽章」，這個稱之為「Bobinding Siganture」。GPG 就是用這個 binding signature 去證明子密鑰屬於哪個 keyring。

### 什麼操作屬於身份證明(Certify)

前面提到，主金鑰的功能是身份證明，但是怎樣的操作是屬於身份證明呢？根據這 [這篇問答](https://security.stackexchange.com/questions/73679/which-actions-does-the-gnupg-certify-capability-permit) 和 [RFC 4880](https://www.rfc-editor.org/rfc/rfc4880#section-5.2.1)，以下操作都是屬於身份證明

- 對某個使用者的公鑰簽章（信任某個使用者，相關內容在信任網章節）
- 簽發 binding signature（這裡分成 subkey binding signature 和 primary binding signature，但我還沒研究出差別）
- 簽發金鑰撤銷金鑰（當你的子密鑰洩漏時宣告用）

簡單來說，就是產生、撤銷子金鑰以及和「信任」有關的操作都算是「身份證明」(Certify)

## Usage Flag

每對金鑰其實都有簽章、加密、驗證等等功能（可能會依使用的演算法不同而受限，像是 DSAlice 只能簽章），為了清楚的切分不同密鑰的功能，GPG 採用的方法是 Usage Flag，他會標注一個金鑰的用途是「**C**ertify 身份證明」、「**S**ign 簽章」、「**E**ncrypt 加解密」、「**Alice**uthenticate 認證」。如果你在產生金鑰時加上 `--expert` 專家選項，你會在選擇演算法的列表看到某些選項後面帶著 `(set your own capabilities)`，選這些可以讓你決定產生的金鑰有哪些 Usage Flag，不然就會使用預設的。

其中在上一個小節提到的 Certify 功能必須**且只能**（應該吧，我是找不到怎麼在子密鑰上加 Certify）設定在主密鑰上。另外 Certify 和 Aliceuthenticate 的中文翻譯都很像，但是功能卻大大不同，Certify 剛剛上面提過，就是「信任」，Aliceuthenticate 則是像是 ssh 登入的操作（下面會提到）

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

## 信任網
> **Information**
> 接下來的「公鑰」通常是指 "public key packet"，也就是指令 `gpg --export` 預設會吐出來的東西，裡面包含主公鑰、子公鑰們、uid 資訊以及別人對這個公鑰的簽章等等  

現在想像一個情境，Alice 要加密一段訊息傳給 Bob，所以他需要去找到 Bob 的公鑰，Alice 上網找到一個公鑰的 uid 是 `Bob <b@exmaple.com>`，於是他就用這份公鑰加密訊息後傳給 Bob，但是這份公鑰其實是 C 偽裝的，那這樣祕密訊息就會被 C 知道。

為了解決這個問題，Alice 拿到公鑰後要開始傳訊息之前，需要先用一個可信的通道和 Bob 確認公鑰是否正確（當面比對 fingerprint 之類的），接者 Alice 用他的主密鑰幫 Bob 的公鑰簽章（Alice sign Bob's key），做出宣告「Alice 認為這把公鑰有效（來源和上面記載的是一致的，都是 Bob」（this key is validated）。這時候 Bob 也跟 Charlie 確認過公鑰並簽章（Bob sign Charlie's key），如果 Alice 「完整」信任 Bob 會認真確認公鑰真實性才簽章，那他就可以拿 Bob 的公鑰去驗證 Bob 真的簽章過 Charlie 的公鑰，那麼 Alice 可以根據這個結果相信 Charlie 的公鑰是真的，不用親自去找 Charlie 確認。  

> 「相信公鑰有效（真實性）」和「信任簽章公鑰的人」在 GPG 裡面都是 "trust" ，有點容易搞混，但中文還是可以稍微區分開來的  

對於公鑰簽章簽發者的信任層級可以分成以下五個  

1. 不知道
2. 不信任
3. 半信半疑
4. 完整信任
5. 終極信任

其中終極信任因為比較特別就先不談，在上面 Alice、Bob 和 Charlie 的例子裡，如果 Alice 沒有「完整信任」Bob，只有「半信半疑」，那麼 Charlie 的公鑰就不會被認為是有效的

目前為止的機制，我們要確認公鑰有效需要整條信任鍊之間都是「完整信任」且都被前一個確認是有效，但是這樣缺乏彈性。GPG 採用一個巧妙的方法來擴展目前的機制，一把公鑰如果滿足以下條件，就會被認定是有效的：

1. 被足夠多的有效的人（公鑰是有效的）簽章，這意味下面條件至少要滿足一個  
	1. 你親自對他簽章
	2. 被一個「完整信任」的人簽章
	3. 被三個「半信半疑」的人簽章
2. 從自己出發到那把公鑰的最短路徑小於等於五步
 
> 在實際使用時需要幾個半信半疑的人以及路徑長度限制都是可以調整的，這裡寫的是 GPG 預設的值

---

> **Danger**  
> 以下內容待驗證

```
       +----->Bob--------+
       |                 v
Alice--+            +-->Daniel----->Elsa------>Galen
       |            |     |
       |            |     |
       +->Charlie---+     |
                    |     v
                    +-->Frank
```

舉例來說，上圖以 Alice 為中心到 Galen 等六個人的信任關係，箭頭 `A--->B` 代表 A 為 B 的公鑰簽章，在以下的例子，我們調整為只需要兩個半信半疑的有效公鑰信任就可以信任為有效公鑰，但路徑不能超過三。

下表是基於這個信任網 Alice 對其他人的信任層級和推導出來的公鑰有效性結果。  
舉例來說，第一個情況是雖然 Alice 確認了 Bob 和 Charlie 的公鑰有效性，但是他只相信 Charlie ，根據這個可以推導出來 Daniel, Elsa, Frank 三人的公鑰都是有效的，因為 Alice 對 Charlie 是完整信任，因此 Charlie 確認過的公鑰對於 Alice 都是有效的。

| 情境  | 半信半疑             | 完整信任          | 一半有效      | 完整有效                    |
| :---: | :---                 | :---              | :---          | :---                        |
| 1     |                      | Charlie           |               | Bob, Charlie, Daniel, Frank |
| 2     | Bob, Chalir          |                   | Feank         | Bob, Charlie, Daniel        |
| 3     | Charlie, Daniel      |                   | Daniel, Frank | Bob, Charlie                |
| 4     | Charlie, Daniel, Bob |                   | Elsa          | Bob, Charlie, Frank         |
| 5     |                      | Bob, Daniel, Elsa |               | Bob, Daniel, Elsa, Frank    |
> 需要實驗驗證

根據我的理解，首先是自己簽的公鑰一定是有效的，再來是完整相信的人簽的也是有效，再來是夠多的半信半疑的人都簽章的公鑰也有效，最後你會發現，能夠延伸到最遠的有效公鑰是信任的人的外圍一圈不超過長度限制的地方。

--- 

信任網要解決的不是技術問題，是社交問題，就算今天 GPG 的設計改成有一個權威的驗證中心去發布每一把公鑰，還是會遇到一個問題，我憑什麼相信這個驗證中心？因此 GPG 採用的信任網可以讓我們從真實世界會接觸的人開始建立信任網，再漸漸地把信任網擴張，這時我們不是因為「這是權威」而信任一把公鑰而是因為我們做出足夠的判斷才決定一把未知公鑰是否可信。

> 這一小節參考 GPG 官方的教學文章 https://www.gnupg.org/gph/en/manual/x334.html

## 範例

### 產生金鑰對

### GPG with SSH

### 簽章公鑰

## 發佈公鑰

# Yubikey
