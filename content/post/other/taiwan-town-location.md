---
categories:
- other
date: "2021-06-24"
tags:
- taiwan
- geolocation
- opendata
- api
title: 臺灣地址 API
---

# 臺灣地址 API

這是一個給經緯度吐地址的 api，甚至路段都會出來，搭配 [web geolocation api](https://developer.mozilla.org/zh-TW/docs/Web/API/Geolocation_API) 蠻不錯的，精確度不錯。可以不知道有沒有 rate limited 的問題，目前看起來連 token 都不用。

## 網址

https://api.nlsc.gov.tw/other/TownVillagePointQuery/

## 用法

https://api.nlsc.gov.tw/other/TownVillagePointQuery/經度/緯度

## 舉例：

## request

```
GET https://api.nlsc.gov.tw/other/TownVillagePointQuery/121.46278679999999/25.0169826
```

## response

```xml
<townVillageItem>
	<ctyCode>F</ctyCode>
	<ctyName>新北市</ctyName>
	<townCode>F14</townCode>
	<townName>板橋區</townName>
	<officeCode>FA</officeCode>
	<officeName>板橋</officeName>
	<sectCode>0008</sectCode>
	<sectName>民權段</sectName>
	<villageCode>65000010020</villageCode>
	<villageName>漢生里</villageName>
</townVillageItem>
```

## 參考資料

https://data.gov.tw/dataset/101898
