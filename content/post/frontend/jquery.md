+++
title = "jquery"
tags = [ "jquery" ]
categories = [ "frontend" ]
date = "2020-03-15"
+++

今天寫 jquery 遇到了一些坑

# 1. submit
`.submit()` 是要加在 `form` 上而不是 `submit button` 上

# 2. this
在 jquery 裡有時後會用到 handler
正常情況下可以用 arrow function 
但是如果用到 `this` 就不能用 arrow function 了
（這不只是 jquery, JS 都是這樣）
