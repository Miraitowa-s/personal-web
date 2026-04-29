# Transformer 架构详解

> Transformer 是现代深度学习最重要的架构之一，是 GPT、BERT、LLaMA 等模型的基础。

## 一、背景与动机

### 1.1 传统序列模型的局限

在 Transformer 之前，NLP 主要依赖 RNN/LSTM：

<div align="center">
  <div style="display: flex; justify-content: center; gap: 40px; margin: 20px 0; flex-wrap: wrap;">
    <div style="text-align: center;">
      <div style="width: 200px; height: 120px; background: #f0f2f5; border: 2px dashed #d9dde4; border-radius: 6px; display: flex; align-items: center; justify-content: center;">
        <span style="color: #8c8c8c; font-size: 14px;">RNN架构示意图</span>
      </div>
      <p style="font-size: 12px; color: #999; margin-top: 4px;">[示意图] RNN 串行处理</p>
    </div>
    <div style="text-align: center;">
      <div style="width: 200px; height: 120px; background: #f0f2f5; border: 2px solid #e8632a; border-radius: 6px; display: flex; align-items: center; justify-content: center;">
        <span style="color: #e8632a; font-weight: 500; font-size: 14px;">Transformer架构</span>
      </div>
      <p style="font-size: 12px; color: #999; margin-top: 4px;">[示意图] Transformer 并行处理</p>
    </div>
  </div>
  <p style="font-size: 14px; color: #666;">RNN（左）vs Transformer（右）架构对比</p>
</div>

```
RNN 的处理方式：
h₁ → h₂ → h₃ → h₄ → ... → hₙ

问题：
1. 串行处理，无法并行 → 训练慢
2. 长距离依赖衰减 → 远处信息容易丢失
3. 梯度消失/爆炸 → 难以训练
```

### 1.2 Transformer 的突破

2017 年，Google 论文《Attention Is All You Need》提出 Transformer：

```
✅ 完全基于注意力机制，放弃循环结构
✅ 可并行训练 → 速度快 10x+
✅ 直接建模任意位置间的关系 → 解决长距离依赖
✅ 可扩展性强 → 参数量从百万到万亿都适用
```

## 二、整体架构

### 2.1 编码器-解码器结构（原始版）

```
                    编码器（Encoder）              解码器（Decoder）
                 ┌──────────────────┐      ┌──────────────────┐
输入 ──────────▶ │ Multi-Head Attn   │      │ Masked Multi-Head│────▶ 输出
Embedding ─────▶ │ FFN               │      │ Attn             │
  + Pos Enc ───▶ │ Add & Norm        │      │ FFN              │
                 │   × N 层          │      │ Add & Norm        │
                 └────────┬─────────┘      │   × N 层          │
                          │                └──────────────────┘
                     交叉注意力连接 ─────────────────────────▶
```

### 2.2 仅编码器（BERT）

```
输入 ──▶ [Token Embed + Position Embed + Segment Embed]
            │
      ┌─────▼─────┐
      │  Multi-Head Attention（双向）
      │  Add & Layer Norm
      │  Feed Forward
      │  Add & Layer Norm
      └─────┬─────┘
            │ × N 层
      [CLS] [T₁] [T₂] ... [Tₙ]
        │                      │
     分类任务                序列标注
```

### 2.3 仅解码器（GPT / LLaMA / Qwen）

```
输入 Token ──▶ [Token Embed + Position Embed]
                    │
              ┌─────▼─────┐
              │  Masked Multi-Head Attention（因果）
              │  Add & Layer Norm
              │  Feed Forward
              │  Add & Layer Norm
              └─────┬─────┘
                    │ × N 层
              [h₁] [h₂] [h₃] ... [hₙ]
                │
            输出下一个 Token
```

> **当前主流**：几乎所有大语言模型都采用仅解码器（Decoder-only）架构。

## 三、核心组件详解

### 3.1 注意力机制（Self-Attention）

注意力机制的核心思想：让每个位置都能"关注"序列中的所有其他位置。

**计算过程**：

```
输入: X ∈ R^(n×d)

1. 线性变换生成 Q, K, V:
   Q = X · W_Q    (Query，查询)
   K = X · W_K    (Key，键)
   V = X · W_V    (Value，值)

2. 计算注意力分数:
   scores = Q · K^T / √d_k    (缩放点积)

3. Softmax 归一化:
   weights = softmax(scores)    (每个位置对其他位置的注意力权重)

4. 加权求和:
   output = weights · V
```

