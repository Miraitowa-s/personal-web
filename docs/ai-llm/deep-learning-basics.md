# 深度学习基础

> 深度学习（Deep Learning）是机器学习的子集，通过多层神经网络自动学习数据的层次化表示。

## 一、基本概念

### 1.1 什么是深度学习

深度学习使用包含多个隐藏层的神经网络（即"深度"神经网络）来学习数据的复杂模式。与传统的浅层模型相比，深度学习能自动提取特征，无需人工设计。

**核心思想**：通过逐层非线性变换，将原始输入转化为越来越抽象的表示。

```
输入层 → 隐藏层1 → 隐藏层2 → ... → 隐藏层N → 输出层
```

### 1.2 与传统机器学习的区别

| 特性 | 传统机器学习 | 深度学习 |
|------|-------------|---------|
| 特征工程 | 手动设计 | 自动学习 |
| 数据量 | 少量即可 | 需要大量数据 |
| 硬件需求 | CPU 足够 | 通常需要 GPU |
| 可解释性 | 较强 | 较弱（黑盒） |
| 适用场景 | 表格数据 | 图像、文本、语音 |

## 二、神经网络核心组件

### 2.1 神经元（Neuron）

神经元是网络的基本单元，执行以下计算：

```
y = f(w·x + b)
```

- **x**：输入向量
- **w**：权重（Weights）
- **b**：偏置（Bias）
- **f**：激活函数

### 2.2 激活函数

激活函数引入非线性，使网络能学习复杂模式：

**ReLU（Rectified Linear Unit）**
```
f(x) = max(0, x)
```
- 最常用的激活函数，计算快，缓解梯度消失
- 缺点：负区间梯度为 0（"神经元死亡"）

**Sigmoid**
```
f(x) = 1 / (1 + e^(-x))
```
- 输出 (0, 1)，适合二分类输出层
- 缺点：梯度消失问题

**Softmax**
```
f(x_i) = e^(x_i) / Σe^(x_j)
```
- 将输出转为概率分布，用于多分类

**GELU**
```
f(x) = x · Φ(x)   (Φ 为标准正态的累积分布函数)
```
- Transformer 中常用，比 ReLU 更平滑

### 2.3 损失函数

衡量预测值与真实值的差距：

- **均方误差（MSE）**：回归任务
  ```
  L = (1/n) Σ(y_i - ŷ_i)²
  ```
- **交叉熵损失（Cross-Entropy）**：分类任务
  ```
  L = -Σ y_i · log(ŷ_i)
  ```
- **二元交叉熵（BCE）**：二分类任务

### 2.4 优化器

- **SGD**：随机梯度下降，基础但稳定
- **Momentum**：加入动量，加速收敛
- **Adam**：自适应学习率，最常用的优化器
- **AdamW**：Adam + 权重衰减，大模型训练首选

```python
# PyTorch 优化器示例
optimizer = torch.optim.AdamW(
    model.parameters(),
    lr=2e-5,
    weight_decay=0.01
)
```

### 2.5 反向传播（Backpropagation）

训练过程的核心算法：

1. **前向传播**：输入数据，逐层计算得到预测值
2. **计算损失**：用损失函数衡量预测误差
3. **反向传播**：从输出层向输入层，逐层计算梯度
4. **参数更新**：用优化器根据梯度更新权重

```
前向传播 → 计算损失 → 反向传播 → 更新参数 → 重复
```

### 2.6 正则化技术

防止过拟合的关键手段：

- **Dropout**：随机丢弃部分神经元，训练时使用
- **Batch Normalization**：对每层输出做归一化，加速训练
- **Layer Normalization**：对单个样本做归一化，Transformer 中使用
- **权重衰减（L2 正则化）**：惩罚大权重
- **Early Stopping**：验证集损失不再下降时停止训练
- **数据增强**：通过变换扩充训练数据

## 三、常见网络架构

### 3.1 卷积神经网络（CNN）

**适用场景**：图像处理、计算机视觉

**核心层**：
- 卷积层（Conv2D）：提取局部特征
- 池化层（MaxPool2D）：降维，保留主要特征
- 全连接层（Linear）：分类/回归

```
输入图像 → [Conv + ReLU → Pool] × N → Flatten → FC → 输出
```

**经典模型**：
- **LeNet-5**（1998）：手写数字识别
- **AlexNet**（2012）：开启深度学习时代
- **VGGNet**：使用小卷积核（3×3）
- **ResNet**：残差连接，解决退化问题
- **EfficientNet**：高效网络设计

### 3.2 循环神经网络（RNN）

**适用场景**：序列数据、自然语言处理

**问题**：长序列梯度消失 → LSTM / GRU 解决

**LSTM（长短期记忆网络）**：
- 遗忘门（Forget Gate）：决定丢弃哪些信息
- 输入门（Input Gate）：决定存储哪些新信息
- 输出门（Output Gate）：决定输出哪些信息

```python
# PyTorch LSTM 示例
lstm = nn.LSTM(
    input_size=256,    # 词向量维度
    hidden_size=512,   # 隐藏层维度
    num_layers=2,      # LSTM 层数
    bidirectional=True, # 双向
    dropout=0.1
)
```

### 3.3 Transformer

**适用场景**：NLP、CV、多模态（当前主流架构）

- 自注意力机制（Self-Attention）捕获全局依赖
- 可并行训练，比 RNN 更高效
- GPT、BERT、ViT 等都基于 Transformer

> 详见 → [Transformer 架构详解](transformer-architecture.md)

## 四、训练流程实战

### 4.1 完整训练 Pipeline

```python
import torch
import torch.nn as nn
from torch.utils.data import DataLoader

# 1. 准备数据
train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=32)

# 2. 定义模型
model = MyModel()
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3)

# 3. 训练循环
for epoch in range(num_epochs):
    model.train()
    for batch in train_loader:
        x, y = batch
        optimizer.zero_grad()
        output = model(x)
        loss = criterion(output, y)
        loss.backward()
        optimizer.step()
    
    # 4. 验证
    model.eval()
    with torch.no_grad():
        val_loss = evaluate(model, val_loader, criterion)
    
    print(f"Epoch {epoch}: train_loss={loss.item():.4f}, val_loss={val_loss:.4f}")
```

### 4.2 学习率调度

```python
from torch.optim.lr_scheduler import CosineAnnealingLR

scheduler = CosineAnnealingLR(optimizer, T_max=100)
# 每个 epoch 后
scheduler.step()
```

**常用策略**：
- **Warmup + Cosine Decay**：大模型训练标配
- **StepLR**：每 N 个 epoch 学习率乘以 gamma
- **ReduceLROnPlateau**：验证损失不下降时降低学习率

### 4.3 混合精度训练

使用 float16 加速训练，减少显存占用：

```python
scaler = torch.cuda.amp.GradScaler()

with torch.cuda.amp.autocast():
    output = model(x)
    loss = criterion(output, y)

scaler.scale(loss).backward()
scaler.step(optimizer)
scaler.update()
```

## 五、模型评估

### 5.1 分类指标

- **准确率（Accuracy）**：正确预测数 / 总数
- **精确率（Precision）**：TP / (TP + FP)
- **召回率（Recall）**：TP / (TP + FN)
- **F1 Score**：精确率和召回率的调和平均

### 5.2 回归指标

- **MAE（平均绝对误差）**
- **MSE（均方误差）**
- **R²（决定系数）**

### 5.3 验证方法

- **K 折交叉验证**：将数据分 K 份，轮流用一份做验证
- **留一法**：K = N 的特殊情况
- **时间序列分割**：按时间顺序划分（不能随机打乱）

## 六、常用框架

| 框架 | 特点 | 适用场景 |
|------|------|---------|
| **PyTorch** | 动态图，研究首选 | 研究、自定义模型 |
| **TensorFlow** | 生态完善，部署方便 | 工业部署 |
| **Keras** | 高层 API，简单易用 | 快速原型 |
| **JAX** | 函数式，极速编译 | 高性能计算 |

## 七、关键概念速查

- **Epoch**：遍历整个训练集一次
- **Batch Size**：每次训练的样本数
- **Iteration**：一次参数更新
- **Learning Rate**：参数更新的步长
- **过拟合**：训练集表现好，测试集差
- **欠拟合**：训练集和测试集都差
- **泛化能力**：模型对未见数据的适应能力
- **迁移学习**：用预训练模型解决新任务
