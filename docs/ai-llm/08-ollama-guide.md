# Ollama 本地大模型部署指南

> Ollama 是一个开源的本地大语言模型运行框架，专为在本地机器上便捷部署和运行大型语言模型（LLM）而设计。Ollama 支持多种操作系统，包括 macOS、Windows、Linux 以及通过 Docker 容器运行。

## 一、Ollama 简介

Ollama 是一个开源的大型语言模型（LLM）平台，旨在让用户能够轻松地在本地运行、管理和与大型语言模型进行交互。核心优势：

- **本地运行**：数据不出本地，隐私安全
- **开箱即用**：一条命令下载和运行模型
- **多平台**：支持 Windows、macOS、Linux
- **丰富模型库**：LLaMA、Qwen、DeepSeek、Mistral 等
- **API 兼容**：提供 OpenAI 兼容的 API 接口
- **硬件加速**：支持 GPU（NVIDIA/AMD）和 Apple Silicon

![img](https://www.runoob.com/wp-content/uploads/2025/02/bala-ollama.webp)

## 二、安装

### 2.1 系统要求

| 配置 | 最低要求 | 推荐配置 |
|------|---------|---------|
| CPU | 多核处理器 | 4核或以上 |
| GPU | 可选（运行大模型推荐） | NVIDIA GPU，CUDA 支持，8GB+ VRAM |
| 内存 | 8GB RAM | 16GB+ RAM |
| 硬盘 | 10GB | 50GB+ SSD |
| 系统 | Windows 10+ / macOS / Ubuntu 20.04+ | — |

> 💡 模型大小决定资源需求：7B 模型约需 8GB 内存，13B 约需 16GB，33B 约需 32GB。Ollama 默认使用 4-bit 量化，实际占用会更小（7B 约 4.5GB）。

### 2.2 下载安装包

打开 Ollama 官方下载页面，根据你的操作系统选择对应版本：

> 官方下载地址：https://ollama.com/download

![Ollama 官方下载页面](https://www.runoob.com/wp-content/uploads/2025/02/c8a389a9-0156-4549-9db4-ffdca51b421d.png)

页面会自动识别你的操作系统，也可以手动选择 Windows / macOS / Linux 版本。

### 2.3 Windows 安装

#### 第一步：下载

- 直接下载链接：https://ollama.com/download/OllamaSetup.exe
- 或使用 winget 命令安装：`winget install Ollama.Ollama`

#### 第二步：运行安装程序

双击下载好的 `OllamaSetup.exe`，按照安装向导提示完成安装：

![Windows 安装向导](https://www.runoob.com/wp-content/uploads/2025/02/0__Y21oZ83BrPS7Wei.png)

> 💡 安装程序会自动将 Ollama 添加到系统 PATH，无需手动配置环境变量。

#### 第三步：自定义安装路径（可选）

如果不想安装到 C 盘，可以通过命令行指定目录：

```bash
# 方法一：命令行参数
OllamaSetup.exe /DIR="D:\Tools\Ollama"

# 方法二：通过环境变量修改模型存储位置
# 设置 OLLAMA_MODELS 环境变量可改变模型下载位置
setx OLLAMA_MODELS "D:\OllamaModels"
```

> ⚠️ 默认模型存储路径为 `%USERPROFILE%\.ollama\models`，大模型文件可能占用数十GB空间，建议提前规划。

#### 验证安装

打开 **命令提示符（CMD）** 或 **PowerShell**，输入：

```bash
ollama --version
# ollama version is 0.x.x
```

如果显示版本号，说明安装成功。

### 2.4 macOS 安装

- 下载地址：https://ollama.com/download/Ollama-darwin.zip
- 下载后双击安装包，按提示拖拽到 Applications 即可
- 支持 Apple Silicon（M1/M2/M3/M4）的 Metal 加速

```bash
# 验证安装
ollama --version
```

### 2.5 Linux 安装

Linux 提供一键安装脚本，打开终端执行：

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

安装完成后验证：

```bash
ollama --version
```

### 2.6 Docker 安装

如果你熟悉 Docker，也可以通过容器运行 Ollama：

```bash
# 拉取镜像
docker pull ollama/ollama

# 运行容器（-d 后台运行，-v 持久化模型数据）
docker run -d -v ollama:/root/.ollama -p 11434:11434 ollama/ollama
```

访问 `http://localhost:11434` 即可确认服务已启动。

> 官方 Docker 镜像地址：https://hub.docker.com/r/ollama/ollama

## 三、基本使用

### 3.1 拉取和运行模型

```bash
# 拉取模型（自动下载）
ollama pull qwen2.5:7b

# 运行模型（进入交互式对话）
ollama run qwen2.5:7b

# 单次提问
ollama run qwen2.5:7b "你好，介绍一下你自己"

# 后台运行（API 服务模式）
ollama serve
```

### 3.2 常用模型

| 模型 | 参数量 | 说明 | 命令 |
|------|--------|------|------|
| **Qwen 2.5** | 0.5B-72B | 阿里，中文优秀 | `ollama pull qwen2.5:7b` |
| **DeepSeek-R1** | 1.5B-671B | 推理能力强 | `ollama pull deepseek-r1:8b` |
| **LLaMA 3.1** | 8B-405B | Meta | `ollama pull llama3.1:8b` |
| **Mistral** | 7B | 高效 | `ollama pull mistral:7b` |
| **Gemma 2** | 2B-27B | Google | `ollama pull gemma2:9b` |
| **CodeLlama** | 7B-34B | 代码专用 | `ollama pull codellama:7b` |
| **Phi-3** | 3.8B | 微软，小巧 | `ollama pull phi3:3.8b` |

### 3.3 模型管理命令

```bash
# 查看已安装的模型
ollama list

# 查看模型信息
ollama show qwen2.5:7b

# 删除模型
ollama rm qwen2.5:7b

# 复制模型
ollama cp qwen2.5:7b my-model

# 查看运行中的模型
ollama ps
```

## 四、模型交互

### 4.1 CLI 交互

```bash
ollama run qwen2.5:7b

# 多行输入
>>> 你好
# 你好！有什么我可以帮助你的吗？

>>> /help           # 查看帮助
>>> /set temperature 0.7   # 设置参数
>>> /set num_ctx 4096      # 设置上下文长度
>>> /show info      # 查看模型信息
>>> /bye            # 退出
```

### 4.2 参数控制

```bash
ollama run qwen2.5:7b --temperature 0.3 --num-predict 512
```

| 参数 | 说明 | 默认值 | 推荐范围 |
|------|------|--------|---------|
| `temperature` | 随机性 | 0.8 | 0.1（精确）- 1.0（创意） |
| `top_p` | 核采样 | 0.9 | 0.8-0.95 |
| `top_k` | Top-K 采样 | 40 | 20-50 |
| `num_ctx` | 上下文长度 | 模型默认 | 2048-32768 |
| `num_predict` | 最大生成 Token 数 | 128 | 按需 |
| `repeat_penalty` | 重复惩罚 | 1.1 | 1.0-1.5 |

## 五、API 使用

### 5.1 生成 API

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "qwen2.5:7b",
  "prompt": "什么是机器学习？",
  "stream": false
}'
```

### 5.2 对话 API（Chat）

```bash
curl http://localhost:11434/api/chat -d '{
  "model": "qwen2.5:7b",
  "messages": [
    {"role": "system", "content": "你是一个Python专家"},
    {"role": "user", "content": "解释装饰器的原理"}
  ],
  "stream": false
}'
```

### 5.3 流式输出

```bash
curl http://localhost:11434/api/chat -d '{
  "model": "qwen2.5:7b",
  "messages": [{"role": "user", "content": "你好"}],
  "stream": true
}'
```

### 5.4 OpenAI 兼容 API

Ollama 提供 OpenAI 兼容接口，可直接接入各种工具：

```python
from openai import OpenAI

