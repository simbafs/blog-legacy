+++
title = "ExecCmd"
slug = "exec-cmd"
date = 2021-10-19T00:06:19+08:00
tags = ['exec', 'process']
categories = ['go']
+++

# Golang 執行外部命令
```go
package main

import (
	"fmt"
	"os/exec"
)

func checkErr(err error) {
	if err != nil {
		panic(err)
	}
}

func main() {
	pw := exec.Command("wc")

	stdin, err := pw.StdinPipe()
	checkErr(err)

	fmt.Fprintln(stdin, "fjasdfkjsad\njdfaksdfjksdfjkasdfj\ndjfkajsdk")

	output, err := pw.Output()
	checkErr(err)

	fmt.Println(string(output))
}
```
