# Pandas 数据分析库

Pandas 是 Python 生态中最强大的数据分析库，提供了高性能、易于使用的数据结构和数据分析工具。无论是处理表格数据、时间序列还是进行数据清洗，Pandas 都能游刃有余。本教程将详细介绍 Pandas 的核心概念、功能和实战技巧。

## Pandas 简介

Pandas 的名字源自 "panel data"（面板数据）和 "Python data analysis"（Python 数据分析），是一个开放源码、BSD 许可的库，由 Wes McKinney 于 2008 年开发。Pandas 构建在 NumPy 之上，继承了 NumPy 高性能的数组计算能力，同时提供了更丰富的数据结构和数据处理功能。

### Pandas 的核心价值

| 特性 | 描述 |
|------|------|
| DataFrame | 强大的二维表格数据结构，类似 Excel/SQL |
| Series | 一维标签数组，类似带索引的 NumPy 数组 |
| 数据对齐 | 自动对齐不同索引的数据 |
| 缺失数据处理 | 内置处理 NaN 的功能 |
| 数据清洗 | 提供丰富的数据清洗工具 |
| 时间序列 | 原生支持日期时间操作 |
| 数据读写 | 支持 CSV、Excel、JSON、SQL 等多种格式 |

## Pandas 安装与基础配置

### 安装 Pandas

```bash
pip install pandas
```

### 验证安装

```python
import pandas as pd
print(pd.__version__)  # 输出 Pandas 版本
```

### 推荐配置

```python
import pandas as pd
import numpy as np

# 设置显示选项
pd.set_option('display.max_columns', 10)  # 最多显示10列
pd.set_option('display.width', 200)        # 显示屏宽度
pd.set_option('display.max_rows', 100)      # 最多显示100行

# 设置中文字体（用于可视化）
plt.rcParams['font.sans-serif'] = ['SimHei', 'Microsoft YaHei']
plt.rcParams['axes.unicode_minus'] = False
```

## Series 对象

Series 是 Pandas 的基本数据结构，是一个一维标签数组，包含数据和对应的索引标签。

### 创建 Series

```python
import pandas as pd
import numpy as np

# 从列表创建 Series
s1 = pd.Series([1, 3, 5, 7, 9])
print(s1)
# 输出:
# 0    1
# 1    3
# 2    5
# 3    7
# 4    9
# dtype: int64

# 自定义索引
s2 = pd.Series([90, 85, 78, 92, 88],
               index=['语文', '数学', '英语', '物理', '化学'])
print(s2)
# 语文    90
# 数学    85
# 英语    78
# 物理    92
# 化学    88
# dtype: int64

# 从字典创建 Series
data = {'苹果': 3.5, '香蕉': 2.8, '橙子': 4.2, '葡萄': 5.5}
s3 = pd.Series(data)
print(s3)
# 苹果    3.5
# 香蕉    2.8
# 橙子    4.2
# 葡萄    5.5
# dtype: float64

# 指定索引从字典创建
s4 = pd.Series(data, index=['苹果', '香蕉', '橙子', '葡萄', '西瓜'])
print(s4)
# 苹果    3.5
# 香蕉    2.8
# 橙子    4.2
# 葡萄    5.5
# 西瓜    NaN (不存在的数据为NaN)
```

### Series 基本操作

```python
import pandas as pd

s = pd.Series([90, 85, 78, 92, 88],
              index=['语文', '数学', '英语', '物理', '化学'])

# 访问数据
print(s['数学'])      # 85
print(s[1])           # 85（位置索引）
print(s[['语文', '英语']])  # 语文    90, 英语    78

# 条件筛选
print(s[s > 85])      # 语文、物理、化学

# 修改数据
s['数学'] = 90
print(s)

# 数学运算
print(s + 10)         # 所有元素加10
print(s * 2)          # 所有元素乘2
print(s.mean())       # 平均值
print(s.sum())        # 总和
```

## DataFrame 对象

DataFrame 是 Pandas 最核心的数据结构，是一个二维表格型数据，含有一组有序的列，每列可以是不同的数据类型。它既有行索引也有列索引，功能强大且使用灵活。

