# MongoDB 文档数据库指南

MongoDB 是一个基于分布式文件存储的开源 NoSQL 数据库，由 C++ 语言编写。它采用文档导向的数据模型，以 BSON（二进制 JSON）格式存储数据，具有高性能、高可用性和易扩展的特点，是现代 Web 应用和大数据场景的理想选择。

## MongoDB 简介

### 什么是 MongoDB

MongoDB 是一个面向文档的数据库，与传统的关系型数据库相比，具有以下特点：

| 特性 | MongoDB | 关系型数据库 |
|------|---------|--------------|
| 数据模型 | 文档（BSON） | 表（行和列） |
| 模式 | 灵活，无固定结构 | 固定，需预定义 |
| 扩展性 | 水平扩展（分片） | 垂直扩展 |
| 查询语言 | 丰富的文档查询 | SQL |
| 事务 | 4.0+ 支持多文档事务 | 原生支持 |

### MongoDB 的核心优势

- **灵活的文档模型**：无需预定义模式，数据结构可以动态变化
- **高性能**：支持索引、聚合管道，读写性能优异
- **高可用性**：副本集提供自动故障转移
- **水平扩展**：分片支持海量数据存储
- **丰富的查询语言**：支持复杂的文档查询和聚合操作
- **多语言支持**：提供各种主流编程语言的驱动

### 适用场景

| 场景 | 说明 |
|------|------|
| 内容管理 | 博客、文章、评论等半结构化数据 |
| 电商平台 | 商品目录、购物车、订单管理 |
| 实时分析 | 日志收集、用户行为分析 |
| 物联网 | 传感器数据、设备状态存储 |
| 移动应用 | 离线数据同步、用户配置 |
| 游戏开发 | 玩家数据、游戏状态 |

## 安装与配置

### 安装方法

#### Linux 安装（Ubuntu）

```bash
# 导入公钥
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# 添加源列表
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# 更新并安装
sudo apt update
sudo apt install -y mongodb-org

# 启动服务
sudo systemctl start mongod
sudo systemctl enable mongod

# 验证安装
mongod --version
```

#### macOS 安装

```bash
# 使用 Homebrew
brew tap mongodb/brew
brew install mongodb-community

# 启动服务
brew services start mongodb-community
```

#### Windows 安装

