/**
 * Personal Web - 本地开发服务器
 * 功能：
 *   1. 静态文件服务（整个项目目录）
 *   2. GET /api/docs  — 返回 docs/ 目录树 JSON（内存缓存，文件变动自动刷新）
 *   3. 启动时自动生成 docs/_sidebar.json（静态 fallback）
 *   4. 支持 CORS，方便直接打开 html 文件调试
 *
 * 启动：node server.js
 * 默认端口：3000，可通过环境变量 PORT 修改
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT    = process.env.PORT || 3000;
const ROOT    = __dirname;
const DOCS    = path.join(ROOT, 'docs');
const SIDEBAR = path.join(DOCS, '_sidebar.json');

// ===== MIME 类型 =====
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md':   'text/markdown; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.mp4':  'video/mp4',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
};

// ===== 内存缓存 =====
let docsCache     = null;   // { categories: [...] }
let cacheValid    = false;  // 是否有效
let rebuildTimer  = null;   // 防抖 timer

// ===== 扫描 docs/ 目录，生成目录树 =====
function scanDocs(dir) {
  const categories = [];

  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return categories;
  }

  // 只处理子文件夹（每个子文件夹 = 一个分类）
  const folders = entries
    .filter(e => e.isDirectory() && !e.name.startsWith('_') && !e.name.startsWith('.'))
    .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));

  for (const folder of folders) {
    const catPath = path.join(dir, folder.name);
    let files;
    try {
      files = fs.readdirSync(catPath, { withFileTypes: true });
    } catch { continue; }

    const docs = files
      .filter(f => f.isFile() && f.name.toLowerCase().endsWith('.md') && !f.name.startsWith('_'))
      .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
      .map(f => {
        // 从 md 文件第一行 # 标题读取展示名，fallback 用文件名
        const filePath = path.join(catPath, f.name);
        let title = f.name.replace(/\.md$/i, '');
        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          const firstLine = content.split('\n').find(l => l.trim());
          if (firstLine && firstLine.startsWith('#')) {
            title = firstLine.replace(/^#+\s*/, '').trim() || title;
          }
        } catch {}
        return { file: f.name, title, mtime: fs.statSync(filePath).mtimeMs };
      });

    if (docs.length === 0) continue;

    categories.push({
      id:   folder.name,
      name: folder.name,
      docs: docs,
    });
  }

  return categories;
}

// ===== 重建缓存（防抖 300ms，避免 watch 事件频繁触发） =====
function rebuildCache() {
  if (rebuildTimer) clearTimeout(rebuildTimer);
  rebuildTimer = setTimeout(() => {
    const categories = scanDocs(DOCS);
    docsCache  = { categories };
    cacheValid = true;
    // 同步写入 _sidebar.json（静态 fallback）
    try {
      fs.writeFileSync(SIDEBAR, JSON.stringify(docsCache, null, 2), 'utf-8');
      console.log(`  ✦ [${new Date().toLocaleTimeString()}] 目录树已更新 → _sidebar.json`);
    } catch (e) {
      console.warn('  ⚠ 写入 _sidebar.json 失败：', e.message);
    }
  }, 300);
}

// ===== 监听 docs/ 目录变化，自动刷新缓存 =====
function watchDocs(dir) {
  try {
    // recursive:true 在 Windows/macOS 上递归监听
    fs.watch(dir, { recursive: true }, (event, filename) => {
      if (filename && !filename.includes('_sidebar.json')) {
        cacheValid = false;  // 标记缓存失效，下次请求时重建
        rebuildCache();
      }
    });
  } catch {
    // Linux 上 recursive 不支持，降级为只监听一层目录
    try {
      fs.watch(dir, (event, filename) => {
        if (filename && !filename.includes('_sidebar.json')) {
          cacheValid = false;
          rebuildCache();
        }
      });
    } catch {}
  }
}

// ===== 请求处理 =====
const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  const urlObj  = new URL(req.url, `http://localhost:${PORT}`);
  const urlPath = decodeURIComponent(urlObj.pathname);

  // ── API: 目录树（直接返回内存缓存）──
  if (urlPath === '/api/docs') {
    if (!cacheValid) rebuildCache();   // 若标记失效则重建（通常已完成）
    const json = JSON.stringify(docsCache || { categories: [] });
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache',
    });
    res.end(json);
    return;
  }

  // ── 静态文件服务 ──
  let filePath = path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath);

  // 安全：不允许路径穿越
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }

  // 如果是目录，尝试 index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`404 Not Found: ${urlPath}`);
    return;
  }

  const ext  = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || 'application/octet-stream';

  // 图片/视频加缓存头，减少重复请求
  const isMedia = ['.png','.jpg','.jpeg','.gif','.webp','.mp4','.woff2','.woff'].includes(ext);
  const cacheHeader = isMedia
    ? { 'Cache-Control': 'public, max-age=86400' }   // 图片缓存 1 天
    : { 'Cache-Control': 'no-cache' };

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500); res.end('Server Error'); return;
    }
    res.writeHead(200, { 'Content-Type': mime, ...cacheHeader });
    res.end(data);
  });
});

// ===== 启动 =====
// 先预热缓存，再开始监听，再启动 HTTP
console.log('');
console.log('  ✦ 正在扫描 docs/ 目录...');
const categories = scanDocs(DOCS);
docsCache  = { categories };
cacheValid = true;
// 生成 _sidebar.json
try {
  fs.writeFileSync(SIDEBAR, JSON.stringify(docsCache, null, 2), 'utf-8');
  console.log(`  ✦ _sidebar.json 已生成（${categories.length} 个分类）`);
} catch (e) {
  console.warn('  ⚠ 写入 _sidebar.json 失败：', e.message);
}
watchDocs(DOCS);

server.listen(PORT, () => {
  console.log('');
  console.log('  ✦ Personal Web 服务已启动');
  console.log(`  ✦ 访问地址：http://localhost:${PORT}`);
  console.log(`  ✦ 知识库：  http://localhost:${PORT}/knowledge.html`);
  console.log('');
  console.log('  在 docs/ 子文件夹中放入 .md 文件，刷新页面即可自动显示。');
  console.log('  按 Ctrl+C 停止服务器。');
  console.log('');
});
