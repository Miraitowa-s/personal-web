# React 基础入门

## 概述

React 是 Facebook 于 2013 年开源的 JavaScript 库，用于构建用户界面（UI）。与其他完整框架不同，React 专注于视图层，采用组件化开发模式，通过虚拟 DOM 实现高性能渲染。

### React 核心特点

| 特点 | 说明 |
|------|------|
| 组件化 | 可复用、独立封装 UI 组件 |
| 虚拟 DOM | 高效的 DOM 更新机制 |
| 单向数据流 | 数据从父组件流向子组件 |
| JSX 语法 | JavaScript 中写 HTML 结构 |
| Hooks | 函数组件中使用状态和生命周期 |

### 学习前提

- HTML/CSS 基础
- JavaScript 基础（ES6+）
- 命令行基础

---

## 环境搭建

### 方式一：CDN 引入（快速体验）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>React 快速体验</title>
</head>
<body>
    <div id="root"></div>
    
    <!-- React 核心库 -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <!-- React DOM -->
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <!-- Babel 用于编译 JSX -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    
    <script type="text/babel">
        function App() {
            return <h1>Hello, React!</h1>;
        }
        
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>
```

### 方式二：Vite（推荐）

```bash
# 创建 React 项目
npm create vite@latest my-react-app -- --template react

# 进入目录
cd my-react-app

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 方式三：Create React App

```bash
# 创建项目
npx create-react-app my-react-app

# 进入目录并启动
cd my-react-app
npm start
```

---

## JSX 语法

JSX 是 JavaScript 的语法扩展，允许在 JavaScript 中书写类似 HTML 的结构。

### 基本语法

```jsx
// JSX 表达式
const name = '张三';
const element = <h1>你好, {name}!</h1>;

// 在 JSX 中使用表达式
const element = <p>{name.length > 0 ? '有名字' : '无名字'}</p>;

// JSX 属性
const element = <div className="container">内容</div>;

// 自闭合标签
const element = <img src="photo.jpg" alt="图片" />;
```

### JSX 与 HTML 的区别

| HTML | JSX | 说明 |
|------|-----|------|
| class | className | class 是保留字 |
| for | htmlFor | for 是保留字 |
| onclick | onClick | 事件小驼峰 |
| onchange | onChange | 事件小驼峰 |
| tabindex | tabIndex | 属性小驼峰 |

### JSX 条件渲染

```jsx
// 方式一：三元运算符
function Greeting({ isLoggedIn }) {
    return (
        <div>
            {isLoggedIn ? <UserGreeting /> : <GuestGreeting />}
        </div>
    );
}

// 方式二：&& 运算符
function Mailbox({ unreadMessages }) {
    return (
        <div>
            <h1>消息</h1>
            {unreadMessages.length > 0 && (
                <p>你有 {unreadMessages.length} 条未读消息</p>
            )}
        </div>
    );
}

// 方式三：if 语句（组件内部）
function LoginControl() {
    if (isLoggedIn) {
        return <UserGreeting />;
    }
    return <GuestGreeting />;
}
```

### JSX 列表渲染

```jsx
function NumberList({ numbers }) {
    // 必须为列表项添加 key
    return (
        <ul>
            {numbers.map((num, index) => (
                <li key={index}>{num}</li>
            ))}
        </ul>
    );
}

// 使用
const numbers = [1, 2, 3, 4, 5];
<NumberList numbers={numbers} />
```

---

## React 组件

### 函数组件（推荐）

```jsx
// 简单函数组件
function Welcome(props) {
    return <h1>你好, {props.name}!</h1>;
}

// 箭头函数组件
const Welcome = (props) => {
    return <h1>你好, {props.name}!</h1>;
};

// 使用组件
const element = <Welcome name="张三" />;
```

### class 组件

```jsx
class Welcome extends React.Component {
    render() {
        return <h1>你好, {this.props.name}!</h1>;
    }
}
```

### 组件组合

```jsx
function App() {
    return (
        <div>
            <Welcome name="张三" />
            <Welcome name="李四" />
            <Welcome name="王五" />
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
```

### Props 只读性

**Props 禁止在组件内部修改！**

```jsx
// ❌ 错误：Props 是只读的
function Counter(props) {
    props.count++; // 禁止！
    return <p>{props.count}</p>;
}

// ✅ 正确：使用 state 管理可变数据
function Counter() {
    const [count, setCount] = useState(0);
    return (
        <div>
            <p>计数: {count}</p>
            <button onClick={() => setCount(count + 1)}>增加</button>
        </div>
    );
}
```

---

## State 与生命周期

### useState Hook

```jsx
import { useState } from 'react';

function Counter() {
    // 声明状态：count 是当前值，setCount 是更新函数
    const [count, setCount] = useState(0);
    
    return (
        <div>
            <p>计数: {count}</p>
            <button onClick={() => setCount(count + 1)}>
                点我增加
            </button>
            <button onClick={() => setCount(count - 1)}>
                点我减少
            </button>
            <button onClick={() => setCount(0)}>
                重置
            </button>
        </div>
    );
}
```

