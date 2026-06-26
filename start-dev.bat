@echo off
echo Starting NEXORA Development Servers...
echo.

echo Starting Backend (NestJS) on port 3001...
start "NEXORA Backend" cmd /k "pnpm dev:server"

timeout /t 3 /nobreak >nul

echo Starting Frontend (Next.js) on port 3000...
start "NEXORA Frontend" cmd /k "pnpm dev:web"

timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo NEXORA is starting up!
echo ========================================
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:3001
echo API Docs: http://localhost:3001/api/docs
echo.
echo Test credentials:
echo Email: demo@nexora.ai
echo Password: password123
echo ========================================
echo.
echo Close this window to stop all servers.
pause