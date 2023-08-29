執行 `ts-node index.ts` 會把 `../../content/post/` 下的所有非 `_index.md` 的 `.md` 檔的 frontmatter 全部重新整理，舉體內容如下

1. 標題和 slug 如果沒有就換成檔名
2. 日期如果沒有就換成檔案建立日期
3. tag 和如果沒有會留空
4. categories 強制換成路徑
