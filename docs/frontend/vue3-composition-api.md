# Vue3 组合式 API

## 概述

Vue 3 是 Vue.js 的最新主要版本，于 2020 年 9 月正式发布。相比 Vue 2，Vue 3 带来了众多重大改进：

### Vue3 vs Vue2 主要区别

| 特性 | Vue 2 | Vue 3 |
|------|-------|-------|
| 架构 | Options API | 组合式 API + Options API |
| 响应式系统 | defineProperty | Proxy |
| 虚拟 DOM | 对象 | Fragment（片段） |
| TypeScript 支持 | 部分支持 | 完整支持 |
| 打包体积 | 较大 | 减小约 30% |
| 性能 | 良好 | 显著提升 |

### Vue 3 新特性

- **组合式 API (Composition API)** - 更灵活的代码组织方式
- **Teleport** - 传送门组件
- **Fragments** - 支持多根节点组件
- **Suspense** - 异步组件加载
- **更好的 TypeScript 支持**
- **更快的渲染速度**

---

## 环境搭建

### 方式一：CDN 引入

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
```

### 方式二：Vite（推荐）

```bash
# 创建 Vue3 项目
npm create vite@latest my-vue3-app -- --template vue

# 进入目录
cd my-vue3-app

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 方式三：Vue CLI

```bash
# 安装 Vue CLI
npm install -g @vue/cli

# 创建项目
vue create my-vue3-app

# 选择 Vue 3 版本
```

---

## 第一个 Vue3 应用

### 使用选项式 API（传统写法）

```html
<div id="app">
    <h1>{{ message }}</h1>
    <p>计数: {{ count }}</p>
    <button @click="increment">增加</button>
</div>

<script>
    const app = Vue.createApp({
        data() {
            return {
                message: 'Hello Vue 3!',
                count: 0
            }
        },
        methods: {
            increment() {
                this.count++;
            }
        }
    });
    
    app.mount('#app');
</script>
```

### 使用组合式 API

```html
<div id="app">
    <h1>{{ message }}</h1>
    <p>计数: {{ count }}</p>
    <button @click="increment">增加</button>
</div>

<script>
    const app = Vue.createApp({
        setup() {
            // 响应式状态
            const message = Vue.ref('Hello Vue 3!');
            const count = Vue.ref(0);
            
            // 方法
            function increment() {
                count.value++;
            }
            
            // 返回需要在模板中使用的变量和方法
            return {
                message,
                count,
                increment
            };
        }
    });
    
    app.mount('#app');
</script>
```

---

## setup 函数

### 基本用法

`setup` 是组合式 API 的入口点，在组件实例创建之前执行。

```javascript
import { ref, computed, onMounted } from 'vue';

export default {
    setup() {
        // 响应式数据
        const message = ref('Hello');
        const count = ref(0);
        
        // 计算属性
        const doubleCount = computed(() => count.value * 2);
        
        // 方法
        function increment() {
            count.value++;
        }
        
        // 生命周期钩子
        onMounted(() => {
            console.log('组件已挂载');
        });
        
        // 返回
        return {
            message,
            count,
            doubleCount,
            increment
        };
    }
}
```

### setup 中的 this

在 `setup` 中，`this` 的行为与 Vue 2 不同：

```javascript
setup() {
    console.log(this); // undefined
    
    // 在 setup 中使用 getCurrentInstance 访问组件实例
    import { getCurrentInstance } from 'vue';
    const instance = getCurrentInstance();
    console.log(instance.data); // 组件 data
}
```

---

## 响应式系统

### ref 和 reactive

#### ref 用于基本类型

```javascript
import { ref } from 'vue';

// 创建响应式引用
const count = ref(0);
const name = ref('张三');
const isActive = ref(true);

// 访问值需要使用 .value
console.log(count.value); // 0
count.value++;
console.log(count.value); // 1
```

#### reactive 用于对象

