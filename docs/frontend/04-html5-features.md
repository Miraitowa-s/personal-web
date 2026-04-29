# HTML5 新特性完全指南

HTML5 是 HTML 最新的修订版本，由万维网联盟（W3C）于 2014 年 10 月完成标准制定。它的设计初衷是为了在移动设备上更好地支持多媒体，同时让 Web 开发变得更加简单和强大。

## 一、HTML5 简介

### 1.1 什么是 HTML5

HTML5 是 HTML 4.01 的下一代标准，不仅仅是标记语言的升级，更是一套完整的 Web 应用开发平台。它由 W3C 与 WHATWG 合作制定，结合了 Web 表单和应用程序的技术。

**HTML5 的核心目标：**
- 支持多媒体内容，无需依赖 Flash 等插件
- 提供更好的本地离线存储支持
- 增强表单功能和语义化结构
- 提升 Web 应用的性能和用户体验

### 1.2 最小 HTML5 文档结构

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>文档标题</title>
</head>
<body>
文档内容...
</body>
</html>
```

相比 HTML4，HTML5 的文档声明更加简洁，只需要 `<!DOCTYPE html>` 即可。

## 二、语义化标签

HTML5 引入了多个语义化元素，让网页结构更加清晰，同时提升了可访问性和 SEO 效果。

### 2.1 常用语义化标签

| 标签 | 描述 | 使用场景 |
|------|------|----------|
| `<article>` | 定义页面独立的内容区域 | 博客文章、新闻报道、论坛帖子 |
| `<aside>` | 定义页面的侧边栏内容 | 相关链接、广告、作者简介 |
| `<details>` | 描述文档或文档某个部分的细节 | 可展开的详细信息 |
| `<figure>` | 规定独立的流内容 | 图像、图表、代码示例 |
| `<footer>` | 定义 section 或 document 的页脚 | 版权信息、相关链接 |
| `<header>` | 定义文档的头部区域 | 网站标题、导航、Logo |
| `<mark>` | 定义带有记号的文本 | 高亮显示搜索结果 |
| `<nav>` | 定义导航链接的部分 | 主导航菜单 |
| `<section>` | 定义文档中的节 | 章节、页眉、页脚 |
| `<time>` | 定义日期或时间 | 文章发布时间 |

### 2.2 语义化标签使用示例

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>语义化标签示例</title>
</head>
<body>
  <header>
    <h1>我的博客</h1>
    <nav>
      <a href="#home">首页</a>
      <a href="#about">关于</a>
      <a href="#contact">联系</a>
    </nav>
  </header>

  <main>
    <article>
      <header>
        <h2>HTML5 新特性介绍</h2>
        <time datetime="2024-01-15">2024年1月15日</time>
      </header>
      <section>
        <h3>什么是语义化标签</h3>
        <p>语义化标签让 HTML 结构更加清晰...</p>
      </section>
      <section>
        <h3>常用标签一览</h3>
        <p>HTML5 引入了 article、section、nav 等标签...</p>
      </section>
    </article>

    <aside>
      <h3>相关文章</h3>
      <ul>
        <li><a href="#">CSS3 新特性</a></li>
        <li><a href="#">JavaScript ES6</a></li>
      </ul>
    </aside>
  </main>

  <footer>
    <p>&copy; 2024 我的博客. 保留所有权利。</p>
  </footer>
</body>
</html>
```

## 三、表单增强

HTML5 为表单带来了革命性的改进，新增了多种输入类型和属性，大大提升了用户体验。

### 3.1 新的输入类型

```html
<!-- 邮箱输入 -->
<input type="email" placeholder="请输入邮箱">

<!-- URL 输入 -->
<input type="url" placeholder="https://example.com">

<!-- 日期选择 -->
<input type="date">
<input type="datetime-local">

<!-- 数字输入 -->
<input type="number" min="0" max="100" step="5">

<!-- 范围滑块 -->
<input type="range" min="0" max="100" value="50">

<!-- 搜索框 -->
<input type="search" placeholder="搜索...">

<!-- 颜色选择器 -->
<input type="color" value="#ff0000">

<!-- 电话输入 -->
<input type="tel" pattern="[0-9]{11}" placeholder="手机号码">
```

