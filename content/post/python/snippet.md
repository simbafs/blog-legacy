---
categories:
- python
date: "2023-02-23T23:23:49+08:00"
image: null
tags:
- python
- snippet
- numpy
title: Python Snippet
---

# Python Snippet

## Basic

### 未定長度函數參數

```python
def f(*a):
	for i in range(len(a)):
		print(i, a[i])
```

### polynomal

```python
# polynomial(2, 4, 6, 8)(x) -> 2x^0 + 4x^1 + 6x^2 + 8x^3
def polynomial(*ai):
    def f(x):
        r = 0
        for n, a in enumerate(ai):
            r += a*x**n
        return r
    return f
```

## Type Annotation

### Numpy Array as Parameter

```python
def func(A: np.ndarray)
```

> [stackoverflow](https://stackoverflow.com/questions/64600748/how-do-i-write-a-2d-array-parameter-specification-in-python)

## Numpy

### Determinant of array

```python
np.linalg.det(A)
```

> [doc](https://numpy.org/doc/stable/reference/generated/numpy.linalg.det.html)

### Multiply a Matrix and a Array

```python
np.dot(A, x)
```

> [stackoverflow](https://stackoverflow.com/questions/3890621/how-does-multiplication-differ-for-numpy-matrix-vs-array-classes)
