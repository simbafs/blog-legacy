---
title: Aconf
slug: aconf
date: '2021-09-24'
tags:
  - config
  - toml
  - json
  - yaml
  - env
  - flag
categories:
  - golang
image: /og/golang/aconf.png
---

# aconf

aconf 是個可以直接幫你解決所有「設定」問題的套件，設定可以有預設、從命令列參數、環境變數和設定檔，設定檔還有官方支援四種格式，dotEnv、HCL、toml、yaml 和 json。  
而且設定檔還可以有不只一個，他可以把多個設定檔合成，相當方便

## 基本使用

### 定義 struct

首先我們需要一個 struct 來定義我們的設定

```go
type Config struct {
	Addr  string   `default:":3000"`
	Title string   `default:"Aconf Testing"`
	SysAdmin []string `default:"simbafs,peter"`
}
```

### 載入設定

再來，我們可以設定要從哪些來源載入設定值

```go
loader := aconfig.LoaderFor(&config, aconfig.Config{
	// 這四個預設都是關閉的，如果你想關閉任何一個隨時都可以關閉他
	// SkipDefaults: false,
	// SkipFiles: false,
	// SkipEnv: false,
	// SkipFlags: false,
	EnvPrefix: "APP",
	FlagPrefix: "app",
	Files: []string{"~/.config/app.toml", "app.toml"},
	FileDecoders: map[string]aconfig.FileDecoder{
		".toml": aconfigtoml.New(),
	},
})

if err := loader.Load(); err != nil {
	panic(err)
}

```

這樣你就可以用檔案、環境變數和命令列參數設定了。

#### 設定名稱

我們在 struct 中定義的設定名稱，在各個來源會有一些變化，下面是例子

| struct   | 設定檔    | 環境變數               | 命令列參數                           |
| :------- | :-------- | :--------------------- | :----------------------------------- |
| Addr     | addr      | {EnvPrefix}\_ADDR      | {FlagPrefix}{FlagDelimiter}attr      |
| SysAdmin | sys_admin | {EnvPrefix}\_SYS_ADMIN | {FlagPrefix}{FlagDelimiter}sys_admin |

這邊有另外幾個設定，以下是他們的預設值

|    config     | default                                       |
| :-----------: | :-------------------------------------------- |
|   EnvPrefix   | ""（最好自己設，不然可能重複）                |
|  FlagPrefix   | "" （如果沒有設，FlagDelimiter 也不會有作用） |
| FlagDelimiter | .                                             |

#### 從命令列載入設定檔

預設你是不行從命令列設定你自己的設定檔路徑，但是你可以開啟這個選項  
用 `FileFlag` 可以設定「設定檔路徑」的選項

## 參考連結

https://github.com/cristalhq/aconfig  
https://pkg.go.dev/github.com/cristalhq/aconfig
