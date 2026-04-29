/**
 * gen-tree.js — 自动扫描 docs/ 目录生成 EMBEDDED_TREE 数据
 *
 * 用法：node gen-tree.js
 *
 * 规则：
 * 1. 扫描 docs/ 下所有子文件夹
 * 2. 每个文件夹内的 .md 文件按文件名排序
 * 3. 文件名中的数字前缀（如 01-、02-）会被从标题中移除
 * 4. 分类顺序按文件夹名排序（可给文件夹也加数字前缀）
 * 5. 排除 README.md
 * 6. 输出可直接粘贴到 knowledge.html 的 EMBEDDED_TREE
 */

const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, 'docs');

// 去掉文件名中的数字前缀，如 "01-ai-learning-roadmap.md" → "AI Learning Roadmap"
function stripNumberPrefix(filename) {
  return filename.replace(/^\d+[-_]/, '').replace(/\.md$/, '');
}

// 从文件名生成可读标题（将 kebab-case 转为 Title Case）
function fileToTitle(filename) {
  const name = stripNumberPrefix(filename);
  return name
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function main() {
  const categories = fs.readdirSync(DOCS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort(); // 按文件夹名排序（数字前缀自然排前面）

  const tree = categories.map(cat => {
    const catDir = path.join(DOCS_DIR, cat);
    const files = fs.readdirSync(catDir)
      .filter(f => f.endsWith('.md') && f !== 'README.md')
      .sort(); // 按文件名排序（数字前缀自然排前面）

    const docs = files.map(f => ({
      file: f,
      title: fileToTitle(f)
    }));

    return { id: cat, name: cat, docs };
  });

  // 格式化输出
  console.log('const EMBEDDED_TREE = [');
  tree.forEach((cat, i) => {
    const isLast = i === tree.length - 1;
    console.log(`  { id:'${cat.id}', name:'${cat.name}', docs:[`);
    cat.docs.forEach((doc, j) => {
      const docLast = j === cat.docs.length - 1;
      console.log(`    { file:'${doc.file}', title:'${doc.title}' }${docLast ? '' : ','}`);
    });
    console.log(`  ]}${isLast ? '' : ','}`);
  });
  console.log('];');
  console.log('');
  console.log(`// 共 ${categories.length} 个分类，${tree.reduce((s, c) => s + c.docs.length, 0)} 篇文章`);
}

main();
