---
title: Computer Organization
date: 2023-03-14T10:23:17+08:00
tags:
    - note
    - riscv
    - kernel
categories:
    - ncku
image:
---

# Computer Organization

## Ch2

## HW0 install environment

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