**直觉理解**：

```
"我喜欢吃 苹果，因为它是红色的水果"

Token "它" 的注意力：
- "苹果": 权重 0.8  ← 高注意力，指代苹果
- "我": 权重 0.05
- "吃": 权重 0.02
- "红色": 权重 0.1
- "水果": 权重 0.03
```

### 3.2 多头注意力（Multi-Head Attention）

将注意力分成多个"头"，每个头关注不同维度：

```
MultiHead(Q, K, V) = Concat(head₁, ..., head_h) · W_O

其中 head_i = Attention(Q · W_Qᵢ, K · W_Kᵢ, V · W_Vᵢ)
```

```
多头注意力的意义：
┌─────────┐ ┌─────────┐ ┌─────────┐
│  Head 1 │ │  Head 2 │ │  Head 3 │
│ 关注语法 │ │ 关注语义 │ │ 关注位置 │
└────┬────┘ └────┬────┘ └────┬────┘
     │           │           │
     └───────────┼───────────┘
                 ▼
         Concat + Linear
                 │
          综合多维度信息
```

**典型配置**：
- GPT-3 (175B)：96 头，每头 128 维
- LLaMA 2 (70B)：64 头，每头 128 维
- BERT-Large：16 头，每头 64 维

### 3.3 前馈神经网络（FFN）

每个 Transformer 层包含一个两层前馈网络：

```
FFN(x) = GELU(x · W₁ + b₁) · W₂ + b₂

或 SwiGLU（LLaMA 使用）：
FFN(x) = (x · W₁) ⊙ SiLU(x · V) · W₂

内部维度通常是模型维度的 4 倍（d_ff = 4 × d_model）
```

```
输入 d_model ──▶ Linear(d_model, d_ff) ──▶ 激活函数 ──▶ Linear(d_ff, d_model) ──▶ 输出
   768                              3072                              768
```

### 3.4 层归一化（Layer Normalization）

```python
# Pre-LayerNorm（GPT-2 之后的主流）
class Block(nn.Module):
    def forward(self, x):
        x = x + Attention(LayerNorm(x))    # 先归一化，再计算
        x = x + FFN(LayerNorm(x))
        return x

# Post-LayerNorm（原始 Transformer）
class Block(nn.Module):
    def forward(self, x):
        x = LayerNorm(x + Attention(x))    # 先计算，再归一化
        x = LayerNorm(x + FFN(x))
        return x
```

### 3.5 残差连接（Residual Connection）

```
# 每个子层都有残差连接
output = LayerNorm(x + SubLayer(x))
```

残差连接解决深层网络的梯度消失问题，使信息能直接跨层传递。

### 3.6 位置编码（Positional Encoding）

Transformer 没有位置概念，需要额外注入位置信息：

**RoPE（旋转位置编码，当前主流）**：
```python
def apply_rotary_emb(x, cos, sin):
    # 将 Token Embedding 在多维空间中旋转
    # 不同位置旋转角度不同 → 编码了位置信息
    x1, x2 = x[..., ::2], x[..., 1::2]
    rotated = torch.stack([-x2, x1], dim=-1)
    return x * cos + rotated * sin
```

**RoPE 的优势**：
- 相对位置信息自然编码
- 支持外推到更长序列
- LLaMA、Qwen、Mistral 等主流模型均采用

### 3.7 因果掩码（Causal Mask）

Decoder-only 模型使用，防止看到未来的 Token：

```
Attention Mask（下三角矩阵）:
     T₁  T₂  T₃  T₄
T₁ [ 1    0    0    0 ]   ← T₁ 只能看自己
T₂ [ 1    1    0    0 ]   ← T₂ 能看 T₁, T₂
T₃ [ 1    1    1    0 ]   ← T₃ 能看 T₁, T₂, T₃
T₄ [ 1    1    1    1 ]   ← T₄ 能看全部

0 的位置会被设为 -∞，softmax 后变为 0
```

## 四、现代 LLM 的改进

### 4.1 LLaMA 改进

```
1. RMSNorm 替代 LayerNorm（计算更快）
2. SwiGLU 激活函数（替代 GELU）
3. RoPE 旋转位置编码
4. 不使用偏置项（去除 bias）
```

### 4.2 Flash Attention

```
标准注意力：O(N²) 内存，需写出完整注意力矩阵
Flash Attention：
  - 分块计算，不写出完整矩阵
  - 内存从 O(N²) 降到 O(N)
  - 速度提升 2-4x
  - 精度完全一致（数学等价）
```

### 4.3 GQA（分组查询注意力）

```
标准 MHA: 每个 head 有独立的 Q, K, V
MQA: 所有 head 共享一组 K, V（极致压缩）
GQA: 将 head 分组，组内共享 K, V（平衡方案）

| 方法 | KV 头数 | 内存 | 质量 |
|------|--------|------|------|
| MHA  | 32     | 高   | 最好 |
| GQA  | 8      | 中   | 较好 |
| MQA  | 1      | 低   | 稍差 |

LLaMA 2、Mistral、Qwen 均使用 GQA
```

### 4.4 MoE（混合专家）

```
每个 FFN 层有多个"专家"（子网络），路由器决定每个 Token 送给哪个专家：

输入 Token ──▶ Router ──▶ 选择 Top-K 个专家
                          ├─ Expert 1 (FFN)
                          ├─ Expert 2 (FFN)
                          └─ Expert 8 (FFN)

代表模型：
- Mixtral 8×7B：8 个专家，每次选 2 个，参数量 46.7B，推理速度同 12B
- DeepSeek-V3：256 个专家，每次选 8 个，总参数 671B
```

## 五、模型参数分析

以 LLaMA 2 70B 为例：

```
模型维度 d_model: 8192
注意力头数: 64
层数: 80
FFN 维度: 28672

参数分布（大致）:
- Embedding 层: ~5%
- 注意力层: ~33%
- FFN 层: ~62%    ← 占大头

总计: ~70B 参数
- FP16 权重: 140GB
- INT4 量化: ~35GB
```

## 六、从零实现迷你 Transformer（概念版）

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
import math

class SelfAttention(nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        self.n_heads = n_heads
        self.d_head = d_model // n_heads
        self.W_Q = nn.Linear(d_model, d_model)
        self.W_K = nn.Linear(d_model, d_model)
        self.W_V = nn.Linear(d_model, d_model)
        self.W_O = nn.Linear(d_model, d_model)

    def forward(self, x, mask=None):
        B, N, D = x.shape
        Q = self.W_Q(x).view(B, N, self.n_heads, self.d_head).transpose(1, 2)
        K = self.W_K(x).view(B, N, self.n_heads, self.d_head).transpose(1, 2)
        V = self.W_V(x).view(B, N, self.n_heads, self.d_head).transpose(1, 2)

        scores = Q @ K.transpose(-2, -1) / math.sqrt(self.d_head)
        if mask is not None:
            scores = scores.masked_fill(mask == 0, float('-inf'))
        attn = F.softmax(scores, dim=-1)

        out = (attn @ V).transpose(1, 2).reshape(B, N, D)
        return self.W_O(out)

class TransformerBlock(nn.Module):
    def __init__(self, d_model, n_heads, d_ff, dropout=0.1):
        super().__init__()
        self.attn = SelfAttention(d_model, n_heads)
        self.ffn = nn.Sequential(
            nn.Linear(d_model, d_ff),
            nn.GELU(),
            nn.Linear(d_ff, d_model)
        )
        self.ln1 = nn.LayerNorm(d_model)
        self.ln2 = nn.LayerNorm(d_model)
        self.drop = nn.Dropout(dropout)

    def forward(self, x, mask=None):
        x = self.ln1(x + self.drop(self.attn(x, mask)))
        x = self.ln2(x + self.drop(self.ffn(x)))
        return x
```

## 七、总结

```
Transformer 核心要点：

1. Self-Attention：全局信息交互，无需递归
2. Multi-Head：多角度关注不同信息
3. Feed Forward：两层非线性变换
4. Residual + LayerNorm：稳定深层训练
5. Position Encoding：注入位置信息

现代改进：
- RoPE（旋转位置编码）
- GQA（分组查询注意力）
- SwiGLU（激活函数）
- RMSNorm（层归一化）
- Flash Attention（高效实现）
- MoE（混合专家）
```
