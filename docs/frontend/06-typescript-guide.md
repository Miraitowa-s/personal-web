# TypeScript 完全指南

## 概述

TypeScript 是微软开发的开源编程语言，是 JavaScript 的超集，添加了可选的静态类型检查和面向对象特性。TypeScript 可以在编译阶段发现错误，提供更好的代码提示和重构支持。

### TypeScript vs JavaScript

| 特性 | JavaScript | TypeScript |
|------|------------|------------|
| 类型系统 | 动态类型 | 静态类型（可选） |
| 编译 | 无需编译 | 需要编译为 JS |
| IDE 支持 | 基础 | 强大的类型推断 |
| 错误检测 | 运行时 | 编译时 |
| 面向对象 | 原型继承 | 类、接口、泛型 |
| 学习曲线 | 低 | 中等 |
| 社区生态 | 成熟 | 快速成长 |

### TypeScript 优势

- **编译时类型检查** - 减少运行时错误
- **更好的 IDE 支持** - 智能提示、代码导航
- **代码可维护性** - 大型项目更易维护
- **面向对象特性** - 接口、泛型、装饰器
- **现代 JavaScript 支持** - 编译为兼容版本

---

## 环境搭建

### 安装 TypeScript

```bash
# 全局安装
npm install -g typescript

# 项目内安装
npm install --save-dev typescript

# 验证安装
tsc --version
```

### 配置文件

```bash
# 初始化 tsconfig.json
npx tsc --init
```

```json
{
    "compilerOptions": {
        "target": "ES2020",
        "module": "ESNext",
        "lib": ["ES2020", "DOM"],
        "outDir": "./dist",
        "rootDir": "./src",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "moduleResolution": "node",
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "jsx": "react-jsx"
    },
    "include": ["src"],
    "exclude": ["node_modules"]
}
```

### 编译运行

```bash
# 编译单个文件
tsc hello.ts

# 监视模式
tsc --watch

# 使用配置文件编译
tsc

# 编译并执行
tsc hello.ts && node hello.js
```

---

## 基础类型

### 基本类型

```typescript
// 字符串
let name: string = '张三';
let greeting: string = `你好, ${name}`;

// 数字
let age: number = 25;
let price: number = 99.9;
let binary: number = 0b1010; // 二进制

// 布尔值
let isActive: boolean = true;
let isDone: boolean = false;

// undefined 和 null
let u: undefined = undefined;
let n: null = null;
```

### 数组

```typescript
// 方式一
let list1: number[] = [1, 2, 3];

// 方式二：泛型语法
let list2: Array<number> = [1, 2, 3];

// 只读数组
let readonlyList: ReadonlyArray<number> = [1, 2, 3];
// readonlyList.push(4); // 错误！
```

### 元组 (Tuple)

```typescript
// 定义元组
let tuple: [string, number];
tuple = ['hello', 123]; // ✅
tuple = [123, 'hello']; // ❌ 类型错误

// 可选元素
let optionalTuple: [string, number?];
optionalTuple = ['hello'];    // ✅
optionalTuple = ['hello', 123]; // ✅

// 解构赋值
const [first, second] = tuple;
console.log(first); // 'hello'
```

### 枚举 (Enum)

```typescript
// 数字枚举
enum Status {
    Pending = 1,
    Active,   // 2
    Completed // 3
}

let currentStatus: Status = Status.Active;
console.log(Status[2]); // 'Active'

// 字符串枚举
enum Direction {
    Up = 'UP',
    Down = 'DOWN',
    Left = 'LEFT',
    Right = 'RIGHT'
}

// 常量枚举（性能更好）
const enum Color {
    Red = '#ff0000',
    Green = '#00ff00',
    Blue = '#0000ff'
}
```

### Any 和 Unknown

```typescript
// any - 任意类型，绕过类型检查
let value: any = 123;
value = 'string';  // ✅
value = true;       // ✅
value.foo();        // ✅ 不会报错

// unknown - 未知类型，必须进行类型检查
let unknownValue: unknown = 123;
// unknownValue.foo(); // ❌ 错误

if (typeof unknownValue === 'string') {
    console.log(unknownValue.toUpperCase()); // ✅
}
```

### Void 和 Never