### 创建 DataFrame

```python
import pandas as pd
import numpy as np

# 从字典创建 DataFrame
data = {
    '姓名': ['张三', '李四', '王五', '赵六'],
    '年龄': [25, 30, 28, 35],
    '城市': ['北京', '上海', '广州', '深圳'],
    '工资': [15000, 20000, 18000, 25000]
}
df = pd.DataFrame(data)
print(df)
#     姓名  年龄  城市     工资
# 0  张三   25  北京   15000
# 1  李四   30  上海   20000
# 2  王五   28  广州   18000
# 3  赵六   35  深圳   25000

# 指定列顺序
df = pd.DataFrame(data, columns=['姓名', '城市', '年龄', '工资'])
print(df)

# 从列表字典创建
data = [
    {'姓名': '张三', '年龄': 25, '城市': '北京'},
    {'姓名': '李四', '年龄': 30, '城市': '上海', '部门': '技术'},
    {'姓名': '王五', '年龄': 28, '城市': '广州'}
]
df = pd.DataFrame(data)
print(df)
#     姓名  年龄  城市   部门
# 0  张三   25  北京   NaN
# 1  李四   30  上海   技术
# 2  王五   28  广州   NaN

# 从二维数组创建
arr = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
df = pd.DataFrame(arr, columns=['A', 'B', 'C'])
print(df)
```

### DataFrame 基本属性

```python
import pandas as pd

df = pd.DataFrame({
    '姓名': ['张三', '李四', '王五'],
    '年龄': [25, 30, 28],
    '工资': [15000, 20000, 18000]
})

# 查看基本信息
print(df.shape)           # (3, 3) - 行数、列数
print(df.columns)         # 列名索引
print(df.index)           # 行索引
print(df.dtypes)          # 每列数据类型
print(df.info())          # 详细信息
print(df.describe())      # 数值列统计摘要

# 查看数据
print(df.head(2))         # 前2行
print(df.tail(2))         # 后2行
```

## 数据选择与索引

### 列选择

```python
import pandas as pd

df = pd.DataFrame({
    '姓名': ['张三', '李四', '王五'],
    '年龄': [25, 30, 28],
    '工资': [15000, 20000, 18000],
    '部门': ['销售', '技术', '运营']
})

# 单列选择
print(df['姓名'])              # 返回 Series
print(df.姓名)                # 属性方式（列名需符合标识符规则）

# 多列选择
print(df[['姓名', '工资']])
#     姓名     工资
# 0  张三   15000
# 1  李四   20000
# 2  王五   18000
```

### 行选择

```python
import pandas as pd

df = pd.DataFrame({
    '姓名': ['张三', '李四', '王五', '赵六'],
    '年龄': [25, 30, 28, 35],
    '工资': [15000, 20000, 18000, 25000]
}, index=['a', 'b', 'c', 'd'])

# 按标签选择（loc）
print(df.loc['a'])              # 单行
print(df.loc['a':'c'])          # 切片（包含两端）

# 按位置选择（iloc）
print(df.iloc[0])               # 单行
print(df.iloc[1:3])             # 切片

# 条件选择
print(df[df['工资'] > 18000])   # 工资大于18000的行
print(df[(df['年龄'] > 25) & (df['工资'] < 20000)])  # 多条件
```

### 高级索引

```python
import pandas as pd

df = pd.DataFrame({
    '姓名': ['张三', '李四', '王五', '赵六'],
    '年龄': [25, 30, 28, 35],
    '工资': [15000, 20000, 18000, 25000]
}, index=pd.date_range('2024-01-01', periods=4, freq='Y'))

# 使用 at 和 iat（快速访问单个值）
print(df.at[df.index[0], '姓名'])   # 第一行的姓名
print(df.iat[0, 0])                  # 第一行第一列

# 使用 where 条件筛选
print(df.where(df['工资'] > 16000))

# 使用 query 方法（类似SQL）
print(df.query('工资 > 16000 and 年龄 < 35'))
```

