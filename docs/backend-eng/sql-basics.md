# SQL 基础教程

SQL（Structured Query Language，结构化查询语言）是用于管理和操作关系型数据库的标准化编程语言。无论是 MySQL、PostgreSQL、SQL Server 还是 Oracle，SQL 都是与这些数据库交互的核心工具。

## 什么是 SQL

SQL 是一种专门用来与数据库通信的语言。它允许你：

- **查询数据** — 从数据库中检索所需信息
- **插入数据** — 向数据库添加新记录
- **更新数据** — 修改数据库中已存在的记录
- **删除数据** — 从数据库中移除记录
- **创建和修改表结构** — 定义数据的组织方式

### SQL 的特点

| 特点 | 说明 |
|------|------|
| **标准化** | ANSI/ISO 标准，各大数据库都支持 |
| **声明式** | 只需描述要什么，不用描述怎么做 |
| **易学易用** | 语法接近自然英语，学习曲线平缓 |
| **功能强大** | 支持复杂查询、事务处理、权限控制 |

## SQL 基本语法规则

SQL 语句遵循以下基本规则：

1. **不区分大小写**：`SELECT` 和 `select` 效果相同（但关键字大写是良好的编码习惯）
2. **分号结尾**：大多数数据库要求语句以分号 `;` 结束
3. **忽略空白**：多余的空格、换行不会影响执行
4. **字符串用单引号**：如 `'Hello World'`

```sql
-- 这是一条标准的 SQL 查询语句
SELECT name, age 
FROM users 
WHERE age > 18;
```

## 数据库和表的基本概念

### 数据库（Database）
数据库是相关数据的集合，以结构化方式存储。一个数据库服务器可以管理多个数据库。

### 表（Table）
表是数据存储的基本单位，由行（记录）和列（字段）组成：

| id | name | email | age |
|----|------|-------|-----|
| 1 | 张三 | zhangsan@example.com | 25 |
| 2 | 李四 | lisi@example.com | 30 |
| 3 | 王五 | wangwu@example.com | 28 |

- **行（Row）**：一条完整的记录
- **列（Column）**：数据的某个属性
- **主键（Primary Key）**：唯一标识每条记录的字段

## SELECT 语句 — 数据查询

SELECT 是 SQL 中最常用的语句，用于从数据库中检索数据。

### 基本语法

```sql
SELECT 列名1, 列名2, ...
FROM 表名;
```

### 常用示例

```sql
-- 查询所有列
SELECT * FROM users;

-- 查询指定列
SELECT name, email FROM users;

-- 查询并给列起别名
SELECT name AS 姓名, age AS 年龄 FROM users;
```

### SELECT DISTINCT — 去重查询

当需要获取唯一值时，使用 DISTINCT：

```sql
-- 获取所有不同的城市
SELECT DISTINCT city FROM users;

-- 统计不同城市的数量
SELECT COUNT(DISTINCT city) FROM users;
```

## WHERE 子句 — 条件过滤

WHERE 子句用于筛选满足特定条件的记录。

### 比较运算符

| 运算符 | 描述 | 示例 |
|--------|------|------|
| `=` | 等于 | `WHERE age = 25` |
| `<>` 或 `!=` | 不等于 | `WHERE age <> 25` |
| `>` | 大于 | `WHERE age > 18` |
| `<` | 小于 | `WHERE age < 65` |
| `>=` | 大于等于 | `WHERE age >= 18` |
| `<=` | 小于等于 | `WHERE age <= 60` |

### 逻辑运算符

```sql
-- AND：同时满足多个条件
SELECT * FROM users 
WHERE age >= 18 AND age <= 30;

-- OR：满足任一条件
SELECT * FROM users 
WHERE city = '北京' OR city = '上海';

-- NOT：否定条件
SELECT * FROM users 
WHERE NOT city = '北京';
```

### IN 和 BETWEEN

```sql
-- IN：在指定值列表中
SELECT * FROM users 
WHERE city IN ('北京', '上海', '广州');

-- BETWEEN：在范围内（包含边界）
SELECT * FROM users 
WHERE age BETWEEN 18 AND 30;
```

### LIKE 模糊查询

```sql
-- % 匹配任意字符序列
SELECT * FROM users WHERE name LIKE '张%';  -- 姓张的
SELECT * FROM users WHERE email LIKE '%@gmail.com';

-- _ 匹配单个字符
SELECT * FROM users WHERE name LIKE '张_';  -- 张某（两个字）
```

