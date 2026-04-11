# RAG 检索增强生成完全指南

> RAG（Retrieval-Augmented Generation）通过结合外部知识检索和 LLM 生成，解决模型幻觉和知识过时问题。

## 一、为什么需要 RAG

纯 LLM 存在三大痛点：

| 问题 | 说明 | RAG 如何解决 |
|------|------|-------------|
| **幻觉** | 编造不存在的事实 | 从可靠文档中检索事实 |
| **知识过时** | 训练数据有截止日期 | 实时更新文档库 |
| **缺乏私有知识** | 不知道企业内部信息 | 注入私有文档 |

## 二、RAG 基本原理

### 2.1 核心流程

```
用户提问
   │
   ▼
┌──────────┐    ┌──────────────┐    ┌──────────┐
│  Embed   │───▶│  Vector DB   │───▶│ Retrieve │
│ 用户问题  │    │  向量数据库    │    │ 检索文档  │
└──────────┘    └──────────────┘    └──────────┘
                                        │
                                        ▼
                                  ┌──────────┐
                                  │  LLM    │
                                  │ 结合上下文 │
                                  │ 生成回答  │
                                  └──────────┘
```

### 2.2 关键步骤详解

**Step 1: 文档处理**
```
原始文档 → 分块（Chunking）→ 向量化（Embedding）→ 存入向量数据库
```

**Step 2: 检索**
```
用户问题 → 向量化 → 在向量数据库中找最相似的文档块
```

**Step 3: 生成**
```
检索到的文档 + 用户问题 → 组装为 Prompt → LLM 生成回答
```

## 三、文档分块（Chunking）

分块是 RAG 中最关键也最容易被忽视的步骤。

### 3.1 分块策略

| 策略 | 方法 | 适用场景 |
|------|------|---------|
| **固定长度** | 每 N 个字符/Token 切分 | 通用场景 |
| **句子分割** | 按句子边界切分 | 需要保持语义完整 |
| **段落分割** | 按段落/标题切分 | 结构化文档 |
| **语义分割** | 按语义相似度切分 | 长文档 |
| **递归分割** | 先大块再递归细分 | 最推荐的通用方案 |

### 3.2 分块参数

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=512,          # 每块最大字符数
    chunk_overlap=50,        # 块之间重叠字符数（保持上下文）
    separators=["\n\n", "\n", "。", ".", " "],  # 分割优先级
    length_function=len
)

chunks = splitter.split_text(document)
```

**经验值**：
- chunk_size：256-1024（根据文档类型调整）
- chunk_overlap：chunk_size 的 10%-20%
- 结构化文档用 Markdown 标题做分割点

### 3.3 分块质量评估

```
好的分块：
✅ 语义完整（一个想法在一个块里）
✅ 大小适中（不太长也不太短）
✅ 有一定的重叠（避免信息截断）
✅ 保留了结构信息（标题、层级）

差的分块：
❌ 把一句话切成两半
❌ 块太大（超过模型上下文）
❌ 块太小（缺乏上下文）
❌ 无重叠（可能丢失边界信息）
```

## 四、Embedding 向量化

### 4.1 什么是 Embedding

将文本转换为高维向量（如 1536 维），语义相近的文本在向量空间中距离也相近。

```
"猫是宠物"     → [0.12, -0.34, 0.56, ...]  ← 语义相近
"狗是伴侣动物"  → [0.11, -0.31, 0.58, ...]  ← 距离近

"今天下雨了"    → [0.89, 0.23, -0.12, ...]  ← 语义不同，距离远
```

### 4.2 主流 Embedding 模型

| 模型 | 维度 | 特点 | 价格 |
|------|------|------|------|
| **text-embedding-3-small** | 1536 | OpenAI，性价比高 | $0.02/1M tokens |
| **text-embedding-3-large** | 3072 | OpenAI，效果最好 | $0.13/1M tokens |
| **bge-large-zh-v1.5** | 1024 | 中文最优开源 | 免费 |
| **m3e-base** | 768 | 中文开源 | 免费 |
| **gte-large** | 1024 | 阿里，多语言 | 免费 |

```python
# OpenAI Embedding
from openai import OpenAI
client = OpenAI()

response = client.embeddings.create(
    model="text-embedding-3-small",
    input="你的文本内容"
)
embedding = response.data[0].embedding  # [0.0023, -0.0094, ...]
```

```python
# 开源模型（HuggingFace）
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('BAAI/bge-large-zh-v1.5')
embedding = model.encode("你的文本内容")
```

## 五、向量数据库

### 5.1 选型对比

| 数据库 | 特点 | 适用场景 |
|--------|------|---------|
| **Chroma** | 轻量，Python 原生 | 开发/原型 |
| **FAISS** | Meta 开源，极快 | 本地/大规模 |
| **Milvus** | 分布式，功能全 | 生产环境 |
| **Pinecone** | 云服务，免运维 | 快速上线 |
| **Qdrant** | Rust 编写，高性能 | 生产环境 |
| **Weaviate** | 支持混合检索 | 多模态 |

### 5.2 Chroma 快速上手

```python
import chromadb
from chromadb.config import Settings

# 初始化客户端
client = chromadb.PersistentClient(path="./chroma_db")

# 创建集合
collection = client.get_or_create_collection(
    name="my_documents",
    metadata={"hnsw:space": "cosine"}
)

# 添加文档
collection.add(
    documents=["文档1的内容", "文档2的内容"],
    metadatas=[{"source": "doc1.pdf"}, {"source": "doc2.pdf"}],
    ids=["doc1", "doc2"]
)

# 查询
results = collection.query(
    query_texts=["用户的问题"],
    n_results=5
)
```

### 5.3 FAISS 使用

```python
import faiss
import numpy as np

