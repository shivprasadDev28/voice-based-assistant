@echo off
echo AI Meeting Assistant - Installation Script
echo ========================================
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo Then run this script again.
    pause
    exit /b 1
)

echo Node.js is installed!
echo.

echo Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo Installation completed successfully!
echo.
echo To start the application:
echo 1. Run: npm start
echo 2. Open your browser and go to: http://localhost:3000
echo.
echo Press any key to start the application now...
pause >nul

echo Starting the application...
npm start
