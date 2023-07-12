---
title: SSH Server
slug: ssh-server
date: '2023-07-12'
tags:
    - golang
    - ssh
categories:
    - golang
---

# SSH Server

## 開啟伺服器
### 建立設定

`main` 函數開頭先建立了 `ssh.ServerConfig`、把伺服器的金鑰讀進來

```go
func main(){
	// An SSH server is represented by a ServerConfig, which holds
	// certificate details and handles authentication of ServerConns.
	sshConfig := &ssh.ServerConfig{
		NoClientAuth: true,
	}

	// You can generate a keypair with 'ssh-keygen -t rsa -C "test@example.com"'
	privateBytes, err := ioutil.ReadFile("./key/host")
	if err != nil {
		log.Fatal("Failed to load private key (./id_rsa)")
	}

	private, err := ssh.ParsePrivateKey(privateBytes)
	if err != nil {
		log.Fatal("Failed to parse private key")
	}

	sshConfig.AddHostKey(private)

	...
}
```

### TCP 端口

開啟一個 tcp 端口，並等待進來的連線

```go
func main(){
	...

	// Once a ServerConfig has been configured, connections can be accepted.
	listener, err := net.Listen("tcp4", ":2222")
	if err != nil {
		log.Fatalf("failed to listen on *:2222")
	}

	// Accept all connections
	log.Printf("listening on %s", ":2222")
	for {
		tcpConn, err := listener.Accept()
		if err != nil {
			log.Printf("failed to accept incoming connection (%s)", err)
			continue
		}

		...
	}

	...
}
```

### 建立 SSH 連線

有 tcp 連線進來後，用他建立 ssh 連線，交握在這裡發生。然後把 chans 傳下去給其他函數處理，但為什麼把 sshConn 丟掉不理？不知道

```go
func main(){
	...

	for {
		...

		// Before use, a handshake must be performed on the incoming net.Conn.
		sshConn, chans, reqs, err := ssh.NewServerConn(tcpConn, sshConfig)
		if err != nil {
			log.Printf("failed to handshake (%s)", err)
			continue
		}

		// Check remote address
		log.Printf("new ssh connection from %s (%s)", sshConn.RemoteAddr(), sshConn.ClientVersion())

		// Print incoming out-of-band Requests
		go handleRequests(reqs)
		// Accept all channels
		go handleChannels(chans)
	}
}
```

`handleRequests` 只是紀錄而已，但我看到其他範例還會加上 `go ssh.DiscardRequests(reqs)`

```go
func handleRequests(reqs <-chan *ssh.Request) {
	for req := range reqs {
		log.Printf("recieved out-of-band request: %+v", req)
	}
}
```

## SSH Channel

### 建立 SSH Channel

接著是 `handleChannels`，主要的處理都在這裡面，函數一開始先用 `for` 等待新的 channel(`ssh.NewChannel`) 從 `chans(<- ssh.NewChannel)` 進來，如果 `ChannelType` 不是 `"session"` 的話，就丟掉他。
按照這裡的設計，看來一次連線可以開不只一個 channel，但我還沒想到過去經驗哪裡用到了這個東西

```go
func handleChannels(chans <-chan ssh.NewChannel) {
	// Service the incoming Channel channel.
	for newChannel := range chans {
		// Channels have a type, depending on the application level
		// protocol intended. In the case of a shell, the type is
		// "session" and ServerShell may be used to present a simple
		// terminal interface.
		if t := newChannel.ChannelType(); t != "session" {
			newChannel.Reject(ssh.UnknownChannelType, fmt.Sprintf("unknown channel type: %s", t))
			continue
		}
		channel, requests, err := newChannel.Accept()
		if err != nil {
			log.Printf("could not accept channel (%s)", err)
			continue
		}

		...
	}
}
```

### 建立 PTY（虛擬終端機）

接著建立一個 pty(Pseudo Terminal)，可以想像成打開終端機，忽略這步的話會在 client 收到 `PTY allocation request failed on channel 0`，但忽略掉也能動，或是 ssh 加上 `-T` 選項。

