---
title: Python Snippet
date: 2023-02-23T23:23:49+08:00
tags: 
  - python
  - snippet
  - numpy
categories: 
  - python
image: 
---

# Python Snippet
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