### NULL 值处理

```sql
-- 判断是否为 NULL（不能用 = NULL）
SELECT * FROM users WHERE phone IS NULL;
SELECT * FROM users WHERE phone IS NOT NULL;
```

## ORDER BY — 结果排序

对查询结果按指定列进行排序。

```sql
-- 升序排序（默认）
SELECT * FROM users ORDER BY age;
SELECT * FROM users ORDER BY age ASC;

-- 降序排序
SELECT * FROM users ORDER BY age DESC;

-- 多列排序
SELECT * FROM users 
ORDER BY city ASC, age DESC;
```

## INSERT INTO — 插入数据

向表中添加新记录。

### 插入完整记录

```sql
INSERT INTO users (id, name, email, age, city)
VALUES (4, '赵六', 'zhaoliu@example.com', 35, '深圳');
```

### 插入部分字段

```sql
-- 省略的字段必须有默认值或允许 NULL
INSERT INTO users (name, email)
VALUES ('钱七', 'qianqi@example.com');
```

### 插入多条记录

```sql
INSERT INTO users (name, email, age)
VALUES 
    ('孙八', 'sunba@example.com', 22),
    ('周九', 'zhoujiu@example.com', 27),
    ('吴十', 'wushi@example.com', 31);
```

## UPDATE — 更新数据

修改表中已存在的记录。

```sql
-- 基本语法
UPDATE 表名
SET 列名1 = 值1, 列名2 = 值2
WHERE 条件;
```

### 示例

```sql
-- 更新单条记录
UPDATE users 
SET age = 26 
WHERE id = 1;

-- 更新多个字段
UPDATE users 
SET age = 26, city = '杭州'
WHERE id = 1;

-- 批量更新
UPDATE users 
SET status = 'inactive'
WHERE last_login < '2023-01-01';
```

⚠️ **警告**：忘记写 WHERE 子句会导致更新所有记录！

## DELETE — 删除数据

从表中删除记录。

```sql
-- 删除满足条件的记录
DELETE FROM users WHERE id = 1;

-- 删除多条记录
DELETE FROM users WHERE age < 18;
```

⚠️ **警告**：
- 忘记写 WHERE 子句会删除表中所有数据！
- DELETE 是物理删除，无法恢复（除非有备份）

### 清空表

```sql
-- 删除所有数据，保留表结构
DELETE FROM users;

-- 更快的方式（重置自增计数器）
TRUNCATE TABLE users;
```

## 聚合函数

SQL 提供了多种聚合函数用于数据统计。

| 函数 | 描述 | 示例 |
|------|------|------|
| `COUNT(*)` | 统计行数 | `SELECT COUNT(*) FROM users` |
| `COUNT(列名)` | 统计非 NULL 值 | `SELECT COUNT(email) FROM users` |
| `SUM(列名)` | 求和 | `SELECT SUM(salary) FROM employees` |
| `AVG(列名)` | 平均值 | `SELECT AVG(age) FROM users` |
| `MAX(列名)` | 最大值 | `SELECT MAX(salary) FROM employees` |
| `MIN(列名)` | 最小值 | `SELECT MIN(age) FROM users` |

### 示例

```sql
-- 统计用户总数
SELECT COUNT(*) AS 总人数 FROM users;

-- 计算平均年龄
SELECT AVG(age) AS 平均年龄 FROM users;

-- 组合使用
SELECT 
    COUNT(*) AS 总人数,
    AVG(age) AS 平均年龄,
    MAX(age) AS 最大年龄,
    MIN(age) AS 最小年龄
FROM users;
```

## GROUP BY — 分组统计

将数据按指定列分组，然后对每组应用聚合函数。

```sql
-- 按城市统计人数
SELECT city, COUNT(*) AS 人数
FROM users
GROUP BY city;
```

结果示例：

| city | 人数 |
|------|------|
| 北京 | 150 |
| 上海 | 120 |
| 广州 | 80 |

### HAVING 子句

HAVING 用于对分组后的结果进行过滤（WHERE 不能用于聚合条件）。

```sql
-- 找出人数超过 100 的城市
SELECT city, COUNT(*) AS 人数
FROM users
GROUP BY city
HAVING COUNT(*) > 100;

-- WHERE + GROUP BY + HAVING 组合
SELECT city, AVG(age) AS 平均年龄
FROM users
WHERE status = 'active'
GROUP BY city
HAVING AVG(age) > 25;
```

