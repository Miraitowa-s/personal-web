# CSS3 完全指南

CSS3 是最新的 CSS 标准，在 CSS2.1 的基础上增加了许多强大的新特性，让网页设计变得更加灵活和丰富。本指南将全面介绍 CSS3 的核心特性和实际应用。

## 一、CSS3 简介

### 1.1 什么是 CSS3

CSS3 将 CSS 规范划分为多个独立的模块，每个模块可以独立发展和更新。这种模块化的设计使得浏览器可以逐步实现新特性，开发者也可以根据需要使用特定功能。

**CSS3 的主要优势：**
- 无需依赖图片即可实现圆角、阴影等视觉效果
- 强大的 2D/3D 变换和动画能力
- 灵活的布局系统（Flexbox、Grid）
- 更好的响应式设计支持

### 1.2 浏览器前缀

在 CSS3 标准完全确定之前，浏览器厂商使用前缀来实验新特性：

```css
/* 带前缀的写法 */
-webkit-border-radius: 10px;  /* Chrome/Safari */
-moz-border-radius: 10px;     /* Firefox */
-ms-border-radius: 10px;      /* IE */
-o-border-radius: 10px;       /* Opera */
border-radius: 10px;          /* 标准写法 */
```

现代浏览器大多已经支持无前缀的标准写法，但了解前缀对于兼容性处理仍然很重要。

## 二、边框与圆角

### 2.1 圆角边框 border-radius

```css
/* 统一圆角 */
.box {
  border-radius: 10px;
}

/* 分别设置四个角 */
.box {
  border-radius: 10px 20px 30px 40px;  /* 左上 右上 右下 左下 */
}

/* 椭圆角 */
.box {
  border-radius: 50px / 30px;  /* 水平半径 / 垂直半径 */
}

/* 圆形 */
.circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

/* 半圆 */
.semicircle {
  width: 200px;
  height: 100px;
  border-radius: 100px 100px 0 0;
}
```

### 2.2 盒子阴影 box-shadow

```css
/* 基本阴影 */
.box {
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
  /* 水平偏移 垂直偏移 模糊半径 颜色 */
}

/* 内阴影 */
.box {
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
}

/* 多重阴影 */
.box {
  box-shadow: 
    3px 3px 10px rgba(0, 0, 0, 0.2),
    -3px -3px 10px rgba(255, 255, 255, 0.5);
}

/* 发光效果 */
.glow {
  box-shadow: 0 0 20px #3498db;
}
```

### 2.3 边框图片 border-image

```css
.border-img {
  border: 30px solid transparent;
  border-image: url('border.png') 30 round;
  /* 图片路径 切割宽度 填充方式 */
}

/* 渐变边框 */
.gradient-border {
  border: 10px solid;
  border-image: linear-gradient(45deg, #ff6b6b, #4ecdc4) 1;
}
```

## 三、文字效果

### 3.1 文字阴影 text-shadow

```css
/* 基本阴影 */
h1 {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

/* 多重阴影 */
h1 {
  text-shadow: 
    1px 1px 0 #ccc,
    2px 2px 0 #999,
    3px 3px 0 #666;
}

/* 发光文字 */
.glow-text {
  text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff;
}

/* 浮雕效果 */
.emboss {
  text-shadow: 1px 1px 0 #fff, -1px -1px 0 #999;
}
```

### 3.2 文字溢出处理