```go
func handleChannels(chans <-chan ssh.NewChannel) {
	// Service the incoming Channel channel.
	for newChannel := range chans {
		...

		// allocate a terminal for this channel
		log.Print("creating pty...")
		// Create new pty
		f, tty, err := pty.Open()
		if err != nil {
			log.Printf("could not start pty (%s)", err)
			continue
		}

		var shell string
		shell = os.Getenv("SHELL")
		if shell == "" {
			shell = DEFAULT_SHELL
		}

		...
	}
}
```

### 處理 SSH Request

現在 ssh 連線（conn）、通道（channel）都開好了，就等請求（request）進來了，用 goroutine 把一個 for 迴圈包起來，在迴圈裡處理進來的請求，並用 `switch` 把不同的 type 分開處理

```go
func handleChannels(chans <-chan ssh.NewChannel) {
	// Service the incoming Channel channel.
	for newChannel := range chans {
		...

		go func(requests <-chan *ssh.Request) {
			for req := range requests {
				log.Printf("%v %s", req.Payload, req.Payload)
				ok := false
				switch req.Type {
				case "exec":

					...

				case "shell":

					...

				case "pty-req":

					...

				case "window-change":

					...

				}

				if !ok {
					log.Printf("declining %s request...", req.Type)
				}

				req.Reply(ok, nil)
			}
		}(requests)
	}
}
```

#### exec

首先是 `exec`，`exec` 請求是指透過 `ssh localhost -p 2222 'ls -al` 這樣發出的 ssh 請求，因為不需要 pty，只要執行命令再把 stdout、stderr 丟回去就好，因此比較簡單  
首先先從 payload 裡取出命令本人，例如命令是 `ls -al` 的話 payload 會長這樣 `[0 0 0 6 108 115 32 45 97 108]`，最前面是一個 int 的資料代表後面有多長，以這裡的例子長度就是 6。這裡理論上要把前面三個 0 也都算進來，不過先假設命令不會太長，所以我們就取 `req.Paylod[3]` 當作命令長度（這樣的話命令就不能超過 251 位元，為什麼不是 255 位元？因為有四位元表示長度）  
取出命令之後就建立 `*exec.Cmd`，因為 `channel` 符合 `io.Writer` 和 `io.Reader` 界面，所以全部都指定成 `channel` 就好，然後執行。最後等待 process 執行結束就可以把 channel 關掉了

```go
case "exec":
	ok = true
	command := string(req.Payload[4 : req.Payload[3]+4])
	cmd := exec.Command(shell, []string{"-c", command}...)

	cmd.Stdout = channel
	cmd.Stderr = channel
	cmd.Stdin = channel

	err := cmd.Start()
	if err != nil {
		log.Printf("could not start command (%s)", err)
		continue
	}

	// teardown session
	go func() {
		_, err := cmd.Process.Wait()
		if err != nil {
			log.Printf("failed to exit bash (%s)", err)
		}
		channel.Close()
		log.Printf("session closed")
	}()
}
```

#### shell

然後是 shell 類型的請求，這個類型就是一般登入 ssh 那種 `ssh localhsot -p 2222`  
一開始建立一個 `*exec.Cmd`，但是不是以單一命令執行，是放進 pty 裡面。`sync.Once` 是一個可以確保只執行一次的機制，因為 `close` 函式可能會在不同 goroutine 被呼叫，第二次呼叫時會因為 `channel` 不能被關閉第二次，所以用這個東西來限制。

```go
case "shell":
	cmd := exec.Command(shell)
	cmd.Env = []string{"TERM=xterm"}
	err := PtyRun(cmd, tty)
	if err != nil {
		log.Printf("%s", err)
	}

	// Teardown session
	var once sync.Once
	close := func() {
		channel.Close()
		log.Printf("session closed")
	}

	// Pipe session to bash and visa-versa
	go func() {
		io.Copy(channel, f)
		once.Do(close)
	}()

	go func() {
		io.Copy(f, channel)
		once.Do(close)
	}()

	// We don't accept any commands (Payload),
	// only the default shell.
	if len(req.Payload) == 0 {
		ok = true
	}
```

#### pty-req, window-change

然後就是一些雜七雜八的的請求類型，像是調整視窗大小、client 請求開 pty 等等