### 3.2 新的表单属性

| 属性 | 说明 | 示例 |
|------|------|------|
| `placeholder` | 输入框提示文本 | `<input placeholder="请输入">` |
| `required` | 必填字段 | `<input required>` |
| `autofocus` | 自动聚焦 | `<input autofocus>` |
| `autocomplete` | 自动完成 | `<input autocomplete="off">` |
| `pattern` | 正则验证 | `<input pattern="[A-Za-z]{3}">` |
| `multiple` | 多选 | `<input type="file" multiple>` |

### 3.3 完整的表单示例

```html
<form action="/submit" method="post">
  <fieldset>
    <legend>用户信息</legend>
    
    <label for="username">用户名：</label>
    <input type="text" id="username" name="username" 
           required autofocus placeholder="请输入用户名">
    
    <label for="email">邮箱：</label>
    <input type="email" id="email" name="email" 
           required placeholder="example@mail.com">
    
    <label for="birthday">生日：</label>
    <input type="date" id="birthday" name="birthday">
    
    <label for="age">年龄：</label>
    <input type="number" id="age" name="age" 
           min="1" max="150">
    
    <label for="website">个人网站：</label>
    <input type="url" id="website" name="website" 
           placeholder="https://">
    
    <button type="submit">提交</button>
  </fieldset>
</form>
```

## 四、多媒体支持

HTML5 原生支持视频和音频播放，无需依赖第三方插件。

### 4.1 视频播放

```html
<video width="640" height="360" controls poster="preview.jpg">
  <source src="movie.mp4" type="video/mp4">
  <source src="movie.webm" type="video/webm">
  <source src="movie.ogg" type="video/ogg">
  您的浏览器不支持 video 标签。
</video>
```

**video 标签常用属性：**

| 属性 | 值 | 说明 |
|------|-----|------|
| `controls` | - | 显示播放控件 |
| `autoplay` | - | 自动播放 |
| `loop` | - | 循环播放 |
| `muted` | - | 静音 |
| `poster` | URL | 视频封面图 |
| `preload` | auto/metadata/none | 预加载策略 |

### 4.2 音频播放

```html
<audio controls>
  <source src="music.mp3" type="audio/mpeg">
  <source src="music.ogg" type="audio/ogg">
  您的浏览器不支持 audio 标签。
</audio>
```

### 4.3 使用 JavaScript 控制媒体

```javascript
// 获取视频元素
const video = document.querySelector('video');

// 播放
video.play();

// 暂停
video.pause();

// 跳转到指定时间
video.currentTime = 30;

// 设置音量 (0-1)
video.volume = 0.5;

// 监听事件
video.addEventListener('ended', function() {
  console.log('视频播放结束');
});
```

## 五、Canvas 绘图

Canvas 是 HTML5 新增的用于绘制图形的元素，通过 JavaScript 可以绘制图像、制作动画和游戏。

### 5.1 基本用法

```html
<canvas id="myCanvas" width="500" height="300">
  您的浏览器不支持 Canvas。
</canvas>

<script>
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// 绘制矩形
ctx.fillStyle = '#FF0000';
ctx.fillRect(50, 50, 200, 100);

// 绘制圆形
ctx.beginPath();
ctx.arc(300, 150, 50, 0, 2 * Math.PI);
ctx.fillStyle = '#0000FF';
ctx.fill();

// 绘制文字
ctx.font = '30px Arial';
ctx.fillStyle = '#000000';
ctx.fillText('Hello Canvas', 50, 200);
</script>
```

### 5.2 Canvas 绘制示例

```javascript
// 绘制渐变矩形
const gradient = ctx.createLinearGradient(0, 0, 200, 0);
gradient.addColorStop(0, 'red');
gradient.addColorStop(1, 'blue');
ctx.fillStyle = gradient;
ctx.fillRect(10, 10, 200, 100);

// 绘制路径
ctx.beginPath();
ctx.moveTo(100, 100);
ctx.lineTo(200, 200);
ctx.lineTo(100, 200);
ctx.closePath();
ctx.strokeStyle = 'green';
ctx.lineWidth = 3;
ctx.stroke();

// 绘制图片
const img = new Image();
img.src = 'image.jpg';
img.onload = function() {
  ctx.drawImage(img, 0, 0, 300, 200);
};
```

