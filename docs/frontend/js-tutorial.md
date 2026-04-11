# JavaScript 教程

> 来源：[W3School 在线教程](https://www.w3school.com.cn/js/index.asp)

---

## 一、JavaScript 简介

JavaScript（简称 JS）是一门运行在浏览器和 Node.js 中的编程语言，用于为网页添加交互、动态效果和逻辑处理。

**JS 能做什么：**

- 响应用户事件（点击、输入、滚动）
- 动态修改 HTML 内容和 CSS 样式
- 发送网络请求（AJAX / Fetch）
- 存储本地数据（localStorage）
- 构建完整的前后端应用（Node.js）

**在 HTML 中引入 JS：**

```html
<!-- 内联脚本 -->
<script>
  console.log("Hello, World!");
</script>

<!-- 外部文件（推荐，放在 </body> 前）-->
<script src="main.js"></script>
```

---

## 二、基础语法

### 变量声明

```js
var name = "Alice";     // 旧式，函数作用域（不推荐）
let age = 25;           // 块级作用域，可重新赋值
const PI = 3.14;        // 块级作用域，不可重新赋值（推荐用于常量）
```

- 优先使用 `const`，需要重新赋值时用 `let`，避免使用 `var`

### 数据类型

```js
// 原始类型
let str  = "Hello";          // String
let num  = 42;               // Number
let big  = 9007199254740991n; // BigInt
let bool = true;             // Boolean
let nothing = null;          // Null（空值）
let undef = undefined;       // Undefined（未定义）
let sym = Symbol("id");      // Symbol（唯一标识）

// 引用类型
let arr = [1, 2, 3];         // Array
let obj = { name: "Bob" };   // Object
let fn  = function() {};     // Function
```

### 运算符

```js
// 算术
+  -  *  /  %  **   // 加减乘除、取余、幂

// 比较（推荐用 === 严格相等）
===  !==  >  <  >=  <=

// 逻辑
&&   ||   !          // 与、或、非

// 三元运算符
let label = age >= 18 ? "成年" : "未成年";

// 空值合并
let name = user?.name ?? "匿名";  // 若 user.name 为 null/undefined 则用 "匿名"
```

### 注释

```js
// 单行注释

/*
  多行注释
*/
```

---

## 三、条件与循环

### 条件语句

```js
if (score >= 90) {
  console.log("优秀");
} else if (score >= 60) {
  console.log("及格");
} else {
  console.log("不及格");
}

// switch
switch (day) {
  case 1: console.log("周一"); break;
  case 2: console.log("周二"); break;
  default: console.log("其他");
}
```

### 循环

```js
// for 循环
for (let i = 0; i < 5; i++) {
  console.log(i);
}

// while 循环
let n = 0;
while (n < 3) {
  console.log(n++);
}

// for...of（遍历可迭代对象）
for (const item of [1, 2, 3]) {
  console.log(item);
}

// for...in（遍历对象属性）
for (const key in { a: 1, b: 2 }) {
  console.log(key);
}
```

---

## 四、函数

### 函数声明

```js
function greet(name) {
  return `Hello, ${name}!`;
}
console.log(greet("Alice")); // Hello, Alice!
```

### 函数表达式

```js
const add = function(a, b) {
  return a + b;
};
```

### 箭头函数（ES6，推荐）

```js
const multiply = (a, b) => a * b;

const square = x => x * x;     // 单参数可省括号

const sayHi = () => {
  console.log("Hi!");
};
```

### 默认参数与剩余参数

```js
function log(msg, level = "info") {
  console.log(`[${level}] ${msg}`);
}

function sum(...nums) {
  return nums.reduce((a, b) => a + b, 0);
}
```

### 闭包

```js
function makeCounter() {
  let count = 0;
  return function() {
    return ++count;
  };
}

const counter = makeCounter();
counter(); // 1
counter(); // 2
```

---

## 五、数组

```js
const fruits = ["apple", "banana", "orange"];

// 访问
fruits[0];          // "apple"
fruits.length;      // 3

// 常用方法
fruits.push("grape");         // 末尾添加
fruits.pop();                 // 末尾删除
fruits.unshift("kiwi");       // 开头添加
fruits.shift();               // 开头删除
fruits.indexOf("banana");     // 返回索引，找不到返回 -1
fruits.includes("apple");     // true
fruits.slice(1, 3);           // 截取子数组（不修改原数组）
fruits.splice(1, 1, "mango"); // 从索引1删除1个，插入"mango"

// 高阶方法（不修改原数组）
const nums = [1, 2, 3, 4, 5];

nums.map(x => x * 2);              // [2, 4, 6, 8, 10]
nums.filter(x => x % 2 === 0);     // [2, 4]
nums.reduce((acc, x) => acc + x, 0); // 15
nums.find(x => x > 3);             // 4
nums.every(x => x > 0);            // true
nums.some(x => x > 4);             // true

// 排序
[3, 1, 2].sort((a, b) => a - b);   // [1, 2, 3]
```

---

## 六、对象

```js
const user = {
  name: "Alice",
  age: 25,
  greet() {
    return `Hi, I'm ${this.name}`;
  }
};

// 访问属性
user.name;          // "Alice"
user["age"];        // 25

// 解构赋值
const { name, age } = user;

// 展开运算符
const copy = { ...user, age: 26 };  // 浅拷贝并修改 age

