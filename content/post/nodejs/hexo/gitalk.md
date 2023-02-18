+++
title = "gitalk"
tags = [ "hexo", "github" ]
categories = [ "hexo" ]
date = "2020-02-11"
+++

# 啟用 gitalk 留言
1. 到[這個網址](https://github.com/settings/applications/new)填資料  
2. 加入下面的片段到`_config.yml`
```
disqus:
    enabled: false 
gitalk:
    enabled: true
    owner: <username>
    repo: <username>.github.io
    admin: ['<username>']
    clientID: <clientID>
    clientSecret: <clientSecret>
```
3. 加入下面的片段到`themes/cactus/layout/_partial/comments.ejs`
```
<% if(page.comments && theme.gitalk.enabled){ %>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.css">
    <script src="https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js"></script>
    <script src="https://cdn.bootcss.com/blueimp-md5/2.10.0/js/md5.min.js"></script>
    <div id="gitalk-container"></div>
    <script type="text/javascript">
        var gitalk = new Gitalk({
            clientID: '<%= theme.gitalk.clientID %>',
            clientSecret: '<%= theme.gitalk.clientSecret %>',
            id: md5(window.location.pathname),
            repo: '<%= theme.gitalk.repo %>',
            owner: '<%= theme.gitalk.owner %>',
            admin: '<%= theme.gitalk.admin %>',
            distractionFreeMode: '<%= theme.gitalk.on %>'
        })
        gitalk.render('gitalk-container')
    </script>
<% } %>
```
4. 完成！注意 gitalk 在本地端是沒有用的喔！記得 `hexo g; hexo d`
