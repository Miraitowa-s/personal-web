# 数据科学学习指南

> 数据科学 = 数学统计 + 编程工具 + 业务理解。本文梳理核心知识体系、学习路径与工具链。

## 一、数据科学知识地图

```
数据科学
├── 数学基础
│   ├── 线性代数（矩阵、向量空间）
│   ├── 概率统计（分布、假设检验）
│   └── 微积分（优化、梯度）
│
├── 编程工具（Python 生态）
│   ├── NumPy    — 数值计算 / 矩阵运算
│   ├── Pandas   — 数据处理 / 结构化数据
│   ├── Matplotlib / Seaborn — 数据可视化
│   └── Scikit-learn — 机器学习算法库
│
├── 机器学习
│   ├── 监督学习（回归、分类）
│   ├── 无监督学习（聚类、降维）
│   ├── 集成学习（随机森林、XGBoost）
│   └── 模型评估与优化
│
└── 深度学习（进阶）
    ├── PyTorch / TensorFlow
    ├── CNN（图像）
    ├── RNN/Transformer（文本）
    └── → 详见 AI 与大模型分类
```

## 二、学习路径

### 入门阶段（1-2 个月）

```
1. Python 基础（变量、函数、列表、字典）
2. NumPy 核心操作（数组、矩阵运算、广播）
3. Pandas 数据处理（读取、清洗、分组、合并）
4. Matplotlib 基础可视化（折线图、柱状图、散点图）
```

**第一个完整项目：** Titanic 生存预测
- 数据清洗（处理缺失值）
- 特征工程
- 训练逻辑回归模型
- 评估预测效果

### 进阶阶段（2-3 个月）

```
5. Seaborn 统计可视化
6. Scikit-learn 常用算法（线性回归、SVM、随机森林）
7. 模型评估（交叉验证、混淆矩阵、ROC 曲线）
8. 特征工程（编码、缩放、特征选择）
```

**第二个项目：** 房价预测（回归问题，端到端流程）

### 实战阶段

```
9. XGBoost / LightGBM（竞赛神器）
10. 超参数调优（Grid Search、Optuna）
11. 数据管道（Pipeline）
12. Kaggle 实战竞赛
```

## 三、核心工具速查

### 环境搭建

```bash
# 推荐用 conda 管理环境
conda create -n datascience python=3.11
conda activate datascience
pip install numpy pandas matplotlib seaborn scikit-learn jupyter
```

### 数据分析标准流程

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split

# 1. 加载数据
df = pd.read_csv("data.csv")

# 2. 探索性分析（EDA）
print(df.shape)          # 形状
print(df.info())         # 列类型
print(df.describe())     # 统计摘要
print(df.isnull().sum()) # 缺失值统计

# 3. 可视化
df.hist(figsize=(12, 8))
plt.tight_layout()
plt.show()

sns.heatmap(df.corr(), annot=True, cmap='coolwarm')
plt.show()

# 4. 数据清洗
df.fillna(df.median(), inplace=True)           # 填充缺失值
df.drop_duplicates(inplace=True)               # 去重
df['col'] = df['col'].astype('category')       # 类型转换

# 5. 特征与标签分离
X = df.drop('target', axis=1)
y = df['target']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
```

## 四、本分类文章导航

| 文章 | 核心内容 | 难度 |
|------|----------|------|
| [机器学习基础](machine-learning.md) | 监督/无监督/强化学习，常用算法 | ⭐⭐⭐ |
| [Scikit-learn 实战](sklearn-guide.md) | 完整 ML 流程，Pipeline，模型评估 | ⭐⭐⭐ |
| [NumPy 指南](numpy-guide.md) | 数组操作，广播，线性代数 | ⭐⭐ |
| [Pandas 指南](pandas-guide.md) | DataFrame 操作，数据清洗，分组聚合 | ⭐⭐ |
| [数据可视化](data-visualization.md) | Matplotlib/Seaborn，图表选择策略 | ⭐⭐ |

**建议学习顺序：** NumPy → Pandas → 数据可视化 → 机器学习基础 → Sklearn 实战

---

## 五、专业术语速查

| 术语 | 解释 |
|------|------|
| **特征（Feature）** | 输入数据的每一列，即用于预测的变量，比如"年龄"、"收入"都是特征 |
| **标签（Label）** | 需要预测的目标值，监督学习里就是"正确答案"，比如"是否购买"=1/0 |
| **过拟合（Overfitting）** | 模型死记训练数据，但面对新数据表现差，就像只会背题不会举一反三 |
| **欠拟合（Underfitting）** | 模型太简单，连训练数据都没学好 |
| **交叉验证（Cross Validation）** | 把数据分 K 折，轮流用不同部分测试，比单次划分训练/测试集更可靠 |
| **超参数（Hyperparameter）** | 训练前手动设置的参数，如学习率、树的深度，不是模型自动学的 |
| **正则化（Regularization）** | 在损失函数中加惩罚项，防止模型过度复杂，缓解过拟合，常见有 L1（Lasso）和 L2（Ridge） |
| **梯度下降（Gradient Descent）** | 沿着损失函数梯度的反方向更新参数，让模型一步步变得更准的优化算法 |
| **批归一化（Batch Normalization）** | 对每批数据做归一化处理，让训练更稳定，收敛更快 |
| **混淆矩阵（Confusion Matrix）** | 分类模型的评估表，展示真阳性、假阳性、真阴性、假阴性的数量 |
| **AUC / ROC** | 评估分类器好坏的指标，ROC 是曲线，AUC 是曲线下面积，越接近 1 越好 |
| **集成学习（Ensemble）** | 把多个弱模型组合成强模型，如随机森林（多棵决策树投票）、XGBoost（逐步纠错） |
| **向量化（Vectorization）** | 用矩阵运算代替 Python 循环，NumPy 的精髓，速度可以快 100 倍以上 |
| **EDA（探索性数据分析）** | 正式建模前先"看"数据：分布、相关性、异常值，是数据科学的起手式 |
| **特征工程（Feature Engineering）** | 手动设计或变换特征，往往比换模型更能提升效果，数据科学的核心技能 |

## 五、数据集资源

| 平台 | 特点 | 链接 |
|------|------|------|
| Kaggle | 竞赛数据集，最多 | kaggle.com/datasets |
| UCI ML Repository | 学术经典数据集 | archive.ics.uci.edu |
| Hugging Face Datasets | NLP/多模态数据集 | huggingface.co/datasets |
| 国家统计局 | 中国官方数据 | stats.gov.cn |
| 天池（阿里云）| 国内 AI 竞赛 | tianchi.aliyun.com |

## 六、常用算法速查表

| 任务 | 推荐算法 | 说明 |
|------|----------|------|
| 二分类 | 逻辑回归、随机森林、XGBoost | 先用逻辑回归做 baseline |
| 多分类 | 随机森林、LightGBM | 集成方法效果好 |
| 回归 | Ridge/Lasso、随机森林、XGBoost | 先看线性关系 |
| 聚类 | K-Means、DBSCAN | K-Means 快，DBSCAN 处理噪声 |
| 降维 | PCA、t-SNE、UMAP | 可视化用 t-SNE，处理流程用 PCA |
| 异常检测 | IsolationForest、LOF | IsolationForest 更高效 |
