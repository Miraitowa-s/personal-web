# AI Agent 基础概念

> AI Agent（人工智能智能体）是能够自主感知环境、做出决策并执行行动以完成目标的 AI 系统。

## 一、什么是 AI Agent

### 1.1 定义

AI Agent = **感知** + **思考** + **行动** + **记忆**

```
┌─────────────────────────────────────────┐
│              AI Agent                     │
│                                          │
│  ┌──────────┐   ┌──────────┐            │
│  │  感知     │──▶│  思考     │            │
│  │ Perception│   │ Reasoning │            │
│  └──────────┘   └────┬─────┘            │
│                       │                  │
│  ┌──────────┐   ┌────▼─────┐            │
│  │  记忆     │◀──│  行动     │            │
│  │  Memory  │   │  Action   │            │
│  └──────────┘   └──────────┘            │
│                                          │
│  外部工具：搜索 / 代码执行 / API / 浏览器  │
└─────────────────────────────────────────┘
```

### 1.2 Agent vs 传统 AI

| 维度 | 传统 AI（Chatbot） | AI Agent |
|------|-------------------|----------|
| 交互模式 | 一问一答 | 自主循环 |
| 目标 | 回答问题 | 完成任务 |
| 工具使用 | 无 | 可调用外部工具 |
| 记忆 | 仅当前对话 | 长期 + 短期记忆 |
| 规划能力 | 无 | 可分解复杂任务 |
| 自主性 | 被动响应 | 主动执行 |

### 1.3 Agent 核心能力

```
1. 🧠 规划（Planning）
   - 将复杂目标分解为子任务
   - 制定执行计划
   - 动态调整策略

2. 🔧 工具使用（Tool Use）
   - 调用搜索引擎获取信息
   - 执行代码进行计算
   - 操作文件系统
   - 调用外部 API

3. 💾 记忆（Memory）
   - 短期记忆：当前上下文
   - 长期记忆：跨会话知识存储
   - 向量记忆：语义检索

4. 🔄 自我反思（Self-Reflection）
   - 评估执行结果
   - 发现错误并纠正
   - 优化策略

5. 🌐 环境交互（Environment Interaction）
   - 理解当前状态
   - 观察行动结果
   - 根据反馈调整
```

## 二、Agent 架构模式

### 2.1 ReAct 模式

最经典的 Agent 架构，交替进行推理和行动：

```
循环开始
  ├─ Thought: 分析当前状况，规划下一步
  ├─ Action: 选择并执行一个工具
  ├─ Observation: 观察工具返回的结果
  └─ 判断：任务完成？→ 结束 / 继续循环
```

**示例**：
```
Thought: 用户想查北京今天的天气，我需要使用天气API
Action: weather_api(city="北京")
Observation: 北京今天：晴，温度 15-25°C，北风3级

Thought: 我已经获得了天气信息，可以回答用户了
Action: 返回"北京今天晴，温度15-25°C，北风3级"
```

### 2.2 Plan-and-Execute 模式

先生成完整计划，再逐步执行：

```
第一步：规划器（Planner）
  "用户需求：搭建一个Web应用
   计划：
   1. 确认技术栈
   2. 初始化项目
   3. 编写前端页面
   4. 编写后端API
   5. 测试部署"

第二步：执行器（Executor）
  按计划逐步执行，每步完成后更新进度

第三步：重新规划（Replanner）
  如果某步失败，重新规划后续步骤
```

### 2.3 多 Agent 协作

多个 Agent 各司其职，协同完成任务：

```
┌─────────┐    ┌─────────┐    ┌─────────┐
│ 规划Agent │───▶│ 编码Agent │───▶│ 测试Agent │
│ Planner  │    │ Coder   │    │ Tester  │
└─────────┘    └─────────┘    └─────────┘
                      │               │
                      ▼               ▼
                ┌─────────┐    ┌─────────┐
                │ 审查Agent │◀───│ 文档Agent │
                │ Reviewer │    │ Writer  │
                └─────────┘    └─────────┘
```

