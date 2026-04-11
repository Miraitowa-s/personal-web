# NLP 预训练模型体系

> 从 BERT 到 GPT，预训练模型彻底改变了 NLP 的技术格局。

## 一、预训练范式的核心思想

```
传统方法：从零开始为每个任务训练模型
预训练方法：先在大规模数据上预训练（学习语言知识），再在具体任务上微调

预训练（Pre-training）        微调（Fine-tuning）
大规模无标注文本 ──────────▶ 具体任务标注数据
学习语言规律和世界知识        适应特定任务
```

**优势**：
- 不需要大量标注数据
- 模型已经"知道"语言的规律
- 只需少量数据即可达到好的效果

## 二、BERT（编码器模型）

### 2.1 核心思想

BERT（Bidirectional Encoder Representations from Transformers）通过**双向注意力**同时看到上下文：

```
输入: "这个电影真[MASK]看"
BERT: 看到左边"这个电影真"和右边的内容
预测: "好"（掩码语言模型 MLM）
```

### 2.2 预训练任务

**1. 掩码语言模型（MLM）**
```
原文: "今天天气真好，适合出去玩"
输入: "今天天气真[MASK]，适合出去[MASK]"
目标: 预测 "好" 和 "玩"
```

**2. 下一句预测（NSP）**
```
句子A: "今天天气真好"
句子B: "适合出去玩"    → IsNext（是下一句）
句子C: "股票涨了"      → NotNext（不是下一句）
```

### 2.3 BERT 使用

```python
from transformers import BertTokenizer, BertModel

tokenizer = BertTokenizer.from_pretrained("bert-base-chinese")
model = BertModel.from_pretrained("bert-base-chinese")

inputs = tokenizer("自然语言处理很有趣", return_tensors="pt")
outputs = model(**inputs)

# 获取句子向量（[CLS] Token 的表示）
sentence_embedding = outputs.last_hidden_state[:, 0, :]  # [1, 768]
```

### 2.4 BERT 微调示例

```python
from transformers import BertForSequenceClassification, Trainer, TrainingArguments

model = BertForSequenceClassification.from_pretrained(
    "bert-base-chinese",
    num_labels=3  # 正面/负面/中性
)

training_args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=3,
    per_device_train_batch_size=16,
    learning_rate=2e-5,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset
)
trainer.train()
```

### 2.5 BERT 变体

| 模型 | 特点 | 参数量 |
|------|------|--------|
| **BERT-base** | 12层，768维 | 110M |
| **BERT-large** | 24层，1024维 | 340M |
| **RoBERTa** | 更好的训练策略 | 125M/355M |
| **ALBERT** | 参数共享，更轻量 | 12M/235M |
| **DeBERTa** | 解耦注意力，效果更好 | 86M/400M |
| **ELECTRA** | 替换检测预训练，训练更快 | 14M/330M |

## 三、GPT（解码器模型）

### 3.1 核心思想

GPT（Generative Pre-trained Transformer）使用**因果注意力**，只能看到当前 Token 左侧的内容：

```
输入: "今天天气" → 预测下一个Token → "真"
输入: "今天天气真" → 预测 → "好"
输入: "今天天气真好" → 预测 → "，"
```

### 3.2 GPT 系列演进

| 模型 | 参数量 | 上下文 | 关键突破 |
|------|--------|--------|---------|
| GPT-1 | 117M | 512 | 验证生成式预训练可行性 |
| GPT-2 | 1.5B | 1024 | 展示零样本学习能力 |
| GPT-3 | 175B | 2048 | 少样本学习，涌现能力 |
| GPT-3.5 | ~200B | 4096 | InstructGPT，对话能力 |
| GPT-4 | 未公开 | 128K | 多模态，推理能力飞跃 |
| GPT-4o | 未公开 | 128K | 原生多模态，实时语音 |

### 3.3 InstructGPT / ChatGPT 的训练

```
阶段1: 预训练（Pre-training）
  大规模互联网文本 → 下一个Token预测

阶段2: 监督微调（SFT）
  人工标注的指令-回答对 → 学习对话格式

阶段3: RLHF（基于人类反馈的强化学习）
  人类排序输出 → 训练奖励模型 → PPO 优化策略
```