```typescript
// void - 没有返回值
function logMessage(message: string): void {
    console.log(message);
}

// never - 永远不会返回
function throwError(message: string): never {
    throw new Error(message);
}

function infiniteLoop(): never {
    while (true) {}
}
```

---

## 接口 (Interface)

### 基础定义

```typescript
interface User {
    id: number;
    name: string;
    email: string;
    age?: number;           // 可选属性
    readonly createdAt: Date; // 只读属性
}

// 使用接口
function createUser(user: User): User {
    return {
        ...user,
        createdAt: new Date()
    };
}

const user: User = {
    id: 1,
    name: '张三',
    email: 'zhang@example.com'
};
```

### 接口继承

```typescript
interface Animal {
    name: string;
}

interface Dog extends Animal {
    breed: string;
}

interface GuideDog extends Dog {
    certified: boolean;
}

const guideDog: GuideDog = {
    name: '旺财',
    breed: '金毛',
    certified: true
};
```

### 接口描述函数

```typescript
interface FunctionType {
    (x: number, y: number): number;
}

const add: FunctionType = (a, b) => a + b;
const multiply: FunctionType = (a, b) => a * b;
```

### 可索引类型

```typescript
interface StringArray {
    [index: number]: string;
}

const myArray: StringArray = ['a', 'b', 'c'];
console.log(myArray[0]); // 'a'

// 字符串索引签名
interface Dictionary {
    [key: string]: any;
}

const dict: Dictionary = {
    name: '张三',
    age: 25
};
```

### 接口合并

```typescript
interface A {
    x: number;
}

interface A {
    y: number;
}
// A 现在有 x 和 y 两个属性
```

---

## 类型别名 (Type)

### 基础用法

```typescript
type ID = string | number;
type Point = { x: number; y: number };
type Callback = (data: string) => void;

// 组合类型
type Result = Success | Error;

interface Success {
    type: 'success';
    data: any;
}

interface Error {
    type: 'error';
    message: string;
}
```

### 类型别名 vs 接口

| 特性 | Type Alias | Interface |
|------|------------|-----------|
| 定义对象 | ✅ | ✅ |
| 定义函数 | ✅ | ✅ |
| 扩展 | 交叉类型 | extends |
| 合并 | ❌ | ✅ |
| 计算属性 | ✅ | ❌ |

---

## 泛型 (Generics)

### 基础泛型

```typescript
// 泛型函数
function identity<T>(arg: T): T {
    return arg;
}

console.log(identity<string>('hello')); // 'hello'
console.log(identity(123));             // 123 类型推断

// 泛型接口
interface GenericContainer<T> {
    value: T;
    getValue(): T;
}

const container: GenericContainer<number> = {
    value: 123,
    getValue() { return this.value; }
};
```

### 泛型约束

```typescript
// 使用 extends 约束
interface HasLength {
    length: number;
}

function logLength<T extends HasLength>(arg: T): T {
    console.log(arg.length);
    return arg;
}

logLength('hello');     // ✅
logLength([1, 2, 3]); // ✅
logLength({ length: 10 }); // ✅
logLength(123);        // ❌ 数字没有 length

// 约束属性
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

const user = { name: '张三', age: 25 };
getProperty(user, 'name'); // ✅ string
getProperty(user, 'age');  // ✅ number
getProperty(user, 'id');   // ❌
```

### 泛型类

```typescript
class DataStore<T> {
    private data: T[] = [];
    
    add(item: T): void {
        this.data.push(item);
    }
    
    get(index: number): T | undefined {
        return this.data[index];
    }
    
    getAll(): T[] {
        return [...this.data];
    }
}

const numberStore = new DataStore<number>();
numberStore.add(1);
numberStore.add(2);

const stringStore = new DataStore<string>();
stringStore.add('hello');
stringStore.add('world');
```

### 泛型工具类型

```typescript
// Partial<T> - 所有属性变为可选
interface User {
    id: number;
    name: string;
    email: string;
}

type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; }

// Required<T> - 所有属性变为必需
type RequiredUser = Required<User>;

// Pick<T, K> - 选取部分属性
type UserPreview = Pick<User, 'id' | 'name'>;
// { id: number; name: string; }

// Omit<T, K> - 排除部分属性
type UserWithoutEmail = Omit<User, 'email'>;
// { id: number; name: string; }

// Record<K, V> - 创建键值对类型
type Role = 'admin' | 'user' | 'guest';
type Permissions = Record<Role, boolean>;
// { admin: boolean; user: boolean; guest: boolean; }
```