// Object 常用方法
Object.keys(user);    // ["name", "age", "greet"]
Object.values(user);  // ["Alice", 25, function...]
Object.entries(user); // [["name","Alice"], ["age",25], ...]
```

---

## 七、字符串

```js
const str = "Hello, World!";

str.length;                   // 13
str.toUpperCase();            // "HELLO, WORLD!"
str.toLowerCase();            // "hello, world!"
str.includes("World");        // true
str.startsWith("Hello");      // true
str.endsWith("!");            // true
str.indexOf("o");             // 4
str.slice(7, 12);             // "World"
str.replace("World", "JS");   // "Hello, JS!"
str.split(", ");              // ["Hello", "World!"]
str.trim();                   // 去除首尾空白
str.padStart(15, "*");        // "**Hello, World!"

// 模板字符串（推荐）
const name = "Alice";
const msg = `Hello, ${name}! Today is ${new Date().toLocaleDateString()}.`;
```

---

## 八、DOM 操作

DOM（Document Object Model）是 JS 操作 HTML 的接口。

### 选取元素

```js
document.getElementById("app");          // 通过 id
document.querySelector(".btn");          // 通过 CSS 选择器（第一个）
document.querySelectorAll("li");         // 通过选择器（全部，NodeList）
document.getElementsByClassName("item"); // 通过类名
```

### 修改内容和样式

```js
const el = document.querySelector("#title");

el.textContent = "新标题";              // 修改文本
el.innerHTML = "<strong>加粗</strong>"; // 修改 HTML（注意 XSS）

el.style.color = "red";                 // 修改内联样式
el.classList.add("active");             // 添加类
el.classList.remove("hidden");          // 删除类
el.classList.toggle("open");            // 切换类
el.classList.contains("active");        // 判断类是否存在

el.setAttribute("href", "https://...");  // 设置属性
el.getAttribute("href");                // 获取属性
```

### 创建和插入元素

```js
const div = document.createElement("div");
div.className = "card";
div.textContent = "内容";

document.body.appendChild(div);             // 追加到末尾
document.body.insertBefore(div, target);    // 插入到某元素前
parent.removeChild(div);                    // 删除
```

---

## 九、事件

```js
const btn = document.querySelector("#btn");

// 添加事件监听（推荐）
btn.addEventListener("click", function(event) {
  console.log("被点击了！", event.target);
});

// 常用事件类型
// click、dblclick、mouseenter、mouseleave、mousemove
// keydown、keyup、keypress
// focus、blur、change、input、submit
// scroll、resize
// load、DOMContentLoaded

// 阻止默认行为（如阻止链接跳转）
link.addEventListener("click", e => e.preventDefault());

// 阻止冒泡
btn.addEventListener("click", e => e.stopPropagation());
```

---

## 十、异步编程

### 回调（Callback）

```js
setTimeout(() => {
  console.log("1秒后执行");
}, 1000);
```

### Promise

```js
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve("数据"), 1000);
  });
}

fetchData()
  .then(data => console.log(data))
  .catch(err => console.error(err))
  .finally(() => console.log("完成"));
```

### Async / Await（推荐）

```js
async function loadUser() {
  try {
    const res = await fetch("/api/user");
    const user = await res.json();
    console.log(user);
  } catch (err) {
    console.error("出错：", err);
  }
}

loadUser();
```

---

## 十一、Fetch API（网络请求）

```js
// GET 请求
const res = await fetch("https://api.example.com/data");
const data = await res.json();

// POST 请求
const res = await fetch("/api/create", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Alice", age: 25 })
});
const result = await res.json();
```

---

## 十二、本地存储

```js
// localStorage（持久，关闭浏览器也保留）
localStorage.setItem("theme", "dark");
localStorage.getItem("theme");    // "dark"
localStorage.removeItem("theme");
localStorage.clear();

// sessionStorage（会话级别，关闭标签页清除）
sessionStorage.setItem("cache", JSON.stringify({ key: "val" }));
const cache = JSON.parse(sessionStorage.getItem("cache"));
```

---

## 十三、ES6+ 常用特性

```js
// 解构赋值
const [a, b, ...rest] = [1, 2, 3, 4];
const { x, y = 10 } = { x: 5 };

// 展开运算符
const merged = [...arr1, ...arr2];
const obj = { ...defaults, ...overrides };

// 可选链
const city = user?.address?.city;  // 不报错，返回 undefined

// 空值合并
const name = input ?? "默认值";

// 模块化
// export.js
export const PI = 3.14;
export default function main() {}

// import
import main, { PI } from "./export.js";

// class
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return `${this.name} 叫了`;
  }
}

class Dog extends Animal {
  speak() {
    return `${this.name} 汪汪叫`;
  }
}
```

---

## 十四、JSON

JSON（JavaScript Object Notation）是轻量级的数据交换格式。

```js
// JS 对象 → JSON 字符串
const json = JSON.stringify({ name: "Alice", age: 25 });
// '{"name":"Alice","age":25}'

// JSON 字符串 → JS 对象
const obj = JSON.parse('{"name":"Alice","age":25}');
obj.name; // "Alice"

// 格式化输出
console.log(JSON.stringify(obj, null, 2));
```

---

## 参考资源

- [W3School JavaScript 教程](https://www.w3school.com.cn/js/index.asp)
- [MDN JavaScript 文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)
- [现代 JavaScript 教程](https://zh.javascript.info/)
