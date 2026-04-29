# 自然语言处理（NLP）基础

> NLP 是让计算机理解、处理和生成人类语言的技术，是 AI 最重要的应用领域之一。

## 一、NLP 简介

自然语言处理（Natural Language Processing，NLP）是计算机科学、人工智能和语言学的交叉领域，核心目标是让计算机能够：

- **理解**：理解人类语言的含义
- **处理**：对文本和语音进行分析、转换
- **生成**：产生自然、流畅的人类语言

### 1.1 自然语言的挑战

```
1. 歧义性：词汇歧义（"苹果"=水果/公司）、句法歧义、语义歧义
2. 上下文依赖："我明天去银行" vs "他在河岸散步"
3. 创新性：网络用语、新词不断产生
4. 文化差异：同一个词在不同语境含义不同
5. 非标准化：口语化表达、语法不规范、错别字
```

## 二、NLP 基础任务

### 2.1 文本预处理

```python
# 常见预处理流程
原始文本 → 分词 → 去停用词 → 词干化/词形还原 → 清洗
```

**分词（Tokenization）**
```python
# 中文分词
import jieba

text = "自然语言处理是人工智能的重要方向"
words = jieba.lcut(text)
# ['自然语言', '处理', '是', '人工智能', '的', '重要', '方向']
```

**去停用词**
```python
stopwords = {'的', '是', '在', '了', '和', '与', '或'}
filtered = [w for w in words if w not in stopwords]
```

### 2.2 词性标注（POS Tagging）

为每个词标注词性（名词、动词、形容词等）：

```python
import nltk
nltk.pos_tag(['I', 'love', 'Python'])
# [('I', 'PRP'), ('love', 'VBP'), ('Python', 'NNP')]
```

### 2.3 命名实体识别（NER）

识别文本中的人名、地名、组织名等实体：

```python
from transformers import pipeline

ner = pipeline("ner", grouped_entities=True)
result = ner("马云在杭州创立了阿里巴巴")
# [{'entity': 'PER', 'word': '马云', ...},
#  {'entity': 'LOC', 'word': '杭州', ...},
#  {'entity': 'ORG', 'word': '阿里巴巴', ...}]
```

### 2.4 文本分类

将文本归入预定义的类别：

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(train_texts)
clf = MultinomialNB()
clf.fit(X, train_labels)

# 预测
new_X = vectorizer.transform(["这个产品太好用了！"])
print(clf.predict(new_X))  # ['正面']
```

### 2.5 情感分析

判断文本的情感倾向（正面/负面/中性）：

```python
from transformers import pipeline

sentiment = pipeline("sentiment-analysis")
result = sentiment("这部电影真的非常好看，强烈推荐！")
# [{'label': 'POSITIVE', 'score': 0.999}]
```

### 2.6 文本相似度

计算两段文本的语义相似度：

```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
embeddings = model.encode(["今天天气真好", "天气真不错啊"])
from sklearn.metrics.pairwise import cosine_similarity
print(cosine_similarity([embeddings[0]], [embeddings[1]]))
# [[0.92]]  ← 高度相似
```

## 三、文本表示方法

### 3.1 词袋模型（Bag of Words）

```python
from sklearn.feature_extraction.text import CountVectorizer

texts = ["猫喜欢吃鱼", "狗喜欢吃骨头"]
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(texts)
print(vectorizer.get_feature_names_out())
# ['喜欢' '吃' '骨头' '猫' '狗' '鱼']
```

缺点：忽略词序、维度爆炸、无法表示语义。

### 3.2 TF-IDF

```python
from sklearn.feature_extraction.text import TfidfVectorizer

tfidf = TfidfVectorizer()
X = tfidf.fit_transform(texts)
```

TF-IDF = 词频（TF）× 逆文档频率（IDF），突出区分度高的词。

### 3.3 Word2Vec（词向量）

将每个词映射为固定维度的稠密向量，语义相近的词向量距离也相近：

```python
from gensim.models import Word2Vec