---

## 函数

### 函数类型

```typescript
// 声明式
function add(x: number, y: number): number {
    return x + y;
}

// 函数表达式
const multiply = function(x: number, y: number): number {
    return x * y;
};

// 箭头函数
const divide = (x: number, y: number): number => {
    if (y === 0) throw new Error('除数不能为0');
    return x / y;
};

// 无返回值
const log = (message: string): void => {
    console.log(message);
};
```

### 可选参数和默认参数

```typescript
// 可选参数（必须放在必需参数后面）
function buildName(firstName: string, lastName?: string): string {
    return lastName ? `${firstName} ${lastName}` : firstName;
}

buildName('张');           // '张'
buildName('张', '三');     // '张三'

// 默认参数
function greet(name: string = 'Guest'): string {
    return `Hello, ${name}!`;
}

greet();        // 'Hello, Guest!'
greet('张三');  // 'Hello, 张三!'
```

### 剩余参数

```typescript
function sum(...numbers: number[]): number {
    return numbers.reduce((a, b) => a + b, 0);
}

console.log(sum(1, 2, 3, 4, 5)); // 15

// 展开参数
const nums = [1, 2, 3];
console.log(sum(...nums)); // 6
```

### 函数重载

```typescript
// 联合类型实现
function reverse(input: string): string;
function reverse(input: Array<any>): Array<any>;
function reverse(input: string | Array<any>): string | Array<any> {
    if (typeof input === 'string') {
        return input.split('').reverse().join('');
    }
    return input.reverse();
}

console.log(reverse('hello')); // 'olleh'
console.log(reverse([1, 2, 3])); // [3, 2, 1]

// 复杂重载示例
interface DateOrString {
    (date: Date): Date;
    (date: string): string;
}
```

---

## 类 (Class)

### 基础定义

```typescript
class Animal {
    name: string;
    
    constructor(name: string) {
        this.name = name;
    }
    
    move(distance: number = 0): void {
        console.log(`${this.name} moved ${distance}m`);
    }
}

const animal = new Animal('动物');
animal.move(10);
```

### 访问修饰符

```typescript
class Person {
    public name: string;           // 公开
    private age: number;           // 私有，仅类内部可访问
    protected address: string;     // 受保护，类和子类可访问
    readonly id: number;           // 只读
    
    constructor(name: string, age: number, address: string, id: number) {
        this.name = name;
        this.age = age;
        this.address = address;
        this.id = id;
    }
    
    public introduce(): void {
        console.log(`我是${this.name}，今年${this.age}岁`);
    }
}

class Student extends Person {
    private grade: string;
    
    constructor(name: string, age: number, address: string, id: number, grade: string) {
        super(name, age, address, id);
        this.grade = grade;
    }
    
    public study(): void {
        // 可以访问受保护的 address
        console.log(`在${this.address}学习，${this.grade}年级`);
    }
}

const person = new Person('张三', 25, '北京', 1);
console.log(person.name);      // ✅
console.log(person.age);        // ❌ 私有属性
console.log(person.address);    // ❌ 受保护属性
```

### 抽象类

```typescript
abstract class Shape {
    abstract getArea(): number;
    
    print(): void {
        console.log(`面积: ${this.getArea()}`);
    }
}

class Circle extends Shape {
    constructor(public radius: number) {
        super();
    }
    
    getArea(): number {
        return Math.PI * this.radius ** 2;
    }
}

class Rectangle extends Shape {
    constructor(public width: number, public height: number) {
        super();
    }
    
    getArea(): number {
        return this.width * this.height;
    }
}

const shapes: Shape[] = [
    new Circle(5),
    new Rectangle(4, 6)
];

shapes.forEach(shape => shape.print());
```

### 接口实现

```typescript
interface Flyable {
    fly(): void;
}

interface Swimmable {
    swim(): void;
}

class Duck implements Flyable, Swimmable {
    fly(): void {
        console.log('鸭子飞');
    }
    
    swim(): void {
        console.log('鸭子游泳');
    }
}
```

