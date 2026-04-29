# 数据可视化指南

> 数据可视化是将数据转化为图形的过程，让数据中的模式、趋势和异常一目了然。

## 一、为什么需要数据可视化

```
一张好的图表胜过千言万语：
- 发现数据中的模式和趋势
- 快速识别异常值和离群点
- 向他人直观传达数据洞察
- 辅助决策制定
```

## 二、Matplotlib 基础

### 2.1 折线图

```python
import matplotlib.pyplot as plt
import numpy as np

# 基础折线图
x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.figure(figsize=(10, 5))
plt.plot(x, y, 'b-', linewidth=2, label='sin(x)')
plt.plot(x, np.cos(x), 'r--', linewidth=2, label='cos(x)')
plt.title('三角函数', fontsize=16)
plt.xlabel('x', fontsize=12)
plt.ylabel('y', fontsize=12)
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()
```

### 2.2 柱状图

```python
categories = ['Python', 'Java', 'JavaScript', 'C++', 'Go']
values = [35, 25, 20, 10, 10]

fig, ax = plt.subplots(figsize=(10, 6))
bars = ax.bar(categories, values, color=['#4C78A8', '#F58518', '#E45756', '#72B7B2', '#54A24B'])

# 添加数值标签
for bar, val in zip(bars, values):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5,
            f'{val}%', ha='center', fontsize=11)

ax.set_title('编程语言使用占比', fontsize=16)
ax.set_ylabel('占比 (%)', fontsize=12)
plt.show()
```

### 2.3 散点图

```python
np.random.seed(42)
x = np.random.randn(200)
y = x + np.random.randn(200) * 0.5

plt.figure(figsize=(8, 8))
plt.scatter(x, y, alpha=0.6, c=x, cmap='coolwarm', s=30)
plt.colorbar(label='x 值')
plt.title('散点图示例', fontsize=16)
plt.xlabel('x', fontsize=12)
plt.ylabel('y', fontsize=12)
plt.show()
```

### 2.4 饼图

```python
sizes = [40, 25, 20, 15]
labels = ['桌面端', '移动端', '平板', '其他']
colors = ['#4C78A8', '#F58518', '#E45756', '#72B7B2']
explode = (0.05, 0, 0, 0)

fig, ax = plt.subplots(figsize=(8, 8))
ax.pie(sizes, explode=explode, labels=labels, colors=colors,
       autopct='%1.1f%%', shadow=True, startangle=90)
ax.set_title('设备占比', fontsize=16)
plt.show()
```

### 2.5 子图布局

```python
fig, axes = plt.subplots(2, 2, figsize=(12, 10))

axes[0, 0].plot(x, np.sin(x), 'b-')
axes[0, 0].set_title('折线图')

axes[0, 1].hist(np.random.randn(1000), bins=30, color='green', alpha=0.7)
axes[0, 1].set_title('直方图')

axes[1, 0].boxplot([np.random.randn(100) for _ in range(4)])
axes[1, 0].set_title('箱线图')

axes[1, 1].scatter(np.random.randn(100), np.random.randn(100), c='red', alpha=0.5)
axes[1, 1].set_title('散点图')

plt.tight_layout()
plt.show()
```

## 三、Pandas 可视化

```python
import pandas as pd

df = pd.read_csv('sales.csv')  # 假设有 date, product, revenue 列

# 折线图（按日期汇总）
df.groupby('date')['revenue'].sum().plot(figsize=(12, 5), title='每日收入')

# 柱状图（按产品汇总）
df.groupby('product')['revenue'].sum().plot(kind='bar', color='coral')

# 直方图
df['revenue'].plot(kind='hist', bins=20, edgecolor='black')

# 箱线图
df.boxplot(column='revenue', by='product')

# 散点矩阵
pd.plotting.scatter_matrix(df[['revenue', 'quantity', 'price']], figsize=(10, 10))
```

## 四、Seaborn 高级可视化

```python
import seaborn as sns

# 设置风格
sns.set_theme(style="whitegrid")

# 热力图（相关性矩阵）
numeric_df = df.select_dtypes(include='number')
plt.figure(figsize=(10, 8))
sns.heatmap(numeric_df.corr(), annot=True, cmap='coolwarm', center=0)
plt.title('特征相关性')

# 分组箱线图
sns.boxplot(x='category', y='value', data=df)

# 小提琴图（箱线图 + 密度图）
sns.violinplot(x='category', y='value', data=df)

# 配对图（多变量关系）
sns.pairplot(df, hue='category')

# 回归图
sns.regplot(x='area', y='price', data=df)
```

## 五、交互式可视化

### 5.1 Plotly

```python
import plotly.express as px
import plotly.graph_objects as go

# 交互式散点图
fig = px.scatter(df, x='area', y='price', color='district',
                 size='rooms', hover_data=['address'],
                 title='房价分布')
fig.show()

# 交互式折线图
fig = go.Figure()
fig.add_trace(go.Scatter(x=df['date'], y=df['revenue'], mode='lines', name='收入'))
fig.add_trace(go.Scatter(x=df['date'], y=df['cost'], mode='lines', name='成本'))
fig.update_layout(title='收入 vs 成本', xaxis_title='日期')
fig.show()

# 地图
fig = px.scatter_geo(df, lat='latitude', lon='longitude',
                     size='population', color='city',
                     hover_name='city')
fig.show()
```

### 5.2 Pyecharts（中文场景推荐）

```python
from pyecharts.charts import Bar, Line, Pie, Map
from pyecharts import options as opts

# 柱状图
bar = (
    Bar()
    .add_xaxis(['北京', '上海', '广州', '深圳'])
    .add_yaxis('GDP', [41610, 44652, 28231, 32387])
    .set_global_opts(title_opts=opts.TitleOpts(title="城市GDP"))
)
bar.render("gdp.html")

# 中国地图
map_chart = (
    Map()
    .add("销量", [("广东", 200), ("浙江", 150), ("江苏", 180)], "china")
    .set_global_opts(title_opts=opts.TitleOpts(title="全国销量分布"))
)
map_chart.render("sales_map.html")
```

## 六、可视化最佳实践

### 6.1 图表选择

```
比较类别 → 柱状图
展示趋势 → 折线图
展示分布 → 直方图 / 箱线图
展示关系 → 散点图 / 热力图
展示占比 → 饼图 / 堆叠柱状图
展示地理 → 地图
```

### 6.2 设计原则

```
1. 简洁优先：去除不必要的装饰元素
2. 颜色合理：使用色盲友好的调色板
3. 标注清晰：坐标轴标签、标题、图例
4. 诚实呈现：不裁剪坐标轴误导读者
5. 高信息密度：每个图表传达一个明确的信息
```

### 6.3 常用调色板

```python
# Matplotlib 风格
plt.style.use('ggplot')       # R 风格
plt.style.use('seaborn-v0_8') # Seaborn 风格

# 常用配色
colors = ['#4C78A8', '#F58518', '#E45756', '#72B7B2', '#54A24B', '#EECA3B', '#B279A2']
```

## 七、保存图表

```python
# Matplotlib
plt.savefig('chart.png', dpi=300, bbox_inches='tight')
plt.savefig('chart.pdf', format='pdf')

# Plotly（生成独立 HTML）
fig.write_html('interactive_chart.html')
fig.write_image('chart.png')  # 需要 kaleido
```
