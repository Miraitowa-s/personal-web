@echo off
chcp 65001 >nul
title Personal Web - 知识库服务器

cd /d "%~dp0"

:: 优先用系统 Node.js
where node >nul 2>&1
if %errorlevel% == 0 (
  echo [OK] 使用系统 Node.js
  node server.js
  goto :end
)

:: 备用：使用内置 Node.js
set NODE_FALLBACK=C:\Users\怪兽哪里跑\.workbuddy\binaries\node\versions\20.18.0.installing.5432.__extract_temp__\node-v20.18.0-win-x64\node.exe

if exist "%NODE_FALLBACK%" (
  echo [OK] 使用内置 Node.js v20.18.0
  "%NODE_FALLBACK%" server.js
  goto :end
)

echo.
echo [错误] 未找到 Node.js
echo 请安装 Node.js: https://nodejs.org/zh-cn/download
echo 安装完成后重新运行此脚本。
echo.
pause
:end