**常见模式**：
- **主从模式**：一个主管 Agent 分配任务给多个执行 Agent
- **流水线**：Agent 按顺序传递工作成果
- **辩论模式**：多个 Agent 提出方案，互相质疑
- **层级模式**：上下级 Agent，逐级分解任务

## 三、工具使用（Tool Use）

### 3.1 工具定义

Agent 能使用的工具需要明确描述：

```python
# 工具定义示例
tools = [
    {
        "name": "web_search",
        "description": "搜索互联网获取最新信息",
        "parameters": {
            "query": {"type": "string", "description": "搜索关键词"},
            "num_results": {"type": "integer", "description": "返回结果数量"}
        }
    },
    {
        "name": "code_executor",
        "description": "执行Python代码并返回结果",
        "parameters": {
            "code": {"type": "string", "description": "Python代码"}
        }
    },
    {
        "name": "file_reader",
        "description": "读取指定路径的文件内容",
        "parameters": {
            "path": {"type": "string", "description": "文件路径"}
        }
    }
]
```

### 3.2 工具调用流程

```
1. LLM 分析用户请求
2. LLM 决定需要调用哪个工具（Function Calling）
3. LLM 生成工具调用参数（JSON格式）
4. 系统执行工具，返回结果
5. LLM 根据工具结果继续推理
6. 可能继续调用其他工具，直到任务完成
```

### 3.3 Function Calling

现代 LLM 原生支持工具调用：

```python
from openai import OpenAI
client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "北京今天天气怎么样？"}],
    tools=[{
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "获取指定城市的天气信息",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {"type": "string", "description": "城市名"}
                },
                "required": ["city"]
            }
        }
    }]
)

# 模型决定调用工具
tool_call = response.choices[0].message.tool_calls[0]
# function.name = "get_weather"
# function.arguments = '{"city": "北京"}'
```

## 四、Agent 记忆系统

### 4.1 记忆分类

```
Agent 记忆
├── 短期记忆（Working Memory）
│   └── 当前对话上下文 + 最近几轮交互
├── 长期记忆（Long-term Memory）
│   └── 跨会话持久化知识
├── 情景记忆（Episodic Memory）
│   └── 过去的经历和事件
└── 语义记忆（Semantic Memory）
    └── 事实和概念知识
```

### 4.2 记忆实现方式

```python
# 短期记忆：对话历史窗口
conversation_history = [
    {"role": "user", "content": "..."},
    {"role": "assistant", "content": "..."},
    # 保留最近 N 轮对话
]

# 长期记忆：向量数据库
# 将重要信息向量化存储，需要时检索
memory_store.add("用户偏好使用 Python 和 React")

# 文件记忆：写入本地文件
import json
with open("agent_memory.json", "w") as f:
    json.dump({"learned_facts": [...], "user_preferences": [...]}, f)
```

### 4.3 记忆管理策略

| 策略 | 说明 | 适用场景 |
|------|------|---------|
| **滑动窗口** | 保留最近 N 轮对话 | 简单任务 |
| **摘要压缩** | 定期总结历史对话 | 长对话 |
| **向量检索** | 语义相关时提取历史信息 | 复杂任务 |
| **重要性衰减** | 最近的信息权重更高 | 通用 |

## 五、Agent 规划能力

### 5.1 任务分解

将复杂目标分解为可执行的子任务：

```
目标：搭建个人博客
├── 子任务1：选择技术栈（Hugo / Hexo / WordPress）
├── 子任务2：安装和配置
├── 子任务3：设计主题
├── 子任务4：编写内容
└── 子任务5：部署上线
```

### 5.2 反思与纠正

```python
reflection_prompt = """
你刚刚执行了一个操作，请反思：

执行的操作：{action}
观察到的结果：{observation}
期望的结果：{expected}

请判断：
1. 操作是否成功？
2. 如果失败，失败原因是什么？
3. 下一步应该怎么做？（尝试修复 / 尝试替代方案 / 放弃并报告）
"""
```

### 5.3 错误处理

Agent 必须具备的错误处理能力：

```
1. 工具调用失败 → 重试 / 尝试替代工具
2. LLM 输出格式错误 → 重新格式化 / 使用备用解析
3. 网络超时 → 指数退避重试
4. 权限不足 → 报告错误，请求用户授权
5. 任务无法完成 → 诚实报告，建议替代方案
```

