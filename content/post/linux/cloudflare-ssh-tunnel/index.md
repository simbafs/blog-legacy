---
title: Cloudflare SSH Tunnel
slug: cloudflare-ssh-tunnel
date: '2023-09-16T00:00:00.000Z'
tags:
  - ssh
  - zero trust
  - cloudflared
  - cloudflare
  - tunnel
categories:
  - linux
  - cloudflare-ssh-tunnel
---

# Cloudflare SSH Tunnel
先新增 self host application，選 webssh，然後建立同一個網域的 ssh tunnel，完成！細節請參考 https://chriskirby.net/web-browser-ssh-terminal-to-homelab-with-cloudflare-zero-trust/    
用戶端只需要裝 cloudflared 就好，不用塞 token，當第一次連線時會開啟一個瀏覽器視窗驗證身分，驗證完的 token 會存在 `~/.cloudflared/` 下，第二次連線就感受不到 cloudflared 的存在了

## 好處
因為 application 可以選擇只有某些 email 才能進入，因此 ssh 的使用者密碼也就不那麼重要了，畢竟前面已經保證只有允許的使用者才能進來，當然這是自己玩的情況。我以前以為需要給 token 才能連線，這樣就合理多了。
