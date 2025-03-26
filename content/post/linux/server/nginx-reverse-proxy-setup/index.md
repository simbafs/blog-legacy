---
title: Nginx Reverse Proxy Setup
slug: nginx-reverse-proxy-setup
date: '2020-02-13T00:00:00.000Z'
tags:
  - nginx
  - reverse proxy
  - certbot
categories:
  - linux
  - server
  - nginx-reverse-proxy-setup
---

# nginx 反向代理伺服器 (reverse proxy)

之前社網 server 因為學校防火牆限制只能對外開 80 443 兩個 port  
而且我們只有一個 ip (203.64.138.177)  
所以要用 reverse proxy 來代理我們的多項服務  
原本我只會用 apache2
後來不知道是不是因為 apache 太肥導致有時候回應時間會很久  
所以我起了將 proxy server 換成 nginx 的想法
