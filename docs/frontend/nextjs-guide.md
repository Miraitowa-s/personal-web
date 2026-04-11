# Next.js 全栈框架指南

## 概述

Next.js 是由 Vercel 公司维护的 React 框架，用于构建现代化的 Web 应用程序。它提供了服务端渲染（SSR）、静态站点生成（SSG）、API 路由等开箱即用的功能，极大地简化了 React 应用的开发。

### Next.js 核心特性

| 特性 | 说明 |
|------|------|
| 文件系统路由 | pages 目录自动生成路由 |
| 服务端渲染 | 支持 SSR 和 SSG |
| API 路由 | 轻松创建 API 接口 |
| 自动代码分割 | 页面级代码分割 |
| 图片优化 | next/image 自动优化 |
| TypeScript 支持 | 完整的 TS 支持 |
| 热模块替换 | 开发体验优秀 |

### Next.js 适用场景

- 内容驱动的网站（博客、文档、电商）
- 需要 SEO 的应用
- 混合应用（部分 SSR，部分静态）
- API 服务

---

## 环境搭建

### 方式一：Create Next App（推荐）

```bash
# 创建项目（交互式）
npx create-next-app@latest my-nextjs-app

# 跳过交互，直接创建
npx create-next-app@latest my-nextjs-app --typescript --eslint --no-tailwind

# 使用 App Router
npx create-next-app@latest my-nextjs-app --app

# 使用 Pages Router
npx create-next-app@latest my-nextjs-app --no-app
```

### 方式二：手动安装

```bash
# 创建项目目录
mkdir my-nextjs-app
cd my-nextjs-app

# 初始化项目
npm init -y

# 安装 Next.js 和 React
npm install next@latest react@latest react-dom@latest

# 安装 TypeScript（可选）
npm install -D typescript @types/react @types/node
```

### package.json 配置

```json
{
    "scripts": {
        "dev": "next dev",
        "build": "next build",
        "start": "next start",
        "lint": "next lint"
    }
}
```

---

## 项目结构

### App Router 结构（Next.js 13+）

```
my-app/
├── app/
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 首页 (/)
│   ├── about/
│   │   └── page.tsx        # /about
│   ├── blog/
│   │   ├── page.tsx        # /blog
│   │   └── [slug]/
│   │       └── page.tsx    # /blog/:slug
│   └── api/
│       └── hello/
│           └── route.ts    # /api/hello
├── components/
│   ├── Header.tsx
│   └── Footer.tsx
├── public/
│   └── images/
├── styles/
│   └── globals.css
├── next.config.js
└── package.json
```

### Pages Router 结构（传统）

```
my-app/
├── pages/
│   ├── _app.tsx            # 全局应用组件
│   ├── _document.tsx       # HTML 文档
│   ├── index.tsx           # 首页 (/)
│   ├── about.tsx           # /about
│   ├── blog/
│   │   ├── index.tsx       # /blog
│   │   └── [slug].tsx      # /blog/:slug
│   └── api/
│       └── hello.ts        # /api/hello
├── components/
├── public/
└── styles
```

---

## 页面与路由

### 基础页面

```tsx
// app/page.tsx (App Router)
// pages/index.tsx (Pages Router

export default function Home() {
    return (
        <main>
            <h1>欢迎来到 Next.js</h1>
            <p>这是首页</p>
        </main>
    );
}
```

### 动态路由

#### 静态路径参数

```tsx
// app/blog/[slug]/page.tsx
// pages/blog/[slug].tsx

import { useRouter } from 'next/router';

export default function BlogPost() {
    const router = useRouter();
    const { slug } = router.query;
    
    return <h1>文章: {slug}</h1>;
}
```

#### 获取数据

```tsx
// app/blog/[slug]/page.tsx
interface Post {
    id: string;
    title: string;
    content: string;
}

async function getPost(slug: string): Promise<Post> {
    const res = await fetch(`https://api.example.com/posts/${slug}`);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
    const post = await getPost(params.slug);
    
    return (
        <article>
            <h1>{post.title}</h1>
            <p>{post.content}</p>
        </article>
    );
}
```

### 嵌套路由

```
pages/
├── users/
│   ├── index.tsx        # /users
│   ├── [id].tsx         # /users/:id
│   └── [id]/
│       ├── posts.tsx   # /users/:id/posts
│       └── settings.tsx # /users/:id/settings
```

### 路由跳转

```tsx
import Link from 'next/link';
import { useRouter } from 'next/router';

// 组件内跳转
function Navigation() {
    const router = useRouter();
    
    return (
        <nav>
            <Link href="/">首页</Link>
            <Link href="/about">关于</Link>
            <button onClick={() => router.push('/dashboard')}>
                跳转仪表盘
            </button>
        </nav>
    );
}
```

---

## 布局与模板

### 根布局（App Router）

```tsx
// app/layout.tsx
import './globals.css';

