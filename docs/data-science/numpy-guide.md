# NumPy 数值计算库

NumPy（Numerical Python）是 Python 生态中最核心的数值计算库，为科学计算提供了高性能的多维数组对象 ndarray 以及丰富的数学函数库。本教程将系统介绍 NumPy 的核心概念、使用方法和实际应用场景。

## NumPy 简介

NumPy 由 Jim Hugunin 等人开发，后由 Travis Oliphant 整合 Numarray 特性并扩展而成。它是 Python 数据科学和机器学习生态系统的基石，几乎所有高级数据分析库（pandas、SciPy、scikit-learn、Matplotlib）都构建在 NumPy 之上。

### NumPy 的核心优势

NumPy 相比纯 Python 列表具有显著的性能优势：

| 特性 | Python 列表 | NumPy ndarray |
|------|-------------|--------------|
| 执行速度 | 较慢（逐元素循环） | 极快（向量化操作） |
| 内存占用 | 较大 | 紧凑（连续内存） |
| 数学运算 | 需手动循环 | 内置向量化函数 |
| 多维数据 | 嵌套列表，繁琐 | 原生支持 |

### NumPy 的主要功能

- **强大的 N 维数组对象 ndarray**：支持任意维度数据的存储和操作
- **广播功能**：对不同形状的数组进行数学运算
- **C/C++/Fortran 代码集成**：便捷的混合编程能力
- **线性代数**：矩阵运算、特征值分解等
- **傅里叶变换**：信号处理必备
- **随机数生成**：统计模拟的基础

## NumPy 安装与配置

### 使用 pip 安装

```bash
pip install numpy
```

### 验证安装

```python
import numpy as np
print(np.__version__)  # 输出 NumPy 版本号
```

### 常用开发环境

NumPy 可在多种 Python 环境中使用，推荐搭配：
- **Jupyter Notebook**：交互式计算
- **VS Code + Python 扩展**：轻量级IDE
- **PyCharm**：专业Python IDE

## Ndarray 对象

ndarray 是 NumPy 的核心数据结构，它是一个多维、同构的数组对象，支持高效的向量化计算。

### 创建 ndarray

```python
import numpy as np

# 从 Python 列表创建
a = np.array([1, 2, 3, 4, 5])
print(a)  # 输出: [1 2 3 4 5]
print(type(a))  # 输出: <class 'numpy.ndarray'>

# 创建二维数组
b = np.array([[1, 2, 3], [4, 5, 6]])
print(b)
# 输出:
# [[1 2 3]
#  [4 5 6]]

# 指定数据类型
c = np.array([1, 2, 3], dtype=np.float64)
print(c)  # 输出: [1. 2. 3.]
```

### 常用数组创建函数

```python
import numpy as np

# 全零数组
zeros = np.zeros((3, 4))  # 3行4列的全零矩阵
print(zeros)
# [[0. 0. 0. 0.]
#  [0. 0. 0. 0.]
#  [0. 0. 0. 0.]]

# 全一数组
ones = np.ones((2, 3))
print(ones)
# [[1. 1. 1.]
#  [1. 1. 1.]]

# 连续数组
arange = np.arange(0, 10, 2)  # 0到10，步长2
print(arange)  # 输出: [0 2 4 6 8]

# 等差数组
linspace = np.linspace(0, 1, 5)  # 0到1之间均匀分布的5个数
print(linspace)  # 输出: [0.   0.25 0.5  0.75 1.  ]

# 单位矩阵
eye = np.eye(3)
print(eye)
# [[1. 0. 0.]
#  [0. 1. 0.]
#  [0. 0. 1.]]
```

## NumPy 数据类型

NumPy 支持丰富的数据类型，满足不同的存储和计算需求。

### 常用数据类型

| 数据类型 | 说明 | 占用空间 |
|----------|------|----------|
| int8 | 8位整数 | 1字节 |
| int16 | 16位整数 | 2字节 |
| int32 | 32位整数 | 4字节 |
| int64 | 64位整数 | 8字节 |
| float16 | 半精度浮点 | 2字节 |
| float32 | 单精度浮点 | 4字节 |
| float64 | 双精度浮点 | 8字节 |
| bool | 布尔型 | 1字节 |
| complex64 | 复数（两个32位） | 8字节 |
| complex128 | 复数（两个64位） | 16字节 |

### 数据类型转换

```python
import numpy as np

# 创建数组时指定类型
arr = np.array([1, 2, 3], dtype=np.float32)
print(arr)  # 输出: [1. 2. 3.]

# 类型转换
arr_int = arr.astype(np.int32)
print(arr_int)  # 输出: [1 2 3]

# 查看数据类型
print(arr.dtype)  # 输出: float32
```

## NumPy 数组属性

理解数组属性对于高效操作数据至关重要。

