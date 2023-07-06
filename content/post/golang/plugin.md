---
title: Golang Plguin
slug: plguin
date: '2022-02-21'
tags:
  - plugin
  - share object
categories:
  - golang
---

# Go 動態載入程式

Go 是一個編譯式的語言，也就是說他不像 JS 那樣可以動態執行程式碼。像是 [Hexo](https://github.com/hexojs/hexo) 和 [Hugo](https://github.com/gohugoio/hugo)，前者因為是 JS 寫的，因此支援非常豐富的外掛，但後者因為是 Go 寫的，因此在不使用其他直譯式程式語言的情況下，很難製作外掛。  
另一個 Go 寫的軟體 [ponzu](https://github.com/ponzu-cms/ponzu) 則是在加入一段程式碼後，重新編譯自己。這麼做解決了外掛的問題，而且又不會失去 Go 的快速，但是就必須保留整個主程式的原始碼，而且也不那麼的「動態」

> ponzu 這個軟體兩年沒人維護了，很多東西都怪怪的，超級難編譯

# Plugin in Go

在 1.8 版的時候，Go 推出了 [Plguin](https://pkg.go.dev/plugin) 套件，可以將外掛和主程式分開編譯，如果外掛有更動，不需要重新編譯主程式；主程式也可以動態載入外掛。

# 外掛

如果要將一個 package 編譯成外掛，首先他的 `package` 必須是 `main`，但是裡面的函式 `main`、`init` 都不會被執行，只有大寫開頭的變數、型態、函式會被暴露給主程式。  
編譯外掛時，需要加上 `-buildmode=plguin`，這樣 `go build` 就會將原始碼編譯成 `.so`（share object）檔，這樣就可以被主程式呼叫。

# 主程式

主程式要載入外掛前，需要引用 `plugin` 套件

```go
import "plugin"
```

用 `func Open(path string) (*Plugin, error)` 可以載入一個編譯過的外掛，如果重複呼叫這個函式，除了第二次外都會回傳第一次載入的結果，也就是說假如你在很多個 gorutine 中載入同一個外掛，go 會保證他是「安全」的。注意看，`path` 是個字串，因此你可以動態產生外掛的路徑，不需要寫死。  
載入完了之後，用 `func (p *Plugin) Lookup(symName string) (Symbol, error)` 可以取得外掛暴露出來的變數、函式，因為 `symName` 是字串，因此這裡也可以動態選擇要的變數。現在你有一個型態是 `Symbol` 的變數了，其實這個 `Symbol` 就是 `interface{}` 所以不管要做什麼事，你都要先用 `symbol.(type)` 取得他真實的值和型態。接下來就可以隨意的使用他了。

# 範例

> 以下摘自 https://github.com/simbafs/go-plugin-test

## main.go

```go
package main

import (
	"bufio"
	"fmt"
	"plugin"
	"strings"
	"os"
)

func main() {
	stdin := bufio.NewReader(os.Stdin)
	for {
		fmt.Printf("> ")
		rawCmd, err := stdin.ReadString('\n')
		if err != nil {
			fmt.Println(err)
			continue
		}

		cmd := strings.Split(rawCmd, " ")
		for k, v := range cmd {
			cmd[k] = strings.TrimSpace(v)
		}

		if cmd[0] == "exit" {
			break
		}
		p, err := plugin.Open(fmt.Sprintf("./dist/%s.so", cmd[0]))
		if err != nil {
			fmt.Println(err)
			continue
		}

		f, err := p.Lookup("Exec")
		if err != nil {
			fmt.Println(err)
			continue
		}

		f.(func([]string) error)(cmd)
	}

}
```

## plugins/ls.go

```go
package main

import "os/exec"
import "os"
import "fmt"

func Exec(args []string) error {
	ls := exec.Command("ls", args[1:]...)
	ls.Stdout = os.Stdout
	ls.Stderr = os.Stderr
	return ls.Run()
}
```
