# Git 版本控制完全指南

Git 是一个开源的分布式版本控制系统，由 Linus Torvalds 于 2005 年为管理 Linux 内核开发而创建。它以其高效、灵活和强大的分支管理能力，迅速成为现代软件开发中最流行的版本控制工具。

---

## 目录

1. [Git 简介](#一-git-简介)
2. [Git 与 SVN 的区别](#二-git-与-svn-的区别)
3. [Git 安装配置](#三-git-安装配置)
4. [Git 工作流程](#四-git-工作流程)
5. [Git 基本操作](#五-git-基本操作)
6. [Git 分支管理](#六-git-分支管理)
7. [Git 远程仓库](#七-git-远程仓库)
8. [Git 标签管理](#八-git-标签管理)
9. [Git 进阶技巧](#九-git-进阶技巧)
10. [Git 常用命令速查表](#十-git-常用命令速查表)

---

## 一、Git 简介

### 1.1 什么是 Git

Git 是一个**分布式版本控制系统**，它允许开发者在本地拥有完整的代码仓库副本，包括完整的历史记录。这意味着：

- **离线工作**：无需网络连接即可提交代码
- **数据安全**：每个开发者都有完整的备份
- **协作高效**：支持多人并行开发
- **分支轻量**：创建和切换分支极其快速

### 1.2 Git 的核心特点

| 特性 | 说明 |
|------|------|
| **分布式** | 每个开发者拥有完整的仓库副本 |
| **高效性** | 快照式存储，操作速度快 |
| **完整性** | 使用 SHA-1 哈希确保数据完整性 |
| **分支模型** | 轻量级分支，支持灵活的工作流 |
| **暂存区** | 精细控制提交内容 |

---

## 二、Git 与 SVN 的区别

### 2.1 架构对比

| 对比项 | Git | SVN |
|--------|-----|-----|
| **架构** | 分布式 | 集中式 |
| **本地仓库** | 完整副本 | 仅工作副本 |
| **网络依赖** | 离线可工作 | 需要连接服务器 |
| **分支** | 轻量、快速 | 重量级、复制目录 |
| **存储方式** | 快照（内容寻址） | 差异存储 |
| **版本号** | 40位 SHA-1 哈希 | 递增数字 |

### 2.2 工作流程对比

**SVN 工作流程**：
```
工作副本 → 提交 → 中央服务器
```

**Git 工作流程**：
```
工作目录 → 暂存区 → 本地仓库 → 推送 → 远程仓库
```

---

## 三、Git 安装配置

### 3.1 安装 Git

**Windows 安装**：
1. 访问 https://git-scm.com/download/win
2. 下载安装包并运行
3. 按向导完成安装

**macOS 安装**：
```bash
# 使用 Homebrew
brew install git

# 或下载安装包
# https://git-scm.com/download/mac
```

**Linux 安装**：
```bash
# Ubuntu/Debian
sudo apt-get install git

# CentOS/RHEL
sudo yum install git

# Fedora
sudo dnf install git
```

### 3.2 配置 Git

安装完成后，需要配置用户信息：

```bash
# 配置用户名
git config --global user.name "你的名字"

# 配置邮箱
git config --global user.email "your.email@example.com"

# 配置默认编辑器（可选）
git config --global core.editor "vim"

# 查看配置
git config --list
```

### 3.3 配置文件位置

| 级别 | 命令 | 配置文件位置 |
|------|------|--------------|
| 系统级 | `--system` | `/etc/gitconfig` |
| 全局级 | `--global` | `~/.gitconfig` 或 `~/.config/git/config` |
| 仓库级 | `--local` | `.git/config` |

---

## 四、Git 工作流程

### 4.1 Git 的三个工作区域

Git 管理项目时有三个主要区域：

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  工作目录    │ →→→ │   暂存区    │ →→→ │  本地仓库   │
│ (Working    │     │   (Stage)   │     │ (Repository)│
│  Directory) │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
      ↑                                         │
      └─────────────────────────────────────────┘
                    检出 (Checkout)
```

**工作目录（Working Directory）**：
- 你实际看到的文件
- 可以编辑、修改文件

**暂存区（Staging Area/Index）**：
- 准备提交的更改
- 使用 `git add` 将更改放入暂存区

**本地仓库（Repository）**：
- 保存项目的完整历史
- 使用 `git commit` 将暂存区内容提交到仓库

### 4.2 文件状态流转

```
                    git add
    未跟踪 ─────────────────────→ 已暂存
   (Untracked)                  (Staged)
       │                            │
       │ 编辑文件                    │ git commit
       ↓                            ↓
    已修改 ─────────────────────→ 已提交
   (Modified)                   (Committed)
       ↑                            │
       └──────── git checkout ──────┘
```

**四种文件状态**：

| 状态 | 说明 |
|------|------|
| **Untracked** | 未跟踪，Git 不管理该文件 |
| **Unmodified** | 未修改，文件与仓库一致 |
| **Modified** | 已修改，文件有变动但未暂存 |
| **Staged** | 已暂存，已标记为准备提交 |

---

## 五、Git 基本操作

### 5.1 创建仓库

**初始化新仓库**：
```bash
# 进入项目目录
cd my-project

# 初始化 Git 仓库
git init

# 查看仓库状态
git status
```

**克隆现有仓库**：
```bash
# 克隆远程仓库
git clone https://github.com/user/repo.git

# 克隆到指定目录
git clone https://github.com/user/repo.git my-folder

# 克隆特定分支
git clone -b branch-name https://github.com/user/repo.git
```

### 5.2 基本工作流程

```bash
# 1. 查看文件状态
git status

# 2. 添加文件到暂存区
git add filename.txt          # 添加单个文件
git add .                     # 添加所有更改
git add *.js                  # 添加所有 .js 文件
git add -A                    # 添加所有更改（包括删除）

# 3. 提交更改
git commit -m "提交说明"

# 4. 查看提交历史
git log
git log --oneline             # 简洁显示
git log --graph               # 图形化显示分支
```

### 5.3 查看与比较

```bash
# 查看工作区与暂存区的差异
git diff

# 查看暂存区与最新提交的差异
git diff --cached
git diff --staged

# 查看指定文件的差异
git diff filename.txt

# 查看提交历史（详细）
git log -p                    # 显示补丁
git log --stat                # 显示统计信息
git log --author="用户名"      # 按作者筛选
git log --since="2024-01-01"  # 按日期筛选

# 查看某次提交的详情
git show commit-id
```

### 5.4 撤销操作

```bash
# 撤销工作区的修改（未暂存）
git checkout -- filename.txt
git restore filename.txt      # Git 2.23+ 新命令

# 撤销暂存区的文件（保留修改）
git reset HEAD filename.txt
git restore --staged filename.txt  # Git 2.23+ 新命令

# 修改最后一次提交
git commit --amend -m "新的提交说明"

# 回退到指定版本（保留修改）
git reset --soft HEAD~1

# 回退到指定版本（丢弃修改）
git reset --hard commit-id

# 查看所有操作记录（用于恢复）
git reflog
```

### 5.5 忽略文件

创建 `.gitignore` 文件：

```gitignore
# 忽略所有 .log 文件
*.log

# 忽略 node_modules 目录
node_modules/

# 忽略编译输出
dist/
build/

# 忽略 IDE 配置
.idea/
.vscode/
*.swp

# 忽略操作系统文件
.DS_Store
Thumbs.db

# 忽略环境变量文件（包含敏感信息）
.env
.env.local

# 不忽略特定的 .log 文件
!important.log
```

**忽略规则语法**：

| 模式 | 说明 |
|------|------|
| `*` | 匹配任意字符（0个或多个） |
| `?` | 匹配单个字符 |
| `[abc]` | 匹配方括号内的任意字符 |
| `**` | 匹配任意目录层级 |
| `!` | 否定模式（不忽略） |
| `#` | 注释 |

---

## 六、Git 分支管理

### 6.1 分支简介

分支是 Git 最强大的特性之一。它允许你在不影响主线的情况下开发新功能或修复 bug。

```
主分支 (main/master)
    │
    ├── 功能分支 (feature/login)
    │       └── 开发中...
    │
    ├── 修复分支 (fix/bug-123)
    │       └── 修复中...
    │
    └── 发布分支 (release/v1.0)
            └── 准备发布...
```

### 6.2 分支基本操作

```bash
# 查看分支
git branch                    # 本地分支
git branch -r                 # 远程分支
git branch -a                 # 所有分支

# 创建分支
git branch feature-branch

# 切换分支
git checkout feature-branch

# 创建并切换分支（快捷方式）
git checkout -b feature-branch
git switch -c feature-branch  # Git 2.23+ 新命令

# 切换分支（新命令）
git switch main               # Git 2.23+

# 删除分支
git branch -d feature-branch          # 已合并的分支
git branch -D feature-branch          # 强制删除未合并分支

# 重命名分支
git branch -m old-name new-name
```

### 6.3 分支合并

**快进合并（Fast-forward）**：
```bash
# 切换到主分支
git checkout main

# 合并功能分支
git merge feature-branch
```

**非快进合并（创建合并提交）**：
```bash
git merge --no-ff feature-branch -m "合并功能分支"
```

**变基（Rebase）**：
```bash
# 将 feature 分支变基到 main 上
git checkout feature-branch
git rebase main

# 交互式变基（修改历史）
git rebase -i HEAD~3
```

### 6.4 解决合并冲突

当两个分支修改了同一文件的同一部分时，会产生冲突：

```bash
# 1. 尝试合并
git merge feature-branch

# 2. 如果发生冲突，Git 会提示
#    CONFLICT (content): Merge conflict in filename.txt

# 3. 打开冲突文件，会看到类似内容：
<<<<<<< HEAD
这里是当前分支的内容
=======
这里是合并分支的内容
>>>>>>> feature-branch

# 4. 手动编辑文件，解决冲突，删除标记

# 5. 标记冲突已解决
git add filename.txt

# 6. 完成合并
git commit -m "解决合并冲突"

# 或放弃合并
git merge --abort
```

### 6.5 Git Flow 工作流

Git Flow 是一种经典的分支管理模型：

```
main/master (生产分支)
    │
    ├── develop (开发分支)
    │       │
    │       ├── feature/* (功能分支)
    │       │       └── 完成后合并到 develop
    │       │
    │       └── release/* (发布分支)
    │               └── 测试完成后合并到 main 和 develop
    │
    └── hotfix/* (热修复分支)
            └── 紧急修复后合并到 main 和 develop
```

**Git Flow 命令**：
```bash
# 初始化 Git Flow
git flow init

# 创建功能分支
git flow feature start my-feature
git flow feature finish my-feature

# 创建发布分支
git flow release start v1.0.0
git flow release finish v1.0.0

# 创建热修复分支
git flow hotfix start fix-1.0.1
git flow hotfix finish fix-1.0.1
```

---

## 七、Git 远程仓库

### 7.1 远程仓库基础

```bash
# 查看远程仓库
git remote -v

# 添加远程仓库
git remote add origin https://github.com/user/repo.git

# 修改远程仓库 URL
git remote set-url origin https://new-url.git

# 删除远程仓库
git remote remove origin

# 重命名远程仓库
git remote rename old-name new-name
```

### 7.2 推送与拉取

```bash
# 推送到远程仓库
git push origin main
git push -u origin main       # 设置上游分支

# 拉取远程更新
git pull origin main

# 获取远程更新（不合并）
git fetch origin

# 推送所有分支
git push --all origin

# 强制推送（谨慎使用）
git push --force origin main
git push -f origin main

# 推送标签
git push origin --tags
```

### 7.3 分支与远程

```bash
# 推送本地分支到远程
git push -u origin feature-branch

# 删除远程分支
git push origin --delete feature-branch
git push origin :feature-branch

# 跟踪远程分支
git branch --track feature origin/feature
git checkout --track origin/feature

# 设置上游分支
git branch -u origin/feature feature
```

### 7.4 同步工作流

**基本协作流程**：
```bash
# 1. 开始工作前拉取最新代码
git pull origin main

# 2. 创建功能分支
git checkout -b feature-login

# 3. 开发并提交
git add .
git commit -m "添加登录功能"

# 4. 推送到远程
git push -u origin feature-login

# 5. 创建 Pull Request 进行代码审查

# 6. 审查通过后合并到 main

# 7. 删除本地功能分支
git checkout main
git pull origin main
git branch -d feature-login
```

---

## 八、Git 标签管理

### 8.1 标签简介

标签用于标记特定的提交，通常用于版本发布（如 v1.0.0）。

**两种标签类型**：
- **轻量标签（Lightweight）**：只是一个提交的引用
- **附注标签（Annotated）**：包含标签信息（作者、日期、说明）

### 8.2 标签操作

```bash
# 创建轻量标签
git tag v1.0.0

# 创建附注标签
git tag -a v1.0.0 -m "版本 1.0.0 发布"

# 为特定提交创建标签
git tag -a v0.9.0 commit-id -m "版本 0.9.0"

# 查看标签
git tag
git tag -l "v1.*"

# 查看标签详情
git show v1.0.0

# 推送标签到远程
git push origin v1.0.0
git push origin --tags        # 推送所有标签

# 删除本地标签
git tag -d v1.0.0

# 删除远程标签
git push origin --delete tag v1.0.0

# 检出标签（创建分离头指针）
git checkout v1.0.0

# 从标签创建分支
git checkout -b version-1.0 v1.0.0
```

### 8.3 语义化版本

推荐遵循 [语义化版本规范](https://semver.org/lang/zh-CN/)：

```
版本格式：主版本号.次版本号.修订号（MAJOR.MINOR.PATCH）

MAJOR：不兼容的 API 修改
MINOR：向下兼容的功能新增
PATCH：向下兼容的问题修复

示例：v1.2.3
```

---

## 九、Git 进阶技巧

### 9.1 储藏（Stash）

临时保存未提交的更改：

```bash
# 储藏当前更改
git stash
git stash push -m "描述信息"

# 查看储藏列表
git stash list

# 应用最近储藏（不删除）
git stash apply

# 应用指定储藏
git stash apply stash@{2}

# 应用并删除最近储藏
git stash pop

# 删除储藏
git stash drop stash@{0}
git stash clear               # 删除所有储藏

# 查看储藏内容
git stash show
git stash show -p
```

### 9.2 子模块（Submodule）

管理项目中的其他 Git 仓库：

```bash
# 添加子模块
git submodule add https://github.com/user/lib.git libs/lib

# 克隆包含子模块的项目
git clone --recurse-submodules https://github.com/user/project.git

# 初始化子模块
git submodule init
git submodule update

# 更新子模块
git submodule update --remote

# 删除子模块
# 1. 删除 .gitmodules 中的相关配置
# 2. 删除 .git/config 中的相关配置
# 3. 运行 git rm --cached path/to/submodule
# 4. 删除子模块目录
```

### 9.3 Cherry-pick

选择性地应用某个提交的更改：

```bash
# 将指定提交应用到当前分支
git cherry-pick commit-id

# Cherry-pick 多个提交
git cherry-pick commit-id1 commit-id2

# Cherry-pick 一个范围
git cherry-pick commit-id1^..commit-id2
```

### 9.4 交互式 Rebase

修改提交历史：

```bash
# 修改最近 3 个提交
git rebase -i HEAD~3

# 交互式命令
# p, pick = 使用提交
# r, reword = 使用提交，但修改提交信息
# e, edit = 使用提交，但停止以修改
# s, squash = 使用提交，但合并到上一个提交
# f, fixup = 类似 squash，但丢弃提交信息
# x, exec = 运行命令
# d, drop = 删除提交
```

### 9.5 搜索与追溯

```bash
# 在代码历史中搜索
git log -S "搜索内容"
git log -G "正则表达式"

# 查看某行代码的修改历史
git blame filename.txt

# 查看某行代码的详细修改历史
git blame -L 10,20 filename.txt

# 查找引入 bug 的提交
git bisect start
git bisect bad              # 标记当前为 bad
git bisect good commit-id   # 标记某个提交为 good
git bisect reset            # 结束二分查找
```

---

## 十、Git 常用命令速查表

### 10.1 基础命令

| 命令 | 说明 |
|------|------|
| `git init` | 初始化仓库 |
| `git clone <url>` | 克隆仓库 |
| `git status` | 查看状态 |
| `git add <file>` | 添加文件到暂存区 |
| `git add .` | 添加所有更改 |
| `git commit -m "msg"` | 提交更改 |
| `git commit -am "msg"` | 添加并提交 |
| `git push` | 推送到远程 |
| `git pull` | 拉取并合并 |
| `git fetch` | 获取远程更新 |

### 10.2 分支命令

| 命令 | 说明 |
|------|------|
| `git branch` | 列出分支 |
| `git branch <name>` | 创建分支 |
| `git checkout <branch>` | 切换分支 |
| `git checkout -b <name>` | 创建并切换 |
| `git merge <branch>` | 合并分支 |
| `git branch -d <name>` | 删除分支 |
| `git rebase <branch>` | 变基到分支 |

### 10.3 查看命令

| 命令 | 说明 |
|------|------|
| `git log` | 查看历史 |
| `git log --oneline` | 简洁历史 |
| `git log --graph` | 图形化历史 |
| `git diff` | 查看差异 |
| `git show <commit>` | 查看提交详情 |
| `git blame <file>` | 逐行追溯 |

### 10.4 撤销命令

| 命令 | 说明 |
|------|------|
| `git checkout -- <file>` | 撤销工作区修改 |
| `git reset HEAD <file>` | 撤销暂存 |
| `git reset --soft HEAD~1` | 软回退 |
| `git reset --hard <commit>` | 硬回退 |
| `git revert <commit>` | 撤销提交 |
| `git commit --amend` | 修改最后一次提交 |

### 10.5 远程命令

| 命令 | 说明 |
|------|------|
| `git remote -v` | 查看远程仓库 |
| `git remote add <name> <url>` | 添加远程仓库 |
| `git push <remote> <branch>` | 推送分支 |
| `git pull <remote> <branch>` | 拉取分支 |
| `git fetch <remote>` | 获取更新 |

---

## 结语

Git 是现代软件开发不可或缺的工具。掌握 Git 不仅能提高个人开发效率，更是团队协作的基础。建议在实际项目中多加练习，逐步熟悉各种命令和工作流。

**学习建议**：
1. 从基础命令开始，逐步深入
2. 理解 Git 的工作原理，而不仅是记住命令
3. 在真实项目中实践，积累经验
4. 学习团队协作的工作流（如 Git Flow、GitHub Flow）
5. 善用 `.gitignore` 和分支管理

**推荐资源**：
- [Git 官方文档](https://git-scm.com/doc)
- [Pro Git 中文版](https://git-scm.com/book/zh/v2)
- [GitHub Git 备忘单](https://education.github.com/git-cheat-sheet-education.pdf)

---

*本文档基于 Git 2.x 版本编写，部分新命令需要 Git 2.23+ 版本支持。*
