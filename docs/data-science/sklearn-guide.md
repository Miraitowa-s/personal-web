# Scikit-Learn 机器学习实战

> Scikit-Learn（sklearn）是 Python 最常用的机器学习库，提供简洁统一的 API。

## 一、Sklearn 简介

Scikit-Learn 提供了丰富的机器学习算法和工具：

- **分类/回归/聚类**：几十种经典算法
- **模型选择**：交叉验证、网格搜索
- **数据预处理**：标准化、编码、特征选择
- **Pipeline**：构建完整的工作流
- **评估指标**：全面的评估工具

```bash
pip install scikit-learn
```

## 二、快速上手

### 2.1 sklearn 的统一 API

所有模型遵循相同的接口：

```python
from sklearn.xxx import ModelName

# 1. 创建模型
model = ModelName(hyperparam=value)

# 2. 训练
model.fit(X_train, y_train)

# 3. 预测
y_pred = model.predict(X_test)

# 4. 评估
score = model.score(X_test, y_test)
```

### 2.2 第一个例子：鸢尾花分类

```python
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

# 加载数据
iris = load_iris()
X, y = iris.data, iris.target

# 划分数据集
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 训练模型
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 评估
print(classification_report(y_test, model.predict(X_test)))
```

## 三、数据预处理

### 3.1 标准化 / 归一化

```python
from sklearn.preprocessing import StandardScaler, MinMaxScaler

# 标准化（均值0，方差1）
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 归一化（0-1）
normalizer = MinMaxScaler()
X_normalized = normalizer.fit_transform(X)
```

### 3.2 类别编码

```python
from sklearn.preprocessing import LabelEncoder, OneHotEncoder

# 标签编码（有序）
le = LabelEncoder()
y_encoded = le.fit_transform(['cat', 'dog', 'cat', 'bird'])
# [0, 1, 0, 2]

# 独热编码
ohe = OneHotEncoder(sparse_output=False)
X_onehot = ohe.fit_transform([['cat'], ['dog'], ['cat']])
# [[1,0,0], [0,1,0], [1,0,0]]
```

### 3.3 处理缺失值

```python
from sklearn.impute import SimpleImputer

# 用均值填充
imputer = SimpleImputer(strategy='mean')
X_filled = imputer.fit_transform(X_with_nan)

# 用中位数填充
imputer = SimpleImputer(strategy='median')
```

### 3.4 特征选择

```python
from sklearn.feature_selection import SelectKBest, f_classif, RFE

# 选择 Top K 特征
selector = SelectKBest(f_classif, k=5)
X_selected = selector.fit_transform(X, y)

# 递归特征消除
from sklearn.linear_model import LogisticRegression
rfe = RFE(LogisticRegression(), n_features_to_select=5)
X_rfe = rfe.fit_transform(X, y)
```

## 四、监督学习

### 4.1 分类算法

```python
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.naive_bayes import GaussianNB

# 逻辑回归（线性分类）
lr = LogisticRegression(max_iter=1000)
lr.fit(X_train, y_train)

# 决策树
dt = DecisionTreeClassifier(max_depth=5, random_state=42)
dt.fit(X_train, y_train)

# SVM（支持向量机）
svm = SVC(kernel='rbf', C=1.0)
svm.fit(X_train, y_train)

# KNN（K近邻）
knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_train, y_train)

# 随机森林
rf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
rf.fit(X_train, y_train)

# 梯度提升
gb = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1)
gb.fit(X_train, y_train)

# 朴素贝叶斯
nb = GaussianNB()
nb.fit(X_train, y_train)
```

### 4.2 回归算法

```python
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor

# 线性回归
lr = LinearRegression()
lr.fit(X_train, y_train)

# 岭回归（L2 正则化）
ridge = Ridge(alpha=1.0)

# Lasso 回归（L1 正则化，可做特征选择）
lasso = Lasso(alpha=0.1)

# 随机森林回归
rf = RandomForestRegressor(n_estimators=100)
rf.fit(X_train, y_train)
```

### 4.3 模型评估

```python
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, classification_report,
    mean_squared_error, mean_absolute_error, r2_score
)

# 分类指标
y_pred = model.predict(X_test)
print(f"准确率: {accuracy_score(y_test, y_pred):.4f}")
print(f"精确率: {precision_score(y_test, y_pred, average='weighted'):.4f}")
print(f"召回率: {recall_score(y_test, y_pred, average='weighted'):.4f}")
print(f"F1: {f1_score(y_test, y_pred, average='weighted'):.4f}")

# 混淆矩阵
import seaborn as sns
cm = confusion_matrix(y_test, y_pred)
sns.heatmap(cm, annot=True, fmt='d')

# 回归指标
mse = mean_squared_error(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
print(f"MSE: {mse:.4f}, MAE: {mae:.4f}, R²: {r2:.4f}")
```

## 五、无监督学习

### 5.1 聚类

