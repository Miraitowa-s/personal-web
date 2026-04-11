# 大语言模型（LLM）完全指南

> 大语言模型（Large Language Model）是当前 AI 领域最核心的技术，能够理解和生成自然语言。

## 一、什么是大语言模型

大语言模型是基于 Transformer 架构、在大规模文本数据上训练的神经网络模型。它通过预测下一个 Token（词或子词）来学习语言的统计规律和世界知识。

### 1.1 核心特征

- **涌现能力**：当模型参数量达到一定规模（通常 > 10B），突然具备小模型没有的能力
- **上下文学习（In-Context Learning）**：无需微调，仅通过示例就能学会新任务
- **零样本/少样本推理**：不需要（或只需少量）训练样本即可完成新任务

### 1.2 发展时间线

```
2017  Transformer 论文发布（Attention Is All You Need）
2018  GPT-1、BERT
2019  GPT-2、XLNet、RoBERTa
2020  GPT-3（175B）、T5
2021  Codex、InstructGPT
2022  ChatGPT、LLaMA
2023  GPT-4、Claude、LLaMA 2、Qwen、Baichuan
2024  GPT-4o、Claude 3.5、Gemini、DeepSeek-V2
2025  DeepSeek-R1、GPT-o3、Qwen3
```

## 二、两大主流范式

### 2.1 编码器模型（Encoder-only）

**代表**：BERT、RoBERTa、DeBERTa

- 双向注意力，能看到整个句子
- 适合理解类任务：文本分类、NER、问答
- 预训练任务：掩码语言模型（MLM）

```
输入: "我喜欢 [MASK]"
输出: "编程"（预测被遮挡的内容）
```

### 2.2 解码器模型（Decoder-only）

**代表**：GPT 系列、LLaMA、Qwen、DeepSeek

- 单向（因果）注意力，只能看到前面的内容
- 适合生成类任务：对话、写作、代码生成
- 预训练任务：下一个 Token 预测（Causal LM）

```
输入: "今天天气真"
输出: "好"（预测下一个词）→ "好，适合出去玩"
```

> **当前趋势**：Decoder-only 成为主流，几乎所有 LLM 都采用这个范式。

### 2.3 编码器-解码器模型（Encoder-Decoder）

**代表**：T5、BART

- 编码器理解输入，解码器生成输出
- 适合序列到序列任务：翻译、摘要

## 三、模型训练全流程

### 3.1 三个阶段

```
阶段1: 预训练（Pre-training）
  ├─ 数据: 互联网文本（数 TB 级别）
  ├─ 任务: 下一个 Token 预测
  ├─ 目标: 学习语言规律和世界知识
  └─ 成本: 数百万美元（GPU 集群）

阶段2: 监督微调（SFT）
  ├─ 数据: 人工标注的指令-回答对（数万~数十万条）
  ├─ 任务: 按照指令格式输出
  ├─ 目标: 让模型学会"对话"
  └─ 成本: 较低（单卡~多卡即可）

阶段3: 对齐（Alignment）
  ├─ 方法: RLHF / DPO
  ├─ 目标: 让输出更安全、更有用、更符合人类偏好
  └─ 成本: 中等
```

### 3.2 预训练数据

| 数据类型 | 占比（典型） | 来源 |
|---------|------------|------|
| 网页文本 | ~60% | Common Crawl |
| 书籍 | ~15% | Books3, Gutenberg |
| 学术论文 | ~10% | arXiv, Semantic Scholar |
| 代码 | ~10% | GitHub, StackOverflow |
| 维基百科 | ~5% | 多语言 Wikipedia |

### 3.3 分词器（Tokenizer）

LLM 不是按"词"处理文本，而是按"子词"（Subword）：

```python
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("deepseek-ai/deepseek-llm")

tokens = tokenizer.encode("Hello 你好")
# [15496, 103927, 882, 108386]
print(tokenizer.convert_ids_to_tokens(tokens))
# ['Hello', '▁你', '好']
```

**常见分词算法**：
- **BPE（Byte Pair Encoding）**：GPT 系列使用
- **WordPiece**：BERT 使用
- **SentencePiece**：LLaMA 使用

## 四、关键技术

### 4.1 注意力机制（Attention）

```python
Attention(Q, K, V) = softmax(Q·K^T / √d_k) · V
```

- **Q（Query）**：查询向量
- **K（Key）**：键向量
- **V（Value）**：值向量
- **Multi-Head Attention**：多个注意力头并行，捕获不同维度特征

### 4.2 位置编码

Transformer 没有递归结构，需要额外编码位置信息：

- **正弦位置编码**（原始 Transformer）
- **可学习位置编码**（BERT、GPT）
- **旋转位置编码 RoPE**（LLaMA、Qwen，当前主流）
- **ALiBi**（BLOOM）

### 4.3 涌现能力

当参数量超过阈值，模型突然获得新能力：

| 涌现能力 | 大致阈值 |
|---------|---------|
| 少样本推理 | ~10B 参数 |
| 思维链推理 | ~40B 参数 |
| 代码生成 | ~10B 参数 |
| 指令跟随 | ~7B 参数 |

### 4.4 上下文窗口

模型能处理的最大输入长度：

| 模型 | 上下文窗口 |
|------|-----------|
| GPT-3 | 4K |
| GPT-4 | 128K |
| Claude 3 | 200K |
| Gemini 1.5 | 1M |
| Qwen2 | 128K |
| DeepSeek-V2 | 128K |

**扩展技术**：
- **RoPE 缩放**（YaRN、NTK-aware）
- **Sliding Window Attention**（Mistral）
- **Ring Attention**（极长上下文）

## 五、RLHF 与对齐技术

### 5.1 RLHF（基于人类反馈的强化学习）