export const metadata = {
    title: '我的网站',
    description: 'Next.js 网站描述',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="zh-CN">
            <body>
                <header>
                    <nav>导航栏</nav>
                </header>
                <main>{children}</main>
                <footer>页脚</footer>
            </body>
        </html>
    );
}
```

### 嵌套布局

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="dashboard">
            <aside>仪表盘侧边栏</aside>
            <main>{children}</main>
        </div>
    );
}

// app/dashboard/page.tsx
export default function DashboardPage() {
    return <h1>仪表盘内容</h1>;
}
```

### Pages Router 全局布局

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <header>导航栏</header>
            <Component {...pageProps} />
            <footer>页脚</footer>
        </>
    );
}
```

---

## 数据获取

### 服务端渲染 (SSR)

```tsx
// app/posts/page.tsx (App Router)
// pages/posts/index.tsx (Pages Router)

async function getPosts() {
    const res = await fetch('https://api.example.com/posts', {
        cache: 'no-store', // 每次请求都重新获取
    });
    return res.json();
}

export default async function Posts() {
    const posts = await getPosts();
    
    return (
        <div>
            <h1>文章列表</h1>
            {posts.map(post => (
                <div key={post.id}>
                    <h2>{post.title}</h2>
                    <p>{post.excerpt}</p>
                </div>
            ))}
        </div>
    );
}
```

### 静态站点生成 (SSG)

```tsx
// 构建时获取数据
async function getPosts() {
    const res = await fetch('https://api.example.com/posts');
    return res.json();
}

// 生成静态页面
export async function getStaticProps() {
    const posts = await getPosts();
    return {
        props: { posts },
        revalidate: 60, // ISR：60秒后重新生成
    };
}
```

### 增量静态再生成 (ISR)

```tsx
// pages/blog/[slug].tsx
export async function getStaticPaths() {
    const res = await fetch('https://api.example.com/posts');
    const posts = await res.json();
    
    return {
        paths: posts.map(post => ({
            params: { slug: post.slug },
        })),
        fallback: 'blocking', // 新页面按需生成
    };
}

export async function getStaticProps({ params }) {
    const res = await fetch(`https://api.example.com/posts/${params.slug}`);
    const post = await res.json();
    
    return {
        props: { post },
        revalidate: 3600, // 1小时重新验证
    };
}
```

### 客户端数据获取

```tsx
import { useState, useEffect } from 'react';

export default function ClientPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        fetch('/api/posts')
            .then(res => res.json())
            .then(data => {
                setPosts(data);
                setLoading(false);
            });
    }, []);
    
    if (loading) return <p>加载中...</p>;
    
    return (
        <div>
            {posts.map(post => (
                <div key={post.id}>{post.title}</div>
            ))}
        </div>
    );
}
```

---

## API 路由

### 基础 API

```tsx
// app/api/hello/route.ts (App Router)
// pages/api/hello.ts (Pages Router)

import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        message: 'Hello, Next.js!',
        timestamp: new Date().toISOString()
    });
}
```

### 请求处理

```tsx
import { NextRequest, NextResponse } from 'next/server';

// GET 请求
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    return NextResponse.json({
        id,
        data: { /* 获取的数据 */ }
    });
}

// POST 请求
export async function POST(request: NextRequest) {
    const body = await request.json();
    
    // 验证
    if (!body.name) {
        return NextResponse.json(
            { error: '姓名不能为空' },
            { status: 400 }
        );
    }
    
    // 处理数据
    const newItem = {
        id: Date.now(),
        ...body,
        createdAt: new Date().toISOString()
    };
    
    return NextResponse.json(newItem, { status: 201 });
}

// PUT 请求
export async function PUT(request: NextRequest) {
    const body = await request.json();
    // 更新逻辑
    return NextResponse.json({ success: true });
}

// DELETE 请求
export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    // 删除逻辑
    return NextResponse.json({ success: true, id });
}
```

### 中间件示例

```tsx
// middleware.ts (根目录)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // 检查认证
    const token = request.cookies.get('auth-token');
    
    if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*'],
};
```

---

## 图片优化

### next/image 组件

```tsx
import Image from 'next/image';

export default function Page() {
    return (
        <div>
            <h1>图片示例</h1>
            
            {/* 基础用法 */}
            <Image
                src="/images/photo.jpg"
                alt="风景照片"
                width={800}
                height={600}
            />
            
            {/* 响应式图片 */}
            <Image
                src="/images/photo.jpg"
                alt="风景照片"
                fill
                style={{ objectFit: 'cover' }}
            />
            
            {/* 远程图片 */}
            <Image
                src="https://example.com/photo.jpg"
                alt="风景照片"
                width={800}
                height={600}
            />
        </div>
    );
}
```

### next.config.js 配置

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'example.com',
                pathname: '/images/**',
            },
        ],
    },
};

module.exports = nextConfig;
```

