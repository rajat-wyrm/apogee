# auto-commit.ps1
# Automatic commit script for Windows

$watchPath = "C:\Users\rajat\Desktop\apogee"
$lastCommit = Get-Date

Write-Host "🔍 Auto-commit monitor started for: $watchPath" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow

while ($true) {
    Start-Sleep -Seconds 30  # Check every 30 seconds
    
    Set-Location $watchPath
    
    # Check if there are changes
    $status = git status --porcelain
    if ($status) {
        $now = Get-Date
        $timeDiff = $now - $lastCommit
        
        # Commit only if last commit was more than 1 minute ago
        if ($timeDiff.TotalMinutes -ge 1) {
            $timestamp = $now.ToString("yyyy-MM-dd HH:mm:ss")
            git add .
            git commit -m "🤖 auto-commit: Automated backup at $timestamp"
            git push origin main
            Write-Host "✅ Auto-commit completed at $timestamp" -ForegroundColor Green
            $lastCommit = $now
        }
    }
}
