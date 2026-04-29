# AI Agent 实战：从零构建智能助手

> 本篇通过实际案例，教你如何从零构建一个功能完整的 AI Agent。

## 一、项目规划

### 1.1 目标

构建一个**个人编程助手 Agent**，能够：
- 搜索技术文档和解决方案
- 读取和分析本地代码文件
- 执行代码验证
- 生成并写入代码文件
- 自主规划和执行复杂任务

### 1.2 技术选型

```
LLM: GPT-4o / Qwen2.5（根据需求选择）
框架: LangChain + LangGraph
向量数据库: Chroma
工具: 搜索、文件操作、代码执行
```

## 二、基础框架搭建

### 2.1 项目结构

```
ai-agent/
├── agent/
│   ├── __init__.py
│   ├── core.py          # Agent 核心
│   ├── tools.py         # 工具定义
│   ├── prompts.py       # Prompt 管理
│   └── memory.py        # 记忆系统
├── config.py            # 配置
├── main.py              # 入口
└── requirements.txt
```

### 2.2 环境准备

```bash
pip install langchain langchain-openai langchain-community chromadb
pip install langgraph python-dotenv
```

```python
# config.py
import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
DEFAULT_MODEL = "gpt-4o-mini"
MAX_ITERATIONS = 10          # Agent 最大迭代次数
CHROMA_DIR = "./chroma_db"   # 向量数据库路径
```

## 三、工具系统实现

### 3.1 文件操作工具

```python
# agent/tools.py
import os
import subprocess
from langchain.tools import tool

@tool
def read_file(path: str) -> str:
    """读取指定路径的文件内容。
    
    Args:
        path: 文件的绝对或相对路径
    """
    try:
        # 安全检查：限制在项目目录内
        path = os.path.abspath(path)
        if not os.path.exists(path):
            return f"错误：文件不存在 - {path}"
        
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 太长的文件截断
        if len(content) > 10000:
            content = content[:10000] + "\n\n... (文件过长，已截断)"
        
        return content
    except Exception as e:
        return f"读取文件失败：{e}"

@tool
def write_file(path: str, content: str) -> str:
    """将内容写入指定文件。
    
    Args:
        path: 文件路径
        content: 要写入的内容
    """
    try:
        path = os.path.abspath(path)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return f"成功写入 {len(content)} 个字符到 {path}"
    except Exception as e:
        return f"写入文件失败：{e}"

@tool
def list_directory(path: str = ".") -> str:
    """列出目录内容。
    
    Args:
        path: 目录路径，默认当前目录
    """
    try:
        path = os.path.abspath(path)
        if not os.path.isdir(path):
            return f"错误：{path} 不是目录"
        
        items = os.listdir(path)
        result = []
        for item in items:
            full_path = os.path.join(path, item)
            prefix = "📁" if os.path.isdir(full_path) else "📄"
            size = os.path.getsize(full_path)
            result.append(f"  {prefix} {item} ({size} bytes)")
        
        return f"目录 {path}:\n" + "\n".join(result)
    except Exception as e:
        return f"列出目录失败：{e}"
```

### 3.2 代码执行工具

```python
@tool
def execute_python(code: str) -> str:
    """执行 Python 代码并返回结果。
    
    Args:
        code: 要执行的 Python 代码
    """
    try:
        # 在子进程中执行，超时 30 秒
        result = subprocess.run(
            ["python", "-c", code],
            capture_output=True,
            text=True,
            timeout=30
        )
        
        output = ""
        if result.stdout:
            output += result.stdout
        if result.stderr:
            output += f"\n[stderr]: {result.stderr}"
        if result.returncode != 0:
            output += f"\n[退出码]: {result.returncode}"
        
        return output.strip() or "(无输出)"
    except subprocess.TimeoutExpired:
        return "错误：代码执行超时（30秒）"
    except Exception as e:
        return f"执行失败：{e}"

@tool  
def run_command(command: str) -> str:
    """运行 Shell 命令。
    
    Args:
        command: 要执行的命令
    """
    try:
        result = subprocess.run(
            command, shell=True,
            capture_output=True, text=True, timeout=30
        )
        output = result.stdout or ""
        if result.stderr:
            output += f"\n[stderr]: {result.stderr}"
        return output.strip() or "(无输出)"
    except Exception as e:
        return f"命令执行失败：{e}"
```

### 3.3 搜索工具

