# 机器学习基础

机器学习是人工智能的一个分支，通过让计算机从数据中学习规律，自动改进性能。本教程系统介绍机器学习的核心概念、常用算法和实战技巧。

## 机器学习简介

### 什么是机器学习？

机器学习是让计算机通过数据自动学习规律，进行预测或决策的技术。与传统编程的区别：

| 传统编程 | 机器学习 |
|----------|----------|
| 程序员编写明确规则 | 计算机从数据中学习规则 |
| 问题明确、规则清晰 | 复杂、规则难以明确的问题 |
| 例：计算器程序 | 例：垃圾邮件识别 |

### 机器学习三要素

- **数据**：训练数据、测试数据、特征
- **算法**：监督学习、无监督学习、强化学习
- **模型**：训练过程（学习规律）和推理过程（预测）

## 环境配置

### 安装依赖

```bash
pip install numpy pandas scikit-learn matplotlib
```

### 基础导入

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
```

## 数据预处理

### 加载数据

```python
import pandas as pd
import numpy as np

# 从CSV加载
df = pd.read_csv('data.csv')
print(df.head())
print(df.info())
print(df.describe())

# 创建示例数据
data = {
    '面积': [50, 60, 70, 80, 90, 100, 110, 120],
    '房间数': [1, 1, 2, 2, 3, 3, 3, 4],
    '价格': [150, 180, 210, 240, 270, 300, 330, 360]
}
df = pd.DataFrame(data)
```

### 特征与标签分离

```python
X = df.drop('价格', axis=1)  # 特征
y = df['价格']               # 标签

print("特征:", X)
print("标签:", y)
```

### 训练测试集划分

```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
print(f"训练集大小: {len(X_train)}")
print(f"测试集大小: {len(X_test)}")
```

## 监督学习算法

### 线性回归

用于预测连续值（回归问题）。

```python
from sklearn.linear_model import LinearRegression
import numpy as np
import matplotlib.pyplot as plt

# 准备数据
X = np.array([50, 60, 70, 80, 90, 100, 110, 120]).reshape(-1, 1)
y = np.array([150, 180, 210, 240, 270, 300, 330, 360])

# 创建并训练模型
model = LinearRegression()
model.fit(X, y)

# 预测
X_new = np.array([[85]])
y_pred = model.predict(X_new)
print(f"85平方米预测价格: {y_pred[0]:.2f}万元")

# 模型参数
print(f"系数: {model.coef_[0]:.2f}")
print(f"截距: {model.intercept_:.2f}")

# 可视化
plt.scatter(X, y, color='blue', label='实际数据')
plt.plot(X, model.predict(X), color='red', label='预测线')
plt.xlabel('房屋面积（平方米）')
plt.ylabel('房屋价格（万元）')
plt.legend()
plt.title('线性回归 - 房价预测')
plt.show()
```

### 逻辑回归

用于分类问题（二分类）。

```python
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import make_classification

# 生成示例数据
X, y = make_classification(n_samples=100, n_features=2, n_informative=2,
                           n_redundant=0, random_state=42)

# 划分数据集
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 训练模型
model = LogisticRegression()
model.fit(X_train, y_train)

# 预测
y_pred = model.predict(X_test)
print(f"准确率: {model.score(X_test, y_test):.2f}")
```

### 决策树

既可用于回归也可用于分类。

```python
from sklearn.tree import DecisionTreeClassifier, plot_tree
import matplotlib.pyplot as plt

# 训练决策树分类器
clf = DecisionTreeClassifier(max_depth=3, random_state=42)
clf.fit(X_train, y_train)

# 可视化决策树
plt.figure(figsize=(15, 10))
plot_tree(clf, filled=True, feature_names=['特征1', '特征2'], 
          class_names=['类别0', '类别1'], rounded=True)
plt.title('决策树可视化')
plt.show()

print(f"准确率: {clf.score(X_test, y_test):.2f}")
```

### K近邻算法（KNN）

```python
from sklearn.neighbors import KNeighborsClassifier

# 训练KNN分类器
knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_train, y_train)