sentences = [["猫", "喜欢", "鱼"], ["狗", "喜欢", "骨头"]]
model = Word2Vec(sentences, vector_size=100, window=5, min_count=1)

# 相似词
model.wv.most_similar("猫", topn=3)
```

### 3.4 句子/文档向量

```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')
embedding = model.encode("自然语言处理很有趣")
# [0.023, -0.045, 0.067, ...]  (384维向量)
```

## 四、核心技术架构

### 4.1 RNN / LSTM

处理序列数据，适合文本任务：

```python
import torch
import torch.nn as nn

class TextClassifier(nn.Module):
    def __init__(self, vocab_size, embed_dim, hidden_dim, num_classes):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim)
        self.lstm = nn.LSTM(embed_dim, hidden_dim, batch_first=True, bidirectional=True)
        self.fc = nn.Linear(hidden_dim * 2, num_classes)
    
    def forward(self, x):
        embedded = self.embedding(x)
        output, _ = self.lstm(embedded)
        return self.fc(output[:, -1, :])
```

### 4.2 注意力机制

```python
class Attention(nn.Module):
    def __init__(self, hidden_dim):
        super().__init__()
        self.attn = nn.Linear(hidden_dim, 1)
    
    def forward(self, lstm_output):
        attn_weights = torch.softmax(self.attn(lstm_output), dim=1)
        context = torch.sum(attn_weights * lstm_output, dim=1)
        return context
```

### 4.3 Transformer

> 详见 → [Transformer 架构详解](transformer-architecture.md)

Transformer 是现代 NLP 的基础架构，几乎所有大模型都基于它。

## 五、预训练模型

> 详见 → [NLP 预训练模型](nlp-foundation-models.md)

### 5.1 编码器模型（BERT）

- 双向注意力，理解文本语义
- 适合分类、NER、问答等任务

### 5.2 解码器模型（GPT）

- 因果注意力，生成文本
- 适合对话、写作、代码生成

### 5.3 使用 HuggingFace

```python
from transformers import AutoTokenizer, AutoModelForSequenceClassification

tokenizer = AutoTokenizer.from_pretrained("bert-base-chinese")
model = AutoModelForSequenceClassification.from_pretrained("bert-base-chinese", num_labels=2)

inputs = tokenizer("这部电影真好看", return_tensors="pt")
outputs = model(**inputs)
```

## 六、NLP 应用场景

| 场景 | 任务类型 | 代表技术 |
|------|---------|---------|
| 智能客服 | 意图识别、对话生成 | LLM + RAG |
| 机器翻译 | 序列到序列 | NMT / LLM |
| 信息抽取 | NER、关系抽取 | BERT / LLM |
| 文本摘要 | 生成式摘要 | BART / LLM |
| 搜索引擎 | 语义匹配 | Embedding + 向量检索 |
| 内容审核 | 文本分类 | TextCNN / BERT |
| 语音助手 | ASR + NLU + NLG | Whisper + LLM |

## 七、NLP 发展历程

```
1950s-1980s  规则方法        人工编写语法规则
1980s-2010s  统计方法        HMM、CRF、SVM
2013         Word2Vec       词向量
2017         Transformer    注意力机制
2018         BERT / GPT     预训练模型
2020         GPT-3          大语言模型
2022         ChatGPT        对话式 AI
2023-至今    多模态/Agent    GPT-4V、Claude、Gemini
```

## 八、Python NLP 工具库

| 库 | 用途 | 安装 |
|----|------|------|
| **jieba** | 中文分词 | `pip install jieba` |
| **NLTK** | 经典 NLP 工具包 | `pip install nltk` |
| **spaCy** | 工业级 NLP | `pip install spacy` |
| **HuggingFace** | 预训练模型 | `pip install transformers` |
| **Gensim** | 主题模型、Word2Vec | `pip install gensim` |
| **sentence-transformers** | 句子向量 | `pip install sentence-transformers` |
| **HanLP** | 中文 NLP | `pip install hanlp` |