## 六、Agent 安全与约束

### 6.1 安全原则

```
1. 人类在环（Human-in-the-Loop）
   - 危险操作前请求确认
   - 关键决策由人类审核

2. 权限最小化
   - 只给 Agent 必要的权限
   - 限制可访问的资源范围

3. 可观测性
   - 记录 Agent 的所有决策和行动
   - 可追溯、可审计

4. 沙箱执行
   - 代码在隔离环境中执行
   - 文件操作限定在特定目录
```

### 6.2 常见风险

| 风险 | 说明 | 缓解措施 |
|------|------|---------|
| **过度执行** | Agent 自作主张做了不该做的事 | 设置操作白名单 |
| **无限循环** | Agent 陷入重复操作 | 设置最大步数限制 |
| **信息泄露** | Agent 泄露敏感信息 | 输入/输出过滤 |
| **工具滥用** | Agent 滥用工具权限 | 最小权限原则 |

## 七、Agent 评估

### 7.1 评估维度

- **任务完成率**：能否成功完成任务
- **效率**：用了多少步骤/时间/Token
- **准确性**：结果是否正确
- **鲁棒性**：遇到错误能否恢复
- **安全性**：是否有不当行为

### 7.2 评估框架

```
1. 单元测试：测试单个工具和组件
2. 集成测试：测试 Agent 的完整工作流
3. 端到端测试：给真实任务，评估最终结果
4. 回归测试：确保修改不引入新问题
```

## 八、Agent vs RAG vs Fine-tuning

| 维度 | RAG | Fine-tuning | Agent |
|------|-----|-------------|-------|
| 核心能力 | 检索+生成 | 领域适应 | 自主行动 |
| 知识更新 | 实时 | 需重新训练 | 通过工具获取 |
| 动态操作 | 不能 | 不能 | 可以 |
| 复杂度 | 低 | 中 | 高 |
| 适用场景 | 知识问答 | 风格/格式适配 | 自动化任务 |

> 实际应用中，这三者经常组合使用：Agent + RAG + Fine-tuning = 最强组合

---

## 九、专业术语速查

| 术语 | 解释 |
|------|------|
| **智能体（Agent）** | 能自主感知环境并采取行动以完成目标的 AI 系统，不只是回答问题，而是真的"干活" |
| **ReAct** | 推理（Reasoning）+ 行动（Acting）的交替循环，目前最经典的 Agent 执行模式 |
| **思维链（CoT, Chain-of-Thought）** | 让模型一步步推理而不是直接给答案，能显著提升复杂任务的准确率 |
| **Function Calling** | LLM 原生支持的工具调用能力，模型可以决定调用哪个函数并生成调用参数 |
| **工具（Tool）** | Agent 可以使用的外部能力，如搜索引擎、代码执行器、API 接口、文件系统等 |
| **Orchestrator** | 编排器，负责协调多个 Agent 或工具的主控程序 |
| **Human-in-the-Loop** | 人类在环，在 Agent 执行关键或危险操作前，需要人类确认 |
| **Memory（记忆）** | Agent 存储和检索信息的能力，分短期（当前对话）和长期（跨会话持久化） |
| **上下文（Context）** | Agent 当前"看到的"所有信息，包括对话历史、工具结果、用户指令等 |
| **多 Agent（Multi-Agent）** | 多个专职 Agent 协同工作，各司其职，比单个通用 Agent 效率更高 |
| **沙箱（Sandbox）** | 隔离的代码执行环境，防止 Agent 运行的代码影响宿主机器 |
| **幻觉（Hallucination）** | 模型编造不存在的工具调用参数或事实，Agent 场景下后果尤其严重 |
| **Token 窗口** | Agent 能"记住"的信息上限，超出后早期信息会被截断遗忘 |
| **LangChain** | 最流行的 Agent/LLM 应用开发框架，提供工具链、记忆、Agent 模板等封装 |
| **MCP（Model Context Protocol）** | Anthropic 提出的工具调用标准协议，让 AI 工具调用更规范统一 |
