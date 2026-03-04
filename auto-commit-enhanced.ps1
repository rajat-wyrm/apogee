# auto-commit.ps1 - Enhanced with immediate commit
while ($true) {
    Start-Sleep -Seconds 10
    $status = git status --porcelain
    if ($status) {
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        git add .
        git commit -m "🤖 auto: Automated backup at $timestamp"
        git push origin main
        Write-Host "✅ Auto-commit completed at $timestamp" -ForegroundColor Green
    }
}
