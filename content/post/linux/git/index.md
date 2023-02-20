+++
title = "Git Snippet"
date = "2023-02-20T16:59:29+08:00"
tags = ["git"]
categories = ["linux"]
# image = 
+++

# Git Snippet
## move branch to another commit (not recommand)
```
 git branch --force <branch name> <commit id>
```

## list changed filename
```
 git diff --name-only HEAD 
```
[ref: stackoverflow](https://stackoverflow.com/questions/1552340/how-to-list-only-the-names-of-files-that-changed-between-two-commits)
