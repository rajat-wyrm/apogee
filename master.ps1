#!/usr/bin/env pwsh
# master.ps1 - Master control script with auto-commit

param(
    [Parameter(Position=0)]
    [ValidateSet('dev', 'build', 'deploy', 'verify', 'recover', 'backup', 'watch', 'status', 'help')]
    [string]$Command = 'help',
    
    [string]$Message = ""
)

function Write-Header {
    param([string]$Text)
    Write-Host "`n" + ("=" * 60) -ForegroundColor Cyan
    Write-Host "🚀 $Text" -ForegroundColor Cyan
    Write-Host ("=" * 60) -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Text)
    Write-Host "✅ $Text" -ForegroundColor Green
}

function Write-Error {
    param([string]$Text)
    Write-Host "❌ $Text" -ForegroundColor Red
}

function Write-Warning {
    param([string]$Text)
    Write-Host "⚠️ $Text" -ForegroundColor Yellow
}

function Git-Commit {
    param([string]$Message)
    
    $status = git status --porcelain
    if ($status) {
        git add .
        git commit -m "🤖 $Message"
        git push origin main
        Write-Success "Changes committed: $Message"
    }
}

function Start-Dev {
    Write-Header "DEVELOPMENT MODE"
    
    # Start frontend
    Set-Location frontend
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
    
    # Start watchdog
    Set-Location ..
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "node watchdog.js start"
    
    Write-Success "Development servers started"
    Write-Host "📡 Frontend: http://localhost:5173" -ForegroundColor Yellow
    Write-Host "👁️ Watchdog: Monitoring files" -ForegroundColor Yellow
    
    Git-Commit "start: Development environment initialized"
}

function Start-Build {
    Write-Header "BUILDING PROJECT"
    
    Set-Location frontend
    npm run build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Build completed successfully"
        Git-Commit "build: Production build created"
    } else {
        Write-Error "Build failed"
    }
}

function Start-Deploy {
    Write-Header "DEPLOYING PROJECT"
    
    Start-Build
    if ($LASTEXITCODE -eq 0) {
        Git-Commit "deploy: Preparing for deployment"
        Write-Success "Ready for deployment"
        Write-Host "📦 Deploy to: https://vercel.com" -ForegroundColor Yellow
    }
}

function Start-Verify {
    Write-Header "VERIFYING ARCHITECTURE"
    
    node architecture-verify.js
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Architecture verification passed"
        Git-Commit "verify: Architecture integrity check passed"
    } else {
        Write-Error "Architecture verification failed"
    }
}

function Start-Recover {
    Write-Header "RECOVERING SYSTEM"
    
    node recovery-system.js
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "System recovered successfully"
        Git-Commit "recover: System restored from backup"
    } else {
        Write-Error "Recovery failed"
    }
}

function Start-Backup {
    Write-Header "CREATING BACKUP"
    
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $backupDir = ".\.arch-backup\backup-$timestamp"
    
    New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
    
    # Backup critical files
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
        "backend/server.js",
        "backend/package.json"
    )
    
    foreach ($file in $criticalFiles) {
        if (Test-Path $file) {
            $destPath = Join-Path $backupDir $file
            $destDir = Split-Path $destPath -Parent
            New-Item -ItemType Directory -Force -Path $destDir | Out-Null
            Copy-Item $file $destPath -Force
            Write-Host "   📄 Backed up: $file" -ForegroundColor Gray
        }
    }
    
    Write-Success "Backup created at $backupDir"
    Git-Commit "backup: System backup created"
}

function Start-Watch {
    Write-Header "WATCHDOG MODE"
    
    # Start watchdog
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "node watchdog.js start"
    
    # Start auto-commit
    Start-Process powershell -ArgumentList "-NoExit", "-Command", ".\auto-commit.ps1"
    
    Write-Success "Watchdog and auto-commit started"
    Write-Host "👁️ Monitoring for changes every 30 seconds" -ForegroundColor Yellow
    Write-Host "📝 Auto-commit on every change" -ForegroundColor Yellow
    
    Git-Commit "watch: Started monitoring system"
}

function Show-Status {
    Write-Header "SYSTEM STATUS"
    
    # Check git status
    $gitStatus = git status --porcelain
    if ($gitStatus) {
        Write-Warning "Uncommitted changes detected:"
        git status -s
    } else {
        Write-Success "Working directory clean"
    }
    
    # Check critical files
    Write-Host "`n📁 Critical Files:" -ForegroundColor Cyan
    $criticalFiles = @(
        "frontend/src/core/errors/ErrorHandler.js",
        "frontend/src/core/security/SecurityManager.js",
        "frontend/src/core/validation/Validator.js",
        "frontend/src/core/logger/Logger.js",
        "frontend/src/core/monitoring/PerformanceMonitor.js",
        "frontend/src/core/index.js"
    )
    
    foreach ($file in $criticalFiles) {
        if (Test-Path $file) {
            $size = (Get-Item $file).Length
            Write-Host "   ✅ $file ($size bytes)" -ForegroundColor Green
        } else {
            Write-Host "   ❌ $file MISSING!" -ForegroundColor Red
        }
    }
    
    # Check running processes
    Write-Host "`n⚙️ Running Processes:" -ForegroundColor Cyan
    $nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
    if ($nodeProcesses) {
        foreach ($proc in $nodeProcesses) {
            Write-Host "   ✅ Node.js running (PID: $($proc.Id))" -ForegroundColor Green
        }
    } else {
        Write-Warning "   No Node.js processes running"
    }
    
    Git-Commit "status: System status check"
}

function Show-Help {
    Write-Header "MASTER CONTROL SCRIPT"
    Write-Host "Usage: .\master.ps1 [command] [options]" -ForegroundColor Yellow
    Write-Host "`nCommands:" -ForegroundColor Cyan
    Write-Host "  dev     - Start development servers" -ForegroundColor White
    Write-Host "  build   - Build for production" -ForegroundColor White
    Write-Host "  deploy  - Deploy to production" -ForegroundColor White
    Write-Host "  verify  - Verify architecture integrity" -ForegroundColor White
    Write-Host "  recover - Recover from backup" -ForegroundColor White
    Write-Host "  backup  - Create system backup" -ForegroundColor White
    Write-Host "  watch   - Start watchdog and auto-commit" -ForegroundColor White
    Write-Host "  status  - Show system status" -ForegroundColor White
    Write-Host "  help    - Show this help" -ForegroundColor White
    
    Write-Host "`nExamples:" -ForegroundColor Cyan
    Write-Host "  .\master.ps1 dev      # Start development" -ForegroundColor Gray
    Write-Host "  .\master.ps1 verify   # Check integrity" -ForegroundColor Gray
    Write-Host "  .\master.ps1 watch    # Start monitoring" -ForegroundColor Gray
}

# Main execution
switch ($Command) {
    'dev' { Start-Dev }
    'build' { Start-Build }
    'deploy' { Start-Deploy }
    'verify' { Start-Verify }
    'recover' { Start-Recover }
    'backup' { Start-Backup }
    'watch' { Start-Watch }
    'status' { Show-Status }
    default { Show-Help }
}

Write-Host "`n" + ("=" * 60) -ForegroundColor Cyan
Write-Host "✨ Operation complete!" -ForegroundColor Green
