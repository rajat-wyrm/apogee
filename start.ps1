# start.ps1
Write-Host "`n🚀 STARTING APOGEE SYSTEM..." -ForegroundColor Cyan

# Start auto-commit
Write-Host "`n🤖 Starting auto-commit..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "while(`$true) { Start-Sleep 30; git add .; git commit -m '🤖 auto: Backup at ' + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'); git push; }"

# Start frontend
Write-Host "`n🌐 Starting frontend server..." -ForegroundColor Yellow
cd frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

Write-Host "`n✅ ALL SYSTEMS STARTED!" -ForegroundColor Green
Write-Host "📡 Frontend: http://localhost:5173" -ForegroundColor Cyan