```python
import numpy as np

# 创建示例数组
arr = np.array([[1, 2, 3], [4, 5, 6]])

# 查看维度数量（轴的数量）
print(arr.ndim)  # 输出: 2

# 查看数组形状
print(arr.shape)  # 输出: (2, 3)

# 查看元素总数
print(arr.size)  # 输出: 6

# 查看元素数据类型
print(arr.dtype)  # 输出: int64

# 查看元素字节大小
print(arr.itemsize)  # 输出: 8

# 查看数组总字节数
print(arr.nbytes)  # 输出: 48
```

## NumPy 索引与切片

NumPy 提供了强大而直观的数组索引和切片功能。

### 基本索引

```python
import numpy as np

arr = np.array([[1, 2, 3, 4], 
                [5, 6, 7, 8], 
                [9, 10, 11, 12]])

# 访问单个元素
print(arr[0, 0])  # 输出: 1
print(arr[2, 3])  # 输出: 12

# 访问整行
print(arr[1, :])  # 输出: [5 6 7 8]

# 访问整列
print(arr[:, 2])  # 输出: [3 7 11]

# 访问子矩阵
print(arr[0:2, 1:3])
# [[2 3]
#  [6 7]]
```

### 高级索引

高级索引可以用于复杂的数据选择场景：

```python
import numpy as np

arr = np.array([[1, 2, 3], 
                [4, 5, 6], 
                [7, 8, 9]])

# 整数数组索引
rows = np.array([0, 1, 2])
cols = np.array([0, 1, 2])
print(arr[rows, cols])  # 输出: [1 5 9]（对角线元素）

# 布尔索引
condition = arr > 5
print(arr[condition])  # 输出: [6 7 8 9]

# 使用条件赋值
arr[arr > 5] = 0
print(arr)
# [[1 2 3]
#  [4 5 0]
#  [0 0 0]]
```

## NumPy 广播机制

广播是 NumPy 的一项重要功能，允许在不同形状的数组之间进行数学运算。

### 广播规则

当两个数组进行运算时，NumPy 按以下规则比较它们的形状：
1. 从后向前比较维度
2. 每个维度要么相等，要么其中一个为1
3. 满足条件即可广播

```python
import numpy as np

# 一维数组与标量相加
a = np.array([1, 2, 3])
b = 10
print(a + b)  # 输出: [11 12 13]

# 二维数组与一维数组相加
A = np.array([[1, 2, 3], 
              [4, 5, 6]])
B = np.array([10, 20, 30])
print(A + B)
# [[11 22 33]
#  [14 25 36]]

# 二维数组与列向量相加
C = np.array([10, 20]).reshape(2, 1)
print(A + C)
# [[11 12 13]
#  [24 25 26]]
```

### 广播应用示例

```python
import numpy as np

# 数据标准化
data = np.array([[100, 200, 300], 
                 [150, 250, 350]])
mean = data.mean(axis=0)  # 计算每列均值
std = data.std(axis=0)   # 计算每列标准差
normalized = (data - mean) / std
print(normalized)
```

## NumPy 数组操作

### 数组形状操作

```python
import numpy as np

arr = np.arange(12)
print(arr)  # 输出: [ 0  1  2 ... 11]

# reshape: 改变数组形状（不改变数据）
reshaped = arr.reshape(3, 4)
print(reshaped)
# [[ 0  1  2  3]
#  [ 4  5  6  7]
#  [ 8  9 10 11]]

# flatten: 将多维数组展平
flat = reshaped.flatten()
print(flat)  # 输出: [ 0  1  2 ... 11]

# transpose: 转置
transposed = reshaped.T
print(transposed)
# [[ 0  4  8]
#  [ 1  5  9]
#  [ 2  6 10]
#  [ 3  7 11]]
```

### 数组合并与分割

```python
import numpy as np

a = np.array([[1, 2], [3, 4]])
b = np.array([[5, 6], [7, 8]])

# 垂直合并
v_stack = np.vstack((a, b))
print(v_stack)
# [[1 2]
#  [3 4]
#  [5 6]
#  [7 8]]

# 水平合并
h_stack = np.hstack((a, b))
print(h_stack)
# [[1 2 5 6]
#  [3 4 7 8]]

# 水平分割
parts = np.hsplit(v_stack, 2)
print(parts[0])
# [[1 2]
#  [3 4]]
```

## NumPy 数学函数

### 算术运算

```python
import numpy as np

a = np.array([1, 2, 3, 4, 5])
b = np.array([10, 20, 30, 40, 50])

# 基本运算
print(a + b)   # 加法: [11 22 33 44 55]
print(a - b)   # 减法: [-9 -18 -27 -36 -45]
print(a * b)   # 乘法: [10 40 90 160 250]
print(b / a)   # 除法: [10. 10. 10. 10. 10.]
print(b // a)  # 整除: [10 10 10 10 10]
print(a ** 2)  # 幂运算: [1 4 9 16 25]
print(b % a)   # 取余: [0 0 0 0 0]
```

### 常用数学函数

