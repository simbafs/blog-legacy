+++
title = "Anbox"
slug = ""
date = 2022-04-18T18:53:50+08:00
tags = ['anbox', 'linux', 'android', 'emulator']
categories = ['linux']
+++

# Anbox

[anbox](https://anbox.io/) 是 Android in a box，是一種基於容器化技術的 Android 模擬器，所以執行速度會比較快、比較省資源，而且因為每個 App 都在各自的容器裡面，所以比較安全
（應該沒理解錯吧？）。  
安裝 anbox 需要先安裝兩個 kernal modules，然後安裝 anbox 後，為了之後方便，所以要裝 Google Play，不裝也是可以，但之後安裝其他 App 比較麻煩

## 系統

我用的系統是 Ubuntu 21.04，如果你的系統不一樣，可能會有某些步驟不太一樣。  
這次安裝因為涉及 Linux Kernel 所以隨時重開機有很大機會幫助改善遇到的問題

## 安裝 Linux Kernal Modules

如果你的 Linux kernale > 5.0，那理論上已經包在 Kernel 裡面了，所以不用安裝

> Starting with Ubuntu 19.04 binder and ashmem are now build with the standard Ubuntu kernel (>= 5.0) and you don’t have to install the modules from the PPA anymore.

但是我還是把命令跑了一次，反正有病治病沒病強身

```bash
sudo add-apt-repository ppa:morphis/anbox-support
sudo apt update # 這個步驟應該會包括在上面那個命令，但執行一次也不會壞
sudo apt install linux-headers-generic anbox-modules-dkms # 這個後面那個套件應該會找不到，跳過他
sudo apt install software-properties-common
sudo modprobe ashmem_linux
sudo modprobe binder_linux
```

然後如果你還是很擔心不放心有沒有裝好，可以執行下面的指令

```bash
git clone https://github.com/anbox/anbox-modules /tmp/anbox-modules
cd /tmp/anbox-modules
sudo ./INSTALL.sh
```

這時候如果你~~還是~~很擔心，不確定有沒有裝好，可以用下面的命令檢查有沒有安裝好（這個時候可能需要重開機）

```
ls -1 /dev/{ashmem,binder} # 這個是官方用的，但是我怎麼試都失敗，但是 anbox 還是安裝成功了
lsmod | grep -e ashmem -e binder # 我不確定這個找到是不是代表有成功啟動，但是他兩個都找的到
```

> [https://docs.anbox.io/userguide/install_kernel_modules.html](https://docs.anbox.io/userguide/install_kernel_modules.html)

## 安裝 anbox

如果你的電腦上有 snap，就用 snap 裝；如果沒有，就先去裝 snap。

```bash
sudo snap install --devmode --beta anbox
```

嘿對，裝好了，可以用這個指令看看有沒有裝好

```bash
snap info anbox
```

> [https://docs.anbox.io/userguide/install.html](https://docs.anbox.io/userguide/install.html)

## apt

如果你是 Ubuntu/Debian 長期使用者，你可能會想用 apt 裝 anbox，也不是不行，但是等等裝 Google Play 的時候會出一點點問題（OverlayFS 路徑有問題），最佳解決辦法就是用 snap，不要用 apt

```bash
sudo apt remove anbox
```

## 安裝 Google Play

因為 anbox 沒有內建 apk 安裝器，所以沒辦法很方便的安裝 APP，最方便的方法是安裝 Google Play。

```bash
sudo apt install wget curl lzip tar unzip squashfs-tools
wget https://raw.githubusercontent.com/geeks-r-us/anbox-playstore-installer/master/install-playstore.sh
chmod +x install-playstore.sh
sudo ./install-playstore.sh
```

如果遇到 Overlay not enable 的問題，請不要用 apt，至於位什麼自己研究 `install-playstores.sh`
跑完如果沒錯誤就可以打開 `anbox.appmgr`，打開 play 安裝 APP 了。

> [https://www.clusterednetworks.com/blog/post/install-google-play-store-anbox](https://www.clusterednetworks.com/blog/post/install-google-play-store-anbox)

## 問遺

目前裝好 APP 但是我打不開