# 指向 Ollama 本地服务
client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"  # 任意值即可
)

response = client.chat.completions.create(
    model="qwen2.5:7b",
    messages=[{"role": "user", "content": "你好"}],
    stream=True
)

for chunk in response:
    print(chunk.choices[0].delta.content, end="")
```

```bash
# LangChain 接入
# 只需修改 base_url
OLLAMA_BASE_URL = "http://localhost:11434"
```

## 六、Python SDK

### 6.1 安装

```bash
pip install ollama
```

### 6.2 基础用法

```python
import ollama

# 文本生成
response = ollama.generate(model='qwen2.5:7b', prompt='你好！')
print(response['response'])

# 对话
response = ollama.chat(model='qwen2.5:7b', messages=[
    {'role': 'user', 'content': '解释什么是深度学习'}
])
print(response['message']['content'])

# 流式输出
for chunk in ollama.chat(model='qwen2.5:7b', 
                          messages=[{'role': 'user', 'content': '你好'}],
                          stream=True):
    print(chunk['message']['content'], end='', flush=True)
```

### 6.3 自定义模型（Modelfile）

创建自定义模型配置：

```dockerfile
# Modelfile
FROM qwen2.5:7b

# 设置系统提示
SYSTEM """你是一个专业的技术文档翻译，将英文翻译为中文。"""

# 设置参数
PARAMETER temperature 0.3
PARAMETER num_ctx 8192

# 设置模板
TEMPLATE """
{{- if .System }}
{{ .System }}
{{ end }}
{{ .Prompt }}
"""
```

```bash
# 构建模型
ollama create translator -f Modelfile

# 运行自定义模型
ollama run translator "Hello, world!"
```

### 6.4 拉取进度回调

```python
import ollama

# 带进度显示的拉取
for progress in ollama.pull('qwen2.5:7b', stream=True):
    print(f"{progress['status']}: {progress.get('digest', '')[:12]}")
```

## 七、Web UI 管理界面

### 7.1 Open WebUI

```bash
# Docker 一键部署
docker run -d -p 3000:8080 \
  --add-host=host.docker.internal:host-gateway \
  -v open-webui:/app/backend/data \
  --name open-webui \
  ghcr.io/open-webui/open-webui:main
```

功能：
- 类似 ChatGPT 的对话界面
- 支持多模型切换
- 对话历史管理
- 文档上传和 RAG
- 多用户支持

### 7.2 Page Assist（浏览器插件）

- 安装 Chrome 插件
- 选中网页文字直接调用本地模型
- 支持总结、翻译、解释等

## 八、高级用法

### 8.1 并发运行多个模型

```bash
# 后台运行模型A
OLLAMA_NUM_PARALLEL=2 ollama serve

# 不同的 API 调用可以使用不同模型
```

### 8.2 GPU 加速

```bash
# 指定 GPU
CUDA_VISIBLE_DEVICES=0 ollama serve

# 设置 GPU 内存
OLLAMA_GPU_OVERHEAD=0 ollama serve
```

### 8.3 量化模型节省内存

Ollama 自动使用量化模型（4-bit），大幅降低内存需求：

| 模型 | FP16 内存 | 4-bit 量化内存 |
|------|----------|--------------|
| 7B | ~14GB | ~4.5GB |
| 13B | ~26GB | ~8GB |
| 34B | ~68GB | ~20GB |

### 8.4 与其他工具集成

```python
# Dify 接入
# Dify 设置 → 模型供应商 → Ollama → 填入 http://localhost:11434

# Continue（VS Code 插件）
# ~/.continue/config.json
{
  "models": [{
    "title": "Qwen 2.5",
    "provider": "ollama",
    "model": "qwen2.5:7b"
  }]
}
```

## 九、常见问题

**Q: 运行模型很慢怎么办？**
- 检查是否使用了 GPU：`ollama ps`
- 降低模型大小（7B → 3B）
- 增加系统内存
- 使用量化版本（`:q4` 后缀）

**Q: 下载模型太慢？**
```bash
# 设置镜像源
export OLLAMA_HOST=0.0.0.0:11434

# 或手动下载 GGUF 文件
# ollama create mymodel -f Modelfile
```

**Q: 如何设置 API 服务对外开放？**
```bash
# 监听所有地址
OLLAMA_HOST=0.0.0.0 ollama serve

# 生产环境建议配合 Nginx 反向代理 + 认证
```

**Q: 适合什么场景？**
- ✅ 个人学习、本地开发测试
- ✅ 数据敏感的企业内部应用
- ✅ 离线环境下的 AI 应用
- ❌ 大规模高并发在线服务