```python
from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering

# K-Means 聚类
kmeans = KMeans(n_clusters=3, random_state=42)
labels = kmeans.fit_predict(X)

# 确定最优 K 值（肘部法则）
from sklearn.metrics import silhouette_score
scores = []
for k in range(2, 10):
    km = KMeans(n_clusters=k, random_state=42)
    labels = km.fit_predict(X)
    scores.append(silhouette_score(X, labels))

# DBSCAN（基于密度的聚类，无需指定 K）
dbscan = DBSCAN(eps=0.5, min_samples=5)
labels = dbscan.fit_predict(X)
```

### 5.2 降维

```python
from sklearn.decomposition import PCA

# PCA 降维
pca = PCA(n_components=2)  # 降到 2 维
X_pca = pca.fit_transform(X)
print(f"解释方差比: {pca.explained_variance_ratio_}")
print(f"总解释方差: {pca.explained_variance_ratio_.sum():.2%}")

# 可视化
plt.scatter(X_pca[:, 0], X_pca[:, 1], c=labels, cmap='viridis')
plt.title('PCA 降维可视化')
```

## 六、Pipeline 工作流

将预处理和模型训练串联为一个管道：

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.ensemble import RandomForestClassifier

pipeline = Pipeline([
    ('scaler', StandardScaler()),           # 标准化
    ('pca', PCA(n_components=10)),           # 降维
    ('classifier', RandomForestClassifier())  # 分类
])

# 一步完成训练
pipeline.fit(X_train, y_train)

# 一步完成预测
y_pred = pipeline.predict(X_test)

# 查看各步骤
print(pipeline.named_steps)
```

## 七、模型选择与调优

### 7.1 交叉验证

```python
from sklearn.model_selection import cross_val_score, cross_validate

# K 折交叉验证
scores = cross_val_score(model, X, y, cv=5, scoring='accuracy')
print(f"平均准确率: {scores.mean():.4f} ± {scores.std():.4f}")

# 多指标评估
results = cross_validate(model, X, y, cv=5,
                        scoring=['accuracy', 'f1_weighted'],
                        return_train_score=True)
```

### 7.2 网格搜索

```python
from sklearn.model_selection import GridSearchCV, RandomizedSearchCV

# 网格搜索（穷举）
param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [5, 10, 20, None],
    'min_samples_split': [2, 5, 10]
}

grid_search = GridSearchCV(
    RandomForestClassifier(random_state=42),
    param_grid,
    cv=5,
    scoring='accuracy',
    n_jobs=-1  # 并行
)
grid_search.fit(X_train, y_train)

print(f"最佳参数: {grid_search.best_params_}")
print(f"最佳分数: {grid_search.best_score_:.4f}")

# 随机搜索（更高效）
from scipy.stats import randint

param_dist = {
    'n_estimators': randint(50, 300),
    'max_depth': randint(5, 30),
}
random_search = RandomizedSearchCV(
    RandomForestClassifier(), param_dist,
    n_iter=50, cv=5, random_state=42
)
random_search.fit(X_train, y_train)
```

## 八、模型保存与加载

```python
import joblib

# 保存
joblib.dump(model, 'model.pkl')
joblib.dump(pipeline, 'pipeline.pkl')

# 加载
loaded_model = joblib.load('model.pkl')
y_pred = loaded_model.predict(X_new)
```

## 九、实战：房价预测完整流程

```python
import pandas as pd
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error, r2_score

# 1. 加载数据
data = fetch_california_housing()
X, y = data.data, data.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 2. 构建 Pipeline
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('model', GradientBoostingRegressor(random_state=42))
])

# 3. 超参搜索
param_grid = {
    'model__n_estimators': [100, 200],
    'model__learning_rate': [0.05, 0.1],
    'model__max_depth': [3, 5]
}
search = GridSearchCV(pipeline, param_grid, cv=3, scoring='r2', n_jobs=-1)
search.fit(X_train, y_train)

# 4. 评估
best_model = search.best_estimator_
y_pred = best_model.predict(X_test)
print(f"R²: {r2_score(y_test, y_pred):.4f}")
print(f"RMSE: {mean_squared_error(y_test, y_pred, squared=False):.4f}")
print(f"最佳参数: {search.best_params_}")
```

## 十、算法速查表

| 任务 | 算法 | 特点 |
|------|------|------|
| 线性分类 | LogisticRegression | 简单快速，可解释 |
| 复杂分类 | RandomForest | 鲁棒，不易过拟合 |
| 高维分类 | SVM | 适合小数据高维 |
| 快速分类 | KNN | 无需训练，惰性学习 |
| 概率分类 | GaussianNB | 适合特征独立的场景 |
| 梯度提升 | GradientBoosting | 精度高，但较慢 |
| 线性回归 | LinearRegression | 最基础的回归 |
| 非线性回归 | RandomForestRegressor | 自动捕获非线性关系 |
| 聚类 | KMeans | 简单高效，需指定 K |
| 降维 | PCA | 最常用的降维方法 |
