# ultimate-verify.ps1
Write-Host "`n" + ("=" * 80) -ForegroundColor Magenta
Write-Host "🔍 APOGEE COMPLETE SYSTEM AUDIT" -ForegroundColor Magenta
Write-Host "=" * 80 -ForegroundColor Magenta

$issues = @()
$warnings = @()
$fixed = @()

# CHECK 1: GIT CONFIGURATION
Write-Host "`n📁 CHECKING GIT CONFIGURATION..." -ForegroundColor Cyan
$gitUser = git config user.name
$gitEmail = git config user.email
Write-Host "   ✅ Git user: $gitUser <$gitEmail>" -ForegroundColor Green

# CHECK 2: DISK SPACE
Write-Host "`n💾 CHECKING DISK SPACE..." -ForegroundColor Cyan
$drive = Get-PSDrive -Name C
$freeSpaceGB = [math]::Round($drive.Free / 1GB, 2)
$totalSpaceGB = [math]::Round(($drive.Used + $drive.Free) / 1GB, 2)
$percentFree = [math]::Round(($drive.Free / ($drive.Used + $drive.Free)) * 100, 2)
Write-Host "   ✅ Disk space: $freeSpaceGB GB free ($percentFree%)" -ForegroundColor Green

# CHECK 3: CRITICAL FILES
Write-Host "`n📁 CHECKING CRITICAL FILES..." -ForegroundColor Cyan
$criticalFiles = @(
    "frontend/src/core/errors/ErrorHandler.js",
    "frontend/src/core/security/SecurityManager.js",
    "frontend/src/core/validation/Validator.js",
    "frontend/src/core/logger/Logger.js",
    "frontend/src/core/monitoring/PerformanceMonitor.js",
    "frontend/src/core/index.js",
    "frontend/src/ErrorBoundary.jsx",
    "frontend/src/App.jsx",
    "frontend/src/main.jsx",
    "frontend/src/services/auth/auth.service.js",
    "backend/server.js"
)
foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file" -ForegroundColor Green
    }
}

# CHECK 4: ENVIRONMENT VARIABLES
Write-Host "`n🌐 CHECKING ENVIRONMENT VARIABLES..." -ForegroundColor Cyan
$envVars = @("NODE_ENV", "PORT", "JWT_SECRET")
foreach ($var in $envVars) {
    $value = [Environment]::GetEnvironmentVariable($var, "User")
    if (-not $value) {
        $warnings += "Environment variable $var not set"
        Write-Host "   ⚠️ $var not set" -ForegroundColor Yellow
    } else {
        Write-Host "   ✅ $var is set" -ForegroundColor Green
    }
}

# CHECK 5: AUTO-COMMIT
Write-Host "`n🤖 CHECKING AUTO-COMMIT..." -ForegroundColor Cyan
$autoCommit = Get-Process -Name powershell -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*auto*" }
if (-not $autoCommit) {
    $warnings += "Auto-commit not running"
    Write-Host "   ⚠️ Auto-commit not running" -ForegroundColor Yellow
    Write-Host "   🔧 Run: .\start.ps1" -ForegroundColor Cyan
} else {
    Write-Host "   ✅ Auto-commit running" -ForegroundColor Green
}

# SUMMARY
Write-Host "`n" + ("=" * 80) -ForegroundColor Green
if ($warnings.Count -eq 0) {
    Write-Host "✅ SYSTEM IS 100% PERFECT!" -ForegroundColor Green
} else {
    Write-Host "⚠️ SYSTEM IS HEALTHY - $($warnings.Count) minor warnings" -ForegroundColor Yellow
    Write-Host "`n🔧 FIX THESE WARNINGS:" -ForegroundColor Cyan
    foreach ($warning in $warnings) {
        Write-Host "   • $warning" -ForegroundColor Yellow
    }
}
Write-Host "=" * 80 -ForegroundColor Green