```python
import numpy as np

arr = np.array([0, np.pi/6, np.pi/4, np.pi/3, np.pi/2])

# 三角函数
print(np.sin(arr))   # 正弦
print(np.cos(arr))   # 余弦
print(np.tan(arr))   # 正切

# 反三角函数
print(np.arcsin(np.array([0, 0.5, 1])))  # 反正弦

# 其他数学函数
print(np.sqrt([4, 9, 16]))      # 平方根
print(np.abs([-1, -2, 3]))       # 绝对值
print(np.log(np.array([1, np.e, np.e**2])))  # 自然对数
print(np.exp(np.array([0, 1, 2])))  # 指数函数
```

## NumPy 统计函数

统计函数是数据分析中最常用的工具。

```python
import numpy as np

arr = np.array([[1, 2, 3], 
                [4, 5, 6], 
                [7, 8, 9]])

# 基本统计
print(arr.sum())      # 总和: 45
print(arr.mean())     # 均值: 5.0
print(arr.std())      # 标准差
print(arr.var())      # 方差
print(arr.min())      # 最小值: 1
print(arr.max())      # 最大值: 9

# 按轴计算
print(arr.sum(axis=0))   # 按列求和: [12 15 18]
print(arr.sum(axis=1))   # 按行求和: [ 6 15 24]

# 查找索引
print(arr.argmin())  # 最小值索引: 0
print(arr.argmax())  # 最大值索引: 8
```

## NumPy 线性代数

NumPy 提供了完整的线性代数运算支持。

```python
import numpy as np

# 矩阵乘法
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])
C = np.dot(A, B)  # 或 A @ B
print(C)
# [[19 22]
#  [43 50]]

# 矩阵转置
print(A.T)

# 矩阵求逆
A_inv = np.linalg.inv(A)
print(A_inv)

# 行列式
det = np.linalg.det(A)
print(det)  # 输出: -2.0000000000000004

# 特征值和特征向量
eigenvalues, eigenvectors = np.linalg.eig(A)
print(eigenvalues)
print(eigenvectors)

# 解线性方程组 Ax = B
B_vec = np.array([5, 11])
x = np.linalg.solve(A, B_vec)
print(x)  # 输出: [-1.  3.]
```

## NumPy 随机数生成

```python
import numpy as np

# 设置随机种子（保证结果可复现）
np.random.seed(42)

# 生成随机数
print(np.random.rand(5))        # 均匀分布 [0, 1)
print(np.random.randn(5))       # 标准正态分布
print(np.random.randint(1, 10, 5))  # 整数随机数

# 随机选择
arr = np.array([1, 2, 3, 4, 5])
print(np.random.choice(arr, 3))  # 随机选择3个元素
print(np.random.shuffle(arr))    # 随机打乱顺序
```

## NumPy 与 Matplotlib 配合

NumPy 常与 Matplotlib 配合进行数据可视化：

```python
import numpy as np
import matplotlib.pyplot as plt

# 生成数据
x = np.linspace(0, 2 * np.pi, 100)
y = np.sin(x)

# 绘制图像
plt.figure(figsize=(10, 6))
plt.plot(x, y, 'b-', linewidth=2, label='sin(x)')
plt.xlabel('X轴', fontsize=12)
plt.ylabel('Y轴', fontsize=12)
plt.title('NumPy + Matplotlib 示例', fontsize=14)
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()
```

## 实用技巧与最佳实践

### 向量化编程

尽量使用 NumPy 的向量化操作，避免 Python 循环：

```python
# ❌ 低效：使用 Python 循环
result = []
for x in range(1000):
    result.append(x ** 2)

# ✅ 高效：使用 NumPy 向量化
result = np.arange(1000) ** 2
```

### 内存管理

```python
import numpy as np

# 使用视图（共享内存）
a = np.arange(10)
b = a[0:5]  # b 是 a 的视图，修改 b 会影响 a

# 使用副本（独立内存）
c = a[0:5].copy()  # c 是独立的副本
```

### 性能优化

```python
import numpy as np

# 使用 np.where 替代条件循环
condition = np.array([True, False, True, False])
x = np.array([1, 2, 3, 4])
y = np.array([10, 20, 30, 40])
result = np.where(condition, x, y)  # 条件为True取x，否则取y

# 使用 np.clip 限制范围
arr = np.array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
clipped = np.clip(arr, 2, 7)  # 限制在[2, 7]范围内
```

## 总结

NumPy 是 Python 科学计算的基石，掌握 NumPy 是进入数据科学和机器学习领域的必要前提。本教程涵盖了 NumPy 的核心知识点：

1. ** ndarray 对象**：理解多维数组的创建和基本操作
2. **索引切片**：掌握数组的数据访问方式
3. **广播机制**：理解不同形状数组的运算规则
4. **数学统计**：熟练运用各种数学和统计函数
5. **线性代数**：矩阵运算和求解线性方程组
6. **随机数**：生成各类分布的随机数

建议读者在学习完本教程后，结合 NumPy 官方文档和实践项目，进一步深化对 NumPy 的理解和应用能力。
