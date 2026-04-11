# 后端 & 工程技术指南

> 覆盖后端语言、数据库、版本控制、网络协议——工程师的核心技能地图。

## 一、后端技术栈全景

```
后端 & 工程
│
├── 编程语言
│   ├── Python     — 语法简洁，AI/数据科学首选
│   ├── Go         — 高并发，微服务热门
│   ├── Java       — 企业级，生态最成熟
│   └── Node.js    — JS 全栈，前端工程师友好
│
├── Web 框架（Python 侧）
│   ├── FastAPI    — 现代异步，自动文档（推荐）
│   ├── Flask      — 轻量灵活
│   └── Django     — 全功能，含 ORM/Admin
│
├── 数据库
│   ├── 关系型（SQL）
│   │   ├── MySQL      — Web 项目主力
│   │   ├── PostgreSQL — 功能更强，推荐新项目
│   │   └── SQLite     — 嵌入式，开发/测试用
│   └── 非关系型（NoSQL）
│       ├── MongoDB    — 文档型，灵活 Schema
│       ├── Redis      — 缓存 / 消息队列
│       └── Elasticsearch — 全文搜索
│
├── 版本控制
│   └── Git + GitHub / GitLab / Gitee
│
├── 网络基础
│   ├── HTTP/HTTPS
│   ├── TCP/IP
│   ├── DNS
│   └── WebSocket
│
└── 运维与部署
    ├── Docker / Docker Compose
    ├── Nginx
    └── CI/CD（GitHub Actions）
```

## 二、学习路径

### 路径 A：Python 后端工程师

```
1. Python 基础语法（2-4周）
2. Python 进阶（OOP、装饰器、异步）
3. SQL 基础 → MySQL 实战（2-3周）
4. HTTP 协议理解
5. FastAPI 框架（2-3周）
6. Git 工作流
7. Docker 基础
8. 部署到云服务器
```

**第一个项目**：用 FastAPI + MySQL 做一个 RESTful API（用户增删改查）

### 路径 B：全栈工程师（Node.js）

```
1. Node.js 基础（模块、fs、http）
2. Express / Fastify 框架
3. MongoDB + Mongoose（文档型，上手快）
4. REST API 设计规范
5. JWT 认证
6. Next.js（前后端一体）
```

## 三、核心知识速查

### SQL 常用操作
```sql
-- 查询
SELECT name, age FROM users WHERE age > 18 ORDER BY age DESC LIMIT 10;

-- 连接查询
SELECT u.name, o.amount 
FROM users u 
JOIN orders o ON u.id = o.user_id
WHERE o.created_at > '2024-01-01';

-- 聚合
SELECT city, COUNT(*) AS user_count, AVG(age) AS avg_age
FROM users
GROUP BY city
HAVING user_count > 100;

-- 索引创建
CREATE INDEX idx_email ON users(email);
```

### Python FastAPI 快速示例
```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

class User(BaseModel):
    name: str
    email: str
    age: Optional[int] = None

fake_db = {}

@app.get("/users/{user_id}")
async def get_user(user_id: int):
    if user_id not in fake_db:
        raise HTTPException(status_code=404, detail="用户不存在")
    return fake_db[user_id]

@app.post("/users", status_code=201)
async def create_user(user: User):
    user_id = len(fake_db) + 1
    fake_db[user_id] = user.dict()
    return {"id": user_id, **user.dict()}

# 启动: uvicorn main:app --reload
```

### Git 日常命令
```bash
# 基础流程
git add .
git commit -m "feat: 添加用户登录功能"
git push origin main

# 分支操作
git checkout -b feature/login    # 新建并切换分支
git merge feature/login          # 合并分支
git branch -d feature/login      # 删除本地分支

# 回滚
git revert HEAD                  # 撤销最后一次 commit（安全）
git reset --soft HEAD~1          # 撤销最后一次 commit，保留修改
git stash                        # 临时保存修改

# 查看
git log --oneline --graph        # 图形化历史
git diff HEAD                    # 查看未提交的变更
```

### HTTP 状态码速查
```
2xx 成功
  200 OK             请求成功
  201 Created        资源创建成功
  204 No Content     成功，无返回内容（DELETE 常用）

3xx 重定向
  301 Moved Permanently  永久重定向
  302 Found              临时重定向
  304 Not Modified       缓存未过期

4xx 客户端错误
  400 Bad Request    请求格式错误
  401 Unauthorized   未认证（需要登录）
  403 Forbidden      无权限
  404 Not Found      资源不存在
  429 Too Many Requests  请求过频（限流）

5xx 服务端错误
  500 Internal Server Error  服务器内部错误
  502 Bad Gateway            网关错误（Nginx 常见）
  503 Service Unavailable    服务不可用
```

## 四、本分类文章导航

