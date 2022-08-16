+++
title = "p2p"
slug = ""
date = 2022-08-16T19:55:15+08:00
+++

我不太確定這是 p2p 還是穿隧，但反正功能就是可以讓兩個在不同內網的機器可以直連，不需要透過中央伺服器轉發。先上原理圖，然後再來一步一步看程式碼

![explain.png](https://github.com/simbafs/experiment-p2p/raw/main/explain.png)

# Server
首先，先來看伺服器端，這邊做的事很簡單，這邊開了一個 UDP listener，然後開一個陣列存兩個 client 的 `UDPAddr`
```go
listener, err := net.ListenUDP("udp", &net.UDPAddr{
	IP:   net.IPv4zero,
	Port: port,
})
if err != nil {
	log.Println(err)
}
peers := make([]net.UDPAddr, 0, 2)
```
然後在 for 迴圈中傾聽連線，這邊收到的 `data` 會是一串不重要的訊息，但是 `ReadFromUDP` 回傳的 `remoteAddr` 就很重要，要存起來
```go
for {
	n, remoteAddr, err := listener.ReadFromUDP(data)
	if err != nil {
		log.Printf("err during read: %s\n", err)
	}
	peers = append(peers, *remoteAddr)
```
到這邊，可能就結束了，但是如果這時候是第二個連線（`len(peers) == 2`），就可以開始建立 p2p 連線，將 A 的 addr 傳給 B，將 B 的 addr 傳給 A。然後若干秒後結束伺服器，伺服器端的程式碼就到這裡結束了
```go
	if len(peers) == 2 {
		listener.WriteToUDP([]byte(peers[1].String()), &peers[0])
		listener.WriteToUDP([]byte(peers[0].String()), &peers[1])
		time.Sleep(time.Second * 8)
		return
	}
}
```

# Client
伺服器端首先要和伺服器建立連線，從本地（`srcAddr`）連線到伺服器（`dstAddr`）
```go
srcAddr := &net.UDPAddr{
	IP:   net.IPv4zero,
	Port: 9901,
}
dstAddr := &net.UDPAddr{
	IP:   serverIP,
	Port: port,
}
conn, err := net.DialUDP("udp", srcAddr, dstAddr)
if err != nil {
	log.Fatalf("DialUDP: %s\n", err)
}
```
然後傳送一段不重要的訊息，這邊主要作用是讓伺服器知道我們這個連現在 NAT 外的 ip 和 port。
```go
if _, err = conn.Write([]byte("hello,I'm new peer:" + tag)); err != nil {
	log.Fatalf("conn.Write: %s\n", err)
}
```
接著建立一個空間，等到兩個 client 都連線後這邊會收到對方的 ip 和 port，然後這個連線就可以先關掉了。接著將收到的 addr 解析成 `*net.UDPAddr`
```go
data := make([]byte, 1024)
n, remoteAddr, err := conn.ReadFromUDP(data)
if err != nil {
	log.Fatalf("error during read: %s", err)
}
conn.Close()
anotherPeer := parseAddr(string(data[:n]))
```
然後發起第二個連線，從本地（`srcAddr`）到另一個 client（`anotherAddr`），這裡就沒有經過伺服器了。
```go
conn, err := net.DialUDP("udp", srcAddr, anotherAddr)
if err != nil {
	log.Println("send handshake:", err)
}
```
這時 p2p 連線就已經建立起來了，為了驗證雙向都可以通，我們在一個 gorutine 中每十秒送串隨機數字
```go
go func() {
	r1 := rand.New(rand.NewSource(time.Now().UnixNano()))
	for {
		data := fmt.Sprintf("[%s]: %d", tag, r1.Intn(100))
		time.Sleep(10 * time.Second)
		log.Printf("send: %s\n", data)
		if _, err = conn.Write([]byte(data)); err != nil {
			log.Fatalf("send msg fail: %s", err)
		}
	}
}()
```
在原本的 gorutine 中接收對方傳來的訊息
```go
for {
	data := make([]byte, 1024)
	n, _, err := conn.ReadFromUDP(data)
	if err != nil {
		log.Printf("error during read: %s\n", err)
	} else {
		log.Printf("receive: %s\n", data[:n])
	}
}
```

# 程式碼
[完整的程式碼](https://github.com/simbafs/experiment-p2p) 在這，如果對你有幫助，順手給的 star 

# 心得
如果我沒理解錯，會選用 UDP 做 p2p 是因為 UDP 的連線關掉後 NAT 不會把洞關起來，所以一開始往伺服器發訊息的動作就是在打洞，然後把洞的資訊送到另一邊，接著就可以透過這的洞直連。而 TCP 一斷掉連線洞就會關起來，所以無法做 p2p（這是個人猜測，無根據）。  
這時候我就很好奇，應該有人做這種公共的 p2p server 吧？搭配 SDK 應該可以很輕鬆的做到任意兩台裝置連線，這樣伺服器的 loading 也不重，需要的資源也很低，感覺可以來開一個。  
接著我應該會去研究是否有辦法用 TCP 做 p2p，或是如何在 UDP 上搭建一個可信賴的通訊。接著遠程目標大概是 IPFS 之類的  
