@echo off
title Mind Scanner Local Server
echo ==========================================
echo Starting Mind Scanner Local Server...
echo ==========================================

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH.
    echo Please install Node.js first.
    pause
    exit /b 1
)

:: Check if node_modules exists, if not, run npm install
if not exist "node_modules\" (
    echo node_modules not found. Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo Error: npm install failed.
        pause
        exit /b 1
    )
)

:: Start the development server and open browser
echo Starting Next.js development server...
start http://localhost:3000
call npm run dev

pause