### useState 高级用法

```jsx
// 对象状态
function UserForm() {
    const [user, setUser] = useState({
        name: '',
        email: '',
        age: ''
    });
    
    // 更新单个属性（使用展开运算符）
    const updateName = (e) => {
        setUser({ ...user, name: e.target.value });
    };
    
    return (
        <form>
            <input 
                value={user.name} 
                onChange={updateName} 
                placeholder="姓名"
            />
            <input 
                value={user.email} 
                onChange={(e) => setUser({...user, email: e.target.value})}
                placeholder="邮箱"
            />
        </form>
    );
}

// 函数式更新（基于前一个状态）
function Counter() {
    const [count, setCount] = useState(0);
    
    const increment = () => {
        // 推荐使用函数式更新
        setCount(prevCount => prevCount + 1);
    };
    
    return <button onClick={increment}>增加: {count}</button>;
}
```

### 多个状态

```jsx
function MultipleStates() {
    const [name, setName] = useState('张三');
    const [age, setAge] = useState(25);
    const [isStudent, setIsStudent] = useState(false);
    
    return (
        <div>
            <p>姓名: {name}</p>
            <p>年龄: {age}</p>
            <p>学生: {isStudent ? '是' : '否'}</p>
        </div>
    );
}
```

---

## 事件处理

### 基本事件绑定

```jsx
function Button() {
    function handleClick() {
        alert('按钮被点击！');
    }
    
    return <button onClick={handleClick}>点击我</button>;
}

// 箭头函数内联
function Button() {
    return <button onClick={() => alert('点击！')}>点击我</button>;
}
```

### 传递参数

```jsx
function ActionLink() {
    function handleClick(id, name) {
        console.log(`ID: ${id}, Name: ${name}`);
    }
    
    return (
        <div>
            {/* 传递额外参数 */}
            <button onClick={() => handleClick(1, '张三')}>
                操作1
            </button>
            
            {/* 使用 bind 绑定参数 */}
            <button onClick={handleClick.bind(null, 2, '李四')}>
                操作2
            </button>
        </div>
    );
}
```

### 事件对象

```jsx
function EventExample() {
    function handleClick(e, message) {
        console.log(e); // React 合成事件对象
        console.log(e.target); // 事件目标元素
        console.log(message);
    }
    
    return (
        <button onClick={(e) => handleClick(e, 'Hello')}>
            点击事件
        </button>
    );
}
```

---

## 条件渲染

### 多种条件渲染方式

```jsx
// 方式一：if 语句
function Greeting({ user }) {
    if (user) {
        return <h1>欢迎回来, {user}!</h1>;
    }
    return <h1>请登录</h1>;
}

// 方式二：三元运算符
function LoginControl({ isLoggedIn }) {
    return (
        <div>
            {isLoggedIn ? (
                <button>登出</button>
            ) : (
                <button>登录</button>
            )}
        </div>
    );
}

// 方式三：&& 运算符
function UnreadMessages({ messages }) {
    return (
        <div>
            <h1>消息</h1>
            {messages.length > 0 && (
                <p>你有 {messages.length} 条未读消息</p>
            )}
        </div>
    );
}

// 方式四：阻止组件渲染
function Warning({ show }) {
    if (!show) return null;
    
    return <div className="warning">警告信息</div>;
}
```

---

## 列表渲染与 Keys

### 渲染列表

```jsx
function BlogList({ posts }) {
    return (
        <div>
            {posts.map(post => (
                <div key={post.id}>
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                </div>
            ))}
        </div>
    );
}

// 使用
const posts = [
    { id: 1, title: 'React 入门', content: 'React 基础...' },
    { id: 2, title: 'Vue 入门', content: 'Vue 基础...' },
    { id: 3, title: 'Angular 入门', content: 'Angular 基础...' }
];

<BlogList posts={posts} />
```

### Keys 的重要性

```jsx
// ✅ 正确：使用唯一 ID 作为 key
function CorrectList({ items }) {
    return (
        <ul>
            {items.map(item => (
                <li key={item.id}>{item.name}</li>
            ))}
        </ul>
    );
}

// ❌ 错误：使用索引作为 key（可能导致问题）
function WrongList({ items }) {
    return (
        <ul>
            {items.map((item, index) => (
                <li key={index}>{item.name}</li>
            ))}
        </ul>
    );
}
```

---

## 表单处理

### 受控组件

```jsx
function NameForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('提交:', { name, email });
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>姓名: </label>
                <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <label>邮箱: </label>
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <button type="submit">提交</button>
        </form>
    );
}
```

### textarea 组件

```jsx
function ArticleForm() {
    const [content, setContent] = useState('');
    
    return (
        <form>
            <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="输入文章内容..."
                rows={5}
            />
            <p>字数: {content.length}</p>
        </form>
    );
}
```

### select 组件