```python
import requests

@tool
def web_search(query: str) -> str:
    """搜索互联网获取信息。
    
    Args:
        query: 搜索关键词
    """
    try:
        # 使用 DuckDuckGo（免费，无需 API Key）
        url = "https://api.duckduckgo.com/"
        params = {
            "q": query,
            "format": "json",
            "no_html": 1,
            "skip_disambig": 1
        }
        response = requests.get(url, params=params, timeout=10)
        data = response.json()
        
        results = []
        abstract = data.get("Abstract", "")
        if abstract:
            results.append(f"摘要：{abstract}")
        
        related = data.get("RelatedTopics", [])[:5]
        for topic in related:
            if "Text" in topic:
                results.append(f"• {topic['Text']}")
        
        return "\n".join(results) if results else "未找到相关结果"
    except Exception as e:
        return f"搜索失败：{e}"
```

### 3.4 知识库检索工具

```python
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings

# 初始化向量数据库
_embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
_vectorstore = Chroma(persist_directory=CHROMA_DIR, embedding_function=_embeddings)

@tool
def knowledge_search(query: str, top_k: int = 3) -> str:
    """在知识库中搜索相关信息。
    
    Args:
        query: 搜索问题
        top_k: 返回结果数量
    """
    try:
        results = _vectorstore.similarity_search(query, k=top_k)
        if not results:
            return "知识库中未找到相关信息"
        
        output = []
        for i, doc in enumerate(results, 1):
            source = doc.metadata.get("source", "未知")
            output.append(f"[{i}] 来源: {source}\n{doc.page_content[:500]}")
        
        return "\n\n---\n\n".join(output)
    except Exception as e:
        return f"检索失败：{e}"
```

## 四、Agent 核心实现

### 4.1 Prompt 设计

```python
# agent/prompts.py
SYSTEM_PROMPT = """你是一个专业的编程助手 Agent。你的目标是帮助用户完成编程相关任务。

## 你的能力
- 读取和分析代码文件
- 编写和修改代码
- 执行 Python 代码验证
- 搜索技术文档
- 在知识库中检索信息

## 工作原则
1. 先理解需求，再制定计划
2. 编写代码前先分析现有代码
3. 修改代码后用测试验证
4. 遇到错误时分析原因并修复
5. 完成后总结做了什么

## 注意事项
- 不要执行危险命令（rm -rf、格式化等）
- 修改文件前先读取当前内容
- 保持代码风格一致
- 添加适当的注释
"""
```

### 4.2 ReAct Agent

```python
# agent/core.py
from langchain_openai import ChatOpenAI
from langchain.agents import create_react_agent, AgentExecutor
from langchain_core.prompts import PromptTemplate

from .tools import read_file, write_file, list_directory, execute_python, run_command, web_search, knowledge_search

def create_agent(model: str = "gpt-4o-mini", verbose: bool = True):
    """创建编程助手 Agent"""
    
    llm = ChatOpenAI(model=model, temperature=0)
    
    tools = [
        read_file,
        write_file,
        list_directory,
        execute_python,
        run_command,
        web_search,
        knowledge_search
    ]
    
    prompt = PromptTemplate.from_template(
        SYSTEM_PROMPT + """

可用工具：
{tool_names}

工具名称: {tool_names}

请按以下格式回复：

Question: 输入的问题或任务
Thought: 你应该思考什么
Action: 要使用的工具名称
Action Input: 工具的输入参数
Observation: 工具返回的结果
... (可以重复 Thought/Action/Observation 多次)
Thought: 我现在知道最终答案了
Final Answer: 最终答案

开始！

Question: {input}
Thought:{agent_scratchpad}"""
    )
    
    agent = create_react_agent(llm, tools, prompt)
    
    executor = AgentExecutor(
        agent=agent,
        tools=tools,
        verbose=verbose,
        max_iterations=10,
        handle_parsing_errors=True,
        return_intermediate_steps=True
    )
    
    return executor
```

### 4.3 带记忆的 Agent

```python
# agent/memory.py
from langchain.memory import ConversationBufferWindowMemory
from langchain.memory import ConversationSummaryMemory

def create_memory(memory_type: str = "window"):
    """创建记忆系统"""
    
    if memory_type == "window":
        # 滑动窗口记忆：保留最近 K 轮
        return ConversationBufferWindowMemory(
            k=5,
            memory_key="chat_history",
            return_messages=True
        )
    elif memory_type == "summary":
        # 摘要记忆：自动压缩历史
        return ConversationSummaryMemory(
            llm=ChatOpenAI(model="gpt-4o-mini"),
            memory_key="chat_history",
            return_messages=True
        )
```

## 五、实战案例

### 5.1 案例：自动修复 Bug

```python
# main.py
from agent.core import create_agent

agent = create_agent()

# 用户报告：某个函数有 Bug
result = agent.invoke({
    "input": """
    用户报告 utils.py 中的 calculate_discount 函数有 Bug：
    当折扣率超过 100% 时，价格变成负数。
    请：
    1. 读取 utils.py 文件
    2. 找到 Bug
    3. 修复并写入文件
    4. 编写测试验证修复
    """
})

print(result["output"])
```