```go
case "pty-req":
	// Responding 'ok' here will let the client
	// know we have a pty ready for input
	ok = true
	// Parse body...
	termLen := req.Payload[3]
	termEnv := string(req.Payload[4 : termLen+4])
	w, h := parseDims(req.Payload[termLen+4:])
	SetWinsize(f.Fd(), w, h)
	log.Printf("pty-req '%s'", termEnv)
case "window-change":
	w, h := parseDims(req.Payload)
	SetWinsize(f.Fd(), w, h)
	continue // no response
}
```

這裡用到的函數

```go
// parseDims extracts two uint32s from the provided buffer.
func parseDims(b []byte) (uint32, uint32) {
	w := binary.BigEndian.Uint32(b)
	h := binary.BigEndian.Uint32(b[4:])
	return w, h
}

// Winsize stores the Height and Width of a terminal.
type Winsize struct {
	Height uint16
	Width  uint16
	x      uint16 // unused
	y      uint16 // unused
}

// SetWinsize sets the size of the given pty.
func SetWinsize(fd uintptr, w, h uint32) {
	log.Printf("window resize %dx%d", w, h)
	ws := &Winsize{Width: uint16(w), Height: uint16(h)}
	syscall.Syscall(syscall.SYS_IOCTL, fd, uintptr(syscall.TIOCSWINSZ), uintptr(unsafe.Pointer(ws)))
}
```

## 全部的程式碼