> 详见 → [大语言模型（LLM）完全指南](llm-guide.md)

## 四、T5 / BART（编码器-解码器模型）

### 4.1 T5（Text-to-Text Transfer Transformer）

将所有 NLP 任务统一为"文本到文本"格式：

```
翻译任务:   "translate English to German: That is good" → "Das ist gut"
摘要任务:   "summarize: [长文本]" → "[摘要]"
分类任务:   "cola sentence: The cat is on the mat." → "acceptable"
```

### 4.2 BART

```
预训练: 降噪自编码（DAE）
输入:   "今天[MASK]真好，适合出去[DELETE][DELETE]"
目标:   "今天天气真好，适合出去玩"
```

## 五、大语言模型（LLM）

### 5.1 开源模型生态

> 详见 → [大语言模型（LLM）完全指南](llm-guide.md)

| 模型 | 来源 | 参数量 | 特点 |
|------|------|--------|------|
| **LLaMA 3.1** | Meta | 8B-405B | 质量优秀 |
| **Qwen 2.5** | 阿里 | 0.5B-72B | 中文优秀 |
| **DeepSeek-V3** | DeepSeek | 671B MoE | 性价比极高 |
| **Mistral** | Mistral AI | 7B | 高效 |
| **GLM-4** | 智谱 | 9B | 中文友好 |
| **ChatGLM4** | 智谱 | 9B | 开源中文对话 |

### 5.2 使用开源 LLM

```python
# HuggingFace Transformers
from transformers import AutoTokenizer, AutoModelForCausalLM

tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen2.5-7B-Instruct")
model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen2.5-7B-Instruct")

messages = [
    {"role": "system", "content": "你是一个有帮助的助手。"},
    {"role": "user", "content": "解释什么是机器学习"}
]

inputs = tokenizer.apply_chat_template(messages, return_tensors="pt")
outputs = model.generate(inputs, max_new_tokens=512)
print(tokenizer.decode(outputs[0]))
```

```python
# 使用 Ollama 本地运行
import ollama
response = ollama.chat(model='qwen2.5:7b',
                        messages=[{'role': 'user', 'content': '你好'}])
print(response['message']['content'])
```

## 六、微调方法

### 6.1 全量微调

更新模型所有参数，效果最好但成本高：

```python
from transformers import TrainingArguments

training_args = TrainingArguments(
    output_dir="./finetuned_model",
    num_train_epochs=3,
    per_device_train_batch_size=8,
    learning_rate=2e-5,
    fp16=True,  # 混合精度
)
```

### 6.2 LoRA（低秩适配）

只训练少量参数，大幅降低计算成本：

```python
from peft import LoraConfig, get_peft_model

lora_config = LoraConfig(
    r=16,                     # 秩
    lora_alpha=32,            # 缩放因子
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05,
    task_type="CAUSAL_LM"
)

model = get_peft_model(base_model, lora_config)
# 可训练参数仅占 0.19%！
```

### 6.3 QLoRA

在 4-bit 量化模型上做 LoRA，进一步降低显存需求：

```python
from transformers import BitsAndBytesConfig

quantization_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.float16
)

model = AutoModelForCausalLM.from_pretrained(
    "Qwen/Qwen2.5-7B",
    quantization_config=quantization_config
)
```

## 七、模型评估

| 指标 | 适用任务 | 说明 |
|------|---------|------|
| **BLEU** | 机器翻译 | n-gram 重叠率 |
| **ROUGE** | 文本摘要 | 召回率 |
| **Perplexity** | 语言模型 | 困惑度，越低越好 |
| **准确率/ F1** | 分类/NER | 标准指标 |
| **MMLU** | 通用能力 | 多选问答基准 |
| **HumanEval** | 代码生成 | 代码正确率 |

## 八、模型选择指南

```
文本分类 / NER → BERT 系列微调
文本生成 / 对话 → GPT 系列（开源用 Qwen/LLaMA）
机器翻译 → mBART / NLLB
文本摘要 → BART / PEGASUS / LLM
语义搜索 → sentence-transformers / BGE
中文场景优先 → Qwen 系列 / BERT-chinese
资源有限 → 小模型 + 量化（QLoRA）
```
