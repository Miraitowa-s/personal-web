# 个人网站项目记录

> 最后更新：2026-04-10
> 助手：棉花 🐑

---

## 一、项目概况

| 项目 | 说明 |
|------|------|
| 路径 | `d:/code/Personal Web` |
| 技术栈 | 纯手写 HTML / CSS / JS，无框架 |
| 本地服务 | `node server.js`（或双击 `start.bat`），访问 `http://localhost:3000` |
| 托管目标 | Cloudflare Pages（静态），直接 git push 部署 |

### 页面结构

```
index.html      主页（个人介绍 + 导航）
works.html      作品展示（摄影相册）
tools.html      工具库（收藏工具/网站导航）
knowledge.html  知识库（Markdown 笔记阅读器）
style.css       全站公共样式
server.js       本地开发服务器（非必需，仅本地用）
start.bat       一键启动本地服务器
```

---

## 二、knowledge.html 知识库

### 2.1 整体架构

```
knowledge.html          页面主文件（含全部 CSS + JS，约 1200 行）
server.js               本地服务器，自动扫描 docs/ 生成目录树 API（/api/docs）
docs/
  ai-llm/               🤖 AI 与大模型（7篇）
    ai-learning-roadmap.md        AI 学习路径导读 ← 新增
    transformer-architecture.md   Transformer 架构详解
    deep-learning-basics.md       深度学习基础
    llm-guide.md                  大语言模型完全指南
    prompt-engineering.md         Prompt Engineering 指南
    rag-guide.md                  RAG 检索增强生成
    ollama-guide.md               Ollama 本地大模型部署
  ai-agent/             🦾 AI Agent 开发（6篇）
    ai-agent-basics.md            AI Agent 基础概念
    ai-agent-practice.md          AI Agent 实战
    langchain-guide.md            LangChain 开发指南
    nlp-guide.md                  自然语言处理基础
    nlp-foundation-models.md      预训练模型体系
    mcp-protocol.md               MCP 协议：AI 工具调用标准 ← 新增
  data-science/         📊 数据科学（6篇）
    data-science-guide.md         数据科学学习指南 ← 新增
    machine-learning.md           机器学习基础
    sklearn-guide.md              Scikit-learn 实战
    numpy-guide.md                NumPy 指南
    pandas-guide.md               Pandas 指南
    data-visualization.md         数据可视化
  frontend/             🌐 前端开发（9篇）
    frontend-overview.md          前端技术栈全览 ← 新增
    html5-features.md             HTML5 新特性
    css3-tutorial.md              CSS3 教程
    js-tutorial.md                JavaScript 教程
    css-layout-guide.md           CSS 布局：Flexbox & Grid
    typescript-guide.md           TypeScript 指南
    vue3-composition-api.md       Vue3 Composition API
    react-basics.md               React 基础
    nextjs-guide.md               Next.js 指南
  backend-eng/          ⚙️ 后端 & 工程（10篇）
    backend-overview.md           后端 & 工程技术指南 ← 新增
    python3-basics.md             Python3 基础
    python3-advanced.md           Python3 进阶
    mysql-guide.md                MySQL 指南
    sql-basics.md                 SQL 基础
    mongodb-guide.md              MongoDB 指南
    git-guide.md                  Git 指南
    http-guide.md                 HTTP 协议
    tcpip-guide.md                TCP/IP 协议
    network-basics.md             网络基础
  guitar/               🎸 吉他（4篇）
    basic-chords.md               基础和弦
    music-theory-basics.md        乐理基础
    fingerstyle-guide.md          指弹入门
    practice-guide.md             练习方法与时间管理 ← 新增
  photography/          📸 摄影（5篇）
    exposure-triangle.md          曝光三角
    composition.md                构图技巧
    street-photography.md         街拍摄影
    lightroom-editing.md          Lightroom 调色
    camera-gear-guide.md          相机装备选购指南 ← 新增
  diy/                  🛠 手工 & DIY（2篇）
    tools-guide.md                DIY 工具入门指南 ← 新增
    woodworking-basics.md         木工基础
```

> **总计 51 篇文章**，8 个分类，包含视频、图片等多媒体内容。

### 2.2 目录加载逻辑

| 优先级 | 来源 | 适用场景 |
|--------|------|---------|
| 1 | sessionStorage 缓存 | 已访问过，秒开 |
| 2 | `/api/docs`（server.js 自动生成） | **本地开发主力**，server.js 扫描 docs/ 目录 |
| 3 | `docs/_sidebar.json`（fetch） | 静态部署兜底 |
| 4 | `FALLBACK_TREE`（JS 内嵌） | `file://` 直接双击打开时的最终兜底 |

