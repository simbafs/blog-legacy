---
title: Node VM
slug: node-vm
date: '2021-01-13T00:00:00.000Z'
tags:
  - node
  - nodejs
  - vm
  - js
categories:
  - js
  - node-vm
---

# Node VM

## node.js VM 模組

VM 是 node.js 的核心模組，提供安全的環境 (沙箱) 來測試不信任的程式碼。

## 基本概念

在 VM 模組裡面，有兩個基本的物件，script 和 context。script 是經過「編譯」程式，context 是給在沙箱裡面的程式碼的全域物件 (global) 。沙箱中的程式只能存取透過 context 指定的物件。

### 建立 script

VM 模組提供 `Script` 建構子，可以透過他來建立 `Script` 物件。

```js
const vm = require('vm');

const script = new vm.Script('i++');
```

也可以用 `vm.createScript`

```js
const vm = require('vm');

const script = vm.createScript('i++');
```

> [vm.Script](https://nodejs.org/dist/latest-v14.x/docs/api/vm.html#vm_class_vm_script)  
> vm.createScript 在 nodejs docs 上我沒有找到，但是我在自己的電腦上 (node v14.15.0) 測試是可以用的

### 建立 context

vm 模組沒有提供建立 context 的建構子，我們只能透過 `vm.createContext` 來建立 context。  
注意 `vm.createContext` 不是 pure function，除了會回傳 context 以外，還會把傳入的物件變成 context，兩者傳入 `vm.isContext` 都會回傳 `true`。

```js
const vm = require('vm');

const context1 = { i: 0 };
const context2 = vm.createContext(context1);

vm.isContext(context1); // true
vm.isContext(context2); // true

// 注意，其實 context1 和 context2 指向同一個物件。
context1 === context2; // true
```

> [vm.createContext](https://nodejs.org/dist/latest-v14.x/docs/api/vm.html#vm_vm_createcontext_contextobject_options)  
> [vm.isContext](https://nodejs.org/dist/latest-v14.x/docs/api/vm.html#vm_vm_iscontext_object)

## 執行 script (預先編譯 Script)

最基本的函式是 `script.runInContext`，它會把傳入的 context 當作 vm 的全域執行裡面的程式，_script 的最後一個表達式的回傳值會被當作這次執行的回傳值_。  
下面的範例，會把 context 中的 `i` 複製一遍後回傳他的值和長度。

```js
const vm = require('vm');

const script = vm.createScript('i += i; [i, i.length]');
const context = vm.createContext({ i: 'node' });

script.runInContext(context); // [ 'nodenode', 8 ]
```

如果沒有事先準備 context，可以用 `script.runInNewContext`，直接把還沒 [contextify](https://nodejs.org/dist/latest-v14.x/docs/api/vm.html#vm_what_does_it_mean_to_contextify_an_object) 物件傳進來，這個函式會
自動建立 context。這個參數是可略的，如果沒傳物件進進來的話，context 就會是空物件。

如果想要讓 script 直接存取全域物件的話，可以用 `script.runInThisContext`。這個函式不接受 context，因為 context 就是全域 (this) 了。

| method           | context             |
| :--------------- | :------------------ |
| runInContext     | contextified object |
| runInNewContext  | any Object          |
| runInThisContext | 不用傳，this        |

## 執行 script (沒有預先編譯 Script)

如果你很懶，或是你只是想要一次行的執行這段 code，可以用 `vm.runInContext`、`vm.runInNewContext` 和 `vm.runInThisContext`。用法跟先編譯過再執行一樣，只是其中第一個參數變成還沒編譯過的 code (String)。
