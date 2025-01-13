---
title: Mastodon
slug: mastodon
date: '2022-11-24T00:00:00.000Z'
tags:
  - mastodon
  - error
categories:
  - linux
image: /og/linux/mastodon.png
---

# Mastodon

```
[452093fc-5a92-47e2-b97b-dad3dff424e7] method=PUT path=/settings/profile format=html controller=Settings::ProfilesController action=update status=500 error='Errno::EACCES: Permission denied @ dir_s_mkdir - /opt/mastodon/public/system/accounts' duration=1077.81 view=0.00 db=6.70
[452093fc-5a92-47e2-b97b-dad3dff424e7]
[452093fc-5a92-47e2-b97b-dad3dff424e7] Errno::EACCES (Permission denied @ dir_s_mkdir - /opt/mastodon/public/system/accounts):
[452093fc-5a92-47e2-b97b-dad3dff424e7]
```

https://github.com/mastodon/mastodon/issues/3676#issuecomment-307500074
