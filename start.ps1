#!/usr/bin/env pwsh
# start.ps1 - Master startup with auto-fix

Write-Host "`n" + ("=" * 70) -ForegroundColor Cyan
Write-Host "🚀 APOGEE ULTIMATE STARTUP SYSTEM" -ForegroundColor Cyan
Write-Host "=" * 70 -ForegroundColor Cyan

# Step 1: Run error prevention
Write-Host "`n🛡️ Running error prevention..." -ForegroundColor Yellow
node error-prevention.js

# Step 2: Check node_modules
Write-Host "`n📦 Checking node_modules..." -ForegroundColor Yellow
if (-not (Test-Path "frontend/node_modules")) {
    Write-Host "⚠️ node_modules missing - installing..." -ForegroundColor Yellow
    cd frontend
    npm install
    cd ..
}

# Step 3: Check critical files
Write-Host "`n📁 Verifying critical files..." -ForegroundColor Yellow
$criticalFiles = @(
    "frontend/src/core/errors/ErrorHandler.js",
    "frontend/src/core/security/SecurityManager.js",
    "frontend/src/core/validation/Validator.js",
    "frontend/src/core/logger/Logger.js",
    "frontend/src/core/monitoring/PerformanceMonitor.js",
    "frontend/src/core/index.js",
    "frontend/src/ErrorBoundary.jsx"
)

$allGood = $true
foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $file MISSING!" -ForegroundColor Red
        $allGood = $false
    }
}

if (-not $allGood) {
    Write-Host "`n⚠️ Critical files missing! Running recovery..." -ForegroundColor Yellow
    node recovery-system.js
}

# Step 4: Start auto-commit
Write-Host "`n🤖 Starting auto-commit..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "while(`$true) { Start-Sleep 30; git add .; git commit -m '🤖 auto: Backup'; git push; }"

# Step 5: Start error prevention monitor
Write-Host "`n👁️ Starting error monitor..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node auto-recovery.js"

# Step 6: Start the app
Write-Host "`n🚀 Launching application..." -ForegroundColor Green
cd frontend
npm run dev

Write-Host "`n✅ All systems operational!" -ForegroundColor Green
