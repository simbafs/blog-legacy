+++
title = "SSH Tunnel"
date = "2020-02-24"
tags = [ "ssh", "linux", 'tunnel' ]
categories = [ "linux" ]
+++

# SSH Tunnel

昨天架好了 reverse ssh 讓我可以連回學校 server
今天來研究 ssh tunnel

## 簡介

ssh tunnel 分正反向
其實他們的差別只有在方向不一樣
連語法參數都一樣

## 正向 tunnel

正向的 tunnel 參數是 -L
語法：

```
ssh -L [bind_address:]port:host:hostport
ssh -L [bind_address:]port:remote_socket
ssh -L local_socket:host:hostport
ssh -L local_socket:remote_socket
```

## 反向 tunnel

```
ssh -R [bind_address:]port:host:hostport
ssh -R [bind_address:]port:local_socket
ssh -R remote_socket:host:hostport
ssh -R remote_socket:local_socket
ssh -R [bind_address:]port
```

## 心得

看起來好像很難
但是其實用下面這個就夠了
正向：

```
ssh -L <local port>:localhost:<remote port> <user>@<remote>
```

反向;

```
ssh -R <remote port>:localhost:<local port> <user>@<remote>
```

總而言之就是前面的和選項一樣
如果是 -L 那前面就是 local port
如果是 -R 那前面就是 remote port

## 參考連結

https://johnliu55.tw/ssh-tunnel.html