**新增文章流程（本地开发）：**
1. 将 `.md` 文件放入 `docs/{分类}/`
2. 重启 server.js（或等待 fs.watch 自动刷新）
3. 刷新页面即可看到新文章

**新增文章流程（静态部署）：**
1. 将 `.md` 文件放入 `docs/{分类}/`
2. 在 `docs/_sidebar.json` 对应分类的 `docs` 数组中添加一条
3. git push 即生效

### 2.3 侧边栏结构与样式

```
分类标题（.sb-cat-header）    ← 0.9rem 左内边距，大写字母，灰色
  文章条目（.sb-doc-item）    ← 1.6rem 左内边距
    大纲 h2（.sb-outline-h2）← 3.0rem 左内边距
      大纲 h3（.sb-outline-h3）← 4.2rem 左内边距
    孤立 h3（.top-level）    ← 3.0rem 左内边距（与 h2 同级）
```

**箭头显示规则（三处统一）：**
- 默认 `color: transparent`（不可见）
- 鼠标 hover 对应行才显现
- 激活/展开状态 hover 时显橙色

**分类间距：** 不用横线分隔，改用 `margin-top: 1.1rem` 留白区分

### 2.4 主题色

```css
--accent:     #e8632a;   /* 语雀橙，主强调色 */
--accent-sub: #f0954e;   /* 次橙色 */
--accent-bg:  rgba(232,99,42,.07);
```

### 2.5 功能清单

- ✅ 侧边栏目录（分类 + 文章，可折叠）
- ✅ 文章内大纲（h2/h3，点击跳转，滚动高亮当前标题）
- ✅ 分类/文章拖拽排序（顺序持久化到 localStorage，key: `kb_order`）
- ✅ 标题搜索过滤
- ✅ 字数统计 + 阅读时间
- ✅ 文章修改日期（`🕓 YYYY-MM-DD`）
- ✅ 返回顶部按钮
- ✅ 深色模式（localStorage 持久化）
- ✅ 移动端侧边栏（汉堡菜单）
- ✅ 面包屑导航（顶部，打开文章时更新）
- ✅ 代码块语言标签（JS 动态插入 DOM）
- ✅ marked.js CDN 失败时 unpkg 备用
- ✅ CAT_LABELS 中文分类名映射（侧边栏/面包屑/欢迎页统一）

---

## 三、works.html 摄影相册

- 相册通过 JS `galleries` 对象管理，`openGallery(key)` 打开弹窗
- 私人相册有前端密码保护（仅供个人使用）
- 照片文件放在 `photos/` 目录，按分类子文件夹存储：
  ```
  photos/
    private/   私人相册（private1.jpg ~ private6.jpg 等）
    ...
  ```

---

## 四、tools.html 工具库

- 工具卡片按分类展示，支持 Modal 弹窗查看详情
- Modal 打开/关闭时锁定/解锁 `body.overflow`，防止背景滚动
- 锚点跳转加 `scroll-padding-top: 80px`，避免被顶部 nav 遮挡

---

## 五、style.css 公共样式要点

- `scroll-padding-top: 80px`（全局锚点跳转偏移）
- `@media(max-width:960px)`：works 卡片中等屏幕改为 2 列
- `nav.scrolled .nav-links a:hover` 使用 accent 色

---

## 六、历史改动时间线

### 2026-03-28

| 模块 | 改动 |
|------|------|
| works.html | 添加 photos/private/private2.png ~ private6.jpg 进私人相册 |
| knowledge.html | 初版飞书风格改造，引入 server.js 自动扫描 docs/ |
| knowledge.html | 修复"← 主页"按钮 32px 宽度截断问题 |
| knowledge.html | 修复 marked.js CDN 加载失败，改为固定版本 + unpkg 备用 |
| knowledge.html | XSS 防护：breadcrumb/error 中用户输入改用 `escHtml()` 转义 |
| tools.html | 修复简悦链接、替换灵感区重复链接 |
| index.html | 平滑滚动偏移 60→80，footer 社交链接改为个人主页格式 |
| style.css | 新增 960px 断点、scroll-padding-top、hover 色 |

### 2026-03-29

