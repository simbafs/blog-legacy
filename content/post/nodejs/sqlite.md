+++
title = "sqlite3"
date = "2020-03-13"
tags = [ "node", "sqlite", "async" ]
categories = [ "nodejs" ]
+++

# sqlite3
昨天是試著去理解 sqlite3，我發現他的 callback function 真的太煩了
於是我試著去尋找 async 的版本，還真找到了
這個套件把整個 sqlite 包成 async 了

---

## install
```
$ npm i sqlite-async
```

---

## some sample code
這裡是以短網址部份為範例
```js
// 因為這個需要 await 所以要放在 async 函數裡
(async () => {
	const sqlite = require('sqlite-async');
	// 這裡因為開 DB 會延遲，所以要 await 一下，不然等等會 undefined
	const Url = await sqlite.open('Url.db');
	// 這裡不能加 await 不然出錯
    Url.run(`CREATE TABLE IF NOT EXISTS Url (
        url STRING,
        code STRING
    )`);
	// 這裡也要加 await 因為這也是 async
    const stat = await Url.prepare(`INSERT INTO Url VALUES (?, ?)`);
    stat.run('https://google.com', 'goo');
    stat.run('https://youtube.com', 'yt');
    stat.run('https://gmail.com', 'gmail');
    stat.run('https://ckcsc,net', 'ckcsc');
	// 這行和上面四行選一個加 await 否則會有些家不進去
    await stat.finalize();
	// 這裡用 then 也可以用 await，then 會回傳一個包含回傳值的陣列
    Url.all("SELECT * FROM Url")
        .then(console.log)
        .catch(console.error);
})()
```
