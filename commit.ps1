#!/usr/bin/env pwsh
# commit.ps1 - Universal commit utility

param(
    [Parameter(Mandatory=$true)]
    [string]$Message,
    
    [string[]]$Files = @(),
    
    [switch]$NoPush = $false
)

function Write-Color {
    param(
        [string]$Text,
        [string]$Color = "White"
    )
    Write-Host $Text -ForegroundColor $Color
}

# Get current branch
$branch = git branch --show-current
if (-not $branch) {
    Write-Color "❌ Not in a git repository" -Color "Red"
    exit 1
}

# Add files
if ($Files.Count -gt 0) {
    foreach ($file in $Files) {
        if (Test-Path $file) {
            git add $file
            Write-Color "   📄 Added: $file" -Color "Gray"
        }
    }
} else {
    # Add all changes
    git add .
    Write-Color "   📄 Added all changes" -Color "Gray"
}

# Check if there's anything to commit
$status = git status --porcelain
if (-not $status) {
    Write-Color "✅ No changes to commit" -Color "Green"
    exit 0
}

# Create commit
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$fullMessage = "$Message [auto-commit at $timestamp]"

git commit -m $fullMessage

if ($LASTEXITCODE -eq 0) {
    Write-Color "✅ Committed: $fullMessage" -Color "Green"
    
    if (-not $NoPush) {
        Write-Color "📤 Pushing to GitHub..." -Color "Yellow"
        git push origin $branch
        
        if ($LASTEXITCODE -eq 0) {
            Write-Color "✅ Pushed successfully!" -Color "Green"
        } else {
            Write-Color "❌ Push failed" -Color "Red"
        }
    }
} else {
    Write-Color "❌ Commit failed" -Color "Red"
    exit 1
}