# 创建索引
dimension = 1536  # embedding 维度
index = faiss.IndexFlatL2(dimension)

# 添加向量
index.add(np.array(embeddings).astype('float32'))

# 搜索
distances, indices = index.search(
    np.array([query_embedding]).astype('float32'),
    k=5  # 返回 top 5
)
```

## 六、检索策略

### 6.1 基础检索：向量相似度

```python
results = collection.query(
    query_texts=["如何部署 Redis？"],
    n_results=5
)
```

### 6.2 混合检索（Hybrid Search）

向量检索 + 关键词检索，取并集或加权：

```python
# 向量检索结果
vector_results = vector_search(query, top_k=10)
# 关键词检索结果（BM25）
keyword_results = bm25_search(query, top_k=10)
# 合并去重 + 重排
merged = reciprocal_rank_fusion(vector_results, keyword_results, k=60)
```

### 6.3 重排（Reranking）

用交叉编码器对检索结果重新排序：

```python
from sentence_transformers import CrossEncoder

reranker = CrossEncoder('BAAI/bge-reranker-large')

# 对检索结果重排
pairs = [(query, doc) for doc in retrieved_docs]
scores = reranker.predict(pairs)
reranked = sorted(zip(retrieved_docs, scores), key=lambda x: -x[1])
```

### 6.4 查询改写

```python
# 原始查询可能不清晰，先改写
rewrite_prompt = f"""
请将以下用户问题改写为一个更适合检索的查询：
- 保持核心意图
- 补充隐含关键词
- 使用更精确的术语

原始问题：{user_query}
改写后的查询：
"""
```

## 七、完整 RAG 实现

### 7.1 基于 LangChain 的 RAG

```python
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_openai import ChatOpenAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate

# 1. 加载文档
loader = PyPDFLoader("knowledge_base.pdf")
docs = loader.load()

# 2. 分块
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = splitter.split_documents(docs)

# 3. 向量化 + 存储
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma.from_documents(chunks, embeddings, persist_directory="./db")

# 4. 检索器
retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

# 5. Prompt 模板
system_prompt = """
你是一个知识助手。请根据以下检索到的上下文回答用户问题。
如果上下文中没有相关信息，请说"我没有找到相关信息"，不要编造答案。

上下文：
{context}

用户问题：{input}
"""

prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{input}")
])

# 6. 构建链
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
question_answer_chain = create_stuff_documents_chain(llm, prompt)
rag_chain = create_retrieval_chain(retriever, question_answer_chain)

# 7. 查询
response = rag_chain.invoke({"input": "如何配置 Redis 集群？"})
print(response["answer"])
```

### 7.2 基于 LlamaIndex 的 RAG

```python
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Settings

# 加载文档
documents = SimpleDirectoryReader("./docs").load_data()

# 创建索引
index = VectorStoreIndex.from_documents(documents)

# 查询
query_engine = index.as_query_engine(similarity_top_k=5)
response = query_engine.query("什么是 RAG？")
print(response)
```

## 八、高级 RAG 技巧

### 8.1 多文档检索

```
用户问题 → 判断涉及哪些文档 → 分别检索 → 合并结果
```

### 8.2 父子文档检索

```
父文档（大块）：完整的章节内容
子文档（小块）：用于检索

流程：
1. 用子文档（小块）做精确检索
2. 检索命中后，返回其所属的父文档（大块）给 LLM
→ 兼顾检索精度和上下文完整性
```

### 8.3 摘要索引

对长文档生成摘要，先在摘要中检索，再定位到原文：

```python
# 文档摘要索引
for doc in documents:
    summary = llm.invoke(f"请用3句话总结以下内容：{doc}")
    summary_index.add(summary, metadata={"source": doc.id})

# 检索时
relevant_summaries = summary_index.search(query)
# 再从原文中提取相关段落
```

### 8.4 增量更新

```python
# 添加新文档（无需重建整个索引）
collection.add(
    documents=[new_content],
    metadatas=[{"source": "new_doc.pdf", "date": "2024-01-15"}],
    ids=["new_doc_1"]
)

# 删除过期文档
collection.delete(ids=["old_doc_1"])
```

## 九、评估指标

| 指标 | 说明 | 计算方式 |
|------|------|---------|
| **检索准确率** | 相关文档是否被检索到 | 命中率@K |
| **答案相关性** | 回答是否针对问题 | LLM 评分 / 人工评分 |
| **忠实度** | 回答是否基于检索到的上下文 | LLM 评分 |
| **上下文利用率** | 检索到的上下文是否被有效使用 | 引用覆盖率 |

```python
# 使用 RAGAS 框架评估
from ragas import evaluate
from ragas.metrics import (
    answer_relevancy,
    faithfulness,
    context_precision,
    context_recall
)

result = evaluate(
    dataset=eval_dataset,
    metrics=[answer_relevancy, faithfulness, context_precision, context_recall]
)
```

## 十、常见问题

**Q: 检索不到相关文档怎么办？**
- 优化分块策略（试试不同 chunk_size）
- 使用混合检索（向量 + 关键词）
- 添加查询改写
- 检查 Embedding 模型是否适合你的语言

**Q: 回答质量差怎么办？**
- 提高检索数量（k 值）
- 添加重排（Reranker）
- 优化 Prompt（强调基于上下文回答）
- 使用更强大的 LLM

**Q: 中文 RAG 有什么注意点？**
- 使用中文优化的 Embedding 模型（bge、m3e、gte）
- 中文分块时注意按"。"和"\n"分割
- 考虑使用 jieba 做关键词分词辅助 BM25
