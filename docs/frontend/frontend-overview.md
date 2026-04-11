# 前端开发技术栈全览

> 2024-2025 年前端开发完整知识体系：从 HTML/CSS/JS 基础到现代框架，再到工程化工具链。

## 一、前端技术栈全景图

```
浏览器 / 运行环境
│
├── 基础三件套
│   ├── HTML5     — 结构（内容）
│   ├── CSS3      — 样式（表现）
│   └── JavaScript— 行为（交互）
│
├── 语言增强
│   ├── TypeScript    — JS 超集，类型系统
│   └── CSS 预处理器  — Sass/Less（可选，现代项目用 CSS 变量替代）
│
├── 现代框架（三选一为主）
│   ├── Vue 3         — 渐进式，国内生态强
│   ├── React 18      — 最大生态，灵活
│   └── Angular       — 企业级，内置全套
│
├── 全栈框架
│   ├── Next.js       — React SSR/SSG
│   ├── Nuxt 3        — Vue SSR/SSG
│   └── SvelteKit     — Svelte 全栈
│
├── 构建工具链
│   ├── Vite          — 现代构建工具（首选）
│   ├── Webpack       — 老牌，生态丰富
│   └── Turbopack     — Next.js 内置，极速
│
└── 开发辅助
    ├── ESLint         — 代码规范
    ├── Prettier       — 代码格式化
    ├── Vitest/Jest    — 单元测试
    └── Playwright     — E2E 测试
```

## 二、学习路径

### 第一阶段：基础扎实（1-3 个月）

**HTML + CSS 核心：**
```
1. HTML 语义化标签（header、main、article、section、footer）
2. CSS 盒模型（content、padding、border、margin）
3. Flexbox 布局（现代布局首选）
4. CSS Grid 布局（二维布局神器）
5. 响应式设计（媒体查询、移动优先）
6. CSS 变量（--primary-color: #...; var(--primary-color)）
```

**JavaScript 核心：**
```
1. ES6+ 特性（箭头函数、解构、扩展运算符、模板字符串）
2. 异步编程（Promise → async/await）
3. DOM 操作（querySelector、addEventListener）
4. Fetch API（网络请求）
5. 模块系统（import/export）
6. 闭包与作用域
```

**第一个项目：** 纯 HTML/CSS/JS 做一个响应式个人主页

### 第二阶段：框架与工程化（2-3 个月）

```
1. Node.js 基础（运行环境、npm/pnpm）
2. Vite 项目构建
3. 选择框架（Vue3 或 React）深入学习
4. TypeScript 基础（类型注解、接口、泛型）
5. 状态管理（Pinia/Redux Toolkit）
6. 路由（Vue Router / React Router）
```

**第二个项目：** 用 Vue3/React + Vite 做一个 SPA 应用（Todo、博客、工具站）

### 第三阶段：全栈与工程实践

```
7. Next.js / Nuxt（SSR/SSG）
8. REST API 调用与状态管理
9. 性能优化（懒加载、代码分割、CDN）
10. 测试（Vitest 单测）
11. 部署（Vercel / Cloudflare Pages）
```

## 三、2024-2025 技术选型建议

| 场景 | 推荐技术栈 |
|------|------------|
| 个人项目/快速原型 | Vite + Vue3 / React |
| SEO 要求高的站点 | Next.js (React) / Nuxt 3 (Vue) |
| 企业中台系统 | Vue3 + Ant Design / React + Ant Design Pro |
| 超高性能 | Svelte / SolidJS |
| 纯静态站点 | Astro |

## 四、本分类文章导航

| 文章 | 核心内容 | 难度 |
|------|----------|------|
| [HTML5 新特性](html5-features.md) | 语义化标签、表单、Canvas、WebStorage | ⭐ |
| [CSS3 教程](css3-tutorial.md) | 过渡、动画、变形、CSS 变量 | ⭐⭐ |
| [JavaScript 教程](js-tutorial.md) | ES6+、DOM、异步、模块 | ⭐⭐⭐ |
| [CSS 布局指南](css-layout-guide.md) | Flexbox 全解 + Grid 全解 | ⭐⭐ |
| [TypeScript 指南](typescript-guide.md) | 类型系统、泛型、工程实践 | ⭐⭐⭐ |
| [Vue3 组合式 API](vue3-composition-api.md) | setup、ref/reactive、Composables | ⭐⭐⭐ |
| [React 基础](react-basics.md) | Hooks、状态管理、组件设计 | ⭐⭐⭐ |
| [Next.js 指南](nextjs-guide.md) | SSR/SSG、App Router、部署 | ⭐⭐⭐⭐ |