```
1. 训练奖励模型（Reward Model）
   - 人类对多个输出排序 → 训练打分模型

2. 用 PPO 强化学习优化
   - 奖励信号来自 Reward Model
   - KL 散度惩罚防止偏离太远
```

### 5.2 DPO（直接偏好优化）

比 RLHF 更简单，无需单独训练奖励模型：

```
min E[ -log σ(β·(log π_θ(y_w/x) - log π_θ(y_l/x) - log(r_w/r_l)) )]
```

- **y_w**：人类偏好的回答
- **y_l**：人类不喜欢的回答
- 直接用偏好数据优化策略模型

### 5.3 其他对齐方法

- **Constitutional AI（CAI）**：Claude 使用，用 AI 自我批评
- **GRPO**：DeepSeek-R1 使用，Group Relative Policy Optimization

## 六、推理优化

### 6.1 量化（Quantization）

降低模型精度以减少显存和加速推理：

| 量化 | 精度 | 显存占用 | 质量损失 |
|------|------|---------|---------|
| FP16 | 16-bit | 1x | 几乎无损 |
| INT8 | 8-bit | 0.5x | 很小 |
| INT4 | 4-bit | 0.25x | 可控 |
| GPTQ | 4-bit | 0.25x | 较小 |

```python
from transformers import BitsAndBytesConfig

quantization_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.float16
)
```

### 6.2 KV Cache

缓存注意力计算中的 K 和 V，避免重复计算：

```
第 1 步: Q₁·[K₁]·[V₁]          → 输出 token₁
第 2 步: Q₂·[K₁,K₂]·[V₁,V₂]     → 输出 token₂
第 3 步: Q₃·[K₁,K₂,K₃]·[V₁,V₂,V₃] → 输出 token₃
...
```

### 6.3 推测解码（Speculative Decoding）

用小模型快速生成候选 Token，大模型并行验证：

```
小模型: 预测 5 个 token [t1, t2, t3, t4, t5]
大模型: 并行验证，接受前 3 个，拒绝后 2 个
结果: 一次推理获得 3 个正确 token（加速 2-3x）
```

### 6.4 Flash Attention

- 不将注意力矩阵写入 HBM，减少内存读写
- 计算复杂度不变，但速度提升 2-4x

## 七、开源模型生态

### 7.1 主流开源模型

| 模型 | 参数量 | 特点 |
|------|--------|------|
| **LLaMA 3** | 8B/70B/405B | Meta，质量优秀 |
| **Qwen 2.5** | 0.5B-72B | 阿里，中文强 |
| **DeepSeek-V3** | 671B MoE | 性价比极高 |
| **Mistral** | 7B/8x7B | 效率高 |
| **GLM-4** | 9B | 智谱，中文友好 |

### 7.2 推理框架

- **vLLM**：高性能推理服务（PagedAttention）
- **TGI**（HuggingFace）：生产级推理
- **Ollama**：本地部署，简单易用
- **llama.cpp**：CPU/GPU 混合推理

```bash
# Ollama 一键部署
ollama run qwen2.5:7b

# vLLM 启动服务
python -m vllm.entrypoints.openai.api_server \
  --model Qwen/Qwen2.5-7B-Instruct \
  --tensor-parallel-size 2
```

### 7.3 微调方法

| 方法 | 需要数据 | 需要GPU | 效果 |
|------|---------|---------|------|
| **全量微调** | 大量 | 极高 | 最好 |
| **LoRA** | 中等 | 中等 | 好 |
| **QLoRA** | 中等 | 较低 | 较好 |
| **P-Tuning v2** | 少量 | 较低 | 中等 |

```python
from peft import LoraConfig, get_peft_model

lora_config = LoraConfig(
    r=16,                          # 秩
    lora_alpha=32,                 # 缩放因子
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05,
    task_type="CAUSAL_LM"
)
model = get_peft_model(base_model, lora_config)
model.print_trainable_parameters()
# trainable params: 13M || all params: 7B || trainable%: 0.19%
```

## 八、Prompt Engineering（提示工程）

> 详见 → [Prompt Engineering 指南](prompt-engineering.md)

### 快速技巧

```
1. 系统提示（System Prompt）
   "你是一个专业的Python开发工程师，请用中文回答。"

2. Few-shot 示例
   输入 → 输出
   输入 → 输出
   [新的输入] → ?

3. 思维链（Chain of Thought）
   "请一步步思考，先分析问题，再给出答案。"

4. 角色扮演
   "你是一位经验丰富的算法面试官，请出3道中等难度的题目。"
```

## 九、LLM 应用场景

| 场景 | 说明 | 代表产品 |
|------|------|---------|
| 智能对话 | 通用问答、闲聊 | ChatGPT、Claude |
| 代码助手 | 代码生成、补全、Review | GitHub Copilot、Cursor |
| 文档写作 | 文案、邮件、报告 | Jasper、Copy.ai |
| 知识问答 | 基于文档回答问题 | Perplexity、RAG 应用 |
| Agent | 自主完成复杂任务 | AutoGPT、Devin |
| 多模态 | 图文理解、生成 | GPT-4V、Gemini |

## 十、常见问题

**Q: 如何选择开源模型？**
- 中文场景：首选 Qwen 系列
- 资源有限（<8GB）：用 7B 量化模型
- 追求质量：70B+ 模型
- 性价比：DeepSeek-V2/V3

**Q: 如何评估 LLM？**
- 自动评估：BLEU、ROUGE、Perplexity
- 基准测试：MMLU、GSM8K、HumanEval
- 人工评估：最有参考价值但成本高

**Q: LLM 的局限？**
- 幻觉（Hallucination）：生成看似合理但错误的内容
- 知识过时：训练数据有截止日期
- 推理能力有限：复杂多步推理仍有困难
- 安全问题：可能生成有害内容
