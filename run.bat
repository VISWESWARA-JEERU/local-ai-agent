@echo off
echo Starting Clinical Note Summarizer...

echo.
echo Step 1: Ensure Ollama is running
echo Run 'ollama serve' in a separate terminal if not already running
echo.

echo Step 2: Starting Backend Server...
cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate.bat
pip install -r requirements.txt
start "Backend Server" uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

echo.
echo Step 3: Starting Frontend Server...
cd ..\frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    npm install
)
start "Frontend Server" npm run dev

echo.
echo Servers starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul