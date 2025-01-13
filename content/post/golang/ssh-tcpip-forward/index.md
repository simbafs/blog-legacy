---
title: SSH TCP/IP Forward
slug: ssh-tcpip-forward
date: '2023-07-14T00:00:00.000Z'
tags:
  - golang
  - ssh
  - tcpip-forward
  - proxy
categories:
  - golang
image: /og/golang/ssh-tcpip-forward.png
---

# Ssh TCP/IP Forward

這篇文章是講怎麼用 golang 寫一個 ssh server 可以執行 tcp 轉發，這方面的資料在 Google 講的特別少，有可能都被「我的 ssh 壞掉了不會轉發怎麼辦」淹沒了，然後類似的專案又太複雜很難懂。研究兩天的結論是去看 RFC（Request For Comments） 最快，裡面寫得最清楚。

目前這個版本只適用把本地端口開到伺服器上，也就是 `ssh -R`，反向的 `ssh -L` 的之後再研究補充。

## 開啟伺服器

跟 [golang/ssh-server](../ssh-server) 一樣，先開啟 tcp 連接埠，並在在上面開 ssh 伺服器

```go
func GetHostKey(keyPath string) (ssh.Signer, error) {
	privateBytes, err := ioutil.ReadFile(keyPath)
	if err != nil {
		return nil, err
	}

	private, err := ssh.ParsePrivateKey(privateBytes)
	if err != nil {
		return nil, err
	}

	return private, nil
}

func GetLogf(name string) func(format string, args ...interface{}) {
	return func(format string, args ...interface{}) {
		log.Printf(name+": "+format, args...)
	}
}

func main() {
	if err := StartTcpServer(); err != nil {
		fmt.Printf("Oops, there's an error: %v\n", err)
	}
}

func StartTcpServer() error {
	logf := GetLogf("StartTcpServer")
	private, err := GetHostKey("./key/host")
	if err != nil {
		return fmt.Errorf("unable to read private key: %w", err)
	}

	sshConf := &ssh.ServerConfig{
		NoClientAuth: true,
	}
	sshConf.AddHostKey(private)

	listener, err := net.ListenTCP("tcp", &net.TCPAddr{
		IP:	 net.IPv4(0, 0, 0, 0),
		Port: 2222,
	})
	if err != nil {
		return fmt.Errorf("unable to listen: %w", err)
	}
	defer func() {
		listener.Close()
		logf("TCP listener closed")
	}()

	log.Printf("Listening on %s\n", listener.Addr().String())

	for {
		tcpConn, err := listener.AcceptTCP()
		if err != nil {
			logf("Unable to accept connection: %v\n", err)
			continue
		}

		go HandleSSHConnection(tcpConn, sshConf)
	}
}

func HandleSSHConnection(tcpConn *net.TCPConn, sshConf *ssh.ServerConfig) {
	logf := GetLogf("HandleSSHConnection")
	defer func() {
		tcpConn.Close()
		logf("TCP connection from %s closed\n", tcpConn.RemoteAddr())
	}()

	tcpConn.SetKeepAlive(true)

	sshConn, _, reqs, err := ssh.NewServerConn(tcpConn, sshConf)
	if err != nil {
		logf("Unable to handshake: %v\n", err)
		return
	}
	defer func() {
		sshConn.Close()
		logf("SSH connection from %s closed\n", sshConn.RemoteAddr())
	}()

	logf("Connection from %s\n", sshConn.RemoteAddr())

	...
}

```

## Global Request