## JOIN — 多表连接

当数据分散在多个表中时，需要使用 JOIN 进行关联查询。

### 表关系示例

**users 表**：
| user_id | name | department_id |
|---------|------|---------------|
| 1 | 张三 | 1 |
| 2 | 李四 | 2 |
| 3 | 王五 | 1 |

**departments 表**：
| dept_id | dept_name |
|---------|-----------|
| 1 | 技术部 |
| 2 | 销售部 |

### INNER JOIN（内连接）

返回两个表中匹配的记录。

```sql
SELECT u.name, d.dept_name
FROM users u
INNER JOIN departments d ON u.department_id = d.dept_id;
```

结果：
| name | dept_name |
|------|-----------|
| 张三 | 技术部 |
| 李四 | 销售部 |
| 王五 | 技术部 |

### LEFT JOIN（左连接）

返回左表所有记录，右表匹配的记录，不匹配则为 NULL。

```sql
SELECT u.name, d.dept_name
FROM users u
LEFT JOIN departments d ON u.department_id = d.dept_id;
```

### RIGHT JOIN（右连接）

返回右表所有记录，左表匹配的记录。

```sql
SELECT u.name, d.dept_name
FROM users u
RIGHT JOIN departments d ON u.department_id = d.dept_id;
```

### FULL JOIN（全连接）

返回左右表所有记录，不匹配的部分用 NULL 填充。

```sql
SELECT u.name, d.dept_name
FROM users u
FULL JOIN departments d ON u.department_id = d.dept_id;
```

### 多表连接

```sql
SELECT 
    u.name,
    d.dept_name,
    p.project_name
FROM users u
INNER JOIN departments d ON u.department_id = d.dept_id
LEFT JOIN projects p ON u.user_id = p.manager_id;
```

## 子查询（Subquery）

在 SQL 语句中嵌套另一个查询。

### 单行子查询

```sql
-- 查询工资高于平均工资的员工
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
```

### 多行子查询

```sql
-- 查询在技术部工作的员工
SELECT name
FROM employees
WHERE department_id IN (
    SELECT dept_id 
    FROM departments 
    WHERE dept_name = '技术部'
);
```

### 相关子查询

```sql
-- 查询每个部门工资最高的员工
SELECT e1.name, e1.department_id, e1.salary
FROM employees e1
WHERE e1.salary = (
    SELECT MAX(e2.salary)
    FROM employees e2
    WHERE e2.department_id = e1.department_id
);
```

## 数据类型速查

| 类型 | 说明 | 示例 |
|------|------|------|
| `INT` | 整数 | `INT`, `BIGINT`, `SMALLINT` |
| `DECIMAL` | 精确小数 | `DECIMAL(10,2)` |
| `FLOAT` | 浮点数 | `FLOAT`, `DOUBLE` |
| `VARCHAR` | 变长字符串 | `VARCHAR(255)` |
| `CHAR` | 定长字符串 | `CHAR(10)` |
| `TEXT` | 长文本 | `TEXT` |
| `DATE` | 日期 | `DATE` |
| `DATETIME` | 日期时间 | `DATETIME` |
| `TIMESTAMP` | 时间戳 | `TIMESTAMP` |
| `BOOLEAN` | 布尔值 | `BOOLEAN` |

## 最佳实践

1. **始终使用 WHERE 子句**：避免意外更新或删除所有数据
2. **使用事务**：对重要操作使用 BEGIN TRANSACTION / COMMIT / ROLLBACK
3. **给表起别名**：多表查询时提高可读性
4. **避免 SELECT ***：只查询需要的列，提高性能
5. **使用索引**：对频繁查询的列建立索引
6. **参数化查询**：防止 SQL 注入攻击

## 总结

SQL 是数据处理的基石，掌握以下核心语句即可应对大多数场景：

| 操作 | 语句 |
|------|------|
| 查询 | `SELECT ... FROM ... WHERE ...` |
| 插入 | `INSERT INTO ... VALUES ...` |
| 更新 | `UPDATE ... SET ... WHERE ...` |
| 删除 | `DELETE FROM ... WHERE ...` |
| 排序 | `ORDER BY ...` |
| 分组 | `GROUP BY ... HAVING ...` |
| 连接 | `JOIN ... ON ...` |

熟练运用这些语句，你就能高效地从数据库中获取和操作数据了。
