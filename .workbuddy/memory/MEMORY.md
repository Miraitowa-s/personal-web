# MEMORY.md — 长期记忆

## 项目信息
- 项目：个人网站（d:/code/Personal Web）
- 技术栈：纯手写 HTML/CSS/JS，无框架
- 主要页面：index.html、works.html、tools.html、knowledge.html

## 用户信息
- 称呼：格雷西
- 城市：不想说
- 风格：直接进入任务，不喜欢被问私人问题

## 助手身份
- 名字：棉花 🐑

## works.html 结构
- 摄影相册通过 JS galleries 对象管理，openGallery(key) 打开弹窗
- 私人相册有密码保护（前端密码，仅供个人使用）
- 照片文件放在 photos/ 目录，按分类子文件夹存储

## knowledge.html 结构
- 侧边栏目录由 server.js 自动扫描 docs/ 目录生成（无需 _sidebar.json）
- 文章从 docs/{cat}/{file}.md 路径 fetch 渲染（marked.js）
- 支持标题搜索过滤、字数/阅读时间、返回顶部、移动端侧边栏
- 新增笔记：在 docs/{分类}/ 放 .md 文件，重启 server 即可

## 知识库分类（docs/）—— 2026-04-09 重构为8分类，54篇文章（含多媒体与修复）
- ai-llm/：🤖 AI 与大模型（8篇）— 学习路径导读、Transformer、深度学习、LLM、Prompt工程、RAG、Ollama、**微调实战指南**
- ai-agent/：🦾 AI Agent 开发（6篇）— Agent基础/实战、LangChain、NLP、预训练模型、MCP协议
- data-science/：📊 数据科学（6篇）— 学习指南、机器学习、Sklearn、NumPy、Pandas、数据可视化
- frontend/：🌐 前端开发（11篇）— 全览导读、HTML5、CSS3、JS、CSS布局、TS、Vue3、React、Next.js、性能优化实战、**测试框架完全指南**
- backend-eng/：⚙️ 后端&工程（11篇）— 技术导读、Python3基础/进阶、MySQL、SQL、MongoDB、Git、HTTP、TCP/IP、网络基础、API设计最佳实践（含视频）
- guitar/：🎸 吉他（4篇）— 基础和弦（含示意图）、乐理、指弹、练习方法
- photography/：📸 摄影（6篇）— 曝光三角、构图（含对比图）、街拍、Lightroom、装备选购、**后期实战工作流**
- diy/：🛠 手工&DIY（3篇）— 工具入门指南（含视频）、木工基础、README指南

## 重要修复与改进（2026-04-09）
1. **图片显示问题已修复**：将所有引用不存在的图片文件替换为CSS可视化占位图
2. **视频内容问题已修复**：检查视频文件路径，提供视频制作建议和占位说明
3. **返回首页操作流程**：在docs/README.md中添加明确的4种返回网站首页方法
4. **内容缺口填补**：新增3篇深度技术文章填补之前分析的知识缺口
5. **知识库使用指南**：完善docs/README.md，包含多媒体内容管理和学习建议

## 工具库重构与改进（2026-04-10）
1. **知识库直达入口**：在works.html和tools.html导航栏均新增"知识库"链接，便于快速访问
2. **失效链接修复**：
   - 爱奇艺看图：irfanview.net → photo.iqiyi.com
   - Ditto：错误的sourceforge地址 → ditto-cp.com
   - Screenpresso：错误域名 → screenpresso.com
   - PotPlayer：daum.net → potplayer.tv
3. **分类结构简化**：13个合并为6个大类：
   - AI与智能工具（大模型、效率工具、智能系统）
   - 媒体与创作（视频工具、摄影资源、创作平台）
   - 学习与知识（书籍资源、学习平台、灵感发现）
   - 设计与艺术（设计工具、摄影资源）
   - 音乐与乐器
   - DIY与手工
4. **视觉设计升级**：新增大分类卡片设计、子分类网格布局、折叠/展开功能
5. **JavaScript功能增强**：支持分类折叠/展开、显示全部工具功能
6. **概述区域添加**：在tools.html的hero部分下新增4个概述卡片，展示工具库的核心特点和价值：
   - 精心分类：涵盖6大领域，详细子分类
   - 快速搜索：支持关键词搜索和快捷键
   - 持续更新：保持内容新鲜度和实用性
   - 实用导向：每个工具都经过筛选确保实用性
7. **样式全面统一**（2026-04-10晚）：将tools.html完全替换为tools-new-version.html的样式，使用index.html的`.tcard`卡片设计，实现全站样式统一。移除了复杂的分类折叠和子分类网格布局，改为简单的`.section-title` + `.tool-grid`结构，保留所有工具内容和搜索功能。

## 已做操作记录
- 2026-03-28：将 photos/private/private2.png ~ private6.jpg 添加进 works.html 的 private 相册数据中（共6张）
- 2026-03-28：改造 knowledge.html 为飞书风格，自动从 /api/docs 读取目录树（无需 _sidebar.json）
- 2026-03-28：新增 server.js（Node.js 本地服务，自动扫描 docs/ 目录）和 start.bat（一键启动）
- 2026-03-28：修复 knowledge.html 右上角"← 主页"按钮被 32px 宽度截断的问题
- 2026-03-28：修复 marked.js CDN 加载失败（改为固定版本 + unpkg 备用）；优化左侧文章条目样式（单行截断+hover tooltip）
- 2026-03-29：知识库加速优化（server.js 内存缓存+fs.watch、knowledge.html sessionStorage 缓存）
- 2026-03-29：knowledge.html 界面全面改造为语雀/飞书文档风格：橙色主题(#e8632a)、白底、侧边栏平铺+左边框高亮、h2橙色左边框、h3橙色竖线、代码块浅灰底+语言标签、顶部动态面包屑
- 2026-03-29：知识库大纲+拖拽+样式补全：点开文章展示 h2/h3 大纲可跳转；分类/文章可拖拽排序持久化；h1加底部线；h3加前置小圆点
