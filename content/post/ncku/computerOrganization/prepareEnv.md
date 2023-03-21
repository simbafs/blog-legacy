---
title: Preparing Environment
date: 2023-03-14T10:23:17+08:00
tags:
    - note
    - riscv
    - kernel
categories:
    - 'computer organization'
image:
---

# Preparing Environment

## GNU toolchain

```
$ mkdir -p /opt/riscv/bin ~/riscv
$ echo 'export RISCV=/opt/riscv' >> ~/.zshrc
$ echo 'export PATH=$PATH:$RISCV/bin' >> ~/.zshrc
$ sudo apt install git autoconf automake autotools-dev curl python3 libmpc-dev libmpfr-dev libgmp-dev gawk build-essential bison flex texinfo gperf libtool patchutils bc zlib1g-dev libexpat1-dev ninja-build
$ cd ~/riscv
$ git clone --recurse-submodules -j8 --depth 1 https://github.com/riscv/riscv-gnu-toolchain
```

> https://stackoverflow.com/questions/2144406/how-to-make-shallow-git-submodules
> 這裡因為如果在 make 時再去抓 submodule 好像會怪怪的

```
$ cd riscv-gnu-toolchain
$ ./configure --prefix=$RISCV --enable-multilib
```

> 執行這步之前要先去每個 submodule 下指令 `git reset HEAD --hard`，應該可以修改 `git clone` 指令做到，但懶得重試了

```
$ sudo make linux -j4
```

> 這步驟要編很久

## 其他工具

其他工具包含 spike、proxy kernel，這兩個編譯方式都一樣

### spike

```
$ cd ~/riscv
$ sudo apt-get install device-tree-compiler
$ git clone --depth 1 https://github.com/riscv/riscv-isa-sim.git
$ cd riscv-isa-sim
$ mkdir build
$ cd build
$ ../configure --prefix=$RISCV
$ make
$ sudo make install
```

```
$ cd ~/riscv
$ git clone https://github.com/riscv/riscv-pk.git
$ cd riscv-pk
$ mkdir build
$ cd build
$ ../configure --prefix=$RISCV --host=riscv64-unknown-linux-gnu
$ make
$ sudo make install
```

## 測試

### GNU toolchain

```
$ riscv64-unknown-linux-gnu-gcc -v
```

### others tool

> /tmp/hello.c

```c
#include <stdio.h>

int main(){
	printf("hello world");
	return 0;
}
```

執行

```
$ riscv64-unknown-linux-gnu-gcc -static -o /tmp/hello /tmp/hello.c
$ spike --isa=RV64GC $RISCV/riscv64-unknown-linux-gnu/bin/pk /tmp/hello
```