```go
// Based on https://gist.github.com/jpillora/b480fde82bff51a06238
// A simple SSH server providing bash sessions
//
// Server:
// cd my/new/dir/
// ssh-keygen -t rsa #generate server keypair
// go get -v .
// go run sshd.go
//
// Client:
// ssh foo@localhost -p 2222

package main

import (
	"encoding/binary"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net"
	"os"
	"os/exec"
	"sync"
	"syscall"
	"unsafe"

	"github.com/creack/pty"
	"golang.org/x/crypto/ssh"
)

var DEFAULT_SHELL string = "sh"

func main() {
	// An SSH server is represented by a ServerConfig, which holds
	// certificate details and handles authentication of ServerConns.
	sshConfig := &ssh.ServerConfig{
		NoClientAuth: true,
	}

	// You can generate a keypair with 'ssh-keygen -t rsa -C "test@example.com"'
	privateBytes, err := ioutil.ReadFile("./key/host")
	if err != nil {
		log.Fatal("Failed to load private key (./id_rsa)")
	}

	private, err := ssh.ParsePrivateKey(privateBytes)
	if err != nil {
		log.Fatal("Failed to parse private key")
	}

	sshConfig.AddHostKey(private)

	// Once a ServerConfig has been configured, connections can be accepted.
	listener, err := net.Listen("tcp4", ":2222")
	if err != nil {
		log.Fatalf("failed to listen on *:2222")
	}

	// Accept all connections
	log.Printf("listening on %s", ":2222")
	for {
		tcpConn, err := listener.Accept()
		if err != nil {
			log.Printf("failed to accept incoming connection (%s)", err)
			continue
		}

		// Before use, a handshake must be performed on the incoming net.Conn.
		sshConn, chans, reqs, err := ssh.NewServerConn(tcpConn, sshConfig)
		if err != nil {
			log.Printf("failed to handshake (%s)", err)
			continue
		}

		// Check remote address
		log.Printf("new ssh connection from %s (%s)", sshConn.RemoteAddr(), sshConn.ClientVersion())

		// Print incoming out-of-band Requests
		go handleRequests(reqs)
		// Accept all channels
		go handleChannels(chans)
	}
}

func handleRequests(reqs <-chan *ssh.Request) {
	for req := range reqs {
		log.Printf("recieved out-of-band request: %+v", req)
	}
}

func handleChannels(chans <-chan ssh.NewChannel) {
	// Service the incoming Channel channel.
	for newChannel := range chans {
		// Channels have a type, depending on the application level
		// protocol intended. In the case of a shell, the type is
		// "session" and ServerShell may be used to present a simple
		// terminal interface.
		if t := newChannel.ChannelType(); t != "session" {
			newChannel.Reject(ssh.UnknownChannelType, fmt.Sprintf("unknown channel type: %s", t))
			continue
		}
		channel, requests, err := newChannel.Accept()
		if err != nil {
			log.Printf("could not accept channel (%s)", err)
			continue
		}

		// allocate a terminal for this channel
		log.Print("creating pty...")
		// Create new pty
		f, tty, err := pty.Open()
		if err != nil {
			log.Printf("could not start pty (%s)", err)
			continue
		}

		var shell string
		shell = os.Getenv("SHELL")
		if shell == "" {
			shell = DEFAULT_SHELL
		}

		// Sessions have out-of-band requests such as "shell", "pty-req" and "env"
		go func(requests <-chan *ssh.Request) {
			for req := range requests {
				// log.Printf("%v %s", req.Payload, req.Payload)
				ok := false
				switch req.Type {
				case "exec":
					ok = true
					command := string(req.Payload[4 : req.Payload[3]+4])
					cmd := exec.Command(shell, []string{"-c", command}...)

					cmd.Stdout = channel
					cmd.Stderr = channel
					cmd.Stdin = channel

					err := cmd.Start()
					if err != nil {
						log.Printf("could not start command (%s)", err)
						continue
					}

					// teardown session
					go func() {
						_, err := cmd.Process.Wait()
						if err != nil {
							log.Printf("failed to exit bash (%s)", err)
						}
						channel.Close()
						log.Printf("session closed")
					}()
				case "shell":
					cmd := exec.Command(shell)
					cmd.Env = []string{"TERM=xterm"}
					err := PtyRun(cmd, tty)
					if err != nil {
						log.Printf("%s", err)
					}

					// Teardown session
					var once sync.Once
					close := func() {
						channel.Close()
						log.Printf("session closed")
					}

					// Pipe session to bash and visa-versa
					go func() {
						io.Copy(channel, f)
						once.Do(close)
					}()

					go func() {
						io.Copy(f, channel)
						once.Do(close)
					}()

					// We don't accept any commands (Payload),
					// only the default shell.
					if len(req.Payload) == 0 {
						ok = true
					}
				case "pty-req":
					// Responding 'ok' here will let the client
					// know we have a pty ready for input
					ok = true
					// Parse body...
					termLen := req.Payload[3]
					termEnv := string(req.Payload[4 : termLen+4])
					w, h := parseDims(req.Payload[termLen+4:])
					SetWinsize(f.Fd(), w, h)
					log.Printf("pty-req '%s'", termEnv)
				case "window-change":
					w, h := parseDims(req.Payload)
					SetWinsize(f.Fd(), w, h)
					continue // no response
				}

				if !ok {
					log.Printf("declining %s request...", req.Type)
				}

				req.Reply(ok, nil)
			}
		}(requests)
	}
}

// =======================

// Start assigns a pseudo-terminal tty os.File to c.Stdin, c.Stdout,
// and c.Stderr, calls c.Start, and returns the File of the tty's
// corresponding pty.
func PtyRun(c *exec.Cmd, tty *os.File) (err error) {
	defer tty.Close()
	c.Stdout = tty
	c.Stdin = tty
	c.Stderr = tty
	c.SysProcAttr = &syscall.SysProcAttr{
		Setctty: true,
		Setsid:  true,
	}
	return c.Start()
}

// parseDims extracts two uint32s from the provided buffer.
func parseDims(b []byte) (uint32, uint32) {
	w := binary.BigEndian.Uint32(b)
	h := binary.BigEndian.Uint32(b[4:])
	return w, h
}

// Winsize stores the Height and Width of a terminal.
type Winsize struct {
	Height uint16
	Width  uint16
	x      uint16 // unused
	y      uint16 // unused
}

// SetWinsize sets the size of the given pty.
func SetWinsize(fd uintptr, w, h uint32) {
	log.Printf("window resize %dx%d", w, h)
	ws := &Winsize{Width: uint16(w), Height: uint16(h)}
	syscall.Syscall(syscall.SYS_IOCTL, fd, uintptr(syscall.TIOCSWINSZ), uintptr(unsafe.Pointer(ws)))
}
```

## 參考資料
* https://github.com/Scalingo/go-ssh-examples/blob/master/server_complex.go
* https://pkg.go.dev/golang.org/x/crypto/ssh
