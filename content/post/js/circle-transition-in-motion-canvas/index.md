---
title: Circle Transition in Motion Canvas
slug: circle-transition-in-motion-canvas
date: '2024-09-29T00:00:00.000Z'
tags:
  - animation
  - motion canvas
  - transition
categories:
  - js
  - circle-transition-in-motion-canvas
---

# Circle Transition in Motion Canvas

這是一個 [Motion Canvas](https://motioncanvas.io/) 的轉場函數，使用後會有一個圈圈從畫面中間出現並放大，圈圈外是前一個場景，圈圈內是新的場景

範例：

{{< video src="project.mp4" >}}

```tsx
function* circleTransition(view: View2D, duration = 0.6) {
	const { x, y } = useScene().getSize()
	const r = Math.sqrt((x * x) / 4 + (y * y) / 4)

	const circle = (<Circle />) as Circle
	view.add(circle)

	yield* circle
		.compositeOperation('destination-atop') // keypoint
		.size(new Vector2(3 * r, 3 * r)) // 2r is diameter, set to 3r for better appearance
		.scale(0.000001) // this must be a value not 0, but small enough to be invisible
		.fill('black') // the circle nned a color

	const endTransition = useTransition(
		ctx => {},
		ctx => {},
	)

	yield* circle.scale(1, duration)
	endTransition()
	yield* circle.scale(0)

	circle.remove()
}
```

使用：

```tsx
export default makeScene2D(function* (view) {
	const container = createRef<Rect>()

	view.add(
		<>
			<Rect
				ref={container}
				layout
				scale={4}
				gap={10}
				height="100%"
				width="100%"
				fill="#7733ba"
				alignItems={'center'}
				justifyContent={'center'}
			>
				<Txt text="Hello World" fill="white" fontSize={60} />
			</Rect>
		</>,
	)

	yield* circleTransition(view, 2)

	yield* waitFor(1)
})
```