```javascript
import { reactive } from 'vue';

// 创建响应式对象
const state = reactive({
    count: 0,
    name: '张三',
    isActive: true,
    hobbies: ['读书', '运动']
});

// 直接访问
console.log(state.count); // 0
state.count++;
state.hobbies.push('音乐');
```

#### ref vs reactive 对比

| 特性 | ref | reactive |
|------|-----|----------|
| 支持类型 | 所有类型 | 对象/数组 |
| 访问方式 | .value | 直接访问 |
| 解构丢失响应式 | 会（需 toRefs） | 会（需 toRefs） |
| 使用场景 | 基本类型、多用途 | 对象类型 |

### toRef 和 toRefs

```javascript
import { reactive, toRef, toRefs } from 'vue';

const state = reactive({
    name: '张三',
    age: 25,
    city: '北京'
});

// toRef: 从响应式对象创建 ref
const name = toRef(state, 'name');

// toRefs: 将响应式对象转为普通对象（每个属性都是 ref）
const { name, age, city } = toRefs(state);

// 使用解构后的 ref
name.value = '李四';
console.log(state.name); // 李四
```

### isRef 判断

```javascript
import { ref, isRef, unref } from 'vue';

const count = ref(0);
const num = 10;

console.log(isRef(count)); // true
console.log(isRef(num));   // false

// unref: 如果是 ref 则返回其值，否则返回原值
console.log(unref(count)); // 0
console.log(unref(num));   // 10
```

---

## computed 计算属性

### 基本用法

```javascript
import { ref, computed } from 'vue';

const firstName = ref('张');
const lastName = ref('三');

// 只读计算属性
const fullName = computed(() => {
    return firstName.value + lastName.value;
});

console.log(fullName.value); // 张三

// 可写计算属性
const reversedName = computed({
    get() {
        return fullName.value.split('').reverse().join('');
    },
    set(value) {
        // 处理设置逻辑
        console.log('设置值为:', value);
    }
});
```

### 完整示例

```vue
<template>
    <div>
        <input v-model="price" type="number" placeholder="单价">
        <input v-model="quantity" type="number" placeholder="数量">
        
        <p>总价: ¥{{ total }}</p>
        <p>含税价格: ¥{{ taxIncluded }}</p>
        
        <p>订单详情: {{ orderSummary }}</p>
    </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
    setup() {
        const price = ref(100);
        const quantity = ref(2);
        
        // 计算总价
        const total = computed(() => {
            return price.value * quantity.value;
        });
        
        // 计算含税价格
        const taxIncluded = computed(() => {
            return (total.value * 1.13).toFixed(2);
        });
        
        // 订单摘要
        const orderSummary = computed(() => {
            return `单价 ¥${price.value} × ${quantity.value}件 = ¥${total.value}`;
        });
        
        return {
            price,
            quantity,
            total,
            taxIncluded,
            orderSummary
        };
    }
}
</script>
```

---

## watch 监听器

### watch 基本用法

```javascript
import { ref, watch } from 'vue';

const message = ref('Hello');

watch(message, (newVal, oldVal) => {
    console.log(`从 "${oldVal}" 变为 "${newVal}"`);
});
```

### 监听多个数据源

```javascript
import { ref, watch } from 'vue';

const firstName = ref('张');
const lastName = ref('三');

// 监听多个
watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
    console.log(`${oldFirst}${oldLast} → ${newFirst}${newLast}`);
});

firstName.value = '李'; // 触发监听
```

### 深度监听

```javascript
import { reactive, watch } from 'vue';

const user = reactive({
    name: '张三',
    profile: {
        age: 25,
        city: '北京'
    }
});

// 深度监听
watch(user, (newVal, oldVal) => {
    console.log('用户信息变化');
}, { deep: true });

// 监听特定属性
watch(() => user.profile.age, (newAge) => {
    console.log('年龄变化:', newAge);
});
```

### watchEffect

`watchEffect` 会立即执行回调，并在依赖变化时重新运行：

```javascript
import { ref, watchEffect } from 'vue';

const count = ref(0);
const message = ref('');

// 立即执行，自动追踪依赖
watchEffect(() => {
    console.log(`count 变化了: ${count.value}`);
    // 每次 count 变化都会执行
});

count.value++; // 触发
count.value++; // 触发
```

---

## 生命周期钩子

### 组合式 API 中的钩子

| 选项式 API | 组合式 API |
|------------|------------|
| beforeCreate | setup()（无对应） |
| created | setup()（无对应） |
| beforeMount | onBeforeMount |
| mounted | onMounted |
| beforeUpdate | onBeforeUpdate |
| updated | onUpdated |
| beforeUnmount | onBeforeUnmount |
| unmounted | onUnmounted |
| errorCaptured | onErrorCaptured |
| activated | onActivated |
| deactivated | onDeactivated |

### 使用示例

```javascript
import { 
    onBeforeMount, 
    onMounted, 
    onBeforeUpdate, 
    onUpdated,
    onBeforeUnmount,
    onUnmounted 
} from 'vue';

export default {
    setup() {
        onBeforeMount(() => {
            console.log('组件即将挂载');
        });
        
        onMounted(() => {
            console.log('组件已挂载');
            // 适合：获取 DOM、发起请求、设置定时器
        });
        
        onBeforeUpdate(() => {
            console.log('组件即将更新');
        });
        
        onUpdated(() => {
            console.log('组件已更新');
        });
        
        onBeforeUnmount(() => {
            console.log('组件即将卸载');
            // 适合：清理定时器、取消订阅、解绑事件
        });
        
        onUnmounted(() => {
            console.log('组件已卸载');
        });
        
        return {};
    }
}
```

### 带错误的示例

```javascript
import { onMounted, onErrorCaptured } from 'vue';

export default {
    setup() {
        onMounted(() => {
            throw new Error('测试错误');
        });
        
        onErrorCaptured((err) => {
            console.error('捕获到错误:', err);
            return false; // 阻止错误传播
        });
    }
}
```

---

## 依赖注入

### provide 和 inject

跨多层组件传递数据，无需逐层 prop 传递：

```javascript
// 父组件
import { provide, ref } from 'vue';

export default {
    setup() {
        const theme = ref('dark');
        
        // 提供数据
        provide('theme', theme);
        provide('userInfo', {
            name: '张三',
            id: 1
        });
        
        // 提供方法
        provide('changeTheme', (newTheme) => {
            theme.value = newTheme;
        });
        
        return {};
    }
}
```

```javascript
// 子组件（孙组件等也适用）
import { inject } from 'vue';

export default {
    setup() {
        // 注入数据
        const theme = inject('theme');
        const userInfo = inject('userInfo');
        
        // 注入方法
        const changeTheme = inject('changeTheme');
        
        return {
            theme,
            userInfo,
            changeTheme
        };
    }
}
```

### 带默认值的注入

```javascript
// 第三个参数为默认值
const theme = inject('theme', 'light');
const count = inject('count', 0);
```

---

## 模板 refs

### 获取 DOM 元素

```vue
<template>
    <div>
        <input ref="inputRef" type="text">
        <button @click="focusInput">聚焦输入框</button>
        
        <div ref="boxRef" class="box">盒子</div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
    setup() {
        // 创建 ref
        const inputRef = ref(null);
        const boxRef = ref(null);
        
        function focusInput() {
            // 访问 DOM
            inputRef.value?.focus();
            console.log('输入框内容:', inputRef.value?.value);
        }
        
        onMounted(() => {
            console.log('盒子尺寸:', boxRef.value?.offsetWidth);
        });
        
        return {
            inputRef,
            boxRef,
            focusInput
        };
    }
}
</script>
```