```jsx
function SelectForm() {
    const [fruit, setFruit] = useState('orange');
    
    return (
        <select value={fruit} onChange={(e) => setFruit(e.target.value)}>
            <option value="apple">苹果</option>
            <option value="banana">香蕉</option>
            <option value="orange">橙子</option>
        </select>
    );
}

// 多选
function MultiSelect() {
    const [selected, setSelected] = useState([]);
    
    const handleChange = (e) => {
        const options = [...e.target.selectedOptions];
        const values = options.map(option => option.value);
        setSelected(values);
    };
    
    return (
        <select multiple value={selected} onChange={handleChange}>
            <option value="apple">苹果</option>
            <option value="banana">香蕉</option>
            <option value="orange">橙子</option>
        </select>
    );
}
```

---

## useEffect Hook

### 基本用法

```jsx
import { useState, useEffect } from 'react';

function Example() {
    const [count, setCount] = useState(0);
    
    // 每次渲染后执行
    useEffect(() => {
        document.title = `计数: ${count}`;
        
        // 可选：返回清理函数
        return () => {
            console.log('清理');
        };
    }); // 空依赖数组 = 只在首次渲染执行
    
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 依赖数组

```jsx
function UserProfile({ userId }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // 只在 userId 变化时执行
    useEffect(() => {
        setLoading(true);
        fetch(`/api/users/${userId}`)
            .then(res => res.json())
            .then(data => {
                setUser(data);
                setLoading(false);
            });
    }, [userId]); // 依赖 userId
    
    if (loading) return <p>加载中...</p>;
    return <div>{user?.name}</div>;
}
```

### 常见使用场景

```jsx
// 1. 数据获取
useEffect(() => {
    fetch('/api/data')
        .then(res => res.json())
        .then(data => setData(data));
}, []);

// 2. 订阅事件
useEffect(() => {
    const subscription = eventSource.subscribe(data => {
        setData(data);
    });
    
    // 清理订阅
    return () => subscription.unsubscribe();
}, []);

// 3. 操作 DOM
useEffect(() => {
    document.title = title;
}, [title]);

// 4. 设置定时器
useEffect(() => {
    const timer = setInterval(() => {
        setSeconds(s => s + 1);
    }, 1000);
    
    // 清理定时器
    return () => clearInterval(timer);
}, []);
```

---

## 自定义 Hooks

自定义 Hook 是逻辑复用的强大方式，以 `use` 开头：

### useWindowSize

```jsx
import { useState, useEffect } from 'react';

function useWindowSize() {
    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });
    
    useEffect(() => {
        function handleResize() {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }
        
        window.addEventListener('resize', handleResize);
        
        // 清理
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    return size;
}

// 使用
function App() {
    const { width, height } = useWindowSize();
    
    return (
        <div>
            <p>窗口宽度: {width}</p>
            <p>窗口高度: {height}</p>
        </div>
    );
}
```

### useFetch

```jsx
import { useState, useEffect } from 'react';

function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        setLoading(true);
        setError(null);
        
        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error('请求失败');
                return res.json();
            })
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [url]);
    
    return { data, loading, error };
}

// 使用
function UserProfile({ userId }) {
    const { data: user, loading, error } = useFetch(`/api/users/${userId}`);
    
    if (loading) return <p>加载中...</p>;
    if (error) return <p>错误: {error}</p>;
    
    return <div>{user?.name}</div>;
}
```

---

## 组件通信

### Props 向下传递

```jsx
// 父组件
function Parent() {
    const message = "来自父组件的消息";
    return <Child message={message} />;
}

// 子组件
function Child({ message }) {
    return <p>{message}</p>;
}
```

### 回调函数传递

```jsx
function Parent() {
    function handleAction(action) {
        console.log('子组件执行了:', action);
    }
    
    return <Child onAction={handleAction} />;
}

function Child({ onAction }) {
    return (
        <button onClick={() => onAction('点击')}>
            点击触发父组件方法
        </button>
    );
}
```

### Context 跨层级传递

```jsx
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

function App() {
    const [theme, setTheme] = useState('light');
    
    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <Toolbar />
        </ThemeContext.Provider>
    );
}

function Toolbar() {
    return <ThemedButton />;
}

function ThemedButton() {
    const { theme, setTheme } = useContext(ThemeContext);
    
    return (
        <button 
            style={{ background: theme === 'dark' ? '#333' : '#fff' }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
            切换主题
        </button>
    );
}
```

---

## 总结

本文介绍了 React 的核心基础知识：

| 概念 | 说明 |
|------|------|
| JSX | JavaScript 语法扩展 |
| 组件 | 可复用的 UI 单元 |
| Props | 组件间数据传递 |
| State | 组件内部可变数据 |
| Hooks | 函数组件增强功能 |
| 事件处理 | onClick、onChange 等 |
| 条件渲染 | if、三元、&& |
| 列表渲染 | map + key |
| 表单处理 | 受控组件 |
| Context | 跨组件数据共享 |

React 的学习建议：
1. 熟练掌握 JSX 语法
2. 深入理解 Hooks 的使用场景
3. 学会拆分和组织组件
4. 了解 React 生态（Router、Redux、状态管理等）
