# MySQL 完全指南

MySQL 是世界上最流行的开源关系型数据库管理系统（RDBMS），由瑞典 MySQL AB 公司开发，现属于 Oracle 旗下产品。它以其高性能、可靠性和易用性，成为 Web 应用开发的首选数据库。

## MySQL 简介

### 什么是 MySQL

MySQL 是一个基于 SQL 的关系型数据库管理系统，具有以下特点：

- **开源免费**：社区版完全免费，源码开放
- **跨平台**：支持 Windows、Linux、macOS 等多种操作系统
- **高性能**：优化的查询缓存和索引机制
- **高可靠**：支持主从复制、集群部署
- **易使用**：丰富的管理工具和文档

### MySQL 的应用场景

| 场景 | 说明 |
|------|------|
| Web 应用 | LAMP/LNMP 架构的核心组件 |
| 电商平台 | 处理高并发交易数据 |
| 内容管理 | WordPress、Drupal 等 CMS 系统 |
| 日志系统 | 存储和分析海量日志数据 |
| 数据仓库 | 配合 BI 工具进行数据分析 |

## 安装与配置

### 安装方法

#### Windows 安装

1. 下载 MySQL Installer：[https://dev.mysql.com/downloads/installer/](https://dev.mysql.com/downloads/installer/)
2. 选择安装类型（推荐选择 "Server only" 或 "Full"）
3. 配置 root 密码和端口号（默认 3306）
4. 完成安装并启动服务

#### Linux 安装（Ubuntu/Debian）

```bash
# 更新包列表
sudo apt update

# 安装 MySQL Server
sudo apt install mysql-server

# 启动服务
sudo systemctl start mysql

# 设置开机自启
sudo systemctl enable mysql

# 运行安全脚本
sudo mysql_secure_installation
```

#### macOS 安装

```bash
# 使用 Homebrew 安装
brew install mysql

# 启动服务
brew services start mysql
```

### 基本配置

MySQL 的配置文件通常位于：
- Windows: `C:\ProgramData\MySQL\MySQL Server X.X\my.ini`
- Linux/macOS: `/etc/mysql/my.cnf` 或 `/etc/my.cnf`

常用配置项：

```ini
[mysqld]
# 端口号
port=3306

# 数据目录
datadir=/var/lib/mysql

# 字符集设置
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci

# 最大连接数
max_connections=200

# 缓冲区大小
innodb_buffer_pool_size=1G
```

## 数据库操作

### 连接与断开

```bash
# 命令行连接
mysql -u root -p

# 连接指定数据库
mysql -u root -p database_name

# 远程连接
mysql -h hostname -P port -u username -p
```

### 数据库管理

```sql
-- 创建数据库
CREATE DATABASE mydb;
CREATE DATABASE mydb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 查看所有数据库
SHOW DATABASES;

-- 选择数据库
USE mydb;

-- 查看当前数据库
SELECT DATABASE();

-- 删除数据库（谨慎操作！）
DROP DATABASE mydb;

-- 修改数据库字符集
ALTER DATABASE mydb CHARACTER SET utf8mb4;
```

## 数据类型详解

### 数值类型

| 类型 | 存储空间 | 范围（有符号） | 用途 |
|------|----------|----------------|------|
| `TINYINT` | 1 字节 | -128 ~ 127 | 小整数 |
| `SMALLINT` | 2 字节 | -32768 ~ 32767 | 较小整数 |
| `MEDIUMINT` | 3 字节 | -8388608 ~ 8388607 | 中等整数 |
| `INT/INTEGER` | 4 字节 | -21亿 ~ 21亿 | 标准整数 |
| `BIGINT` | 8 字节 | 极大范围 | 大整数 |
| `FLOAT` | 4 字节 | -3.4E38 ~ 3.4E38 | 单精度浮点 |
| `DOUBLE` | 8 字节 | 极大范围 | 双精度浮点 |
| `DECIMAL(M,D)` | 变长 | 精确小数 | 货币金额 |

```sql
-- 示例
CREATE TABLE products (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    price DECIMAL(10, 2),  -- 最大99999999.99
    stock INT DEFAULT 0,
    weight FLOAT
);
```

### 字符串类型

| 类型 | 最大长度 | 特点 | 适用场景 |
|------|----------|------|----------|
| `CHAR(n)` | 255 字符 | 定长，速度快 | 固定长度数据（如手机号） |
| `VARCHAR(n)` | 65535 字节 | 变长，省空间 | 可变长度文本 |
| `TINYTEXT` | 255 字节 | 小文本 | 简短描述 |
| `TEXT` | 64KB | 普通文本 | 文章内容 |
| `MEDIUMTEXT` | 16MB | 中等文本 | 长文章 |
| `LONGTEXT` | 4GB | 超大文本 | 书籍、文档 |
| `BLOB` | 64KB | 二进制数据 | 图片、文件 |

```sql
CREATE TABLE articles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    summary TINYTEXT,
    content TEXT,
    cover_image BLOB
);
```

### 日期时间类型

| 类型 | 格式 | 范围 | 用途 |
|------|------|------|------|
| `DATE` | YYYY-MM-DD | 1000-01-01 ~ 9999-12-31 | 日期 |
| `TIME` | HH:MM:SS | -838:59:59 ~ 838:59:59 | 时间 |
| `DATETIME` | YYYY-MM-DD HH:MM:SS | 1000-01-01 ~ 9999-12-31 | 日期时间 |
| `TIMESTAMP` | YYYY-MM-DD HH:MM:SS | 1970-01-01 ~ 2038-01-19 | 时间戳 |
| `YEAR` | YYYY | 1901 ~ 2155 | 年份 |

```sql
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_name VARCHAR(100),
    event_date DATE,
    start_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 表操作

### 创建表

```sql
CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    email VARCHAR(100) NOT NULL UNIQUE COMMENT '邮箱',
    password VARCHAR(255) NOT NULL COMMENT '密码',
    age TINYINT UNSIGNED COMMENT '年龄',
    gender ENUM('male', 'female', 'other') DEFAULT 'other' COMMENT '性别',
    status TINYINT DEFAULT 1 COMMENT '状态：1正常 0禁用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

### 修改表结构

```sql
-- 添加列
ALTER TABLE users ADD phone VARCHAR(20) AFTER email;
ALTER TABLE users ADD address VARCHAR(200);

-- 修改列
ALTER TABLE users MODIFY phone VARCHAR(30);
ALTER TABLE users CHANGE phone mobile VARCHAR(30);

-- 删除列
ALTER TABLE users DROP COLUMN address;

-- 添加索引
ALTER TABLE users ADD INDEX idx_username (username);
CREATE INDEX idx_created ON users(created_at);

-- 删除索引
ALTER TABLE users DROP INDEX idx_username;
DROP INDEX idx_created ON users;

-- 修改表名
ALTER TABLE users RENAME TO members;
RENAME TABLE users TO members;
```

### 删除表

```sql
-- 删除表（表结构和数据）
DROP TABLE users;

-- 如果存在则删除
DROP TABLE IF EXISTS users;

-- 清空表数据（保留结构）
TRUNCATE TABLE users;

-- 删除表并重建（效果同 TRUNCATE）
DELETE FROM users;
```

## 数据操作（CRUD）

### 插入数据

```sql
-- 插入单条记录
INSERT INTO users (username, email, password, age)
VALUES ('zhangsan', 'zhangsan@example.com', 'encrypted_pass', 25);

-- 插入多条记录
INSERT INTO users (username, email, password)
VALUES 
    ('lisi', 'lisi@example.com', 'pass1'),
    ('wangwu', 'wangwu@example.com', 'pass2'),
    ('zhaoliu', 'zhaoliu@example.com', 'pass3');

-- 插入或更新（存在则更新）
INSERT INTO users (id, username, email)
VALUES (1, 'zhangsan', 'new@example.com')
ON DUPLICATE KEY UPDATE email = 'new@example.com';

-- 从其他表插入
INSERT INTO users_backup SELECT * FROM users WHERE status = 1;
```

### 查询数据

```sql
-- 基础查询
SELECT * FROM users;
SELECT username, email FROM users;

-- 条件查询
SELECT * FROM users WHERE age > 18;
SELECT * FROM users WHERE age BETWEEN 18 AND 30;
SELECT * FROM users WHERE username LIKE 'zhang%';

-- 排序
SELECT * FROM users ORDER BY age DESC;
SELECT * FROM users ORDER BY age ASC, created_at DESC;

-- 分页
SELECT * FROM users LIMIT 10;
SELECT * FROM users LIMIT 0, 10;  -- 第1页，每页10条
SELECT * FROM users LIMIT 10 OFFSET 20;  -- 第3页

-- 聚合查询
SELECT 
    COUNT(*) AS total_users,
    AVG(age) AS avg_age,
    MAX(age) AS max_age,
    MIN(age) AS min_age
FROM users;

-- 分组统计
SELECT status, COUNT(*) AS count
FROM users
GROUP BY status;

-- 分组过滤
SELECT age, COUNT(*) AS count
FROM users
GROUP BY age
HAVING count > 5;
```

### 更新数据

```sql
-- 更新单条记录
UPDATE users SET age = 26 WHERE id = 1;

-- 更新多条记录
UPDATE users SET status = 0 WHERE last_login < '2023-01-01';

-- 更新多个字段
UPDATE users 
SET age = 26, updated_at = NOW() 
WHERE id = 1;

-- 使用表达式更新
UPDATE products SET price = price * 1.1 WHERE category = 'electronics';
```

### 删除数据

```sql
-- 删除满足条件的记录
DELETE FROM users WHERE id = 1;

-- 删除多条记录
DELETE FROM users WHERE status = 0 AND created_at < '2023-01-01';

-- 删除所有记录（逐行删除，可回滚）
DELETE FROM users;

-- 清空表（快速，不可回滚）
TRUNCATE TABLE users;
```

## 高级查询

### 多表连接

```sql
-- 内连接
SELECT u.username, o.order_id, o.amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- 左连接
SELECT u.username, o.order_id
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;

-- 右连接
SELECT u.username, o.order_id
FROM users u
RIGHT JOIN orders o ON u.id = o.user_id;

-- 多表连接
SELECT 
    u.username,
    o.order_id,
    p.product_name,
    od.quantity
FROM users u
INNER JOIN orders o ON u.id = o.user_id
INNER JOIN order_details od ON o.order_id = od.order_id
INNER JOIN products p ON od.product_id = p.product_id;
```

### 子查询

```sql
-- 单行子查询
SELECT * FROM employees 
WHERE salary > (SELECT AVG(salary) FROM employees);

-- 多行子查询
SELECT * FROM products 
WHERE category_id IN (SELECT id FROM categories WHERE status = 'active');

-- 相关子查询
SELECT e1.* FROM employees e1
WHERE salary > (SELECT AVG(salary) FROM employees e2 WHERE e2.dept_id = e1.dept_id);

-- EXISTS 子查询
SELECT * FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);
```

### 联合查询

```sql
-- UNION（去重）
SELECT name FROM customers_2023
UNION
SELECT name FROM customers_2024;

-- UNION ALL（不去重）
SELECT name FROM customers_2023
UNION ALL
SELECT name FROM customers_2024;

-- 使用 ORDER BY（必须放在最后）
SELECT name, created_at FROM customers_2023
UNION ALL
SELECT name, created_at FROM customers_2024
ORDER BY created_at DESC;
```

## 索引优化

### 索引类型

| 类型 | 说明 | 适用场景 |
|------|------|----------|
| `PRIMARY KEY` | 主键索引 | 唯一标识记录 |
| `UNIQUE` | 唯一索引 | 确保值唯一 |
| `INDEX` | 普通索引 | 加速查询 |
| `FULLTEXT` | 全文索引 | 文本搜索 |
| `SPATIAL` | 空间索引 | 地理数据 |

### 创建索引

```sql
-- 创建表时添加索引
CREATE TABLE articles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200),
    content TEXT,
    FULLTEXT INDEX idx_content (title, content)
) ENGINE=InnoDB;

-- 单独创建索引
CREATE INDEX idx_title ON articles(title);
CREATE UNIQUE INDEX idx_email ON users(email);

-- 复合索引
CREATE INDEX idx_name_age ON users(username, age);
```

### 索引优化建议

1. **选择性高的列**：索引列的值分布越分散越好
2. **最左前缀原则**：复合索引按最左列开始匹配
3. **避免过多索引**：每个索引都会增加写操作开销
4. **定期维护**：使用 `ANALYZE TABLE` 更新统计信息
5. **覆盖索引**：查询字段都在索引中，避免回表

```sql
-- 查看查询是否使用索引
EXPLAIN SELECT * FROM users WHERE username = 'zhangsan';

-- 查看索引信息
SHOW INDEX FROM users;

-- 删除索引
DROP INDEX idx_name ON users;
```

## 事务处理

### 事务特性（ACID）

| 特性 | 说明 |
|------|------|
| **原子性** (Atomicity) | 事务中的所有操作要么全部完成，要么全部不完成 |
| **一致性** (Consistency) | 事务执行前后，数据库保持一致性状态 |
| **隔离性** (Isolation) | 并发事务之间相互隔离 |
| **持久性** (Durability) | 事务完成后，数据永久保存 |

### 事务控制

```sql
-- 开启事务
START TRANSACTION;
-- 或
BEGIN;

-- 执行操作
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

-- 提交事务
COMMIT;

-- 回滚事务
ROLLBACK;
```

### 事务隔离级别

```sql
-- 查看隔离级别
SELECT @@transaction_isolation;

-- 设置隔离级别
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
```

| 隔离级别 | 脏读 | 不可重复读 | 幻读 |
|----------|------|------------|------|
| READ UNCOMMITTED | ✓ | ✓ | ✓ |
| READ COMMITTED | ✗ | ✓ | ✓ |
| REPEATABLE READ | ✗ | ✗ | ✓ |
| SERIALIZABLE | ✗ | ✗ | ✗ |

## 用户与权限管理

### 用户管理

```sql
-- 创建用户
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'password123';
CREATE USER 'app_user'@'%' IDENTIFIED BY 'password123';

-- 修改密码
ALTER USER 'app_user'@'localhost' IDENTIFIED BY 'newpassword';
SET PASSWORD FOR 'app_user'@'localhost' = 'newpassword';

-- 删除用户
DROP USER 'app_user'@'localhost';

-- 查看用户
SELECT user, host FROM mysql.user;
```

### 权限管理

```sql
-- 授予权限
GRANT SELECT, INSERT, UPDATE ON mydb.* TO 'app_user'@'localhost';
GRANT ALL PRIVILEGES ON mydb.* TO 'admin'@'localhost';

-- 撤销权限
REVOKE INSERT ON mydb.* FROM 'app_user'@'localhost';

-- 刷新权限
FLUSH PRIVILEGES;

-- 查看权限
SHOW GRANTS FOR 'app_user'@'localhost';
```

### 常用权限

| 权限 | 说明 |
|------|------|
| `ALL PRIVILEGES` | 所有权限 |
| `SELECT` | 查询数据 |
| `INSERT` | 插入数据 |
| `UPDATE` | 更新数据 |
| `DELETE` | 删除数据 |
| `CREATE` | 创建表/数据库 |
| `DROP` | 删除表/数据库 |
| `INDEX` | 创建/删除索引 |
| `ALTER` | 修改表结构 |

## 备份与恢复

### 使用 mysqldump 备份

```bash
# 备份单个数据库
mysqldump -u root -p mydb > mydb_backup.sql

# 备份多个数据库
mysqldump -u root -p --databases db1 db2 > backup.sql

# 备份所有数据库
mysqldump -u root -p --all-databases > all_databases.sql

# 仅备份表结构
mysqldump -u root -p --no-data mydb > schema.sql

# 压缩备份
mysqldump -u root -p mydb | gzip > mydb_backup.sql.gz
```

### 恢复数据

```bash
# 恢复数据库
mysql -u root -p mydb < mydb_backup.sql

# 解压并恢复
gunzip < mydb_backup.sql.gz | mysql -u root -p mydb
```

### 使用 SQL 导入导出

```sql
-- 导出到文件
SELECT * INTO OUTFILE '/tmp/users.csv'
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
FROM users;

-- 从文件导入
LOAD DATA INFILE '/tmp/users.csv'
INTO TABLE users
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n';
```

## 性能优化

### 查询优化

```sql
-- 使用 EXPLAIN 分析查询
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';

-- 查看慢查询日志
SHOW VARIABLES LIKE 'slow_query_log';
SHOW VARIABLES LIKE 'long_query_time';
```

### 常用优化技巧

1. **选择合适的存储引擎**：InnoDB 支持事务，MyISAM 适合读多写少
2. **合理设计索引**：避免过多索引，定期优化表
3. **优化查询语句**：避免 SELECT *，使用 LIMIT 分页
4. **使用连接池**：减少连接开销
5. **读写分离**：主库写，从库读
6. **分库分表**：数据量过大时进行水平/垂直拆分

```sql
-- 优化表
OPTIMIZE TABLE users;

-- 分析表
ANALYZE TABLE users;

-- 检查表
CHECK TABLE users;

-- 修复表
REPAIR TABLE users;
```

## 总结

MySQL 作为最流行的开源数据库，掌握其核心概念和操作是 Web 开发的基础：

| 模块 | 核心内容 |
|------|----------|
| 安装配置 | 多平台安装、配置文件优化 |
| 数据类型 | 数值、字符串、日期时间类型选择 |
| 表操作 | CREATE、ALTER、DROP 语句 |
| CRUD | SELECT、INSERT、UPDATE、DELETE |
| 高级查询 | JOIN、子查询、联合查询 |
| 索引 | 索引类型、创建、优化 |
| 事务 | ACID、隔离级别、事务控制 |
| 权限 | 用户管理、权限分配 |
| 备份恢复 | mysqldump、导入导出 |

通过不断实践和优化，你可以充分发挥 MySQL 的性能，构建高效可靠的数据存储方案。