# 预测并评估
y_pred = knn.predict(X_test)
print(f"KNN准确率: {knn.score(X_test, y_test):.2f}")

# 选择最优K值
accuracies = []
for k in range(1, 20):
    knn = KNeighborsClassifier(n_neighbors=k)
    knn.fit(X_train, y_train)
    accuracies.append(knn.score(X_test, y_test))

best_k = np.argmax(accuracies) + 1
print(f"最优K值: {best_k}")
```

### 随机森林

集成学习方法，多棵决策树的组合。

```python
from sklearn.ensemble import RandomForestClassifier

# 训练随机森林
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)

# 评估
y_pred = rf.predict(X_test)
print(f"随机森林准确率: {rf.score(X_test, y_test):.2f}")

# 特征重要性
importances = rf.feature_importances_
print(f"特征重要性: {importances}")
```

## 无监督学习算法

### K-Means 聚类

```python
from sklearn.cluster import KMeans
import numpy as np
import matplotlib.pyplot as plt

# 生成聚类数据
from sklearn.datasets import make_blobs
X, _ = make_blobs(n_samples=300, centers=4, cluster_std=1.0, random_state=42)

# 训练K-Means
kmeans = KMeans(n_clusters=4, random_state=42)
labels = kmeans.fit_predict(X)
centers = kmeans.cluster_centers_

# 可视化
plt.scatter(X[:, 0], X[:, 1], c=labels, cmap='viridis', s=50)
plt.scatter(centers[:, 0], centers[:, 1], c='red', marker='X', s=200)
plt.title('K-Means聚类结果')
plt.show()

# 选择最优聚类数（肘部法则）
inertias = []
for k in range(1, 10):
    kmeans = KMeans(n_clusters=k, random_state=42)
    kmeans.fit(X)
    inertias.append(kmeans.inertia_)

plt.plot(range(1, 10), inertias, 'bo-')
plt.xlabel('聚类数K')
plt.ylabel('惯性值')
plt.title('肘部法则')
plt.show()
```

### PCA 降维

```python
from sklearn.decomposition import PCA
from sklearn.datasets import load_iris

# 加载数据
iris = load_iris()
X, y = iris.data, iris.target

# PCA降维到2维
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X)

# 可视化
plt.scatter(X_pca[:, 0], X_pca[:, 1], c=y, cmap='viridis', s=50)
plt.xlabel('主成分1')
plt.ylabel('主成分2')
plt.title(f'PCA降维（解释方差: {pca.explained_variance_ratio_.sum():.2%}）')
plt.show()

print(f"各主成分解释方差比: {pca.explained_variance_ratio_}")
```

## 模型评估

### 分类评估指标

```python
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

# 假设预测结果
y_true = [1, 0, 1, 1, 0, 1, 0, 0, 1, 0]
y_pred = [1, 0, 1, 0, 0, 1, 1, 0, 1, 0]

# 计算指标
print(f"准确率: {accuracy_score(y_true, y_pred):.2f}")
print(f"精确率: {precision_score(y_true, y_pred):.2f}")
print(f"召回率: {recall_score(y_true, y_pred):.2f}")
print(f"F1分数: {f1_score(y_true, y_pred):.2f}")

# 混淆矩阵
cm = confusion_matrix(y_true, y_pred)
print("混淆矩阵:")
print(cm)
```

### 回归评估指标

```python
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

# 真实值与预测值
y_true = [150, 180, 210, 240, 270]
y_pred = [155, 175, 215, 235, 275]

print(f"均方误差(MSE): {mean_squared_error(y_true, y_pred):.2f}")
print(f"均方根误差(RMSE): {np.sqrt(mean_squared_error(y_true, y_pred)):.2f}")
print(f"平均绝对误差(MAE): {mean_absolute_error(y_true, y_pred):.2f}")
print(f"R²分数: {r2_score(y_true, y_pred):.4f}")
```

## 交叉验证

```python
from sklearn.model_selection import cross_val_score
from sklearn.ensemble import RandomForestClassifier

# 使用交叉验证评估模型
rf = RandomForestClassifier(n_estimators=100, random_state=42)
scores = cross_val_score(rf, X, y, cv=5, scoring='accuracy')

print(f"各折准确率: {scores}")
print(f"平均准确率: {scores.mean():.4f} (+/- {scores.std() * 2:.4f})")
```

## 实战案例：泰坦尼克号生存预测

```python
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

# 加载数据
# df = pd.read_csv('titanic.csv')

# 创建示例数据
data = {
    'Pclass': [1, 2, 3, 1, 2, 3, 1, 2, 3, 1],
    'Sex': ['male', 'female', 'male', 'female', 'male', 'female', 'male', 'female', 'male', 'female'],
    'Age': [22, 38, 26, 35, 35, 28, 54, 14, 4, 58],
    'SibSp': [1, 1, 0, 1, 0, 0, 0, 0, 4, 0],
    'Parch': [0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
    'Fare': [7.25, 71.28, 7.92, 53.1, 8.05, 8.46, 51.86, 16.1, 29.7, 247.52],
    'Survived': [0, 1, 1, 1, 0, 0, 0, 1, 1, 1]
}
df = pd.DataFrame(data)

# 特征工程
X = df.drop('Survived', axis=1)
y = df['Survived']

# 编码分类变量
le = LabelEncoder()
X['Sex'] = le.fit_transform(X['Sex'])

# 处理缺失值
X['Age'].fillna(X['Age'].median(), inplace=True)

# 划分数据集
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 训练模型
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 评估
accuracy = model.score(X_test, y_test)
print(f"模型准确率: {accuracy:.2f}")

# 特征重要性
print("特征重要性:")
for name, importance in zip(X.columns, model.feature_importances_):
    print(f"  {name}: {importance:.4f}")
```

## 过拟合与欠拟合

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression

# 生成非线性数据
np.random.seed(42)
X = np.sort(5 * np.random.rand(50, 1), axis=0)
y = np.sin(X).ravel() + np.random.normal(0, 0.1, X.shape[0])

X_test = np.linspace(0, 5, 100).reshape(-1, 1)

fig, axes = plt.subplots(1, 3, figsize=(15, 5))

# 欠拟合（线性）
poly1 = PolynomialFeatures(degree=1)
X_poly1 = poly1.fit_transform(X)
X_test_poly1 = poly1.transform(X_test)
model1 = LinearRegression().fit(X_poly1, y)
axes[0].scatter(X, y, color='blue', label='数据')
axes[0].plot(X_test, model1.predict(X_test_poly1), 'r-', linewidth=2)
axes[0].set_title('欠拟合（degree=1）')

# 合适拟合
poly2 = PolynomialFeatures(degree=4)
X_poly2 = poly2.fit_transform(X)
X_test_poly2 = poly2.transform(X_test)
model2 = LinearRegression().fit(X_poly2, y)
axes[1].scatter(X, y, color='blue', label='数据')
axes[1].plot(X_test, model2.predict(X_test_poly2), 'r-', linewidth=2)
axes[1].set_title('合适拟合（degree=4）')

# 过拟合（高阶多项式）
poly3 = PolynomialFeatures(degree=15)
X_poly3 = poly3.fit_transform(X)
X_test_poly3 = poly3.transform(X_test)
model3 = LinearRegression().fit(X_poly3, y)
axes[2].scatter(X, y, color='blue', label='数据')
axes[2].plot(X_test, model3.predict(X_test_poly3), 'r-', linewidth=2)
axes[2].set_title('过拟合（degree=15）')

plt.tight_layout()
plt.show()
```

## 总结

本教程涵盖机器学习核心知识点：

1. **机器学习三要素**：数据、算法、模型
2. **监督学习**：线性回归、逻辑回归、决策树、KNN、随机森林
3. **无监督学习**：K-Means聚类、PCA降维
4. **模型评估**：准确率、精确率、召回率、F1分数
5. **交叉验证**：评估模型泛化能力
6. **过拟合与欠拟合**：模型复杂度控制

建议读者通过 Kaggle 等平台参与实际项目，逐步积累机器学习实战经验。
