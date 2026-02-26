@echo off
REM PSB6 Health Platform Setup Script for Windows

echo ================================
echo PSB6 Health Platform Setup
echo ================================

REM Check prerequisites
echo Checking prerequisites...

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js not found. Please install Node.js 18+
    exit /b 1
)

where python >nul 2>nul
if %errorlevel% neq 0 (
    echo Python not found. Please install Python 3.9+
    exit /b 1
)

echo Prerequisites OK!

REM Backend setup
echo.
echo Setting up Backend...
cd server
call npm install
copy .env.example .env
echo Edit .env file with your configuration
call npm run seed
cd ..

REM Frontend setup
echo.
echo Setting up Frontend...
cd client
call npm install
copy .env.example .env
cd ..

REM AI Service setup
echo.
echo Setting up AI Service...
cd ai-service
python -m venv venv
call venv\Scripts\activate.bat
pip install -r requirements.txt
call venv\Scripts\deactivate.bat
cd ..

echo.
echo ================================
echo Setup Complete!
echo ================================
echo.
echo To start the application:
echo.
echo Terminal 1 (Backend):
echo   cd server && npm run dev
echo.
echo Terminal 2 (Frontend):
echo   cd client && npm start
echo.
echo Terminal 3 (AI Service):
echo   cd ai-service
echo   venv\Scripts\activate.bat
echo   python main.py
echo.
echo Access: http://localhost:3000
echo Default credentials: admin@healx.com / Admin@123456
echo.
pause