```css
/* 单行省略 */
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 多行省略（WebKit） */
.multi-ellipsis {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### 3.3 自定义字体 @font-face

```css
@font-face {
  font-family: 'MyFont';
  src: url('myfont.woff2') format('woff2'),
       url('myfont.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

body {
  font-family: 'MyFont', sans-serif;
}
```

## 四、2D 转换 transform

### 4.1 位移 translate

```css
/* 水平移动 */
.box {
  transform: translateX(50px);
}

/* 垂直移动 */
.box {
  transform: translateY(-30px);
}

/* 同时移动 */
.box {
  transform: translate(50px, 30px);
}

/* 百分比（相对于自身尺寸） */
.box {
  transform: translate(-50%, -50%);  /* 常用于居中 */
}
```

### 4.2 旋转 rotate

```css
/* 顺时针旋转 */
.box {
  transform: rotate(45deg);
}

/* 逆时针旋转 */
.box {
  transform: rotate(-30deg);
}

/* 围绕指定点旋转 */
.box {
  transform-origin: top left;  /* 设置旋转中心 */
  transform: rotate(15deg);
}
```

### 4.3 缩放 scale

```css
/* 等比缩放 */
.box {
  transform: scale(1.5);  /* 放大1.5倍 */
}

/* 非等比缩放 */
.box {
  transform: scaleX(2) scaleY(0.5);
}

/* 缩小 */
.box {
  transform: scale(0.8);
}
```

### 4.4 倾斜 skew

```css
/* 水平倾斜 */
.box {
  transform: skewX(30deg);
}

/* 垂直倾斜 */
.box {
  transform: skewY(15deg);
}

/* 同时倾斜 */
.box {
  transform: skew(30deg, 15deg);
}
```

### 4.5 矩阵 matrix

```css
/* matrix(scaleX, skewY, skewX, scaleY, translateX, translateY) */
.box {
  transform: matrix(1, 0.5, -0.5, 1, 100, 50);
}
```

### 4.6 组合变换

```css
.box {
  transform: translate(50px, 50px) rotate(45deg) scale(1.5);
}
```

**注意：** 变换顺序很重要，不同的顺序会产生不同的结果。

## 五、3D 转换

### 5.1 3D 变换基础

```css
.container {
  perspective: 1000px;  /* 透视距离 */
}

.box {
  transform-style: preserve-3d;  /* 保持3D效果 */
  transform: rotateX(45deg) rotateY(45deg);
}
```

### 5.2 3D 变换函数

```css
/* 绕X轴旋转 */
.box {
  transform: rotateX(60deg);
}

/* 绕Y轴旋转 */
.box {
  transform: rotateY(45deg);
}

/* 绕Z轴旋转 */
.box {
  transform: rotateZ(30deg);
}

/* 3D位移 */
.box {
  transform: translate3d(50px, 50px, 100px);
}

/* 3D缩放 */
.box {
  transform: scale3d(1.5, 1.5, 1.5);
}
```

### 5.3 3D 立方体示例

```html
<div class="cube">
  <div class="face front">前</div>
  <div class="face back">后</div>
  <div class="face left">左</div>
  <div class="face right">右</div>
  <div class="face top">上</div>
  <div class="face bottom">下</div>
</div>
```

```css
.cube {
  width: 200px;
  height: 200px;
  position: relative;
  transform-style: preserve-3d;
  animation: rotate 5s infinite linear;
}

.face {
  position: absolute;
  width: 200px;
  height: 200px;
  background: rgba(52, 152, 219, 0.8);
  border: 2px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.front  { transform: translateZ(100px); }
.back   { transform: rotateY(180deg) translateZ(100px); }
.left   { transform: rotateY(-90deg) translateZ(100px); }
.right  { transform: rotateY(90deg) translateZ(100px); }
.top    { transform: rotateX(90deg) translateZ(100px); }
.bottom { transform: rotateX(-90deg) translateZ(100px); }

@keyframes rotate {
  from { transform: rotateX(0) rotateY(0); }
  to { transform: rotateX(360deg) rotateY(360deg); }
}
```

## 六、过渡效果 transition

### 6.1 基本用法

```css
/* 简单过渡 */
.box {
  width: 100px;
  height: 100px;
  background: #3498db;
  transition: width 0.3s ease;
}

.box:hover {
  width: 200px;
}

/* 多属性过渡 */
.box {
  transition: width 0.3s ease, height 0.3s ease, background 0.5s linear;
}

/* 简写形式 */
.box {
  transition: all 0.3s ease;
}
```

### 6.2 过渡属性详解

| 属性 | 说明 | 示例 |
|------|------|------|
| `transition-property` | 指定过渡的属性 | `width, height` |
| `transition-duration` | 过渡持续时间 | `0.3s`, `300ms` |
| `transition-timing-function` | 速度曲线 | `ease`, `linear`, `ease-in-out` |
| `transition-delay` | 延迟时间 | `0.5s` |

### 6.3 时间函数

```css
/* 预设值 */
.box {
  transition-timing-function: ease;        /* 慢-快-慢 */
  transition-timing-function: linear;      /* 匀速 */
  transition-timing-function: ease-in;     /* 慢开始 */
  transition-timing-function: ease-out;    /* 慢结束 */
  transition-timing-function: ease-in-out; /* 慢-快-慢 */
}

/* 贝塞尔曲线 */
.box {
  transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* 步进 */
.box {
  transition-timing-function: steps(5, end);
}
```

### 6.4 实际应用示例

```css
/* 按钮悬停效果 */
.btn {
  padding: 12px 24px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn:hover {
  background: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* 图片悬停效果 */
.img-container img {
  transition: transform 0.5s ease, filter 0.5s ease;
}

.img-container:hover img {
  transform: scale(1.1);
  filter: brightness(1.1);
}
```

## 七、动画 animation

### 7.1 关键帧动画

```css
/* 定义动画 */
@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 使用动画 */
.box {
  animation: slideIn 0.5s ease-out;
}
```

### 7.2 复杂关键帧

```css
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
}

.box {
  animation: bounce 1s ease infinite;
}
```

### 7.3 动画属性详解

```css
.box {
  animation-name: slideIn;           /* 动画名称 */
  animation-duration: 1s;            /* 持续时间 */
  animation-timing-function: ease;   /* 速度曲线 */
  animation-delay: 0.5s;             /* 延迟 */
  animation-iteration-count: 3;      /* 播放次数 (infinite 无限) */
  animation-direction: alternate;    /* 播放方向 (normal/reverse/alternate) */
  animation-fill-mode: forwards;     /* 结束状态 (none/forwards/backwards/both) */
  animation-play-state: running;     /* 播放状态 (running/paused) */
}

/* 简写形式 */
.box {
  animation: slideIn 1s ease 0.5s 3 alternate forwards;
}
```

### 7.4 常用动画效果

```css
/* 淡入 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 淡出 */
@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* 脉冲 */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* 旋转 */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 抖动 */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

/* 加载动画 */
.loading {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
```

## 八、多列布局

### 8.1 基本多列

```css
.article {
  column-count: 3;           /* 列数 */
  column-gap: 40px;          /* 列间距 */
  column-rule: 1px solid #ccc;  /* 列分隔线 */
}
```

### 8.2 多列属性

```css
.article {
  /* 列宽（浏览器自动计算列数） */
  column-width: 300px;
  
  /* 列间距 */
  column-gap: 2em;
  
  /* 分隔线 */
  column-rule-width: 2px;
  column-rule-style: dashed;
  column-rule-color: #999;
  column-rule: 2px dashed #999;  /* 简写 */
  
  /* 跨列元素 */
  h2 {
    column-span: all;  /* 标题跨所有列 */
  }
}
```

## 九、弹性盒子 Flexbox

Flexbox 是 CSS3 引入的一维布局系统，特别适合组件级布局。

### 9.1 基本概念

```css
.container {
  display: flex;           /* 块级弹性容器 */
  /* 或 */
  display: inline-flex;    /* 行内弹性容器 */
}
```

**Flexbox 核心概念：**
- **主轴（Main Axis）**：flex 元素排列的主要方向
- **交叉轴（Cross Axis）**：垂直于主轴的方向
- **flex 容器**：设置了 `display: flex` 的元素
- **flex 项目**：容器的直接子元素

### 9.2 容器属性

```css
.container {
  /* 主轴方向 */
  flex-direction: row;           /* 水平（默认） */
  flex-direction: row-reverse;   /* 水平反向 */
  flex-direction: column;        /* 垂直 */
  flex-direction: column-reverse;/* 垂直反向 */
  
  /* 换行 */
  flex-wrap: nowrap;             /* 不换行（默认） */
  flex-wrap: wrap;               /* 换行 */
  flex-wrap: wrap-reverse;       /* 反向换行 */
  
  /* 简写 */
  flex-flow: row wrap;
  
  /* 主轴对齐 */
  justify-content: flex-start;   /* 起始对齐 */
  justify-content: flex-end;     /* 末尾对齐 */
  justify-content: center;       /* 居中对齐 */
  justify-content: space-between;/* 两端对齐 */
  justify-content: space-around; /* 均匀分布 */
  justify-content: space-evenly; /* 完全均匀 */
  
  /* 交叉轴对齐（单行） */
  align-items: stretch;          /* 拉伸（默认） */
  align-items: flex-start;       /* 顶部对齐 */
  align-items: flex-end;         /* 底部对齐 */
  align-items: center;           /* 居中对齐 */
  align-items: baseline;         /* 基线对齐 */
  
  /* 交叉轴对齐（多行） */
  align-content: stretch;
  align-content: flex-start;
  align-content: flex-end;
  align-content: center;
  align-content: space-between;
  align-content: space-around;
  
  /* 间距（Gap） */
  gap: 20px;                     /* 行列间距 */
  row-gap: 20px;                 /* 行间距 */
  column-gap: 10px;              /* 列间距 */
}
```

### 9.3 项目属性

```css
.item {
  /* 排序 */
  order: 1;                      /* 默认 0，数值越小越靠前 */
  
  /* 放大比例 */
  flex-grow: 1;                  /* 默认 0，剩余空间分配比例 */
  
  /* 缩小比例 */
  flex-shrink: 1;                /* 默认 1，空间不足时缩小比例 */
  
  /* 基础大小 */
  flex-basis: 200px;             /* 默认 auto */
  
  /* 简写 */
  flex: 1;                       /* flex-grow: 1, flex-shrink: 1, flex-basis: 0% */
  flex: 0 0 200px;               /* 不放大不缩小，固定200px */
  flex: 1 1 auto;                /* 可放大可缩小，基础auto */
  
  /* 单独对齐 */
  align-self: auto;              /* 继承容器 align-items */
  align-self: flex-start;
  align-self: flex-end;
  align-self: center;
  align-self: stretch;
}
```

### 9.4 实用布局示例

```css
/* 水平垂直居中 */
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

/* 等高列 */
.columns {
  display: flex;
}
.columns > div {
  flex: 1;
}

/* 底部固定 */
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.content {
  flex: 1;
}

/* 响应式导航 */
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.nav-links {
  display: flex;
  gap: 20px;
}
```

## 十、网格布局 Grid

CSS Grid 是二维布局系统，可以同时处理行和列，适合页面级布局。

### 10.1 基本概念

```css
.container {
  display: grid;
  /* 或 */
  display: inline-grid;
}
```

### 10.2 定义网格

```css
.container {
  /* 定义列 */
  grid-template-columns: 200px 200px 200px;
  grid-template-columns: 1fr 1fr 1fr;        /* 三等分 */
  grid-template-columns: repeat(3, 1fr);      /* 重复 */
  grid-template-columns: 200px 1fr 200px;     /* 两侧固定，中间自适应 */
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));  /* 响应式 */
  
  /* 定义行 */
  grid-template-rows: 100px auto 100px;
  
  /* 间距 */
  gap: 20px;
  row-gap: 20px;
  column-gap: 10px;
  
  /* 区域命名 */
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
}
```

### 10.3 项目定位

```css
.item {
  /* 列起始/结束 */
  grid-column-start: 1;
  grid-column-end: 3;
  grid-column: 1 / 3;           /* 简写 */
  grid-column: span 2;          /* 跨2列 */
  
  /* 行起始/结束 */
  grid-row-start: 1;
  grid-row-end: 3;
  grid-row: 1 / 3;
  grid-row: span 2;
  
  /* 区域 */
  grid-area: header;
  
  /* 简写（行起始/列起始/行结束/列结束） */
  grid-area: 1 / 1 / 3 / 4;
}
```

### 10.4 完整布局示例

```css
.page {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 60px 1fr 40px;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  min-height: 100vh;
  gap: 0;
}

header {
  grid-area: header;
  background: #333;
  color: white;
}

aside {
  grid-area: sidebar;
  background: #f4f4f4;
}

main {
  grid-area: main;
  padding: 20px;
}

footer {
  grid-area: footer;
  background: #333;
  color: white;
}
```

## 十一、媒体查询

媒体查询是响应式设计的核心，允许根据设备特性应用不同的样式。

### 11.1 基本语法

```css
/* 屏幕宽度小于 768px */
@media screen and (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}

/* 屏幕宽度大于 1024px */
@media screen and (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}

/* 屏幕宽度在 768px 到 1024px 之间 */
@media screen and (min-width: 768px) and (max-width: 1024px) {
  .sidebar {
    width: 200px;
  }
}
```

### 11.2 常用断点

```css
/* 手机 */
@media screen and (max-width: 576px) {
  /* 手机样式 */
}

/* 平板 */
@media screen and (min-width: 577px) and (max-width: 768px) {
  /* 平板样式 */
}

/* 小型桌面 */
@media screen and (min-width: 769px) and (max-width: 992px) {
  /* 小型桌面样式 */
}

/* 桌面 */
@media screen and (min-width: 993px) and (max-width: 1200px) {
  /* 桌面样式 */
}

/* 大屏幕 */
@media screen and (min-width: 1201px) {
  /* 大屏幕样式 */
}
```

### 11.3 其他媒体特性

```css
/* 深色模式 */
@media (prefers-color-scheme: dark) {
  body {
    background: #1a1a1a;
    color: #fff;
  }
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}

/* 横屏 */
@media (orientation: landscape) {
  .sidebar {
    display: block;
  }
}

/* 打印 */
@media print {
  .no-print {
    display: none;
  }
}
```

## 十二、其他实用特性

### 12.1 渐变背景

```css
/* 线性渐变 */
.box {
  background: linear-gradient(to right, #ff6b6b, #4ecdc4);
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  background: linear-gradient(to right, red, yellow, green);
}

/* 径向渐变 */
.box {
  background: radial-gradient(circle, #ff6b6b, #4ecdc4);
  background: radial-gradient(ellipse at top, #ff6b6b, transparent);
}

/* 重复渐变 */
.box {
  background: repeating-linear-gradient(
    45deg,
    #606dbc,
    #606dbc 10px,
    #465298 10px,
    #465298 20px
  );
}
```

### 12.2 背景新特性

```css
.box {
  /* 多重背景 */
  background: 
    url('overlay.png') no-repeat center,
    url('bg.jpg') no-repeat center/cover;
  
  /* 背景大小 */
  background-size: cover;        /* 覆盖整个区域 */
  background-size: contain;      /* 完整显示图片 */
  background-size: 100% 100%;    /* 拉伸 */
  
  /* 背景裁剪 */
  background-clip: padding-box;  /* 不延伸到边框 */
  background-clip: content-box;  /* 仅内容区域
  
  /* 背景原点 */
  background-origin: border-box;
}
```

### 12.3 选择器增强

```css
/* 属性选择器 */
[data-type] { }                  /* 有 data-type 属性 */
[data-type="primary"] { }        /* 精确匹配 */
[data-type^="btn"] { }           /* 以 btn 开头 */
[data-type$="large"] { }         /* 以 large 结尾 */
[data-type*="icon"] { }          /* 包含 icon */

/* 结构伪类 */
li:first-child { }               /* 第一个子元素 */
li:last-child { }                /* 最后一个子元素 */
li:nth-child(2n) { }             /* 偶数项 */
li:nth-child(odd) { }            /* 奇数项 */
li:nth-of-type(3) { }            /* 第3个同类型 */
li:not(.active) { }              /* 排除 .active */

/* 表单伪类 */
input:focus { }                  /* 获得焦点 */
input:checked { }                /* 选中状态 */
input:disabled { }               /* 禁用状态 */
input:valid { }                  /* 验证通过 */
input:invalid { }                /* 验证失败 */
input:placeholder-shown { }      /* 显示占位符 */
```

## 十三、总结

CSS3 为 Web 开发带来了革命性的变化，核心特性包括：

| 特性 | 用途 |
|------|------|
| 圆角/阴影 | 视觉效果，无需图片 |
| 2D/3D 变换 | 元素变形、旋转、缩放 |
| 过渡/动画 | 平滑的状态变化和复杂动画 |
| Flexbox | 一维布局（组件级） |
| Grid | 二维布局（页面级） |
| 媒体查询 | 响应式设计 |
| 渐变 | 丰富的背景效果 |

掌握这些 CSS3 特性，能够帮助你创建更现代、更美观、更响应式的 Web 界面。
