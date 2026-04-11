# MCP 协议：AI Agent 工具调用标准

> MCP（Model Context Protocol）是 Anthropic 于 2024 年底发布的开放协议，定义了 AI 模型与外部工具之间的标准通信方式，被誉为"AI 时代的 USB 接口"。

## 一、MCP 是什么

### 1.1 背景问题

在 MCP 之前，每个 AI 应用都需要为每个工具编写专属集成代码：

```
ChatGPT  ──自定义代码──▶  数据库
ChatGPT  ──自定义代码──▶  文件系统
ChatGPT  ──自定义代码──▶  GitHub API
ChatGPT  ──自定义代码──▶  浏览器

Claude   ──自定义代码──▶  数据库
Claude   ──自定义代码──▶  文件系统
...（每个 AI 都要重新实现一遍）
```

**问题**：N 个 AI × M 个工具 = N×M 的集成工作量。

### 1.2 MCP 的解法

MCP 定义了统一的通信协议：

```
任意 AI 模型
     │
   MCP 协议（标准接口）
     │
     ├──▶  MCP Server（数据库）
     ├──▶  MCP Server（文件系统）
     ├──▶  MCP Server（GitHub）
     └──▶  MCP Server（浏览器）
```

**结果**：N 个 AI + M 个工具 = N+M 的工作量，**工具只需写一次**。

### 1.3 核心概念

| 角色 | 说明 | 示例 |
|------|------|------|
| **MCP Host** | 运行 AI 模型的宿主应用 | Claude Desktop、Cursor、Zed |
| **MCP Client** | Host 内部的协议客户端 | 内置于 Host |
| **MCP Server** | 提供工具/资源的服务器 | 文件系统、数据库、API 服务 |

## 二、MCP 提供的三种能力

### 2.1 Tools（工具）

AI 可以调用的函数，类似 Function Calling：

```json
{
  "name": "read_file",
  "description": "读取本地文件内容",
  "inputSchema": {
    "type": "object",
    "properties": {
      "path": { "type": "string", "description": "文件路径" }
    },
    "required": ["path"]
  }
}
```

**调用流程：**
```
用户: "帮我读取 config.json"
  → AI 决定调用 read_file 工具
  → MCP Client 发送请求到 MCP Server
  → Server 执行并返回文件内容
  → AI 基于内容回答用户
```

### 2.2 Resources（资源）

静态或动态数据，AI 可读取但不执行：

```
资源类型：
- 文件（text/binary）
- 数据库查询结果
- API 返回数据
- 实时数据流（SSE）
```

### 2.3 Prompts（提示模板）

预定义的提示模板，用于标准化常见任务：

```json
{
  "name": "code_review",
  "description": "代码审查模板",
  "arguments": [
    { "name": "language", "required": true },
    { "name": "code", "required": true }
  ]
}
```

## 三、通信方式

MCP 支持两种传输方式：

### 3.1 Stdio（标准输入输出）

```
MCP Host  ←──stdin/stdout──→  MCP Server（本地进程）
```

**适合**：本地工具（文件系统、数据库、命令行工具）

```bash
# 配置示例（Claude Desktop config.json）
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allow"]
    }
  }
}
```

### 3.2 SSE（服务器发送事件）

```
MCP Host  ←──HTTP/SSE──→  MCP Server（远程服务）
```

**适合**：远程 API 服务、云端工具

## 四、实现一个 MCP Server

以 Python 为例，实现一个简单的天气查询工具：

```python
# weather_server.py
from mcp.server import Server
from mcp.server.models import InitializationOptions
import mcp.types as types
import httpx

server = Server("weather")

@server.list_tools()
async def handle_list_tools() -> list[types.Tool]:
    return [
        types.Tool(
            name="get_weather",
            description="获取指定城市的当前天气",
            inputSchema={
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "城市名称（英文）"
                    }
                },
                "required": ["city"]
            }
        )
    ]

@server.call_tool()
async def handle_call_tool(name: str, arguments: dict) -> list[types.TextContent]:
    if name == "get_weather":
        city = arguments["city"]
        # 调用天气 API（此处为示例）
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"https://wttr.in/{city}?format=j1"
            )
            data = resp.json()
            temp = data["current_condition"][0]["temp_C"]
            desc = data["current_condition"][0]["weatherDesc"][0]["value"]
        
        return [
            types.TextContent(
                type="text",
                text=f"{city} 当前天气：{desc}，温度 {temp}°C"
            )
        ]
    raise ValueError(f"未知工具: {name}")

# 启动服务器
if __name__ == "__main__":
    import mcp.server.stdio
    import asyncio
    asyncio.run(mcp.server.stdio.run_server(server))
```

**安装依赖并运行：**
```bash
pip install mcp httpx
python weather_server.py
```

## 五、主流 MCP Server 生态

### 官方维护

| Server | 功能 |
|--------|------|
| `@modelcontextprotocol/server-filesystem` | 读写本地文件 |
| `@modelcontextprotocol/server-github` | GitHub 仓库操作 |
| `@modelcontextprotocol/server-google-drive` | Google Drive |
| `@modelcontextprotocol/server-postgres` | PostgreSQL 查询 |
| `@modelcontextprotocol/server-slack` | Slack 消息发送 |

### 社区热门

| Server | 功能 |
|--------|------|
| `mcp-server-sqlite` | SQLite 数据库 |
| `mcp-server-puppeteer` | 浏览器自动化 |
| `mcp-server-fetch` | HTTP 请求 |
| `sequential-thinking` | 结构化推理 |
| `mcp-server-youtube` | YouTube 字幕/搜索 |

## 六、MCP vs Function Calling

| 维度 | Function Calling（OpenAI）| MCP |
|------|--------------------------|-----|
| 标准化 | 各家实现不同 | 开放标准协议 |
| 工具复用 | 需要为每个 AI 重新定义 | 写一次，全平台通用 |
| 部署方式 | 绑定 API 请求 | 独立进程/服务 |
| 生态 | OpenAI 生态内 | 跨平台（Anthropic、OpenAI、开源 LLM 均支持）|
| 资源读取 | 不支持（只有函数调用）| 支持 Resources |
| 提示模板 | 不支持 | 支持 Prompts |

## 七、在 Cursor / Claude Desktop 中使用 MCP

### 配置步骤

1. 找到配置文件位置：
   - **macOS Claude Desktop**：`~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows Claude Desktop**：`%APPDATA%\Claude\claude_desktop_config.json`
   - **Cursor**：`~/.cursor/mcp.json`

2. 添加 Server 配置：
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/yourname/Documents"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your_token_here"
      }
    }
  }
}
```

3. 重启应用，工具自动可用。

## 八、关键链接

- 官方文档：[modelcontextprotocol.io](https://modelcontextprotocol.io)
- Server 列表：[github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)
- Python SDK：`pip install mcp`
- TypeScript SDK：`npm install @modelcontextprotocol/sdk`
