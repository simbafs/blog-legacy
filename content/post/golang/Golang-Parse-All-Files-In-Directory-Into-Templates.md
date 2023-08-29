---
title: Golang Parse All Files In Directory Into Templates
slug: Golang-Parse-All-Files-In-Directory-Into-Templates
date: '2021-07-30'
tags:
  - golang
  - template
  - gin
  - embed
categories:
  - golang
image: /og/golang/Golang-Parse-All-Files-In-Directory-Into-Templates.png
---

# Golang Parse All Files In Directory Into Templates

在用 gin 寫伺服器的時候，我發現模板並不會被 `go build` 打包進執行檔裡面，所以在執行的時候就找不到檔案，當然這個問題可以用字串的形式直接把模板放進 golang 原始碼裡面，但是這樣程式碼一複雜就會不好用，這時候就可以用 golang 的 embed 函式庫把檔案「嵌入」到原始碼裡面。但是問題又來了，嵌入了之後要怎麼把字串變成模板物件呢？

## Embed

> `embed` 套件是 1.16 新出的功能，所以如果想用的話記得要更新 go 到 1.16 以上

`embed` 嵌入檔案的方式是透過特殊格式的註解宣告，直接看官方範例：

```golang embed.go
package main

import (
	"embed"
)

//go:embed hello.txt
var s string

//go:embed hello.txt
var b []byte

//go:embed hello.txt
var f embed.FS

func main() {
	print(s)
	print(string(b))
	data, _ := f.ReadFile("hello.txt")
	print(string(data))
}
```

可以看到，`embed` 可以把檔案讀成三種格式 `string`、`[]byte`、`embed.FS`，前兩者只能讀「一個」檔案，如果你只用這兩個的話引入時要用 `_ "embed"`。`embed.FS` 除了可以嵌入多個檔案之外，因為實做了 `fs.FS` 所以可以使用當作一個檔案系統操作。

## Tmeplate

### No Recursive

最簡單的方法，你可以直接使用

```golang template-no-recursive.go
// go:embed view/*
var f embed.FS
templ := template.Must(template.New("").ParseFS(f, "view/*tmpl", "view/user/*.tmpl"))
```

這個方法有個缺點，像上面這樣有子目錄就要一個一個設定，ParseFS 不會幫你往下尋找

### Recursive

善用 `embed.FS`，我們可以將資料夾下所有檔案載入成模板

```golang tmeplate-recursive.go
// go:embed view
var Assets embed.FS
func loadTemplate() (*template.Template, error) {
	t := template.New("")
	fs.WalkDir(Assets, "view", func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}

		// exclude directory
		if d.IsDir() {
			return nil
		}

		// read file
		file, err := Assets.ReadFile(path)
		if err != nil {
			return err
		}

		name := strings.Replace(path, "view/", "", 1)
		_, err = t.New(name).Parse(string(file))
		if err != nil {
			return err
		}

		return nil
	})
	fmt.Println("Loaded templates:")
	for _, v := range t.Templates() {
		fmt.Println("   ", v.Name())
	}
	return t, nil
}

func main(){
    templ, err := loadTemplate()
	if err != nil {
		panic(err)
	}
}
```

這種寫法雖然程式寫的比較多，但是在模板多的時候優勢就顯現出來了，完全不用管有幾層資料夾，反正放在 `view` 裡面就可以了。

## 關於 Template 奇怪的坑

如果仔細看你會發現 `html/template` 套件有提供一個函數 `ParseFS` 函數，可以直接傳 `FS` 物件進去（如 #No-Recursive 的用法），但是因為 `ParseFS` 在判定 template name 時是用檔名而不是路徑，所以不同資料夾下如果都有檔名一樣的模板，只有最後一個會生效。所以這個只適用沒有子目錄的情形，擴充性不足有點可惜。因此在 #Recursive 中我使用 `Assets.ReadFile` 把檔案讀進來，再以字串傳進 Parse 就是為了避免這個 bug

## 關於 Golang 1.17 的坑

### 空格

升到 Golang 1.17 之後，原本可以用 `// go:embed filename` 引入，現在一定要用 `//go:embed filename`，斜線和 `go` 中間不能有空白。

### 不能用「.」開頭

我不確定這是不是 1.17 的改變，我忘記以前 1.16.5 有沒有試過這個，`filename` 不能是「.」開頭，也就是說不能寫 `../filename`，所以要引入的檔案或目錄一定要放在 `go run .` 或 `go build` 執行的目錄下

## 參考資料

[https://pkg.go.dev/embed](https://pkg.go.dev/embed)  
[https://pkg.go.dev/io/fs](https://pkg.go.dev/io/fs)  
[https://pkg.go.dev/html/template](https://pkg.go.dev/html/template)  
[https://blog.wu-boy.com/2020/12/embedding-files-in-go-1-16/](https://blog.wu-boy.com/2020/12/embedding-files-in-go-1-16/)