### 获取组件实例

```vue
<!-- Parent.vue -->
<template>
    <child-component ref="childRef"></child-component>
    <button @click="callChildMethod">调用子组件方法</button>
</template>

<script>
import { ref } from 'vue';
import ChildComponent from './ChildComponent.vue';

export default {
    components: { ChildComponent },
    setup() {
        const childRef = ref(null);
        
        function callChildMethod() {
            // 调用子组件方法
            childRef.value?.childMethod();
            // 访问子组件数据
            console.log(childRef.value?.childData);
        }
        
        return { childRef, callChildMethod };
    }
}
</script>
```

---

## 组合式函数（Composables）

组合式函数是 Vue 3 的核心概念，类似于 React Hooks，用于逻辑复用：

### 示例：鼠标位置追踪

```javascript
// useMouse.js
import { ref, onMounted, onUnmounted } from 'vue';

export function useMouse() {
    const x = ref(0);
    const y = ref(0);
    
    function update(e) {
        x.value = e.clientX;
        y.value = e.clientY;
    }
    
    onMounted(() => {
        window.addEventListener('mousemove', update);
    });
    
    onUnmounted(() => {
        window.removeEventListener('mousemove', update);
    });
    
    return { x, y };
}
```

```vue
<!-- 使用组合式函数 -->
<template>
    <p>鼠标位置: ({{ x }}, {{ y }})</p>
</template>

<script>
import { useMouse } from './useMouse';

export default {
    setup() {
        const { x, y } = useMouse();
        return { x, y };
    }
}
</script>
```

### 示例：异步数据请求

```javascript
// useFetch.js
import { ref } from 'vue';

export function useFetch(url) {
    const data = ref(null);
    const loading = ref(true);
    const error = ref(null);
    
    async function fetchData() {
        try {
            loading.value = true;
            const response = await fetch(url);
            data.value = await response.json();
        } catch (err) {
            error.value = err;
        } finally {
            loading.value = false;
        }
    }
    
    fetchData();
    
    return { data, loading, error, refetch: fetchData };
}
```

---

## Teleport 传送门

将组件渲染到指定位置：

```vue
<template>
    <button @click="showModal = true">打开弹窗</button>
    
    <!-- 传送到 body -->
    <teleport to="body">
        <div v-if="showModal" class="modal">
            <div class="modal-content">
                <h2>弹窗标题</h2>
                <p>这是弹窗内容</p>
                <button @click="showModal = false">关闭</button>
            </div>
        </div>
    </teleport>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const showModal = ref(false);
        return { showModal };
    }
}
</script>

<style>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}
.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
}
</style>
```

---

## Suspense 异步组件

```vue
<template>
    <suspense>
        <template #default>
            <async-component />
        </template>
        <template #fallback>
            <p>加载中...</p>
        </template>
    </suspense>
</template>

<script>
import { defineAsyncComponent } from 'vue';

const AsyncComponent = defineAsyncComponent(() => 
    import('./AsyncComponent.vue')
);

export default {
    components: {
        AsyncComponent
    }
}
</script>
```

---

## 总结

Vue 3 的组合式 API 带来了：

1. **更好的逻辑复用** - 组合式函数让代码组织更灵活
2. **更灵活的代码组织** - 相关逻辑可以放在一起
3. **更好的 TypeScript 支持** - 类型推导更完善
4. **更小的打包体积** - 更好的 tree-shaking
5. **更强大的响应式系统** - Proxy 带来的性能提升

### 关键 API 速查

| API | 用途 |
|-----|------|
| ref/reactive | 创建响应式数据 |
| computed | 计算属性 |
| watch/watchEffect | 监听数据变化 |
| onMounted 等 | 生命周期钩子 |
| provide/inject | 跨组件传值 |
| defineAsyncComponent | 异步组件 |
| Teleport | 传送到指定位置 |
| Suspense | 异步加载状态 |