---

## 命名空间 (Namespace)

```typescript
// MyMath.ts
namespace MyMath {
    export const PI = 3.14159;
    
    export function add(a: number, b: number): number {
        return a + b;
    }
    
    export function circleArea(radius: number): number {
        return PI * radius * radius;
    }
}

// 使用
console.log(MyMath.add(1, 2));           // 3
console.log(MyMath.circleArea(5));       // 78.54

// 别名
import MathAlias = MyMath;
```

---

## 模块 (Module)

### 导出

```typescript
// 导出变量
export const VERSION = '1.0.0';
export const AUTHOR = '张三';

// 导出函数
export function add(a: number, b: number): number {
    return a + b;
}

// 导出类
export class User {
    constructor(public name: string, public age: number) {}
    
    introduce(): void {
        console.log(`我是${this.name}，${this.age}岁`);
    }
}

// 默认导出（每个文件只能有一个）
export default class Config {
    static readonly DEFAULT_TIMEOUT = 30000;
}
```

### 导入

```typescript
// 命名导入
import { add, User, VERSION } from './math';

// 重命名导入
import { add as sum, User as UserClass } from './math';

// 默认导入
import Config from './config';

// 全局导入
import * as MyMath from './math';

// 类型导入
import type { User } from './types';

// 动态导入
const module = await import('./math');
```

---

## 声明文件

### 声明基础

```typescript
// global.d.ts
declare const APP_VERSION: string;
declare function greet(name: string): string;
declare class User {
    name: string;
    constructor(name: string);
}

// 声明模块
declare module 'my-module' {
    export function doSomething(): void;
    export class MyClass {}
}

// 声明 jQuery
declare const $: (selector: string) => any;
```

### 三斜线指令

```typescript
/// <reference types="node" />
/// <reference path="./other.d.ts" />
```

---

## 装饰器 (Decorators)

### 装饰器简介

```typescript
// 实验性功能，需要在 tsconfig.json 启用
// "experimentalDecorators": true

// 类装饰器
function sealed(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}

@sealed
class BugReport {
    type = 'report';
    title: string;
    
    constructor(t: string) {
        this.title = t;
    }
}

// 方法装饰器
function log(target: any, key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = function(...args: any[]) {
        console.log(`调用 ${key}，参数:`, args);
        return original.apply(this, args);
    };
    return descriptor;
}

class Calculator {
    @log
    add(a: number, b: number): number {
        return a + b;
    }
}
```

---

## 常用类型工具

```typescript
// Extract<T, U> - 提取交叉类型
type T = Extract<'a' | 'b' | 'c', 'a' | 'c'>; // 'a' | 'c'

// Exclude<T, U> - 排除交叉类型
type T2 = Exclude<'a' | 'b' | 'c', 'a' | 'c'>; // 'b'

// NonNullable<T> - 去除 null 和 undefined
type T3 = NonNullable<string | null | undefined>; // string

// ReturnType<T> - 获取函数返回类型
function getUser() { return { name: '张三' }; }
type UserType = ReturnType<typeof getUser>; // { name: string }

// Parameters<T> - 获取函数参数类型
type T4 = Parameters<typeof add>; // [number, number]

// Awaited<T> - 获取 Promise 的值类型
async function fetchData(): Promise<string> { return ''; }
type DataType = Awaited<ReturnType<typeof fetchData>>; // string
```

---

## 总结

TypeScript 提供了强大的类型系统：

| 特性 | 用途 |
|------|------|
| 类型注解 | 显式声明变量类型 |
| 接口 | 定义对象结构 |
| 泛型 | 创建可复用组件 |
| 装饰器 | 添加元数据 |
| 模块系统 | 代码组织和复用 |
| 高级类型 | 灵活的类型操作 |

### 学习建议

1. 从基础类型开始，理解类型推断
2. 逐步使用接口和泛型
3. 开启 strict 模式进行严格检查
4. 使用第三方库的类型定义
5. 善用 IDE 的类型提示功能

### 官方资源

- 官网：https://www.typescriptlang.org/
- 文档：https://www.typescriptlang.org/docs/
- Playground：https://www.typescriptlang.org/play
