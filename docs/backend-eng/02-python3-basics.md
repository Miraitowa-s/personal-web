# Python3 基础教程

Python 是一种解释型、面向对象、动态数据类型的高级程序设计语言。Python3 是 Python 语言的最新版本，于 2008 年 12 月 3 日发布，与 Python2 不完全兼容。本教程将带你从零开始学习 Python3 编程。

## 一、Python3 简介

### 1.1 什么是 Python

Python 由 Guido van Rossum 于 1989 年底发明，第一个公开发行版发行于 1991 年。Python 源代码遵循 GPL 协议。

**Python 的特点：**

| 特点 | 说明 |
|------|------|
| 易于学习 | 有相对较少的关键字，结构简单，语法清晰 |
| 易于阅读 | 代码定义的更清晰，像读英语一样 |
| 易于维护 | 源代码相当容易维护 |
| 广泛的标准库 | 丰富的库，功能强大 |
| 互动模式 | 支持从终端输入执行代码并获得结果 |
| 可移植 | 基于开放源代码，可移植到多个平台 |
| 可扩展 | 可以调用 C/C++ 程序 |
| 数据库 | 提供所有主要的商业数据库接口 |
| GUI编程 | 支持创建和移植到许多系统调用 |

### 1.2 Python3 与 Python2 的区别

Python3 是一次重大升级，主要区别包括：

- **print 函数**：Python3 中 `print` 是函数，必须加括号
- **编码**：Python3 默认使用 UTF-8 编码
- **除法运算**：`/` 返回浮点数，`//` 返回整数
- **xrange**：Python3 中只有 `range()`，功能与 Python2 的 `xrange` 相同
- **异常处理**：语法改为 `as` 关键字

## 二、环境搭建

### 2.1 安装 Python3

**Windows 安装：**
1. 访问 https://www.python.org/downloads/
2. 下载最新版本的 Python3
3. 运行安装程序，勾选 "Add Python to PATH"
4. 点击 "Install Now"

**Linux/macOS 安装：**
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install python3

# macOS (使用 Homebrew)
brew install python3
```

### 2.2 验证安装

```bash
python3 --version
```

输出示例：
```
Python 3.9.7
```

### 2.3 第一个 Python 程序

创建文件 `hello.py`：

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

print("Hello, World!")
```

运行程序：
```bash
python3 hello.py
```

## 三、基础语法

### 3.1 编码

Python3 源码文件默认使用 UTF-8 编码，可以正常处理中文。

```python
# 指定编码（通常不需要）
# -*- coding: utf-8 -*-
```

### 3.2 标识符

- 第一个字符必须是字母或下划线 `_`
- 标识符的其他部分由字母、数字和下划线组成
- 区分大小写
- 不能使用 Python 关键字

**命名规范：**
- 类名使用大驼峰：`MyClass`
- 函数和变量使用小写加下划线：`my_function`, `my_variable`
- 私有变量以单下划线开头：`_private_var`
- 强私有变量以双下划线开头：`__strong_private`

### 3.3 注释

```python
# 这是单行注释

'''
这是多行注释
使用三个单引号
'''

"""
这也是多行注释
使用三个双引号
"""
```

### 3.4 行与缩进

Python 使用缩进来表示代码块，不需要使用大括号 `{}`。

```python
if True:
    print("True")
else:
    print("False")
```

**注意：** 同一代码块的语句必须包含相同的缩进空格数，建议使用 4 个空格。

### 3.5 多行语句

使用反斜杠 `\` 实现多行语句：

```python
total = item_one + \
        item_two + \
        item_three
```

在 `[]`、`{}` 或 `()` 中的多行语句不需要反斜杠：

```python
total = ['item_one', 'item_two', 'item_three',
         'item_four', 'item_five']