接下來就跟 [golang/ssh-server](../ssh-server) 不一樣了，之前的 `ptr-req` 跟 `exec`、`env` 都被放在 [RFC4254 section 6](https://www.rfc-editor.org/rfc/rfc4254#section-6) 下，而 `tcpip-forward` 卻是在 [RFC4254 section 7](https://www.rfc-editor.org/rfc/rfc4254#section-7)，意思是他們完全不一樣。section 6 下的東西都是 **Interactive Session**，要 **客戶端** 先開 channel（`SSH_MSG_CHANNEL_OPEN`）再送 channel request（`SSH_MSG_CHANNEL_REQUEST`） 決定 channel 類別。section 7 下的 tcpip forwarding 則是先送 Global request（`SSH_MSG_GLOBAL_REQUEST`）告訴伺服器要在哪個位址上開啟哪個 port，伺服器說 ok 後再由**伺服器**開啟 channel（注意這裡 channel 由誰開啟不一樣）

### channel、session 與 request

#### Channel

channel 和 request 是在 ssh protocol 中地位相同的兩個東西，一個是能持續讀寫的東西，在 golang 中是一個實作了 [io.ReadWriter](https://pkg.go.dev/io#ReadWriter)。也就是說可以把他丟進 `fmt.Fprintf` 之類的函數的第一個參數

#### Session

session channel 和 tcpip-forward channel 都是 channel 的一個類型，定義在 [RFC4254 section 5](https://www.rfc-editor.org/rfc/rfc4254#section-5)，是比 channel 低一階的概念

#### Request

request 是單次一來一回的通訊，分成 Global request（`SSH_MSG_GLOBAL_REQUEST`） 和 Channel request（`SSH_MSG_CHANNEL_REQUEST`），Global request 目前我只看到在開啟 tcpip-forward channel 時會用到，而 Channel request 會在開啟 session channel 後開啟 pty、執行命令、開啟 x11 forwarding、傳遞環境變數等等（我也不知道位什麼 x11 forwarding 和 tcpip forwarding 不一樣）。跟 HTTP 一樣，request 都是用在請求某種資源的時候使用

### Global request

回到程式，我們需要處理之前沒處理的 global request，而 channel（由客戶端開啟的）就不需要了。

```go
func HandleSSHConnection(tcpConn *net.TCPConn, sshConf *ssh.ServerConfig) {
	...

	for req := range reqs {
		switch req.Type {
		case "tcpip-forward":
			HandleTCPForwardRequest(req, sshConn)
		default:
			logf("Global Req: Unknown request: %s\n", req.Type)
		}
	}
}
```

### 抓出 addr 和 port

因為我們要求在伺服器上某個連接埠的封包要透過 ssh 轉到客戶端上某個連接埠，因此要先從 Global request 中抓出 addr 和 port，根據 RFC 的描述，這個 Global request 會長這樣

```
byte			SSH_MSG_GLOBAL_REQUEST
string		"tcpip-forward"
boolean	 want reply
string		address to bind (e.g., "0.0.0.0")
uint32		port number to bind
```

前三個是固定的欄位 golang 會先幫我們處理，後面兩個會被放在 `req.paylaod` 裡面，我們需要定義一個 `struct` 然後用 `ssh.Unmarshal` 把他從 `[]byte` 轉成我們要的資料，這裡欄位名稱不重要，順序比較重要。

```go
func HandleTCPForwardRequest(req *ssh.Request, sshConn *ssh.ServerConn) {
	logf := GetLogf("HandleTCPForwardRequest")

	var payload struct {
		Addr string
		Port uint32
	}
	if err := ssh.Unmarshal(req.Payload, &payload); err != nil {
		logf("Unable to unmarshal payload: %v\n", err)
		req.Reply(false, nil)
		return
	}

	logf("tcpip-forward: %s:%d\n", payload.Addr, payload.Port)
	logf("want reply: %v\n", req.WantReply)

	...
}
```

### 開啟 TCP 連接埠

有了 `addr` 和 `port` 後，就可以開啟 tcp 連接埠，如果沒問題就可以告訴客戶端一切 ok 了

```go

func HandleTCPForwardRequest(req *ssh.Request, sshConn *ssh.ServerConn) {..
	...

	listener, err := net.Listen("tcp", fmt.Sprintf("%s:%d", payload.Addr, payload.Port))
	if err != nil {
		logf("Unable to dial: %v\n", err)
		req.Reply(false, nil)
		return
	}
	defer func() {
		listener.Close()
		logf("listener closed")
	}()

	req.Reply(true, nil)

	...
}
```

### 轉發 TCP 封包

接著當伺服器上新開的 TCP 連接埠後，如果有新的連線進來，就開啟一個 `forwarded-tcpip` 的 channel，然後就是把兩邊串起來了

```go
func HandleTCPForwardRequest(req *ssh.Request, sshConn *ssh.ServerConn) {..
	...

	for {
		conn, err := listener.Accept()
		if err != nil {
			logf("Unable to accept: %v\n", err)
			continue
		}

		channel, _, err := sshConn.OpenChannel("forwarded-tcpip", ssh.Marshal(struct {
			Addr       string
			Port       uint32
			OriginAddr string
			OriginPort uint32
		}{
			payload.Addr,
			payload.Port,
			sshConn.RemoteAddr().String(),
			uint32(sshConn.RemoteAddr().(*net.TCPAddr).Port),
		}))
		if err != nil {
			logf("Unable to open channel: %v\n", err)
			return
		}
		defer func() {
			channel.Close()
			logf("channel closed")
		}()

		go forwardData(conn, channel)
	}
}
```

### 串起兩邊

當上面一切就緒，下面就是簡單的 proxy，因為資料是雙向的，所以需要兩個 `io.Copy` 來串資料，當任意一個結束後（EOF），就要把兩個都關掉，然後結束這個函式。首先是「任意一個結束就...」這個任務，用 `sync.Once` 確保只會被執行一次，然後用一個 unbuffer 來阻止函數結束（因為兩個 `io.Copy` 都是在 goroutine 裡，不會阻塞函數）。這裡如果沒有確實把所有東西關閉會導致只能發一次 tcp 連線，然後伺服器就卡住...（這個東西陰了我好久）

```go
func forwardData(conn net.Conn, channel ssh.Channel) {
	logf := GetLogf("forwardData")

	var once sync.Once
	wait := make(chan int, 0)

	close := func() {
		conn.Close()
		channel.Close()
		logf("forwardData closed")
		wait <- 1
	}

	// Copy data from local connection to remote channel
	go func() {
		_, err := io.Copy(channel, conn)
		if err != nil {
			logf("Unable to copy from local to remote: %v\n", err)
		}
		logf("EOF from remote")
		once.Do(close)
	}()

	go func() {
		// Copy data from remote channel to local connection
		_, err := io.Copy(conn, channel)
		if err != nil {
			logf("Unable to copy from remote to local: %v\n", err)
		}
		logf("EOF from local")
		once.Do(close)
	}()

	<-wait
}
```

## 完整程式碼

```go
package main

import (
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net"
	"sync"

	"golang.org/x/crypto/ssh"
)

func GetHostKey(keyPath string) (ssh.Signer, error) {
	privateBytes, err := ioutil.ReadFile(keyPath)
	if err != nil {
		return nil, err
	}

	private, err := ssh.ParsePrivateKey(privateBytes)
	if err != nil {
		return nil, err
	}

	return private, nil
}

func GetLogf(name string) func(format string, args ...interface{}) {
	return func(format string, args ...interface{}) {
		log.Printf(name+": "+format, args...)
	}
}

func main() {
	if err := StartTcpServer(); err != nil {
		fmt.Printf("Oops, there's an error: %v\n", err)
	}
}

func StartTcpServer() error {
	logf := GetLogf("StartTcpServer")
	private, err := GetHostKey("./key/host")
	if err != nil {
		return fmt.Errorf("unable to read private key: %w", err)
	}

	sshConf := &ssh.ServerConfig{
		NoClientAuth: true,
	}
	sshConf.AddHostKey(private)

	listener, err := net.ListenTCP("tcp", &net.TCPAddr{
		IP:   net.IPv4(0, 0, 0, 0),
		Port: 2222,
	})
	if err != nil {
		return fmt.Errorf("unable to listen: %w", err)
	}
	defer func() {
		listener.Close()
		logf("TCP listener closed")
	}()

	log.Printf("Listening on %s\n", listener.Addr().String())

	for {
		tcpConn, err := listener.AcceptTCP()
		if err != nil {
			logf("Unable to accept connection: %v\n", err)
			continue
		}

		go HandleSSHConnection(tcpConn, sshConf)
	}
}

func HandleSSHConnection(tcpConn *net.TCPConn, sshConf *ssh.ServerConfig) {
	logf := GetLogf("HandleSSHConnection")
	defer func() {
		tcpConn.Close()
		logf("TCP connection from %s closed\n", tcpConn.RemoteAddr())
	}()

	tcpConn.SetKeepAlive(true)

	sshConn, _, reqs, err := ssh.NewServerConn(tcpConn, sshConf)
	if err != nil {
		logf("Unable to handshake: %v\n", err)
		return
	}
	defer func() {
		sshConn.Close()
		logf("SSH connection from %s closed\n", sshConn.RemoteAddr())
	}()

	logf("Connection from %s\n", sshConn.RemoteAddr())

	for req := range reqs {
		switch req.Type {
		case "tcpip-forward":
			HandleTCPForwardRequest(req, sshConn)
		default:
			logf("Global Req: Unknown request: %s\n", req.Type)
		}
	}
}

func HandleTCPForwardRequest(req *ssh.Request, sshConn *ssh.ServerConn) {
	logf := GetLogf("HandleTCPForwardRequest")

	var payload struct {
		Addr string
		Port uint32
	}
	if err := ssh.Unmarshal(req.Payload, &payload); err != nil {
		logf("Unable to unmarshal payload: %v\n", err)
		req.Reply(false, nil)
		return
	}

	logf("tcpip-forward: %s:%d\n", payload.Addr, payload.Port)
	logf("want reply: %v\n", req.WantReply)

	listener, err := net.Listen("tcp", fmt.Sprintf("%s:%d", payload.Addr, payload.Port))
	if err != nil {
		logf("Unable to dial: %v\n", err)
		req.Reply(false, nil)
		return
	}
	defer func() {
		listener.Close()
		logf("listener closed")
	}()

	req.Reply(true, nil)

	for {
		conn, err := listener.Accept()
		if err != nil {
			logf("Unable to accept: %v\n", err)
			continue
		}

		channel, _, err := sshConn.OpenChannel("forwarded-tcpip", ssh.Marshal(struct {
			Addr       string
			Port       uint32
			OriginAddr string
			OriginPort uint32
		}{
			payload.Addr,
			payload.Port,
			sshConn.RemoteAddr().String(),
			uint32(sshConn.RemoteAddr().(*net.TCPAddr).Port),
		}))
		if err != nil {
			logf("Unable to open channel: %v\n", err)
			return
		}
		defer func() {
			channel.Close()
			logf("channel closed")
		}()

		go forwardData(conn, channel)
	}
}

func forwardData(conn net.Conn, channel ssh.Channel) {
	logf := GetLogf("forwardData")

	var once sync.Once
	wait := make(chan int, 0)

	close := func() {
		conn.Close()
		channel.Close()
		logf("forwardData closed")
		wait <- 1
	}

	// Copy data from local connection to remote channel
	go func() {
		_, err := io.Copy(channel, conn)
		if err != nil {
			logf("Unable to copy from local to remote: %v\n", err)
		}
		logf("EOF from remote")
		once.Do(close)
	}()

	go func() {
		// Copy data from remote channel to local connection
		_, err := io.Copy(conn, channel)
		if err != nil {
			logf("Unable to copy from remote to local: %v\n", err)
		}
		logf("EOF from local")
		once.Do(close)
	}()

	<-wait
}
```

## 心得

ssh protocol 比我想像的還要複雜，像是 tcp forwarding 和 x11 forwarding 為什麼差這麼多？個人猜測可能是跟他們在 OSI 模型中不同層的關係。而一個東西要真的了解他在幹麻還是讀文件最快，如果我只看 Google 上別人的文章、程式碼和 ChatGPT 的唬爛，也許我在 Global request 之前就放棄了，再不然也會被 tcpip-forward channel 和 session chennel 發起人不同卡住做不下去。