**Agent 执行过程**：
```
Thought: 我需要先读取 utils.py 文件查看代码
Action: read_file
Action Input: utils.py
Observation: [文件内容]

Thought: 找到 Bug 了，没有对折扣率做上限检查
Action: write_file
Action Input: [修复后的代码]

Thought: 现在写一个测试来验证
Action: write_file
Action Input: test_utils.py [测试代码]

Thought: 运行测试
Action: execute_python
Action Input: python -m pytest test_utils.py
Observation: All tests passed!

Final Answer: Bug 已修复...
```

### 5.2 案例：代码审查

```python
result = agent.invoke({
    "input": """
    请审查 app/api/routes.py 文件的代码质量：
    1. 安全性问题
    2. 性能问题  
    3. 代码规范
    4. 给出改进建议
    """
})
```

### 5.3 案例：项目搭建

```python
result = agent.invoke({
    "input": """
    帮我搭建一个 FastAPI 项目：
    1. 项目名：my-api
    2. 包含用户认证（JWT）
    3. CRUD 接口
    4. 数据库用 SQLite + SQLAlchemy
    5. 编写启动脚本和 README
    """
})
```

## 六、使用 LangGraph 构建复杂 Agent

### 6.1 状态图 Agent

```python
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.sqlite import SqliteSaver

# 带持久化的 Agent
checkpointer = SqliteSaver.from_conn_string("./agent_state.db")

agent = create_react_agent(
    model=ChatOpenAI(model="gpt-4o-mini"),
    tools=tools,
    prompt=SYSTEM_PROMPT,
    checkpointer=checkpointer
)

# 会话式调用
config = {"configurable": {"thread_id": "user-session-1"}}

# 第一轮
result = agent.invoke(
    {"messages": [{"role": "user", "content": "我正在开发一个 Flask 应用"}]},
    config=config
)

# 第二轮（Agent 记得上下文）
result = agent.invoke(
    {"messages": [{"role": "user", "content": "帮我添加一个登录接口"}]},
    config=config
)
```

### 6.2 多 Agent 工作流

```python
from langgraph.graph import StateGraph, START, END
from typing import TypedDict

class ProjectState(TypedDict):
    requirement: str
    plan: str
    code: str
    test_result: str
    final: str

# 规划 Agent
def planner(state):
    result = planning_agent.invoke({"input": f"为以下需求制定开发计划：{state['requirement']}"})
    return {"plan": result["output"]}

# 编码 Agent  
def coder(state):
    result = coding_agent.invoke({"input": f"按以下计划编写代码：{state['plan']}"})
    return {"code": result["output"]}

# 测试 Agent
def tester(state):
    result = testing_agent.invoke({"input": f"测试以下代码：{state['code']}"})
    return {"test_result": result["output"]}

# 构建工作流
graph = StateGraph(ProjectState)
graph.add_node("planner", planner)
graph.add_node("coder", coder)
graph.add_node("tester", tester)

graph.add_edge(START, "planner")
graph.add_edge("planner", "coder")
graph.add_edge("coder", "tester")
graph.add_edge("tester", END)

workflow = graph.compile()

# 执行
result = workflow.invoke({
    "requirement": "实现一个 RESTful API 用户管理模块"
})
```

## 七、部署与优化

### 7.1 API 服务

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="AI Agent API")

class AgentRequest(BaseModel):
    message: str
    session_id: str = "default"

class AgentResponse(BaseModel):
    answer: str
    steps: list

agent = create_agent()

@app.post("/chat", response_model=AgentResponse)
async def chat(request: AgentRequest):
    config = {"configurable": {"thread_id": request.session_id}}
    result = agent.invoke(
        {"messages": [{"role": "user", "content": request.message}]},
        config=config
    )
    return AgentResponse(
        answer=result["output"],
        steps=[step[0].log for step in result.get("intermediate_steps", [])]
    )
```

### 7.2 优化策略

```
1. 成本优化
   - 简单任务用小模型（gpt-4o-mini）
   - 复杂任务用大模型（gpt-4o）
   - 缓存重复查询

2. 速度优化
   - 并行工具调用
   - 流式输出
   - 异步执行

3. 质量优化
   - 优化 Prompt
   - 提供更多示例
   - 加入自我反思机制
```

## 八、完整项目模板

```
requirements.txt:
  langchain>=0.3
  langchain-openai>=0.2
  langchain-community>=0.3
  langgraph>=0.2
  chromadb>=0.5
  fastapi>=0.115
  uvicorn>=0.30
  python-dotenv>=1.0

启动命令:
  uvicorn main:app --reload --port 8000
```
