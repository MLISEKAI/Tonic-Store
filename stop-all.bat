@echo off
title Tonic Store - Stop all
echo Dang tat cac dich vu Tonic Store...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8085 .*LISTENING"') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173 .*LISTENING"') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001 .*LISTENING"') do taskkill /PID %%a /F >nul 2>&1

echo Da tat backend (8085), frontend (5173), admin (3001).
echo MySQL van giu chay (neu muon tat: taskkill /IM mysqld.exe /F)
pause
