
# Start all services for Prodigy Pathways

Write-Host "Starting Prodigy Pathways Services..." -ForegroundColor Green

# 1. Start Backend (Node.js)
Write-Host "Starting Backend (Port 4000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm start"

# 2. Start AI Service (Python)
Write-Host "Starting AI Service (Port 8000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd ai-service; if (Test-Path venv) { .\venv\Scripts\activate }; python api.py"

# 3. Start Frontend (React)
Write-Host "Starting Frontend (Port 5173)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "All services started in separate windows." -ForegroundColor Green
Write-Host "Please check each window for any errors." -ForegroundColor Yellow
