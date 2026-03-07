@echo off
echo Starting Smart Pharmacy System (Mock ML Mode)...

echo Starting Backend API (Port 3001)...
start "Backend API" cmd /k "cd apps/api && npm run dev"

echo Starting Frontend (Port 3002)...
start "Frontend Web" cmd /k "cd apps/web && npm run dev"

echo Starting Mock ML Service (Port 8000)...
start "Mock ML Service" cmd /k "cd apps/ml && py mock_main.py"

echo All services started!
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3002
echo ML Service: http://localhost:8000/docs
pause
