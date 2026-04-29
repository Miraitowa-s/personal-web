# Python3 高级特性

Python 不仅是一门易于入门的编程语言，还提供了许多强大的高级特性，让代码更加简洁、高效和优雅。本教程将深入讲解 Python3 的高级特性，包括装饰器、生成器、上下文管理器、迭代器、元类等核心概念。

## 一、迭代器与生成器

### 1.1 迭代器（Iterator）

迭代器是实现了迭代器协议的对象，包含 `__iter__()` 和 `__next__()` 方法。

```python
# 基本迭代器使用
my_list = [1, 2, 3]
my_iter = iter(my_list)

print(next(my_iter))  # 1
print(next(my_iter))  # 2
print(next(my_iter))  # 3
# print(next(my_iter))  # StopIteration 异常

# 自定义迭代器
class CountDown:
    def __init__(self, start):
        self.start = start
    
    def __iter__(self):
        return self
    
    def __next__(self):
        if self.start <= 0:
            raise StopIteration
        self.start -= 1
        return self.start + 1

# 使用自定义迭代器
countdown = CountDown(5)
for num in countdown:
    print(num)  # 5, 4, 3, 2, 1
```

### 1.2 生成器（Generator）

生成器是一种特殊的迭代器，使用 `yield` 关键字定义，可以暂停和恢复执行。

```python
# 基本生成器
def countdown(n):
    while n > 0:
        yield n
        n -= 1

# 使用生成器
for num in countdown(5):
    print(num)  # 5, 4, 3, 2, 1

# 生成器表达式（类似列表推导式）
squares = (x**2 for x in range(10))
print(next(squares))  # 0
print(next(squares))  # 1
print(list(squares))  # [4, 9, 16, 25, 36, 49, 64, 81]

# 生成器 vs 列表
def fibonacci_list(n):
    """返回斐波那契数列列表"""
    result = []
    a, b = 0, 1
    for _ in range(n):
        result.append(a)
        a, b = b, a + b
    return result

def fibonacci_gen(n):
    """生成器版本，节省内存"""
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

# 内存对比
import sys
print(sys.getsizeof(fibonacci_list(1000)))  # 较大
print(sys.getsizeof(fibonacci_gen(1000)))   # 较小（约 112 字节）
```

### 1.3 生成器的高级用法

```python
# 生成器.send() 方法
def accumulator():
    total = 0
    while True:
        value = yield total
        if value is None:
            break
        total += value

acc = accumulator()
next(acc)  # 预激生成器
print(acc.send(10))   # 10
print(acc.send(20))   # 30
print(acc.send(30))   # 60

# 生成器.throw() 方法
def generator_with_exception():
    try:
        yield "Working..."
    except ValueError:
        yield "ValueError caught!"

gen = generator_with_exception()
print(next(gen))  # Working...
print(gen.throw(ValueError, "test error"))  # ValueError caught!

# 生成器.close() 方法
def generator_to_close():
    try:
        yield 1
        yield 2
    finally:
        print("Generator is being closed")

gen = generator_to_close()
print(next(gen))  # 1
gen.close()       # Generator is being closed
```

### 1.4 yield from

`yield from` 用于委托子生成器，简化嵌套生成器的代码。

```python
# 不使用 yield from
def flatten_nested(nested):
    for sublist in nested:
        for item in sublist:
            yield item

# 使用 yield from
def flatten_nested_v2(nested):
    for sublist in nested:
        yield from sublist

nested = [[1, 2, 3], [4, 5], [6, 7, 8, 9]]
print(list(flatten_nested(nested)))
print(list(flatten_nested_v2(nested)))

# 递归生成器
class Node:
    def __init__(self, value, children=None):
        self.value = value
        self.children = children or []
    
    def __repr__(self):
        return f"Node({self.value})"

def traverse_tree(node):
    yield node
    for child in node.children:
        yield from traverse_tree(child)

# 构建树
root = Node(1, [
    Node(2, [Node(4), Node(5)]),
    Node(3, [Node(6)])
])

for node in traverse_tree(root):
    print(node.value)  # 1, 2, 4, 5, 3, 6
```

## 二、装饰器

### 2.1 函数装饰器基础

装饰器是一种高阶函数，用于在不修改原函数代码的情况下扩展功能。

```python
# 基本装饰器
def my_decorator(func):
    def wrapper(*args, **kwargs):
        print("函数执行前")
        result = func(*args, **kwargs)
        print("函数执行后")
        return result
    return wrapper

@my_decorator
def say_hello():
    print("Hello!")

say_hello()
# 输出:
# 函数执行前
# Hello!
# 函数执行后

# 带参数的装饰器
def repeat(num):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for _ in range(num):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")
```

### 2.2 常用装饰器模式

```python
import functools
import time

# 保留原函数元信息的装饰器
def my_decorator(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        """这是 wrapper 函数"""
        return func(*args, **kwargs)
    return wrapper

@my_decorator
def example():
    """这是 example 函数"""
    pass

print(example.__name__)  # example（使用 @functools.wraps 后）
print(example.__doc__)   # 这是 example 函数

# 计时装饰器
def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        elapsed = time.time() - start
        print(f"{func.__name__} 执行时间: {elapsed:.4f} 秒")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)
    return "Done"

slow_function()

# 缓存装饰器（LRU Cache）
@functools.lru_cache(maxsize=128)
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# 第一次计算较慢
print(fibonacci(100))
# 第二次从缓存读取，几乎瞬间完成
print(fibonacci(100))

# 查看缓存信息
print(fibonacci.cache_info())
# 清空缓存
fibonacci.cache_clear()

# 权限检查装饰器
def require_login(func):
    @functools.wraps(func)
    def wrapper(user, *args, **kwargs):
        if not user.get("is_logged_in"):
            raise PermissionError("用户未登录")
        return func(user, *args, **kwargs)
    return wrapper

@require_login
def view_profile(user):
    return f"用户资料: {user['name']}"

# 测试
user_logged_in = {"name": "Alice", "is_logged_in": True}
user_guest = {"name": "Bob", "is_logged_in": False}

print(view_profile(user_logged_in))  # 成功
# print(view_profile(user_guest))    # 抛出 PermissionError
```

### 2.3 类装饰器

```python
# 类作为装饰器
class CountCalls:
    def __init__(self, func):
        functools.update_wrapper(self, func)
        self.func = func
        self.count = 0
    
    def __call__(self, *args, **kwargs):
        self.count += 1
        print(f"{self.func.__name__} 被调用了 {self.count} 次")
        return self.func(*args, **kwargs)

@CountCalls
def say_whee():
    print("Whee!")

say_whee()
say_whee()

# 装饰器修改类行为
def singleton(cls):
    """单例模式装饰器"""
    instances = {}
    @functools.wraps(cls)
    def wrapper(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    return wrapper

@singleton
class Database:
    def __init__(self):
        print("初始化数据库连接")

db1 = Database()
db2 = Database()
print(db1 is db2)  # True

# 属性装饰器
class Circle:
    def __init__(self, radius):
        self._radius = radius
    
    @property
    def radius(self):
        """获取半径"""
        return self._radius
    
    @radius.setter
    def radius(self, value):
        """设置半径"""
        if value < 0:
            raise ValueError("半径不能为负数")
        self._radius = value
    
    @radius.deleter
    def radius(self):
        """删除半径"""
        del self._radius
    
    @property
    def area(self):
        """计算面积（只读属性）"""
        return 3.14159 * self._radius ** 2

circle = Circle(5)
print(circle.radius)  # 5
print(circle.area)    # 78.53975
circle.radius = 10
print(circle.area)    # 314.159
# circle.area = 100   # AttributeError: can't set attribute
```

## 三、上下文管理器

### 3.1 基本使用

上下文管理器用于管理资源的获取和释放，最常见的是 `with` 语句。

```python
# 文件上下文管理器
with open("test.txt", "w") as f:
    f.write("Hello, World!")
# 文件自动关闭

# 多个上下文管理器
with open("input.txt", "r") as infile, open("output.txt", "w") as outfile:
    outfile.write(infile.read())

# 自定义上下文管理器（类实现）
class ManagedFile:
    def __init__(self, filename, mode):
        self.filename = filename
        self.mode = mode
        self.file = None
    
    def __enter__(self):
        print(f"打开文件: {self.filename}")
        self.file = open(self.filename, self.mode)
        return self.file
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        print(f"关闭文件: {self.filename}")
        if self.file:
            self.file.close()
        # 返回 True 表示异常已处理，不再传播
        return False

with ManagedFile("test.txt", "w") as f:
    f.write("Hello!")
```

### 3.2 使用 contextlib

```python
from contextlib import contextmanager, suppress, redirect_stdout
import io

# 使用装饰器创建上下文管理器
@contextmanager
def managed_resource(name):
    print(f"获取资源: {name}")
    resource = {"name": name, "data": []}
    try:
        yield resource
    finally:
        print(f"释放资源: {name}")

with managed_resource("database") as db:
    print(f"使用资源: {db['name']}")
    db['data'].append("some data")

# suppress - 忽略特定异常
with suppress(FileNotFoundError):
    with open("不存在的文件.txt", "r") as f:
        content = f.read()
print("程序继续执行")

# redirect_stdout - 重定向标准输出
captured = io.StringIO()
with redirect_stdout(captured):
    print("这行输出被捕获")
    print("不会显示在控制台")

print(f"捕获的内容: {captured.getvalue()}")

# ExitStack - 动态管理多个上下文
from contextlib import ExitStack

with ExitStack() as stack:
    files = [
        stack.enter_context(open(f"file{i}.txt", "w"))
        for i in range(3)
    ]
    for i, f in enumerate(files):
        f.write(f"Content of file {i}")
# 所有文件自动关闭
```

### 3.3 实用上下文管理器示例

```python
import time
from contextlib import contextmanager

# 计时上下文管理器
@contextmanager
def timer(name="操作"):
    start = time.time()
    yield
    elapsed = time.time() - start
    print(f"{name} 耗时: {elapsed:.4f} 秒")

with timer("数据处理"):
    time.sleep(0.5)
    # 执行一些操作

# 临时修改环境变量
import os

@contextmanager
def temp_env(**kwargs):
    """临时设置环境变量"""
    old_values = {}
    for key, value in kwargs.items():
        old_values[key] = os.environ.get(key)
        os.environ[key] = value
    try:
        yield
    finally:
        for key, old_value in old_values.items():
            if old_value is None:
                del os.environ[key]
            else:
                os.environ[key] = old_value

with temp_env(DEBUG="1", API_KEY="secret"):
    print(os.environ.get("DEBUG"))  # 1
print(os.environ.get("DEBUG"))      # None 或原值

# 数据库事务上下文
@contextmanager
def transaction(db):
    """数据库事务上下文"""
    try:
        yield db
        db.commit()
        print("事务提交成功")
    except Exception as e:
        db.rollback()
        print(f"事务回滚: {e}")
        raise

class MockDB:
    def commit(self): pass
    def rollback(self): pass

db = MockDB()
with transaction(db):
    print("执行数据库操作")
```

## 四、描述符

### 4.1 描述符协议

描述符是实现了 `__get__`、`__set__` 或 `__delete__` 方法的对象。

```python
# 验证器描述符
class Validator:
    def __init__(self, min_value=None, max_value=None):
        self.min_value = min_value
        self.max_value = max_value
    
    def __set_name__(self, owner, name):
        self.name = name
        self.private_name = f"_{name}"
    
    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return getattr(obj, self.private_name, None)
    
    def __set__(self, obj, value):
        if self.min_value is not None and value < self.min_value:
            raise ValueError(f"{self.name} 不能小于 {self.min_value}")
        if self.max_value is not None and value > self.max_value:
            raise ValueError(f"{self.name} 不能大于 {self.max_value}")
        setattr(obj, self.private_name, value)

class Person:
    age = Validator(min_value=0, max_value=150)
    score = Validator(min_value=0, max_value=100)
    
    def __init__(self, name, age, score):
        self.name = name
        self.age = age
        self.score = score

person = Person("Alice", 25, 85)
print(person.age)    # 25
person.age = 30      # 正常
# person.age = -5    # ValueError: age 不能小于 0
# person.score = 101 # ValueError: score 不能大于 100
```

### 4.2 类型检查描述符

```python
class Typed:
    def __init__(self, expected_type):
        self.expected_type = expected_type
    
    def __set_name__(self, owner, name):
        self.name = name
        self.private_name = f"_{name}"
    
    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return getattr(obj, self.private_name)
    
    def __set__(self, obj, value):
        if not isinstance(value, self.expected_type):
            raise TypeError(f"{self.name} 必须是 {self.expected_type.__name__} 类型")
        setattr(obj, self.private_name, value)

class Student:
    name = Typed(str)
    age = Typed(int)
    scores = Typed(list)
    
    def __init__(self, name, age):
        self.name = name
        self.age = age
        self.scores = []

student = Student("Bob", 20)
student.scores = [85, 90, 78]
# student.age = "20"  # TypeError: age 必须是 int 类型
```

## 五、元类

### 5.1 什么是元类

元类是创建类的类，默认的元类是 `type`。

```python
# 使用 type 动态创建类
MyClass = type('MyClass', (), {'x': 1})
obj = MyClass()
print(obj.x)  # 1

# 带继承和方法的类
class Base:
    def hello(self):
        return "Hello from Base"

def say_goodbye(self):
    return "Goodbye!"

MyClass2 = type('MyClass2', (Base,), {
    'y': 2,
    'say_goodbye': say_goodbye
})

obj2 = MyClass2()
print(obj2.hello())       # Hello from Base
print(obj2.say_goodbye()) # Goodbye!
```

### 5.2 自定义元类

```python
# 自定义元类
class SingletonMeta(type):
    """单例元类"""
    _instances = {}
    
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

class Logger(metaclass=SingletonMeta):
    def __init__(self):
        print("Logger 初始化")
    
    def log(self, message):
        print(f"[LOG] {message}")

logger1 = Logger()
logger2 = Logger()
print(logger1 is logger2)  # True

# 自动注册子类的元类
class PluginMeta(type):
    registry = {}
    
    def __new__(mcs, name, bases, namespace):
        cls = super().__new__(mcs, name, bases, namespace)
        if name != 'BasePlugin':
            mcs.registry[name] = cls
            print(f"注册插件: {name}")
        return cls

class BasePlugin(metaclass=PluginMeta):
    pass

class EmailPlugin(BasePlugin):
    pass

class SmsPlugin(BasePlugin):
    pass

print(PluginMeta.registry)
# {'EmailPlugin': <class '__main__.EmailPlugin'>, 'SmsPlugin': ...}
```

### 5.3 元类的实际应用

```python
# ORM 风格的元类
class ModelMeta(type):
    def __new__(mcs, name, bases, namespace):
        # 收集所有字段
        fields = {}
        for key, value in list(namespace.items()):
            if isinstance(value, Field):
                fields[key] = value
                value.name = key
        
        namespace['_fields'] = fields
        namespace['_table_name'] = name.lower()
        
        return super().__new__(mcs, name, bases, namespace)

class Field:
    def __init__(self, field_type):
        self.field_type = field_type
        self.name = None
    
    def __repr__(self):
        return f"Field({self.field_type})"

class Model(metaclass=ModelMeta):
    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)
    
    def save(self):
        fields = ", ".join(self._fields.keys())
        print(f"INSERT INTO {self._table_name} ({fields}) VALUES (...)")

class User(Model):
    id = Field("INTEGER")
    name = Field("VARCHAR(100)")
    email = Field("VARCHAR(255)")

# 查看自动生成的属性
print(User._fields)
print(User._table_name)

user = User(id=1, name="Alice", email="alice@example.com")
user.save()
```

## 六、函数式编程

### 6.1 高阶函数

```python
# map - 映射
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x ** 2, numbers))
print(squared)  # [1, 4, 9, 16, 25]

# filter - 过滤
evens = list(filter(lambda x: x % 2 == 0, numbers))
print(evens)  # [2, 4]

# reduce - 归约
from functools import reduce
product = reduce(lambda x, y: x * y, numbers)
print(product)  # 120

# sorted - 排序
words = ["banana", "pie", "Washington", "book"]
sorted_by_length = sorted(words, key=len)
print(sorted_by_length)  # ['pie', 'book', 'banana', 'Washington']

# 自定义高阶函数
def apply_operation(numbers, operation):
    return [operation(n) for n in numbers]

def double(x):
    return x * 2

def square(x):
    return x ** 2

print(apply_operation([1, 2, 3], double))  # [2, 4, 6]
print(apply_operation([1, 2, 3], square))  # [1, 4, 9]
```

### 6.2 偏函数与柯里化

```python
from functools import partial

# 偏函数
base_two = partial(int, base=2)
print(base_two("1010"))  # 10

# 固定多个参数
def power(base, exponent):
    return base ** exponent

square = partial(power, exponent=2)
cube = partial(power, exponent=3)
ten_to_the = partial(power, base=10)

print(square(5))      # 25
print(cube(3))        # 27
print(ten_to_the(3))  # 1000

# 柯里化实现
def curry(func):
    """将多参数函数转换为单参数链式调用"""
    def curried(*args):
        if len(args) >= func.__code__.co_argcount:
            return func(*args)
        return lambda x: curried(*(args + (x,)))
    return curried

@curry
def add_three(a, b, c):
    return a + b + c

print(add_three(1)(2)(3))  # 6
print(add_three(1, 2)(3))  # 6
```

### 6.3 函数组合

```python
def compose(*functions):
    """函数组合: compose(f, g, h)(x) = f(g(h(x)))"""
    def composed(value):
        result = value
        for func in reversed(functions):
            result = func(result)
        return result
    return composed

def add_one(x):
    return x + 1

def double(x):
    return x * 2

def to_string(x):
    return str(x)

# 组合函数
transform = compose(to_string, double, add_one)
print(transform(5))  # "12" (5+1=6, 6*2=12, str(12)="12")

# 管道操作符风格的函数组合
class Pipeline:
    def __init__(self, value):
        self.value = value
    
    def then(self, func):
        self.value = func(self.value)
        return self
    
    def result(self):
        return self.value

result = Pipeline(5)\
    .then(add_one)\
    .then(double)\
    .then(to_string)\
    .result()
print(result)  # "12"
```

## 七、并发编程

### 7.1 多线程

```python
import threading
import time

# 基本线程
def worker(name, delay):
    print(f"{name} 开始工作")
    time.sleep(delay)
    print(f"{name} 完成工作")

threads = []
for i in range(3):
    t = threading.Thread(target=worker, args=(f"线程-{i}", 1))
    threads.append(t)
    t.start()

for t in threads:
    t.join()

print("所有线程完成")

# 线程类
class MyThread(threading.Thread):
    def __init__(self, name):
        super().__init__()
        self.name = name
    
    def run(self):
        print(f"{self.name} 正在运行")
        time.sleep(1)
        print(f"{self.name} 结束")

t = MyThread("自定义线程")
t.start()
t.join()

# 线程同步 - Lock
class Counter:
    def __init__(self):
        self.value = 0
        self.lock = threading.Lock()
    
    def increment(self):
        with self.lock:
            current = self.value
            time.sleep(0.0001)  # 模拟操作
            self.value = current + 1

counter = Counter()
threads = [threading.Thread(target=counter.increment) for _ in range(100)]
for t in threads:
    t.start()
for t in threads:
    t.join()

print(f"最终计数: {counter.value}")  # 应该是 100
```

### 7.2 多进程

```python
from multiprocessing import Process, Pool, Queue, Pipe
import os
import time

# 基本进程
def worker_process(name):
    print(f"进程 {name} (PID: {os.getpid()})")
    time.sleep(1)

if __name__ == "__main__":
    processes = []
    for i in range(3):
        p = Process(target=worker_process, args=(i,))
        processes.append(p)
        p.start()
    
    for p in processes:
        p.join()
    
    print("所有进程完成")

# 进程池
if __name__ == "__main__":
    def square(n):
        return n ** 2
    
    with Pool(processes=4) as pool:
        # map
        results = pool.map(square, range(10))
        print(results)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
        
        # apply_async
        result = pool.apply_async(square, (20,))
        print(result.get())  # 400
        
        # 列表推导
        results = [pool.apply_async(square, (i,)) for i in range(5)]
        print([r.get() for r in results])

# 进程间通信
if __name__ == "__main__":
    def producer(queue):
        for i in range(5):
            queue.put(i)
            print(f"生产: {i}")
            time.sleep(0.1)
    
    def consumer(queue):
        while True:
            item = queue.get()
            if item is None:
                break
            print(f"消费: {item}")
    
    queue = Queue()
    p1 = Process(target=producer, args=(queue,))
    p2 = Process(target=consumer, args=(queue,))
    
    p2.start()
    p1.start()
    p1.join()
    queue.put(None)
    p2.join()
```

### 7.3 异步编程（asyncio）

```python
import asyncio

# 基本协程
async def say_hello():
    print("Hello")
    await asyncio.sleep(1)
    print("World")

asyncio.run(say_hello())

# 并发执行
async def task(name, delay):
    print(f"任务 {name} 开始")
    await asyncio.sleep(delay)
    print(f"任务 {name} 完成")
    return f"{name} 的结果"

async def main():
    # 顺序执行
    await task("A", 1)
    await task("B", 1)
    
    # 并发执行
    results = await asyncio.gather(
        task("C", 1),
        task("D", 1),
        task("E", 1)
    )
    print(results)
    
    # 创建任务
    task1 = asyncio.create_task(task("F", 1))
    task2 = asyncio.create_task(task("G", 1))
    await task1
    await task2

asyncio.run(main())

# 异步迭代器
class AsyncRange:
    def __init__(self, n):
        self.n = n
        self.i = 0
    
    def __aiter__(self):
        return self
    
    async def __anext__(self):
        if self.i >= self.n:
            raise StopAsyncIteration
        await asyncio.sleep(0.1)
        value = self.i
        self.i += 1
        return value

async def iterate():
    async for i in AsyncRange(5):
        print(i)

asyncio.run(iterate())

# 异步上下文管理器
class AsyncContext:
    async def __aenter__(self):
        print("进入异步上下文")
        await asyncio.sleep(0.1)
        return self
    
    async def __aexit__(self, exc_type, exc, tb):
        print("退出异步上下文")
        await asyncio.sleep(0.1)

async def use_context():
    async with AsyncContext():
        print("在上下文中")

asyncio.run(use_context())
```

## 八、类型提示

### 8.1 基本类型提示

```python
from typing import List, Dict, Optional, Union, Callable, Tuple

# 函数类型提示
def greet(name: str) -> str:
    return f"Hello, {name}"

# 列表类型
numbers: List[int] = [1, 2, 3]
names: List[str] = ["Alice", "Bob"]

# 字典类型
user: Dict[str, Union[str, int]] = {
    "name": "Alice",
    "age": 30
}

# Optional 类型（可为 None）
def find_user(user_id: int) -> Optional[Dict[str, str]]:
    if user_id == 1:
        return {"name": "Alice"}
    return None

# Union 类型（多种类型之一）
def parse_value(value: Union[str, int]) -> int:
    if isinstance(value, str):
        return int(value)
    return value

# 元组类型
def get_coordinates() -> Tuple[float, float]:
    return (10.5, 20.3)

# Callable 类型
def apply_operation(
    func: Callable[[int, int], int],
    a: int,
    b: int
) -> int:
    return func(a, b)

# 类类型提示
class User:
    def __init__(self, name: str, age: int) -> None:
        self.name = name
        self.age = age
    
    def greet(self) -> str:
        return f"Hi, I'm {self.name}"

def create_user(name: str) -> User:
    return User(name, 25)
```

### 8.2 泛型与 TypeVar

```python
from typing import TypeVar, Generic, List

T = TypeVar('T')
K = TypeVar('K')
V = TypeVar('V')

# 泛型类
class Stack(Generic[T]):
    def __init__(self) -> None:
        self._items: List[T] = []
    
    def push(self, item: T) -> None:
        self._items.append(item)
    
    def pop(self) -> T:
        return self._items.pop()
    
    def peek(self) -> T:
        return self._items[-1]

# 使用泛型类
int_stack: Stack[int] = Stack()
int_stack.push(1)
int_stack.push(2)
print(int_stack.pop())  # 2

str_stack: Stack[str] = Stack()
str_stack.push("hello")

# 泛型函数
def first(items: List[T]) -> T:
    return items[0]

print(first([1, 2, 3]))      # 1
print(first(["a", "b", "c"]))  # "a"

# 泛型字典
class GenericDict(Generic[K, V]):
    def __init__(self) -> None:
        self._data: Dict[K, V] = {}
    
    def set(self, key: K, value: V) -> None:
        self._data[key] = value
    
    def get(self, key: K) -> Optional[V]:
        return self._data.get(key)

# 使用
id_name_map: GenericDict[int, str] = GenericDict()
id_name_map.set(1, "Alice")
print(id_name_map.get(1))  # Alice
```

## 九、总结

本教程深入讲解了 Python3 的高级特性：

1. **迭代器与生成器** - 惰性求值、内存优化、yield from 委托
2. **装饰器** - 函数装饰器、类装饰器、参数化装饰器、@property
3. **上下文管理器** - with 语句、contextmanager、资源管理
4. **描述符** - 属性控制、类型验证、ORM 实现
5. **元类** - 动态类创建、类行为定制、自动注册
6. **函数式编程** - 高阶函数、偏函数、柯里化、函数组合
7. **并发编程** - 多线程、多进程、asyncio 异步编程
8. **类型提示** - 静态类型检查、泛型、TypeVar

掌握这些高级特性，你将能够编写出更加 Pythonic、高效、可维护的代码。建议结合实际项目进行练习，加深理解。