| 时间 | 模块 | 改动 |
|------|------|------|
| 上午 | knowledge.html | 界面全面改造为语雀/飞书风格（橙色主题、面包屑、代码块语言标签） |
| 上午 | server.js | 内存缓存 + fs.watch 监听 + 启动自动生成 _sidebar.json |
| 上午 | knowledge.html | sessionStorage 缓存目录树，加速二次访问 |
| 上午 | knowledge.html | 侧边栏新增文章内大纲（h2/h3 可跳转，滚动高亮） |
| 上午 | knowledge.html | 分类/文章拖拽排序，顺序持久化 localStorage |
| 上午 | knowledge.html | 重构 renderOutline：h2 独立箭头展开 h3，层级清晰 |
| 上午 | knowledge.html | 三处箭头统一改为 hover 才显示（默认透明） |
| 上午 | knowledge.html | 默认展开所有分类（querySelectorAll 全部 openCat） |
| 上午 | knowledge.html | 删除分类标题右侧文章数字 |
| 上午 | knowledge.html | 侧边栏层级缩进最终值（见 2.3 节） |
| 上午 | knowledge.html | **改为纯静态模式**：不再依赖 /api/docs，直接读 _sidebar.json，新增 FALLBACK_TREE |
| 上午 | docs/_sidebar.json | 去掉 mtime 字段，格式简化 |
| 上午 | knowledge.html | 新增 docs/web/ 分类，三篇前端教程（HTML/CSS/JS 教程） |
| 上午 | knowledge.html | 欢迎页卡片 minmax 190px→150px，4个卡片一行显示 |
| 上午 | knowledge.html | 侧边栏分类间去掉 border-top，改为 margin-top 留白 |

### 2026-04-08

| 时间 | 模块 | 改动 |
|------|------|------|
| 20:36 | knowledge.html | 新增 CAT_LABELS 中文分类名映射（侧边栏/面包屑/欢迎页统一显示中文） |
| 20:36 | knowledge.html | 侧边栏层级优化：分类标题 .9rem/800，文章 .75rem/400 淡色，去掉分割线 |
| 21:17 | docs/ | 精简删除 10 篇重复/次要文章（vue2、angular、echarts、tailwind、vscode、matplotlib、postgresql 等） |
| 21:17 | docs/ai-data/ | 新增 8 篇 AI/Agent 核心文章（深度学习、LLM、Prompt工程、RAG、Transformer、Agent基础/实战、LangChain） |
| 21:30 | docs/ | **拆分 ai-data 为 ai + data 两个分类目录** |
| 21:30 | docs/ai/ | 移入 8 篇 AI 文章，新增 3 篇（ollama-guide、nlp-guide、nlp-foundation-models）→ 共 11 篇 |
| 21:30 | docs/data/ | 移入 3 篇数据文章，新增 2 篇（sklearn-guide、data-visualization）→ 共 5 篇 |
| 21:30 | knowledge.html | CAT_ICONS/CAT_LABELS 更新：ai-data 拆为 `ai`（🤖 AI & Agent）+ `data`（📊 数据科学） |
| 21:30 | docs/ | 菜鸟教程内容整合完成，知识库总计 40 篇文章 |

### 2026-04-09

| 时间 | 模块 | 改动 |
|------|------|------|
| 21:35 | docs/ | **全局重新分类**：11 个旧分类 → 8 个新分类，逻辑边界清晰 |
| 21:35 | docs/ | `ai/` 拆分为 `ai-llm/`（🤖 AI 与大模型，6篇）+ `ai-agent/`（🦾 AI Agent 开发，5篇） |
| 21:35 | docs/ | `web/` + `frontend-framework/` 合并为 `frontend/`（🌐 前端开发，8篇） |
| 21:35 | docs/ | `backend/` + `database/` + `devtools/` + `network/` 合并为 `backend-eng/`（⚙️ 后端&工程，9篇） |
| 21:35 | docs/ | `data/` 更名为 `data-science/`（📊 数据科学，5篇） |
| 21:35 | docs/ | `diy/css-layout-guide.md` 移入 `frontend/`（技术文章归技术分类） |
| 21:35 | docs/ | `photography/`、`guitar/`、`diy/` 保持独立，摄影和手工不合并 |
| 21:35 | knowledge.html | 更新 CAT_ICONS、CAT_LABELS、FALLBACK_TREE 与新分类同步 |

### 2026-04-09（内容扩充）