## 六、SVG 矢量图形

SVG（Scalable Vector Graphics）是一种基于 XML 的矢量图形格式，与 Canvas 不同，SVG 是基于 DOM 的，可以被 CSS 和 JavaScript 操作。

### 6.1 内联 SVG

```html
<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <!-- 矩形 -->
  <rect x="50" y="50" width="100" height="80" 
        fill="blue" stroke="black" stroke-width="2"/>
  
  <!-- 圆形 -->
  <circle cx="250" cy="90" r="40" 
          fill="red" stroke="black" stroke-width="2"/>
  
  <!-- 文字 -->
  <text x="150" y="180" font-size="20" text-anchor="middle">
    SVG 示例
  </text>
</svg>
```

### 6.2 SVG vs Canvas 对比

| 特性 | SVG | Canvas |
|------|-----|--------|
| 图形类型 | 矢量图形 | 位图图形 |
| 缩放 | 无损缩放 | 放大失真 |
| DOM 操作 | 支持 | 不支持 |
| 事件处理 | 每个元素可绑定事件 | 需要手动计算 |
| 适用场景 | 图标、图表、Logo | 游戏、图像处理、复杂动画 |
| 文件大小 | 通常较小 | 取决于分辨率 |

## 七、本地存储

HTML5 提供了多种本地存储方案，让 Web 应用能够在客户端存储数据。

### 7.1 Web Storage

Web Storage 包含 `localStorage` 和 `sessionStorage` 两种机制。

```javascript
// localStorage - 持久化存储，关闭浏览器后数据保留
localStorage.setItem('username', '张三');
localStorage.setItem('age', '25');

// 读取数据
const username = localStorage.getItem('username');
console.log(username); // "张三"

// 删除数据
localStorage.removeItem('age');

// 清空所有数据
localStorage.clear();

// sessionStorage - 会话级存储，关闭标签页后数据清除
sessionStorage.setItem('token', 'abc123');
```

### 7.2 Storage 对比

| 特性 | localStorage | sessionStorage | Cookie |
|------|--------------|----------------|--------|
| 存储容量 | 约 5-10 MB | 约 5-10 MB | 约 4 KB |
| 生命周期 | 永久（除非手动清除） | 会话期间 | 可设置过期时间 |
| 服务端读取 | 否 | 否 | 是 |
| 作用域 | 同源窗口共享 | 同一标签页 | 可设置路径 |

### 7.3 IndexedDB

IndexedDB 是一个事务型数据库系统，适合存储大量结构化数据。

```javascript
// 打开数据库
const request = indexedDB.open('MyDatabase', 1);

request.onerror = function(event) {
  console.log('数据库打开失败');
};

request.onsuccess = function(event) {
  const db = event.target.result;
  console.log('数据库打开成功');
};

request.onupgradeneeded = function(event) {
  const db = event.target.result;
  // 创建对象存储空间
  const objectStore = db.createObjectStore('users', { keyPath: 'id' });
  objectStore.createIndex('name', 'name', { unique: false });
};
```

## 八、地理定位

HTML5 Geolocation API 允许网页获取用户的地理位置信息。

```javascript
// 获取当前位置
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const accuracy = position.coords.accuracy;
      
      console.log(`纬度: ${latitude}`);
      console.log(`经度: ${longitude}`);
      console.log(`精度: ${accuracy} 米`);
    },
    function(error) {
      switch(error.code) {
        case error.PERMISSION_DENIED:
          console.log('用户拒绝位置请求');
          break;
        case error.POSITION_UNAVAILABLE:
          console.log('位置信息不可用');
          break;
        case error.TIMEOUT:
          console.log('请求超时');
          break;
      }
    },
    {
      enableHighAccuracy: true,  // 高精度
      timeout: 5000,             // 超时时间
      maximumAge: 0              // 不缓存
    }
  );
} else {
  console.log('浏览器不支持地理定位');
}

// 持续监听位置变化
const watchId = navigator.geolocation.watchPosition(successCallback);

// 停止监听
navigator.geolocation.clearWatch(watchId);
```

