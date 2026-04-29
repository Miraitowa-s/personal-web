# AI 与大模型学习路径

> 从零开始系统学习 AI / LLM，一张路线图看清学什么、怎么学、学到什么程度。

## 一、整体学习路径

```
阶段一：数学与编程基础（1-2个月）
    ↓
阶段二：深度学习核心（1-2个月）
    ↓
阶段三：Transformer & LLM（1-2个月）
    ↓
阶段四：工程应用（持续）
```

## 二、各阶段详解

### 阶段一：基础知识

**数学基础（不要求精通，理解原理即可）：**

| 领域 | 核心内容 | 重要程度 |
|------|----------|----------|
| 线性代数 | 矩阵乘法、特征值、SVD | ⭐⭐⭐⭐⭐ |
| 微积分 | 求导、链式法则、梯度 | ⭐⭐⭐⭐⭐ |
| 概率统计 | 条件概率、贝叶斯、分布 | ⭐⭐⭐⭐ |
| 信息论 | 熵、KL 散度、交叉熵 | ⭐⭐⭐ |

**编程基础：**
```python
# 必须掌握的 Python 技能：
# 1. NumPy - 矩阵运算
# 2. PyTorch / TensorFlow - 深度学习框架
# 3. HuggingFace Transformers - 预训练模型生态
```

### 阶段二：深度学习核心

按顺序学习：

```
1. 感知机 → 多层感知机（MLP）
2. 反向传播算法（BP）
3. 激活函数（ReLU、GELU、SiLU）
4. 优化器（SGD → Adam → AdamW）
5. 正则化（Dropout、BatchNorm、LayerNorm）
6. CNN（卷积，图像任务）
7. RNN / LSTM（序列，已被 Transformer 取代，了解即可）
```

**关键概念：**
- **过拟合 vs 欠拟合**：模型在训练集上好，测试集上差 → 过拟合
- **泛化能力**：在没见过的数据上的表现
- **批大小（Batch Size）**：影响训练稳定性和速度

### 阶段三：Transformer & LLM

**必读核心论文（按重要性排序）：**

| 论文 | 贡献 | 年份 |
|------|------|------|
| Attention Is All You Need | Transformer 架构 | 2017 |
| BERT | 预训练 + 微调范式 | 2018 |
| GPT-3 | Few-shot 学习 | 2020 |
| InstructGPT | RLHF 对齐 | 2022 |
| LLaMA | 开源高效 LLM | 2023 |
| Constitutional AI | RLAIF | 2022 |

**工程技能：**
```bash
# HuggingFace 生态
pip install transformers datasets accelerate peft

# 关键 API
from transformers import AutoTokenizer, AutoModelForCausalLM
tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen2.5-7B")
model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen2.5-7B")
```

### 阶段四：工程应用

**四个方向，根据目标选一个深入：**

```
方向A：提示工程（Prompt Engineering）
  → 最快上手，适合产品/业务侧
  → 学习内容：Chain-of-Thought、Few-shot、RAG

方向B：模型微调（Fine-tuning）
  → 适合有特定领域数据的场景
  → 学习内容：LoRA、QLoRA、SFT、DPO

方向C：Agent 开发
  → 适合构建自动化 AI 应用
  → 学习内容：LangChain、工具调用、记忆管理

方向D：大模型部署
  → 适合工程/DevOps 方向
  → 学习内容：量化（GGUF/AWQ）、推理加速（vLLM）、Ollama
```

## 三、本分类文章导航

| 文章 | 核心内容 | 适合阶段 |
|------|----------|----------|
| [深度学习基础](deep-learning-basics.md) | 神经网络原理、反向传播、常见网络结构 | 阶段二 |
| [Transformer 架构详解](transformer-architecture.md) | Self-Attention、位置编码、BERT vs GPT | 阶段三 |
| [大语言模型完全指南](llm-guide.md) | LLM 全景、训练流程、主流模型对比 | 阶段三 |
| [Prompt Engineering 指南](prompt-engineering.md) | 提示技巧、CoT、Few-shot、结构化提示 | 阶段四 |
| [RAG 检索增强生成](rag-guide.md) | 检索原理、向量数据库、工程实践 | 阶段四 |
| [Ollama 本地大模型部署](ollama-guide.md) | 在本地跑各种开源模型 | 阶段四 |

## 四、推荐资源

### 课程

| 资源 | 平台 | 适合 |
|------|------|------|
| CS231n（斯坦福深度学习） | YouTube/官网 | 系统学习深度学习 |
| fast.ai Practical Deep Learning | fast.ai | 实战导向，先跑通再理解 |
| Andrej Karpathy - makemore 系列 | YouTube | 从零实现 LLM，非常推荐 |
| HuggingFace NLP Course | huggingface.co | Transformer 工程实践 |

### 工具与框架

```
基础学习：  PyTorch（首选）
模型生态：  HuggingFace Transformers
数据处理：  datasets（HuggingFace）
微调工具：  PEFT / unsloth
本地部署：  Ollama / LM Studio
向量数据库：Chroma / Milvus / Weaviate
Agent 框架：LangChain / LlamaIndex
```

### 跟进前沿

- **arXiv cs.CL**：最新 NLP/LLM 论文
- **Papers With Code**：论文 + 开源代码
- **HuggingFace Blog**：工程实践文章
- **Simon Willison's weblog**：LLM 应用实践

## 五、常见困惑解答

**Q：数学不好能学 AI 吗？**
> 可以。工程应用（Prompt Engineering、RAG、Agent）几乎不需要数学。从应用层入手，边做边补基础是最高效的路径。

**Q：用 PyTorch 还是 TensorFlow？**
> 2024 年明确选 PyTorch。科研社区 90%+ 使用 PyTorch，HuggingFace 生态也以 PyTorch 为主。

**Q：要不要从头训练一个模型？**
> 个人/小团队不建议。GPU 成本极高，用现成的预训练模型做微调（LoRA/QLoRA）是更现实的选择。

**Q：学什么模型好？**
> 开源侧：LLaMA 3 / Qwen2.5 / DeepSeek（理解架构）
> 应用侧：直接用 API（OpenAI / Claude / 通义千问）

---

## 六、专业术语速查

> 遇到看不懂的词时，来这里查一下。

| 术语 | 解释 |
|------|------|
| **预训练（Pre-training）** | 在海量无标注数据上训练模型，让它学会语言的基本规律，就像让人先博览群书 |
| **微调（Fine-tuning）** | 在预训练模型基础上，用特定任务的数据继续训练，让模型专注某个领域 |
| **蒸馏（Distillation）** | 用大模型（教师）指导小模型（学生）训练，让小模型尽量复现大模型的能力，成本低很多 |
| **量化（Quantization）** | 将模型参数从高精度（FP32）压缩到低精度（INT8/INT4），显著减少显存和计算量 |
| **LoRA** | 低秩适配，微调时只训练少量新增参数，不动原模型权重，训练快、显存省 |
| **RLHF** | 基于人类反馈的强化学习，GPT-4、Claude 等都用这种方式让模型更符合人类偏好 |
| **幻觉（Hallucination）** | 模型一本正经地编造不存在的事实，是当前 LLM 最大的痛点之一 |
| **上下文窗口（Context Window）** | 模型一次能处理的最大 Token 数，GPT-4 支持 128K，相当于一本书的信息量 |
| **Token** | 模型处理文本的基本单位，大约 1 个中文字 ≈ 1.5 个 Token，1 个英文单词 ≈ 1-2 个 Token |
| **涌现（Emergence）** | 当模型规模达到某个临界点后突然出现的能力，比如推理、写代码，小模型里完全没有 |
| **对齐（Alignment）** | 让 AI 的行为符合人类意图和价值观，防止模型做危险或有害的事 |
| **提示词注入（Prompt Injection）** | 攻击者通过构造特殊输入，绕过 AI 的限制或劫持 AI 的行为 |
| **RAG** | 检索增强生成，先从知识库里检索相关内容，再让模型基于检索结果回答，减少幻觉 |
| **向量嵌入（Embedding）** | 将文本转换为高维数字向量，语义相近的文本在向量空间中距离也更近 |
| **温度（Temperature）** | 控制模型回答随机性的参数，越高越创意发散，越低越保守准确，0 = 总是选最大概率的词 |