| 时间 | 模块 | 改动 |
|------|------|------|
| 21:40 | docs/ai-llm/ | 新增 `ai-learning-roadmap.md`（AI学习路径导读，4阶段、论文清单、资源推荐） |
| 21:40 | docs/ai-agent/ | 新增 `mcp-protocol.md`（MCP 协议原理、实现示例、工具生态） |
| 21:40 | docs/data-science/ | 新增 `data-science-guide.md`（数据科学知识图谱、学习路径、算法速查） |
| 21:40 | docs/frontend/ | 新增 `frontend-overview.md`（前端全栈技术栈全览、选型建议、性能优化清单） |
| 21:40 | docs/backend-eng/ | 新增 `backend-overview.md`（后端技术地图、RESTful规范、SQL/Git速查） |
| 21:40 | docs/guitar/ | 新增 `practice-guide.md`（科学练习方法、各阶段训练重点、防止受伤） |
| 21:40 | docs/photography/ | 新增 `camera-gear-guide.md`（相机参数详解、镜头选购、品牌推荐） |
| 21:40 | docs/diy/ | 新增 `tools-guide.md`（工具选购清单、工作空间布置、基础工艺） |
| 21:40 | knowledge.html | 更新 FALLBACK_TREE，同步全部 49 篇文章 |
| 21:40 | 全库 | **知识库从 41 篇扩充至 49 篇**，每个分类均有导读/综合文章 |

### 2026-04-09（多媒体化改造）

| 时间 | 模块 | 改动 |
|------|------|------|
| 21:50 | docs/diy/tools-guide.md | 添加视频嵌入：DIY 项目视频演示（/videos/diy/project1.mp4） |
| 21:50 | docs/ai-llm/transformer-architecture.md | 添加架构对比图（/image/rnn-vs-transformer.png） |
| 21:50 | docs/photography/composition.md | 添加三分法构图对比图（/image/rule-of-thirds-*.jpg） |
| 21:50 | docs/guitar/basic-chords.md | 添加和弦指法实拍图（/image/c-chord-*.jpg） |
| 21:50 | docs/frontend/ | 新增 `web-performance-optimization.md`（前端性能优化实战，含视频教程） |
| 21:50 | docs/backend-eng/ | 新增 `api-design-best-practices.md`（API 设计最佳实践，含视频教程） |
| 21:50 | knowledge.html | 更新 FALLBACK_TREE，新增2篇文章，**总计 51 篇** |
| 21:50 | docs/ | 新增 `README.md`（知识库使用指南，含多媒体内容说明） |
| 21:50 | 全库 | **知识库从 49 篇扩充至 51 篇**，增加视频/图片等多媒体内容 |

### 2026-04-09（问题修复与内容补充）

| 时间 | 模块 | 改动 |
|------|------|------|
| 22:10 | 全部图片引用 | **修复图片无法显示问题**：将不存在的图片文件替换为CSS占位图 |
| 22:10 | docs/ai-llm/transformer-architecture.md | 替换不存在的 RNN-Transformer 对比图为可视化占位图 |
| 22:10 | docs/photography/composition.md | 替换不存在的三分法构图图为网格对比占位图 |
| 22:10 | docs/guitar/basic-chords.md | 替换不存在的和弦指法图为文字说明+示意图 |
| 22:10 | 视频引用 | **修复视频内容不对问题**：修复视频文件路径检查，提供视频制作建议 |
| 22:10 | docs/frontend/web-performance-optimization.md | 将不存在的视频替换为视频制作指南 |
| 22:10 | docs/backend-eng/api-design-best-practices.md | 将不存在的视频替换为视频制作指南 |
| 22:10 | docs/README.md | 添加**明确的返回首页操作流程**（4种方法） |
| 22:10 | **内容补充** | 新增3篇深度技术文章填补知识缺口 |
| 22:10 | docs/ai-llm/ | 新增 `fine-tuning-practical-guide.md`（AI微调实战：LoRA/QLoRA完整指南） |
| 22:10 | docs/frontend/ | 新增 `testing-frameworks-guide.md`（前端测试框架完全指南：Jest+React Testing Library） |
| 22:10 | docs/photography/ | 新增 `post-processing-workflow.md`（摄影后期实战：Lightroom/Photoshop完整工作流） |
| 22:10 | knowledge.html | 更新FALLBACK_TREE，**总计 54 篇文章** |
| 22:10 | 总结 | **完成所有问题修复+内容补充**，知识库全面升级 |

### 2026-04-10（工具库重构与优化）

