---
title: SSH Server Key Auth
slug: ssh-server-key-auth
date: '2023-07-12'
tags: 
    - golang
    - ssh
    - authentication
    - publicKey
    - sshKey
categories:
    - golang
---

# SSH Server Key Auth

在 [golang/ssh-server](../ssh-server) 中的 ssh 伺服器是沒有驗證使用者身份的，因為在 `ssh.ServerConfig` 中設定了 `NoClientAuth: true`。用下面的 `ssh.SererConfig` 可以設定用只有指定的使用者可以進入，不過這個版本中沒有處理時序攻擊（Timming attack），也就是用比對公鑰的時間不同獲取資訊的攻擊手段。

## 程式

```go
var allowedUser = map[string][]string{
	"simbafs": {
		"ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIHcLVJDmYggMFXJ3CqMOSMnBkkDX1982cdd3rmRqfpMC simba@simba-nb",
	},
}

func CompareKey(key ssh.PublicKey, pubKeyStr string) bool {
	// compare two keys
	pubKey, _, _, _, err := ssh.ParseAuthorizedKey([]byte(pubKeyStr))
	if err != nil {
		return false
	}

	return ssh.FingerprintSHA256(key) == ssh.FingerprintSHA256(pubKey)
}

sshConf := &ssh.ServerConfig{
	NoClientAuth: false,
	PublicKeyCallback: func(conn ssh.ConnMetadata, key ssh.PublicKey) (*ssh.Permissions, error) {
		// find if the public key is in the allowed list
		for user, keys := range allowedUser {
			for _, pubKey := range keys {
				if CompareKey(key, pubKey) {
					log.Printf("User %q authenticated with key %s\n", user, ssh.FingerprintSHA256(key))

					return &ssh.Permissions{
						Extensions: map[string]string{
							"user":  user,
							"pk-fp": ssh.FingerprintSHA256(key),
						},
					}, nil
				}
			}
		}
		return nil, fmt.Errorf("unknown public key for %q", conn.User())
	},
}
```

## 參考資料
* https://pkg.go.dev/golang.org/x/crypto/ssh
