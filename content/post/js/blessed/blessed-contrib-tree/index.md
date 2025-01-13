---
title: Blessed Contrib Tree
slug: blessed-contrib-tree
date: '2020-02-18T00:00:00.000Z'
tags:
  - blessed
  - blessed-contrib
  - js
  - cli
categories:
  - js
  - blessed
image: /og/js/blessed/blessed-contrib-tree.png
---

# blessed Contrib Tree

## Tree

想說先想一個專案來練練手
熟悉一下 blessed
突然看到 blessed-contrib 裡有個元件叫 `tree`
想說可以做成 JSON viewer
於是就開工了！

其中最重要的部份就是搞定樹狀結構
因為他有特定的格式和選項
下面是官方的範例

## 範例

```js
{
  extended: true,
  children: {
    'Fruit': {
      children: {
        'Banana': {},
        'Apple': {},
        'Cherry': {},
        'Exotics': {
          children: {
            'Mango': {},
            'Papaya': {},
            'Kiwi': {
              name: 'Kiwi(notthebird!)',
              myCustomProperty: "hairyfruit"
            }
          }
        },
        'Pear': {}
      }
    },
    'Vegetables': {
      children: {
        'Peas': {},
        'Lettuce': {},
        'Pepper': {}
      }
    }
  }
}
```

每個節點都是物件
他的子節點存在 `children` 裡
如果是空物件代表這是葉節點
`extended` 屬性是是否展開，預設 `true`
`name` 是顯示出來的字，如果要改再設，預設是 `index`
`myCustomProperty` 直翻是自訂屬性，應該是當 `tree.on('select')` 觸發時傳進去的
