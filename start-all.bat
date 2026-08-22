@echo off
chcp 65001 >nul
title Tonic Store - Launcher

REM -- Dung Node 20 LTS (portable tai C:\Users\thanh\nodejs20) --
set "PATH=C:\Users\thanh\nodejs20;%PATH%"

echo ============================================
echo   TONIC STORE - Khoi dong toan bo du an
echo   Node: dang su dung
node --version
echo ============================================
echo.

set ROOT=%~dp0

REM -- 1. Kiem tra MySQL (port 3306) --
powershell -NoProfile -Command "try { $c = New-Object Net.Sockets.TcpClient; $c.Connect('localhost', 3306); $c.Close(); exit 0 } catch { exit 1 }" >nul 2>&1
if %errorlevel% neq 0 (
    echo [MySQL] Dang khoi dong MySQL...
    start "" /min "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe" --datadir=C:\Users\thanh\mysql-data --port=3306 --console
    echo [MySQL] Cho MySQL san sang...
    :waitmysql
    timeout /t 2 /nobreak >nul
    powershell -NoProfile -Command "try { $c = New-Object Net.Sockets.TcpClient; $c.Connect('localhost', 3306); $c.Close(); exit 0 } catch { exit 1 }" >nul 2>&1
    if %errorlevel% neq 0 goto waitmysql
)
echo [MySQL] OK - dang chay tren port 3306

REM -- 2. Backend (port 8085) --
start "Tonic Backend (8085)" cmd /k "cd /d %ROOT%backend && yarn dev"

REM -- 3. Frontend (port 5173) --
timeout /t 3 /nobreak >nul
start "Tonic Frontend (5173)" cmd /k "cd /d %ROOT%frontend && yarn dev"

REM -- 4. Admin (port 3001) --
timeout /t 3 /nobreak >nul
start "Tonic Admin (3001)" cmd /k "cd /d %ROOT%admin && yarn dev"

echo.
echo ============================================
echo   Da khoi dong:
echo   - Backend API : http://localhost:8085  (docs: /api/docs)
echo   - Frontend    : http://localhost:5173
echo   - Admin       : http://localhost:3001
echo.
echo   Dong cac cua so cmd de dung dich vu.
echo   Tai khoan admin: admin@example.com / admin123
echo ============================================
echo.
pause