| 时间 | 模块 | 改动 |
|------|------|------|
| 上午 | tools.html | **知识库直达入口**：在works.html和tools.html导航栏均新增"知识库"链接 |
| 上午 | tools.html | **失效链接修复**：爱奇艺看图、Ditto、Screenpresso、PotPlayer等链接更新 |
| 上午 | tools.html | **分类结构简化**：13个分类合并为6个大类：AI与智能、媒体与创作、学习与知识、设计与艺术、音乐与乐器、DIY与手工 |
| 上午 | tools.html | **视觉设计升级**：新增大分类卡片设计、子分类网格布局、折叠/展开功能 |
| 上午 | tools.html | **JavaScript功能增强**：支持分类折叠/展开、显示全部工具功能 |
| 上午 | tools.html | **概述区域添加**：新增4个概述卡片展示工具库核心特点 |
| 晚上 | tools.html | **样式全面统一**：完全替换为tools-new-version.html样式，使用index.html的`.tcard`卡片设计，实现全站样式统一 |
| 晚上 | tools.html | **简化结构**：移除复杂的分类折叠和子分类网格布局，改为简单`.section-title` + `.tool-grid`结构 |
| 22:00-23:15 | tools.html | **间距问题深度修复**：解决标签按钮与分类标题间距不一致问题 |
| 22:00 | tools.html | 调整`.tabs-wrap`的`margin-bottom`从`1.5rem`到`0.5rem`，`gap`从`0.5rem`到`0.4rem` |
| 22:00 | tools.html | 调整`.section-title`的`margin`从`2.5rem 0 1.5rem`到`2rem 0 1rem`，最终到`0 0 0.8rem` |
| 22:00 | tools.html | 调整`.hero-desc`的`margin-bottom`从`2rem`到`1.5rem` |
| 22:00 | tools.html | 调整`.search-wrap`的`margin-bottom`从`1.5rem`到`1rem` |
| 22:15 | tools.html | **Tab切换功能修复**：重写JavaScript逻辑，确保点击分类按钮只显示该分类工具 |
| 22:15 | tools.html | 使用`nextElementSibling`找到分类标题后面的工具网格 |
| 22:15 | tools.html | 分别控制分类标题、工具网格和工具卡片的显示状态 |
| 22:40 | tools.html | **分类间距统一修复**：发现HTML结构不一致导致间距问题 |
| 22:40 | tools.html | AI分类没有`.category-section`包装容器，其他5个分类有 |
| 22:40 | tools.html | 移除所有`.category-section`包装容器，统一HTML结构 |
| 22:50 | tools.html | **main容器问题修复**：发现`<main id="mainContent">`导致额外间距 |
| 22:50 | tools.html | 删除`<main id="mainContent">`容器，让`.main-container`直接放在页面中 |
| 23:10 | tools.html | **工具网格容器隐藏修复**：修复JavaScript逻辑，隐藏所有`.tool-grid`容器 |
| 23:10 | tools.html | 之前只隐藏了`.tcard`，但`.tool-grid`容器仍占据空间 |
| 23:10 | tools.html | 修改JavaScript，点击分类按钮时也隐藏`.tool-grid`容器 |
| 23:10 | tools.html | **调整hero区域padding**：从`padding:120px 8% 60px`改为`120px 8% 15px` |
| 23:10 | tools.html | **恢复居中**：恢复`.main-container`的`margin: 0 auto` |
| 23:10 | tools.html | **清理未引用CSS**：删除`.overview-section`等未使用的CSS样式 |
| 总结 | tools.html | **所有间距问题解决**：标签按钮与分类标题间距一致，分类间距统一，页面居中正常 |

---

## 七、本地开发说明

```bash
# 启动本地服务器
node server.js
# 或直接双击
start.bat

# 访问
http://localhost:3000/knowledge.html
```

**为什么需要本地服务器？**
浏览器的安全策略禁止 `file://` 协议下通过 JS 读取本地文件（CORS 限制）。知识库需要 fetch `.md` 文件，所以必须通过 HTTP 协议访问。静态托管平台（Cloudflare Pages 等）本身就是 HTTP，所以部署后不存在此问题。

**server.js 功能：**
- 自动扫描 `docs/` 目录生成 `/api/docs` 接口
- 内存缓存 + `fs.watch` 监听文件变化自动刷新
- 启动时自动生成 `docs/_sidebar.json`（静态部署兜底）

---

## 八、部署说明（Cloudflare Pages）

1. git push 到 GitHub 仓库
2. Cloudflare Pages 连接仓库，构建命令留空，根目录 `/`
3. 每次 push 自动触发重新部署
4. `server.js` 和 `start.bat` 会被上传但不影响静态托管

> `server.js` 仅供本地开发使用，静态托管平台会忽略它。部署时依赖 `docs/_sidebar.json` 作为目录数据源。

---

*本文档由棉花 🐑 整理，如有新改动请同步更新此文件。*
