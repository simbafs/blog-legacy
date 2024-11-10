---
title: Openssl DES
slug: openssl-DES
date: '2022-10-02T00:00:00.000Z'
tags:
  - cryptography
  - encryption
  - decryption
categories:
  - linux
image: /og/linux/openssl-DES.png
---

# openssl DES

## 加密

```
openssl enc -des-cbc -a -K e0e0e0e0f1f1f1f1 -in plaintext.txt -provider legacy
```

```
-des-cbc: 指定演算法
-a: 使用 base64
-K: 指定密碼
-provider legacy: 因為 DES 太古老，不安全，因此要加上這個選項才能用
```

## 解密

```
openssl enc -des-cbc -d -a -K e0e0e0e0f1f1f1f1 -in plaintext.txt -provider legacy
```

```
-des-cbc: 指定演算法
-d: 解密
-a: 使用 base64
-K: 指定密碼
-provider legacy: 因為 DES 太古老，不安全，因此要加上這個選項才能用
```

## 注意事項

openssl 的選項都是一個 `-`，不像一般的 GNU 命令分長選項和短選項。另外 `-d` 和 `-a` 不能合併成 `-da` 或是 `-ad`

## 參考資料

-   https://wiki.openssl.org/index.php/Enc
-   https://github.com/openssl/openssl/issues/12906
