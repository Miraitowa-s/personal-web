# LangChain 开发指南

> LangChain 是构建 LLM 应用的主流框架，提供模块化组件和预构建链。

## 一、LangChain 简介

LangChain 是一个用于开发 LLM 驱动应用的开源框架，提供：

- **模型抽象**：统一接口访问不同 LLM
- **链式调用**：将多个操作串联
- **Agent**：构建自主智能体
- **RAG**：检索增强生成
- **工具集成**：丰富的第三方工具

## 二、核心概念

### 2.1 模块架构

```
LangChain
├── langchain-core       # 核心抽象接口
├── langchain-community  # 第三方集成
├── langchain-openai     # OpenAI 集成
├── langchain-anthropic  # Anthropic 集成
├── langchain            # 链、Agent 等高级功能
└── langgraph            # 多 Agent 编排框架
```

### 2.2 安装

```bash
pip install langchain langchain-openai langchain-community
pip install langchain-chroma  # 向量数据库集成
```

## 三、模型调用

### 3.1 Chat Models（推荐）

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.7,
    max_tokens=2000
)

# 简单调用
response = llm.invoke("什么是机器学习？")

# 带消息历史
from langchain_core.messages import HumanMessage, SystemMessage

messages = [
    SystemMessage(content="你是一位Python专家"),
    HumanMessage(content="解释装饰器的原理")
]
response = llm.invoke(messages)
```

### 3.2 Prompt 模板

```python
from langchain_core.prompts import ChatPromptTemplate

# 创建模板
prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一位{role}，用{style}风格回答问题。"),
    ("human", "{question}")
])

# 使用模板
chain = prompt | llm
response = chain.invoke({
    "role": "资深前端工程师",
    "style": "通俗易懂",
    "question": "什么是虚拟DOM？"
})
```

### 3.3 输出解析

```python
from langchain_core.output_parsers import JsonOutputParser, StrOutputParser

# JSON 输出
parser = JsonOutputParser()
chain = prompt | llm | parser
result = chain.invoke({"question": "列出3种排序算法"})

# 带结构化提示
from pydantic import BaseModel, Field

class Algorithm(BaseModel):
    name: str = Field(description="算法名称")
    time_complexity: str = Field(description="时间复杂度")
    description: str = Field(description="简要描述")

parser = JsonOutputParser(pydantic_object=Algorithm)
```

## 四、链式调用（Chains）

### 4.1 LCEL（LangChain Expression Language）

使用 `|` 管道符连接组件：

```python
from langchain_core.output_parsers import StrOutputParser

# 简单链：Prompt → LLM → 解析器
chain = prompt | llm | StrOutputParser()
result = chain.invoke({"question": "什么是 RAG？"})

# 并行链
from langchain_core.runnables import RunnableParallel

analysis_chain = prompt | llm | StrOutputParser()
summary_chain = summary_prompt | llm | StrOutputParser()

parallel_chain = RunnableParallel(
    analysis=analysis_chain,
    summary=summary_chain
)
results = parallel_chain.invoke({"text": "..."})
```

### 4.2 Runnable 接口

所有链都实现了 Runnable 接口：

```python
# 同步调用
result = chain.invoke({"input": "..."})

# 异步调用
result = await chain.ainvoke({"input": "..."})

# 流式输出
for chunk in chain.stream({"input": "..."}):
    print(chunk, end="")

# 批量调用
results = chain.batch([{"input": "..."}, {"input": "..."}])

# 组合链
final_chain = chain1 | chain2 | chain3
```

### 4.3 带记忆的链

```python
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

# 带历史消息的 Prompt
prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一个有帮助的助手"),
    MessagesPlaceholder("history"),  # 动态插入历史消息
    ("human", "{input}")
])

# 简单的历史管理
from langchain_core.chat_history import InMemoryChatMessageHistory

history = InMemoryChatMessageHistory()

def chat(input_text):
    history.add_message(HumanMessage(content=input_text))
    response = chain.invoke({"input": input_text, "history": history.messages})
    history.add_message(AIMessage(content=response.content))
    return response.content
```

## 五、RAG 实现

### 5.1 完整 RAG 管道

```python
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_openai import ChatOpenAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate

# 1. 加载文档
loader = DirectoryLoader("./docs", glob="**/*.md")
documents = loader.load()

# 2. 分块
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)
chunks = text_splitter.split_documents(documents)

# 3. 向量化存储
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./chroma_db"
)

# 4. 创建检索链
retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

system_prompt = """根据以下上下文回答问题。如果上下文中没有相关信息，请说"未找到相关信息"。

上下文：
{context}
"""

prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{input}")
])

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
question_answer_chain = create_stuff_documents_chain(llm, prompt)
rag_chain = create_retrieval_chain(retriever, question_answer_chain)

# 5. 查询
response = rag_chain.invoke({"input": "什么是 RAG？"})
print(response["answer"])
```

### 5.2 带源的 RAG

```python
from langchain.chains import create_retrieval_chain

rag_chain = create_retrieval_chain(retriever, question_answer_chain)

response = rag_chain.invoke({"input": "如何使用 Python？"})

# 带来源引用
for doc in response["context"]:
    print(f"来源: {doc.metadata['source']}")
    print(f"内容: {doc.page_content[:100]}...\n")
```

## 六、Agent 开发

### 6.1 Tool 定义

```python
from langchain.tools import tool

@tool
def search_web(query: str) -> str:
    """搜索互联网获取信息。输入搜索关键词。"""
    # 实际实现中调用搜索 API
    return f"搜索结果：{query} 的相关信息..."

@tool
def calculator(expression: str) -> str:
    """计算数学表达式。输入合法的数学表达式。"""
    try:
        result = eval(expression)
        return str(result)
    except Exception as e:
        return f"计算错误：{e}"

