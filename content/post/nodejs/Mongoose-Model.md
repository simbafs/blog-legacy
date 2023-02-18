+++
title = "Mongoose Model"
tags = [ "mongoose", "node" ]
categories = [ "nodejs" ]
date = "2020-11-10"
+++

# Mongoose Model

## 環境設定
這是這次實驗用的 code
```js
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017', {useNewUrlParser: true, useUnifiedTopology: true})
	.then(() => console.log('Connected to DB'))
	.catch(e => console.error(e));

const requiredString = {
	type: String,
	required: true
}
const UserSchema = new mongoose.Schema({
	username: requiredString,
	password: requiredString
});

const UserModel = mongoose.model('User', UserSchema);
```
mongo db 用 docker 開一個實驗用的 server
```ymal
version: '3'
services: 
    db:
        image: 'mongo'
        container_name: 'aurl-mongodb'
        volumes:
            - ./data/mongo:/data/db
            - ./data/dump:/dump
        ports:
            - '27017:27017'
```

## 取得原 schema
在一般操作的時候都是用 `UserModel` 在操作資料庫，當要取得 schema 的時候當然也是從他裡面找最方便，當然也可以把 schema 特別弄出來，但是有點麻煩，以這次的例子說明，原本的 `UserSchema` 會存在 `UserModel.schema.obj` 裡。

## 真實資料庫結構
在建立 model 後 mongoose 會自動新增一些欄位，例如說 `_id` 之類的，要取得包含這些欄位的真實 model 結構的話可以在 `UserModel.schema.tree` 找到

