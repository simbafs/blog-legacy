---
categories:
- linux
date: "2023-04-15T10:14:40+08:00"
image: null
tags:
- aseprite
- pixel art
- cmake
- ninja
title: Build Aseprite
---

# Build Aseprite

Aseprite 是一個跨平台的像素畫編輯器，反正看起來很棒，但是官網和 itch.io 買 19.99 美金，steam 賣三百多元，為了省這個錢決定自己編譯，原始碼在 https://github.com/aseprite/aseprite，而且官方有一個很詳細的[編譯說明](https://github.com/aseprite/aseprite/blob/main/INSTALL.md)

## clone

```
$ git clone https://github.com/aseprite/aseprite --recursive --depth 1
```

## Dependencies

```
$ sudo apt-get install -y g++ clang libc++-dev libc++abi-dev cmake ninja-build libx11-dev libxcursor-dev libxi-dev libgl1-mesa-dev libfontconfig1-dev
```

### skia

去 https://github.com/aseprite/skia/releases/latest 下載編譯好的 skia，解壓縮放到 `~/deps/skia` 下面

## cmake

```
$ cd aseprite
$ mkdir build
$ cd build
$ export CC=clang
$ export CXX=clang++

# add by me
$ export CMAKE_CXX_COMPILER="ccache"

$ cmake \
  -DCMAKE_BUILD_TYPE=RelWithDebInfo \
  -DCMAKE_CXX_FLAGS:STRING=-stdlib=libc++ \
  -DCMAKE_EXE_LINKER_FLAGS:STRING=-stdlib=libc++ \
  -DLAF_BACKEND=skia \
  -DSKIA_DIR=$HOME/deps/skia \
  -DSKIA_LIBRARY_DIR=$HOME/deps/skia/out/Release-x64 \
  -DSKIA_LIBRARY=$HOME/deps/skia/out/Release-x64/libskia.a \
  -G Ninja \
  ..
$ ninja aseprite
```

## Execute Path

```
$ sudo mv bin /usr/local/share/aseprite
$ sudo ln -s /usr/local/share/aseprite/aseprite /usr/local/bin/aseprite
```

### Desktop File

`~/.local/share/applications/aseprite.desktop`

```
[Desktop Entry]
Name=Aseprite
Exec=/usr/local/bin/aseprite
Icon=/usr/local/share/aseprite/data/icons/ase128.png
Terminal=false
Type=Application
```
