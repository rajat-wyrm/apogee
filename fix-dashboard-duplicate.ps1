Write-Host "╔══════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║           🔧 DASHBOARD.JSX DUPLICATE IMPORT FIXER               ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

$filePath = "frontend/src/pages/Dashboard.jsx"

if (-not (Test-Path $filePath)) {
    Write-Host "❌ File not found: $filePath" -ForegroundColor Red
    exit 1
}

Write-Host "`n📁 Reading file: $filePath" -ForegroundColor Yellow
$content = Get-Content $filePath -Raw

# Create backup
$backupPath = "frontend/src/pages/Dashboard.jsx.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
Copy-Item $filePath $backupPath
Write-Host "✅ Backup created: $backupPath" -ForegroundColor Green

# Fix 1: Remove duplicate HiOutlineVideoCamera from second import
$pattern = '(import\s*{\s*[\s\S]*?}\s*from\s*"react-icons\/hi"\s*;\s*)(?:[\s\S]*?)(import\s*{\s*[\s\S]*?HiOutlineVideoCamera[\s\S]*?}\s*from\s*"react-icons\/hi")'

# More precise fix - remove HiOutlineVideoCamera from the second import
$lines = Get-Content $filePath
$inSecondImport = $false
$secondImportStart = -1
$secondImportEnd = -1

for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'import\s*{\s*HiOutlineClipboardList') {
        $inSecondImport = $true
        $secondImportStart = $i
    }
    if ($inSecondImport -and $lines[$i] -match '}\s*from\s*"react-icons\/hi"') {
        $secondImportEnd = $i
        break
    }
}

if ($secondImportStart -ne -1 -and $secondImportEnd -ne -1) {
    Write-Host "`n🔍 Found second import block from line $secondImportStart to $secondImportEnd" -ForegroundColor Yellow
    
    # Modify the second import block
    for ($i = $secondImportStart; $i -le $secondImportEnd; $i++) {
        if ($lines[$i] -match 'HiOutlineVideoCamera') {
            $lines[$i] = $lines[$i] -replace ',\s*HiOutlineVideoCamera|HiOutlineVideoCamera,\s*|HiOutlineVideoCamera', ''
            Write-Host "   Removed HiOutlineVideoCamera from line $i" -ForegroundColor Green
        }
    }
    
    # Write the modified content back
    $lines | Set-Content $filePath
    Write-Host "`n✅ Successfully removed duplicate HiOutlineVideoCamera import!" -ForegroundColor Green
} else {
    Write-Host "❌ Could not find second import block" -ForegroundColor Red
}

# Clear Vite cache
Write-Host "`n🧹 Clearing Vite cache..." -ForegroundColor Yellow
Remove-Item -Recurse -Force "frontend/node_modules/.vite" -ErrorAction SilentlyContinue
Write-Host "✅ Vite cache cleared" -ForegroundColor Green

Write-Host "`n" + ("=" * 60) -ForegroundColor Cyan
Write-Host "🎉 FIX APPLIED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "`n📋 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Stop the current server (Ctrl+C)" -ForegroundColor White
Write-Host "2. Restart the server:" -ForegroundColor White
Write-Host "   cd frontend" -ForegroundColor Yellow
Write-Host "   npm run dev" -ForegroundColor Yellow
Write-Host "3. The error will be gone! 🚀" -ForegroundColor White
