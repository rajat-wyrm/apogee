#!/usr/bin/env pwsh
# commit-fixed.ps1 - Reliable commit script

param(
    [Parameter(Mandatory=$true)]
    [string]$Message,
    
    [switch]$NoPush = $false
)

Write-Host "`n" + ("=" * 60) -ForegroundColor Cyan
Write-Host "📝 COMMITTING: $Message" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan

# Add all changes
git add .

# Check if there's anything to commit
$status = git status --porcelain
if (-not $status) {
    Write-Host "✅ No changes to commit" -ForegroundColor Green
    exit 0
}

# Show what's being committed
Write-Host "`n📄 Files to commit:" -ForegroundColor Yellow
git status -s

# Commit
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$fullMessage = "$Message [auto: $timestamp]"

git commit -m "$fullMessage"

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Commit successful!" -ForegroundColor Green
    
    if (-not $NoPush) {
        Write-Host "`n📤 Pushing to GitHub..." -ForegroundColor Yellow
        git push origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Push successful!" -ForegroundColor Green
        } else {
            Write-Host "❌ Push failed - trying to pull first..." -ForegroundColor Red
            git pull origin main --rebase
            git push origin main
        }
    }
} else {
    Write-Host "❌ Commit failed" -ForegroundColor Red
    exit 1
}

Write-Host "`n" + ("=" * 60) -ForegroundColor Green