1. 下载 MSI 安装包：[https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. 运行安装向导，选择 "Complete" 安装
3. 安装 MongoDB Compass（可选的图形化管理工具）
4. 将 MongoDB bin 目录添加到系统 PATH

### 基本配置

MongoDB 的配置文件通常位于：
- Linux: `/etc/mongod.conf`
- macOS: `/usr/local/etc/mongod.conf`
- Windows: `C:\Program Files\MongoDB\Server\6.0\bin\mongod.cfg`

```yaml
# mongod.conf 示例
storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true

systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log

net:
  port: 27017
  bindIp: 127.0.0.1

processManagement:
  timeZoneInfo: /usr/share/zoneinfo

security:
  authorization: enabled  # 启用认证
```

## 核心概念

### 数据库（Database）

数据库是集合的物理容器，一个 MongoDB 实例可以包含多个数据库。

```javascript
// 查看所有数据库
show dbs

// 切换/创建数据库
use mydb

// 查看当前数据库
db

// 删除当前数据库
db.dropDatabase()
```

### 集合（Collection）

集合是文档的组，类似于关系型数据库中的表，但不需要预定义结构。

```javascript
// 创建集合
db.createCollection("users")

// 查看所有集合
show collections

// 删除集合
db.users.drop()
```

### 文档（Document）

文档是 MongoDB 中的基本数据单元，使用 BSON 格式存储，类似于 JSON。

```javascript
// 示例文档
{
    "_id": ObjectId("64a1b2c3d4e5f6g7h8i9j0k1"),
    "name": "张三",
    "email": "zhangsan@example.com",
    "age": 25,
    "address": {
        "city": "北京",
        "zip": "100000"
    },
    "hobbies": ["读书", "游泳", "编程"],
    "createdAt": ISODate("2024-01-15T08:00:00Z")
}
```

### ObjectId

MongoDB 使用 ObjectId 作为文档的默认主键，是一个 12 字节的唯一标识符：

| 字节 | 含义 |
|------|------|
| 0-3 | 时间戳（秒） |
| 4-6 | 机器标识 |
| 7-8 | 进程 ID |
| 9-11 | 随机计数器 |

## CRUD 操作

### 创建（Create）

```javascript
// 插入单个文档
db.users.insertOne({
    name: "张三",
    email: "zhangsan@example.com",
    age: 25,
    createdAt: new Date()
})

// 插入多个文档
db.users.insertMany([
    {
        name: "李四",
        email: "lisi@example.com",
        age: 30,
        createdAt: new Date()
    },
    {
        name: "王五",
        email: "wangwu@example.com",
        age: 28,
        createdAt: new Date()
    }
])
```

### 读取（Read）

```javascript
// 查询所有文档
db.users.find()

// 格式化输出
db.users.find().pretty()

// 条件查询
db.users.find({ age: 25 })
db.users.find({ age: { $gte: 18 } })  // 大于等于
db.users.find({ age: { $lt: 30 } })   // 小于

// 多条件查询（AND）
db.users.find({ 
    age: { $gte: 18 }, 
    city: "北京" 
})

// OR 查询
db.users.find({
    $or: [
        { age: { $lt: 18 } },
        { age: { $gt: 60 } }
    ]
})

// 查询特定字段（投影）
db.users.find({}, { name: 1, email: 1, _id: 0 })

// 排序
db.users.find().sort({ age: 1 })   // 升序
db.users.find().sort({ age: -1 })  // 降序

// 分页
db.users.find().limit(10)          // 限制返回数量
db.users.find().skip(20).limit(10) // 跳过前20条，返回10条

// 查询单个文档
db.users.findOne({ email: "zhangsan@example.com" })
```

### 更新（Update）

```javascript
// 更新单个文档
db.users.updateOne(
    { name: "张三" },
    { $set: { age: 26, updatedAt: new Date() } }
)

// 更新多个文档
db.users.updateMany(
    { age: { $lt: 18 } },
    { $set: { status: "minor" } }
)

// 字段操作符
{ $set: { field: value } }        // 设置字段值
{ $unset: { field: "" } }         // 删除字段
{ $inc: { age: 1 } }              // 增加数值
{ $mul: { price: 1.1 } }          // 乘以数值
{ $rename: { oldName: "newName" } } // 重命名字段
{ $min: { age: 18 } }             // 仅当新值更小时更新
{ $max: { score: 100 } }          // 仅当新值更大时更新

// 数组操作符
db.users.updateOne(
    { name: "张三" },
    { $push: { hobbies: "摄影" } }  // 添加元素到数组
)

db.users.updateOne(
    { name: "张三" },
    { $pull: { hobbies: "游泳" } }  // 从数组移除元素
)

db.users.updateOne(
    { name: "张三" },
    { $addToSet: { hobbies: "编程" } }  // 不重复添加
)

// 替换整个文档
db.users.replaceOne(
    { name: "张三" },
    {
        name: "张三",
        email: "zhangsan_new@example.com",
        age: 26
    }
)
```

### 删除（Delete）

```javascript
// 删除单个文档
db.users.deleteOne({ name: "张三" })

// 删除多个文档
db.users.deleteMany({ status: "inactive" })

// 删除所有文档（谨慎使用！）
db.users.deleteMany({})

// 删除集合并重建
db.users.drop()
```

## 查询操作符

### 比较操作符

| 操作符 | 含义 | 示例 |
|--------|------|------|
| `$eq` | 等于 | `{ age: { $eq: 25 } }` |
| `$ne` | 不等于 | `{ age: { $ne: 25 } }` |
| `$gt` | 大于 | `{ age: { $gt: 18 } }` |
| `$gte` | 大于等于 | `{ age: { $gte: 18 } }` |
| `$lt` | 小于 | `{ age: { $lt: 65 } }` |
| `$lte` | 小于等于 | `{ age: { $lte: 65 } }` |
| `$in` | 在数组中 | `{ status: { $in: ["active", "pending"] } }` |
| `$nin` | 不在数组中 | `{ status: { $nin: ["deleted"] } }` |

### 逻辑操作符

```javascript
// $and - 所有条件都满足
db.users.find({
    $and: [
        { age: { $gte: 18 } },
        { age: { $lte: 60 } },
        { status: "active" }
    ]
})

// $or - 任一条件满足
db.users.find({
    $or: [
        { age: { $lt: 18 } },
        { age: { $gt: 60 } }
    ]
})

// $not - 条件不满足
db.users.find({
    age: { $not: { $gte: 18 } }
})

// $nor - 所有条件都不满足
db.users.find({
    $nor: [
        { status: "active" },
        { status: "pending" }
    ]
})
```

### 元素操作符

```javascript
// $exists - 字段是否存在
db.users.find({ phone: { $exists: true } })

// $type - 字段类型
db.users.find({ age: { $type: "number" } })
```

### 数组操作符

```javascript
// 查询包含特定元素的数组
db.users.find({ hobbies: "编程" })

// $all - 包含所有指定元素
db.users.find({ hobbies: { $all: ["编程", "读书"] } })

// $size - 数组长度
db.users.find({ hobbies: { $size: 3 } })

// $elemMatch - 数组元素满足所有条件
db.products.find({
    reviews: {
        $elemMatch: {
            rating: { $gte: 4 },
            verified: true
        }
    }
})
```

## 索引

### 创建索引

```javascript
// 单字段索引
db.users.createIndex({ email: 1 })  // 1 升序, -1 降序

// 复合索引
db.users.createIndex({ age: 1, name: 1 })

// 唯一索引
db.users.createIndex({ email: 1 }, { unique: true })

// 文本索引
db.articles.createIndex({ content: "text" })

// 多字段文本索引
db.articles.createIndex({
    title: "text",
    content: "text"
}, {
    weights: {
        title: 10,
        content: 5
    }
})

// 地理空间索引
db.places.createIndex({ location: "2dsphere" })
```

### 索引管理

```javascript
// 查看索引
db.users.getIndexes()

// 查看查询是否使用索引
db.users.find({ email: "test@example.com" }).explain("executionStats")

// 删除索引
db.users.dropIndex("email_1")
db.users.dropIndexes()

// 重建索引
db.users.reIndex()
```

### 索引策略

1. **选择性高的字段**：值分布越分散越好
2. **最左前缀原则**：复合索引按创建顺序使用
3. **覆盖索引**：查询字段都在索引中，避免回表
4. **定期分析**：使用 `db.collection.stats()` 监控索引效率

## 聚合框架

聚合框架是 MongoDB 强大的数据处理工具，通过管道（pipeline）方式处理文档。

### 聚合管道阶段

```javascript
// 基础聚合
db.orders.aggregate([
    { $match: { status: "completed" } },
    { $group: {
        _id: "$customerId",
        totalAmount: { $sum: "$amount" },
        orderCount: { $sum: 1 }
    }},
    { $sort: { totalAmount: -1 } },
    { $limit: 10 }
])
```

### 常用聚合阶段

| 阶段 | 说明 | 示例 |
|------|------|------|
| `$match` | 过滤文档 | `{ $match: { status: "active" } }` |
| `$group` | 分组统计 | `{ $group: { _id: "$category", total: { $sum: 1 } } }` |
| `$sort` | 排序 | `{ $sort: { age: -1 } }` |
| `$limit` | 限制数量 | `{ $limit: 10 }` |
| `$skip` | 跳过文档 | `{ $skip: 20 }` |
| `$project` | 投影字段 | `{ $project: { name: 1, age: 1 } }` |
| `$lookup` | 左外连接 | 见下方示例 |
| `$unwind` | 展开数组 | `{ $unwind: "$tags" }` |

### 关联查询（$lookup）

```javascript
// 等效于 SQL 的 LEFT JOIN
db.users.aggregate([
    {
        $lookup: {
            from: "orders",
            localField: "_id",
            foreignField: "userId",
            as: "orders"
        }
    }
])

// 关联后筛选
db.users.aggregate([
    {
        $lookup: {
            from: "orders",
            localField: "_id",
            foreignField: "userId",
            as: "orders"
        }
    },
    {
        $match: {
            "orders.0": { $exists: true }  // 只保留有订单的用户
        }
    }
])
```

### 聚合表达式

```javascript
// 统计函数
db.sales.aggregate([
    {
        $group: {
            _id: "$product",
            totalSales: { $sum: "$amount" },
            avgPrice: { $avg: "$price" },
            maxPrice: { $max: "$price" },
            minPrice: { $min: "$price" },
            count: { $sum: 1 }
        }
    }
])

// 日期处理
db.orders.aggregate([
    {
        $group: {
            _id: {
                year: { $year: "$orderDate" },
                month: { $month: "$orderDate" }
            },
            total: { $sum: "$amount" }
        }
    }
])
```

## 副本集（Replica Set）

副本集是一组维护相同数据集的 MongoDB 实例，提供冗余和高可用性。

### 副本集架构

```
Primary（主节点）  ←  读写操作
    ↑
    ├── Secondary（从节点）← 同步数据，可读
    ├── Secondary（从节点）
    └── Arbiter（仲裁节点）← 仅参与选举
```

### 配置副本集

```javascript
// 启动多个实例
mongod --replSet "rs0" --dbpath /data/db1 --port 27017
mongod --replSet "rs0" --dbpath /data/db2 --port 27018
mongod --replSet "rs0" --dbpath /data/db3 --port 27019

// 初始化副本集
rs.initiate({
    _id: "rs0",
    members: [
        { _id: 0, host: "localhost:27017" },
        { _id: 1, host: "localhost:27018" },
        { _id: 2, host: "localhost:27019" }
    ]
})

// 查看副本集状态
rs.status()
rs.conf()
```

### 读写分离

```javascript
// 主节点读取（默认）
db.collection.find()

// 从节点读取
rs.secondaryOk()
db.collection.find()

// 驱动程序中的读取偏好
// readPreference: primary | primaryPreferred | secondary | secondaryPreferred | nearest
```

## 分片（Sharding）

分片是 MongoDB 用于水平扩展的机制，将数据分布到多个服务器上。

### 分片架构

```
Application
    ↓
mongos（路由进程）
    ↓
┌─────────────┬─────────────┐
│ Shard 1     │ Shard 2     │
│ (Replica Set)│(Replica Set)│
└─────────────┴─────────────┘
    ↑
Config Servers（配置服务器）
```

### 配置分片

```javascript
// 1. 启动配置服务器
mongod --configsvr --replSet configRS --dbpath /data/config --port 27019

// 2. 启动分片服务器
mongod --shardsvr --replSet shard1RS --dbpath /data/shard1 --port 27018
mongod --shardsvr --replSet shard2RS --dbpath /data/shard2 --port 27017

// 3. 启动 mongos
mongos --configdb configRS/localhost:27019 --port 27016

// 4. 添加分片
sh.addShard("shard1RS/localhost:27018")
sh.addShard("shard2RS/localhost:27017")

// 5. 启用数据库分片
sh.enableSharding("mydb")

// 6. 对集合进行分片
sh.shardCollection("mydb.users", { userId: 1 })
```

### 分片策略

| 策略 | 说明 | 适用场景 |
|------|------|----------|
| 范围分片 | 按值范围分布 | 范围查询多的场景 |
| 哈希分片 | 按哈希值分布 | 写操作均匀分布 |
| 区域分片 | 按地理位置分布 | 数据本地化需求 |

## 事务

MongoDB 4.0+ 支持多文档 ACID 事务。

```javascript
// 会话和事务
const session = db.getMongo().startSession()
session.startTransaction()

try {
    const users = session.getDatabase("mydb").users
    const orders = session.getDatabase("mydb").orders
    
    users.updateOne(
        { _id: 1 },
        { $inc: { balance: -100 } },
        { session }
    )
    
    orders.insertOne(
        { userId: 1, amount: 100, status: "paid" },
        { session }
    )
    
    session.commitTransaction()
} catch (error) {
    session.abortTransaction()
    throw error
} finally {
    session.endSession()
}
```

### 事务限制

- 事务中的文档大小限制为 16MB
- 事务超时时间默认为 60 秒
- 事务中不能创建集合
- 分片集群的事务有额外限制

## 备份与恢复

### 使用 mongodump/mongorestore

```bash
# 备份整个数据库
mongodump --db mydb --out /backup/

# 备份特定集合
mongodump --db mydb --collection users --out /backup/

# 压缩备份
mongodump --db mydb --gzip --out /backup/

# 恢复数据库
mongorestore --db mydb /backup/mydb/

# 恢复压缩备份
mongorestore --db mydb --gzip /backup/mydb/
```

### 文件系统快照

对于 WiredTiger 存储引擎，可以使用文件系统快照进行备份：

```bash
# 1. 锁定数据库（使用 db.fsyncLock()）
mongo --eval "db.fsyncLock()"

# 2. 创建快照
# 使用 LVM、AWS EBS 快照等

# 3. 解锁数据库
mongo --eval "db.fsyncUnlock()"
```

## 性能优化

### 查询优化

```javascript
// 使用 explain 分析查询
db.users.find({ email: "test@example.com" }).explain("executionStats")

// 查看慢查询
// 在 mongod.conf 中配置
slowOpThresholdMs: 100
```

### 常用优化技巧

1. **创建合适的索引**：对查询条件字段建立索引
2. **使用投影**：只返回需要的字段
3. **限制返回数量**：使用 limit() 避免大数据集
4. **避免大文档**：文档大小限制 16MB
5. **使用覆盖索引**：查询字段都在索引中
6. **定期分析**：使用 `db.collection.stats()` 监控

```javascript
// 查看集合统计信息
db.users.stats()

// 查看数据库统计
db.stats()

// 查看当前操作
db.currentOp()

// 终止慢操作
db.killOp(opid)
```

## 总结

MongoDB 作为领先的文档数据库，为现代应用提供了灵活、高性能的数据存储方案：

| 特性 | 说明 |
|------|------|
| 文档模型 | 灵活的 BSON 格式，无需预定义模式 |
| CRUD | 丰富的增删改查操作和查询操作符 |
| 索引 | 支持多种索引类型，优化查询性能 |
| 聚合 | 强大的聚合框架进行数据处理 |
| 高可用 | 副本集提供自动故障转移 |
| 扩展性 | 分片支持水平扩展 |
| 事务 | 支持多文档 ACID 事务 |

掌握 MongoDB 的使用，可以帮助你构建可扩展、高性能的现代应用程序。
