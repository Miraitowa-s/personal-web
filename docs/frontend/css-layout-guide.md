# CSS 布局完全指南：Flexbox & Grid

> 把这两个学透，90% 的布局问题迎刃而解。

---

## 一、先搞清楚用哪个

```
一维排列（行或列）→ 用 Flexbox
二维排列（行和列同时）→ 用 Grid
```

实际使用中，Flexbox 和 Grid 经常配合——Grid 管大框架，Flexbox 管局部细节。

---

## 二、Flexbox 核心

### 基本概念

```html
<div class="container">   ← Flex 容器（父）
  <div>A</div>            ← Flex 项目（子）
  <div>B</div>
  <div>C</div>
</div>
```

```css
.container {
  display: flex;           /* 开启 Flex */
}
```

### 主轴 vs 交叉轴

```
主轴（main axis）→ 由 flex-direction 决定
交叉轴（cross axis）→ 垂直于主轴

flex-direction: row     → 主轴水平（默认）
flex-direction: column  → 主轴垂直
```

### 容器属性

```css
.container {
  /* 排列方向 */
  flex-direction: row | column | row-reverse | column-reverse;

  /* 主轴对齐 */
  justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly;

  /* 交叉轴对齐 */
  align-items: stretch | flex-start | flex-end | center | baseline;

  /* 换行 */
  flex-wrap: nowrap | wrap | wrap-reverse;

  /* 多行时的交叉轴对齐 */
  align-content: flex-start | center | space-between | ...;

  /* 间距（现代浏览器都支持） */
  gap: 16px;
}
```

### 项目属性

```css
.item {
  /* 占据剩余空间的比例 */
  flex-grow: 0;      /* 默认不扩张 */
  flex-grow: 1;      /* 平均分配剩余空间 */

  /* 收缩比例（空间不够时如何缩小） */
  flex-shrink: 1;    /* 默认等比收缩 */
  flex-shrink: 0;    /* 不收缩，固定尺寸 */

  /* 基础尺寸 */
  flex-basis: auto | 200px | 30%;

  /* 简写：grow shrink basis */
  flex: 1;           /* = flex: 1 1 0 */
  flex: 0 0 200px;   /* 固定 200px，不伸缩 */

  /* 单独调整此项目的交叉轴对齐 */
  align-self: auto | flex-start | flex-end | center | stretch;

  /* 排列顺序（数字越小越靠前） */
  order: 0;
}
```

### 常用 Flexbox 场景

**水平垂直居中：**
```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

**导航栏（左logo，右菜单）：**
```css
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

**等宽卡片列表：**
```css
.card-list {
  display: flex;
  gap: 16px;
}
.card {
  flex: 1;  /* 每张卡片等宽 */
}
```

---

## 三、Grid 核心

### 基本概念

```html
<div class="grid-container">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

```css
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;  /* 三列等宽 */
  grid-template-rows: 100px auto;       /* 第一行100px，第二行自适应 */
  gap: 16px;
}
```

### 核心单位：fr

`fr` = fraction（份数），表示剩余空间的比例：

```css
grid-template-columns: 1fr 2fr 1fr;
/* → 总4份，第一列1份，第二列2份，第三列1份 */

grid-template-columns: 200px 1fr;
/* → 第一列固定200px，第二列占剩余全部 */
```

### repeat() 函数

```css
grid-template-columns: repeat(3, 1fr);
/* = 1fr 1fr 1fr */

grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
/* 响应式：每列最少200px，自动填充列数 → 最常用！ */
```

### 子项目跨行/跨列

```css
.item-a {
  grid-column: 1 / 3;    /* 从第1条线到第3条线（跨2列） */
  grid-row: 1 / 2;       /* 占第一行 */
}

/* 等价写法 */
.item-a {
  grid-column: span 2;   /* 跨2列 */
}
```

### 命名区域（可读性最强）

```css
.container {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 240px 1fr;
}

header { grid-area: header; }
aside  { grid-area: sidebar; }
main   { grid-area: main; }
footer { grid-area: footer; }
```

---

## 四、响应式布局

### 方案一：媒体查询

```css
.grid {
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1200px) {
  .grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
```

### 方案二：auto-fill + minmax（无需媒体查询）

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
```

这一行代码实现：屏幕宽时多列，屏幕窄时自动合并成少列，不需要写任何媒体查询。

---

## 五、常见布局的完整代码

### 圣杯布局（三栏，头尾全宽）

```css
body {
  display: grid;
  grid-template:
    "header" auto
    "main"   1fr
    "footer" auto
    / 1fr;
  min-height: 100vh;
}

@media (min-width: 768px) {
  body {
    grid-template:
      "header  header  header" auto
      "left    main    right"  1fr
      "footer  footer  footer" auto
      / 200px  1fr     200px;
  }
}
```

### 瀑布流近似（CSS Columns）

```css
.masonry {
  columns: 3;
  column-gap: 16px;
}
.masonry-item {
  break-inside: avoid;
  margin-bottom: 16px;
}
```

---

## 六、调试技巧

```css
/* 给所有元素加边框，快速看清楚布局 */
* { outline: 1px solid red; }
```

浏览器 DevTools → Elements → 点击 grid/flex 标签，有可视化辅助线，非常好用。

---

## 七、速查：何时用 flex，何时用 grid

| 场景 | 推荐 |
|---|---|
| 导航栏 | Flex |
| 按钮组 | Flex |
| 卡片列表 | Grid |
| 整体页面框架 | Grid |
| 垂直居中 | Flex |
| 复杂二维布局 | Grid |
| 未知数量的项目自动排列 | Grid (auto-fill) |

---

> 没有"Flex vs Grid"的对立，只有"这个场景用哪个更合适"的问题。