## 九、Web Workers

Web Workers 允许在后台运行 JavaScript 脚本，不阻塞主线程，适合处理复杂计算。

### 9.1 创建 Worker

```javascript
// main.js - 主线程
const worker = new Worker('worker.js');

// 向 Worker 发送消息
worker.postMessage({ num: 1000000000 });

// 接收 Worker 消息
worker.onmessage = function(event) {
  console.log('计算结果:', event.data);
};

// 错误处理
worker.onerror = function(error) {
  console.error('Worker 错误:', error.message);
};

// 终止 Worker
worker.terminate();
```

```javascript
// worker.js - Worker 线程
self.onmessage = function(event) {
  const num = event.data.num;
  let sum = 0;
  
  // 耗时计算
  for (let i = 0; i < num; i++) {
    sum += i;
  }
  
  // 发送结果回主线程
  self.postMessage(sum);
};
```

## 十、WebSocket

WebSocket 提供全双工通信通道，允许服务器主动向客户端推送数据，适合实时应用。

```javascript
// 创建 WebSocket 连接
const socket = new WebSocket('wss://example.com/socket');

// 连接建立时触发
socket.onopen = function(event) {
  console.log('连接已建立');
  socket.send('Hello Server!');
};

// 接收消息时触发
socket.onmessage = function(event) {
  console.log('收到消息:', event.data);
};

// 连接关闭时触发
socket.onclose = function(event) {
  console.log('连接已关闭');
};

// 发生错误时触发
socket.onerror = function(error) {
  console.error('WebSocket 错误:', error);
};

// 发送消息
function sendMessage(message) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  }
}

// 关闭连接
socket.close();
```

**WebSocket 状态：**

| 常量 | 值 | 说明 |
|------|-----|------|
| `WebSocket.CONNECTING` | 0 | 连接正在建立中 |
| `WebSocket.OPEN` | 1 | 连接已建立，可以通信 |
| `WebSocket.CLOSING` | 2 | 连接正在关闭 |
| `WebSocket.CLOSED` | 3 | 连接已关闭 |

## 十一、应用程序缓存

HTML5 引入了应用程序缓存（Application Cache），允许网页在离线状态下访问。

```html
<!DOCTYPE html>
<html manifest="cache.manifest">
<head>
  <title>离线应用</title>
</head>
<body>
  <h1>这是一个支持离线访问的页面</h1>
</body>
</html>
```

```
# cache.manifest
CACHE MANIFEST
# 版本 1.0

CACHE:
index.html
style.css
app.js
images/logo.png

NETWORK:
*

FALLBACK:
/ /offline.html
```

## 十二、浏览器支持

最新版本的 Safari、Chrome、Firefox、Opera 及 IE9+ 支持大部分 HTML5 特性。

### 12.1 兼容性检测

```javascript
// 检测 Canvas 支持
if (document.createElement('canvas').getContext) {
  console.log('支持 Canvas');
}

// 检测本地存储支持
if (typeof(Storage) !== 'undefined') {
  console.log('支持 Web Storage');
}

// 检测地理定位支持
if (navigator.geolocation) {
  console.log('支持地理定位');
}

// 检测 WebSocket 支持
if (window.WebSocket) {
  console.log('支持 WebSocket');
}
```

### 12.2 IE 兼容性

对于 IE9 以下版本，可以使用 `html5shiv` 脚本实现兼容性支持：

```html
<!--[if lt IE 9]>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.min.js"></script>
<![endif]-->
```

## 十三、总结

HTML5 为 Web 开发带来了革命性的变化，主要特性包括：

1. **语义化标签** - 让文档结构更清晰
2. **表单增强** - 更丰富的输入类型和验证
3. **多媒体支持** - 原生音视频播放
4. **Canvas & SVG** - 强大的图形绘制能力
5. **本地存储** - localStorage、sessionStorage、IndexedDB
6. **地理定位** - 获取用户位置信息
7. **Web Workers** - 后台线程处理
8. **WebSocket** - 实时双向通信

掌握 HTML5 新特性，能够帮助你构建更现代、更强大的 Web 应用程序。
