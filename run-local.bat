@echo off
cd /d "%~dp0"
start "Embodied Atlas Local Server" cmd /k "python -m http.server 8000 --directory docs"
timeout /t 2 /nobreak >nul
start http://localhost:8000