```

## 四、数据类型

### 4.1 标准数据类型

Python3 中有六个标准的数据类型：

| 类型 | 说明 | 示例 |
|------|------|------|
| Number | 数字 | `10`, `3.14`, `3+4j` |
| String | 字符串 | `"Hello"` |
| List | 列表 | `[1, 2, 3]` |
| Tuple | 元组 | `(1, 2, 3)` |
| Set | 集合 | `{1, 2, 3}` |
| Dictionary | 字典 | `{"name": "Tom"}` |

### 4.2 数字（Number）

Python3 支持三种数值类型：

- **int（整数）**：如 `10`, `-5`, `0`
- **float（浮点数）**：如 `3.14`, `-0.5`
- **complex（复数）**：如 `3+4j`, `-5j`

```python
# 数字运算
a = 10
b = 3

print(a + b)    # 13
print(a - b)    # 7
print(a * b)    # 30
print(a / b)    # 3.333...（浮点除法）
print(a // b)   # 3（整除）
print(a % b)    # 1（取余）
print(a ** b)   # 1000（幂运算）
```

### 4.3 字符串（String）

字符串是 Python 中最常用的数据类型，可以使用单引号、双引号或三引号创建。

```python
# 字符串定义
str1 = 'Hello'
str2 = "World"
str3 = '''这是一个
多行字符串'''

# 字符串索引和切片
s = "Hello, World!"
print(s[0])       # H
print(s[-1])      # !
print(s[0:5])     # Hello
print(s[7:])      # World!
print(s[:5])      # Hello

# 字符串常用方法
s = "  Hello World  "
print(s.strip())      # "Hello World"（去除首尾空格）
print(s.lower())      # "  hello world  "
print(s.upper())      # "  HELLO WORLD  "
print(s.replace("World", "Python"))  # "  Hello Python  "
print(s.split())      # ['Hello', 'World']
print("-".join(["a", "b", "c"]))  # "a-b-c"
```

### 4.4 列表（List）

列表是 Python 中最常用的数据结构，可以存储任意类型的元素。

```python
# 创建列表
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", 3.14, True]

# 访问元素
print(fruits[0])      # apple
print(fruits[-1])     # cherry

# 修改元素
fruits[1] = "orange"

# 列表方法
fruits.append("grape")        # 添加元素
fruits.insert(1, "mango")     # 插入元素
fruits.remove("apple")        # 删除指定元素
fruits.pop()                  # 删除最后一个元素
fruits.pop(0)                 # 删除指定索引元素
fruits.sort()                 # 排序
fruits.reverse()              # 反转
print(len(fruits))            # 获取长度

# 列表切片
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
print(numbers[2:5])   # [2, 3, 4]
print(numbers[:3])    # [0, 1, 2]
print(numbers[7:])    # [7, 8, 9]
print(numbers[::2])   # [0, 2, 4, 6, 8]（步长为2）
print(numbers[::-1])  # [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]（反转）
```

### 4.5 元组（Tuple）

元组与列表类似，但元组是不可变的。

```python
# 创建元组
t = (1, 2, 3)
single = (1,)  # 单元素元组需要逗号

# 元组解包
a, b, c = t
print(a, b, c)  # 1 2 3

# 元组不可修改
# t[0] = 10  # 这会报错
```

### 4.6 字典（Dictionary）

字典是键值对的集合，使用 `{}` 创建。

```python
# 创建字典
person = {
    "name": "Alice",
    "age": 25,
    "city": "Beijing"
}

# 访问值
print(person["name"])       # Alice
print(person.get("age"))    # 25
print(person.get("gender", "Unknown"))  # Unknown（默认值）

# 修改和添加
person["age"] = 26
person["gender"] = "Female"

# 删除
person.pop("city")
# del person["city"]

# 遍历字典
for key in person:
    print(key, person[key])

for key, value in person.items():
    print(f"{key}: {value}")

# 字典方法
print(person.keys())    # dict_keys(['name', 'age', 'gender'])
print(person.values())  # dict_values(['Alice', 26, 'Female'])
print(person.items())   # dict_items([('name', 'Alice'), ...])
```

### 4.7 集合（Set）

集合是无序、不重复的元素集合。

```python
# 创建集合
s = {1, 2, 3, 3, 3}  # 自动去重
print(s)  # {1, 2, 3}

# 集合操作
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

print(a | b)  # 并集: {1, 2, 3, 4, 5, 6}
print(a & b)  # 交集: {3, 4}
print(a - b)  # 差集: {1, 2}
print(a ^ b)  # 对称差集: {1, 2, 5, 6}

# 集合方法
s.add(4)          # 添加元素
s.remove(2)       # 删除元素（不存在会报错）
s.discard(10)     # 删除元素（不存在不报错）
s.pop()           # 随机删除一个元素
```

## 五、运算符

### 5.1 算术运算符

```python
a, b = 10, 3
print(a + b)   # 13
print(a - b)   # 7
print(a * b)   # 30
print(a / b)   # 3.333...
print(a // b)  # 3
print(a % b)   # 1
print(a ** b)  # 1000
```

### 5.2 比较运算符

```python
a, b = 10, 3
print(a == b)  # False
print(a != b)  # True
print(a > b)   # True
print(a < b)   # False
print(a >= b)  # True
print(a <= b)  # False
```

### 5.3 赋值运算符

```python
a = 10
a += 3   # a = a + 3
a -= 3   # a = a - 3
a *= 3   # a = a * 3
a /= 3   # a = a / 3
a //= 3  # a = a // 3
a %= 3   # a = a % 3
a **= 3  # a = a ** 3
```

### 5.4 逻辑运算符

```python
a, b = True, False
print(a and b)  # False
print(a or b)   # True
print(not a)    # False
```

### 5.5 成员运算符

```python
fruits = ["apple", "banana"]
print("apple" in fruits)      # True
print("grape" not in fruits)  # True
```

### 5.6 身份运算符

```python
a = [1, 2, 3]
b = a
c = [1, 2, 3]

print(a is b)      # True（同一对象）
print(a is c)      # False（不同对象，值相同）
print(a == c)      # True（值相等）
print(a is not c)  # True
```

## 六、条件语句

### 6.1 if 语句

```python
age = 18

if age >= 18:
    print("成年人")
```

### 6.2 if-else 语句

```python
age = 16

if age >= 18:
    print("成年人")
else:
    print("未成年人")
```

### 6.3 if-elif-else 语句

```python
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"成绩等级: {grade}")
```

### 6.4 条件表达式（三元运算符）

```python
age = 20
status = "成年人" if age >= 18 else "未成年人"
print(status)
```

## 七、循环语句

### 7.1 while 循环

```python
# 基本 while 循环
count = 0
while count < 5:
    print(count)
    count += 1

# while-else
n = 5
while n > 0:
    print(n)
    n -= 1
else:
    print("循环结束")
```

### 7.2 for 循环

```python
# 遍历列表
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# 遍历字符串
for char in "Hello":
    print(char)

# range() 函数
for i in range(5):        # 0, 1, 2, 3, 4
    print(i)

for i in range(2, 6):     # 2, 3, 4, 5
    print(i)

for i in range(0, 10, 2): # 0, 2, 4, 6, 8
    print(i)

# enumerate() 获取索引
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")

# zip() 并行遍历
names = ["Alice", "Bob", "Charlie"]
ages = [25, 30, 35]
for name, age in zip(names, ages):
    print(f"{name} is {age} years old")
```

### 7.3 循环控制

```python
# break - 跳出循环
for i in range(10):
    if i == 5:
        break
    print(i)  # 0, 1, 2, 3, 4

# continue - 跳过当前迭代
for i in range(5):
    if i == 2:
        continue
    print(i)  # 0, 1, 3, 4

# pass - 占位符
for i in range(5):
    pass  # 什么也不做
```

## 八、函数

### 8.1 定义函数

```python
def greet(name):
    """这是一个文档字符串（docstring）"""
    return f"Hello, {name}!"

# 调用函数
message = greet("Alice")
print(message)  # Hello, Alice!

# 查看文档
print(greet.__doc__)
```

### 8.2 参数类型

```python
# 位置参数
def add(a, b):
    return a + b

print(add(3, 5))  # 8

# 默认参数
def power(base, exponent=2):
    return base ** exponent

print(power(3))      # 9 (3²)
print(power(2, 3))   # 8 (2³)

# 关键字参数
def person_info(name, age, city):
    return f"{name}, {age}岁, 来自{city}"

print(person_info(age=25, city="北京", name="张三"))

# 可变参数 *args
def sum_all(*numbers):
    return sum(numbers)

print(sum_all(1, 2, 3, 4, 5))  # 15

# 关键字参数 **kwargs
def print_info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name="Alice", age=25, city="Beijing")
```

### 8.3 匿名函数（lambda）

```python
# 基本 lambda
square = lambda x: x ** 2
print(square(5))  # 25

# 多参数 lambda
add = lambda x, y: x + y
print(add(3, 4))  # 7

# 与高阶函数结合
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x ** 2, numbers))
print(squared)  # [1, 4, 9, 16, 25]

evens = list(filter(lambda x: x % 2 == 0, numbers))
print(evens)  # [2, 4]
```

### 8.4 作用域

```python
# 局部变量和全局变量
x = 10  # 全局变量

def func():
    x = 5  # 局部变量
    print(f"局部 x: {x}")

func()        # 局部 x: 5
print(f"全局 x: {x}")  # 全局 x: 10

# 修改全局变量
count = 0

def increment():
    global count
    count += 1

increment()
print(count)  # 1

# nonlocal（嵌套函数）
def outer():
    x = 10
    def inner():
        nonlocal x
        x = 20
    inner()
    print(x)  # 20

outer()
```

## 九、模块

### 9.1 导入模块

```python
# 导入整个模块
import math
print(math.sqrt(16))  # 4.0

# 导入特定函数
from math import sqrt, pi
print(sqrt(16))  # 4.0
print(pi)        # 3.141592653589793

# 使用别名
import numpy as np
from math import sqrt as square_root

# 导入所有（不推荐）
from math import *
```

### 9.2 创建模块

创建文件 `mymodule.py`：

```python
# mymodule.py
def greet(name):
    return f"Hello, {name}!"

PI = 3.14159
```

使用模块：

```python
import mymodule

print(mymodule.greet("Alice"))
print(mymodule.PI)
```

### 9.3 常用标准库模块

```python
# os - 操作系统接口
import os
print(os.getcwd())  # 获取当前工作目录
print(os.listdir('.'))  # 列出目录内容

# sys - 系统相关
import sys
print(sys.version)  # Python版本
print(sys.argv)     # 命令行参数

# datetime - 日期时间
from datetime import datetime, timedelta
now = datetime.now()
print(now.strftime("%Y-%m-%d %H:%M:%S"))

# random - 随机数
import random
print(random.randint(1, 100))
print(random.choice(["apple", "banana", "cherry"]))

# json - JSON处理
import json
data = {"name": "Alice", "age": 25}
json_str = json.dumps(data)
parsed = json.loads(json_str)

# re - 正则表达式
import re
pattern = r"\d+"
result = re.findall(pattern, "abc123def456")
print(result)  # ['123', '456']
```

## 十、文件操作

### 10.1 读写文件

```python
# 写入文件
with open("test.txt", "w", encoding="utf-8") as f:
    f.write("Hello, World!\n")
    f.write("第二行\n")

# 读取文件
with open("test.txt", "r", encoding="utf-8") as f:
    content = f.read()
    print(content)

# 逐行读取
with open("test.txt", "r", encoding="utf-8") as f:
    for line in f:
        print(line.strip())

# 读取为列表
with open("test.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()
```

### 10.2 文件模式

| 模式 | 说明 |
|------|------|
| `r` | 只读（默认） |
| `w` | 只写，会覆盖原有内容 |
| `a` | 追加模式 |
| `x` | 创建新文件，如果文件已存在会报错 |
| `b` | 二进制模式 |
| `t` | 文本模式（默认） |
| `+` | 读写模式 |

### 10.3 文件和目录操作

```python
import os

# 文件操作
os.rename("old.txt", "new.txt")
os.remove("file.txt")
os.path.exists("file.txt")
os.path.getsize("file.txt")

# 目录操作
os.mkdir("new_folder")
os.makedirs("path/to/folder", exist_ok=True)
os.rmdir("empty_folder")
os.listdir(".")
os.getcwd()
os.chdir("/path/to/dir")

# 路径操作
import os.path
print(os.path.join("folder", "file.txt"))
print(os.path.abspath("file.txt"))
print(os.path.dirname("/path/to/file.txt"))
print(os.path.basename("/path/to/file.txt"))
print(os.path.splitext("file.txt"))  # ('file', '.txt')
```

## 十一、异常处理

### 11.1 基本异常处理

```python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("不能除以零！")
except Exception as e:
    print(f"发生错误: {e}")
else:
    print(f"结果是: {result}")
finally:
    print("无论是否异常都会执行")
```

### 11.2 常见异常类型

| 异常类型 | 说明 |
|----------|------|
| `SyntaxError` | 语法错误 |
| `NameError` | 未声明的变量 |
| `TypeError` | 类型错误 |
| `ValueError` | 值错误 |
| `IndexError` | 索引超出范围 |
| `KeyError` | 字典中不存在的键 |
| `FileNotFoundError` | 文件不存在 |
| `ZeroDivisionError` | 除以零 |

### 11.3 自定义异常

```python
class ValidationError(Exception):
    """自定义验证错误"""
    pass

def validate_age(age):
    if age < 0:
        raise ValidationError("年龄不能为负数")
    if age > 150:
        raise ValidationError("年龄不现实")
    return age

try:
    validate_age(-5)
except ValidationError as e:
    print(e)
```

## 十二、面向对象编程

### 12.1 类和对象

```python
class Dog:
    # 类属性
    species = "Canis familiaris"
    
    # 构造方法
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    # 实例方法
    def description(self):
        return f"{self.name} is {self.age} years old"
    
    def speak(self, sound):
        return f"{self.name} says: {sound}"

# 创建对象
my_dog = Dog("Buddy", 3)
print(my_dog.description())
print(my_dog.speak("Woof Woof"))
```

### 12.2 继承

```python
class Animal:
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        raise NotImplementedError("子类必须实现此方法")

class Cat(Animal):
    def __init__(self, name, color):
        super().__init__(name)
        self.color = color
    
    def speak(self):
        return f"{self.name} says: Meow!"

class Dog(Animal):
    def speak(self):
        return f"{self.name} says: Woof!"

# 多态
animals = [Cat("Kitty", "white"), Dog("Buddy")]
for animal in animals:
    print(animal.speak())
```

### 12.3 魔术方法

```python
class Book:
    def __init__(self, title, author, pages):
        self.title = title
        self.author = author
        self.pages = pages
    
    def __str__(self):
        return f"{self.title} by {self.author}"
    
    def __repr__(self):
        return f"Book('{self.title}', '{self.author}', {self.pages})"
    
    def __len__(self):
        return self.pages
    
    def __eq__(self, other):
        return self.title == other.title and self.author == other.author

book = Book("Python入门", "张三", 300)
print(str(book))   # Python入门 by 张三
print(len(book))   # 300
```

## 十三、总结

本教程涵盖了 Python3 的基础知识，包括：

1. **环境搭建** - 安装 Python3 并编写第一个程序
2. **基础语法** - 编码、标识符、注释、缩进规则
3. **数据类型** - 数字、字符串、列表、元组、字典、集合
4. **运算符** - 算术、比较、赋值、逻辑、成员、身份运算符
5. **条件语句** - if、if-else、if-elif-else、三元表达式
6. **循环语句** - while、for、循环控制
7. **函数** - 定义、参数、lambda、作用域
8. **模块** - 导入、创建、常用标准库
9. **文件操作** - 读写文件、文件和目录操作
10. **异常处理** - try-except、常见异常、自定义异常
11. **面向对象** - 类、对象、继承、魔术方法

掌握这些基础知识后，你就可以开始编写实用的 Python 程序了。建议通过实际项目来巩固所学知识，并继续学习更高级的主题如装饰器、生成器、迭代器、上下文管理器等。