**建议学习顺序：** HTML5 → CSS3 → CSS 布局 → JS → TypeScript → Vue3 或 React → Next.js

## 五、核心概念速查

### Flexbox 要点
```css
.container {
  display: flex;
  flex-direction: row;       /* 主轴方向 */
  justify-content: center;   /* 主轴对齐 */
  align-items: center;       /* 交叉轴对齐 */
  flex-wrap: wrap;           /* 换行 */
  gap: 1rem;                 /* 间距 */
}
```

### CSS Grid 要点
```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);  /* 三列等宽 */
  grid-template-rows: auto;
  gap: 1rem;
}
/* 响应式 Grid（无媒体查询）*/
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
```

### JS 异步要点
```javascript
// 优先用 async/await，更易读
async function fetchUser(id) {
  try {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('请求失败:', err);
    throw err;
  }
}
```

### Vue3 组合式 API 要点
```javascript
import { ref, computed, onMounted } from 'vue'

// setup() 内部
const count = ref(0)
const double = computed(() => count.value * 2)
const increment = () => count.value++

onMounted(() => {
  console.log('组件挂载完成')
})
```

### React Hooks 要点
```javascript
import { useState, useEffect, useCallback } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    document.title = `计数: ${count}`
    return () => { /* cleanup */ }
  }, [count])
  
  const increment = useCallback(() => setCount(c => c + 1), [])
  
  return <button onClick={increment}>{count}</button>
}
```

## 六、前端性能优化清单

```
资源加载优化：
  ✅ 图片懒加载（loading="lazy"）
  ✅ 图片格式：WebP / AVIF
  ✅ 字体子集化
  ✅ CDN 加速静态资源

代码优化：
  ✅ 代码分割（动态 import）
  ✅ Tree Shaking（去除未用代码）
  ✅ CSS 压缩与合并
  ✅ 避免 layout thrashing

渲染优化：
  ✅ 虚拟列表（长列表场景）
  ✅ React.memo / Vue v-memo（避免无效重渲染）
  ✅ Web Workers（CPU 密集任务）
  ✅ requestAnimationFrame（动画）

网络优化：
  ✅ HTTP/2 多路复用
  ✅ 预加载关键资源（<link rel="preload">）
  ✅ Service Worker 离线缓存
```

---

## 七、专业术语速查

| 术语 | 解释 |
|------|------|
| **DOM** | 文档对象模型，浏览器把 HTML 解析后形成的树形结构，JS 通过它操作页面元素 |
| **虚拟 DOM（Virtual DOM）** | React/Vue 用 JS 对象模拟 DOM 树，变化时先对比再更新真实 DOM，减少性能损耗 |
| **响应式（Reactivity）** | 数据变化时，视图自动同步更新，Vue 的核心特性（ref/reactive 背后的机制） |
| **SSR（服务端渲染）** | HTML 在服务器生成后发给浏览器，首屏快、SEO 好，Next.js/Nuxt 的核心卖点 |
| **SSG（静态站点生成）** | 构建时提前生成所有 HTML 文件，适合内容不常变化的网站，性能最好 |
| **Hydration（注水）** | SSR 页面到达浏览器后，React/Vue 接管静态 HTML 并让其变成可交互的过程 |
| **Tree Shaking** | 打包时自动去除未被使用的代码，减小最终 bundle 体积 |
| **代码分割（Code Splitting）** | 把代码拆成多个小块按需加载，而不是一次性全部下载 |
| **CSP（内容安全策略）** | 通过 HTTP 头告诉浏览器哪些资源可以加载，防止 XSS 攻击 |
| **XSS** | 跨站脚本攻击，攻击者注入恶意脚本，在受害者浏览器里执行 |
| **CORS** | 跨域资源共享，浏览器的安全机制，需要服务端设置响应头才能允许跨域请求 |
| **PWA** | 渐进式 Web 应用，能像原生 App 一样安装、离线使用，靠 Service Worker 实现 |
| **Polyfill** | 为旧浏览器补充新特性的代码，比如让 IE11 支持 Promise |
| **Bundle** | 打包后的产物，Webpack/Vite 把所有模块合并成的 JS/CSS 文件 |
| **Hooks** | React 16.8 引入，让函数组件也能使用 state 和生命周期，useState/useEffect 都是 Hook |
