---
title: Pointer to Structure Passed to Interface
slug: pointer-to-structure-passed-to-interface
date: '2024-09-27T00:00:00.000Z'
tags:
  - pointer
  - interface
  - structure
categories:
  - golang
  - pointer-to-structure-passed-to-interface
draft: true
---

以下程式碼中的 `Admin` 實作了 `User`

```go
type Admin struct {
	name string
}

func (u Admin) GetName() string {
	return u.name
}

type User interface {
	GetName() string
}

func main() {
	simba := Admin{"simba"}

	// ok
	var user User = simba

	fmt.Println(user.GetName())
}
```

但是以下這段程式就出問題了，因為 `User` interface 中多了一個 method `SetName`，而 User 中的 `SetName` 指定要接收一個指標

```go
type Admin struct {
	name string
}

func (u Admin) GetName() string {
	return u.name
}

func (u *Admin) SetName(name string) {
	u.name = name
}

type User interface {
	GetName() string
	SetName(string)
}

func main() {
	simba := Admin{"simba"}

	// Error: Admin does not implement User (method SetName has pointer receiver)
	var user User = simba

	fmt.Println(user.GetName())

	user.SetName("kenny")

	fmt.Println(user.GetName())
}
```
