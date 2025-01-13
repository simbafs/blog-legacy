---
title: Reset State When State Chagne
slug: reset-state-when-state-chagne
date: '2024-02-05T00:00:00.000Z'
tags:
  - useState
  - key
  - reactjs
categories:
  - js
  - reactjs
image: /og/js/reactjs/reset-state-when-state-chagne.png
---

# Reset State When State Chagne
我現在正在做一個 Popup 元件（component），內容是一個表單，以下是幾個需求

1. 點擊外面、叉叉和 Cancel 要關掉
2. 點擊 Save 要做一些事後關掉
3. 無論怎麼關掉的，都要清除表單狀態（reset）
4. 這個頁面會有不同 Popup，裡面的表單不一樣

## Popup 元件設計

```jsx
type Props = {
    open: boolean
    setOpen: (open: boolean) => void
    children: React.ReactNode
}

function Popup({ open, setOpen, children }: Props){
    return <div 
            className={twMerge("...", !open && 'hidden')}
            onClick={() => setOpen(false)}
        > // 這個 div 是鋪在整個螢幕的半透明圖層
        <div onClick={(e) => e.stopPropagation()}/> // 這個 div 是彈出式視窗，白色底
            <button onClick={() => setOpen(false)}>X</button> // 叉叉
            {children}
        </div>

    </div>
}
```

像這樣的設計我就可以把 Popup 和表單抽離，例如這樣

```jsx
export default fuction Page(){
    const [open, setOpen] = useState(false)

    return <Popup open={open} setOpen={setOpen}>
        <MyForm close={() => setOpen(false)} />
    </Popup>
}

function MyForm({ close }: { close: () => void }){
    const [data, updateData] = useReducer() // 省略

    return <>
        <h1>表單</h1>
        <input
            value={data.field1}
            onChange={e => updateDate({ field1: e.target.value })}
        />
        <button onClick={close}>Cancel</button>
        <button onClick={() => {
            // do something ...
            close()
        }}>Save</button>
    </>
}
```

我知所以把 `MyForm` 抽出來做成另一個元件，是因為我覺得我的 `Page` 函數太長了，想分開

## 問題
這樣看起來很棒，設計得很有彈性，也達成了大部分需求，但是需求 3 卻沒有達成，問題就在我是用 `display: none` 隱藏 `Popup` 的，因此下次再打開 `Popup` 時對於 React 來說這個元件沒變化，不會重設一個新的 `Popup`。

## 我如何解決的
我曾經想過，手動在 `MyForm` 兩個按鈕的事件加上 `updateDate(defaultValue)`，但是這樣的話，點擊表單外面半透明的區域關掉表單不會清除表單內容，如果把表單和 Popup 合在一起又破壞了當初彈性的設計。不合起來的話也是做得到，但是會變得很複雜不好維護。  

最後，我只在 Popup 上新增了一個 `key` 屬性，就解決了這個問題。  

### 元件的生命週期
要解釋這個問題就要先解釋元件的生命週期和 React 如何處理 state。一個元件的 state 在整個元件的生命週期中，React 會保證這個 state 是同一個 value，直到元件不再出現在 virtual DOM 上。  
React 會把每個「frame」在 virtual DOM 中相同位置的同類型元件視為相同（例如 Popup 和 Popup、button 和 button），並且把上一個 frame 的 state 塞給這個元件，當 React 發現原本這裡有個元件，但是現在卻找不到了，那麼 React 就會視這個元件「消亡」，隨之清除原本應該給這個元件的 state。

### key
除了檢查位置以外，React 還會檢查這個元件的 `key` 屬性，即使位置一樣，`key` 不一樣 React 依舊會把他視為是一個新的元件，並給他全新的 state。  
這個特性最常出現在用一個陣列去批次產生 JSX 的時候

```jsx
cosnt userIds = [1,2,3,4,5]

<ul>
    {userIds.map(userId => <li key={userId}>{userId}</li>)}
</ul>
```

這樣當插入、刪除 `userIds` 其中某個元素時，即便位置不一樣 React 還是可以透過 `key` 去追蹤元件，並給他正確的 state

### 利用 key 去清除 state
那麼，我們需要的就是在 `open` 有變化時，塞給 `Popup` 一個和上次不同的 key，就可以讓 React 知道這是一個新的元件，要給他新的 state

```jsx
export default fuction Page(){
    const [open, setOpen] = useState(false)

    return <Popup open={open} setOpen={setOpen} key={Number(open)}>
        <MyForm close={() => setOpen(false)} />
    </Popup>
}
```

這裡用 `Number()` 包起來只是因為 typescript 會抱怨 boolean 不能當作 key。如此一來只改一行，就可以達成「關掉 Popup 時清空表單」，不管是怎麼關掉的。