| 文章 | 核心内容 | 难度 |
|------|----------|------|
| [Python3 基础](python3-basics.md) | 语法、数据类型、函数、模块 | ⭐⭐ |
| [Python3 进阶](python3-advanced.md) | OOP、装饰器、生成器、异步 | ⭐⭐⭐ |
| [MySQL 指南](mysql-guide.md) | 增删改查、索引、事务、优化 | ⭐⭐⭐ |
| [SQL 基础](sql-basics.md) | 标准 SQL 语法，通用于各数据库 | ⭐⭐ |
| [MongoDB 指南](mongodb-guide.md) | 文档模型、CRUD、聚合管道 | ⭐⭐ |
| [Git 指南](git-guide.md) | 常用命令、分支策略、团队协作 | ⭐⭐ |
| [HTTP 协议](http-guide.md) | 请求/响应、Headers、缓存、HTTPS | ⭐⭐⭐ |
| [TCP/IP 协议](tcpip-guide.md) | 四层模型、三次握手、拥塞控制 | ⭐⭐⭐ |
| [网络基础](network-basics.md) | DNS、CDN、负载均衡、防火墙 | ⭐⭐ |

**建议学习顺序：** Python3 基础 → SQL 基础 → MySQL → Git → HTTP → Python3 进阶 → MongoDB → TCP/IP

---

## 五、专业术语速查

| 术语 | 解释 |
|------|------|
| **ORM** | 对象关系映射，让你用 Python 对象操作数据库，而不用手写 SQL，如 SQLAlchemy |
| **CRUD** | 创建（Create）、读取（Read）、更新（Update）、删除（Delete），数据库操作四件套 |
| **RESTful API** | 一种 API 设计规范，用 HTTP 动词（GET/POST/PUT/DELETE）对应操作，URL 表示资源 |
| **中间件（Middleware）** | 请求和响应之间的处理层，如日志、鉴权、限流，不属于业务逻辑本身 |
| **JWT** | JSON Web Token，无状态认证方案，把用户信息编码到 Token 里，服务端不用存 Session |
| **微服务（Microservices）** | 把大应用拆成多个独立小服务，各自部署，通过 API 通信，对立于"单体架构" |
| **容器化（Docker）** | 把应用和运行环境打包在一起，确保在任何机器上都能一样运行，"一次打包到处跑" |
| **负载均衡（Load Balancing）** | 把请求分发到多台服务器，防止单台过载，常见工具是 Nginx |
| **幂等性（Idempotency）** | 同一操作重复执行多次，结果和执行一次相同，POST 不幂等，GET/PUT/DELETE 幂等 |
| **事务（Transaction）** | 数据库操作的最小单元，要么全部成功，要么全部回滚，ACID 原则的核心 |
| **索引（Index）** | 数据库的目录，加快查询速度，但会占空间、拖慢写入，要按需创建 |
| **缓存（Cache）** | 把频繁访问的数据存到内存（如 Redis），减少数据库压力，提升响应速度 |
| **异步（Async/Await）** | 不阻塞主线程地执行耗时操作（如 IO 读写、网络请求），Python 和 JS 都支持 |
| **WebSocket** | 全双工通信协议，服务端可以主动推送消息给客户端，聊天室/实时数据常用 |
| **CI/CD** | 持续集成/持续部署，代码提交后自动测试+自动发布，减少人工操作 |

## 五、数据库选型指南

| 场景 | 推荐 | 理由 |
|------|------|------|
| Web 应用（数据结构固定） | PostgreSQL / MySQL | 关系完整性、事务支持 |
| 内容管理（Schema 灵活）| MongoDB | 文档结构灵活，嵌套方便 |
| 缓存 / Session | Redis | 极速，支持多种数据结构 |
| 搜索功能 | Elasticsearch | 全文搜索最强 |
| 嵌入式 / 本地应用 | SQLite | 零配置，文件即数据库 |
| 时序数据（IoT、监控）| InfluxDB / TimescaleDB | 专为时序优化 |

## 六、RESTful API 设计规范

```
资源命名使用名词复数：
  ✅ GET    /users          获取用户列表
  ✅ POST   /users          创建用户
  ✅ GET    /users/{id}     获取特定用户
  ✅ PUT    /users/{id}     更新用户（全量）
  ✅ PATCH  /users/{id}     更新用户（部分）
  ✅ DELETE /users/{id}     删除用户

子资源关系：
  ✅ GET    /users/{id}/orders    该用户的所有订单

版本控制：
  ✅ /api/v1/users
  ✅ Accept: application/vnd.api+json;version=1

统一返回格式：
{
  "code": 0,
  "message": "success",
  "data": { ... },
  "pagination": { "page": 1, "limit": 20, "total": 100 }
}
```