---

## CSS 样式

### Tailwind CSS（推荐）

```tsx
// app/page.tsx
export default function Page() {
    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">
                    欢迎
                </h1>
                <p className="text-lg text-gray-600">
                    使用 Tailwind CSS 快速构建美观的界面
                </p>
            </div>
        </div>
    );
}
```

### CSS Modules

```css
/* styles/Button.module.css */
.button {
    padding: 0.75rem 1.5rem;
    background-color: #3b82f6;
    color: white;
    border-radius: 0.5rem;
}

.primary {
    background-color: #3b82f6;
}

.danger {
    background-color: #ef4444;
}
```

```tsx
// components/Button.tsx
import styles from './Button.module.css';

export default function Button({ 
    children, 
    variant = 'primary' 
}: { 
    children: React.ReactNode;
    variant?: 'primary' | 'danger';
}) {
    const className = `${styles.button} ${styles[variant]}`;
    
    return <button className={className}>{children}</button>;
}
```

### 全局样式

```css
/* app/globals.css */
/* App Router */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
    --primary: #3b82f6;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

---

## 静态资源

### public 目录

```
public/
├── images/
│   ├── logo.png
│   └── banner.jpg
├── documents/
│   └── resume.pdf
└── files/
    └── data.json
```

```tsx
import Image from 'next/image';
import Link from 'next/link';

export default function Page() {
    return (
        <div>
            {/* 图片 */}
            <Image 
                src="/images/logo.png" 
                alt="Logo"
                width={120}
                height={40}
            />
            
            {/* 链接到文件 */}
            <Link href="/documents/resume.pdf">下载简历</Link>
            
            {/* 直接访问 */}
            <a href="/files/data.json">JSON 数据</a>
        </div>
    );
}
```

---

## 元数据和 SEO

### 基础元数据

```tsx
// app/layout.tsx
export const metadata = {
    title: '网站标题',
    description: '网站描述',
    keywords: ['Next.js', 'React', 'Web开发'],
    authors: [{ name: '作者名' }],
    openGraph: {
        title: '分享标题',
        description: '分享描述',
        type: 'website',
    },
};
```

### 页面级元数据

```tsx
// app/about/page.tsx
export const metadata = {
    title: '关于我们',
    description: '了解我们的故事',
};

export default function About() {
    return <h1>关于我们</h1>;
}
```

### 动态元数据

```tsx
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }) {
    const post = await getPost(params.slug);
    
    return {
        title: post.title,
        description: post.excerpt,
    };
}
```

---

## 环境变量

### .env 文件

```bash
# .env.local - 本地开发
DATABASE_URL=postgres://localhost:5432/mydb
API_KEY=your_api_key_here
NEXT_PUBLIC_PUBLIC_VAR=value

# .env.production - 生产环境
DATABASE_URL=postgres://production:5432/proddb
API_KEY=production_api_key
```

### 使用环境变量

```tsx
// 服务端（所有环境变量都可用）
const dbUrl = process.env.DATABASE_URL;
const apiKey = process.env.API_KEY;

// 客户端（仅 PUBLIC_ 前缀）
const publicVar = process.env.NEXT_PUBLIC_PUBLIC_VAR;

// 在组件中使用
export default function Component() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    return <div>API: {apiUrl}</div>;
}
```

---

## 部署

### Vercel 部署（推荐）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel

# 生产环境部署
vercel --prod
```

### 其他平台部署

```bash
# 构建
npm run build

# 启动生产服务器
npm run start
```

### Docker 部署

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 总结

Next.js 是现代 React 开发的强大框架，提供了：

| 能力 | 说明 |
|------|------|
| 多种渲染方式 | SSR、SSG、ISR、CSR |
| API 路由 | 前后端一体化 |
| 图像优化 | 自动格式转换和压缩 |
| 文件系统路由 | 约定优于配置 |
| TypeScript 支持 | 完整类型安全 |
| 边缘函数 | 全球低延迟部署 |

### App Router vs Pages Router

| 特性 | App Router | Pages Router |
|------|-----------|--------------|
| 稳定性 | 最新，稳定 | 传统，稳定 |
| 服务端组件 | ✅ | ❌ |
| 布局 | 嵌套布局 | 单一布局 |
| 数据获取 | async/await | getServerSideProps |
| 状态管理 | 推荐 React Context | 同上 |

### 学习资源

- 官方文档：https://nextjs.org/docs
- 中文文档：https://www.nextjs.cn/
- 示例库：https://github.com/vercel/next.js/tree/canary/examples