@tool
def read_file(path: str) -> str:
    """读取文件内容。输入文件路径。"""
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

tools = [search_web, calculator, read_file]
```

### 6.2 ReAct Agent

```python
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent

llm = ChatOpenAI(model="gpt-4o-mini")

agent = create_react_agent(
    model=llm,
    tools=tools,
    prompt="你是一个有用的助手，可以使用工具帮助用户。"
)

# 执行任务
result = agent.invoke({
    "messages": [{"role": "user", "content": "帮我计算 123 * 456，然后搜索这个数字的含义"}]
})

for msg in result["messages"]:
    print(f"{msg.type}: {msg.content}")
```

### 6.3 LangGraph 多步 Agent

```python
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver

# 带记忆的 Agent
memory = MemorySaver()
agent = create_react_agent(
    model=llm,
    tools=tools,
    checkpointer=memory
)

# 带历史的多轮对话
config = {"configurable": {"thread_id": "session-1"}}

result = agent.invoke(
    {"messages": [{"role": "user", "content": "我叫小明"}]},
    config=config
)

result = agent.invoke(
    {"messages": [{"role": "user", "content": "我叫什么名字？"}]},
    config=config
)
# Agent 能记住上一轮的对话
```

## 七、LangGraph 进阶

### 7.1 自定义工作流

```python
from langgraph.graph import StateGraph, START, END
from typing import TypedDict, Annotated

# 定义状态
class AgentState(TypedDict):
    input: str
    plan: list[str]
    current_step: int
    results: list[str]
    final_answer: str

# 定义节点函数
def planner(state: AgentState):
    """规划任务"""
    plan = llm.invoke(f"将任务分解为步骤：{state['input']}")
    return {"plan": plan, "current_step": 0}

def executor(state: AgentState):
    """执行当前步骤"""
    step = state["plan"][state["current_step"]]
    result = execute_step(step)
    return {"results": state["results"] + [result], "current_step": state["current_step"] + 1}

def router(state: AgentState):
    """判断是否完成所有步骤"""
    if state["current_step"] >= len(state["plan"]):
        return "end"
    return "continue"

# 构建图
graph = StateGraph(AgentState)
graph.add_node("planner", planner)
graph.add_node("executor", executor)
graph.add_conditional_edges("executor", router, {"continue": "executor", "end": "summarizer"})
graph.add_edge(START, "planner")
graph.add_edge("planner", "executor")

agent = graph.compile()
```

### 7.2 多 Agent 协作

```python
from langgraph.prebuilt import create_react_agent

# 创建不同角色的 Agent
researcher = create_react_agent(
    model=llm,
    tools=[search_web, read_file],
    prompt="你是一个研究员，负责搜集和分析信息。"
)

coder = create_react_agent(
    model=llm,
    tools=[code_executor, write_file],
    prompt="你是一个程序员，负责编写代码。"
)

reviewer = create_react_agent(
    model=llm,
    tools=[read_file],
    prompt="你是一个代码审查员，负责检查代码质量。"
)

# 串联工作流
def research_and_code(state):
    # 研究员搜集信息
    research = researcher.invoke({"messages": [{"role": "user", "content": f"研究{state['task']}的技术方案"}]})
    # 程序员编写代码
    code = coder.invoke({"messages": [{"role": "user", "content": f"根据以下研究结果编写代码：{research}"}]})
    # 审查员检查代码
    review = reviewer.invoke({"messages": [{"role": "user", "content": f"审查以下代码：{code}"}]})
    return review
```

## 八、最佳实践

### 8.1 Prompt 设计

```python
# ✅ 好的系统提示
SYSTEM_PROMPT = """
你是一个专业的知识问答助手。请遵循以下规则：

1. 只基于提供的上下文回答问题
2. 如果上下文中没有相关信息，诚实告知
3. 引用来源时标注出处
4. 回答结构化，使用列表和标题
5. 语言简洁专业
"""

# ❌ 不好的提示
BAD_PROMPT = "你是一个助手"
```

### 8.2 错误处理

```python
from langchain_core.runnables import RunnableWithFallbacks

# 设置备用方案
chain_with_fallback = (
    primary_chain
    .with_fallbacks([backup_chain])
    .with_retry(stop_after_attempt=3)
)
```

### 8.3 性能优化

```python
# 流式输出（用户体验更好）
for chunk in chain.stream({"input": question}):
    print(chunk, end="", flush=True)

# 异步调用（提高吞吐量）
results = await chain.abatch([q1, q2, q3])

# 缓存（避免重复计算）
from langchain_core.caches import InMemoryCache
llm.cache = InMemoryCache()
```

### 8.4 调试与监控

```python
# 开启详细日志
import langchain
langchain.debug = True

# 使用 LangSmith 追踪
import os
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "your-key"
```

## 九、常用集成

| 集成 | 用途 |
|------|------|
| **langchain-openai** | OpenAI GPT 模型 |
| **langchain-anthropic** | Claude 模型 |
| **langchain-chroma** | Chroma 向量数据库 |
| **langchain-community** | 丰富的第三方工具集成 |
| **langgraph** | Agent 编排 |
| **langsmith** | 调试和评估 |

## 十、常见问题

**Q: LangChain 版本怎么选？**
- `langchain-core`：轻量，只含核心抽象
- `langchain`：完整功能，含链和 Agent
- `langgraph`：复杂 Agent 编排，推荐新项目使用

**Q: LangChain vs LlamaIndex？**
- LangChain：通用框架，适合各种 LLM 应用
- LlamaIndex：专注 RAG，数据索引更强

**Q: 如何降低成本？**
- 使用小模型（gpt-4o-mini 替代 gpt-4o）
- 缓存重复查询
- 流式输出减少等待
- 精简 Prompt 长度
