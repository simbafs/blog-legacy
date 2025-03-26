---
title: Bubbletea
slug: bubbletea
date: '2023-01-08T00:00:00.000Z'
tags:
  - bubbletea
  - cli
categories:
  - golang
  - bubbletea
---

# charmbracelet/bubbletea

charmbracelet/bubbletea 是一個類似於 HTML，但是他是用在終端機中建立純文字的使用者界面。

## model

model 是 bubbletea 中最基本的元件，對應到 HTML 中就是 tag，一個 model 需要有以下三個方法

```go
type model struct {}
func (m model) Init() tea.Cmd
func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd)
func (m model) View() string
```

`Init` 函式定義只在建立 model 時要執行的 cmd，`Update` 定義每個 tick 都會執行的程式，`View` 將 model 繪製成字串。

## cmd

cmd 需要符合以下定義

```go
type tea.Msg interface{}
func () tea.Msg
```

cmd 的功能是為了執行 IO 操作而不阻礙畫面，因此 cmd 會被放在 gorutine 中非同步執行，而 `Update` 不會。
如果在 `Init`、`Update` 中要回傳多個 cmd，可以用 `tea.Batch(cmd...)` 把他們包起來

如果你的 cmd 需要傳入參數，例如 `readFile(filename)`，可以定義成

```go
type textMsg string
func readFile(filename string) tea.Cmd {
	return func() tea.Msg {
		b, err := iotuil.ReadFile(filename)
		if err != nil {
			return textMsg("error")
		}
		return textMsg(b)
	}
}
```

## 狀態

在 model 定義狀態就在 struct 中直接新增欄位就可以了，要注意的是如果在 `Update` 中要存取子 model 的狀態，請把 `Update` 傳遞下去並在子 model 的 `Update` 中存取狀態

## 子 model 和 Init/Update 傳遞

定義子 model

```go
type model struct {
	username textinput.Model
	password textinput.Model
}
```

因為 bubbletea 只負責執行 model 的 `Init` 和 `Update`，所以請記得在 model 的 `Init` 和 `Update` 中，要記得把兩個函數的執行傳遞下去

```go
func (m model) Init tea.Cmd {
	return tea.Batch(
		m.username.Init(),
		m.password.Init(),
	)
}

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	var cmds []tea.Cmd = make([]tea.Cmd, 2)

	m.username, cmds[0] = m.usrename.Update(msg)
	m.password, cmds[1] = m.password.Update(msg)

	return m, tea.Batch(cmds...)
}
```

### 問題

如果子 model 變多，那對於傳遞的管理就會變得很複雜，要想的方法解決，需要可以一次管理不同類型的 model

## 心得

`Update` 中只接收和自己有關的 msg，和自己無關的就傳遞下去，絕對不操作不屬於自己的屬性，不然會出 bug