## 数据操作

### 数据添加与修改

```python
import pandas as pd

df = pd.DataFrame({
    '姓名': ['张三', '李四', '王五'],
    '年龄': [25, 30, 28],
    '工资': [15000, 20000, 18000]
})

# 添加新列
df['部门'] = ['销售', '技术', '运营']
df['奖金'] = df['工资'] * 0.2

# 添加新行
new_row = pd.Series({'姓名': '赵六', '年龄': 35, '工资': 25000, '部门': '管理', '奖金': 5000})
df = df.append(new_row, ignore_index=True)

# 修改数据
df.loc[0, '工资'] = 16000  # 修改单个值
df['工资'] = df['工资'] * 1.1  # 整列更新

# 删除列或行
df = df.drop('奖金', axis=1)     # 删除列
df = df.drop(0, axis=0)         # 删除行
```

### 数据排序

```python
import pandas as pd

df = pd.DataFrame({
    '姓名': ['张三', '李四', '王五', '赵六'],
    '年龄': [25, 30, 28, 35],
    '工资': [15000, 20000, 18000, 25000],
    '绩效': [85, 92, 78, 88]
})

# 按单列排序
print(df.sort_values('工资'))                    # 按工资升序
print(df.sort_values('工资', ascending=False))   # 按工资降序

# 按多列排序
print(df.sort_values(['部门', '工资'], ascending=[True, False]))

# 按索引排序
df_sorted = df.sort_index()

# Series 排序
s = pd.Series([3, 1, 4, 2, 5])
print(s.sort_values())
print(s.sort_index())
```

### 数据统计

```python
import pandas as pd

df = pd.DataFrame({
    'A': [1, 2, 3, 4, 5],
    'B': [10, 20, 30, 40, 50],
    'C': [100, 200, 300, 400, 500]
})

# 基本统计
print(df.sum())           # 每列求和
print(df.mean())          # 每列均值
print(df.median())        # 每列中位数
print(df.std())           # 每列标准差
print(df.var())           # 每列方差
print(df.min())           # 每列最小值
print(df.max())           # 每列最大值

# 描述性统计
print(df.describe())
#              A      B      C
# count  5.000  5.000    5.000
# mean   3.000 30.000  300.000
# std    1.581 15.811  158.114
# min    1.000 10.000  100.000
# 25%    2.000 20.000  200.000
# 50%    3.000 30.000  300.000
# 75%    4.000 40.000  400.000
# max    5.000 50.000  500.000

# 累计统计
print(df.cumsum())       # 累计求和
print(df.cummax())       # 累计最大值
print(df.cummin())       # 累计最小值
```

## 数据清洗

数据清洗是数据分析中最重要也最耗时的环节，Pandas 提供了丰富的工具。

### 处理缺失值

```python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    '姓名': ['张三', '李四', '王五', '赵六'],
    '年龄': [25, np.nan, 28, 35],
    '工资': [15000, 20000, np.nan, 25000],
    '部门': ['销售', '技术', '运营', np.nan]
})

# 检测缺失值
print(df.isnull())           # 返回布尔DataFrame
print(df.notnull())          # 返回非缺失值的布尔DataFrame
print(df.isnull().sum())     # 每列缺失值数量

# 删除缺失值
df_clean = df.dropna()                      # 删除有缺失值的行
df_clean = df.dropna(how='all')            # 只删除全为NaN的行
df_clean = df.dropna(thresh=3)             # 保留至少3个非空值的行
df_clean = df.dropna(subset=['工资'])      # 只看某列的缺失值

# 填充缺失值
df['年龄'].fillna(df['年龄'].mean())        # 用均值填充
df['工资'].fillna(df['工资'].median())     # 用中位数填充
df['部门'].fillna('未知')                   # 用固定值填充
df.fillna(method='ffill')                  # 用前一个值填充
df.fillna(method='bfill')                  # 用后一个值填充

# 插值填充
df['工资'] = df['工资'].interpolate()       # 线性插值
```

### 处理重复数据

```python
import pandas as pd

df = pd.DataFrame({
    '姓名': ['张三', '李四', '张三', '王五', '李四'],
    '年龄': [25, 30, 25, 28, 30],
    '工资': [15000, 20000, 15000, 18000, 20000]
})

# 检测重复
print(df.duplicated())             # 返回布尔Series
print(df.duplicated(subset=['姓名']))  # 基于某列检测

# 删除重复
df_unique = df.drop_duplicates()               # 删除完全重复的行
df_unique = df.drop_duplicates(subset=['姓名'])  # 基于某列删除重复
df_unique = df.drop_duplicates(keep='last')     # 保留最后一个
```

### 字符串处理

```python
import pandas as pd

df = pd.DataFrame({
    '姓名': ['  张三  ', '李四', '王五'],
    '城市': ['beijing', 'SHANGHAI', 'Guangzhou']
})

# 去除空格
df['姓名'] = df['姓名'].str.strip()

# 大小写转换
df['城市'] = df['城市'].str.lower()
df['城市'] = df['城市'].str.upper()
df['城市'] = df['城市'].str.title()

# 字符串替换
df['城市'] = df['城市'].str.replace('beijing', '北京')

# 字符串分割
df['姓名'].str.split('张')       # 分割字符串

# 字符串包含检测
print(df['城市'].str.contains('bei'))

# 字符串长度
print(df['姓名'].str.len())
```

## 数据分组与聚合

### GroupBy 基础

```python
import pandas as pd

df = pd.DataFrame({
    '部门': ['销售', '技术', '销售', '技术', '运营', '运营'],
    '姓名': ['张三', '李四', '王五', '赵六', '钱七', '孙八'],
    '工资': [15000, 20000, 18000, 22000, 16000, 19000],
    '绩效': [85, 92, 88, 90, 78, 85]
})

# 基本分组
grouped = df.groupby('部门')
print(grouped.size())        # 每组数量

# 分组聚合
print(df.groupby('部门')['工资'].sum())      # 每组工资总和
print(df.groupby('部门')[['工资', '绩效']].mean())  # 多列聚合

# 多种聚合函数
print(df.groupby('部门').agg({
    '工资': ['sum', 'mean', 'max', 'min'],
    '绩效': ['mean', 'count']
}))

# 自定义聚合函数
def salary_range(series):
    return series.max() - series.min()

print(df.groupby('部门')['工资'].agg(salary_range))
```

### 高级分组

```python
import pandas as pd

df = pd.DataFrame({
    '部门': ['销售', '技术', '销售', '技术', '运营', '运营'],
    '城市': ['北京', '北京', '上海', '上海', '北京', '上海'],
    '工资': [15000, 20000, 18000, 22000, 16000, 19000]
})

# 多列分组
print(df.groupby(['部门', '城市']).mean())

# 分组迭代
for name, group in df.groupby('部门'):
    print(f"部门: {name}")
    print(group)
    print()

# 分组转换
df['工资排名'] = df.groupby('部门')['工资'].rank(ascending=False)

# 分组过滤
def filter_high_salary(group):
    return group['工资'].mean() > 17000

print(df.groupby('部门').filter(filter_high_salary))
```

## 数据透视表

数据透视表是数据分析中的强大工具，可以快速汇总和分析数据。

```python
import pandas as pd

df = pd.DataFrame({
    '日期': pd.date_range('2024-01-01', periods=12, freq='M'),
    '部门': ['销售', '技术', '销售', '技术', '销售', '技术'] * 2,
    '产品': ['A', 'A', 'B', 'B', 'A', 'B'] * 2,
    '销售额': [10000, 15000, 8000, 20000, 12000, 18000, 
              11000, 16000, 9000, 21000, 13000, 19000]
})

# 基础透视表
pivot = pd.pivot_table(df, values='销售额', index='部门', aggfunc='sum')
print(pivot)

# 多索引透视表
pivot = pd.pivot_table(df, values='销售额', 
                       index='部门', 
                       columns='产品', 
                       aggfunc='sum',
                       fill_value=0)
print(pivot)

# 复杂透视表
pivot = pd.pivot_table(df, 
                       values=['销售额'],
                       index=['部门'],
                       columns=['产品'],
                       aggfunc={'销售额': ['sum', 'mean']})
print(pivot)
```

## 数据读写

Pandas 支持多种数据格式的读写。

### CSV 文件

```python
import pandas as pd

# 读取 CSV
df = pd.read_csv('data.csv', encoding='utf-8')
df = pd.read_csv('data.csv', sep=';')           # 指定分隔符
df = pd.read_csv('data.csv', header=0)          # 指定表头行
df = pd.read_csv('data.csv', usecols=['姓名', '工资'])  # 只读取指定列
df = pd.read_csv('data.csv', nrows=100)         # 只读取前100行

# 写入 CSV
df.to_csv('output.csv', index=False, encoding='utf-8-sig')  # index=False不保存索引，encoding='utf-8-sig'支持中文
```

### Excel 文件

```python
import pandas as pd

# 读取 Excel
df = pd.read_excel('data.xlsx', sheet_name='Sheet1')  # 读取指定工作表
df = pd.read_excel('data.xlsx', sheet_name=None)     # 读取所有工作表（返回字典）

# 写入 Excel
df.to_excel('output.xlsx', sheet_name='数据', index=False)
with pd.ExcelWriter('output.xlsx') as writer:
    df1.to_excel(writer, sheet_name='表1')
    df2.to_excel(writer, sheet_name='表2')
```

### JSON 文件

```python
import pandas as pd

# 读取 JSON
df = pd.read_json('data.json')
df = pd.read_json('data.json', orient='records')  # 指定格式

# 写入 JSON
df.to_json('output.json', orient='records', force_ascii=False, indent=2)
```

### 数据库

```python
import pandas as pd
from sqlalchemy import create_engine

# 创建数据库连接
engine = create_engine('sqlite:///mydata.db')

# 读取
df = pd.read_sql('SELECT * FROM employees', engine)

# 写入
df.to_sql('employees', engine, if_exists='replace', index=False)
```

## 时间序列处理

Pandas 提供了强大的时间序列处理能力。

### 日期时间处理

```python
import pandas as pd

# 创建日期范围
dates = pd.date_range('2024-01-01', periods=10, freq='D')
print(dates)

# 解析日期字符串
df = pd.read_csv('data.csv', parse_dates=['日期'])
df['日期'] = pd.to_datetime(df['日期'])

# 提取日期组件
df['年'] = df['日期'].dt.year
df['月'] = df['日期'].dt.month
df['日'] = df['日期'].dt.day
df['星期'] = df['日期'].dt.dayofweek
df['季度'] = df['日期'].dt.quarter

# 日期运算
df['三天后'] = df['日期'] + pd.Timedelta(days=3)
df['月份差'] = (df['日期'] + pd.DateOffset(months=2)) - df['日期']
```

### 重采样

```python
import pandas as pd

# 创建时间序列数据
ts = pd.Series(range(365), 
               index=pd.date_range('2024-01-01', periods=365, freq='D'))
ts.name = '每日数据'

# 重采样
monthly = ts.resample('M').mean()       # 月度平均
weekly = ts.resample('W').sum()         # 周度求和
quarterly = ts.resample('Q').mean()      # 季度平均

# 移动窗口
rolling_mean = ts.rolling(window=7).mean()    # 7日移动平均
rolling_std = ts.rolling(window=30).std()     # 30日移动标准差
```

## 数据可视化

Pandas 集成 Matplotlib，提供了便捷的绘图功能。

```python
import pandas as pd
import matplotlib.pyplot as plt

df = pd.DataFrame({
    '月份': ['1月', '2月', '3月', '4月', '5月', '6月'],
    '销售额': [120, 150, 180, 160, 200, 220],
    '成本': [80, 100, 110, 100, 130, 140]
})

# 折线图
df.plot(x='月份', y='销售额', kind='line', figsize=(10, 6))
plt.title('月度销售额趋势')
plt.xlabel('月份')
plt.ylabel('销售额')
plt.grid(True)
plt.show()

# 柱状图
df.plot(x='月份', y=['销售额', '成本'], kind='bar', figsize=(10, 6))
plt.title('月度销售与成本对比')
plt.show()

# 饼图
df.plot(y='销售额', kind='pie', labels=df['月份'], autopct='%1.1f%%')
plt.title('各月销售额占比')
plt.show()

# 散点图
df.plot(x='销售额', y='成本', kind='scatter')
plt.title('销售额与成本关系')
plt.show()
```

## 实战案例：销售数据分析

```python
import pandas as pd
import numpy as np

# 创建模拟销售数据
np.random.seed(42)
dates = pd.date_range('2024-01-01', periods=365, freq='D')
products = ['产品A', '产品B', '产品C', '产品D']
cities = ['北京', '上海', '广州', '深圳']

data = {
    '日期': np.repeat(dates, 4),
    '产品': products * 365,
    '城市': np.tile(np.repeat(cities, 1), 365),
    '销量': np.random.randint(10, 100, 365*4),
    '单价': np.random.uniform(50, 200, 365*4)
}
df = pd.DataFrame(data)
df['销售额'] = df['销量'] * df['单价']

# 数据探索
print("数据概览:")
print(df.head())
print("\n数据统计:")
print(df.describe())

# 按月汇总
df['月份'] = df['日期'].dt.to_period('M')
monthly_sales = df.groupby('月份')['销售额'].sum()
print("\n月度销售额:")
print(monthly_sales)

# 按产品和城市分析
pivot = df.pivot_table(values='销售额', 
                       index='月份', 
                       columns='产品', 
                       aggfunc='sum')
print("\n产品月度销售透视表:")
print(pivot)

# 找出销售冠军
top_products = df.groupby('产品')['销售额'].sum().sort_values(ascending=False)
print("\n产品销售额排名:")
print(top_products)

# 异常值检测（销售额超过2倍标准差）
mean_sales = df['销售额'].mean()
std_sales = df['销售额'].std()
anomalies = df[abs(df['销售额'] - mean_sales) > 2 * std_sales]
print(f"\n检测到 {len(anomalies)} 个异常销售记录")
```

## 性能优化技巧

### 数据类型优化

```python
import pandas as pd

# 使用更紧凑的数据类型
df = pd.DataFrame({
    '整型': pd.Series([1, 2, 3], dtype=np.int8),
    '浮点': pd.Series([1.1, 2.2, 3.3], dtype=np.float32),
    '类别': pd.Categorical(['A', 'B', 'A'])
})

# 转换数据类型节省内存
df['大整型'] = df['大整型'].astype(np.int32)
df['大浮点'] = df['大浮点'].astype(np.float32)
```

### 操作优化

```python
import pandas as pd

# 使用 inplace 减少内存占用
df.drop('不需要的列', axis=1, inplace=True)

# 使用查询优化复杂条件
result = df.query('销售额 > 1000 and 城市 == "北京"')

# 使用 eval 加速表达式计算
df.eval('利润率 = (销售额 - 成本) / 销售额', inplace=True)

# 使用 aggfunc 减少不必要的计算
df.groupby('部门').agg({'销售额': 'sum', '成本': 'mean'})  # 销售额求和，成本取平均
```

## 总结

本教程系统介绍了 Pandas 的核心知识和实战技能：

1. **Series 和 DataFrame**：掌握 Pandas 的两种核心数据结构
2. **数据选择**：熟练使用 loc、iloc 和条件筛选
3. **数据清洗**：处理缺失值、重复值和异常值
4. **分组聚合**：使用 GroupBy 进行数据汇总分析
5. **数据透视表**：快速创建多维数据汇总
6. **数据读写**：读写各种格式的数据文件
7. **时间序列**：处理和分析时间相关数据
8. **可视化**：快速绘制各类图表

Pandas 是数据分析师和科学家日常工作中不可或缺的工具，熟练掌握 Pandas 将大大提升数据处理效率。建议读者通过实际项目不断练习，逐步精通 Pandas 的各种高级功能。
