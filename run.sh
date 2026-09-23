#!/bin/bash

echo "Starting Clinical Note Summarizer..."
echo

echo "Step 1: Ensure Ollama is running"
echo "Run 'ollama serve' in a separate terminal if not already running"
echo

echo "Step 2: Starting Backend Server..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server in background
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

echo "Backend server started (PID: $BACKEND_PID)"
echo

echo "Step 3: Starting Frontend Server..."
cd ../frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Start frontend server in background
npm run dev &
FRONTEND_PID=$!

echo "Frontend server started (PID: $FRONTEND_PID)"
echo

echo "Servers running:"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo

echo "Press Ctrl+C to stop all servers"

# Wait for Ctrl+C
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait