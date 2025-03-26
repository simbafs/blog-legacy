---
title: Pass Value From Child to Parent
slug: pass-value-from-child-to-parent
date: '2024-10-12T15:10:30.000Z'
tags:
  - context
  - rerender
categories:
  - js
  - reactjs
  - pass-value-from-child-to-parent
draft: true
---

# Pass Value From Child to Parent

情況是這樣的，我希望在某個元件中，呼叫函數 `setTime(initValue)` 就可以叫出一個蓋版的視窗，他有個輸入框，預設值是 `initValue`，修改完後按下某個按鈕可以把值傳回給當初呼叫 `setTime()` 的地方，而按下另一個按鈕就不會回傳值

## Usage

具體來說，繪像這樣使用

```jsx
function Child() {
	const [value, setValue] = useState(0)
	const edit = useEditor()

	return <button onClick={() => edit(value).then(alert)}>SetValue</button>
}
```

## Without Context

首先這個版本是我第一個想到，但是因為有點問題，所以我又寫了第二個使用 context 的版本，不過這個不需要 context 的版本也被我修改到可以用了。

```tsx
export type ModalComponent<T> = FC<{ isOpen: boolean; initValue: T; callback: (value: T, ok: boolean) => void }>

export function useEditor<T>(Editor: ModalComponent<T>, zeroValue: T) {
	const [initValue, setInitValue] = useState<T | undefined>(undefined)
	const [callback, setCallback] = useState<(value: T, ok: boolean) => void>(() => {})
	const isOpen = initValue !== undefined
	const [key, setKey] = useState(0)

	const edit = (initValue: T) => {
		// console.log(`edit with ${initValue}`)
		return new Promise<T>((res, rej) => {
			setKey(key + 1)
			setInitValue(initValue) // open
			setCallback(() => (value: T, ok: boolean) => {
				if (ok) res(value)
				else rej()

				setInitValue(undefined) // close
			})
		})
	}

	return [
		() => <Editor isOpen={isOpen} initValue={initValue || zeroValue} callback={callback} key={key} />,
		edit,
	] as const
}
```

使用上很簡單

```tsx
function Parent() {
	const [Editor, edit] = useEditor<number>(MyEditor, 0)

	return (
		<>
			<Child edit={edit} />
			<Editor />
		</>
	)
}

function Child({ edit }: { edit: edit<number> }) {
	return <button onClick={() => edit(10).then(alert)}>Edit</button>
}
```

### Pros and Cons

-   pros
    -   使用方便
    -   可以有多個不同的 edior
-   cons
    -   如果呼叫 `useEditor` 的地方離使用 `edit()` 很遠，就要一直傳遞 `edit` 很多次，有點麻煩

## With Context

然後這是有 context 的版本

```tsx
const EditorContext = createContext<(init: string, res: (value: string) => void, rej: () => void) => void>(() => {})

function EditorProvider({ children }: { children: React.ReactNode }) {
	const [initValue, setInitValue] = useState('')
	const [res, setRes] = useState<(value: string) => void>(() => {})
	const [rej, setRej] = useState<() => void>(() => {})
	const [isOpen, setIsOpen] = useState(false)

	const setContext = (init: string, res: (value: string) => void, rej: () => void) => {
		console.log('setContext')
		setIsOpen(true)
		setInitValue(init)
		setRes(() => (value: string) => {
			res(value)
			setIsOpen(false)
		})
		setRej(() => () => {
			rej()
			setIsOpen(false)
		})
	}

	return (
		<EditorContext.Provider value={setContext}>
			{children}
			<Editor isOpen={isOpen} init={initValue} res={res} rej={rej} key={initValue} />
		</EditorContext.Provider>
	)
}

function useEditor() {
	const setInitValue = useContext(EditorContext)

	return (initValue: string) =>
		new Promise<string>((res, rej) => {
			setInitValue(initValue, res, rej)
		})
}
```

這個版本使用上是需要先用 `EditorProvider` 包起來。

```tsx
// page.tsx
export default function Page() {
	return (
		<EditorProvider>
			<Child />
		</EditorProvider>
	)
}

function Child() {
	const editor = useEditor()

	return (
		<button type="button" onClick={() => editor(10).then(console.log, console.error)}>
			Set Editor
		</button>
	)
}
```

### Pros and Cons

-   pros
    -   不需要一直傳遞 `edit`
-   cons
    -   因為 context 所以如果要有多個不同的 edit 視窗就比較麻煩
    -   萬一 context 變多就會包很多 context provider
    -   context 比較複雜

## 結論

其實這兩個版本差不多，不過使用上我比較喜歡 without context 的版本，因為他簡單好懂，狀態來源都很清楚（最遠就是到呼叫 `useEditor` 那裡）
