+++
title = "docker login error"
date = "2020-12-05"
tags = [ "docker", "linux" ]
categories = [ 'linux', "docker" ]
+++

# Docker Login Error
## 錯誤說明
昨天我在 terminal 登入 docker 的時候發現不知道為什麼不能登入，我先透過網頁登入確認過密碼沒有問題，也不是打錯字的關係，但還是不能當入。總是會有類似以下的錯誤訊息。
```
Error saving credentials: error storing credentials - err: exit status 1, out: `exit status 1: gpg: simbafs: 已跳過: 沒有公鑰
gpg: [stdin]: encryption failed: 沒有公鑰
Password encryption aborted.`
```

## 解決方法
經過搜尋之後，我按照 [https://github.com/docker/docker-credential-helpers/issues/102#issuecomment-388634452](https://github.com/docker/docker-credential-helpers/issues/102#issuecomment-388634452) 的方法成功登入了，但是在這之前要先安裝 `gpg` 和 `pass`
```bash
apt install gnupg2 pass
```

接下來是我用的指令
```bash
apt install gnupg2
wget https://github.com/docker/docker-credential-helpers/releases/download/v0.6.3/docker-credential-pass-v0.6.3-amd64.tar.gz
tar xvf docker-credential-pass-v0.6.3-amd64.tar.gz 
chmod 755 docker-credential-pass
sudo mv docker-credential-pass /usr/bin/
ass insert docker-credential-helpers/docker-pass-initialized-check
pass insert docker-credential-helpers/docker-pass-initialized-check
pass show docker-credential-helpers/docker-pass-initialized-check
docker-credential-pass list
docker login
```

## 參考連結
- [https://github.com/docker/docker-credential-helpers/issues/102#issuecomment-388634452](https://github.com/docker/docker-credential-helpers/issues/102#issuecomment-388634452)  
- [https://stackoverflow.com/questions/50151833/cannot-login-to-docker-account/52881198#52881198](https://stackoverflow.com/questions/50151833/cannot-login-to-docker-account/52881198#52881198)  
- [https://gist.github.com/dataday/3c267be29e32573829c4781c99ea3395](https://gist.github.com/dataday/3c267be29e32573829c4781c99ea3395)  
